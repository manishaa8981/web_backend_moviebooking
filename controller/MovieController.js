const Movie = require("../model/Movie");


const findAll= async  (req,res)=>{
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    }catch (e) {
        res.json(e)
    }
}

const save = async (req,res)=>{
    try {
        const {name,description}=req.body
        const movie=new Movie({
            name,
            description,
            image:req.file.originalname
        });
        await movie.save();
        res.status(201).json(movie)
    }catch (e) {
        res.json(e)
    }
}

const findById=async (req,res)=>{
    try{
        const movie= await Movie.findById(req.params.id);
        res.status(200).json(movie)
    }catch (e) {
        res.json(e)
    }
}

const deleteById=async (req,res)=>{
    try{
        const movie= await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json("Data Deleted.")
    }catch (e) {
        res.json(e)
    }
}

const update=async (req,res)=>{
    try{
        const movie= await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(201).json(movie)
    }catch (e) {
        res.json(e)
    }
}


module.exports={
    findAll,
    save,
    findById,
    deleteById,
    update
}