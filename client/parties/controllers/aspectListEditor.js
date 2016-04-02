angular.module("tcssApp").controller("EditorCtrl", function ($scope, $stateParams, $meteor, $mdDialog, $mdMedia, $location, $filter) {
    //$scope.list = $scope.$meteorObject(AspectList, $stateParams.listId, false);
    //  $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
    $scope.listId = $stateParams.listId;
    $scope.subscribe('AspectListById', ()=> {
        return [$stateParams.listId]
    });
    console.log();
    //  $scope.aspectList = $meteor.collection(AspectList, $stateParams.partyId);
    // $scope.images = $meteor.collectionFS(AspectImages, false, AspectImages)//.subscribe('aspectimages');
    $scope.test = ":)";
    $scope.customFullscreen = $mdMedia('sm');
    $scope.helpers({
        images: () => {
            return AspectImages.find({})
        },
        list: () => {
            return AspectList.findOne($stateParams.listId)
        },
    });

    $scope.convertToLower = (string)=>{
       // console.log(string);
       return $filter('lowercase')(string)
    };





    $scope.isOwner = ()=>{

        if (!$scope.list) {

            return false;
        }

      return $scope.list.owner === Meteor.userId();

    };

    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
                controller: function Ctrl($scope, $mdDialog, locals) {
                    $scope.locals = locals;
                    console.log(locals);
                    locals.list.aspectList = '';
                    if(locals.list.aspectObs){
                        locals.list.aspectObs.forEach( (item)=>{
                            locals.list.aspectList += item.name+','+item.Compoment1+','+item.Compoment2+','+item.imageUrl+'\n';
                        });
                    }
                    $scope.hide = function () {
                        $mdDialog.hide()
                    };
                    $scope.answer = function (answer) {
                        $mdDialog.hide(answer);
                    };
                },
                controllerAs: 'ctrl',
                templateUrl: 'client/parties/views/directives/aspect-list-editor-import.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen,
                locals: {
                    list: $scope.list,
                    parent: $scope
                }
            })
            .then(function (answer) {
                $scope.statusasda = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.statusasda = 'You cancelled the dialog.';
            });
        $scope.$watch(function () {
            return $mdMedia('sm');
        }, function (sm) {
            $scope.customFullscreen = (sm === true);
        });
    };
    // console.log($scope.aspectList);
    aspectsArrByName = [];
    $scope.testf = function () {
        console.log($scope.list);
    };
    $scope.save = function () {
        $scope.list.set('name', $scope.list.name);
        $scope.list.set('description', $scope.list.description);
        $scope.list.set('status', $scope.list.status);
        $scope.list.set('aspectObs', $scope.list.aspectObs);
        $scope.list.save((err, id)=> {
            console.log(err, id);
            Meteor.call('cleanUpFiles');
        });
    };
    $scope.reset = function () {
        Meteor.call('cleanUpFiles');
        $scope.list = AspectList.findOne($scope.listId);
    };

    $scope.isChanged = ()=>{
      return _.isEqual(AspectList.findOne($scope.listId), $scope.list);
    };

    $scope.del = function (index) {
        $scope.list.aspectObs.splice(index, 1);
        $scope.closePopup();
    };
    $scope.closePopup = function () {
        popups = $(".popup");
        popups.remove();
    };

        $scope.remove = function(ev, list) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Do you want to remove this custom list?')
                .textContent('This cannot be undone!')
                .ariaLabel('remove list')
                .targetEvent(ev)
                .ok('yes!')
                .cancel('no.');
            $mdDialog.show(confirm).then(function() {
                AspectList.remove($scope.listId);
                $location.path('/editor-list');
            }, function() {
                $scope.status = 'You decided to keep your debt.';
            });
        };


        $scope.querySearch = (query)=>{
            if(!$scope.list.aspectObs){
                $scope.list.aspectObs = [];
            }
            if(query === '' || ' '){return $scope.list.aspectObs }
            return $scope.list.aspectObs.filter(function (el) {
                return el.name.indexOf(query) > -1  ;
            });

        };
        $scope.ifExist = (query)=>{
            if (!$scope.list.aspectObs){
                return false;
            }
            return $scope.list.aspectObs.filter(function (el) {
                return el.name === query ;
            });

        };

        $scope.Compoment1 = '' ;
        $scope.Compoment2 = '';

        $scope.SetC1 = (string)=>{
            $scope.Compoment1  = string;
            console.log($scope.Compoment1);
        };
        $scope.SetC2 = (string)=>{
            $scope.Compoment2  = string;
            //console.log($scope.Compoment2);
        };

    $scope.createNewAspect = function (data) {

        if ($scope.ifExist($scope.Compoment1).length ==0 || $scope.ifExist($scope.Compoment2).length ==0) {
            confirm('one of components does not exist. Aspect will be set to PRIMAL.');
            $scope.Compoment1 = 'null';
            $scope.Compoment2 = 'null';

        }
        console.log($scope.Compoment1, ' compo1')
        console.log($scope.Compoment1, ' compo2')
        aspect = new Aspect(data.name, $scope.Compoment1, $scope.Compoment2, $scope);
        if (aspect.Compoment1 === 'null' || aspect.Compoment2 === 'null') {
            aspect.Compoment1 = 'null';
            aspect.Compoment2 = 'null';
        }
        if ($scope.list.aspectObs == null) {
            $scope.list.aspectObs = [];
            aspect.Tier = 0;
        } else {
            aspect.Tier = $scope.getNewObjTier(aspect);
        }
        $scope.list.aspectObs.push(aspect);
        //console.log(aspect.Tier);
        //$scope.save();
        console.log(aspect);
    };

    $scope.checkForParents = (aspect)=> {
        var a=false;
        var b=false;
        if(aspect.Compoment1==='null' && aspect.Compoment2 ==='null'){return true;}
        $scope.list.aspectObs.forEach(function(item){
            if (aspect.Compoment1 == item.name) {
                a = true;
            }
            if (aspect.Compoment2 == item.name) {
                b = true;
            }
        });
        return a && b;

        };


        $scope.validateList = ()=>{
            var ret;
            $scope.list.aspectObs.every( (aspect)=>{

                ret = $scope.checkForParents(aspect) != false;
                return $scope.checkForParents(aspect) != false;


            });
        return ret;
        };


