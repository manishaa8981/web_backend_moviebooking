const Seat = require("../model/Seat");

const save = async (req , res) =>{
  try{
    const seats = await DefaultContext.find();
    res.status(200).json(seats);
  }
  catch(e){
    res.json(e)
  }
}

const deleteById = async (req , res)=>{
  try{
    const seat = await Seat.findByIdAndDelete(res.params.id)
  }catch(e){res.json(e)}
}