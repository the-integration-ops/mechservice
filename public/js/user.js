document.addEventListener("DOMContentLoaded", async () => {
  const user = await getProfile();
  if (user.is_mechanic) {
    window.location.href = "/mechanic.html";
    return;
  }

  document.getElementById(
    "user-name"
  ).textContent = `${user.first_name} ${user.last_name}`;
  loadCars(user.id);
  loadServices(user.id);
});

async function loadCars(userId) {
  const res = await api.get(`/users/${userId}`);
  // alert(JSON.stringify(res.data.Cars));
  const cars = res.data.Cars || [];
  const container = document.getElementById("car-list");
  container.innerHTML = "";

  cars.forEach((car) => {
    const div = document.createElement("div");
    div.className =
      "bg-white/70 backdrop-blur-md border border-blue-100 rounded-xl p-5 shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-in-out";
    div.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-blue-800 flex items-center gap-2">
          <span class="text-xl">🚗</span> ${car.type} ${car.model}
        </h3>
        <span class="text-sm text-gray-500">${car.year}</span>
      </div>
      <p>
        <span class="inline-block text-xs bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900 px-3 py-1 rounded-full font-medium shadow-sm">
          ${car.color}
        </span>
      </p>
    `;
    container.appendChild(div);
  });
}

async function loadServices(userId) {
  const res = await api.get(`/services?userId=${userId}`);
  const container = document.getElementById("services-list");
  container.innerHTML = "";

  res.data.forEach((service) => {
    const div = document.createElement("div");
    div.className =
      "border border-blue-300 bg-white/70 backdrop-blur-sm rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer";

    div.innerHTML = `
  <div class="flex justify-between items-center mb-2">
    <span class="inline-flex items-center gap-2 text-blue-800 font-semibold text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-3-3v6m7-6a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      ${service.type}
    </span>
    <time class="text-gray-500 text-sm font-mono" datetime="${service.date}">
      ${new Date(service.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </time>
  </div>
  <p class="text-gray-700 text-sm leading-relaxed italic"> <strong>Description:</strong>
    ${
      service.description
        ? service.description
        : '<span class="text-gray-400">No description provided.</span>'
    }
  </p>


  <p class="text-gray-700 text-sm leading-relaxed italic"><strong>Shop:</strong>
    ${service.Shop.name}
  </p>
  `;
    container.appendChild(div);
  });
}

document.getElementById("open-add-car").addEventListener("click", () => {
  document.getElementById("add-car-modal").classList.remove("hidden");
});

document.getElementById("close-add-car").addEventListener("click", () => {
  document.getElementById("add-car-modal").classList.add("hidden");
});

document
  .getElementById("add-car-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const messageEl = document.getElementById("add-car-message");
    messageEl.classList.add("hidden");
    messageEl.textContent = "";

    const type = event.target.type.value.trim();
    const model = event.target.model.value.trim();
    const year = parseInt(event.target.year.value, 10);
    const color = event.target.color.value.trim();

    if (!type || !model || !year || !color) {
      messageEl.textContent = "Please fill in all fields.";
      messageEl.className = "text-red-600 mt-1 text-center";
      messageEl.classList.remove("hidden");
      return;
    }

    if (year < 1900 || year > 2100) {
      messageEl.textContent =
        "Please enter a valid year between 1900 and 2100.";
      messageEl.className = "text-red-600 mt-1 text-center";
      messageEl.classList.remove("hidden");
      return;
    }

    try {
      const user = await getProfile();

      const car = await api.post("/cars", {
        type,
        model,
        year,
        color,
        userId: user.id,
      });

      await api.post("/user-cars", {
        userId: user.id,
        carId: car.data.id,
      });

      messageEl.textContent = "Car added successfully!";
      messageEl.className = "text-green-600 mt-1 text-center";
      messageEl.classList.remove("hidden");

      event.target.reset();
      document.getElementById("add-car-modal").classList.add("hidden");
      loadCars(user.id);
    } catch (error) {
      console.error("Error adding car:", error);
      messageEl.textContent =
        error?.response?.data?.message ||
        "Failed to add car. Please try again.";
      messageEl.className = "text-red-600 mt-1 text-center";
      messageEl.classList.remove("hidden");
    }
  });
