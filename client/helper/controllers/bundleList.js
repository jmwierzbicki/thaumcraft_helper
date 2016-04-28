angular.module("tcssApp").controller("BundleListCtrl", function ($scope, $meteor, $location, $state) {
    $scope.page = 1;
    $scope.page = Session.get('currentPage');
    $scope.search = Session.get('currentSearch');
    if(typeof ($scope.search) == 'undefined'){
        $scope.search = '';
    }
    $scope.perPage = 12;
    $scope.sort = {subscriptions: -1, _id: 1};
    $scope.subscribe('Subscriptions');
    $scope.NumberOfLists = 0;
    $scope.eventInitiate = 0;

    $scope.autorun( ()=>{
        if(Meteor.user() && Meteor.user().profile) {
            $scope.NumberOfLists = Meteor.user().profile.numberOfAspectLists;
        }
    });

    var subscriptionHandle = $scope.subscribe('AspectList', () => {

        $scope.collectionReady = true;
        return [
            {
                limit: parseInt($scope.perPage),
                skip: parseInt(($scope.getReactively('page') - 1) * $scope.perPage),
                sort: $scope.getReactively('sort')
            },
            $scope.getReactively('search')
        ]
    },
        {
            onReady: function () {
            },
            onStop: function (error) {
                if (error) {
                    console.log('An error happened - ', error);
                } else {
                }
            }
        }
    );

    $scope.autorun( ()=>{

        //setTimeout( ()=>{
        //    console.log('trying to refresh')
        //    $scope.$apply();
        //}, 5000);

       $scope.getReactively('aspectList');
        if(subscriptionHandle.ready()){
            $scope.collectionReady = false;
        }
        Session.setPersistent("currentSearch", $scope.search);
    });

    //    ()=>{
    //    console.log('ended sub');
    //    Session.setPersistent("currentSearch", $scope.search);
    //    $scope.collectionReady = false;
    //});


    $scope.addList =(obj)=>{
      list = new AspectList();
        list.set('name', obj.name);
        list.set('description', obj.description);
        list.set('owner', Meteor.userId());
        list.set('ownerName', Meteor.user().username);
        list.set('image', Meteor.user().profile.avatar);
        list.set('status', false);
        list.save();

        $scope.go('/editor/'+list._id);
    };

    $scope.autorun(()=>{
        subs = Subscribtion.find().fetch();
        $scope.subsArr = [];
        subs.forEach(function (entry) {
            $scope.subsArr.push(entry.listId);
        });
    });

    $scope.helpers({
        aspectList: () => {
            return AspectList.find({}, { sort: $scope.getReactively('sort')});
        }
    });

    $scope.pagesCount = [];

    $scope.autorun(() => {
        var a = $scope.getReactively('NumberOfLists');
        //$scope.getReactively('a');
        //console.log('a: ' , a);

        pages = Math.ceil(a / $scope.perPage);
        //console.log(pages);
        if (a >= 0)$scope.pagesCount = Array(Math.ceil(pages));
        //console.log('pagescount ', col);
        if (pages < 1) {
            pages = 1
        }
        if (a) {
            if ($scope.page > pages) {
                $scope.page = pages;
            }
        }
    });

    $scope.pageChanged = function (newPage) {
        $scope.page = newPage;
        Session.setPersistent("currentPage", $scope.page);
    };
    $scope.sub = function (id) {
        uid = Meteor.user()._id;
        oldSub = Subscribtion.findOne({listId: id, userId: uid});
        //  console.log(oldSub);
        if (oldSub) {
            Subscribtion.remove({_id: oldSub._id});
            //  console.log('removed: ',oldSub._id);
            return true;
        }
        Subscribtion.insert({
            hash: id + uid,
            listId: id,
            userId: uid
        });
    };
    //$meteor.subscribe('AspectList');
    // $scope.aspectList = $meteor.collection(AspectList);
    $scope.go = function (path) {
        $location.path(path);
    };
});

