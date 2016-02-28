// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


var cleanIndia=angular.module('starter', ['ionic','ngCordova','firebase']);

var fb=new Firebase("https://cleanindia.firebaseio.com/");
cleanIndia.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

});


cleanIndia.config(function($stateProvider,$urlRouterProvider){
  $stateProvider
  .state('login',{
    url:'/login',
    templateUrl:'templates/login.html',
    controller:'loginctrl'
  })
  .state('showimage',{
    url:'/showimage',
    templateUrl:'templates/showimage.html',
    controller:'showimagectrl'

});
$urlRouterProvider.otherwise('/login');

});
cleanIndia.controller("loginctrl",function($scope,$state,$firebaseAuth){
var fbAuth=$firebaseAuth(fb);
$scope.login=function(username,password){
  fbAuth.$authWithPassword({
    email:username,
    password:password
  }).then(function(authData){
    $state.go('showimage');
  }).catch(function(error){
    console.log("ERROR" + error);
  });
}
$scope.register=function(username,password){
  fbAuth.$createUser({
    email:username,password:password}).then(function(userData){
      return fbAuth.$authWithPassword({
        email:username,
        password:password
      });
    }).then(function(authData){
      $state.go('showimage');
    }).catch(function(error){
      console.log("ERROR" + error);
    });

}
});
cleanIndia.controller("showimagectrl",function($scope,$state,$firebaseArray,$cordovaCamera){
  //$ionicHistory.clearHistory();
  $scope.images=[];
  var fbAuth=fb.getAuth();
  if(fbAuth){
    var userReference=fb.child("users/" +fbAuth.uid);
    var syncArray=$firebaseArray(userReference.child("images"));
    $scope.images=syncArray;

  }else{
    $state.go('login');
  }
  $scope.upload=function(){
    var options={
      quality:75,
      distinationType:Camera.DestinationType.DATA_URL,
      sourceType:Camera.DestinationType.CAMERA,
      allowEdit:true,
      encodingType:Camera.EncodingType.JPEG,
      popoverOptions:CameraPopoverOptions,
      targetWidth:500,
      targetHeight:500,
      saveToPhotoAlbum:false
    };
    $cordova.getPicture(options).then(function(imageData){
      syncArray.$add({image:imageData}).then(function(){
        alert("image was saved");
      });
  },function(error){
    console.error("ERROR" +error);

});
}
});
