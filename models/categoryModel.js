import mongoose  from "mongoose";

const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    name :{
        type :String,
    } 
},{
    timestamps:true,
});

const CategoryMoldel = mongoose.model('category',CategorySchema);

export  {
    CategoryMoldel 
}  
 
