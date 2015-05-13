(function(){
  'use strict';

  /*global angular */
  angular.module('ShelvingGame').controller(
      'GameController',
      ['$scope', '$interval', '$http', 'hotkeys', 'ExpansiveClassification', 'util',
    function ($scope, $interval, $http, hotkeys, ExpansiveClassification, util) {
      $scope.bookshelfHeight = 130;
      $scope.pauseButtonClass = 'fa fa-pause';
      $scope.bookshelf = [];
      $scope.gameData = {};

      var timer;
      var paused = false;

      hotkeys.add({
        combo: 'space',
        description: 'Pause / Resume the game',
        callback: function () { $scope.pause(); }
      });

      $http.get('game-data.json').success(function(data) {
        $scope.gameData = data;
        initLevel(data.levels[0]);
      }).error(function(data, status, headers, config) {});

      $scope.startLevel = function() {
        $scope.level.started = true;
        $scope.level.clock = 0;
        timer = $interval($scope.incrementTimer, 250);
      };


      $scope.sortableOptions = {
        orderChanged: updateGame
      };

      $scope.pause = function() {
        paused = !paused;
        if (paused){
          $scope.pauseButtonClass = 'fa fa-play';
        } else {
          $scope.pauseButtonClass = 'fa fa-pause';
        }
      };

      function updateGame() {
        var score = util.getSortScore(
          $scope.bookshelf.map(function(book) {return book.callNumber; }),
          ExpansiveClassification.compare
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
        util.shuffle($scope.bookshelf);

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
          book.formattedCallNumber = ExpansiveClassification.formatCallNumber(book.callNumber);
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
        if (!paused) {
          $scope.level.clock++;
        }
      };
    }
  ]);
})();
