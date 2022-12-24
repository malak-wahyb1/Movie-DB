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
// add route
app.get("/movies/create",(req,res)=>{
    res.send({status:200, message:"create a movie"})
})
// get route
app.get("/movies/read",(req,res)=>{
    res.send({status:200, data:movies})
})
//edit route
app.get("/movies/update",(req,res)=>{
    res.send({status:200, message:"update movies"})
})
//delete route
app.get("/movies/delete",(req,res)=>{
    res.send({status:200, message:"delete movies"})
})
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