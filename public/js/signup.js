document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const first_name = form.firstName.value.trim();
  const last_name = form.lastName.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const is_mechanic = form.is_mechanic.checked;
  const shopName = form.shopName ? form.shopName.value.trim() : "";
  const shopLocation = form.shopLocation ? form.shopLocation.value.trim() : "";

  const payload = {
    user: {
      first_name,
      last_name,
      email,
      password,
      is_mechanic,
    },
  };

  if (is_mechanic) {
    payload.shop = {
      name: shopName,
      location: shopLocation,
    };
  }

  try {
    await window.api.post("/auth/signup", payload);
    window.location.href = "/login.html";
  } catch (err) {
    const errorBox = document.getElementById("error");
    errorBox.classList.remove("hidden");
    errorBox.textContent = `Signup failed: ${
      err.response?.data?.message || err.message || "Unknown error"
    }`;
  }
});
