angular.module("tcssApp").run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === 'AUTH_REQUIRED') {
      $state.go('solver');
    }
  });
});

angular.module("tcssApp").config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
      .state('solver', {
          url: '/',
          templateUrl: 'client/helper/views/solver.html',
          controller: 'SolverCtrl'
      })
    .state('editor-list', {
          url: '/editor-list',
      templateUrl: 'client/helper/views/bundle-list.html',
      controller: 'BundleListCtrl'
    })
    .state('editor', {
      url: '/editor/:listId',
      templateUrl: 'client/helper/views/aspect-list-editor.html',
      controller: 'EditorCtrl',
      resolve: {
        "currentUser": function ($meteor) {
          //return $meteor.requireUser();
        }
      }
    })
      .state('help', {
          url: '/help',
          templateUrl: 'client/helper/views/help.html',
          controller: 'HelpCtrl'
      })
      .state('login', {
          url: '/login',
          template: '<login  flex="100"></login>',
          resolve:{
              currentUser: ($q, $state) => {
                  if (LoginState.signedUp()) {
                      return $q.reject('AUTH_REQUIRED');
                  }
                  else {
                      return $q.resolve();
                  }
              }
          },
          controllerAs: 'lc'
      })
      .state('register',{
          url: '/register',
          template: '<register  flex="100"></register>',
          resolve:{
              currentUser: ($q, $state) => {
                  if (LoginState.signedUp()) {
                      return $q.reject('AUTH_REQUIRED');
                  }
                  else {
                      return $q.resolve();
                  }
              }
          },
          controllerAs: 'rc'
      })
      .state('profile', {
          url: '/profile',
          template: '<profile  flex="100"></profile>',
          resolve:{
              currentUser: ($q, $state) => {
                  if (!LoginState.signedUp()) {
                      return $q.reject('AUTH_REQUIRED');
                  }
                  else {
                      return $q.resolve();
                  }
              }
          },
          controllerAs: 'rpc'
      })
      .state('logout', {
          url: '/logout',
          resolve: {
              currentUser: ($q, $state, $meteor) => {
                  if (!LoginState.signedUp()) {
                      console.log('blocking logout?')
                      return $q.reject('AUTH_REQUIRED');
                  }
                  else {

                      return $meteor.logout().then(function(){
                          console.log('logging out');
                          setTimeout( ()=>{
                              $state.transitionTo('solver',  { reload: true, inherit: false, notify: true });

                          },100);

                          //
                          //$state.go("editor-list").then(function(){
                          //    $state.go("help")
                          //});

                      }, function(err){
                          console.log('logout error - ', err);
                      });


                  }
              }

          }
      });



  $urlRouterProvider.otherwise("/");
});