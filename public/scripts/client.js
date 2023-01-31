/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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

const loadTweets = function(callback) {
  $.get('/tweets')
    .then((result) => {
      console.log('Success: ', result)
      return callback(null, result)
    }).catch((e) => {
      console.log('error happened - probably empty tweet text')
      return error(e, null)
    })
}

$(document).ready(function() {

  loadTweets((error, data) => {
    if (error) {
      console.log('Error found: ', error)
      return
    }

    console.log('loadTweets data:', data)
    renderTweets(data)
  })
  
  $('#publish-tweet-form').submit((event) => {

    event.preventDefault()
    const tweetData = $("#publish-tweet-form").serialize()

    $.post('/tweets', tweetData)
      .then((result) => {
        console.log('Success: ', result)
        // TODO: Render tweet
      }).catch((e) => {
        console.log('error happened - probably empty tweet text')
      })
  })
})
