import mongoose  from "mongoose";

const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
    email :{
        type :String,
    },
    name : {
        type:String
    }, 
    password : {
        type : String
    },
    password_salt :{
        type:String
    },
    type:{
        type:String  
    }
},{
    timestemps:true, 
});

const UserDetails = mongoose.model('tbl_user',DocumentSchema);

export  {
    UserDetails
}  