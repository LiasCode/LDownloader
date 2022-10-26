const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 9090;

const app = express();

app.use(express.static(path.join(__dirname, "..", "ui")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "ui", "index.html"));
});

app.listen(PORT, () => {
  console.log("server running in port " + PORT);
});
