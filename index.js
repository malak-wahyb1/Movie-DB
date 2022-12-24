const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) =>{
    res.type('text/plain');
    res.send('ok');
})
app.get('/about', (req, res) =>{
    res.type('text/plain');
    res.send('Hello World about!');
});
app.use((req, res) =>{
    res.type('text/plain');
    res.statusCode(404);
    res.send('Not Found');
})
app.listen(port, () =>{console.log(`listening on port ${port} clt c to get out`);});
