require("dotenv").config();
const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const {
  createToken,
  isActive,
  getFormName,
  // getFormList,
  saveResponse,
  getFormID,
} = require("./soap");
const {
  APIKEY,
  PORT,
  STATUS,
  SECURE_PORT,
  SSL_KEY,
  SSL_CERT,
  SSL_CA,
} = process.env;

//middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.set("view engine", "ejs");

//routes
app.post("/submit", (req, res) => {
  const { id, formID } = req.body;
  delete req.body.id;
  delete req.body.formID;
  data = JSON.stringify(req.body);
  saveResponse(APIKEY, formID, id, `${data}`)
    .then((e) => {
      if (e == "true") {
        res.render("thanks.ejs");
      } else {
        res.render("invalid.ejs");
      }
    })
    .catch((err) => {
      res.render("something went wrong.ejs");
      console.log(err);
    });
});
app.get("/id::id", (req, res) => {
  const { id } = req.params;
  isActive(APIKEY, id)
    .then((answer) => {
      if (answer == "true") {
        getFormID(APIKEY, id).then((form) => {
          getFormName(APIKEY, form)
            .then((ejs) => {
              res.render(`${ejs}.ejs`, {
                id,
              });
            })
            .catch((err) => {
              res.render("something went wrong.ejs");
              console.log(err);
            });
        });
      } else {
        res.render("invalid.ejs");
      }
    })
    .catch((err) => {
      res.render("something went wrong.ejs");
      console.log(err);
    });
});
app.get("/create", (req, res) => {
  createToken(APIKEY, 1).then((result) => {
    res.render("link.ejs", { result });
  });
});
app.use((req, res) => {
  res.status(404).render("404.ejs");
});
if (STATUS == "prod") {
  https
    .createServer(
      {
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT),
        ca: fs.readFileSync(SSL_CA),
      },
      app
    )
    .listen(SECURE_PORT, () =>
      console.log(`listening on port: ${SECURE_PORT}`)
    );
} else if (STATUS == "dev") {
  app.listen(PORT, console.log(`listening on port: ${PORT}`));
}
