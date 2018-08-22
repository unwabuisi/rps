$(document).ready(function() {

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



//======================== GLOBAL VARIABLES ========================

var player1 = {
    name:"",
    score:0,
    connected:false,
    connectionKey:""
};

var player2 = {
    name:"",
    score:0,
    connected:false,
    connectionKey:""
};

var turn = 0;
var session = "";



var database = firebase.database();
var connectionsRef = database.ref('/connections'); //reference to hold number of users currently connected
var connectedRef = database.ref('.info/connected'); //reference to check if user is connected to Database
var gameRef = database.ref('/game'); // reference to hold both players


//======================== FUNCTIONS ========================
function initializeGame () {

    var player1 = {
        name:"",
        score:0,
        connected:false,
        connectionKey:""
    };

    var player2 = {
        name:"",
        score:0,
        connected:false,
        connectionKey:""
    };

    var turn = 0;

    gameRef.set({
        turn:0
    });
    gameRef.child('player1').set(player1);
    gameRef.child('player2').set(player2);

}

var nameSubmitted = function () {
    var username = $("#username").val().trim();

    // if (database.ref('/game/player1').child('name').exists()) {
    //     console.log("name exists");
    // }

    // gameRef.on('value', function(snap) {
    //
    // });



    if (player1.name === "") {
        player1.name = username;
        player1.connected = true;
        gameRef.child("player1").update(player1);
        // $("#nameInput").empty();

    }
    else if ((player1.name != "") && (player2.name === ""))  {
        player2.name = username;
        player2.connected = true;
        player2.connectionKey = session;
        gameRef.child("player2").update(player2);
    }





    console.log(player1);
    console.log(player2);
};

// NEXT STEPS:
// 1. store user info for player 1 and switch to only accept and store player 2 info after
// 2. Manage connected states for player1 and player2

//FUNCTIONS: registers any keypress or click of 'START' to nameSubmitted function
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



//FUNCTION: tracks when a new user connects/disconnects to the webpage and updates "../connections" folder in DB
connectedRef.on('value', function(snapshot) {
    if (snapshot.val())
    {
        var connection = connectionsRef.push(true);
        session = connection.key;

        if (player1.connectionKey === "") {
            player1.connectionKey = session;
        }
        else if ((player1.connectionKey != "") && player2.connectionKey === "") {
            player2.connectionKey = session;
        }


        //player disconnects
        connection.onDisconnect().remove();
    }
});







//======================== MAIN PROCESS ========================

connectionsRef.once('value', function (snapshot) {
    //check if someone is connected already
    if (snapshot.numChildren() === 1) {
        initializeGame();

    }

    gameRef.once('value', function (snap) {

        //if there is a player 1 already connected, execture
        if (snap.val().player1.name != "") {
            player1 = snap.val().player1;
            // console.log(snap.val().player1.name);
            // console.log(player1);
        }


    });

});



//
// gameRef.on('child_changed', function (childSnapshot, prevChildKey) {
//     console.log(childSnapshot.val());
// });






});
