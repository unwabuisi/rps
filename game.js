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
    score:0
};

var player2 = {
    name:"",
    score:0
};
var database = firebase.database();
var connectionsRef = database.ref('/connections'); //reference to hold all users currently connected
var connectedRef = database.ref('.info/connected'); //reference to check if user is connected to Database



//======================== FUNCTIONS ========================
var nameSubmitted = function () {

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
        var connectionKey = connection.key;
        connection.onDisconnect().remove();
    }
});



//======================== MAIN PROCESS ========================


















});
