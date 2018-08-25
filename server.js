// Application Dependencies
require('dotenv').config();
const express = require('express');
const pg = require('pg');

// Application Setup
const app = express();
const PORT = process.env.PORT;

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Serve static files
app.use(express.static('./public'));

// API Routes
app.get('/ping', (request, response) => { response.send('pong')});
app.get('/books', myBooks);

// Listen to PORT
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// Call back function
function myBooks(req, res) {
    client.query('SELECT * FROM books;')
    .then(results =>{
        // res.send(results.rows);
        res.render('index', {books: results.rows} )
    })
}