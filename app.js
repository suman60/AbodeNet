import 'dotenv/config'; 
import express from "express";
const app = express(); 
import mongoose from "mongoose";
import ExpressError from "./utils/ExpressError.js";
import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js"; 
import userRouter from "./routes/user.js"
import searchRouter from "./routes/search.js";
import path from "path"
import { fileURLToPath } from "url";
import methodOverride from "method-override"
import ejsMate from "ejs-mate"
import session, { Cookie } from "express-session";
import MongoStore  from 'connect-mongo';
import flash from "connect-flash"; 
import passport from "passport";
import LocalStrategy from "passport-local"; 
import User from "./models/user.js"; 
const dbUrl=process.env.ATLASDB_URL;  
main().then(()=>{
    console.log("connected DB"); 
}).catch((err)=>{
    console.log(err); 
})
async function main() {
    await mongoose.connect(dbUrl);
  }



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set("view engine", 'ejs'); 
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true})); 
app.use(express.json()); 
app.use(methodOverride("_method")); 
app.engine('ejs', ejsMate); 
app.use(express.static(path.join(__dirname, "/public"))); 

const store = MongoStore.create({
  mongoUrl: dbUrl, 
  touchAfter:24*3600, 
  crypto: { 
    secret:process.env.SECRET, 
  }, 
});
store.on("error", function(e){
  console.log("mongo session store error", e); 
});
const sessionOption = {
  store: store,
  secret: process.env.SECRET, 
  resave: false, 
  saveUninitialized:true, 
  cookie: {
    expires: Date.now()+7*24*60*60*1000, 
    maxAge:7*24*60*60*1000, 
  }, 
  httpOnly:true, 
};  






app.use(session(sessionOption)); 
app.use(flash()); 
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


app.use((req, res, next)=>{
  res.locals.success =req.flash("success"); 
  res.locals.error= req.flash("error"); 
  res.locals.currUser= req.user; 
  next(); 
})


app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter); 
app.use("/", userRouter); 
app.use("/location", searchRouter);


app.all('/{*any}', (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", {message});
//   res.status(statusCode).send(message);
});

app.listen(8080, ()=>{
    console.log("server is listing to 8080");
})
