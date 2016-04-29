function Review(review)
{
    "use strict";
    var date = new Date(review.time);
    this.dateline = "Posted on: " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    this.author = review.author_name;
    this.authorProfilePhoto = "http:" + (review.profile_photo_url || "img/no-avatar.png");
    this.authorProfileURL = review.author_url;
    this.rating = review.rating;
    this.reviewContent = review.text;
}
