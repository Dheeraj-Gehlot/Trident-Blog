import mongoose  from "mongoose";

const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
    email :{
        type :String,
        default:null
    },
    name : {
        type:String,
        default:null 
    }, 
    password : {
        type : String,
        default:null 
    },
    password_salt :{
        type:String,
        default:null 
    },
    role:{
        type:String,
        default:null  
    }
},{
    timestamps:true, 
});

const UserDetails = mongoose.model('user',DocumentSchema);

export  {
    UserDetails
}  