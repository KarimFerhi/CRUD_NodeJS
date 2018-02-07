const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var db

MongoClient.connect("mongodb://karim:karim123@ds227858.mlab.com:27858/star-wars-quotes", (err, client) => {
  if (err) return console.log(err)
  db = client.db('star-wars-quotes') // whatever your database name is
  app.listen(3000, () => {
    console.log('listening on 3000')
  })

});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});
app.use(express.static('public'));

/*app.get('/', (req, res) => {
  var cursor = db.collection('quotes').find();
  db.collection('quotes').find().toArray(function(err, results) {
  console.log(results);
   res.render('index.ejs', {quotes: result})

  // send HTML file populated with quotes here
});
});*/

app.put('/quotes', (req, res) => {
  db.collection('quotes').findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').deleteOne({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})



