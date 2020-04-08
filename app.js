const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 80;

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.post("/test", (req, res) => {
  res.send(req.body);
});
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.use((req, res) => {
  res.status(404).render("404.ejs");
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
