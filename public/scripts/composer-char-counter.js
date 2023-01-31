$(document).ready(function() {
  $("#tweet-text").on('input', function() {
    const remainingCharacters = (140 - $(this).val().length)
    const tweetTextCounter = $(this).parent().find("#tweet-text-counter")
    if (remainingCharacters < 0) {
      tweetTextCounter.addClass("red")
    } else {
      tweetTextCounter.removeClass("red")
    }
    tweetTextCounter.text(remainingCharacters)
  })
})