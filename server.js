//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    eps     = require('ejs'),
    morgan  = require('morgan');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  var hostname = process.env.HOSTNAME || 'localhost';
  res.render('index.html', { env: process.env, title: hostname});
});

app.get('/env/:param', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  var envParam = req.params.param;
  var value = process.env[envParam];
  console.log('env.param %s : %s', envParam, value);
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.send(value);
});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
