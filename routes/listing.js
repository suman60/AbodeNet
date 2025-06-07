import express, { Router } from "express";
import wrapeAsync from "../utils/wrapeAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import { createListing, destroyListing, filteredIndex, index, renderEditForm, renderNewForm, showListing, updateListing } from "../controllers/listings.js"
import multer from "multer";
import { storage } from "../cloudConfig.js";
const upload= multer({storage}); 
const router = express.Router();
router.get("/filter", wrapeAsync(filteredIndex));
router.route("/")
    .get(wrapeAsync(index))
    .post(isLoggedIn, validateListing,upload.single('listing[image]'),  wrapeAsync(createListing));

//New Route 
router.get("/new", isLoggedIn, renderNewForm);

router.route("/:id")
    .get(wrapeAsync(showListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapeAsync(updateListing))
    .delete(isLoggedIn, isOwner, wrapeAsync(destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapeAsync(renderEditForm));
 

export default router; 