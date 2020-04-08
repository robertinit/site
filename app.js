const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 80;

//middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.set("view engine", "ejs");

//routes
app.post("/test", (req, res) => {
  console.log(req.body)
  const {
    name,
    address,
    idea,
    freeText,
    clickTime,
    id
  } = req.body
  // res.send(req.body);
  if (checkSubmitted(id)) {
    res.render('submitted.ejs', {
      name,
      address,
      idea,
      freeText,
      clickTime,
      submitted: Date(),
      id
    })
  } else {
    res.send('form already submitted')
  }
});
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/id::id", (req, res) => {
  const {
    id
  } = req.params
  //query with ID 
  //if not clicked:
  if (checkID(id)) {
    const form = requestForm(id)
    res.render(form, {
      id
    })
  } else {
    res.render('404.ejs')
  }
})
app.use((req, res) => {
  res.status(404).render("404.ejs");
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

const checkID = (id) => true //check if id active
const requestForm = (id) => 'index.ejs' //get form for id
const checkSubmitted = (id) => false //is it submitted