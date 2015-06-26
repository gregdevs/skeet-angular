skeetApp.controller('signupCtrl', function($scope, $routeParams, $window, skeetAppFactory){

$scope.nameHolder = [];

var user = new Parse.User();
var signupSubmit = document.getElementById('signupSubmit');

$scope.submit = function(){
var userName = document.getElementById('inputUsername').value;
var userPass = document.getElementById('inputPassword').value;
var userEmail = document.getElementById('inputEmail').value;
   $scope.nameHolder.push(userName)
nameHolderMain.push(userName)

var skeetUser = {
    username:  $scope.nameHolder.toString(),
    password: userPass,
    email:userEmail
}
//signup user
    skeetAppFactory.storeUser(skeetUser).success(function(success) {
      console.log(success)
      skeetUserId.push(success.objectId)
      $('#skeetLogin').fadeOut();
      $window.location = '#/' + $scope.nameHolder + '/loggedin';
          memcachejs.set("objectid", success.objectId );
          memcachejs.set("sessionToken", success.sessionToken);
    }).error(function(error) {
      console.log(error)
    });

  }

  $scope.login = function() {
    var userName = document.getElementById('loginUsername').value;
    var userPass = document.getElementById('loginPassword').value;
    Parse.User.logIn(userName, userPass, {
      success: function(user) {
        console.log(user);
        skeetUserId.push(user.id)
        $scope.nameHolder.push(userName)

        // alert()// Hooray! Let them use the app now.
        $('#skeetLogin').fadeOut();
        $('#loginModal').modal('hide')
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $window.location = '#/' + $scope.nameHolder + '/loggedin';

        // initiate auth popup
        // return false;    // Do stuff after successful login.
      },
      error: function(user, error) {
        console.log(error)
          // The login failed. Check error to see why.
      }
    });

  }
}).controller('loggedinCtrl', function($scope, $location, $window, $routeParams, skeetAppFactory){
console.log(nameHolderMain)


function storeSoundCloudUser(){
SC.connect(function(){
      SC.get("/me", function(me){
        $scope.soundcloudName = me.username;
        $("#username").text($scope.soundcloudName);
        $("#description").val(me.description);

        var objectid = memcachejs.get("objectid");
        var sessionToken = memcachejs.get("sessionToken");
        var soundcloudUser = {
          soundcloud: $scope.soundcloudName
        }
        skeetAppFactory.storeSoundcloudUser(objectid, soundcloudUser, sessionToken).success(function(data) {
          console.log(data)
            $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', 'true');
        }).error(function(error) {
          console.log(error)
        });

      });
    });
}


//switch functions
  function soundcloudSwitchOn(state, onoff) {
    var objectid = memcachejs.get("objectid");
    var sessionToken = memcachejs.get("sessionToken");

    var soundCloudSwitch = {
      soundcloudOn: onoff
    }
    skeetAppFactory.soundcloudSwitchOn(objectid, soundCloudSwitch, sessionToken).success(function(success) {
      console.log("Switch " + success)
      $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', state);

    }).error(function(error) {
      console.log(error);
    });

  }

  function youtubeSwitchOn(state, onoff) {
    var objectid = memcachejs.get("objectid");
    var sessionToken = memcachejs.get("sessionToken");

    var youTubeSwitch = {
      youtubeOn: onoff
    }
    skeetAppFactory.youtubeSwitchOn(objectid, youTubeSwitch, sessionToken).success(function(success) {
      console.log("Switch " + success)
      $('input[name="youtube-checkbox"]').bootstrapSwitch('state', state);

    }).error(function(error) {
      console.log(error);
    });

  }


    //Switch Check: Soundcloud
     var objectid = memcachejs.get("objectid");

      skeetAppFactory.getSoundcloudUser(objectid).success(function(success) {
        console.log(success);
        var soundcloudOnOff = success.soundcloudOn;
        if (soundcloudOnOff === "on") {
          soundcloudSwitchOn(true, "on");

        } else if (soundcloudOnOff === "off") {
          soundcloudSwitchOn(false, "off");
        }
      }).error(function(error) {
        console.log(error)
      });

    //Switch Check: Youtube

        skeetAppFactory.getYoutubeUser(objectid).success(function(success) {
        console.log(success);
        var youtubeOnOff = success.youtubeOn;
        if (youtubeOnOff === "on") {
          youtubeSwitchOn(true, "on");

        } else if (youtubeOnOff === "off") {
          youtubeSwitchOn(false, "off");
        }
      }).error(function(error) {
        console.log(error)
      }); 



$(".switcher").bootstrapSwitch({
  size: 'mini',
  state: false,
  onColor: 'moduleon'
});

  $('.dropdown-menu').find('li').click(function (e) {
    e.stopPropagation();
  });

    
    $('#imgInp').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];


          skeetAppFactory.storeProfileImage(file).success(function(success){
            console.log(success)
              $('#profilePlaceholder').attr('src', success.url);
                //store file in user class

                var profileImage = {
                  profileimage: success.url
                }
                    var currentUser = Parse.User.current();
                      var objectid = currentUser.id
                skeetAppFactory.assignProfileImage(objectid, profileImage, sessionToken).success(function(success){
                  console.log(success);
                }).error(function(){

                });




          }).error(function(error){
            console.log(error)
          });
    });

