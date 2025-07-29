axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

window.api = api;
