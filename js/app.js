"use strict";
// IMPORTANT
// For attribution please see ../THE_CREDITS.js
// /IMPORTANT

/* Note we are hardcoding the required lat/long instead of using
 * google.map.geocoder to reduce the number of ajax calls we make.
 * Please don't ding me, it was a huge pain to get. #TheAPIQuotaIsReal
 */
var map, places;
var locationData = [{
    name: "Dick's Drive-In",
    address: "500 Queen Anne Ave N, Seattle, WA 9810",
    filterTags: ["", "food", "burgers", "american"],
    flickrQuery: "dick's drive in Seattle",
    placeID: "ChIJJxszkEMVkFQRir4VQRt8zwc",
    lat: 47.623466,
    long: -122.356383
}, {
    name: "Thai Heaven",
    filterTags: ["", "food", "thai"],
    address: "352 Roy St, Seattle, WA 98109",
    flickrQuery: "thai heaven Seattle",
    placeID: "ChIJa9rR2kAVkFQR53dWKG_k6GU",
    lat: 47.625587,
    long: -122.349916
}, {
    name: "Roti Cuisine of India",
    filterTags: ["", "food", "indian"],
    flickrQuery: "Roti Seattle",
    address: "530 Queen Anne Ave N, Seattle, WA 98109",
    placeID: "ChIJZZwKv0MVkFQR3FUAAkRq4X8",
    lat: 47.624234,
    long: -122.356371
}, {
    name: "Bahn Thai",
    filterTags: ["", "food", "thai"],
    flickrQuery: "bahn thai restaurant Seattle",
    address: "409 Roy St, Seattle, WA 98109",
    placeID: "ChIJg3wZNUcVkFQRr07_kXaFv24",
    lat: 47.625237,
    long: -122.348381
}, {
    name: "Bamboo Garden",
    filterTags: ["", "food", "chinese", "vegetarian"],
    flickrQuery: "bamboo garden restaurant seattle",
    address: "364 Roy St, Seattle, WA 98109",
    placeID: "ChIJ6-KGz0AVkFQRgR0pgSdWApU",
    lat: 47.625607,
    long: -122.349461
}, {
    name: "Seattle Center",
    filterTags: ["", "entertainment", "outdoor", "kid friendly"],
    flickrQuery: "seattle center",
    address: "305 Harrison St, Seattle, WA 98109",
    placeID: "ChIJsQLp1UUVkFQRUpflIwS6nYA",
    lat: 47.621914,
    long: -122.351643
}, {
    name: "SIFF Cinema Uptown",
    filterTags: ["", "entertainment"],
    flickrQuery: "siff cinema uptown",
    address: "511 Queen Anne Ave N, Seattle, WA 98109",
    placeID: "ChIJ_9Uf00YVkFQRJodvoY303WY",
    lat: 47.623617,
    long: -122.356978
}, {
    name: "Experience Music Project Museum",
    filterTags: ["", "entertainment", "music"],
    flickrQuery: "experience music project",
    placeID: "ChIJY8p6-EYVkFQREthJEc0p6dE",
    address: "325 5 th Ave N, Seattle, WA 98109",
    lat: 47.621707,
    long: -122.348518
}, {
    name: "McCaw Hall",
    filterTags: ["", "entertainment", "performing arts", "art", "arts", "ballet"],
    flickrQuery: "mccaw hall seattle",
    placeID: "ChIJ_9Uf00YVkFQRRO2Ymj5Oz7k",
    address: "321 Mercer St, Seattle, WA 98109",
    lat: 47.623948,
    long: -122.350088
}, {
    name: "Seattle Children's Theater",
    filterTags: ["", "entertainment", "performing arts", "art", "arts", "theater"],
    flickrQuery: "seattle children 's theater",
    address: "201 Thomas St, Seattle, WA 98109",
    placeID: "ChIJUdjRsEUVkFQRLeTIPrFLou8",
    lat: 47.620501,
    long: -122.352174
}];

var Location = function(data) {
    this.name = data.name;
    this.favorite = false;
    this.filterTags = data.filterTags;
    this.filterTags.push(this.name.toLowerCase());
    this.lat = data.lat;
    this.long = data.long;
    this.address = data.address;
    this.latLong = {
        lat: this.lat,
        lng: this.long
    };
    this.marker = undefined;
    this.flickrQuery = data.flickrQuery;
    this.placeID = data.placeID;
    this.nickname = data.nickname;

    this.toggleFavorite = function() {
        this.favorite(!this.favorite());
        this.marker().label = "!";
    };
};



var ViewModel = function() {
    var self = this;
    self.markers = [];
    self.flickrPhotos = ko.observableArray([]);
    self.reviews = ko.observableArray([]);
    self.locations = ko.observableArray([]);
    self.activeFilter = ko.observable("");
    this.init = function() {
        locationData.forEach(function(location) {
            self.locations.push(new Location(location));
        });
    };

    this.getFilterTags = function() {
        var filterTagList = [""];
        self.locations().forEach(function(location) {
            location.filterTags.forEach(function(tag) {
                if ($.inArray(tag, filterTagList) === -1) {
                    filterTagList.push(tag);
                }
            });
        });
        return filterTagList;
    };
    this.resetFilter = function() {
        self.activeFilter("");
        self.markers.forEach(function(marker) {
            marker.setVisible(true);
        });
    };

    this.sortLocations = function() {
        self.locations(self.locations().slice().sort(self.locationComparator));
    };

    this.locationComparator = function(x, y) {
        return (x.favorite() === y.favorite()) ? 0 : x.favorite() ? -1 : 1;
    };

    this.filter = function() {
        // If this is a valid filter tag
        if ($.inArray(self.activeFilter(), self.getFilterTags()) != -1 && self.activeFilter != "") {
            self.markers.forEach(function(marker) {
                google.maps.event.trigger(marker, 'filter');
            });
        } else {
            alert("Your filter was invalid!");
        }
    };

    this.checkKeypress = function(e) {
        if (e.which === 13) {
            self.filter();
        }
    };
};

