// packages
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const Mongo = require('mongodb')
require('dotenv').config()


// need ObjectId to find record by id
const MongoClient = Mongo.MongoClient
const ObjectId = Mongo.ObjectId

//my packages
const generateUsername = require('./username-generator')

//mongo data form heroku and mlab
const mongoURI = process.env.MONGODB_URI;

//depretiation
const mongoOptions = { useNewUrlParser: true };

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

//connect
MongoClient.connect(mongoURI, mongoOptions, (err, client) => {
  if (err) return console.log(err)
  db = client.db('heroku_5dq6xsh1')
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})

// make an app
const app = express()

// use stuff
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(cors())

/* api routes */

// for highscores
app.get('/v1/scores', function(req, res){
  db.collection('scores')
  .find({})
  .limit(10)
  .sort( { score: -1 } )
  .toArray(function(err, results) {
    if (err) return console.log(err)
    // returns score table
    res.json(results)
  })
})  

// create a score
app.post('/v1/scores/new', function(req, res) {

  db.collection('users')
  .find(ObjectId(req.body.user_id))
  .limit(10)
  .toArray(function(err, result) {
    if (err) return res.json({ result: 'error'})
    if (!result.length) return res.json({ result: 'fail'})
    if (req.body.score !== parseInt(req.body.score, 10)) return res.json({ result: 'fail'})
    if ('pug|deer|koala|toast'.split('|').indexOf(req.body.game) === -1 ) return res.json({ result: 'fail'})

    const user = result[0]

    const insert = {
      user_id: user._id,
      username: user.username,
      score: req.body.score,
      game: req.body.game
    }

    db.collection('scores').insertOne(insert, (err, result) => {
      if (err) return console.log(err)

      // returns created
      res.json(result.ops[0])
    })

  })

})


app.post('/v1/users/new', function(req, res){
  //generate username
  let username = generateUsername()

  //insert to users {username: username}
  db.collection('users').insertOne({username: username}, (err, result) => {
    if (err) return console.log(err)

    // get data
    const reply = result.ops[0]

    //return reply
    res.json(reply)
  })
})
