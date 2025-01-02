const mongoose=require("mongoose");

const locationSchema = new mongoose.Schema({
  district:{
    type:String,
    required:true,
  },
  address:{
    type:String,
    required:true,
  }
}) 

const Location = mongoose.model("locations",locationSchema);

module.export=Location;