angular.module("tcssApp").directive('register', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/user/register/register.html',
        controllerAs: 'register',
        controller: function ($scope, $reactive, $state) {
            $reactive(this).attach($scope);

            this.credentials = {
                username:'',
                email: '',
                password: ''
            };

            this.error = '';

            this.register = () => {
                Accounts.createUser(this.credentials, (err) => {
                    if (err) {
                        this.error = err;
                        console.log(err);
                        if(err.error == 145546287){
                            console.log('transition to solver');
                            $state.go('solver');
                        }
                    }
                    else {

                    }
                });
            };
        }
    }
});