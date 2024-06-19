// "use strict";
// document.addEventListener("DOMContentLoaded", function() {
    
//     var openVideoPopup = document.getElementById("openVideoPopup");
//     var videoPopup = document.getElementById("videoPopup");
//     var closePopup = document.getElementsByClassName("close")[0];
//     var videoFrame = document.getElementById("videoFrame");

    
//     openVideoPopup.addEventListener("click", function(event) {
//         event.preventDefault(); 
//         videoPopup.style.display = "block";
      
//         videoFrame.src = "https://www.youtube.com/embed/upDLs1sn7g4?autoplay=1";
//     });

  
//     closePopup.addEventListener("click", function() {
//         videoPopup.style.display = "none";
     
//         videoFrame.src = "";
//     });

   
//     window.addEventListener("click", function(event) {
//         if (event.target == videoPopup) {
//             videoPopup.style.display = "none";
        
//             videoFrame.src = "";
//         }
//     });

   
//     videoFrame.addEventListener("load", function() {
      
//         videoFrame.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
//     });
// });

// $(document).ready(function () {
	

// 	/*ScrollUp*/
// 	if (!!$.prototype.scrollUp) {
// 		$.scrollUp();
// 	}
//   /* Responsive Navigation */
//   $("#nav-mobile").html($("#nav-main").html());
//   $("#nav-trigger span").on("click", function() {
//       if ($("nav#nav-mobile ul").hasClass("expanded")) {
//           $("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
//           $(this).removeClass("open");
//       } else {
//           $("nav#nav-mobile ul").addClass("expanded").slideDown(250);
//           $(this).addClass("open");
//       }
//   });

//   $("#nav-mobile ul a").on("click", function() {
//       if ($("nav#nav-mobile ul").hasClass("expanded")) {
//           $("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
//           $("#nav-trigger span").removeClass("open");
//       }
//   });

//   /* Sticky Navbar Logic */
//   var header = $("#header");
//   var sticky = $('#banner').height() - 5;

//   $(window).scroll(function() {
//       if ($(window).scrollTop() > sticky) {
//           header.addClass("nav-solid fadeInDown");
//       } else {
//           header.removeClass("nav-solid fadeInDown");
//       }
//   });

//   let navbarlinks = $('#nav-main');
//   console.log('navbarlinks ', navbarlinks)
//   navbarlinks.on('click', function(event) {
//         console.log(event)
//         let target = this.hash;
//         if (target) {
//             event.preventDefault();
//             $('html, body').animate({
//                 scrollTop: $(target).offset().top
//             }, 800, function() {
//                 window.location.hash = target;
//             });
//         }
//     });

//     function updateNavbarLinksActive() {
//         let position = $(window).scrollTop() + 200;

//         navbarlinks.each(function() {
//             let navbarlink = $(this);
//             let sectionSelector = navbarlink.attr('href');
//             if (sectionSelector && sectionSelector !== '#') {
//                 let section = $(sectionSelector);
//                 if (section.length) {
//                     if (position >= section.offset().top && position <= (section.offset().top + section.outerHeight())) {
//                         navbarlink.addClass('active');
//                     } else {
//                         navbarlink.removeClass('active');
//                     }
//                 }
//             }
//         });
//     }

//     $(window).on('scroll', updateNavbarLinksActive).trigger('scroll');
// //   /* Update active navbar links based on scroll position */
// //   let navbarlinks = $('#navbar .scrollto');

// //   function updateNavbarLinksActive() {
// //       let position = $(window).scrollTop() + 200;

// //       navbarlinks.each(function() {
// //           let navbarlink = $(this);
// //           let sectionSelector = navbarlink.attr('href');
// //           if (sectionSelector && sectionSelector !== '#') {
// //               let section = $(sectionSelector);
// //               if (section.length) {
// //                   if (position >= section.offset().top && position <= (section.offset().top + section.outerHeight())) {
// //                       navbarlink.addClass('active');
// //                   } else {
// //                       navbarlink.removeClass('active');
// //                   }
// //               }
// //           }
// //       });
// //   }

// //   $(window).on('scroll', updateNavbarLinksActive).trigger('scroll');

