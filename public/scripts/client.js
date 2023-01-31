/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// TODO: Delete console.log when submitting project

let toggleActive = false

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

const renderTweets = function(tweets) {
  for (let i of tweets) {
    const tweet = createTweetElement(i)

    console.log(tweet)
    $('#tweets-container').prepend(tweet)
  }
}

const loadTweets = function(callback) {
  $.get('/tweets')
    .then((result) => {
      console.log('Success: ', result)
      return callback(null, result)
    }).catch((e) => {
      console.log('error happened - probably empty tweet text')
      return callback(e, null)
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

    const tweetText = $("#tweet-text").val()
    if (!tweetText || tweetText.length === 0 || tweetText.length > 140) {
      playTweetErrorAnimation(500, 4000)
      return
    }

    const tweetData = $("#publish-tweet-form").serialize()

    $.post('/tweets', tweetData)
      .then((result) => {
        console.log('Success: ', result)
        
        renderTweets([result.tweet])
      }).catch((e) => {
        console.log('error happened - probably empty tweet text')
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
const escapeText = function(str) {
  let div = document.createElement("div")
  div.appendChild(document.createTextNode(str))
  const result = div.innerHTML
  $(div).remove()
  return result
}

/**
 * TODO: Write description
 * @param {Integer} slideDuration The time (in milliseconds) the slide animation will take to play
 * @param {Integer} timeoutToClose The time (in milliseconds) it will take to toggle the slide animation
 */
const playTweetErrorAnimation = function(slideDuration, timeoutToClose) {
  const tweetErrorElement = $(".tweet-error")
  if (!toggleActive) {
    tweetErrorElement.slideToggle({
      duration: 500,
      start: () => {
        toggleActive = true
        $('.tweet-error').css('display', 'flex')
      },
      complete: () => {
        setTimeout(() => {
          toggleActive = false
          tweetErrorElement.slideToggle({
            duration: 500
          })
        }, 4000)
      }
    })
  }
}

// TODO: Delete comment
// $(".tweet-error").slideDown({
//   duration: 500,
//   start: () => {
//     $('.tweet-error').css('display', 'flex')
//   },
// })

// setTimeout(() => {
//   $(".tweet-error").slideUp({
//     duration: 500,
//     start: function() {
//       $('.tweet-error').css('display', 'flex')
//     }
//   })
// }, 4000)