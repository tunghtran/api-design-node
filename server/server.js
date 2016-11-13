var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');

app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var lions = [];
var id = 0;

// get an instance of the express Router
var router = express.Router();              

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


router.get('/', function(req, res) {
    res.json({ message: 'Welcome to our api!' });   
});

router.get('/lions', function(req, res){
  res.json(lions);
});

router.get('/lions/:id', function(req, res){
  var lion = _.find(lions, {id: req.params.id});
  res.json(lion || {});
});

router.post('/lions', function(req, res) {
  var lion = req.body;
  id++;
  lion.id = id + '';

  lions.push(lion);

  res.json(lion);
});


router.put('/lions/:id', function(req, res) {
  var update = req.body;
  if (update.id) {
    delete update.id
  }

  var lion = _.findIndex(lions, {id: req.params.id});
  if (!lions[lion]) {
    res.send();
  } else {
    var updatedLion = _.assign(lions[lion], update);
    res.json(updatedLion);
  }
});

router.delete('/lions/:id', function(req, res){
  var index = _.findIndex(lions, {id: req.params.id});
  if(index > -1){
    lions.splice(index,1);
  }
  res.json({message: 'Successfully deleted'});
});

app.use('/api', router);

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function() {
 console.log("Node app is running at localhost:" + app.get('port'))
});

