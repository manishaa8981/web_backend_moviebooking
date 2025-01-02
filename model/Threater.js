const mongooose=require("mongoose")


const threaterSchema=new mongooose.Schema({
    threater_name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    contact_no:{
        type:String,
        required:true
    }
})

const Threater=mongooose.model("threaters",threaterSchema);

module.exports=Threater;