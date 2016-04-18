// IMPORTANT
// For attribution please see ../THE_CREDITS.js
// /IMPORTANT

//TODO: Create the info-pane-elem and all its apis
//TODO: When a marker or locelem are clicked the info pane should open fullscreen
/* Note we are hardcoding the required lat/long instead of using
 * google.map.geocoder to reduce the number of ajax calls we make.
 * Please don't ding me, it was a huge pain to get. #TheAPIQuotaIsReal
 */
var locationData = [{
    name: "Dick's Drive-In",
    filterTags: ["", "food", "burgers", "american"],
    flickrQuery: "dick's drive in Seattle",
    yelpURL: "http://www.yelp.com/biz/dicks-drive-in-seattle-4",
    address: "500 Queen Anne Ave N, Seattle, WA 9810",
    lat: 47.623466,
    long: -122.356383
}, {
    name: "Thai Heaven",
    filterTags: ["", "food", "thai"],
    flickrQuery: "thai heaven Seattle",
    yelpURL: "http: //www.yelp.com/biz/thai-heaven-seattle",
    address: "352 Roy St, Seattle, WA 98109",
    lat: 47.625587,
    long: -122.349916
}, {
    name: "Roti Cuisine of India",
    filterTags: ["", "food", "indian"],
    flickrQuery: "Roti Seattle",
    yelpURL: "http: //www.yelp.com/biz/roti-indian-cuisine-seattle",
    address: "530 Queen Anne Ave N, Seattle, WA 98109",
    lat: 47.624234,
    long: -122.356371
}, {
    name: "Bahn Thai",
    filterTags: ["", "food", "thai"],
    flickrQuery: "bahn thai restaurant Seattle",
    yelpURL: "http: //www.yelp.com/biz/bahn-thai-restaurant-seattle",
    address: "409 Roy St, Seattle, WA 98109",
    lat: 47.625237,
    long: -122.348381
}, {
    name: "Bamboo Garden",
    filterTags: ["", "food", "chinese", "vegetarian"],
    flickrQuery: "bamboo garden restaurant seattle",
    yelpURL: "http: //www.yelp.com/biz/bamboo-garden-vegetarian-cuisine-seattle",
    address: "364 Roy St, Seattle, WA 98109",
    lat: 47.625607,
    long: -122.349461
}, {
    name: "Seattle Center",
    filterTags: ["", "entertainment", "outdoor", "kid friendly"],
    flickrQuery: "seattle center",
    yelpURL: "http: //www.yelp.com/biz/seattle-center-seattle",
    address: "305 Harrison St, Seattle, WA 98109",
    lat: 47.621914,
    long: -122.351643
}, {
    name: "SIFF Cinema Uptown",
    filterTags: ["", "entertainment"],
    flickrQuery: "siff cinema uptown",
    yelpURL: "http: //www.yelp.com/biz/siff-cinema-uptown-seattle",
    address: "511 Queen Anne Ave N, Seattle, WA 98109",
    lat: 47.623617,
    long: -122.356978
}, {
    name: "Experience Music Project Museum",
    filterTags: ["", "entertainment", "music"],
    flickrQuery: "experience music project",
    yelpURL: "http: //www.yelp.com/biz/emp-museum-seattle",
    address: "325 5 th Ave N, Seattle, WA 98109",
    lat: 47.621707,
    long: -122.348518
}, {
    name: "McCaw Hall",
    filterTags: ["", "entertainment", "performing arts", "art", "arts", "ballet"],
    flickrQuery: "mccaw hall seattle",
    yelpURL: "http: //www.yelp.com/biz/marion-oliver-mccaw-hall-seattle",
    address: "321 Mercer St, Seattle, WA 98109",
    lat: 47.623948,
    long: -122.350088
}, {
    name: "Seattle Children's Theater",
    filterTags: ["", "entertainment", "performing arts", "art", "arts", "theater"],
    flickrQuery: "seattle children 's theater",
    yelpURL: "http: //www.yelp.com/biz/seattle-childrens-theatre-seattle",
    address: "201 Thomas St, Seattle, WA 98109",
    lat: 47.620501,
    long: -122.352174
}];

var Location = function(data) {
    this.name = ko.observable(data.name);
    this.favorite = ko.observable(false);
    this.filterTags = ko.observableArray(data.filterTags);
    this.lat = ko.observable(data.lat);
    this.long = ko.observable(data.long);
    this.latLong = ko.computed(function() {
        return {
            lat: this.lat(),
            lng: this.long()
        };
    }, this);
    this.marker = ko.observable(undefined);
    this.flickrQuery = ko.observable(data.flickrQuery);
    this.yelpURL = ko.observable(data.yelpURL);
    this.address = ko.observable(data.address);
    this.nickname = ko.observable(data.nickname);

    this.toggleFavorite = function() {
        this.favorite(!this.favorite());
        this.marker().label = "!";
    }
}


