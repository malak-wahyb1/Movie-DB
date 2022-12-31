const express = require('express');
const app = express();
const mongoose=require('mongoose')
const authRoute=require('./routes/auth')
const autoIncrement = require('mongoose-auto-increment')
const verify=require('./routes/verifyToken')
mongoose.set('strictQuery', false);
app.use(express.json())
const dotenv = require('dotenv');
dotenv.config();
const cookieParser=require("cookie-parser")
app.use(cookieParser())
const port = process.env.PORT || 8000;
//conection
const uri=process.env.DB_CONNECT
mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});
autoIncrement.initialize(mongoose.connection)
//schema
const schemaMovies = new mongoose.Schema({
    // _id: {
    //     type: Number,
    //     autoIncrement: true,
    //     startAt: 100
    //   },
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        default: 1900,
        match: /^\d{4}$/

    },
    rating: {
        type: Number,
        default: 4
    }

}, { versionKey: false });

const movies = mongoose.model('movies', schemaMovies);
schemaMovies.plugin(autoIncrement.plugin, "movies");
 
async function getModelLength() {
  return await movies.countDocuments();
}
app.listen(port, () =>{console.log(`listening on port ${port} clt c to get out`);});


app.get("/movies/read", async (req, res) => {
    try {
      const movie = await movies.find();
      res.json(movie);
    } catch (err) {
      console.log(err);
    }
  });
//get by date
app.get("/movies/read/by-date",async(req,res)=>{
 try {
    const by_date = await movies.find();
    by_date.sort((a, b) => b.year - a.year);
    res.send(by_date);
  } catch (err) {
    console.log(err);
  }
} )
// get by rating
app.get("/movies/read/by-rating",async(req,res)=>{
   try{
    const by_rating=await movies.find();
    by_rating.sort((a, b) => b.rating - a.rating);
    res.send(by_rating);
   }catch(err){
    console.log(err);
   }
})
//get by title
app.get("/movies/read/by-title",async (req, res) =>{ 
    try{
        const by_title=await movies.find();
        by_title.sort((a,b)=>(a.title).localeCompare(b.title))
        res.send(by_title);
    }catch(err){
        console.log(err);
    }
});
//get by id
app.get("/movies/read/:id",async (req, res) => {
    try{
        const FindBY=await movies.findById(req.params.id)
         res.send(FindBY)
       }catch(err){
         console.log(err)
       }
})
// add movies
app.post("/movies/add",async(req,res)=>{
   
  id= await getModelLength();
  try{
    movies.create({
    _id:id+2,
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
    
})}catch(err){
    console.log(err)
}
})

//delete
app.delete("/movies/delete/:id",verify,(req,res)=>{

    movies.findByIdAndDelete(req.params.id).then(deletedMovie => {
        movies.find().then(movies => {
            res.send({ status: 200, data: movies });
        })
    }).catch(err => {
        res.status(404).send({ status: 404, error: true, message: `the movie '${req.params.id}' does not exist` });
    })
})
//update
app.put("/movies/update/:id", verify,async (req, res) =>{
    title = req.body.title
    year = req.body.year
    rating = req.body.rating 
    if(title && !rating) {
        try {
          const movie = await movies.updateOne(
            { _id: req.params.id },
            { $set: { title: title } }
          );
     
          res.send(movie);
        } catch (err) {
          res.status(500).send(err);
        }}
        if(!title && rating){
          try {
            const movie = await movies.updateOne(
              { _id: req.params.id },
              { $set: { rating: rating } }
            );
            
            res.send(movie);
          } catch (err) {
            res.status(500).send(err);
          }}
          if(title && rating){
            try {
              const movie = await movies.updateMany(
                { _id: req.params.id },
                { $set: { rating: rating } },
                { $set: { title: title } }
              );
             
              res.send(movie);
            } catch (err) {
              res.status(500).json(err);
            }}

    });
    //user route middleware
    app.use('/user',authRoute)
    
    
    

