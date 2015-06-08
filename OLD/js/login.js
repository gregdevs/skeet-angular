$(document).ready(function(){
Parse.initialize("tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z", "F1g9SlNa2FhcneKqj4AdowudvI7zkMXNZUsjtgJm");
// initialize client with app credentials
SC.initialize({
  client_id: '07b0e9b7e4ac9e8454b61d33eaba766b',
  redirect_uri: 'http://localhost:8888/skeet-angular/loginfiles/callback.html'
});
});
var user = new Parse.User();
var loginSubmit = document.getElementById('loginSubmit');

loginSubmit.addEventListener('click', function(){
var userName = document.getElementById('inputUsername').value;
var userPass= document.getElementById('inputPassword').value;
var userEmail= document.getElementById('inputEmail').value;

user.set("username", userName);
user.set("password", userPass);
user.set("email", userEmail);
 console.log(userName + userEmail)
user.signUp(null, {
  success: function(user) {
   // alert()// Hooray! Let them use the app now.
   $('#skeetLogin').fadeOut();
   
// initiate auth popup

    return false;
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});

});

  $(document).ready(function(){

$('#connectSoundCloud').click(function(){
  //check is currentUser exists
  //var username = currentUser.getUsername();
  //console.log(username)

SC.connect(function(){
      SC.get("/me", function(me){
        var soundcloudName = me.username;
        $("#username").text(soundcloudName);
         console.log(soundcloudName);
        $("#description").val(me.description);
        var currentUser = Parse.User.current();

        //save soundcloud Name to parse
        currentUser.set("soundcloud",soundcloudName );
        currentUser.save();

      });
    });
});


$('#connectIg').click(function(){
  var url = "https://api.instagram.com/oauth/authorize/?client_id=7380072fbc2f438994b747e10485357f&redirect_uri=http://localhost:8888/skeet-angular/login.html&response_type=token&callback=retrieveToken"
  location.replace(url)

//https://instagram.com/oauth/authorize/?client_id=CLIENTID&redirect_uri=http://localhost:8888/skeet-angular&response_type=token



});

var retrieveToken = setTimeout(function(){
var myVar = self.location.toString();

if(myVar === "http://localhost:8888/skeet-angular/login.html"){

}else{

console.log(myVar)
var __cdata = myVar;
var tagIndex = __cdata.indexOf('access_token'); // Find where the img tag starts
var srcIndex = __cdata.substring(tagIndex).indexOf('=') + tagIndex; // Find where the src attribute starts
var urlStart = srcIndex + 1; // Find where the actual image URL starts; 5 for the length of 'src="'
var src = __cdata.substring(urlStart); // Extract just the URL
console.log(src)

$.ajax({
  type: "get",
  url: 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + src,
  dataType: 'jsonp',
  success: function(data){
console.log(data.data[0].user.username);
alert()

var instagramName = data.data[0].user.id;
            var currentUser = Parse.User.current();

               currentUser.set("instagram", instagramName);
                currentUser.save(); 
  },
  error: function(){

  }
})



}
//alert(src)
}, 2500);

$('#loginbtn').click(function(){
  login();
});

$('#logoutbtn').click(function(){
  logout();
});

});

 
function logout()
{
    gapi.auth.signOut();
    location.reload();
}
function login() 
{

  var myParams = {
    'clientid' : '468337602361-g8r9h81rem7usdpfsbi0l0k3h4p3du51.apps.googleusercontent.com',
    'cookiepolicy' : 'single_host_origin',
    'callback' : 'loginCallback',
    'approvalprompt':'force',
    'scope' : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
  };
  gapi.auth.signIn(myParams);
}
 
function loginCallback(result)
{
    if(result['status']['signed_in'])
    {
        var request = gapi.client.plus.people.get(
        {
            'userId': 'me'
        }); 
        request.execute(function (resp)
        {
            var email = '';
            if(resp['emails'])
            {
                for(i = 0; i < resp['emails'].length; i++)
                {
                    if(resp['emails'][i]['type'] == 'account')
                    {
                        email = resp['emails'][i]['value'];
                    }
                }
            }
 
            var str = "Name:" + resp['displayName'] + "<br>";
            //str += "Image:" + resp['image']['url'] + "<br>";
            //str += "<img src='" + resp['image']['url'] + "' /><br>";
 
            str += "URL:" + resp['url'] + "<br>";
            str += "Email:" + email + "<br>";
            document.getElementById("profile").innerHTML = str;
            var youtubeName = resp['displayName'];
                var currentUser = Parse.User.current();

               currentUser.set("youtube",youtubeName );
                currentUser.save();     

        });
 
    }
         

}
function onLoadCallback()
{
    gapi.client.setApiKey('AIzaSyAkzujLtz2bL7io3FH3nNSIO63ZfdSxkWo');
    gapi.client.load('plus', 'v1',function(){});
}
