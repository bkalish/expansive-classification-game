'use strict';

/*global angular */
var expansiveClassificationGame = angular.module('expansiveClassificationGame', ['ui.sortable']);

expansiveClassificationGame.controller('gameController', ['$scope', '$interval', '$http',
  function ($scope, $interval, $http) {
		$scope.bookshelfHeight = 130;
		$scope.bookshelf = [];
		$scope.gameData = {};

    var timer;

		$http.get('game-data.json').success(function(data) {
		  $scope.gameData = data;
			initLevel(data.levels[0]);
    }).error(function(data, status, headers, config) {
		});

    $scope.startLevel = function() {
      $scope.level.started = true;
      $scope.level.clock = 0;
      timer = $interval($scope.incrementTimer, 250);
    };


		$scope.sortableOptions = {
      orderChanged: updateGame
		};

    function updateGame() {
      var score = getSortScore(
        $scope.bookshelf.map(function(book) {return book.callNumber; }),
        compareCutterNumbers
      );
      $scope.level.status = getProgressMessage(score);
    }

		function initLevel(levelData) {
		  var colors = levelData.colors || $scope.gameData.defaultColors;
      $scope.level = levelData;

			// add books to bookshelf
			levelData.callNumbers.forEach(function(callNumber) {
				$scope.bookshelf.push( {'callNumber': callNumber } );
			});

			// shuffle books
			shuffle($scope.bookshelf);

			// decorate books with colors, etc.
      decorateBooks($scope.bookshelf, colors, $scope.bookshelfHeight);

      // update game so that the status is displayed properly
      updateGame();

		}

    /**
     * Assigns height and colors to books and formats for each book's label.
     */
    function decorateBooks(books, colors, height) {
      books.forEach(function(book) {
        book.formattedCallNumber = formatCallNumber(book.callNumber);
        book.height = (0.8 + Math.random()*0.2) * (height-1);
        book.color = colors[Math.floor(Math.random() * colors.length)];
      });
    }

    /**
     */
    function getProgressMessage(sortScore) {
      if (sortScore === 1) {
       return 'Perfect! These books are in order!';
      } else {
       if (sortScore < 0.5) {
         return 'These books are badly out of order!';
       } else if (sortScore < 0.75) {
         return 'These books are out of order!';
       } else {
         return 'These books are mostly in order.';
       }
      }
    }

    /**
     * Increments the level clock.
     */
    $scope.incrementTimer = function() {
      $scope.level.clock++;
    };
	}
]);

/**
 * Adds line breaks to a call number so it can be printed on a label.
 */
function formatCallNumber(callNumber) {
	var out = callNumber;
	if (callNumber.length > 6) {
		out = out.replace('.', '.\n');
		out = out.replace('+', '+\n');
		out = out.replace('//', '//\n');
	}
	out = out.replace(' ', '\n');
	return out;
}

/**
 * Determine how in-order an array is.
 *
 * Returns 1 when the array is in order and 0 if the array is backwards. All
 * Other permutations will return a number between 0 and 1.
 *
 * Note that with the current implementation a transposition may improve the
 * ordering without increasing the score.
 */
 function getSortScore(array, compareFunction) {
   compareFunction = compareFunction || Math.sign;
   var score = 0;
   for (var i=0; i<array.length-1; i++) {
     if (compareFunction(array[i], array[i+1]) <= 0) {
       score++;
     }
   }
   return score / (array.length - 1);
 }

/**
 * Shuffles an array.
 */
function shuffle(array) {
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
}

/**
 * Compares two Expansive Classification Numbers.
 *
 * Returns -1 if a comes before b, +1 if a comes after b. Otherwise returns 0.
 */
function compareCutterNumbers(a, b) {
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
}
