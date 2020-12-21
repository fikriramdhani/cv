/*
* Template Name: Aveo - Responsive vCard WordPress Theme
* Author: lmpixels
* Author URL: http://themeforest.net/user/lmpixels
* Version: 1.2.1
*/

(function($) {
"use strict";
    var body = $('body');
    // Portfolio subpage filters
    function portfolio_init() {
        $( '.portfolio-content' ).each( function() {
            var portfolio_grid_container = $(this),
                portfolio_grid_container_id = $(this).attr('id'),
                portfolio_grid = $('#' + portfolio_grid_container_id + ' .portfolio-grid'),
                portfolio_filter = $('#' + portfolio_grid_container_id + ' .portfolio-filters'),
                portfolio_filter_item = $('#' + portfolio_grid_container_id + ' .portfolio-filters .filter');
                
            if (portfolio_grid) {

                portfolio_grid.shuffle({
                    speed: 450,
                    itemSelector: 'figure'
                });

                $('.site-auto-menu').on("click", "a", function (e) {
                    portfolio_grid.shuffle('update');
                });

                portfolio_filter.on("click", ".filter", function (e) {
                    portfolio_grid.shuffle('update');
                    e.preventDefault();
                    portfolio_filter_item.parent().removeClass('active');
                    $(this).parent().addClass('active');
                    portfolio_grid.shuffle('shuffle', $(this).attr('data-group') );
                });

            }
        })
    }
    // /Portfolio subpage filters

    // Ajax Pages loader
    function ajaxLoader() {
        // Check for hash value in URL
        var ajaxLoadedContent = $('#page-ajax-loaded');

        function showContent() {
            ajaxLoadedContent.removeClass('rotateOutDownRight closed');
            ajaxLoadedContent.show();
            $('body').addClass('ajax-page-visible');
        }

        function hideContent() {
            $('#page-ajax-loaded').addClass('rotateOutDownRight closed');
            $('body').removeClass('ajax-page-visible');
            setTimeout(function(){
                $('#page-ajax-loaded.closed').html('');
                ajaxLoadedContent.hide();
                $('#page-ajax-loaded').append('<div class="portfolio-preloader"><div class="preloader-animation"><div class="preloader-spinner"></div></div></div></div>');
            }, 500);
        }

        $(document)
            .on("click",".site-auto-menu, #portfolio-page-close-button", function (e) { // Hide Ajax Loaded Page on Navigation cleck and Close button
                e.preventDefault();
                hideContent();
            })
            .on("click",".ajax-page-load", function () { // Show Ajax Loaded Page
                var toLoad =  $(this).attr('href') + '?ajax=true';
                showContent();
                ajaxLoadedContent.load(toLoad, function() {
                    // Ajax Loaded Page Scroll
                    $('.portfolio-page-carousel').imagesLoaded(function () {
                        $('.portfolio-page-carousel').owlCarousel({ // Portfolio page carousel
                            smartSpeed:1200,
                            items: 1,
                            loop: true,
                            dots: true,
                            nav: true,
                            navText: false,
                            autoHeight: true,
                            margin: 10
                        });
                    });

                    // Gallery grid init
                    var $gallery_container = $("#portfolio-gallery-grid");
                    $gallery_container.imagesLoaded(function () {
                        $gallery_container.masonry();
                    });

                    $('.portfolio-page-wrapper .portfolio-grid').each(function() {
                        $(this).magnificPopup({
                            delegate: 'a.gallery-lightbox',
                            type: 'image',
                            gallery: {
                              enabled:true
                            }
                        });
                    });

                    lazyVideo();
                });

                return false;
            });
    }
    // /Ajax Pages loader

    // Lazy Loading for YouTube and Vimeo Videos
    function lazyVideo() {
        var youtube = $('.embed-youtube-video'),
            vimeo = $('.embed-vimeo-video');

        youtube.each(function() {
            var video_wrap = $(this),
            id = $(this).attr('data-embed'),
            id = id.split('youtube.com/embed/')[1];

            var thumb_url = "//img.youtube.com/vi/"+id+"/0.jpg";
            $('<img width="100%" src="'+thumb_url+'" />').appendTo($(this));

            $(this).on("click", "div.play-button", function (e) {
                var $video_iframe = $('<iframe class="embed-responsive-item" src="//www.youtube.com/embed/' + id + '?rel=0&showinfo=0&autoplay=1&output=embed" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                $video_iframe.appendTo(video_wrap);
                $(this).hide();
            });
        });

        vimeo.each(function() {
            var video_wrap = $(this),
            id = $(this).attr('data-embed'),
            id = id.split('vimeo.com/video/')[1];

            $('<img class="vimeo-thumb" width="100%" src="" />').appendTo($(this));

            $.getJSON('https://www.vimeo.com/api/v2/video/' + id + '.json?callback=?', {format: "json"}, function(data) {
                $(".vimeo-thumb").attr('src', data[0].thumbnail_large);
            });

            $(this).on("click", "div.play-button", function (e) {
                var $video_iframe = $('<iframe class="embed-responsive-item" src="//player.vimeo.com/video/' + id + '?autoplay=1&loop=1&autopause=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                $video_iframe.appendTo(video_wrap);
                $(this).hide();
            });
        });
    }
    // /Lazy Loading for YouTube and Vimeo Videos

    // Contact form validator
    $(function () {
        $( '.contact-form' ).each( function() {
            var contact_form_id = $(this).attr('id'),
                contact_form = $('#' + contact_form_id + '.contact-form');

            contact_form.validator();

            contact_form.on('submit', function (e) {
                if (!e.isDefaultPrevented()) {

                    $.ajax({
                        type: "POST",
                        url: ajaxurl,
                        data: $(this).serialize()+'&action=aveo_contact_action',
                        success: function (data)
                        {   
                            var result = JSON.parse(data);
                            var messageAlert = 'alert-' + result.type;
                            var messageText = result.message;

                            var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                            if (messageAlert && messageText) {
                                contact_form.find('.messages').html(alertBox);
                                if (messageAlert == "alert-success") {
                                    $('.contact-form')[0].reset();
                                }
                            }
                        },
                    });
                    return false;
                }

            });
        });
    });
    // /Contact form validator

    // Hide Mobile menu
    function mobileMenuHide() {
        var windowWidth = $(window).width(),
            siteHeader = $('#site_header');

        if (windowWidth < 992) {
            siteHeader.addClass('mobile-menu-hide');
            setTimeout(function(){
                siteHeader.addClass('animate');
            }, 500);
        } else {
            siteHeader.removeClass('animate');
        }
    }
    // /Hide Mobile menu

    // Header height
    function headerHeight() {
        setTimeout(function(){
            var windowWidth = $(window).width(),
            subpages = $('.subpages'),
            mainContent = $('#main-content');
            if (windowWidth < 992) {
                mainContent.css( "padding-top", 15 );
                subpages.css( "padding-top", 15 );
            } else {
                var header = $('.header'),
                headerHeight = header.height();
                if ( $('.header').hasClass('sticked') ) {
                    headerHeight = header.height() + 40;
                }
                mainContent.css( "padding-top", headerHeight );
                subpages.css( "padding-top", headerHeight );
            }
        }, 400);
    }
    // Header height

    //On Window load & Resize
    $(window)
        .on('load', function() { //Load
            // Animation on Page Loading
            $(".preloader").fadeOut("fast");
        })
        .on('resize', function() { //Resize
            mobileMenuHide();
            headerHeight();
        })
        .scroll(function () {
            var header = $('.header');
            if ($(window).scrollTop() < 20) {
                header.removeClass('sticked');
            } else {
                header.addClass('sticked');
            }
        });


    // On Document Load
    $(document).on('ready', function() {
         // initializing page transition.
        var ptPage = $('.subpages');
        if (ptPage[0]) {
            PageTransitions.init({
                menu: 'ul.site-auto-menu',
            });
        }
        headerHeight();

        body.stop().animate({ scrollTop: 0 }, 500);
        // Initialize Portfolio grid
        var $portfolio_container = $(".portfolio-grid"),
            $gallery_container = $("#portfolio-gallery-grid");

        $gallery_container.imagesLoaded(function () {
            $gallery_container.masonry();
        });

        $portfolio_container.imagesLoaded(function () {
            portfolio_init(this);
        });

        $('.portfolio-page-carousel').imagesLoaded(function () {
            $('.portfolio-page-carousel').owlCarousel({ // Portfolio page carousel
                smartSpeed:1200,
                items: 1,
                loop: true,
                dots: true,
                nav: true,
                navText: false,
                autoHeight: true,
                margin: 10
            });
        });

        // Portfolio hover effect init
        $(' .portfolio-grid > figure ').each( function() { $(this).hoverdir(); } );

        // Blog grid init
        var $container = $(".blog-masonry");
        $container.imagesLoaded(function () {
            $container.masonry();
        });

        // Mobile menu
        $('.menu-toggle').on("click", function () {
            $('#site_header').addClass('animate');
            $('#site_header').toggleClass('mobile-menu-hide');
        });

        // Mobile menu hide on main menu item click
        $('.site-auto-menu').on("click", "a", function (e) {
            mobileMenuHide();
        });

        // Text rotation
        $('.text-rotation').owlCarousel({
            loop: true,
            dots: false,
            nav: false,
            margin: 10,
            items: 1,
            autoplay: true,
            autoplayHoverPause: false,
            autoplayTimeout: 3800,
            animateOut: 'zoomOut',
            animateIn: 'zoomIn'
        });

        // Lightbox init
        body.magnificPopup({
            fixedContentPos: false,
            delegate: 'a.lightbox',
            type: 'image',
            removalDelay: 300,

            // Class that is added to popup wrapper and background
            // make it unique to apply your CSS animations just to this exact popup
            mainClass: 'mfp-fade',
            image: {
                // options for image content type
                titleSrc: 'title',
                gallery: {
                    enabled: true
                },
            },

            iframe: {
                markup: '<div class="mfp-iframe-scaler">'+
                        '<div class="mfp-close"></div>'+
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                        '<div class="mfp-title mfp-bottom-iframe-title"></div>'+
                      '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button

                patterns: {
                    youtube: {
                      index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                      id: null, // String that splits URL in a two parts, second part should be %id%
                      // Or null - full URL will be returned
                      // Or a function that should return %id%, for example:
                      // id: function(url) { return 'parsed id'; }

                      src: '%id%?autoplay=1' // URL that will be set as a source for iframe.
                    },
                    vimeo: {
                      index: 'vimeo.com/',
                      id: '/',
                      src: '//player.vimeo.com/video/%id%?autoplay=1'
                    },
                    gmaps: {
                      index: '//maps.google.',
                      src: '%id%&output=embed'
                    }
                },

                srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
            },

            callbacks: {
                markupParse: function(template, values, item) {
                 values.title = item.el.attr('title');
                }
            },
        });

        $('.ajax-page-load-link').magnificPopup({
            type: 'ajax',
            removalDelay: 300,
            mainClass: 'mfp-fade',
            gallery: {
                enabled: true
            },
        });

        $('.portfolio-page-wrapper .portfolio-grid').each(function() {
            $(this).magnificPopup({
                delegate: 'a.gallery-lightbox',
                type: 'image',
                gallery: {
                  enabled:true
                }
            });
        });

        $('.form-control').val('');

        $(".form-control").on("focusin", function(){
            $(this).parent('.form-group').addClass('form-group-focus');
        });

        $(".form-control").on("focusout", function(){
            if($(this).val().length === 0) {
                $(this).parent('.form-group').removeClass('form-group-focus');
            }
        });

        $('.pt-page-current').imagesLoaded(function () {
            $(".preloader").fadeOut();
        });

        $('body').append('<div id="page-ajax-loaded" class="page-portfolio-loaded animated rotateInDownRight" style="display: none"><div class="portfolio-preloader"><div class="preloader-animation"><div class="preloader-spinner"></div></div></div></div>');
        ajaxLoader();

        lazyVideo();
    });

})(jQuery);
