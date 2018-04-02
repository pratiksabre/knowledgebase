const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://admin:admin123@localhost:27017/nodekb?authSource=admin');
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
})
//check for db errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// bring in models
let Article = require('./models/article');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware ---  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }
    else{
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
    });
  });

/*  let articles = [
    {
      id:1,
      title:'Article One',
      author:"Pratik",
      body:'This is article one'
    },
    {
      id:2,
      title:'Article Two',
      author:"Pratik",
      body:'This is article two'
    },
    {
      id:3,
      title:'Article Three',
      author:"Pratik",
      body:'This is article three'
    }
];*/

// get single article
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article:article
    });
  });
});

//add route
app.get('/articles/add', function(req, res){
  res.render('add_article', {
    title:'Add Article'
  });
});

//add submit Post route
app.post('/articles/add', function(req, res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      res.redirect('/');
    }
  });
});

// load edit form
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      article:article
    });
  });
});

// update submit Post route
app.post('/articles/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      res.redirect('/');
    }
  });
});

app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

// start server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
