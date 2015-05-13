(function(){
  'use strict';

  /*global angular */

  angular.module('ShelvingGame').factory('ExpansiveClassification', function() {
    return {
      /**
       * Compares two Expansive Classification Numbers.
       *
       * Returns -1 if a comes before b, +1 if a comes after b. Otherwise returns 0.
       */
      compare: function(a, b) {
        a = a.replace('//', '!1');
        b = b.replace('//', '!1');
        a = a.replace('+', '!1');
        b = b.replace('+', '!1');
        a = a.replace('.', '!1');
        b = b.replace('.', '!1');
        a = a.replace(':', '!2');
        b = b.replace(':', '!2');
        a = a.replace('/([a-Z])([0-9])/', '$1!3$2');
        b = b.replace('/([a-Z])([0-9])/', '$1!3$2');
        if (a<b) {
          return -1;
        }
        if (a>b) {
          return 1;
        }
        return 0;
      },

      /**
       * Adds line breaks to a call number so it can be printed on a label.
       */
      formatCallNumber: function (callNumber) {
        var out = callNumber;
        if (callNumber.length > 6) {
          out = out.replace('.', '.\n');
          out = out.replace('+', '+\n');
          out = out.replace('//', '//\n');
        }
        out = out.replace(' ', '\n');
        return out;
      }
    };
  });
})();
