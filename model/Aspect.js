var Class = function(methods) {
    var object = function() {
        this.initialize.apply(this, arguments);
    };

    for (var property in methods) {
        object.prototype[property] = methods[property];
    }

    if (!object.prototype.initialize) object.prototype.initialize = function(){};

    return object;
};


Aspect = Class({
    initialize: function(name, compoment1, compoment2, $scope, image = null) {
        var that = this;
        this.name = name;
        this.Compoment1  = compoment1;
        this.Compoment2  = compoment2;
        this.Tier = -1;

        if(image != null){this.imageUrl = image; } else {this.imageUrl = getImage(that);}
         this.id = guidGenerator();

        function getImage(that){

            Meteor.call('aspectImageExists', that.name, function(error, result){

                if(result){
                    that.imageUrl = "/aspects/"+that.name+".png";
                }else{
                    that.imageUrl = "/aspects/placeholder.jpg";
                }

                $scope.$apply();
                //$scope.save()

            });
        };

        function guidGenerator() {
            var S4 = function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        }





    },
    toString: function() {
        return ""+this.name+".";
    },
    isUploaded: function(){
      if(this.imageOb === "undefined"){
         console.log('ss');
          return true;
      }
    }

});