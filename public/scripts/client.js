/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const tweetData = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]

const createTweetElement = function(tweet) {
  return `
    <article class="tweet">
      <div class="tweet-header">
        <div>
          <img src="${tweet.user.avatars}"/>
          <a>${tweet.user.name}</a>
        </div>
        <div>
          ${tweet.user.handle}
        </div>
      </div>
      <p class="tweet-text">${tweet.content.text}</p>
      <div class="tweet-footer">
        <a>${tweet.created_at}</a>
        <div class="tweet-icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </div>
    </article>
  `
}

const renderTweets = function(tweets) {
  for (let i of tweets) {
    const tweet = createTweetElement(i)

    console.log(tweet)
    $('.container').append(tweet)
  }
}

$(document).ready(function() {
  renderTweets(tweetData)

  $('#publish-tweet-form').submit(function(event) {

    event.preventDefault()
    const tweetData = $("#publish-tweet-form").serialize()

    $.post('/tweets', tweetData)
      .then(function(morePostsHtml) {
        console.log('Success: ', morePostsHtml)
        // TODO: Render tweet
      }).catch((e) => {
        console.log('error happened - probably empty tweet text')
      })
  })
})