//soundcloud login

$scope.scLogin = function(){
storeSoundCloudUser();
}

//youtube login

$scope.ytLogin = function() {

login();

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

}

//instagram login

  $scope.igLogin = function() {
    var url = "https://api.instagram.com/oauth/authorize/?client_id=7380072fbc2f438994b747e10485357f&redirect_uri=http://localhost:8888/skeet-angular/login.html&response_type=token&callback=retrieveToken"
    location.replace(url)
  console.log(url)

  }


  //toggle soundcloud switch
  $('input[name="soundcloud-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var objectid = memcachejs.get("objectid");
        var sessionToken = memcachejs.get("sessionToken");   
    if (state === false) {
         soundcloudSwitchOn(false, "off");

    }

    if (state === true) {

      skeetAppFactory.getSoundcloudUser(objectid).success(function(success) {
        console.log(success);
        var soundcloudName = success.soundcloud;
        if (soundcloudName === undefined) {
          storeSoundcloudUser();
        } else if (soundcloudName.length >= 1) {
          soundcloudSwitchOn(true, "on");
        }
      }).error(function(error) {
        console.log(error)
      });

      }

  });


  //toggle youtube switch
  $('input[name="youtube-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var objectid = memcachejs.get("objectid");
        var sessionToken = memcachejs.get("sessionToken");   
    if (state === false) {
         youtubeSwitchOn(false, "off");

    }

    if (state === true) {

      skeetAppFactory.getYoutubeUser(objectid).success(function(success) {
        console.log(success);
        var youtubeName = success.youtube;
        if (youtubeName === undefined) {
          storeYouTubeUser();
        } else if (youtubeName.length >= 1) {
          youtubeSwitchOn(true, "on");
        }
      }).error(function(error) {
        console.log(error)
      });

      }

  });





$scope.twLogin = function(){
    $('#twModal').modal('toggle');
}

var twitterUser = $('#twitterInput').val();

