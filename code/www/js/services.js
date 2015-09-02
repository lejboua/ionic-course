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

.service ('UserService', function UserFactory() {
    this.favorites = [];
    this.addSongToFavorites = function(song) {
        if (!song) return false;
        console.log('favoriting in service! ', song.title);
        this.favorites.unshift(song);
    }
});
