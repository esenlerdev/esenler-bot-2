const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const FILE = "bans.json";

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

app.post("/ban", (req, res) => {
  const { userId, reason } = req.body;

  const bans = JSON.parse(fs.readFileSync(FILE));
  bans.push({ userId, reason });

  fs.writeFileSync(FILE, JSON.stringify(bans, null, 2));

  res.json({ success: true });
});

app.get("/bans", (req, res) => {
  const bans = JSON.parse(fs.readFileSync(FILE));
  res.json(bans);
});

app.listen(3000, () => {
  console.log("API çalışıyor!");
});