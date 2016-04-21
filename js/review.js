function Review(review)
{
    "use strict";
    var date = new Date(review.time);
    this.dateline = ko.observable("Posted on: " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
    this.author = ko.observable(review.author_name);
    this.authorProfilePhoto = ko.observable("http:" + (review.profile_photo_url || "/img/no-avatar.png"));
    this.authorProfileURL = ko.observable(review.author_url);
    this.rating = ko.observable(review.rating);
    this.reviewContent = ko.observable(review.text);
}
