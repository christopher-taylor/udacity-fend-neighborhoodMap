function FlickrPhoto(photo)
{
    "use strict";
    this.mobileSrc = ko.observable("http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_m.jpg");
    this.title = ko.observable(photo.title);
    this.src = ko.observable("http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg");
}
