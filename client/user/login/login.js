angular.module("tcssApp").directive('login', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/user/login/login.html',
        controllerAs: 'login',
        controller: function ($scope, $reactive, $state) {
            $reactive(this).attach($scope);

            this.credentials = {
                email: '',
                password: ''
            };

            this.error = '';

            this.login = () => {
                Meteor.loginWithPassword(this.credentials.email, this.credentials.password, (err) => {
                    if (err) {
                        console.log(err);
                        this.error = err.reason;
                    }
                    else {
                        $state.go('solver');
                    }
                });
            };
        }
    }
});