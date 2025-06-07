import User from "../models/user.js";


export function renderSignupForm (req, res){
    res.render("users/signup.ejs"); 
}; 

export function renderLoginForm (req, res){
    res.render("users/login.ejs"); 
}; 

export async function signup(req,res, next){
    try {
        let {username, email, password}= req.body; 
        const newUser = new User({email, username}); 
        const registeredUser= await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err); 
            }
            req.flash("success", "Welcome to Wonderlust"); 
            res.redirect("/listings");
        }); 
        
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup"); 
    }
}; 

export async function login (req, res){
    req.flash("success", "Welcome back to WonderLust."); 
    let redirectUrl= res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl); 
}; 

export function logout (req, res, next){
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    })
}; 