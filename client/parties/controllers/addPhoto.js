


angular.module("tcssApp").controller("AddPhotoCtrl", function ($scope, $stateParams, $meteor, $timeout) {
    $scope.images = $meteor.collectionFS(AspectImages, false, AspectImages)//.subscribe('aspectimages');

    $scope.uploadedFile = null;

    $scope.uploads = [];
    $scope.objid= "00";

    //Template.hello.files = function() {
    //    return AspectImages.find();
    //};



    var fileId;
    $scope.addImages = function (files) {

       // console.log($scope.images);
      //  console.log(AspectImages);

        $scope.images.save($scope.picFile).then(function(result){
            console.log("done");
            console.log(result[0]._id.uploadProgress());
        });








        //if (files.length > 0) {
        //    $scope.images.save(files[0]).then(function (result) {
        //        $scope.uploads.push(result[0]._id);
        //$scope.objid = result[0]._id._id;
        //$scope.result = result[0]._id;
        //        console.log($scope.result);
        //    });
        //
        //    $meteor.autorun($scope, function(computation) {
        //        var fileId, fileObj;
        //        fileId = $scope.getReactively('objid');
        //        fileObj = $scope.getReactively('result');
        //        fileObjj = AspectImages.findOne(fileId);
        //        if (fileObjj) {
        //            console.log("progress", fileObjj.uploadProgress());
        //            if (fileObjj.hasStored()) {
        //                computation.stop();
        //                return console.log("DOOONEEE");
        //            }
        //        }
        //
        //    });
        //
        //    //console.log($scope.uploadedFile.$$state);
        //    //console.log($scope.uploadedFile.$$state.value[0]._id.uploadProgress());
        //    //console.log($scope.uploadedFile.$$state.value[0]._id.uploadProgress());
        //
        //}





    };





    $scope.testf = function (obj) {

 console.log($scope.uploads[0].uploadProgress());
    };




});