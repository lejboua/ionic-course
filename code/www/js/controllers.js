angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations) {
    // Recommendations.getNextSongs()
    Recommendations.init()
        .then(function() {
            // $scope.currentSong = Recommendations.queue[0];
            setCurrentSong(0);
            // play the first song, on index 0
            Recommendations.playCurrentSong();
            // Recommendations.init() will play
        });


    var currentIndex = -1;
    var setCurrentSong = function(indx){
        currentIndex = indx;
        console.log("setting current song! ", currentIndex);
        $scope.currentSong = Recommendations.queue[indx];
    };

    setCurrentSong(0);

    $scope.sendFeedback = function (bool) {
        if (bool) User.addSongToFavorites($scope.currentSong);

        $scope.currentSong.rated = bool;
        $scope.currentSong.hide = true;

        // fetch the next song
        Recommendations.nextSong();

        $timeout(function() {
            // $timeout to allow animation to complete before changing to next song
            // set the current song to one of our three songs
            setCurrentSong(0);
        }, 250);
        // after fetching the next song and setting it
        // the current one, play it
        Recommendations.playCurrentSong();
    };

    $scope.nextAlbumImage = function() {
        if (Recommendations.queue.length > 1){
            return Recommendations.queue[1].image_large;
        }
        return "";
    }
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
    $scope.favorites = User.favorites;
    $scope.removeSong = function(song, index) {
        User.removeSongFromFavorites(song, index);
    }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations) {
    $scope.enteringFavorites = function() {
        Recommendations.haltAudio();
    };
    $scope.enteringDiscover = function() {
        console.log("entering Discover");
        Recommendations.init();
    }
});
