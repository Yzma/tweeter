$(document).ready(function() {
  
  const backToTopElement = $('.back-to-top')
  const scrollThreshold = $('.header').height() + 100
  console.log(scrollThreshold)

  backToTopElement.click(() => {
    $(document).scrollTop(0)
    toggleTweetForm(true)
  })

  $(document).scroll(function() {
    const y = $(this).scrollTop()
    if (y > scrollThreshold) {
      backToTopElement.css('display', 'unset')
    } else {
      backToTopElement.css('display', 'none')
    }
  })
})