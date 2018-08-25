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

app.get('/', myBooks);// this route leads to books when first load the page.
app.get('/books', myBooks);
app.get('/books/:id', showBookDetails);


app.get('*', (request, response) => response.render('pages/error', {}));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// Routes for your callback functions. ++++++++++++++++
function myBooks(req, res) {
    client.query('SELECT * FROM books;')
    .then(results =>{
        // res.send(results.rows);
        res.render('index', {books: results.rows} )
    })
}

function showBookDetails(req, res) {
    let SQL =`SELECT *
    FROM books
    WHERE id = $1;`
    let values = [req.params.id];
    client.query(SQL, values)
    .then(results =>{
        // res.send(results.rows);
        console.log(req.params.id);
        // console.log(results);
        res.render('show', {books: results.rows});
    })
}