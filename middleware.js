import Listing from "./models/listing.js";
import Review from "./models/review.js";
import schemas from "./schema.js";
const { listingSchema, reviewSchema} = schemas;
import ExpressError from "./utils/ExpressError.js";
export  function isLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        //redirect URL
        req.session.redirectUrl= req.originalUrl; 

        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login"); 
    }
    next(); 
}
export function saveRedirectUrl(req, res, next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl; 
    }
    next();
}
export async function isOwner(req, res, next){
    let {id}= req.params; 
    let listing = await Listing.findById(id); 
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing"); 
        return res.redirect(`/listings/${id}`); 
    }
    next(); 
}

export function validateListing(req, res, next){
    const { error } = listingSchema.validate(req.body);
    // console.log("suman");  
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg );
    } else {
        next();
    }
};
export function validateReview(req, res, next){
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg );
    } else {
        next();
    }
};

export async function isReviewAuthor(req, res, next){
    let {id, reviewId}= req.params; 
    let review = await Review.findById(reviewId); 
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review"); 
        return res.redirect(`/listings/${id}`); 
    }
    next(); 
}