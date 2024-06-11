import mongoose  from "mongoose";

const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
    email :{
        type :String,
    },
    first_name : {
        type:String
    },
    last_name: {
        type : String
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

const PostDetails = mongoose.model('tbl_post',DocumentSchema);

export  {
    PostDetails
}  