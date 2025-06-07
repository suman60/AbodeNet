import express from "express";
import wrapeAsync from "../utils/wrapeAsync.js";
import { searchListings } from "../controllers/search.js";
const router = express.Router();
router.get("/", wrapeAsync(searchListings));
export default router;