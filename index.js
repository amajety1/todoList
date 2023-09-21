const express =  require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash')

const app = express();
const port = 3000;


var list_home = []
var list_work = []

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://aniketmajety:qGLJZahngauB1Khg@cluster0.fzevdyy.mongodb.net/todoListDB");

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
  name: "1st item"
});

const item2 = new Item({
  name: "2nd item"
});

const item3 = new Item({
  name: "3rd item"
});

const defaultItems = [item1, item2, item3];


const ItemHome = mongoose.model("ItemHome", itemsSchema)

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", async (req, res) => {
  try {
    const foundItems = await ItemHome.find({});
    res.render("index.ejs",{listTasks:foundItems, listTitle:"Today's List"});
} catch (err) {
    console.error("Error finding items:", err);
}
    
});



app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName })
 .then((docs)=>{
    if(docs){
      res.render("index.ejs", {listTasks: docs.items, listTitle:customListName})
  }
  else{
      const list = new List({
        name: customListName,
        items: []
      });
      list.save();
      res.redirect(`/${customListName}`)
    }
     
 })
 .catch((err)=>{
     console.log(err);
 });

})

app.post("/", (req, res) => {
  const newItemValue = req.body.inputValue;
  const listName = req.body.list;
  
  
  if(newItemValue)
  {
    let item = new Item({
      name: newItemValue
    })

    if(listName=="Today's List"){
    
    let ls = []
    ls.push(item)
    try {
      ItemHome.insertMany(ls);
      console.log("Success")
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  } else{

    List.findOne({name: listName })
 .then((docs)=>{
    if(docs){
      docs.items.push(item);
      docs.save();
      console.log("Result :",docs.items);
      res.redirect(`/${listName}`)
  }
  else{
      res.redirect(`/${listName}`)
    }
     
 })
 .catch((err)=>{
     console.log(err);
 });

  }
}
 
});

app.post("/delete", async function (req, res) {
 
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listTitle;
  console.log(listName);
  if(listName==="Today's List"){
    ItemHome.findByIdAndRemove(checkedItemId)
    .then(() => {
      console.log("Succesfully deleted checked item from the database");
      res.redirect(`/`);
    })
    .catch((err) => {
      console.log(err);
    });
  } else{
    try {
      let deleted = await List.findOneAndUpdate({name:listName},{$pull: {items: {_id: checkedItemId}}}, {new:true});
      res.redirect(`/${listName}`);
    } catch (error) {
      console.log(error.error);
      res.redirect(`/${listName}`);
    }
    
  }
 

});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
