import mongoose from "mongoose";
import  sampleListings  from "../init/data.js"
import Listing from "../models/listing.js";
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
main().then(()=>{
    console.log("connected DB"); 
}).catch((err)=>{
    console.log(err); 
})
async function main() {
    await mongoose.connect(MONGO_URL);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
const initDB= async()=>{
    await Listing.deleteMany({}); 
    const listingsWithOwner= sampleListings.map((obj)=>({...obj, owner:"683d2c0d9bc92c64bccba9e0"}));
    await Listing.insertMany(listingsWithOwner); 
    console.log("Data was initialized");
}
initDB(); 