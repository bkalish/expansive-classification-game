(function(){
  'use strict';

  /*global angular */

  angular.module('shelvingGame').factory('util', function() {
    return {
      /**
       * Shuffles an array.
       */
      shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      },

      /**
       * Determine how in-order an array is.
       *
       * Returns 1 when the array is in order and 0 if the array is backwards. All
       * Other permutations will return a number between 0 and 1.
       *
       * Note that with the current implementation a transposition may improve the
       * ordering without increasing the score.
       */
      getSortScore: function (array, compareFunction) {
        compareFunction = compareFunction || Math.sign;
        var score = 0;
        for (var i=0; i<array.length-1; i++) {
          if (compareFunction(array[i], array[i+1]) <= 0) {
            score++;
          }
        }
        return score / (array.length - 1);
      }
    };
  });
})();