var viewModel = new ViewModel();
viewModel.init();
ko.applyBindings(viewModel);

var View = {
    self: this,
    locElemPaneVisible: false,
    locInfoPaneVisible: false,

    init: function() {
        this.initTypeahead();
    },

    initTypeahead: function() {
        $('#filter-box').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'filterTagList',
            source: substringMatcher(viewModel.getFilterTags())
        });
        $('.typeahead.input-sm').siblings('input.tt-hint').addClass('hint-small');
        $('.typeahead.input-lg').siblings('input.tt-hint').addClass('hint-large');
    },

    toggleLocElemPane: function() {
        if (!this.locElemPaneVisible) {
            $("#loc-elem-pane").animate({
                top: 33
            }, 900);
            this.locElemPaneVisible = true;
        } else {
            this.hideLocElemPane();
        }
    },

    hideLocElemPane: function() {
        $('#loc-elem-pane').animate({
            top: -1000
        }, 1000);
        this.locElemPaneVisible = false;
    },

    toggleLocInfoPane: function(id) {
        if (isFinite(id)) {
            var loc = viewModel.locations()[id];
            this.flickrSearch(loc.flickrQuery);
            this.fetchGoogleReviews(loc.placeID);
        }
        if (!this.locInfoPaneVisible) {
            $("#info-pane").animate({
                left: 0
            }, 1000);
            this.locInfoPaneVisible = true;
        } else {
            this.hideLocInfoPane();
        }
    },

    hideLocInfoPane: function() {
        $('#info-pane').animate({
            left: -2500
        }, 1000);

        // Use set timeout to keep the content from being cleared before the pane is hidden
        setTimeout(this.clearInfoPane, 1000);
        this.locInfoPaneVisible = false;
    },

    favoriteLocation: function(id) {
        viewModel.locations()[id].toggleFavorite();
        $("#" + id).find(".glyphicon-star").toggleClass('favorite');
        viewModel.sortLocations();
    },
    clearInfoPane: function() {
        viewModel.flickrPhotos([]);
        viewModel.reviews([]);
        $("#flickr-photos").empty();
        $('#google-review-holder').empty();
        $('#modals').empty();
    },

    flickrSearch: function(query) {
        var queryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&" +
            "api_key=7a5cd1ee02253a6551f6b0e98bb241f5&text=" + query + "&format=json&per_page=5&" +
            "sort=relevance&privacy_filter=1&nojsoncallback=1";
        var $photoElem = $("#flickr-photos");

        $.getJSON(queryURL, function(data) {
            var $photos = data.photos.photo;

            $photos.forEach(function(photo) {
                viewModel.flickrPhotos.push(new FlickrPhoto(photo));
            });
        }).fail(function() {
            $photoElem.append("Sorry, there was an issue loading photos from flickr!");
        });
    },

    fetchGoogleReviews: function(placeID) {
        if (places === undefined) {
            places = new google.maps.places.PlacesService(map);
        }
        places.getDetails({
            placeId: placeID
        }, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                place.reviews.forEach(function(review) {
                    viewModel.reviews.push(new Review(review));
                });
            } else {
                alert("We could not get google reviews for this location!");
            }
        });
    }
};

function initMap() {
    var myLatLng = {
        lat: 47.6235818,
        lng: -122.3519913
    };

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map($("#main").get(0), {
        draggable: false,
        disableDefaultUI: true,
        center: myLatLng,
        scrollwheel: false,
        controls: false,
        zoom: 15
    });

    var noPoi = [{
        featureType: "poi",
        stylers: [{
            visibility: "off"
        }]
    }];
    map.setOptions({
        styles: noPoi
    });

    // Create markers and set their positions.
    var marker;
    viewModel.locations().forEach(function(location) {
        marker = new google.maps.Marker({
            map: map,
            tags: location.filterTags,
            position: location.latLong,
            title: location.name,
            animation: google.maps.Animation.DROP
        });

        marker.addListener('filter', function() {
            if ($.inArray(viewModel.activeFilter(), this.tags) !== -1) {
                this.setVisible(true);
            } else {
                this.setVisible(false);
            }
        });

        marker.addListener('click', function() {
            var self = this;
            var locID = findWithAttr(viewModel.locations(), 'name', self.title);
            self.setAnimation(google.maps.Animation.BOUNCE);
            View.toggleLocInfoPane(locID);
            setTimeout(function() {
                self.setAnimation(null);
            }, 1000);
        });

        location.marker = marker;
        viewModel.markers.push(marker);
    });
};

var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substrRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};

// Get the ball rolling!
View.init();

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
}
