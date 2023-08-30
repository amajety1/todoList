import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var list_home = []
var list_work = []

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs",{listTasks:list_home});
});


app.get("/work", (req, res) => {
  res.render("work.ejs",{listTasks:list_work});
});

app.post("/submit-work", (req, res) => {
    const newItemValue = req.body.inputValue;
    if (newItemValue.length){list_work.push(newItemValue);}
    res.render("work.ejs",{listTasks:list_work});
    console.log(list_work);
    
});
app.post("/submit-home", (req, res) => {
  const newItemValue = req.body.inputValue;
  if (newItemValue.length){list_home.push(newItemValue);}
  res.render("index.ejs",{listTasks:list_home});
  console.log(list_home);

  
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
