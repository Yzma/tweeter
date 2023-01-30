$(document).ready(function() {
  $("#tweet-text").on('input', function() {
    //$(this).val().length
    const remainingCharacters = (140 - $(this).val().length)
    if (remainingCharacters < 0) {
      $("#tweet-text-counter").addClass("red")
    } else {
      $("#tweet-text-counter").removeClass("red")
    }
    $("#tweet-text-counter").text(remainingCharacters)
  })
})