import Listing from "../models/listing.js";

const MY_ACCESS_TOKEN = process.env.MAP_TOKEN;
export async function index(req, res) {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}
export async function filteredIndex(req, res) {
    const category = req.query.category;

    const allListings = await Listing.find({category:`${category}`});
    // console.log(category);
    res.render("listings/index.ejs", { allListings });
}
export function renderNewForm(req, res) {
    res.render("listings/new.ejs")
};

export async function showListing(req, res) {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for. Does not Exist");
        return res.redirect("/listings");
    }
    // console.log(listing.geometry);
    res.render("listings/show.ejs", { listing });
};

export async function createListing(req, res, next) {
    const query = req.body.listing.location;
    const mapUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MY_ACCESS_TOKEN}`;

    const response = await fetch(mapUrl);
    const data = await response.json();
    const firstResult = data.features[0];

    const coordinateObject = firstResult.geometry;
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(req.fle); 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry=coordinateObject;
    // res.send(newListing.geometry);
    await newListing.save();
    // console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

export async function renderEditForm(req, res) {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for. Does not Exist");
        return res.redirect("/listings");
    }
    // console.log(listing);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_150");
    // console.log(originalImageUrl);
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

export async function updateListing(req, res) {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

export async function destroyListing(req, res) {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}; 