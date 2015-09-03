angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, $ionicLoading, User, Recommendations) {
    // helper functions for loading
    var showLoading = function() {
        $ionicLoading.show({
            template: '<i class="ion-loading-c"></i>',
            noBackdrop: true
        });
    };

    var hideLoading = function() {
        $ionicLoading.hide();
    };

    // set loading to in true the first time
    // while we retrieve songs from server
    // (this line only runs once with the
    // controller instantiation)
    showLoading();

    // Recommendations.getNextSongs()
    Recommendations.init()
        .then(function() {
            // $scope.currentSong = Recommendations.queue[0];
            setCurrentSong(0);
            // play the first song, on index 0
            Recommendations.playCurrentSong();
            // Recommendations.init() will play
            $scope.played = true;
        })
        // we can chain resolve functions,
        // instead of relying on just one function
        .then(function() {
            // turn loading off
            $timeout(function() {
                hideLoading();
            }, 250);
            console.log('loading on init() ', $scope.loading);
            $scope.loading = true;
        });


    var currentIndex = -1;

    var setCurrentSong = function(indx){
        currentIndex = indx;
        console.log("setting current song! ", currentIndex);
        // $scope.currentSong = angular.copy(Recommendations.queue[indx], {});
        $scope.currentSong = Recommendations.queue[indx];
        console.log("setCurrentSong.currentSong ", JSON.stringify($scope.currentSong));
        $scope.played = false;
    };

    setCurrentSong(0);

    $scope.sendFeedback = function (bool) {

        if (bool) User.addSongToFavorites($scope.currentSong);

        $scope.currentSong.rated = bool;
        $scope.currentSong.hide = true;

        // fetch the next song
        Recommendations.nextSong();

        $timeout(function() {
            // $timeout to allow animation to complete
            // before changing to next song
            setCurrentSong(0);

            // AA: $scope.currentSong.loaded isn't defined here?!?!
            // $scope.currentSong.loaded = false;

        // after fetching the next song and setting it
        // the current one, play it
        Recommendations.playCurrentSong().then(function() {
            $scope.played = true;
            console.log('played on sendFeedback.playCurrentSong ',
                        $scope.played);

        });
        }, 250);

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
