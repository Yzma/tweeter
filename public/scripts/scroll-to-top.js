$(document).ready(function() {
  $('.back-to-top').click((event) => {
    $("html, body").scrollTop(0)
  })

  // TODO: Move this into composer?
  $(document).scroll(function() {
    let y = $(this).scrollTop()
    console.log('y=', y)
    if (y > 400) {
      $('.back-to-top').css('display', 'unset')
    } else {
      $('.back-to-top').css('display', 'none')
    }
  })
})