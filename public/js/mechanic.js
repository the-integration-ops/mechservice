document.addEventListener("DOMContentLoaded", async () => {
  const user = await getProfile();
  if (!user.is_mechanic) {
    window.location.href = "/user.html";
    return;
  }

  document.getElementById(
    "mech-name"
  ).textContent = `${user.first_name} ${user.last_name}`;

  await populateUsers();
  await loadAllServices(user.shop.id);
  await loadReminders(user.id);

  document
    .getElementById("user-select")
    .addEventListener("change", populateCars);
  document
    .getElementById("add-service-form")
    .addEventListener("submit", addService);
});

async function populateUsers() {
  const res = await api.get("/users?is_mechanic=false");
  const userSelect = document.getElementById("user-select");

  res.data.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.first_name} ${user.last_name}`;
    userSelect.appendChild(option);
  });
}

async function populateCars() {
  const userId = document.getElementById("user-select").value;
  const carSelect = document.getElementById("car-select");
  carSelect.innerHTML = '<option value="">Select Car</option>';

  if (!userId) return;
  const res = await api.get(`/users/${userId}`);
  (res.data.Cars || []).forEach((car) => {
    const option = document.createElement("option");
    option.value = car.id;
    option.textContent = `${car.type} ${car.model} (${car.year})`;
    carSelect.appendChild(option);
  });
}

async function addService(e) {
  e.preventDefault();
  const user = await getProfile();
  const message = document.getElementById("service-message");
  message.classList.add("hidden");

  const user_id = document.getElementById("user-select").value;
  const car_id = document.getElementById("car-select").value;
  const type = document.getElementById("service-type").value.trim();
  const date = document.getElementById("service-date").value.trim();

  const description = document
    .getElementById("service-description")
    .value.trim();
  const price = parseFloat(document.getElementById("service-price").value);

  if (!user_id || !car_id || !type || isNaN(price)) {
    message.textContent = "Please fill all required fields correctly.";
    message.className = "text-red-600 text-center";
    message.classList.remove("hidden");
    return;
  }
  // alert(JSON.stringify(user));
  try {
    await api.post("/services", {
      type,
      description,
      price,
      userId: user_id,
      carId: car_id,
      shopId: user.shop.id,
      date,
    });

    message.textContent = "Service added successfully!";
    message.className = "text-green-600 text-center";
    message.classList.remove("hidden");

    document.getElementById("add-service-form").reset();
    await loadAllServices();
  } catch (err) {
    console.error("Failed to add service", err);
    message.textContent =
      err?.response?.data?.message || "Error adding service.";
    message.className = "text-red-600 text-center";
    message.classList.remove("hidden");
  }
}

async function loadAllServices(shopId) {
  const res = await api.get(`/services?shopId=${shopId}`);
  const container = document.getElementById("service-list");
  container.innerHTML = "";

  res.data.reverse().forEach((service) => {
    const div = document.createElement("div");
    div.className =
      "bg-white border border-yellow-200 rounded-lg shadow p-4 hover:shadow-md transition animate-fade-in-up";

    div.innerHTML = `
  <div class="flex justify-between items-center mb-2">
    <span class="font-semibold text-yellow-700 text-lg flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 00-4-4H5m9 6v2a4 4 0 004 4h1m-5-10h.01M15 11h.01M6 11h.01M12 11h.01M12 17v1" />
      </svg>
      ${service.type}
    </span>
    <time class="text-sm text-gray-500 font-mono" datetime="${service.date}">
      ${new Date(service.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </time>
  </div>

  <p class="text-sm text-gray-700 mb-1">
    <strong>Car:</strong> 
    <span class="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold shadow-sm">
      ${service.Car.model}
    </span>
  </p>

  <p class="text-sm text-gray-700 mb-1">
    <strong>User Email:</strong> 
    <a href="mailto:${
      service.User.email
    }" class="text-blue-600 hover:underline">
      ${service.User.email}
    </a>
  </p>

  <p class="text-gray-600 italic mb-3">${
    service.description || "No description provided."
  }</p>

  <p class="text-green-700 font-bold text-lg flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2m0 16v2m8-10h-2M4 12H2m16.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l1.414-1.414M6.05 6.05L4.636 4.636" />
    </svg>
    $${Number(service.price).toFixed(2)}
  </p>
`;

    container.appendChild(div);
  });
}

async function loadReminders(shopId) {
  const dateBefore = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
  ).toISOString();

  const res = await api.get(
    `/services?shopId=${shopId}&dateBefore=${dateBefore}`
  );

  const now = new Date();
  const latest = {};

  const box = document.getElementById("reminders");
  box.innerHTML = res.data
    .map(
      (svc) => `
      <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow animate-fade-in-up">
        <h3 class="font-bold text-yellow-700 mb-1">⏰ Overdue Service</h3>
        <p class="text-sm"><strong>Car Model:</strong> ${svc.Car.model}</p>
        <p class="text-sm"><strong>Last Service:</strong> ${new Date(
          svc.date
        ).toLocaleDateString()}</p>
        <p class="text-sm"><strong>Owner Email:</strong> ${svc.User.email}</p>
        <p class="text-sm"><strong>Owner Phone Number:</strong> ${
          svc.User.phone_number
        }</p>
      </div>
    `
    )
    .join("");
}
