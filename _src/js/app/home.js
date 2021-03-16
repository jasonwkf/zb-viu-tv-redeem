// App.page = () => {
//   console.log('page home')
// }

// App.page.scrollTo = () => {
//   let scrollToSection = (event) => {
//     event.preventDefault()
//     let top = $('.sec-intro').first().offset().top

//     TweenMax.to(window, 0.8, { scrollTo: { y: top }, ease: Expo.easeInOut })
//   }

//   $('.learnmore-content').on('click', scrollToSection)
// }

// App.page.counter = () => {
//   let interval = 1000
//   let duration

//   let showView = (isClosed) => {
//     if (isClosed) {
//       $('.js-ended').removeClass('d-none')
//     } else {
//       $('.js-countdown').removeClass('d-none')
//     }

//     $('.js-loading').addClass('d-none')
//   }

//   let updateCounter = () => {
//     duration = moment.duration(duration - interval, 'milliseconds')
//     $('#week h4').html(Math.round(duration.asWeeks()))
//     $('#day h4').html(duration.days())
//     $('#hour h4').html(duration.hours())
//     $('#minute h4').html(duration.minutes())
//     $('#second h4').html(duration.seconds())
//     // console.log(duration.months(), duration.days(), duration.hours(), duration.minutes(), duration.seconds())
//   }

//   let initCounter = (endDate) => {
//     let closingDate = moment(endDate, 'YYYY/MM/DD').format('YYYYMMDD')
//     let eventTime = moment(closingDate).unix()
//     let currentTime = moment().unix()
//     let diffTime = eventTime - currentTime
//     duration = moment.duration(diffTime * 1000, 'milliseconds')

//     updateCounter()
//     $('.counter').addClass('is-active')
//     setInterval(updateCounter, interval)
//   }

//   if ($('.is-prod').length || $('.is-dev').length) {
//     console.log('use backend api')
//     axios.get(App.api.GET_ENTRY_DURATION)
//       .then((response) => {
//         if (response.status === 200) {
//           initCounter(response.data.endDate)
//           showView(response.data.ended)
//         }
//       })
//   } else {
//     console.log('proceed without backend api')
//     initCounter('2020/01/20')
//     showView(false)
//   }
// }

// App.page()
// App.page.counter()
// App.page.scrollTo()
