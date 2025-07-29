// Global: get logged-in user profile
async function getProfile() {
  try {
    const res = await axios.get("/api/auth/me", { withCredentials: true });
    console.log("User profile:", res.data);
    return res.data;
  } catch (err) {
    window.location.href = "/login.html";
  }
}

// Global: login function
async function login({ email, password }) {
  try {
    const res = await axios.post(
      "/api/auth/login",
      { email, password },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Login failed";
  }
}

// Global: logout function
async function logout() {
  try {
    await axios.get("/api/auth/logout", {}, { withCredentials: true });
    window.location.href = "/login.html";
  } catch {
    // alert("Logout failed");
  }
}

window.login = login;
window.getProfile = getProfile;
window.logout = logout;
