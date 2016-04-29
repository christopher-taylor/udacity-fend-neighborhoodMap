function FlickrPhoto(photo)
{
    "use strict";
    this.baseURL = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret;
    this.mobileSrc = this.baseURL + "_m.jpg";
    this.title = photo.title;
    this.src = this.baseURL + ".jpg";
}
