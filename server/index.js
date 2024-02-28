const express = require('express');
const body = require('body-parser');
const cors = require('cors');
const db  = require('./BasesDeDonnees/BD');
const routes = require('./Routes/Route');
require('dotenv').config();

db.connection();
const app = express();
const port = process.env.PORT || 8000;

app.use(body.urlencoded({extended:false}));
app.use(body.json());
app.use(cors());
app.use(routes);

app.listen(8000, ()=>(
    console.log(`http://localhost:${port}`)
))
