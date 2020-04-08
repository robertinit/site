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
app.use((req, res) => {
  res.render("index.ejs");
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
