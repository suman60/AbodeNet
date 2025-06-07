import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Review from "./review.js";
const ListingSchema = new Schema({
  title: String,
  description: String,
  image: {
   url:String, 
   filename:String, 
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId  , 
      ref:"Review", 
    }, 
  ], 
  owner:{
    type:Schema.Types.ObjectId, 
    ref:"User",
  }, 
  geometry: {
    type: {
      type: String, // 'Point'
      enum: ['Point'], // 'Point' is the only valid value
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }, 
  }, 
  category: {
    type: String,
    enum: [
      'Trending', 'Rooms  ', 'IconicCities', 'Mountains',
      'Castles', 'AmazingPool', 'Camping', 'Farms', 'Arctic'
    ],
    required: true
  }
});

ListingSchema.post("findOneAndDelete", async function(listing){
  // console.log("one to many");
  if(listing){
     await Review.deleteMany({_id: {$in:listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", ListingSchema);
export default Listing;
