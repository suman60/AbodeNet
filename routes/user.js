import express from "express";
const router = express.Router();
import wrapeAsync from "../utils/wrapeAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import { login, logout, renderLoginForm, renderSignupForm, signup } from "../controllers/users.js";

router.route("/signup")
    .get(renderSignupForm)
    .post(wrapeAsync(signup));

router.route("/login")
    .get(renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), login)

router.get("/logout", logout )
export default router; 