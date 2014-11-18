var expansiveClassificationGame = angular.module('expansiveClassificationGame', ['ui.sortable']);

expansiveClassificationGame.controller('gameController', ['$scope', '$http',
  function ($scope, $http) {
		$scope.bookshelfHeight = 200;
		$scope.bookshelf = [];
		$scope.gameData = {};

		$http.get('game-data.json').success(function(data) {
		  $scope.gameData = data;
			initLevel(data.levels[0]);
    }).error(function(data, status, headers, config) {
		});
    
	
		$scope.sortableOptions = {
			 // no sortable options set
		};
		
		function initLevel(levelData) {
		  var colors = levelData.colors || $scope.gameData.defaultColors;
		  		
			// add books to bookshelf
			levelData.callNumbers.forEach(function(callNumber) {
				$scope.bookshelf.push( {'callNumber': callNumber } );
			});
			
			// shuffle books
			shuffle($scope.bookshelf);
	
			// decorate books with colors, etc.
			$scope.bookshelf.forEach(function(book) {
				book.formattedCallNumber = formatCallNumber(book.callNumber);
				book.height = (0.7 + Math.random()*0.3) * $scope.bookshelfHeight;
				book.color = colors[Math.floor(Math.random() * colors.length)];
				console.log(book.color);
			});
		}
	}
]);

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
