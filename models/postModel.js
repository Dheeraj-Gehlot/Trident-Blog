
import mongoose  from "mongoose";

const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
    Title :{
        type :String,
    },
    Seo_Meta_Title : {
        type:String
    },
    Heading : {
        type:String
    },
    Description : {
        type:String
    },
    Image : {
        type:String
    },
    Category : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    }, 
},{
    timestamps:true,
});

const PostDetails = mongoose.model('blog',DocumentSchema);

export  {
    PostDetails
}  
 
