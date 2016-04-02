angular.module("tcssApp").directive('chatWidget', ()=> {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs, tabsCtrl) {

            scope.isLoggedIn = () =>{
                if(!Meteor.user()) return false;
              return LoginState.signedUp();
            };

            $('.chat-widget').on('mouseenter',()=>{
                setTimeout( ()=>{
                    scope.$apply();
                    console.log('test');
                    console.log($._data($('.chat-widget')[0], 'events'));
                },50);

            });

            scope.$on('$destroy', function () {
                $('.chat-widget').off('mouseenter');
                // console.log('unbound scroll');
            });

            scope.moveDown = ()=>{
                setTimeout( ()=>{
                    $('.chat-widget').trigger('chat-ready')
                },1);

            };
            scope.showChat = false;
            scope.hideOrShow = ()=>{
                if(scope.showChat)return 'hide';
                return 'show';
            };
            scope.commentCount = 0;

            Tracker.autorun(()=> {
                var lastComment = Comments.find({}).fetch();
                if (lastComment.length === 1
                    && scope.dataLoaded == true
                    && scope.messages[scope.messages.length - 1]
                        && lastComment[0]
                    && scope.messages[scope.messages.length - 1]._id  != lastComment[0]._id ) {
                    scope.messages.push(lastComment[0]);
                    scope.commentCount++;
                    scope.$apply();
                    setTimeout(()=> {
                        $('.chat-widget').trigger('chat-ready')
                    }, 100);
                }
                if(  scope.messages
                        && scope.messages.length ===0
                    && lastComment.length === 1
                    && scope.dataLoaded == true
                    ){
                    scope.messages.push(lastComment[0]);

                    scope.$apply();
                }
            });

            scope.autorun( ()=>{

                Meteor.subscribe('lastChatMessage', scope.getReactively('chatId'));
            });

            attrs.$observe('chatId', ()=> {
                if (attrs.chatId != '') {

                    Meteor.call('commentsCount', attrs.chatId, (err, result)=>{
                    scope.commentCount = result;
                    });

                    scope.chatId = attrs.chatId;
                    initialize();

                }
            });
            scope.messages = [];
            function getMoreData(timestamp = '') {
                Meteor.call('getChatData', scope.chatId, timestamp, (err, data)=> {
                    //console.log('getting data');
                    if (timestamp==='') scope.messages = [];
                    data.forEach((item)=> {
                        scope.messages.unshift(item);
                    });
                    scope.dataLoaded = true;
                    scope.$apply();
                    //console.log(scope.messages);
                    if (timestamp === '') $('.chat-widget').trigger('chat-ready');
                });
            }


            function initialize() {
                //console.log('id', scope.chatId);
                getMoreData()
            }


            scope.message = '';
            scope.addComment = function () {
                var currTime = new Date().getTime()
                Comments.insert({message: scope.message, chatId: scope.chatId, timestamp:currTime, author:Meteor.user().username});
            };

            scope.isEmpty = ()=>{

                return scope.message.length < 2;

            };

            scope.loadMore = function (callback) {
                var timestamp;
                if (!scope.messages[0]){
                    timestamp = '';
                }else{
                    timestamp = scope.messages[0].timestamp;
                }
                getMoreData(timestamp);
                setTimeout(()=> {
                    //console.log(typeof callback);
                    if (typeof callback === 'function') {
                        callback.call();
                    }
                }, 300);
            }
        },
        templateUrl: 'client/chat/template.html'
    };
});

