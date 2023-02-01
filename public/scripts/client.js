/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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
 * Takes in an array of Tweet Objects and passes them to the createTweetElement function to create the HTML Element
 * for each tweet and prepend them to the 'tweets-container' element.
 *
 * @param {Array} tweets An array of Tweet Objects to render
 */
const renderTweets = function(tweets) {
  for (let i of tweets) {
    const tweet = createTweetElement(i)

    $('#tweets-container').prepend(tweet)
  }
}

/**
 * Makes a GET request to our API endpoint '/tweets' to return a list of Tweets that are currently in the database.
 *
 * @param {Object} callback A callback object that returns an array of Tweet Objects if successful, or an error Object if the GET request fails
 */
const loadTweets = function(callback) {
  $.get('/tweets')
    .then((result) => {
      return callback(null, result)
    }).catch((e) => {
      return callback(e, null)
    })
}

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
const escapeText = function(str) {
  let div = document.createElement("div")
  div.appendChild(document.createTextNode(str))
  const result = div.innerHTML
  $(div).remove()
  return result
}

/**
 * Validates the provided String by testing if the String is null or empty, as well as if the String length
 * is over 140 characters, and returns a String based on the condition met to indicate there is an error with the String.
 * This function is used to check if a new Tweet's text is valid before sending it to the server.
 *
 * @param {String} text The string to validate
 * @returns A String with of the error message, null otherwise
 */
const validateTweet = function(text) {
  if (!text) {
    return "Tweet text is empty"
  } else if (text.length === 0 || text.length > 140) {
    return "Tweet text is too long"
  }
  return null
}

/**
 * Dictates whether the 'new-tweet' element should slide up or down based on the current condition of the element, and to auto focus on the text-area.
 * Simply put, if the 'new-tweet' element is not being shown, perform the slide-down animation to show it to the user, vice-versa.
 * There is also a Boolean to forcefully slide down the 'new-tweet' element, this is because when the user clicks on the 'back-to-top' element,
 * we want the user to automatically be able to type a new tweet after surfacing to the top of the page.
 *
 * @param {Boolean} forceSlideDown Whether the 'new-tweet' HTML element should forcefully slide down
 */
const toggleTweetForm = function(forceSlideDown) {
  const newTweetElement = $('.new-tweet')
  const isSlideDown = newTweetElement.is(':visible')

  if (isSlideDown) {
    if (!forceSlideDown)
      newTweetElement.slideUp({ duration: 500 })
  } else {
    newTweetElement.slideDown({ duration: 500 })
  }
  newTweetElement.find('#tweet-text').focus()
}

$(document).ready(function() {

  // Make a GET request to our '/tweets' endpoint and render the returned tweets
  loadTweets((error, data) => {
    if (error) {
      console.error('Error loading tweets: ', error)
      return
    }
    renderTweets(data)
  })

  // Toggle the HTML element to create a new tweet
  $('.navbar-tweet').click((event) => {
    toggleTweetForm(false)
  })

  $('#publish-tweet-form').submit((event) => {

    // Stop Javascript from submitting the form
    event.preventDefault()

    const tweetErrorElement = $(".tweet-error")
    const tweetTextElement = $("#tweet-text")

    // Slide up the 'tweet-error' error element (if it's being shown)
    tweetErrorElement.slideUp({
      duration: 0
    })

    // Validate the tweet text from the user and display an error message and return if the text is invalid
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

    // Serialize the form data and make a POST request to our API to save the tweet to our database
    const tweetData = $("#publish-tweet-form").serialize()

    // If the request is successful, render the newly returned Tweet Object, or console log the error if there was an error posting
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
