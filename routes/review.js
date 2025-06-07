import express, { Router } from "express"; 
const router = express.Router({mergeParams:true}); 
import wrapeAsync from "../utils/wrapeAsync.js";
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware.js";
import { createReview, destroyReview } from "../controllers/reviews.js";

//Reviews
//post review Route
router.post("/",isLoggedIn,  validateReview,  wrapeAsync(createReview)); 
//Delete Review Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,  wrapeAsync(destroyReview)); 
export default router; 