$scope.twSubmit = function(){
skeetAppFactory.storeTwitterUser(twitterUser).success(function(success){
console.log('success')
}).error(function(error){
console.log(error)
});


}


}).controller('indexCtrl', function($scope, $location){
  $scope.viewUser = function($event){
    //var nameHolder = angular.element($event.currentTarget).attr('data-user');
    //nameHolderMain.push(nameHolder);
     //$location.path(nameHolder);
  }


}).controller('homeCtrl', function(parseService, $scope, $location, $http, $routeParams){
   // get Music Items
   console.log(nameHolderMain.toString())
  var parseServiceGet = function() {

    parseService.get( {where: {username : $routeParams.nameHolder}}, function success(data) {

       //$scope.homeMusic = data;
        console.log(data.results[0])
        var soundcloudId = data.results[0].soundcloud;
         var soundcloudOn = data.results[0].soundcloudOn;
       
        var youtubeId = data.results[0].youtube;
         var youtubeOn = data.results[0].youtubeOn;
        var instagramId = data.results[0].instagram;       
        var twittername = data.results[0].twittername;       
     
        if (data.results[0].profileimage === undefined){
          $scope.profileImage = 'http://placehold.it/640x360'
        } else{
           $scope.profileImage = data.results[0].profileimage;
        }


      if (twittername === undefined) {

      } else {

        twttr.widgets.load();

        twttr.widgets.createTimeline('253171957271498752',
          document.getElementById('timeline'), {
            width: '450',
            height: '700',
            screenName: twittername
          }).then(function(el) {
          console.log("Embedded a timeline.")
        });


      }

//get music 
if (soundcloudOn === "on"){

      $http({
        method: 'GET',
        url: 'https://api.soundcloud.com/users/' + soundcloudId +'/tracks.json?client_id=07b0e9b7e4ac9e8454b61d33eaba766b'
      }).success(function(data) {
        // With the data succesfully returned, call our callback
        //console.log(data)
        $scope.homeMusic = data;


      }).error(function() {
        alert("error");
      });
    }
//get videos
if (youtubeOn === "on"){

   $http({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + youtubeId + '&key=AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84'
      }).success(function(data) {
        // With the data succesfully returned, call our callback
        var userId = data.items[0].contentDetails.relatedPlaylists.uploads
          setTimeout(function() {
            $http({
              method: 'GET',
              url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + userId  + '&key=AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84'
            }).success(function(data) {
              // With the data succesfully returned, call our callback

              console.log(data.items)
              $scope.homeVideo = data.items


              getInstagram();


            }).error(function() {
              //alert("error");
            });


          }, 20);
          
       // $scope.homeVideo = data.feed.entry;
      //getInstagram();

      }).error(function() {
        //alert("error");
      });    
      } 


var getInstagram = function(){
        $http.jsonp('https://api.instagram.com/v1/users/' + instagramId + '/media/recent?count=5&client_id=7380072fbc2f438994b747e10485357f&callback=JSON_CALLBACK').success(function(data) {
        // With the data succesfully returned, call our callback
        console.log(data)
        $scope.homeIg = data.data;
      }).error(function() {
       // alert("error");
      });    

}



      },
      function err() {
        alert('there was an error')
      });
  }
   parseServiceGet();




});







skeetApp.filter('artworkCheck', function () {

    return function (value) {
        return (!value) ? '' : value.replace('-large', '-t500x500');
    };
});
function loadCarousel(){
setTimeout(function(){
$('.rn-carousel-controls').each(function(){
  $(this).appendTo($(this).parent().parent());
})
}, 150);
}





//set up youtube
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
            //document.getElementById("profile").innerHTML = str;
                var youtubeName = resp['displayName'];
      var objectid =memcachejs.get("objectid");
      var sessionToken =memcachejs.get("sessionToken");

      var youtubeUser = {
        youtube: youtubeName
      }

    var urlBase = 'https://api.parse.com';
              
              $.ajax({
                type: 'PUT',
                url: urlBase + '/1/users/' + objectid,
                data: JSON.stringify(youtubeUser),
                headers: {
                  'X-Parse-Application-Id': 'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z',
                  'X-Parse-REST-API-Key': 'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ',
                  "Content-Type": "application/json",
                  "X-Parse-Session-Token": sessionToken
                },
                success: function(resultData) {
                        console.log(resultData)
                    $('input[name="youtube-checkbox"]').bootstrapSwitch('state', 'true');   
                }
              });

        });
 
    }  
}


function onLoadCallback()
{
    gapi.client.setApiKey('AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84');
    gapi.client.load('plus', 'v1',function(){});
}




