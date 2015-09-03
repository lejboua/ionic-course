angular.module('songhop.services', [])
.factory ('User', function() {
    var o = {
        favorites: []
    };
    o.addSongToFavorites = function(song) {
        if (!song) return false;
        console.log('favoriting! ', song.title);
        o.favorites.unshift(song);
    }

    o.removeSongFromFavorites = function(song, index) {
        if (!song) return false;
        console.log('removing! ', song.title);
        o.favorites.splice(index, 1);
    }

    return o;
})

// injecting $q to use promises
.factory ('Recommendations', function($http, $q, SERVER) {
    var media;
    var o = {
        queue: []
    };

    o.init = function() {
        if (o.queue.length === 0) {
            // also returns a promise
            return o.getNextSongs();
        }
        else {
            // returns a promise
            return o.playCurrentSong();
        }
        // .init always returns a promise,
        // so o.init() has always a .then() method
    };

    o.playCurrentSong = function() {
        // we are creating a promise
        var defer = $q.defer();

        media = new Audio(o.queue[0].preview_url);
        console.log("playing ", o.queue[0].preview_url);

        // when song loaded (using the Audio object)
        // resolve the promise to let the controller know
        media.addEventListener("loadeddata", function() {
            defer.resolve();
        });

        media.play();

        return defer.promise;
    };

    // used when switching to favorites tab
    o.haltAudio = function() {
        if (media) media.pause();
    }

    o.getNextSongs = function() {
        return $http({
            method: 'GET',
            url: SERVER.url + '/recommendations'
        }).success(function(data) {
            o.queue = o.queue.concat(data);
        });
    };

    o.nextSong = function() {
        // pop the index 0 song
        o.queue.shift();

        // end the song
        // (the 0 song was playing)
        o.haltAudio();

        if (o.queue.length <= 3) {
            o.getNextSongs();
        }
    };

    return o;
})

.service ('UserService', function UserFactory() {
    this.favorites = [];
    this.addSongToFavorites = function(song) {
        if (!song) return false;
        console.log('favoriting in service! ', song.title);
        this.favorites.unshift(song);
    }
});
