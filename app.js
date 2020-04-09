const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {
  // createToken,
  isActive,
  getFormName,
  // getFormList,
  saveResponse,
  getFormID
} = require('./soap')
const PORT = process.env.PORT;
const APIKey = process.env.APIKEY
//middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.set("view engine", "ejs");

//routes
app.post("/submit", (req, res) => {
  const {
    id,
    formID
  } = req.body
  delete req.body.id
  delete req.body.formID
  data = JSON.stringify(req.body)
  console.log(data)
  saveResponse(APIKey, formID, id, `${data}`).then(e => {
    console.log(e)
    if (e == 'true') {
      res.render('thanks.ejs')
    } else {
      res.render('invalid.ejs')
    }
  }).catch(err => {
    res.render('something went wrong.ejs')
    console.log(err)
  })
});
app.get("/id::id", (req, res) => {
  const {
    id
  } = req.params
  isActive(APIKey, id).then(answer => {
    if (answer == 'true') {
      getFormID(APIKey, id).then(form => {
        getFormName(APIKey, form).then(ejs => {
          res.render(`${ejs}.ejs`, {
            id
          })
        })
      })
    } else {
      console.log(answer)
      res.render('404.ejs')
    }
  })
})
app.use((req, res) => {
  res.status(404).render("404.ejs");
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));