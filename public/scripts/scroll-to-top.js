$(document).ready(function() {
  
  const backToTopElement = $('.back-to-top')

  backToTopElement.click(() => {
    $(document).scrollTop(0)
    toggleTweetForm(true)
  })

  $(document).scroll(function() {
    const y = $(this).scrollTop()
    if (y > 400) {
      backToTopElement.css('display', 'unset')
    } else {
      backToTopElement.css('display', 'none')
    }
  })
})