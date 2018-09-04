// Application Dependencies
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent')

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
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

// API Routes

app.get('/ping', (request, response) => { response.send('pong')});

app.get('/', (req, res) =>{ res.redirect('/books')});
app.get('/books', myBooks);
app.get('/books/:id', showBookDetails);

app.get('/addabook', addPage);
app.post('/addabook', addaBook)

app.get('/searchpage', renderSearch)
app.post('/searchmethod', searchEngine)

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
        res.render('pages/books/show', {books: results.rows});
    })
}

function addPage (req, res) {
    res.render('pages/books/add-book');
}

function addaBook (req, res) {
    let {title, author, isbn, image_url, description} = req.body;
    let SQL = 'INSERT INTO books(author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5)';
    let values = [author, title, isbn, image_url, description];
    return client.query(SQL, values)
    // .then(res.redirect('/'))
    .then(
        res.render('pages/books/add-book-confirm', {books: req.body} )
    )
    .catch(err => handleError(err, res));

}

function renderSearch (req, res) {
    res.render('pages/searches/bookSearch');
}

function searchEngine (req,res) {

}

function handleError(error, response) {
  response.render('pages/error', {error: error});
}
