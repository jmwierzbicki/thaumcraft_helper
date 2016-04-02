/**
 * Created by Jakub on 14.03.2016.
 */
Meteor.methods({
   cleanUpFiles: function() {
       usedImages = [];
       lists = AspectLists.find({});
       //console.log(lists);
        lists.forEach(function(list){
            //console.log(list.aspectObs);
            //console.log(list);
            //  console.log(typeof (list.aspectObs));

            if(list.aspectObs != null ){
                list.aspectObs.forEach(function(aspect){
                    if (typeof (aspect.imageOb) != 'undefined'){
                        usedImages.push(aspect.imageOb)
                    }
                })
            }

        });
        //console.log(usedImages);
      images = AspectImages.find({});
       //console.log(images);
       images.forEach(function(obj){
           //console.log(obj._id);
        if(usedImages.indexOf(obj._id) < 0){
            AspectImages.remove(obj._id);
            console.log('removed unused file: '+obj._id);
        }

       })

   },
});