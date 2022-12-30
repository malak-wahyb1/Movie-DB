const express = require('express');
const app = express();
const mongoose=require('mongoose')
// const bodyParser = require('body-parser');
const autoIncrement = require('mongoose-auto-increment')
mongoose.set('strictQuery', false);
app.use(express.json())


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
        default: 1900

    },
    rating: {
        type: Number,
        default: 4
    }

}, { versionKey: false });

const movies = mongoose.model('movies', schemaMovies);
schemaMovies.plugin(autoIncrement.plugin, "movies");
app.listen(port, () =>{console.log(`listening on port ${port} clt c to get out`);});

//user array
const userSchema=mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const user=mongoose.model('user',userSchema);
//add
app.post('/user/add',async(req,res)=>{
const NewUser=new user({
    userName:req.body.userName,
    password:req.body.password
});
try{
    const SaveUser=await NewUser.save();
    res.send(new User)
}catch(err){
    res.send(err)
}
})
//delete
app.delete('user/delete/:id',async(req,res)=>{
    try{
        const deleteUser=await user.deleteOne({_id:req.params.id})
        res.send(deleteUser)
    }catch(err){
        res.send(err)
    }
})
//update
app.put('user/update/:id',(req,res)=>{
    const id = req.params.id;
    const update = req.body;
  
    user.findByIdAndUpdate(id, update, function(error, doc) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(doc);
      }
    });
  
})
//read
app.get('/user/read/:id',async(req,res)=>{
    try{
        const readUser=await user.findById(req.params.id)
        res.send(readUser)
    }catch(err){res.send(err)}})
//check function
function check(usernames,password){
    let acceptPassword=false
    let acceptName=false
    for(let i=0;i<user.length;i++){
    if(usernames==user[i].userName){
        if(password==user[i].password){
            acceptName=true
            acceptPassword=true
        }

    }
    return 1;
}
}




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
app.post("/movies/add",(req,res)=>{
    let username = req.body.username
    let password=req.body.password
    let checkUser=check(username,password)
    if(checkUser=1){
        console.log("Checking")
  try{
    movies.create({
    _id:1,//every time change the id when you want to add a new movie.
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
})}catch(err){
    console.log(err)
}}else{console.log("only users can add movies")}
})

//delete
app.delete("/movies/delete/:id",(req,res)=>{
    let checkUser=check(req.query.userName,req.query.password)
    if(checkUser=1){
    movies.findByIdAndDelete(req.params.id).then(deletedMovie => {
        movies.find().then(movies => {
            res.send({ status: 200, data: movies });
        })
    }).catch(err => {
        res.status(404).send({ status: 404, error: true, message: `the movie '${req.params.id}' does not exist` });
    })}else{console.log("only users can delete movies")}
})
//update
app.put("/movies/update/:id", async (req, res) =>{
    let checkUser=check(req.query.userName,req.query.password)
    if(checkUser=1){
    try {
        const movie = await movies.updateOne(
          { _id: req.params.id },
          { $set: { title: req.body.title ,year:req.body.year,rating:req.body.rating} }
        );
    
        res.send(movie);
      } catch (err) {
        res.status(500).send(err);
      }}else{console.log("only users can update movie")}
    });
      
    
    
// function getValueForNextSequence(sequenceOfName){

//     return se + 1;
// }
