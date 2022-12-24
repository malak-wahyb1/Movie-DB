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
app.get('/time', (req, res) =>{
    res.type('text/plain');
    res.send({status:200,message:`${hour}:${min}:${sec}`})
});