angular.module("tcssApp").directive('infScroll', ()=> {
    return {
        restrict: 'A',
        scope: {
            infScroll: '&'
        },
        link: function (scope, element, attrs) {
            var firstTime;
            var secondTime;
            var lock;
            var queue;

            setTimeout(()=> {
                //console.log(element[0].scrollHeight);
                element.scrollTop(element[0].scrollHeight);
            }, 1);
            $('.chat-widget').on('chat-ready', ()=> {
                setTimeout(()=> {
                    //console.log(element[0].scrollHeight);
                    element.scrollTop(element[0].scrollHeight);
                }, 1);
            });
            interval = (time, func)=> {
                if (lock && !queue) {
                    queue = true;
                    secondTime = new Date().getTime();
                    var timeDiff = secondTime - firstTime;
                    var timeCut = (time - timeDiff) + 1;
                    if (element.scrollTop() + element.height() == element.height()) {
                        // console.log('queuing next data download');
                        // console.log(lock,queue);
                        setTimeout(()=> {
                            interval(time, scope.infScroll);
                            queue = false;
                        }, timeCut);
                    }
                }
                if (!lock) {
                    setTimeout(()=> {
                        lock = false
                    }, time);
                    lock = true;
                    firstTime = new Date().getTime();
                    var initHeight = element[0].scrollHeight;
                    func({
                        callback: ()=> {
                            scope.$apply();
                            var endHeight = element[0].scrollHeight;
                            var diff = endHeight - initHeight;
                            element.scrollTop(diff);
                        }
                    });
                }
            };
            //console.log(element);
            element.bind('scroll', ()=> {
                if (element.scrollTop() + element.height() == element.height()) {
                    //  console.log(element.scrollTop());
                    //   console.log(element.height());
                    interval(500, scope.infScroll);
                    //  setTimeout(()=>{ scope.$apply; }, 100);
                }
            });

            scope.$on('$destroy', function () {
                element.off('scroll');
               // console.log('unbound scroll');
            });
        }
    };
});
angular.module("tcssApp").directive('timestampTidy', ()=> {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            $('.chat-widget').on('mouseenter',()=>{

                scope.timestamp = timeDifference(attrs.timestampTidy);;

            });
            scope.$on('$destroy', function () {
                $('.chat-widget').off('mouseenter');

            });


            attrs.$observe('timestampTidy', ()=> {
                scope.timestamp = timeDifference(attrs.timestampTidy);

                if(attrs.timestampTidy == ''){
                    attrs.$set('timestampTidy', ()=>{return new Date().getTime();});
                }

            });
            function timeDifference( previous) {
                var current = new Date().getTime();
                var msPerMinute = 60 * 1000;
                var msPerHour = msPerMinute * 60;
                var msPerDay = msPerHour * 24;
                var msPerMonth = msPerDay * 30;
                var msPerYear = msPerDay * 365;
                var elapsed = current - previous;

                var formatted;
                var text = [
                    'just few seconds ago',
                    ' second ago',
                    ' seconds ago',
                    ' minute ago',
                    ' minutes ago',
                    ' hour ago',
                    ' hours ago',
                    ' day ago',
                    ' days ago',
                    ' month ago',
                    ' months ago',
                    ' year ago',
                    ' years ago'
                ];


                if (elapsed < 10000){
                    formatted = text[0]
                }
                else if (elapsed < msPerMinute) {
                    formatted = Math.round(elapsed / 1000)
                        if (formatted == 1){
                            formatted =  formatted + text[1]
                        }
                    else{
                            formatted =  formatted + text[2]
                        }

                }
                else if (elapsed < msPerHour) {
                    formatted = Math.round(elapsed / msPerMinute) ;
                    if (formatted == 1){
                        formatted =  formatted + text[3]
                    }
                    else{
                        formatted =  formatted + text[4]
                    }
                }
                else if (elapsed < msPerDay) {
                    formatted = Math.round(elapsed / msPerHour) ;
                    if (formatted == 1){
                        formatted =  formatted + text[5]
                    }
                    else{
                        formatted =  formatted + text[6]
                    }
                }
                else if (elapsed < msPerMonth) {
                    formatted = Math.round(elapsed / msPerDay);
                    if (formatted == 1){
                        formatted =  formatted + text[7]
                    }
                    else{
                        formatted =  formatted + text[8]
                    }
                }
                else if (elapsed < msPerYear) {
                    formatted = Math.round(elapsed / msPerMonth);
                    if (formatted == 1){
                        formatted =  formatted + text[9]
                    }
                    else{
                        formatted =  formatted + text[10]
                    }

                }
                else {
                    formatted = Math.round(elapsed / msPerYear)
                    if (formatted == 1){
                        formatted =  formatted + text[11]
                    }
                    else{
                        formatted =  formatted + text[12]
                    }
                }


                return formatted;
            }
        },
        template: '{{timestamp}}'
    }
});