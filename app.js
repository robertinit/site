const express = require("express");
const app = express();
const PORT = 80;
app.use((req, res) => {
  res.send("test");
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
