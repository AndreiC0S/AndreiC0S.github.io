// let body = document.querySelector('body');
// let checkbox = document.getElementById("toggle--daynight");

// window.onload = function () {
//   console.log('Dark mode status:', localStorage.getItem('darkMode'));
//   updateTheme();
// }

// function updateTheme() {
//   let darkModeEnabled = localStorage.getItem('darkMode');
//   // body.setAttribute('class', darkModeEnabled ? 'Dark' : 'Light');
//   // checkbox.checked = darkModeEnabled; // Set the checkbox state based on dark mode
//   console.log(darkModeEnabled)
// }




//   checkbox.addEventListener('click', function () {
//     if (body.classList.contains('Light')) {
//       body.setAttribute('class', 'Dark');
//       localStorage.setItem('darkMode', 'enable');
//     } else {
//       body.setAttribute('class', 'Light');
//       localStorage.setItem('darkMode', 'disable');
//     }
//     checkbox.checked = body.classList.contains('Dark');
//   });
document.addEventListener('DOMContentLoaded', function () {
  let body = document.querySelector('body');
  let checkbox = document.getElementById("toggle--daynight");

  function updateTheme() {
    let darkModeEnabled = localStorage.getItem('darkMode') === 'enable';
    body.setAttribute('class', darkModeEnabled ? 'Dark' : 'Light');
    checkbox.checked = darkModeEnabled; // Set the checkbox state based on dark mode
  }

  console.log('Dark mode status:', localStorage.getItem('darkMode'));
  updateTheme();

  
    checkbox.addEventListener('click', function () {
      if (body.classList.contains('Light')) {
        body.setAttribute('class', 'Dark');
        localStorage.setItem('darkMode', 'enable');
      } else {
        body.setAttribute('class', 'Light');
        localStorage.setItem('darkMode', 'disable');
      }
      checkbox.checked = body.classList.contains('Dark');
    });
  
});
//=========================================================


(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 0.5
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Header fixed top on scroll
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop
    let nextElement = selectHeader.nextElementSibling
    const headerFixed = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('fixed-top')
        nextElement.classList.add('scrolled-offset')
      } else {
        selectHeader.classList.remove('fixed-top')
        nextElement.classList.remove('scrolled-offset')
      }
    }
    window.addEventListener('load', headerFixed)
    onscroll(document, headerFixed)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  const slideIn = () => {
    if (window.innerWidth <= 340) {
      select('#navMob').classList.remove('bi-list')
      select('#navMob').classList.add('bi-x')
      select('#nav-ul').classList.remove('slideOut')
      select('#nav-ul').classList.add('slideIn')
      select('#navbar').classList.add('navbar-mobile')
    } else if ((window.innerWidth > 340) && (window.innerWidth <= 1120)) {
      select('#navMob').classList.remove('bi-list')
      setTimeout(() => {
        select('#navMob').classList.add('bi-x')
        
      }, '400');
      
      select('#nav-ul').classList.remove('slideOutMed')
      select('#nav-ul').classList.add('slideInMed')
      select('#navbar').classList.add('navbar-mobile')
    }
  }
  const slideOut = () => {
    if (window.innerWidth <= 340) {
      
      select('#navMob').classList.remove('bi-x')
      select('#nav-ul').classList.add('slideOut')
      select('#nav-ul').classList.remove('slideIn')
      
      setTimeout(() => {
        select('#navbar').classList.remove('navbar-mobile')
        select('#navMob').classList.add('bi-list')
      }, '300');
    } else if ((window.innerWidth > 340) && (window.innerWidth <= 1120)) {

      select('#navMob').classList.remove('bi-x')
      select('#nav-ul').classList.add('slideOutMed')
      select('#nav-ul').classList.remove('slideInMed')

      setTimeout(() => {
        select('#navbar').classList.remove('navbar-mobile')

        select('#navMob').classList.add('bi-list')
        // select('#navMob').classList.remove('bi-x')
      }, '100');
    }
  }

  // if (window.innerWidth <= 340) {
  on('click', '#navMob', function (e) {
    // select('#navMob').classList.remove('bi-list')
    // select('#navMob').classList.add('bi-x')
    if (select('#navMob').classList.contains('bi-list')) {

      slideIn()

    } else {
      slideOut()

    }
  })
  /**
   * Mobile nav dropdowns activate
   */
  // on('click', '.navbar .dropdown > a', function (e) {
  //   if (select('#navbar').classList.contains('navbar-mobile')) {
  //     e.preventDefault()
  //     this.nextElementSibling.classList.toggle('dropdown-active')
  //   }
  // }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      console.log(this.hash)
      e.preventDefault()
      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        slideOut()
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function (direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });
  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()