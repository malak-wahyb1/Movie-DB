const express = require('express');
const app = express();
const mongoose=require('mongoose')
const bodyParser = require('body-parser');
const autoIncrement = require('mongoose-auto-increment')
mongoose.set('strictQuery', false);
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
//conection
const uri="mongodb+srv://malak:malakwahyb12@cluster0.7zfe3os.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});
autoIncrement.initialize(mongoose.connection)
//schema
const schemaMovies = new mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        default: 1900

    },
    rating: {
        type: Number,
        default: 4
    }

}, { versionKey: false });

const movies = mongoose.model('movies', schemaMovies);
schemaMovies.plugin(autoIncrement.plugin, "movies");



var date= new Date()
var hour=date.getHours()
var min=date.getMinutes()
var sec=date.getSeconds()
app.get('/', (req, res) =>{
    res.type('text/plain');
    res.send('ok');
})
app.get('/about', (req, res) =>{
    res.type('text/plain');
    res.send('Hello World about!');
});
// app.use((req, res) =>{
//     res.type('text/plain');
//     res.status(404);
//     res.send('Not Found');
// })
app.listen(port, () =>{console.log(`listening on port ${port} clt c to get out`);});
//url /test
app.get('/test', (req, res) =>{
    res.type('text/plain');
    res.status(200)
    res.send({status:200,message:'ok'});
})
// url/time
app.get('/time', (req, res) =>{
    res.type('text/plain');
    res.send({status:200,message:`${hour}:${min}:${sec}`})
});
//url hello id
app.get(["/hello","/hello/:id"],(req,res)=>{
    res.send({status:200, message:`Hello, ${req.params.id || "Unknwon"}`})
})
//search

app.get("/search",(req,res)=>{
    console.log(req.query.s)
    if(typeof req.query.s =="undefined" || req.query.s === "") 
    {res.send({status:500, error:true, message:"you have to provide a search"})
    }else {
        res.send( {status:200, message:"ok", data:req.query.s})
    }
})



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
  try{
    movies.create({
    _id:4,//every time change the id when you want to add a new movie.
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
})}catch(err){
    console.log(err)
}
})

//delete
app.delete("/movies/delete/:id",(req,res)=>{
    movies.findByIdAndDelete(req.params.id).then(deletedMovie => {
        movies.find().then(movies => {
            res.send({ status: 200, data: movies });
        })
    }).catch(err => {
        res.status(404).send({ status: 404, error: true, message: `the movie '${req.params.id}' does not exist` });
    })
})
//update
app.put("/movies/update/:id", async (req, res) =>{
   
    try {
        const movie = await movies.updateOne(
          { _id: req.params.id },
          { $set: { title: req.body.title ,year:req.body.year,rating:req.body.rating} }
        );
    
        res.send(movie);
      } catch (err) {
        res.status(500).send(err);
      }
    });
      
    
    
// function getValueForNextSequence(sequenceOfName){

//     return se + 1;
// }
