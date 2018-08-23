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
  var chatRef = database.ref('/game/chat');
  var turn = 0;


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
                message:"Welcome to Rock Paper Scissors"
            });
            gameRef.update({turn:0});
            turn = parseInt(snapshot.val().turn);
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

//fills in boxes for usernames wins and losses
function fillBox (data,boxToFill) {

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

    playerName = data.val().name;

    $("#" + boxToFill + "Name").html("<h2>"+playerName+"</h2>");

    $("#" + boxToFill + "Selections").append(rock);
    rock.after(paper);
    paper.after(scissors);

    $("#" + boxToFill + "Score").html("Wins: " + data.val().wins+" | Losses: " + data.val().losses);

}

//loads names and scores on refresh
gameRef.once('value', function(snapshot) {
    if (snapshot.child('player1').exists()) {
        var player1 = snapshot.child('player1');
        fillBox(player1,"player1");
    }
    if (snapshot.child('player2').exists()) {
        var player2 = snapshot.child('player2');
        fillBox(player2,"player2");
    }
});

//database FUNCTIONS
//Game
gameRef.on('value', function (snapshot){
    //there are no players in the game
    if (!snapshot.child('player1').exists()) {
        $("#player1").html("Waiting for Player 1");
    }
    else if ($("#player1").html() === "Waiting for Player 1") {
        var player1 = snapshot.child('player1');
        fillBox(player1,"player1");
    }

    //player 1 is in the game but player 2 is not
    if (!snapshot.child('player2').exists()) {
        $("#player2").html("Waiting for Player 2");
    }
    else if ($("#player2").html() === "Waiting for Player 2") {
        var player2 = snapshot.child('player2');
        fillBox(player2,"player2");
    }

    $("#player1 #player1Score").html("Wins: " + snapshot.child('player1').val().wins +
    " | Losses: " + snapshot.child('player1').val().losses);

    $("#player2 #player2Score").html("Wins: " + snapshot.child('player2').val().wins +
    " | Losses: " + snapshot.child('player2').val().losses);

//===============================================
    //if turn = 0; this is player1's turn to begin
    // if (turn === 0) {
    //
    //     // Player 1's turn
    //     if ((turn%2 === 0) || (turn === 0)) {
    //         //$().html("Hi" player1Name "You are player 1. it's your turn")
    //     }
    //     // Player 2's turn
    //     else if (turn%2 != 0) {
    //         //$().html("Hi" player2Name "You are player 2. It's your turn")
    //     }
    // }
//===============================================
});


function gameResult(player1,player2) {
    gameRef.once('value',function(snapshot){

        var player1 = snapshot.val().player1;
        var player2 = snapshot.val().player2;

        var winner = 'draw';

        if (player1.choice == 'rock') {
            if (player2.choice == 'paper') {
                winner = player2.name + ' wins!';
                gameRef.child('player2').update({wins:player2.wins+1});
                gameRef.child('player1').update({losses:player1.losses+1});
            }
            if (player2.choice == 'scissors') {
                winner = player1.name + ' wins!';
                gameRef.child('player1').update({wins:player1.wins+1});
                gameRef.child('player2').update({losses:player2.losses+1});
            }
        }
        else if (player1.choice == 'paper') {
            if (player2.choice == 'rock') {
                winner = player1.name + ' wins!';
                gameRef.child('player1').update({wins:player1.wins+1});
                gameRef.child('player2').update({losses:player2.losses+1});
            }
            if (player2.choice == 'scissors') {
                winner = player2.name + ' wins!';
                gameRef.child('player2').update({wins:player2.wins+1});
                gameRef.child('player1').update({losses:player1.losses+1});
            }
        }
        else if (player1.choice == 'scissors') {
            if (player2.choice == 'rock') {
                winner = player2.name + ' wins!';
                gameRef.child('player2').update({wins:player2.wins+1});
                gameRef.child('player1').update({losses:player1.losses+1});
            }
            if (player2.choice == 'paper') {
                winner = player1.name + ' wins!';
                gameRef.child('player1').update({wins:player1.wins+1});
                gameRef.child('player2').update({losses:player2.losses+1});
            }

        }

        $("#roundResult").html(winner);
    });

    $("#player1 .btn").toggle();
    $("#player2 .btn").toggle();
    $(".playerSelection").remove();

}

$("#player1").on('click',".btn", function() {
    var selection = $(this).attr('data-attribute');
    $("#player1 .btn").toggle();
    $("#player1Selections").append("<h2 class='playerSelection'>"+selection+"</h2>");

    var player1 = gameRef.child('player1');
    player1.update({choice:selection});


});

$("#player2").on('click',".btn", function() {
    var selection = $(this).attr('data-attribute');
    $("#player2 .btn").toggle();
    $("#player2Selections").append("<h2 class='playerSelection'>"+selection+"</h2>");
    var player2 = gameRef.child('player2');
    player2.update({choice:selection});

    gameResult();
});


//chat
var chatButton = function(user,message) {
    // moment.unix();
    // time.format('LT');
    // console.log(time);

    gameRef.child('chat').push({
        name:user,
        message:message,
        time:moment()
    });
};
$("#chatSend").on('click',function() {
    var message = $("#chatMessage").val();
    chatButton("user",message);
    $("#chatMessage").val("");
});
$("#chatMessage").keypress(function(e){
    if (e.which == 13) {
        var message = $("#chatMessage").val();
        chatButton("user",message);
        $("#chatMessage").val("");

    }
});

chatRef.on('child_added',function(snapshot){
    var chats = snapshot.val();
    console.log(chats.time);
    $("#chat tbody").append("<tr><td>" + chats.name+"</td><td>" + chats.message+"</td><td>"+chats.time+"</td></tr>");
});

chatRef.on('child_removed', function(snapshot) {
    $("#chat tbody").empty();
});






var day = moment.unix(1534984460101);
day.format('LT');
// console.log(day.format('LT'));


//===================================== PROCESS




});
