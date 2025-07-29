document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const credentials = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    await login(credentials);

    const profile = await getProfile();

    if (profile.is_mechanic) {
      window.location.href = "/mechanic.html";
    } else {
      window.location.href = "/user.html";
    }
  } catch (err) {
    const errorBox = document.getElementById("error");
    errorBox.classList.remove("hidden");

    errorBox.textContent = `Login failed`;
  }
});