var ViewModel = function() {
    var self = this;
    self.locations = ko.observableArray([]);
    self.activeFilter = ko.observable("");
    this.init = function() {
        locationData.forEach(function(location) {
            self.locations.push(new Location(location));
        });
    }

    this.getFilterTags = function() {
        var filterTagList = [""];
        self.locations().forEach(function(location) {
            location.filterTags().forEach(function(tag) {
                if ($.inArray(tag, filterTagList) == -1) {
                    filterTagList.push(tag);
                }
            });
        });
        return filterTagList;
    };

    this.sortLocations = function() {
        self.locations(self.locations().slice().sort(self.locationComparator));
    };

    this.locationComparator = function(x, y) {
        return (x.favorite() === y.favorite()) ? 0 : x.favorite() ? -1 : 1;
    };
};

var viewModel = new ViewModel();
viewModel.init();
ko.applyBindings(viewModel);

var View = {
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
            this.clearInfoPane();
            this.flickrSearch(loc.flickrQuery());
        };
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
        this.locInfoPaneVisible = false;
    },

    favoriteLocation: function(id) {
        viewModel.locations()[id].toggleFavorite();
        $("#" + id).find(".glyphicon-star").toggleClass('favorite');
        viewModel.sortLocations();
    },
    clearInfoPane: function() {
        $("#flickr-photos").empty();
        $('#modals').empty();
    },

    flickrSearch: function(query) {
        var queryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&" +
            "api_key=7a5cd1ee02253a6551f6b0e98bb241f5&text=" + query + "&format=json&per_page=10&" +
            "sort=relevance&privacy_filter=1&nojsoncallback=1";
        $photoElem = $("#flickr-photos");
        // $photoElemContent = '';

        $.getJSON(queryURL, function(data) {
            var $photos = data['photos']['photo'];
            var src, mobileSrc, title, imgElem;
            $photos.forEach(function(photo, i) {
                mobileSrc = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_m.jpg";
                title = photo['title'];
                src = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
                imgElem = '<div class="img-viewport" style="background-image: url(' + mobileSrc + ');" data-toggle="modal" data-target="#modal' + i + '">&nbsp;</div>';
                // '<img src="' + mobileSrc + '" />';
                modalElem = '<div class="modal fade" id="modal' + i + '" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body"><img src="' + src + '" style="width:100%;"></div></div></div></div>';
                $photoElem.append(imgElem);
                $('#modals').append(modalElem);
            });
        }).error(function() {
            $photoElem.append("Sorry, there was an issue loading photos from flickr!");
        });
    }
};

function initMap() {
    var myLatLng = {
        lat: 47.6235818,
        lng: -122.3519913
    };

    //TODO: Set up some default zooms based on screen width and set draggable: true and zoomControl:true;
    // console.log($(window).width());
    // if ($(window.width()) )
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map($("#main").get(0), {
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
    var markers = [];
    var marker;
    viewModel.locations().forEach(function(location) {
        marker = new google.maps.Marker({
            map: map,
            tags: location.filterTags(),
            position: location.latLong(),
            title: location.name(),
            animation: google.maps.Animation.DROP,
        });

        marker.addListener('filter', function() {
            var filter = viewModel.activeFilter();

            markers.forEach(function(marker) {
                // Toggle visibility as needed.
                if ($.inArray(filter, marker.tags) != -1) {
                    marker.setVisible(true);
                } else {
                    marker.setVisible(false);
                }
            });
        });

        marker.addListener('clear-filter', function() {
            $("#filter-box").val("");
            markers.forEach(function(marker) {
                marker.setVisible(true);
            });
            viewModel.activeFilter("");
            $("#clear-filter-btn").hide();
        });

        marker.addListener('click', function() {
            var locID = findWithAttr(viewModel.locations(), 'name', this.title);
            View.toggleLocInfoPane(locID);
        });

        location.marker(marker);
        markers.push(marker);
    });


    var runfilter = function() {
        var filter = $("#filter-box").val().toLowerCase();

        // If this is a valid filter tag
        if ($.inArray(filter, viewModel.getFilterTags()) != -1 && filter != "") {
            viewModel.activeFilter(filter);
            google.maps.event.trigger(marker, 'filter');
            $("#clear-filter-btn").show();

        }
    }

    google.maps.event.addDomListener($("#filter-box").get(0), 'keypress', function(e) {
        if (e.which === 13) {
            runfilter();
        }
    });

    // Create a DOM listener that Goole maps can respond to.
    google.maps.event.addDomListener($("#filter-btn").get(0), 'click', function() {
        runfilter();
    });
    google.maps.event.addDomListener($("#clear-filter-btn").get(0), 'click', function() {
        google.maps.event.trigger(marker, 'clear-filter');
    });
};

var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

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
        if (array[i][attr]() === value) {
            return i;
        }
    }
}
