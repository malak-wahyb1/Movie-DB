const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
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
//create array
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]
// // add route
// app.get("/movies/create",(req,res)=>{
//     res.send({status:200, message:"create a movie"})
// })

//edit route
app.get("/movies/update",(req,res)=>{
    res.send({status:200, message:"update movies"})
})
// //delete route
// app.get("/movies/delete",(req,res)=>{
//     res.send({status:200, message:"delete movies"})
// })
//get by date
app.get("/movies/read/by-date",(req,res)=>{
    res.send({status:200, data:movies.sort((a,b)=>
        a.year - b.year)}
        )}
    )
// get by rating
app.get("/movies/read/by-rating",(req,res)=>{
    res.send({status:200, data:movies.sort((a,b)=>b.rating-a.rating)})
})
//get by title
app.get("/movies/read/by-title", (req, res) => {
    res.send(
        {status:200,data:movies.sort((a,b)=>(a.title).localeCompare(b.title))})
   
});
//get by id
app.get(["/movies/read/id/","/movies/read/id/:ID"], (req, res) => {
  
    if(req.params.ID>0 && req.params.ID <=movies.length){
       res.send({status:200,data:movies[req.params.ID-1]})
       
    }else{
         res.status(404);
        res.send({status:404, error:true, message:`the movie ${req.params.ID} does not exist you have to provide`})
    }
})
// add movies
app.get("/movies/add",(req,res)=>{
    if(req.query.title && req.query.year && (/^[1-9]\d{3}$/).test(req.query.year)){
        movies.push({title:req.query.title,year:req.query.year, rating:(req.query.rating && Number(req.query.rating)<=10&&Number(req.query.rating)>0)?Number(req.query.rating):4})
        res.send({status:200, movies})
    }else{
        res.status(403)
     res.send({status:403, error:true, message:"you cannot create a movie without providing a title and a year"})
    }
}
)
//delete
app.get("/movies/delete/:id",(req,res)=>{
   if(req.params.id>0&& req.params.id<=movies.length){
    movies.splice(req.params.id-1, 1)
    res.send({status:200, movies})
 
   }else{
    res.send({status:200,message:`the movie ${req.params.id} does not exist`})
   }
})
//update
app.get("/movies/update/:id", (req, res) => {
    let id = Number(req.params.id) 
    if(id>=0 && id<movies.length){
        if(req.query.title){
            movies[id-1].title=req.query.title
            res.send({status:200, data:movies})}
        if(req.query.rating && Number(req.query.rating)>=0 && Number(req.query.rating)<10) {
            movies[id-1].rating = Number(req.query.rating)
            res.send({status:200, data:movies})}
        if(req.query.year && (/^[1-9]\d{3}$/).test(req.query.year)){
             movies[id].year = req.query.year
            res.send({status:200, data:movies})}
    }else {res.status(404).send({status:404, error:true, message:`the movie '${req.params.id}' does not exist`});}
});