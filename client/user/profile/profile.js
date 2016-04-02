angular.module("tcssApp").directive('profile', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/user/profile/profile.html',
        controllerAs: 'profile',
        controller: function ($scope, $reactive, $state) {
            $reactive(this).attach($scope);

            this.credentials = {
                username:  Meteor.user().username

            };

            this.error = '';
            $scope.autorun( ()=>{
                this.user = Meteor.user();
            });
            this.user = Meteor.user();

            this.addAvatar = () =>{
            console.log('test');
            console.log( $scope.picFile);
                var fsFile = new FS.File($scope.picFile);
                fsFile.metadata = {owner: Meteor.userId()};
                Avatars.insert(fsFile, function(err, result){
                    console.log(err);
                    console.log(result);
                    $scope.subscribe('avatars', ()=> {
                        return [Meteor.user()._id]
                    });
                    function timeout() {
                        if (!result.isUploaded()) {
                            setTimeout(function () {
                                console.log(result.uploadProgress());

                                timeout();
                            }, 500);
                        }
                        else {

                            //scope.list.aspectObs[scope.aspectIndex].imageOb = result._id;
                            //Meteor.user().profile.avatar = result.url({brokenIsFine: true});
                            Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": result.url({brokenIsFine: true})}});

                            $scope.$apply();
                        }
                    }

                    timeout()
                });
            };

            this.update = () => {
                var digest = Package.sha.SHA256(this.credentials.oldPassword);
                this.error = '';
                if(this.credentials.username != Meteor.user().username){
                    Meteor.call('changeUsername', digest, this.credentials.username , (err, result)=>{
                        console.log(err, result);
                        this.error += result;
                        console.log(this.error);
                        $scope.$apply();
                    });
                }
                if(this.credentials.password){

                       Accounts.changePassword(this.credentials.oldPassword, this.credentials.password, (error)=>{
                           if(!error){
                               this.error += ' Password changed';
                               $scope.$apply();
                           }

                       })

                }


            };
        }
    }
});