const { required } = require("joi");
const mongooose=require("mongoose");

const audiSchema = new moongose.Schema({
  capacity:{
    type:int , 
    required:true,
  },
  seatId:{
    type:mongooose.Schema.Types.ObjectId,
    ref:"seats"
},
})

const Audi = mongoose.model("audis",audiSchema);

module.exports=Audi;