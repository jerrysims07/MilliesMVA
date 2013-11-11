var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var _ = require('lodash');


/*
 * GET /
 */

exports.index = function(req, res){
  res.render('game/index', {title: 'Millie\'s Monster Village Adventure'});
};

// POST /new

exports.create = function(req, res){
  new Game(req.body).save(function(err, game){
    res.send(game);
  });
};

exports.move = function(req, res){
  Game.findById(req.body.gameID, function(err, game){
    var move = req.body.moveLocation;
    var validMoves = [];
    var size = game.sideSize;
    playerPosition = getPosition('player', game.board);
    // create array of all possible valid spaces
    validMoves.push(playerPosition - (1     ) );
    validMoves.push(playerPosition - (size+1) );
    validMoves.push(playerPosition - (size  ) );
    validMoves.push(playerPosition - (size-1) );
    validMoves.push(playerPosition + (1     ) );
    validMoves.push(playerPosition + (size+1) );
    validMoves.push(playerPosition + (size  ) );
    validMoves.push(playerPosition + (size-1) );
console.log('validMoves b4 validation: '+validMoves);
    // check for top row & update array
    if(playerPosition<size)
    {
      validMoves[1] = null;
      validMoves[2] = null;
      validMoves[3] = null;
    }

    // check for bottom row & update array
    if(playerPosition >= size * (size-1))
    {
      validMoves[5] = null;
      validMoves[6] = null;
      validMoves[7] = null;
    }

    // check for left column & update array
    if(playerPosition%size == 0)
    {
      validMoves[0] = null;
      validMoves[1] = null;
      validMoves[7] = null;
    }

    // check for right column & update array
    if(playerPosition%size == (size-1))
    {
      validMoves[3] = null;
      validMoves[4] = null;
      validMoves[5] = null;
    }

console.log('validMoves after validation: '+validMoves);
console.log('looking for '+move +' in '+validMoves);

    // search for current move position in array of valid moves & return value
    var validity = _.find(validMoves, function(num){return num == move})

    if(validity)
    {
      if(validity)
      {
    console.log('move was valid');
        // make the move that was sent
        // the game by id
        Game.findById(game._id, function(err, secondGame){
          playerPos = getPosition('player', secondGame.board);
    console.log('playerPos: '+playerPos);
          var x = 0;
          while(secondGame.board[playerPos][x].name != 'player')
            x++;
          secondGame.board[playerPos].splice(x,1);
          if(!secondGame.board[playerPos].length)
            secondGame.board[playerPos].push({name: null, image: null});
          secondGame.board[move].push({name: 'player', image: 'images/player.jpg'});
          playerPos = move;
          if(!secondGame.board[move][0].name )
            secondGame.board[move].shift();
    console.log('before conditions');
          checkForConditions(secondGame);
    console.log('after conditions');
          res.send(secondGame);
        });
      }
      else
      {
        console.log('not a valid move');
      }
      // did you get gold?
      // did you get princess?
      // did you win?
      // process enemy moves
    }
  });
}



function checkForConditions(game)
{
  // did you win?
  checkForWin(game);

  // did you hit death?
  checkForDeath(game);

  // did you hit a ghost?
  if(hitGhost(game)) deductPoints();

  // did you collect gold?
  if(hitGold()) collectGold();

  // did you find the princess?
  if(touchPrincess) invitePrincessToJoinYou();

}

function checkForWin(game)
{
  // ifyou have all the treasures
  if(game.gold && game.princess)
  {
    if(getPosition('player', game.board) == getPosition('exit', game.board))
      game.victoryFlag = true;
  }
}

function checkForDeath(game)
{
  if(getPosition('player', game.board) == getPosition('death', game.board))
    console.log('player is dead');
}

function hitGhost(game)
{

if(getPosition('player') == getPosition('ghost'))
    console.log('player is dead');
}

function hitGhost(){}
function hitGold(){}
function touchPrincess(){}
function celebrate(){}
function showMeDeath(){}
function deductPoints(){}
function collectGold(){}
function invitePrincessToJoinYou(){}

function getPosition(piece, board)
{
  // find the player position in the array and make blank
  var i = 0;
  var j = 0;
  while(i < board.length && board[i][j].name != piece)
  {
    while(j< board[i].length && board[i][j].name != piece)
    {
      j++;
    }

    if(j==board[i].length || board[i][j].name != piece)
    {
      i++;
      j=0;
    }
  }
  if(board[i][j].name == piece)
    return i;
  else return false;
}
