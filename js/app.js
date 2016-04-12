/**
 * THE CREDITS
 *
 * Typeahead functionality:
 * 		Twttier Team: https://github.com/twitter/typeahead.js
 * 		Nick P (integration w/ Bootstrap 3): http://stackoverflow.com/questions/18059161/css-issue-on-twitter-typeahead-with-bootstrap-3
 * 		Willie Wheeler (width fix): http://stackoverflow.com/questions/17957513/extending-the-width-of-bootstrap-typeahead-to-match-input-field
 *
 * FEATURING ME, for being so great!
 */

//TODO: Create elem pane layout.
//TODO: Foreach (knockout) create loc elems for each location as LIs
//TODO: Rig up filter function and typeahead to the filter box to show hide URLs
//TODO: Add the loc elems to a panel that slides down on hambuger press.
//TODO: Create the info-pane-elem and all its apis
//TODO: When a marker or locelem are clicked the info pane should open fullscreen
/* Note we are hardcoding the required lat/long instead of using
 * google.map.geocoder to reduce the number of ajax calls we make.
 * Please don't ding me, it was a huge pain to get. #TheAPIQuotaIsReal
 */
var locationData = [{
  name: "Dick's Drive-In",
  filterTags: ["food", "burgers", "american"],
  flickrQuery: "dick's drive in Seattle",
  yelpURL: "http://www.yelp.com/biz/dicks-drive-in-seattle-4",
  address: "500 Queen Anne Ave N, Seattle, WA 9810",
  lat: 47.623466,
  long: -122.356383
}, {
  name: "Thai Heaven",
  filterTags: ["food", "thai"],
  flickrQuery: "thai heaven Seattle",
  yelpURL: "http: //www.yelp.com/biz/thai-heaven-seattle",
  address: "352 Roy St, Seattle, WA 98109",
  lat: 47.625587,
  long: -122.349916
}, {
  name: "Roti Cuisine of India",
  filterTags: ["food", "indian"],
  flickrQuery: "Roti Seattle",
  yelpURL: "http: //www.yelp.com/biz/roti-indian-cuisine-seattle",
  address: "530 Queen Anne Ave N, Seattle, WA 98109",
  lat: 47.624234,
  long: -122.356371
}, {
  name: "Bahn Thai",
  filterTags: ["food", "thai"],
  flickrQuery: "bahn thai restaurant Seattle",
  yelpURL: "http: //www.yelp.com/biz/bahn-thai-restaurant-seattle",
  address: "409 Roy St, Seattle, WA 98109",
  lat: 47.625237,
  long: -122.348381
}, {
  name: "Bamboo Garden",
  filterTags: ["food", "chinese", "vegetarian"],
  flickrQuery: "bamboo garden restaurant seattle",
  yelpURL: "http: //www.yelp.com/biz/bamboo-garden-vegetarian-cuisine-seattle",
  address: "364 Roy St, Seattle, WA 98109",
  lat: 47.625607,
  long: -122.349461
}, {
  name: "Seattle Center",
  filterTags: ["entertainment", "outdoor", "kid friendly"],
  flickrQuery: "seattle center",
  yelpURL: "http: //www.yelp.com/biz/seattle-center-seattle",
  address: "305 Harrison St, Seattle, WA 98109",
  lat: 47.621914,
  long: -122.351643
}, {
  name: "SIFF Cinema Uptown",
  filterTags: ["entertainment"],
  flickrQuery: "siff cinema uptown",
  yelpURL: "http: //www.yelp.com/biz/siff-cinema-uptown-seattle",
  address: "511 Queen Anne Ave N, Seattle, WA 98109",
  lat: 47.623617,
  long: -122.356978
}, {
  name: "Experience Music Project Museum",
  filterTags: ["entertainment", "music"],
  flickrQuery: "experience music project",
  yelpURL: "http: //www.yelp.com/biz/emp-museum-seattle",
  address: "325 5 th Ave N, Seattle, WA 98109",
  lat: 47.621707,
  long: -122.348518
}, {
  name: "McCaw Hall",
  filterTags: ["entertainment", "performing arts", "art", "arts", "ballet"],
  flickrQuery: "mccaw hall seattle",
  yelpURL: "http: //www.yelp.com/biz/marion-oliver-mccaw-hall-seattle",
  address: "321 Mercer St, Seattle, WA 98109",
  lat: 47.623948,
  long: -122.350088
}, {
  name: "Seattle Children's Theater",
  filterTags: ["entertainment", "performing arts", "art", "arts", "theater"],
  flickrQuery: "seattle children 's theater",
  yelpURL: "http: //www.yelp.com/biz/seattle-childrens-theatre-seattle",
  address: "201 Thomas St, Seattle, WA 98109",
  lat: 47.620501,
  long: -122.352174
}];

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.filterTags = ko.observableArray(data.filterTags);
  this.lat = ko.observable(data.lat);
  this.long = ko.observable(data.long);
  this.latLong = ko.computed(function() {
    return {
      lat: this.lat(),
      lng: this.long()
    };
  }, this);
  this.flickrQuery = ko.observable(data.flickrQuery);
  this.yelpURL = ko.observable(data.yelpURL);
  this.address = ko.observable(data.address);
  this.nickname = ko.observable(data.nickname);

}


var ViewModel = function() {
  var self = this;
  self.locations = ko.observableArray([]);

  this.init = function(){
    locationData.forEach(function(location) {
      self.locations.push(new Location(location));
    });
  }

  this.getFilterTags = function() {
    var filterTagList = [];
    self.locations().forEach(function(location) {
      location.filterTags().forEach(function(tag) {
        if ($.inArray(tag, filterTagList) == -1) {
          filterTagList.push(tag);
        }
      });
    });
    return filterTagList;
  };
};

var viewModel = new ViewModel();
viewModel.init();
ko.applyBindings(viewModel);

var View = {
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
  var map = new google.maps.Map(document.getElementById('main'), {
    draggable: false,
    disableDefaultUI: true,
    center: myLatLng,
    scrollwheel: false,
    controls: false,
    zoom: 15
  });

  // Create a marker and set its position.
  var marker;
  viewModel.locations().forEach(function(location) {
    marker = new google.maps.Marker({
      map: map,
      position: location.latLong(),
      title: location.name()
    });
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
