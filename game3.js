$(document).ready(function() {

//=================================================== GLOBAL VARIABLES

//Initialize Firebase
var config = {
    apiKey: "AIzaSyD56IP395cIAA9RJlVvzf4oNKpIylCcWz0",
    authDomain: "rockpaperscissors-4820d.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-4820d.firebaseio.com",
    projectId: "rockpaperscissors-4820d",
    storageBucket: "rockpaperscissors-4820d.appspot.com",
    messagingSenderId: "746769973140"
};
firebase.initializeApp(config);

var database = firebase.database();
var chatRef = database.ref('/chat');
var connectionsRef = database.ref('/connections');
var currentTurnRef = database.ref('turn');
var playersRef = database.ref('/players');
var playerRef = null;
var turn = null;
var currentPlayers = null;
var playerNumber = null;
var playerOneExists = false;
var playerTwoExists = false;
var playerOneData = null;
var playerTwoData = null;

//=================================================== DATABASE LISTENERS

//tracks changes to players and updates DOM accordingly
playersRef.on('value', function(snapshot) {

    currentPlayers = snapshot.numChildren();

    //check if players exists
    playerOneExists = snapshot.child('1').exists();
    playerTwoExists = snapshot.child('2').exists();

    //player info
    playerOneData = snapshot.child('1').val();
    playerTwoData = snapshot.child('2').val();

    //Fill in player data for player 1
    if (playerOneExists) {

        // (:empty) condition keeps box from refilling after every update to database
        if ($("#player1Score").is(':empty') && playerNumber === 1) {
            fillBox(playerOneData,'player1');
        }
        //display player data for other user (ex: Player 2 can only see Player 1 name and score)
        else {
            $("#player1Name").html("<h2>"+playerOneData.name+"</h2>");
            $("#player1Score").html("Wins: " + playerOneData.wins+" | Losses: " + playerOneData.losses);
        }

    }
    else {
        fillBox(1,'player1');
        $("#player1Selections, #player1Score").empty();
    }

    //Fill in player data for player 2
    if (playerTwoExists) {
        // (:empty) condition keeps box from refilling after every update to database
        if ($("#player2Score").is(':empty') && playerNumber === 2) {
            fillBox(playerTwoData,'player2');
        }
        else {
            $("#player2Name").html("<h2>"+playerTwoData.name+"</h2>");
            $("#player2Score").html("Wins: " + playerTwoData.wins+" | Losses: " + playerTwoData.losses);
        }
    }
    else {
        fillBox(2,'player2');
        $("#player2Selections, #player2Score").empty();
    }

});

//=================================================== KEY & CLICK EVENT LISTENERS

//listener for 'enter' on username field
$('#username').keypress(function(e){
      if(e.which == 13) {
          nameSubmitted();
          $("#username").val("");
        }
});

//listener for 'click' on username field
$("#nameSubmit").on('click', function() {
    nameSubmitted();
    $("#username").val("");
});

//listener for player 1 rock, paper, scissors selection
$("#player1").on('click','.btn', function(){

    //selection value is whatever button is pressed (rock, paper, scissors)
    var selection = $(this).attr('data-attribute');

    $("#player1 .btn").toggle();
    $("#player1Selections").append("<h2 class='playerSelection'>"+selection+"</h2>");

    var player1 = playersRef.child('1');

    //send player choice to DB
    player1.update({choice:selection});

    // gameRef.once('value', function(snapshot) {
    //     var turn = parseInt(snapshot.val().turn);
    //     if (turn === 1) {
    //         turn++;
    //         player1.update({choice:selection});
    //         gameRef.update({turn:turn});
    //     }
    // });
});

//listener for player 2 rock, paper, scissors selection
$("#player2").on('click', '.btn', function() {

    //selection value is whatever button is pressed (rock, paper, scissors)
    var selection = $(this).attr('data-attribute');

    $("#player2 .btn").toggle();
    $("#player2Selections").append("<h2 class='playerSelection'>"+selection+"</h2>");

    var player2 = playersRef.child('1');

    //send player choice to DB
    player1.update({choice:selection});


});


//=================================================== FUNCTIONS

// callback functino to submit name to database
var nameSubmitted = function () {
    username = $("#username").val().trim();
    gameStart();
};

//fills in boxes with player data (username, wins, and losses) or gives a waiting message
function fillBox (data,boxToFill) {

    if (typeof data === 'object') {
        var rock = $("<button>").text("Rock").attr({
        'data-attribute':'rock',
        'class':'btn btn-light'
        });

        var paper = $("<button>").text("Paper").attr({
        'data-attribute':'paper',
        'class':'btn btn-light'
        });

        var scissors = $("<button>").text('Scissors').attr({
        'data-attribute':'scissors',
        'class':'btn btn-light'
        });

        playerName = data.name;

        $("#" + boxToFill + "Name").html("<h2>"+playerName+"</h2>");

        $("#" + boxToFill + "Selections").append(rock);
        rock.after(paper);
        paper.after(scissors);

        $("#" + boxToFill + "Score").html("Wins: " + data.wins+" | Losses: " + data.losses);
    }
    else {
        $("#" + boxToFill +"Name").text("Waiting for Player " + data);
    }

}

//assigns player to correct index in database
function gameStart() {
    if (currentPlayers < 2) {
        if (playerOneExists) {
            playerNumber = 2;

            //if there are two players, the game can begin by setting the turn to 1
            currentTurnRef.set(1);
        }
        else {
            playerNumber = 1;
        }


    //creates a reference to THIS player in the DB based on the player number
    playerRef = database.ref('/players/' + playerNumber);

    playerRef.set({
        name:username,
        wins:0,
        losses:0,
        choice:null
    });

    //When this player closes the tab, their data will be removed from the database
    playerRef.onDisconnect().remove();
    currentTurnRef.onDisconnect().remove();

    }
    else {
        alert("Game full, please try again later");
    }
}

//Displays who won and who lost, increments wins/losses accordingly
function gameResult(player1,player2) {

    var playerOneWins = function(){
        playersRef.child('1').child('Wins').set(player1.wins + 1);
        playersRef.child('2').child('Losses').set(player2.losses + 1);
    };

    var playerTwoWins = function(){

    };

    var tie = function(){

    };

    if (player1Choice === 'Rock') {
        if (player2Choice === 'Rock') {
            tie();
        }
        if (player2Choice === 'Paper') {
            playerTwoWins();
        }
        if (player2Choice === 'Scissors') {
            playerOneWins();
        }
    }
    else if (player1Choice === 'Paper' ) {
        if (player2Choice === 'Rock') {
            playerOneWins();
        }
        if (player2Choice === 'Paper') {
            tie();
        }
        if (player2Choice === 'Scissors') {
            playerTwoWins();
        }

    }
    else if (player1Choice === 'Scissors') {
        if (player2Choice === 'Rock') {
            playerTwoWins();
        }
        if (player2Choice === 'Paper') {
            playerOneWins();
        }
        if (player2Choice === 'Scissors') {
            tie();
        }

    }
}




});
