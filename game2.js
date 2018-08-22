$(document).ready(function(){

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


//===================================== GLOBAL VARIABLES

  var database = firebase.database();
  var gameRef = database.ref('/game/');


//===================================== FUNCTIONS

//submits player username to database
var nameSubmitted = function () {
    var username = $("#username").val().trim();

    gameRef.once('value', function (snapshot) {

        //if player1 does not exist - add player 1
        if (!snapshot.child('player1').exists()) {
            gameRef.child('player1').update({
                name:username,
                wins:0,
                losses:0,
                choice:""
            });
        }

        //if player 2 does not exist - add player 2
        else if (!snapshot.child('player2').exists()) {
            gameRef.child('player2').update({
                name:username,
                wins:0,
                losses:0,
                choice:""
            });
            gameRef.child('chat').push({
                name:"",
                message:"Welcome to Rock, Paper, Scissors"
            });
            gameRef.update({turn:0});

        }

    });
};
$("#nameSubmit").on('click', function() {
    nameSubmitted();
    $("#username").val("");
});
$('#username').keypress(function(e){
      if(e.which == 13) {
          nameSubmitted();
          $("#username").val("");
        }
});


//database FUNCTIONS
//Game
gameRef.on('value', function (snapshot){
    var player1Name = "";
    var player2Name = "";
    var turn = parseInt(snapshot.val().turn);

    //there are no players in the game
    if (!snapshot.child('player1').exists()) {

        $("#player1").html("Waiting for Player 1");
    }

    if (!snapshot.child('player2').exists()) {
        $("#player2").html("Waiting for Player 2");
    }

    if (snapshot.child('player1').exists()) {
        var rock1 = $("<button>").text("Rock").attr({
            'data-attribute':'rock',
            'class':'btn btn-light'
        });

        var paper1 = $("<button>").text("Paper").attr({
            'data-attribute':'paper',
            'class':'btn btn-light'
        });
        var scissors1 = $("<button>").text('Scissors').attr({
            'data-attribute':'paper',
            'class':'btn btn-light'
        });


        player1Name = snapshot.child('player1').val().name;
        $("#player1").html("<h2>"+player1Name+"</h2>" +

    "Wins: " + snapshot.child('player1').val().wins+" | Losses: " + snapshot.child('player1').val().losses);

        $("#player1").after(rock1);
        rock1.after(paper1);
        paper1.after(scissors1);
    }


    if (snapshot.child('player2').exists()) {
        var rock2 = $("<button>").text("Rock").attr({
            'data-attribute':'rock',
            'class':'btn btn-light'
        });

        var paper2 = $("<button>").text("Paper").attr({
            'data-attribute':'paper',
            'class':'btn btn-light'
        });

        var scissors2 = $("<button>").text('Scissors').attr({
            'data-attribute':'paper',
            'class':'btn btn-light'
        });

        player2Name = snapshot.child('player2').val().name;
        $("#player2").html("<h2>"+player2Name+"</h2>" +

        "Wins: " + snapshot.child('player2').val().wins+" | Losses: " + snapshot.child('player2').val().losses);

        $("#player2").after(rock2);
        rock2.after(paper2);
        paper2.after(scissors2);
    }

    //if turn = 0; this is player1's turn to begin
    if (turn === 0) {

        // Player 1's turn
        if ((turn%2 === 0) || (turn === 0)) {
            //$().html("Hi" player1Name "You are player 1. it's your turn")
        }
        // Player 2's turn
        else if (turn%2 != 0) {
            //$().html("Hi" player2Name "You are player 2. It's your turn")
        }
    }


});

        //players

            //name
            //wins
            //losses
            // choice

        //turn


    //chat











//===================================== PROCESS




});
