const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const path=require("path");
const methodOverride=require("method-override");  
const ejsMate=require("ejs-mate");


app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public"))); 


const Listing = require("./models/listing.js");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/WanderLust");
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.get("/", (req, res) => {
  // res.send("Hello World!");
  res.render("listings/home");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Cozy Cottage in the Woods",
//     description:
//       "A charming and secluded cottage nestled in the heart of the woods. Perfect for a romantic getaway or a peaceful retreat.",
//     price: 150,
//     location: "The Woods",
//     country: "USA",
//   });

//   await sampleListing.save();
//   console.log("Listing saved to database");

//   res.send("Listing saved!");
// });

app.get("/listings/new",(req,res)=>{
  res.render("listings/new");
});

app.get("/listings", async (req, res) => { 
  const allListings=await Listing.find({});
  res.render("listings/index",{allListings});
 });


 app.post("/listings",async(req,res)=>{
  const {title,description,image,price,location,country}=req.body;
  const newListing=new Listing({title,description,image,price,location,country});
  await newListing.save();
  res.redirect("/listings"); 
 });


 app.get("/listings/:id",async(req,res)=>{
  const {id}=req.params;

  const listing=await Listing.findById(id); 
  res.render("listings/show",{listing});

 });


 app.get("/listings/:id/edit",async(req,res)=>{
  const {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit",{listing});
 });

  app.put("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    const {title,description,image,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title,description,image,price,location,country});
    res.redirect(`/listings`);
  });

  app.delete("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  });




  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});