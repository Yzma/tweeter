/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// TODO: Delete console.log when submitting project

/**
 * Generates and returns an HTML Object that represents what a Tweet should look like in the DOM
 *
 * @param {Object} tweet Tweet object
 * @returns An HTML DOM Object that represents a tweet
 */
const createTweetElement = function(tweet) {
  return `
    <article class="tweet">
      <div class="tweet-header">
        <div>
          <img src="${tweet.user.avatars}"/>
          <a>${tweet.user.name}</a>
        </div>
        <a class="tweet-header-username">
          ${tweet.user.handle}
        </a>
      </div>
      <p class="tweet-text">${escapeText(tweet.content.text)}</p>
      <div class="tweet-footer">
        <a>${timeago.format(tweet.created_at, 'en_US')}</a>
        <div class="tweet-icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </div>
    </article>
  `
}

/**
 * TODO: Comment
 * @param {Array} tweets
 */
const renderTweets = function(tweets) {
  for (let i of tweets) {
    const tweet = createTweetElement(i)

    $('#tweets-container').prepend(tweet)
  }
}

/**
 * TODO: Comment
 * @param {Object} callback
 */
const loadTweets = function(callback) {
  $.get('/tweets')
    .then((result) => {
      return callback(null, result)
    }).catch((e) => {
      return callback(e, null)
    })
}

$(document).ready(function() {

  loadTweets((error, data) => {
    if (error) {
      console.error('Error loading tweets: ', error)
      return
    }

    renderTweets(data)
  })

  // TODO: Move this into a separate function, cleanup
  $('.navbar-tweet').click((event) => {
    const tweetErrorElement = $('.new-tweet')
    
    tweetErrorElement.slideToggle({
      duration: 500
    })
    tweetErrorElement.find('#tweet-text').focus()
  })

  $('#publish-tweet-form').submit((event) => {

    event.preventDefault()

    const tweetErrorElement = $(".tweet-error")
    const tweetTextElement = $("#tweet-text")

    tweetErrorElement.slideUp({
      duration: 0
    })
    
    const error = validateTweet(tweetTextElement.val())
    if (error) {
      tweetErrorElement.find('p').html(error)
      tweetErrorElement.slideDown({
        duration: 500,
        start: () => {
          tweetErrorElement.css('display', 'flex')
        }
      })
      return
    }

    const tweetData = $("#publish-tweet-form").serialize()

    $.post('/tweets', tweetData)
      .then((result) => {
        tweetTextElement.val('')
        tweetTextElement.parent().find("#tweet-text-counter").val('140')
        renderTweets([result.tweet])
      }).catch((e) => {
        console.error('Error posting tweet:', e)
      })
  })
})

/**
 * Returns an 'escaped' string that prevents the provided string to execute when rendering to the DOM.
 * This is used to parse user input and display it in HTML without executing it. For example, if the user passed in the following:
 *
 * <script>
 *  console.log('test')
 * </script>
 *
 * If we tried to display that in HTML it would execute. This function ensures the input passed in turns into a String.
 *
 * @param {String} str The string to escape
 * @returns An 'escaped' string
 */

// TODO: Move this to server-side validation. Stop the server from receiving bad input in the first place as well.
const escapeText = function(str) {
  let div = document.createElement("div")
  div.appendChild(document.createTextNode(str))
  const result = div.innerHTML
  $(div).remove()
  return result
}

// TODO: Comment
const validateTweet = function(text) {
  if (!text) {
    return "Tweet text is empty"
  } else if (text.length === 0 || text.length > 140) {
    return "Tweet text is too long"
  }
  return null
}
