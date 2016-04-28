angular.module("tcssApp").controller("SolverCtrl", function ($scope, $rootScope , $meteor, $mdToast, $location, Webworker, $mdDialog, $mdMedia) {
    $scope.helpers({
        aspectLists: () => {
            return AspectList.find({});
        },
        SubscriptionNumber: ()=> {
            return Subscribtion.find({}).count();
        }
    });
    $scope.aspect1 = new Aspect('...', 'null', 'null', $scope);
    $scope.aspect2 = new Aspect('...', 'null', 'null', $scope);
    $scope.subHandle = Meteor.subscribe('Subscriptions', ()=> {
    }, {});
    //$scope.aspectList = $scope.$meteorCollection(AspectList);
    //$scope.aspectLists = $scope.$meteorCollection(AspectLists);

    $scope.getAspectOb = function (name) {
        var filtered = $scope.list.aspectObs.filter(function (obj) {
            return obj.name == name;
        });
        result = filtered[0];
       // console.log(result);
        return result;
    };

    $scope.changeVer = function () {
        $scope.aspect1 = new Aspect('...', 'null', 'null', $scope);
        $scope.aspect2 = new Aspect('...', 'null', 'null', $scope);
        $scope.aspectLists.forEach(function (entry) {
            if (entry._id == $scope.currentListId) {
                $scope.list = entry;
            }
        });
        //  init();
        if($scope.list) Meteor.call('SaveSolverState', $scope.list._id);
    };
    $scope.showActionToast = function () {
        var toast = $mdToast.simple()
            .content('You haven`t choosed versions. Go to version list and subscribe one, or log-in!')
            .action('Login')
            .hideDelay(0)
            .action('TAKE ME THERE')
            .highlightAction(false)
            .position('bottom right');
        $mdToast.show(toast).then(function (response) {
            if (response == 'ok') {
                $location.path('/editor-list');
            }
        });
    };
    $scope.autorun(()=> {

        if (Subscribtion.find({}).count() == 0 && $scope.subHandle.ready()) {
            $rootScope.offset = false;
            $scope.showLanding = true;
            $scope.showActionToast();
            //  console.log('landing on');
        } else {
            $rootScope.offset = true;
            $scope.showLanding = false;
            $mdToast.hide();
        }
    });
    $scope.xxx = function xxx() {
        console.log(AspectLists.find({})  )
    };
    $scope.sortAspects = (propertyArr, reverse = false)=> {
        function compare(a, b) {
            var i = 0;
            while (propertyArr[i]) {
                if (a[propertyArr[i]] < b[propertyArr[i]])  return -1;
                if (a[propertyArr[i]] > b[propertyArr[i]])  return 1;
                i++;
            }
            return 0;
        }

        let sortArray = $scope.list.aspectObs;
        sortArray.sort(compare);
        if (reverse) {
            sortArray.reverse();
        }
        $scope.list.aspectObs = sortArray;
          Meteor.call('SaveSorting', propertyArr, reverse);
    };
var handle;
    $scope.autorun( function() {

        // console.log($scope.getReactively('SubscriptionNumber'));
            handle = Meteor.subscribe('SubscribedAspectLists', $scope.getReactively('SubscriptionNumber'), {
                onReady: function () {
                    setTimeout(()=>{ initialize();    }, 20);
                },
                onStop: function (error) {
                    if (error) {
                        //console.log('An error happened - ', error);
                    } else {
                    }
                }
            });
           // avvv = Subscribtion.find({}).count() ;

         //   console.log('resubscribed');



    });



    $scope.resubscribe = ()=>{
      $scope.list.aspectObs.reverse();
        //Meteor.call('SaveSorting', ['...'], false);
    };


    function initialize() {


        return Tracker.nonreactive(function() {

        if (handle.ready()) {
            //stare ID listy
            var old_id= 'null';
            if (Meteor.userId() != null && Meteor.user().profile != undefined && Meteor.user().profile.solverState ){
                 old_id = Meteor.user().profile.solverState._id;
            }

            $scope.currentListId='null';
            $scope.aspectLists.forEach(function (entry) {
                if (entry._id == old_id) {
                   $scope.currentListId =old_id;
                }
            });
            if($scope.currentListId=='null' && AspectLists.find().count()>0){
                $scope.currentListId =$scope.aspectLists[0]._id;
            }
            $scope.changeVer();

            if ( Meteor.userId() != null && Meteor.user().profile && Meteor.user().profile.sortMethod && Meteor.user().profile.solverState && $scope.SubscriptionNumber > 0) {
                $scope.sortAspects(Meteor.user().profile.sortMethod, Meteor.user().profile.sortDirection);
            }
            if ($scope.list) $scope.currentListId = $scope.list._id;
            //  init();
        }
    });
    }

    $scope.aspects = [];
    function init() {
        var rows = $scope.list.aspectLists.split("\n");
        $scope.aspects = [];
        rows.forEach(function (entry) {
            var x = entry.split(",");
            var aspect = new Aspect(x[0], x[1], x[2], x[3]);
            $scope.aspects.push(aspect)
        });
    }

    $scope.searchDisabled = false;

    $scope.$on('$destroy', ()=>{
        $rootScope.offset = true;
        $mdToast.hide();
    });
    $scope.iterations = 6;
    function async(first, second, aspectList, iterations) {
        var i = 0;
        var taskDone = false;
        var start=first;
        var end=second;
        //returns connection array
        function parseList(list){
            var arr = [];
            list.forEach( (element)=>{ arr.push(element.name)})
            return arr;
        }
        function getConnections(path){
            var aspect = path[path.length-1];
            var banned = [];
            path.forEach( (asp)=>{banned.push(asp.name) });
            banned.splice(0,1)
           // console.log(aspect);
            var conList = [];
            aspectList.forEach( (item)=>{
                if (item.Compoment1 != "null" && item.name == aspect.name) // if not primal aspect then:
                {
                        if(banned.indexOf(item.Compoment1)=== -1 ){
                            conList.push(  aspectList.find(x=> x.name === item.Compoment1)     );
                        }
                        if(banned.indexOf(item.Compoment2)=== -1 ){
                            conList.push(  aspectList.find(x=> x.name === item.Compoment2)     );
                      }

                }
                if (item.Compoment1 == aspect.name || item.Compoment2 == aspect.name)
                {
                    if(banned.indexOf(item.name)=== -1){
                    conList.push(  item );
                    }

                }

            });
            return conList;
        }

        //dig out all connections
        var resultList = [];
        var workerList = [ [start] ];
        while (i < iterations){
            i++;
            var tempWorker = [];
            workerList.forEach( (path)=>{
                if(path[path.length-1]  && path[path.length-1].name === end.name ){
                    notify( path);

                }
                    getConnections(path).forEach( (endCandidate)=>{
                        tempWorker.push(path.concat(endCandidate))
                    })




            });
            //console.log(workerList);
            //console.log(tempWorker);
            workerList = tempWorker;





        }
           workerList.forEach( (list)=>{
              // notify(list);
           });
        setTimeout(()=>{
            complete(second);
        },10);
    }

// mark this worker as one that supports async notifications

// uses the native $q style notification: https://docs.angularjs.org/api/ng/service/$q
    $scope.searchResult = [];
    $scope.searchCount = 0;
    $scope.search = (ev)=>{

        $mdDialog.show({
                controller: function Ctrl($scope, $mdDialog, locals) {
                    $scope.locals = locals;



                    $scope.hide = function () {
                        $mdDialog.hide()
                    };

                },
                controllerAs: 'ctrl',
                templateUrl: 'client/helper/views/directives/aspect-search-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen,
                locals: {
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



        $scope.searchCount=0;
        $scope.searchResult = [];
        $scope.searchDisabled = true;
        var myWorker = Webworker.create(async, {async: true, useHelper:true });
        myWorker.run($scope.aspect1, $scope.aspect2, $scope.list.aspectObs, $scope.iterations).then(function(result) {
                // promise is resolved.
                console.log('done');
            $scope.searchDisabled = false;
            }, null, function(progress) {

                var filtered = [];
                $scope.banned.forEach( (item)=>{
                    var search = progress.find(x=> x.name === item);
                   if(search){
                       filtered.push(search );
                   }

                });

                if(filtered.length == 0){
                   $scope.searchCount++;
                   $scope.searchResult.push(progress);
                }

            }
        )


    };

    $scope.banned = [];
    $scope.isBanned = (name)=>{
        return $scope.banned.indexOf(name) > -1;
    };



}).directive("popupLauncher", function ($rootScope, $compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, parentCtrl) {
            scope.xxx = function xxx(str) {
                //alert(str);
            };


            var pressTimer;
            var longPress = false;
            var checkPress = false;
            element.mouseup(function(){
                clearTimeout(pressTimer);
                if (!longPress && checkPress){
                    var result = scope.$parent.list.aspectObs.filter(function (obj) {
                        return obj.name == attrs.popupLauncher;
                    });
                    scope.$parent.aspect1 = scope.$parent.aspect2;
                    scope.$parent.aspect2 = result[0];
                    scope.$parent.$apply();
                }


                longPress = false;
                return false;
            }).mousedown(function(){
                checkPress = true;
                setTimeout( ()=>{
                   checkPress = false;
                },1000);

                pressTimer = window.setTimeout(function() {
                    longPress = true;
                   if(scope.$parent.banned.indexOf(attrs.popupLauncher)== -1){
                       scope.$parent.banned.push(attrs.popupLauncher);

                   }else{
                       scope.$parent.banned.splice(scope.$parent.banned.indexOf(attrs.popupLauncher), 1 );
                   }
                    scope.$parent.$apply();
                }, 1000);
                return false;
            }).mousemove(function() {
                clearTimeout(pressTimer);
            });



            scope.$on('$destroy', function () {
                element.off('mouseup');
                element.off('mousedown');
                element.off('mousemove');
               // console.log('unbound click');
            });
        }
    }
});