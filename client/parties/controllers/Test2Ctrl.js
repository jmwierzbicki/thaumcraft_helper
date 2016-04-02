angular.module("tcssApp").controller("Test2Ctrl", function($scope, $stateParams, $meteor) {

    $scope.aspectList = $meteor.object(AspectList, $stateParams.listId, false);
    $scope.listId = $stateParams.listId;
    $scope.$meteorSubscribe('aspectList');
    $scope.images = $meteor.collectionFS(AspectImages, false, AspectImages).subscribe('aspectimages');


    $scope.save = function() {
        $scope.party.save().then(function(numberOfDocs){
            console.log('save success doc affected ', numberOfDocs);
        }, function(error){
            console.log('save error', error);
        });
    };

    $scope.reset = function() {
        $scope.party.reset();

    };

});