$scope.getNewObjTier = function (obj) {
    $scope.list.aspectObs.forEach(function (entry) {
        aspectsArrByName[entry.name] = entry;
    });
    if (obj.Compoment1 != 'null' && obj.Compoment2 != 'null') {
        if (aspectsArrByName[obj.Compoment1] === undefined || aspectsArrByName[obj.Compoment2] === undefined) {
            alert('error occured! Aspect does not have parent!');
            return -1;
        }
    }
    if (obj.Compoment1 === 'null' || obj.Compoment2 === 'null') {
        return 0;
    }
    c1 = parseInt(aspectsArrByName[obj.Compoment1].Tier);
    c2 = parseInt(aspectsArrByName[obj.Compoment2].Tier);
    //alert(c1 +" "+ c2);
    value = 0;
    if (c1 >= 0 && c2 >= 0) {
        if (c1 >= c2) value = c1 + 1;
        if (c1 < c2) value = c2 + 1;
    }
    return value;
};
$scope.validate = function () {
    aspectsArr = [];
    //console.log($scope.list.aspectList);
    rows = $scope.list.aspectList.split("\n");
    rows.forEach(function (entry) {
        aspects = entry.split(",");
        aspect = new Aspect(aspects[0], aspects[1], aspects[2], $scope, aspects[3] );
        console.log(aspect);
        aspectsArr.push(aspect);
        aspectsArrByName[aspect.name] = aspect;
    });
    calcTier(aspectsArr);
    // console.log(aspectsArr);
    $scope.list.aspectObs = aspectsArr;
};
function calcTier(array) {
    i = 0;
    count = array.length;
    while (i < count) {
        i = assignTiers(array, i);
    }
    if (i == count) {
        $scope.list.aspectList = "";
        a = 0;
        array.forEach(function (element) {
            if (a != 0) $scope.list.aspectList += "\n";
            $scope.list.aspectList += element.name + "," + element.Compoment1 + "," + element.Compoment2 + "," + element.Tier;
            a++;
        });
    }
}
function assignTiers(array, i) {
    counter = i;
    success = array.every(function (element) {
        //
        if (element.Tier == -1) {
            if (element.Compoment1 == "null" || element.Compoment2 == "null") {
                element.Tier = 0;
                counter++;
            }
            else {
                if (aspectsArrByName[element.Compoment1] == undefined || aspectsArrByName[element.Compoment2] == undefined) {
                    console.log(element.Compoment1);
                    console.log(element.Compoment2);
                    console.log(aspectsArrByName[element.Compoment1]);
                    console.log(aspectsArrByName[element.Compoment2]);
                    if (aspectsArrByName[element.Compoment1] == undefined) {
                        alert("Error: in aspect '" + element.name + "' You used " + element.Compoment1 + " But it doesn't exist")
                    }
                    if (aspectsArrByName[element.Compoment2] == undefined) {
                        alert("Error: in aspect '" + element.name + "' You used " + element.Compoment2 + " But it doesn't exist")
                    }
                    return false;
                }
                c1 = parseInt(aspectsArrByName[element.Compoment1].Tier);
                c2 = parseInt(aspectsArrByName[element.Compoment2].Tier);
                //alert(c1 +" "+ c2);
                if (c1 >= 0 && c2 >= 0) {
                    if (c1 >= c2) element.Tier = c1 + 1;
                    if (c1 < c2) element.Tier = c2 + 1;
                    counter++;
                }
            }
            aspectsArrByName[element.name] = element;
        }
        return true;
    });
    if (success == false) {
        return 9999999999999999;
    }
    return counter;
}
})
.
directive("aspectUploader", function ($rootScope, $compile, $templateRequest) {
    return {
        // templateUrl: 'client/parties/views/directives/aspect-uploader-directive.ng.html',
        restrict: 'A',
        link: function (scope, element, attrs) {
            template = '';
            $templateRequest('client/parties/views/directives/aspect-uploader-directive.html')
                .then(function (string) {
                    template = string;
                });
            scope.addImages = function () {

                AspectImages.insert(scope.picFile, function(err, result){
                    console.log(err);
                    console.log(result);
                    scope.subscribe('aspectimages', ()=> {
                        return [result._id]
                    });
                    function timeout() {
                        if (!result.isUploaded()) {
                            setTimeout(function () {
                                console.log(result.uploadProgress());
                                // Do Something Here
                                // Then recall the parent function to
                                // create a recursive loop.
                                timeout();
                            }, 500);
                        }
                        else {
                            console.log(scope.list.aspectObs[scope.aspectIndex].imageOb = result._id);
                            scope.list.aspectObs[scope.aspectIndex].imageOb = result._id;
                            scope.list.aspectObs[scope.aspectIndex].imageUrl = result.url({brokenIsFine: true});
                        scope.closePopup();
                            scope.$apply();
                        }
                    }

                    timeout()
                });
            };
            var popup;
            element.click(function () {
                popup = template;
                popups = $(".popup");
                if (popups.length > 0) {
                    scope.closePopup();
                }
                //if it doesn't add it
                scope.selectedAspect = scope.$eval(attrs['aspectUploader']);
                scope.aspectIndex = attrs['aspectIndex'];
                // console.log(scope.selectedAspect);
                compiledElement = $compile(popup)(scope);
                scope.$apply();
                element.parent().append(compiledElement);
                //console.log(compiledElement);
                topOfTrigger = element.offset().top;
                leftOfTrigger = element.offset().left;
                rightOfTrigger = leftOfTrigger + parseInt(element.css("width")); //don't use width() as it doesn't include margins and padding
                bottomOfTrigger = topOfTrigger + parseInt(element.css("height"))
                $(compiledElement).css("top", bottomOfTrigger)
                    .css("left", rightOfTrigger);
            });
        }
    }
});
