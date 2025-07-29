const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/auth.middleware.js");

require("dotenv").config();

const { initializeDB } = require("./models/index.js");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/favicon.ico"));
});

app.use("/api", routes);

(async () => {
  await initializeDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
