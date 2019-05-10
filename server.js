var express = require ('express');
var app = ('express')
var app = express ();
var bodyparser = require('body-parser');
var urlencodedParser = bodyparser.urlencoded({extended: false});
var assert = require('assert')

require('dotenv').config();

var MongoClient = require('mongodb').MongoClient;

var url = process.env.DATABASE_URL;

app.set('view engine', 'ejs');


app.get('/',urlencodedParser, (req, res)=>{
  res.render('login');
});


app.post('/',urlencodedParser, (req, res)=>{
  var users = {
    email: req.body.email,
    password: req.body.password
  }

  MongoClient.connect(url, function (err, db) {
  var db = db.db('makersbnb')
  assert.equal(null, err);
  db.collection('users').insertOne(users, function() {
  assert.equal(null, err);
  db.close
  });
  });
  res.redirect('/space')
});

app.post('/createspace',urlencodedParser,(req, res)=>{
  var data = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    datesavailable: req.body.datesavailable
  }

  MongoClient.connect((url), function(err, client){
    var db = client.db('makersbnb')
    assert.equal(null, err);
    db.collection('spaces').insertOne(data, function(){
    assert.equal(null, err);
    db.close
    });
  });
  res.redirect('/space')
});


app.get('/login',(req, res)=>{
  res.render('newlogin')
});

app.post('/login',urlencodedParser,(req, res)=>{
  var array = [];
  var confirm = [];
  var message = [];
  let userLogin = {
    email: req.body.email,
    password: req.body.password
  }

  MongoClient.connect((url), function(err, client){
    var db = client.db('makersbnb')
    assert.equal(null, err)
    var userData = db.collection('users').find({});
    userData.forEach(function(doc, err){
      assert.equal(null, err);
      array.push(doc)
    }, function(){
      db.close;
      array.some(e => {
        confirm.push(e['email'] == userLogin.email && e['password'] == userLogin.password)
      })
      console.log(confirm.includes(true))
      if (confirm.includes(true)) {
        message.push('You are now logged in')
      } else {
        message.push('Incorrect login details')
      }
      console.log(message)
      res.redirect('/login')
    });
  });
});


app.get('/space', (req, res)=>{
    let array = []
    MongoClient.connect((url), function(err, client){
      var db = client.db('makersbnb')
      assert.equal(null, err)
      var userData = db.collection('spaces').find({});
      userData.forEach(function(doc, err){
        assert.equal(null, err);
        array.push(doc)
      }, function(){
        db.close;
        res.render('spaces',{payload:array})
      });
    });
});

app.get("/createspace", function (req, res) {
  res.render('accomodation')
})

app.listen(3000, function (){
  console.log("Listen on port 3000...")
});
