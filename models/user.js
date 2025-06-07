import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";
const userSchema= new Schema({
    email:{
        type:String, 
        required:true
    }
}); 
userSchema.plugin(passportLocalMongoose); 
let User = mongoose.model("User", userSchema); 
export default User ; 