// bring in required files
var mongoose = require('mongoose');
var _ = require('lodash');

// define game model
var Game = mongoose.Schema({
  sideSize: Number,
  playerName: String,
  board: [{}],
  healthScore: Number,
  characters: [{}],
  princessPosition: Number,
  goldPosition: Number,
  gold: Boolean,
  princess: Boolean,
  victoryFlag: Boolean
});

Game.pre('save', function(next){
  this.gold = false;
  this.princess = false;
  victoryFlag = false;


  var totalSpaces = this.sideSize*this.sideSize;
  var ghostCount = totalSpaces * .1;
  var image;

  // initialize positions for visible items/characters
  this.board.push([{name: 'player', image: 'images/player.jpg'}]);
  this.board.push([{name: 'home', image: 'images/home.jpg'}]);
  this.board.push([{name: 'death', image: null}]);
  this.board.push([{name: 'wormhole', image: null}]);
  for (var j=0; j<ghostCount; j++)
  {
    image = _.sample(['images/ghost.jpg','images/frank.jpg', 'images/mummy.jpg' ])
    this.board.push([{name: 'ghost', image: image}]);
  }

  var x = totalSpaces - this.board.length;
  for (var i=0; i < x; i++)
  {
    this.board.push([{name: null, image: null}]);
  }
  this.board = _.shuffle(this.board);

    // initialize position for non-visible items/characters
  var x = parseInt(Math.random(totalSpaces));
  while(this.board[x][0].name)
  {
    x = parseInt(Math.random(totalSpaces));
    this.princessPosition = x;

  }

  var y = parseInt(Math.random(totalSpaces));
  while(this.board[y][0].name)
  {
    y = parseInt(Math.random(totalSpaces));
    this.goldPosition = y;
  }
  next();
});


mongoose.model('Game', Game);