//   /* Smooth Scrolling */
//   navbarlinks.on('click', function(event) {
//       let target = this.hash;
//       if (target) {
//           event.preventDefault();
//           $('html, body').animate({
//               scrollTop: $(target).offset().top
//           }, 800, function() {
//               window.location.hash = target;
//           });
//       }
//   });



    
// });


// /* Preloader and animations */

// $(window).on('load', function () {
//     $('#status').fadeOut();
//     $('#preloader').delay(350).fadeOut('slow');
//     $('body').delay(350).css({'overflow-y': 'visible'});

//     /* WOW Elements */
//     if (typeof WOW == 'function') {
//         new WOW().init();
//     }

//     // /* Parallax Effects */
//     if (!!$.prototype.enllax) {
//         $(window).enllax();
//     }
// });

"use strict";
document.addEventListener("DOMContentLoaded", function() {
    
    var openVideoPopup = document.getElementById("openVideoPopup");
    var videoPopup = document.getElementById("videoPopup");
    var closePopup = document.getElementsByClassName("close")[0];
    var videoFrame = document.getElementById("videoFrame");

    openVideoPopup.addEventListener("click", function(event) {
        event.preventDefault(); 
        videoPopup.style.display = "block";
        videoFrame.src = "https://www.youtube.com/embed/upDLs1sn7g4?autoplay=1";
    });

    closePopup.addEventListener("click", function() {
        videoPopup.style.display = "none";
        videoFrame.src = "";
    });

    window.addEventListener("click", function(event) {
        if (event.target == videoPopup) {
            videoPopup.style.display = "none";
            videoFrame.src = "";
        }
    });

    videoFrame.addEventListener("load", function() {
        videoFrame.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    });
});

$(document).ready(function () {
    
    /*ScrollUp*/
    if (!!$.prototype.scrollUp) {
        $.scrollUp();
    }

    /* Responsive Navigation */
    $("#nav-mobile").html($("#nav-main").html());
    $("#nav-trigger span").on("click", function() {
        if ($("nav#nav-mobile ul").hasClass("expanded")) {
            $("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
            $(this).removeClass("open");
        } else {
            $("nav#nav-mobile ul").addClass("expanded").slideDown(250);
            $(this).addClass("open");
        }
    });

    $("#nav-mobile ul a").on("click", function() {
        if ($("nav#nav-mobile ul").hasClass("expanded")) {
            $("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
            $("#nav-trigger span").removeClass("open");
        }
    });

    /* Sticky Navbar Logic */
    var header = $("#header");
    var sticky = $('#banner').height() - 5;

    $(window).scroll(function() {
        if ($(window).scrollTop() > sticky) {
            header.addClass("nav-solid  fadeInDown");
        } else {
            header.removeClass("nav-solid  fadeInDown");
        }
    });

    /* Update active navbar links based on scroll position */
    let navbarlinks = $('nav a');

    function updateNavbarLinksActive() {
        let position = $(window).scrollTop() + 200;

        navbarlinks.each(function() {
            let navbarlink = $(this);
            let sectionSelector = navbarlink.attr('href');
            if (sectionSelector && sectionSelector !== '#') {
                let section = $(sectionSelector);
                if (section.length) {
                    if (position >= section.offset().top && position <= (section.offset().top + section.outerHeight())) {
                        navbarlink.addClass('active');
                    } else {
                        navbarlink.removeClass('active');
                    }
                }
            }
        });
    }

    $(window).on('scroll', updateNavbarLinksActive).trigger('scroll');

    let startBtn = $('#startBtn')
    startBtn.on('click', function(event) {
        let target = this.hash;
        if (target) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 800, function() {
                window.location.hash = target;
            });
        }
    });

    /* Smooth Scrolling */
    navbarlinks.on('click', function(event) {
        let target = this.hash;
        if (target) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 800, function() {
                window.location.hash = target;
            });
        }
    });
});

/* Preloader and animations */
$(window).on('load', function () {
    $('#status').fadeOut();
    $('#preloader').delay(350).fadeOut('slow');
    $('body').delay(350).css({'overflow-y': 'visible'});

    /* WOW Elements */
    if (typeof WOW == 'function') {
        new WOW().init();
    }

    /* Parallax Effects */
    if (!!$.prototype.enllax) {
        $(window).enllax();
    }
});
