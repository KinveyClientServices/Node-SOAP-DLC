/*
* node-soap-dlc
* Author: Paras Wadehra @ParasWadehra
*
* A custom Data Link Connector (DLC) written in Node.js talking to a SOAP Web Service.
*/

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var soap       = require('soap');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://website/api/)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/quotes/:symbol')
    .get(function(req, res) {
        var url = 'http://www.webservicex.net/stockquote.asmx?WSDL';
        var args = {symbol: req.params.symbol};
        soap.createClient(url, function(err, client) {
            // console.log(client.describe());

            client.StockQuote.StockQuoteSoap.GetQuote(args, function(err, result) 
            { 
                console.log(result); 
                res.send(result);
            });
        });
    });

router.route('/tempftoc/:temp')
    .get(function(req, res) {
        var url = 'http://www.w3schools.com/webservices/tempconvert.asmx?wsdl';
        var args = {Fahrenheit: req.params.temp};
        soap.createClient(url, function(err, client) {
            // console.log(client.describe());

            client.TempConvert.TempConvertSoap.FahrenheitToCelsius(args, function(err, result) 
            { 
                console.log(result); 
                res.send(result);
            });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Author: Paras Wadehra @ParasWadehra');
console.log('Magic happens on port ' + port);
