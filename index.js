var express = require('express');
var app = express();
var url = require('url');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});
app.get('/getRate', function(request, response) {
  calculateRate(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function calculateRate(request, response) {

  var requestUrl = url.parse(request.url, true);
  var weight = Number(requestUrl.query.weight);
  var type = requestUrl.query.type;

  var price = 0;
  if(type == 'one') {
    price = .798 + weight*.21;
    type = 'Large Envelope (flat)';
  }
  if(type == 'two') {
    price = 0.49 + weight*.21;
    type = 'Letter (stamped)';
  }
  if(type == 'three') {
    price = 0.46 + weight*.21;
    type = 'Letter (metered)';
  }
  if(weight < 5 && type == 'four') {
    price = 2.61;
    type = 'Parcel';
  }
  else if(weight < 9 && type == 'four') {
    price = 2.77;
    type = 'Parcel';
  }
  else if(weight >= 9 && type == 'four') {
    price = 3.32 + (.14*(weight-9));
    type = 'Parcel';
  }

  price = price.toFixed(2);

  console.log(weight);
  console.log(type);
  console.log(price);

  // Set up a JSON object of the values we want to pass along to the EJS result page
	var params = {weight: weight, type: type, price: price};

	// Render the response, using the EJS page "result.ejs" in the pages directory
	// Makes sure to pass it the parameters we need.
	response.render('pages/getRate', params);

  return weight
};
