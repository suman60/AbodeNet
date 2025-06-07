import Listing from "../models/listing.js";
export async function searchListings(req, res) {
    const country  = req.query.searchLocation;
    const allListings = await Listing.find({country});
    res.render("listings/index.ejs", { allListings });
}