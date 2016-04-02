
//console.log('app initializing');

tcssApp = angular.module('tcssApp',[
    'ui.router',
    'angular-meteor',
    'ngFileUpload',
    'ngMaterial',
    'ngMessages',
    'ngWebworker'

]).config(function($mdThemingProvider) {
    // Extend the red theme with a few different colors
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('purple');

});



tcssApp.run(function ($rootScope, $state) {

    Accounts.onLogin( ()=>{
        setTimeout( ()=>{
            if($state.current ==='solver' )$state.transitionTo('solver',  { reload: true, inherit: false, notify: true });

        },50);
    });

    $rootScope.isLogged = ()=>{
        if(!Meteor.user()) return false;
        return LoginState.signedUp();

    };
});

function onReady() {
    angular.bootstrap(document, ['tcssApp'], {
        strictDi: true
    });

    if(Meteor.user() == null ){
        AccountsAnonymous.login(
            ()=>{
                //console.log(Meteor.user());
            }
        );

    }
}

//if (Meteor.isCordova)
//  angular.element(document).on("deviceready", onReady);
// else
  angular.element(document).ready(onReady);

function getUserName(){
    try{
        user = Meteor.user();
        if(user.username)return user.username;
        if(user.emails)return user.emails[0].address;
    }
    catch(err){
        console.log('waiting or user object...')
    }

    return 'Guest';
}

