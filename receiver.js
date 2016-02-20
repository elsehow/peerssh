'use strict';

// parse command line opts
var argv = require('minimist')(process.argv.slice(2))
// host uri for pubsub server
var host = require('./pubsub-host-config.js')

// takes a seed -s and a start index -i over the command line
var garagedoor = require('garage-door-opener')
// the sender is responsible for generating codes
var receiver = garagedoor.receiver(argv.s, argv.i)

// connect to socket server
var socket = require('socket.io-client')(host)
socket.on('connect', () => {
  socket.on('public-channel', (msg) => {
    if (receiver.check(msg.key))
      console.log('key ok!', msg)
    else
      console.log('key not ok!', msg)
  })
  console.log('listening for commands')
})
