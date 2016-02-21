'use strict';

var split = require('split')
// parse command line opts
var argv = require('minimist')(process.argv.slice(2))
// host uri for pubsub server
var host = require('./pubsub-host-config.js')

// takes a seed -s and a start index -i over the command line
var garagedoor = require('garage-door-opener')
// the sender is responsible for generating codes
var sender = garagedoor.sender(argv.s, argv.i)

// a client for sending messages to the listener
var client = require('request-json')
               .createClient(host)

// posts a message with our sender key
function post (cmd) {
  var payload = { 
    type: 'public-channel', // the public channel on which we're broadcasting
    key: sender.next(),     // our new key
    eval: cmd.toString()
  }
  client.post('/', payload, (err, res, body) => {
    if (err)
      console.log('ERR!', err)
    else
      console.log('posted')
  })
}

// post data whenever user presses return 
process.stdin.pipe(split()).on('data', post)
