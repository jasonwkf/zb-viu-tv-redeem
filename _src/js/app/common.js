// let App = {
//   protocol: 'http://localhost:8090', // initialize later in common()
//   api: {}, // initialize later in common()
//   var: {
//     breakpoints: {
//       xs: {
//         min: 0,
//         max: 575
//       },
//       sm: {
//         min: 576,
//         max: 767
//       },
//       md: {
//         min: 768,
//         max: 991
//       },
//       lg: {
//         min: 992,
//         max: 1199
//       },
//       xl: {
//         min: 1200,
//         max: 1439
//       },
//       xxl: {
//         min: 1440,
//         max: Infinity
//       }
//     }
//   },
//   util: {
//     // disablePageScroll: scrollLock.disablePageScroll,
//     // enablePageScroll: scrollLock.enablePageScroll,
//     getViewport: () => {
//       // Get correct viewport
//       // - http://stackoverflow.com/questions/1766861/find-the-exact-height-and-width-of-the-viewport-in-a-cross-browser-way-no-proto
//       let viewPortWidth
//       let viewPortHeight
//       if (typeof window.innerWidth !== 'undefined') {
//         // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
//         viewPortWidth = window.innerWidth
//         viewPortHeight = window.innerHeight
//       } else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth !== 0) {
//         // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
//         viewPortWidth = document.documentElement.clientWidth
//         viewPortHeight = document.documentElement.clientHeight
//       } else {
//         // older versions of IE
//         viewPortWidth = document.getElementsByTagName('body')[0].clientWidth
//         viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
//       }
//       return { w: viewPortWidth, h: viewPortHeight }
//     },
//     throttle: (func, wait, options) => {
//       // throttle function from underscore.js
//       // - http://stackoverflow.com/questions/27078285/simple-throttle-in-js
//       // ====================================================================
//       // let throttled = App.util.throttle(onWindowResize, 100)
//       // $(window).on('resize', throttled)
//       // ====================================================================
//       let context, args, result
//       let timeout = null
//       let previous = 0
//       if (!options) options = {}
//       let later = function () {
//         previous = options.leading === false ? 0 : Date.now()
//         timeout = null
//         result = func.apply(context, args)
//         if (!timeout) context = args = null
//       }
//       return function () {
//         let now = Date.now()
//         if (!previous && options.leading === false) previous = now
//         let remaining = wait - (now - previous)
//         context = this
//         args = arguments
//         if (remaining <= 0 || remaining > wait) {
//           if (timeout) {
//             clearTimeout(timeout)
//             timeout = null
//           }
//           previous = now
//           result = func.apply(context, args)
//           if (!timeout) context = args = null
//         } else if (!timeout && options.trailing !== false) {
//           timeout = setTimeout(later, remaining)
//         }
//         return result
//       }
//     }
//   },
//   selector: {
//     BODY: $('body')
//   },
//   common: () => {
//     // console.log('some common scripts')
//   }
// }

// App.common.apiInit = () => {
//   if ($('.is-dev').length) {
//     App.protocol = 'https://dev-contest-api.photonico.asia'
//   }

//   if ($('.is-prod').length) {
//     App.protocol = 'https://contest-api.photonico.asia'
//   }

//   App.api.CREATE_CONTENT_ENTRY = App.protocol + '/rest/entry/submit'
//   App.api.GET_ENTRY_PHOTO_DETAIL = App.protocol + '/rest/entry/photo/'
//   App.api.GET_ENTRY_PHOTO_LIST = App.protocol + '/rest/entry/photo'
//   App.api.GET_ENTRY_DURATION = App.protocol + '/rest/entry/duration'

//   // console.log('some common function')
// }

// App.common.highlightLink = () => {
//   let pathname = window.location.pathname
//   let k = pathname.lastIndexOf('/')
//   let url = pathname.substring(k + 1)

//   $('#navbarToggler .nav-link').each((i, el) => {
//     let str = $(el).attr('href')
//     let n = str.lastIndexOf('/')
//     let href = str.substring(n + 1)

//     if (href === url) {
//       $(el).addClass('is-active')
//     }
//   })
// }

// App.common.lazyLoad = () => {
//   new LazyLoad({
//     elements_selector: '.lazy'
//   })
// }

// App.common()
// App.common.apiInit()
// App.common.highlightLink()
// App.common.lazyLoad()
