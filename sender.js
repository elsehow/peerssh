// parse command line opts
var argv = require('minimist')(process.argv.slice(2))
// host uri for pubsub server
var host = require('./pubsub-host-config.js')

// takes a seed -s and a start index -i over the command line
var garagedoor = require('garage-door-opener')
// the sender is responsible for generating codes
var sender = garagedoor.sender(argv.s, argv.i)
// we'll send over this key initially

// a client for sending messages to the listener
var client = require('request-json')
               .createClient(host)

// read each newline
var readline = require('readline')
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
  var payload = { 
    type: 'public-channel',
    key: sender.next(),
  }
  
  client.post('/', payload, (err, res, body) => {
    console.log('posted',body)
  })
})
