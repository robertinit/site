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
const SECURE_PORT = process.env.SECURE_PORT;
const status = process.env.STATUS;
const PORT = process.env.PORT;
const APIKey = process.env.APIKEY;
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
  saveResponse(APIKey, formID, id, `${data}`)
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
  isActive(APIKey, id)
    .then((answer) => {
      if (answer == "true") {
        getFormID(APIKey, id).then((form) => {
          getFormName(APIKey, form)
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
  createToken(APIKey, 1).then((result) => {
    res.render("link.ejs", { result });
  });
});
app.use((req, res) => {
  res.status(404).render("404.ejs");
});
if (status == "prod") {
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
} else if (status == "dev") {
  app.listen(PORT, console.log(`listening on port: ${PORT}`));
}
