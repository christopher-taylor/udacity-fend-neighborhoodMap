/* Note we are hardcoding the required lat/long instead of using
 * google.map.geocoder to reduce the number of ajax calls we make.
 * Please don't ding me, it was a huge pain to get. #TheAPIQuotaIsReal
 */
var locationData = [{
  name: "Dick's Drive-In",
  flickrQuery: "dick's drive in Seattle",
  yelpURL: "http://www.yelp.com/biz/dicks-drive-in-seattle-4",
  address: "500 Queen Anne Ave N, Seattle, WA 9810",
  lat: 47.623466,
  long: -122.356383
}, {
  name: "Thai Heaven",
  flickrQuery: "thai heaven Seattle",
  yelpURL: "http: //www.yelp.com/biz/thai-heaven-seattle",
  address: "352 Roy St, Seattle, WA 98109",
  lat: 47.625587,
  long: -122.349916
}, {
  name: "Roti Cuisine of India",
  flickrQuery: "Roti Seattle",
  yelpURL: "http: //www.yelp.com/biz/roti-indian-cuisine-seattle",
  address: "530 Queen Anne Ave N, Seattle, WA 98109",
  lat: 47.624234,
  long: -122.356371
}, {
  name: "Bahn Thai",
  flickrQuery: "bahn thai restaurant Seattle",
  yelpURL: "http: //www.yelp.com/biz/bahn-thai-restaurant-seattle",
  address: "409 Roy St, Seattle, WA 98109",
  lat: 47.625237,
  long: -122.348381
}, {
  name: "Bamboo Garden",
  flickrQuery: "bamboo garden restaurant seattle",
  yelpURL: "http: //www.yelp.com/biz/bamboo-garden-vegetarian-cuisine-seattle",
  address: "364 Roy St, Seattle, WA 98109",
  lat: 47.625607,
  long: -122.349461
}, {
  name: "Seattle Center",
  flickrQuery: "seattle center",
  yelpURL: "http: //www.yelp.com/biz/seattle-center-seattle",
  address: "305 Harrison St, Seattle, WA 98109",
  lat: 47.621914,
  long: -122.351643
}, {
  name: "SIFF Cinema Uptown",
  flickrQuery: "siff cinema uptown",
  yelpURL: "http: //www.yelp.com/biz/siff-cinema-uptown-seattle",
  address: "511 Queen Anne Ave N, Seattle, WA 98109",
  lat: 47.623617,
  long: -122.356978
}, {
  name: "Experience Music Project Museum",
  flickrQuery: "experience music project",
  yelpURL: "http: //www.yelp.com/biz/emp-museum-seattle",
  address: "325 5 th Ave N, Seattle, WA 98109",
  lat: 47.621707,
  long: -122.348518
}, {
  name: "McCaw Hall",
  flickrQuery: "mccaw hall seattle",
  yelpURL: "http: //www.yelp.com/biz/marion-oliver-mccaw-hall-seattle",
  address: "321 Mercer St, Seattle, WA 98109",
  lat: 47.623948,
  long: -122.350088
}, {
  name: "Seattle Children's Theater",
  flickrQuery: "seattle children 's theater",
  yelpURL: "http: //www.yelp.com/biz/seattle-childrens-theatre-seattle",
  address: "201 Thomas St, Seattle, WA 98109",
  lat: 47.620501,
  long: -122.352174
}];

var Location = function(data) {
  this.name = ko.observable(data.name);
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

  locationData.forEach(function(location) {
    self.locations.push(new Location(location));
  });
};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

function initMap() {
  var myLatLng = {
    lat: 47.6235818,
    lng: -122.3519913
  };

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('main'), {
    center: myLatLng,
    scrollwheel: false,
    controls: false,
    zoom: 15
  });

  // Create a marker and set its position.
  var marker;
  viewModel.locations().forEach(function(location){
    marker = new google.maps.Marker({
      map: map,
      position: location.latLong(),
      title: location.name()
    });

  });
};
