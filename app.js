const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "public");

function workingHoursOnly(req, res, next) {
  const now = new Date();
  const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
  const isWorkingHour = now.getHours() >= 9 && now.getHours() < 17;

  if (isWeekday && isWorkingHour) {
    return next();
  }

  res.status(503).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>We’ll be back soon</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; box-sizing: border-box; background: #f5f2eb; color: #172a26; font: 16px/1.6 Arial, sans-serif; }
      main { max-width: 520px; padding: 48px; border-radius: 20px; background: #fff; box-shadow: 0 16px 48px #172a2614; }
      p { color: #596964; }
      .eyebrow { color: #bc6547; font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Outside our opening hours</p>
      <h1>We’ll be back soon.</h1>
      <p>Our website is available Monday to Friday, from 9:00 am to 5:00 pm. Please come back during those hours.</p>
    </main>
  </body>
</html>`);
}

app.use(workingHoursOnly);
app.use(express.static(publicDirectory));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDirectory, "index.html"));
});

app.get("/services", (req, res) => {
  res.sendFile(path.join(publicDirectory, "services.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(publicDirectory, "contact.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDirectory, "404.html"));
});

app.listen(port, () => {
  console.log(`Website listening on http://localhost:${port}`);
});
