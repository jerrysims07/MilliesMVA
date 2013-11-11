// globals to the browser side
var $message;
var size;


$(document).ready(initialize);

function initialize(){
  $(document).foundation();

  $message = $('#messageCenter');

  // click-handlers
  $('#userInput').on('submit', submitStartGame);
  $('#gameBoard').on('click','.space', clickGameBoard);
}

// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------
// click-handling functions

function submitStartGame(e)
{
  // capture size of board for global
  // package the data for submission to database
  var url = $(this).attr('action');
  var sideSize = parseInt($('input[name=numberSpaces]').val());
  size = sideSize;

  var playerName = $('input[name=name]').val();
  var verb = $(this).attr('method');


  // call "send ajax data" function
  sendGenericAjaxRequest(url, {sideSize: sideSize, playerName:playerName}, verb, null, e, function(game, status, jqXHR){
    debugger;
    // console.log('data = ' + data);
    htmlDrawGameBoard(game);
  });
}

function clickGameBoard(e)
{

  // get location of click
  $clickedSpace = $(this);
  processValidMove(e, $clickedSpace);
}

function processValidMove(e, $clicked)
{
  // package the data for submission to server
  var gameID = $('#gameBoard').attr('data-gameid');
  var moveLocation = $clicked.attr('data-id');

  // send ajax request to server and you will hear back whether it is a legal move
  sendGenericAjaxRequest('/move', {moveLocation: moveLocation, gameID: gameID }, 'POST', 'PUT', e, function(game, status, jqXHR){
    console.log('after ajax request... '+game);
    console.log(game.board);
    updateGameBoard(game);
    // updateActiveGameBoard(game);
  });
}

//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//

function sendGenericAjaxRequest(url, data, verb, altVerb, event, successFn){
  var options = {};
  options.url = url;
  options.type = verb;
  options.data = data;
  options.success = successFn;
  options.error = function(jqXHR, status, error){console.log(error);};

  if(altVerb) options.data._method = altVerb;
  $.ajax(options);
  if(event) event.preventDefault();
}

// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------
// html functions

function htmlDrawGameBoard(game)
{
console.log('in draw function');
  // assign the gameID to the gameBoard div
  $('#gameBoard').attr('data-gameid', game._id);

  // adjust user input fields to take focus off of them and change message
  $('#userInput input').val('');
  $('#userInput').addClass('quiet');
  $('#userInput label').addClass('quiet');
  $('#userInput button').addClass('quiet');
  $('#userInput button').removeClass('success radius');
  $('#messageCenter').text('Good luck, '+game.playerName);

  // draw the actual gameBoard spaces
  updateGameBoard(game);
}

function updateGameBoard(game)
{
  // debugger;
  $('#gameBoard').empty();
  var spaceCounter=0;
  var $tr= $('<tr>');
  for (var i=0; i< game.sideSize; i++)
  {
    for (var j=0; j< game.sideSize; j++)
    {
      $td = $('<td>');
      $td.addClass('space');
      $td.attr('data-id', spaceCounter);
      $td.attr('data-piece', game.board[spaceCounter][0].name);
      if(game.board[spaceCounter][0].image)
      {
        $td.css('background-image', 'url('+game.board[spaceCounter][0].image+')');
      }
      $td.addClass(game.board[spaceCounter]);
      if(game.board[spaceCounter][0].name)
        $td.text(game.board[spaceCounter][0].name);
      $tr.append($td);
      $('#gameBoard').append($tr);
      spaceCounter++;
    }
    $('#gameBoard').append($tr);
    $tr = $('<tr>');
  }
  console.log('finished updating gameboard');
}

function updateActiveGameBoard(game)
{
  $gameView = $('.space');

}

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// local logic-handlers

