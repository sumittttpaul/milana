"use strict";

(function ($) {

	// scrollbar width
	function getScrollbarWidth() {
		let outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar";
		document.body.appendChild(outer);
		let widthNoScroll = outer.offsetWidth;
		outer.style.overflow = "scroll";
		let inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);
		let widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild(outer);
		return widthNoScroll - widthWithScroll;
	}

	var Theme = {};

	// initialization
	Theme.initialization = {
		init(){
			this.checkDevice();
			if ($('.js-mln-slider').length) this.mainSlider();
			if ($('.js-counter').length) this.counter('.js-counter');
			if ($('[data-slick]').length) this.allSlick('[data-slick]');
			if ($('[data-trunk]').length) this.trunkText('[data-trunk]');
			if ($('.form-toggle').length) this.toggleForm('.form-toggle a');
			if ($('[data-toggle="tooltip"]').length) this.toooltip('[data-toggle="tooltip"]');
			if ($('.js-product-item-scroll').length) this.scrollProductHeight({obj: '.js-product-item-scroll'});
			if ($('.nicescroll').length) this.pScroll('.nicescroll');
			if ($('.pscroll').length) this.pScroll('.pscroll');
			if ($('.google-map-container').length) this.googleMap('google-map', 17, 29.43925418642114, -98.4858978926544);
			if ($('.js-gallery').length) this.gallery();
			if ($('[data-toggle=popover]').length) this.popoverHtml('[data-toggle=popover]');
			if ($('[data-color]').length) this.dataColor('[data-color]');
			if ($('.js-collection-slider').length) this.sliderCollection();
			if ($('.js-instagram-feed').length) this.instagramFeed('.js-instagram-feed');
			if ($('.product-grid-hor-scroll').length) this.horizontalTabScroll('.tab-pane', '.product-grid-hor-scroll');
			if ($('.js-back-to-top').length) this.backToTop('.js-back-to-top');
			if ($('.js-xmove-cursor').length) this.imageXMove('.js-xmove-cursor');
			if ($('.js-ymove-cursor').length) this.imageYMove('.js-ymove-cursor');
			if ($('#newsLetterModal').length) this.modalNewsLetter('#newsLetterModal', '#newsLetterModalCheckBox');
			if ($('.modal[data-animate-start]').length) this.modalAnimation('.modal[data-animate-start]');
			this.pageTitleTopMargin('.section-breadcrumb', '.section-pagetitle-with-bg');
			this.accordionToggle();
			if ($('iframe').length) this.responsiveIframe();
			if ($('#contactForm').length) this.contactForm('#contactForm');
		},
		contactForm(form){
			let $contactForm = $(form)
			$contactForm.validator().on('submit', function (e) {
				if (!e.isDefaultPrevented()) {
					e.preventDefault();
					$contactForm.ajaxSubmit({
						type: "POST",
						data: $contactForm.serialize(),
						url: "php/process-contact.php",
						success: function success() {
							$('.success-confirm', $contactForm).fadeIn();
							$contactForm.get(0).reset();
						},
						error: function error() {
							$('.error-confirm', $contactForm).fadeIn();
						}
					})
				}
			})
		},
		checkDevice(){
			let isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
			if (navigator.userAgent.indexOf('Windows') > 0) {
				$body.addClass('win');
				isTouchDevice = false;
			}
			if (isTouchDevice) {
				$body.addClass('touch');
			}
			if (navigator.userAgent.indexOf('Mac') > 0) {
				$body.addClass('mac');
			}
			if (navigator.userAgent.match(/Android/)) {
				$body.addClass('android');
			}
			if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
				$body.addClass('ie');
				$('[data-srcset]').each(function () {
					let img = $(this).attr('data-srcset');
					$(this).attr('data-src', img)
				})
				$('[data-bgset]').each(function () {
					let img = $(this).attr('data-bgset');
					$(this).css('backgroundImage', 'url(' + img + ')');
				})
			}
		},
		responsiveIframe(){
			$('iframe').each(function () {
				if (!$(this).closest('.mln-slider').length && !$(this).parent().hasClass('embed-responsive') && this.src.indexOf('youtube') != -1) {
					$(this).wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
				}
			});
		},
		modalAnimation(modal){
			$(modal).on('show.bs.modal', function () {
				$(this).find('.modal-dialog').attr('class', 'modal-dialog  ' + $(this).attr('data-animate-start') + '  animated');
			})
			$(modal).on('hide.bs.modal', function () {
				$(this).find('.modal-dialog').attr('class', 'modal-dialog  ' + $(this).attr('data-animate-end') + '  animated');
			})
		},
		modalNewsLetter(modal, checkbox) {
			let $modal = $(modal),
				$checkBox = $(checkbox);

			function checkCookie() {
				//if ($.cookie('ThemeNewsLetterModal') != 'yes') {
				openNewsletterModal();
				//}
			}

			function openNewsletterModal() {
				setTimeout(function () {
					$modal.modal('show');
				}, $modal.attr('data-pause') > 0 ? $modal.attr('data-pause') : 2000);
			}

			$checkBox.change(function () {
				if ($(this).is(':checked')) {
					$.cookie('ThemeNewsLetterModal', 'yes', {
						expires: parseInt($modal.attr('data-expires'), 10)
					});
				} else {
					$.cookie('ThemeNewsLetterModal', null, {
						path: '/'
					});
				}
			});
			checkCookie();
		},
		imageXMove(obj) {
			let lFollowX = 0,
				x = 0,
				friction = 1 / 30,
				$obj = $(obj);

			function moveImage() {
				x += (lFollowX - x) * friction;
				let translate = 'translateX(' + x + 'px)';
				$('img', $obj).css({
					'-webit-transform': translate,
					'-moz-transform': translate,
					'transform': translate
				});
				window.requestAnimationFrame(moveImage);
			}

			$obj.on('mousemove', function (e) {
				let lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
				lFollowX = (20 * lMouseX) / 100;
			});
			moveImage();
		},
		imageYMove(obj) {
			let lFollowY = 0,
				y = 0,
				friction = 1 / 30,
				$obj = $(obj);

			function moveImage() {
				let translate;
				y += (lFollowY - y) * friction;
				$('img', $obj).each(function (idx) {
					if (idx % 2 === 0) {
						translate = 'translateY(-' + y + 'px) scale(1.1)';
					} else {
						translate = 'translateY(' + y + 'px) scale(1.1)';
					}
					$(this).css({
						'-webit-transform': translate,
						'-moz-transform': translate,
						'transform': translate
					});
				})
				window.requestAnimationFrame(moveImage);
			}

			$obj.on('mousemove', function (e) {
				let lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
				lFollowY = (20 * lMouseY) / 100;
			});
			moveImage();
		},
		backToTop(button) {
			let $button = $(button);
			if ($(window).scrollTop() > windowH / 2) {
				$button.addClass('is-visible');
			}
			$(window).scroll(function () {
				if ($(this).scrollTop() > windowH / 2) {
					$button.addClass('is-visible');
				} else {
					$button.removeClass('is-visible');
				}
			});

			function scrollToTop() {
				$body.addClass('blockSticky');
				let speed = $(window).scrollTop() / 4 > 500 ? $(window).scrollTop() / 4 : 500;
				if (mobileHeader) {
					speed = speed * 2;
				}
				$("html, body").animate({
					scrollTop: 0
				}, speed, function () {
					$body.removeClass('blockSticky');
				});
			}

			$button.on('click', function (e) {
				scrollToTop();
				e.preventDefault();
			});
		},
		mainSlider(){
			Theme.mainslider = {
				options: {
					slider: '.js-mln-slider',
					media: '.mln-slide-media',
					thumbs: '.js-mln-slider-thumbs',
					sizeArray: {"576": "800/800", "768": "1000/800", "1200": "1600/1000", "default": "fullheight"}
				},
				init(options) {
					$.extend(this.options, options);
					this._setHeight();
					this._animate();
					this._thumbnails();
					if ($('.main-content').find('.container-wrap').first().find(this.options.slider)) {
						$body.addClass('has-slider')
					}
				},
				reinit(){
					$(this.options.slider).find('.slick-active .animation').addClass('animated');
					this._setHeight();
					this._resizePlayer($(this.options.slider).find(this.options.media), 16 / 9);
				},
				_animate(){
					let that = this,
						$slider = $(that.options.slider),
						media = $slider.find(that.options.media),
						videoStopBtn = '.video-stop',
						videoPlayBtn = '.video-play';

					$('.mln-slide', $slider).each(function () {
						if ($(this).data('autoplay') == true) {
							$(this).addClass('is-playing');
						}
					});

					function doAnimationsStart(elements) {
						let animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
						elements.each(function () {
							let $this = $(this),
								$animationDelay = $this.data('delay'),
								$animationType = $this.data('animate-start');
							$this.css({
								'animation-delay': $animationDelay + 'ms',
								'-webkit-animation-delay': $animationDelay + 'ms'
							});
							$this.addClass('animated ' + $animationType).one(animationEndEvents, function () {
								$this.removeClass($animationType);
							});
						});
					}

					function doAnimationsEnd(elements) {
						let animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
						elements.each(function () {
							let $this = $(this),
								$animationType = $this.data('animate-end');
							$this.css({
								'animation-delay': '',
								'-webkit-animation-delay': ''
							});
							$this.addClass($animationType).one(animationEndEvents, function () {
								$this.removeClass($animationType).removeClass('animated');
							});
						});
					}

					$slider.on('init', function (slick) {
						slick = $(slick.currentTarget);
						let $currentSlide = slick.find('.slick-current'),
							$firstAnimatingElements = $('div.mln-slide:first-child').find('[data-animate-start]'),
							status = ($currentSlide.data('autoplay') == true && !$currentSlide.hasClass('is-paused')) ? "play" : "pause";
						doAnimationsStart($firstAnimatingElements);
						setTimeout(function () {
							controlVideo(slick, status);
						}, 1000);
						that._resizePlayer(media, 16 / 9);
					});

					$slider.on('afterChange', function (e, slick) {
						slick = $(slick.$slider);
						let $currentSlide = slick.find('.slick-current'),
							status = ($currentSlide.data('autoplay') == true && !$currentSlide.hasClass('is-paused')) ? "play" : "pause",
							$animatingElements = $currentSlide.find('[data-animate-start]');
						doAnimationsStart($animatingElements);
						controlVideo(slick, status);
					});

					$slider.on('beforeChange', function (e, slick) {
						slick = $(slick.$slider);
						let $currentSlide = slick.find('.slick-current'),
							$animatingElements = $currentSlide.find('[data-animate-end]');
						doAnimationsEnd($animatingElements);
						$slider.slick('slickPlay');
						controlVideo(slick, "pause");
					});

					$slider.slick({
						arrows: true,
						dots: false,
						autoplay: true,
						autoplaySpeed: 6000,
						fade: true,
						speed: 1000,
						pauseOnHover: false,
						pauseOnDotsHover: true,
						cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
						responsive: [{
							breakpoint: templateOption.mobileMdBreikpoint,
							settings: {
								dots: true,
								arrows: false
							}
						}]
					});

					function playerSend(player, command) {
						if (player == null || command == null) return;
						player.contentWindow.postMessage(JSON.stringify(command), "*");
					}

					function controlVideo(slick, control, usercontrol) {
						let video,
							currentSlide = slick.find(".slick-current"),
							slideType = currentSlide.attr("class").split(" ")[1],
							player = currentSlide.find("iframe").get(0);

						if (slideType === "youtube") {
							switch (control) {
								case "play":
									playerSend(player, {
										"event": "command",
										"func": "mute"
									});
									playerSend(player, {
										"event": "command",
										"func": "playVideo"
									});
									if (usercontrol) currentSlide.addClass('is-playing').removeClass('is-paused');
									break;
								case "pause":
									playerSend(player, {
										"event": "command",
										"func": "pauseVideo"
									});
									if (usercontrol) currentSlide.removeClass('is-playing').addClass('is-paused');
									break;
							}
						} else if (slideType === "video") {
							video = currentSlide.children("video").get(0);
							if (video != null) {
								if (control === "play") {
									video.play();
									if (usercontrol) currentSlide.addClass('is-playing').removeClass('is-paused');
								} else {
									video.pause();
									if (usercontrol) currentSlide.removeClass('is-playing').addClass('is-paused');
								}
							}
						}
					}

					$(videoPlayBtn).on('click', function () {
						controlVideo($slider, "play", true);
					});

					$(videoStopBtn).on('click', function () {
						controlVideo($slider, "pause", true);
					});

				},
				_resizePlayer(iframes, ratio) {
					if (!iframes[0]) return;
					let $wrapper = $(this.options.slider),
						width = $wrapper.width(),
						playerWidth,
						height = $wrapper.height(),
						playerHeight;
					ratio = ratio || 16 / 9;
					iframes.each(function () {
						let current = $(this);
						if (width / ratio < height) {
							playerWidth = Math.ceil(height * ratio);
							current.width(playerWidth).height(height).css({
								left: (width - playerWidth) / 2,
								top: 0
							});
						} else {
							playerHeight = Math.ceil(width / ratio);
							current.width(width).height(playerHeight).css({
								left: 0,
								top: (height - playerHeight) / 2
							});
						}
					});
				},
				_setHeight(){
					let $slider = $(this.options.slider),
						sizeArray = $slider.data('size') ? jQuery.parseJSON(JSON.stringify($slider.data('size'))) : this.options.sizeArray,
						sliderSize,
						sliderH;

					for (let key in sizeArray) {
						if (key == 'default') {
							sliderSize = sizeArray[key];
							break;
						} else if (windowW < key) {
							sliderSize = sizeArray[key];
							break;
						}
					}

					if (sliderSize == 'fullheight') {
						if ($('header').hasClass('header-absolute')) {
							sliderH = $(window).height();
							let shift = $('header').outerHeight();
							$('.mln-slide-caption').each(function () {
								$(this).css({
									'padding-top': shift + 'px'
								})
							})
						} else sliderH = $(window).height() - $('header').outerHeight();
					} else {
						sliderH = windowW * sliderSize.split("/").pop() / sliderSize.split('/')[0];
					}

					if ($slider.next(this.options.thumbs).length && windowW > (templateOption.mobileMdBreikpoint - 1)) {
						$('.mln-slide-caption', $slider).css({
							'padding-bottom': $slider.next(this.options.thumbs).outerHeight() + 'px'
						})
					}

					$slider.css({
						'height': sliderH + 'px'
					})
				},
				_thumbnails(){
					let $slider = $(this.options.slider),
						$thumbs = $slider.next(this.options.thumbs);
					if ($thumbs.length) {
						$(document).on('click', this.options.thumbs + ' a', function (e) {
							$slider.slick('slickGoTo', $(this).index());
							e.preventDefault();
						})
					}
				}
			}
			Theme.mainslider.init();
		},
		horizontalTabScroll(tab, scroll) {
			$(tab).each(function () {
				if ($(this).hasClass('active')) {
					setScroll($(scroll, $(this)));
				}
			})

			function setScroll($scroll) {
				let $row = $scroll.find('.row'),
					childWidth = 0;
				$row.children().width(function (i, w) {
					childWidth += w;
				});
				if (childWidth > $row.width()) {
					$scroll.addClass('has-xscroll');
					new PerfectScrollbar($scroll[0], {
						suppressScrollY: true,
						useBothWheelAxes: true
					});
				} else $scroll.removeClass('has-xscroll');
			}

			$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
				let $scroll = $($(e.target).attr('href')).find(scroll);
				setScroll($scroll);
			})
		},
		instagramFeed(object) {
			if ($(object).length) {
				$(object).each(function () {
					let $this = $(this),
						tag = $this.data('tag'),
						id = "#" + $this.attr('id');
					$.instagramFeed({
						'tag': tag,
						'container': id,
						'display_profile': false,
						'display_biography': false,
						'display_gallery': true,
						'callback': null,
						'styling': true
					})
				})
			}
		},
		accordionToggle(){
			function togglePanel(e) {
				$(e.target)
					.closest('.panel')
					.toggleClass('active');
			}

			$('.panel-group').on('hidden.bs.collapse', togglePanel);
			$('.panel-group').on('shown.bs.collapse', togglePanel);
		},
		pageTitleTopMargin(breadcrumbs, pageTitle) {
			let $pageTitle = $(pageTitle),
				$breadcrumbs = $(breadcrumbs);
			if ($pageTitle.prev(breadcrumbs)) {
				$pageTitle.css({
					'margin-top': -$breadcrumbs.height() + 'px'
				})
			}
		},
		gallery(){
			Theme.filtergallery = {
				options: {
					filterList: '.filtr-list li',
					filterContainer: '.gallery-wrap',
					shomMore: '.js-filtr-showmore',
					link: '.js-gallery'
				},
				init(options) {
					$.extend(this.options, options);
					var filtr,
						that = this,
						$filterList = $(that.options.filterList),
						$filterContainer = $(that.options.filterContainer),
						$shomMore = $(that.options.shomMore),
						$link = $(that.options.link);
					if ($filterContainer.length) {
						$filterList.on('click', function () {
							$filterList.removeClass('active');
							$(this).addClass('active');
						});
						$filterContainer.imagesLoaded(function () {
							filtr = $filterContainer.filterizr();
							$filterContainer.addClass('is-loaded');
						});
						$shomMore.on('click', function (e) {
							e.preventDefault();
							let toAppend = $('.ajax-data').children();
							filtr._fltr.appendToGallery(toAppend);
							$(this).hide();
						})
					}
					if ($link.length) {
						$link.magnificPopup({
							delegate: 'a',
							type: 'image',
							removalDelay: 500,
							gallery: {
								enabled: true
							},
							preload: [1, 5],
							callbacks: {
								beforeOpen(){
									this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
									this.st.mainClass = this.st.el.attr('data-effect');
									$body.addClass('mfp-is-open');
								},
								afterClose(){
									$body.removeClass('mfp-is-open');
								}
							}
						})
					}
				},
				reinit(){
					if ($(this.options.filterContainer).length) {
						$(this.options.filterContainer).filterizr();
					}
				}
			}
			Theme.filtergallery.init();
		},
		googleMap(id, mapZoom, lat, lng) {
			if ($('.google-map-container').length) {
				let mapOptions = {
					zoom: mapZoom,
					scrollwheel: false,
					center: new google.maps.LatLng(lat, lng),
					styles: [{
						"featureType": "water",
						"elementType": "geometry",
						"stylers": [{
							"color": "#e9e9e9"
						}, {
							"lightness": 17
						}]
					}, {
						"featureType": "landscape",
						"elementType": "geometry",
						"stylers": [{
							"color": "#f5f5f5"
						}, {
							"lightness": 20
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.fill",
						"stylers": [{
							"color": "#ffffff"
						}, {
							"lightness": 17
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers": [{
							"color": "#ffffff"
						}, {
							"lightness": 29
						}, {
							"weight": 0.2
						}]
					}, {
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers": [{
							"color": "#ffffff"
						}, {
							"lightness": 18
						}]
					}, {
						"featureType": "road.local",
						"elementType": "geometry",
						"stylers": [{
							"color": "#ffffff"
						}, {
							"lightness": 16
						}]
					}, {
						"featureType": "poi",
						"elementType": "geometry",
						"stylers": [{
							"color": "#f5f5f5"
						}, {
							"lightness": 21
						}]
					}, {
						"featureType": "poi.park",
						"elementType": "geometry",
						"stylers": [{
							"color": "#dedede"
						}, {
							"lightness": 21
						}]
					}, {
						"elementType": "labels.text.stroke",
						"stylers": [{
							"visibility": "on"
						}, {
							"color": "#ffffff"
						}, {
							"lightness": 16
						}]
					}, {
						"elementType": "labels.text.fill",
						"stylers": [{
							"saturation": 36
						}, {
							"color": "#333333"
						}, {
							"lightness": 40
						}]
					}, {
						"elementType": "labels.icon",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "transit",
						"elementType": "geometry",
						"stylers": [{
							"color": "#f2f2f2"
						}, {
							"lightness": 19
						}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.fill",
						"stylers": [{
							"color": "#fefefe"
						}, {
							"lightness": 20
						}]
					}, {
						"featureType": "administrative",
						"elementType": "geometry.stroke",
						"stylers": [{
							"color": "#fefefe"
						}, {
							"lightness": 17
						}, {
							"weight": 1.2
						}]
					}]
				};
				let mapElement = document.getElementById(id);
				let map = new google.maps.Map(mapElement, mapOptions);
				let image = 'images/map-marker.png';
				let marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat, lng),
					map: map,
					icon: image
				});
			}
		},
		scrollProductHeight(options) {
			Theme.scrollproductheight = {
				options: {
					obj: '.js-product-item-scroll'
				},
				init(options) {
					$.extend(this.options, options);
					let that = this;
					$(that.options.obj).each(function () {
						let $this = $(this);
						let numHeight = 0;
						$this.children().slice(0, $this.data('limit')).each(function () {
							numHeight += $(this).outerHeight(true);
						});
						$this.css({
							'max-height': numHeight + 'px'
						});
					})
				},
				reinit(){
					let that = this;
					$(that.options.obj).each(function () {
						$(this).css({
							'max-height': ''
						});
					})
					this.init();
				}
			}
			Theme.scrollproductheight.init(options);
		},
		pScroll(obj) {
			if ($(obj).length) {
				new PerfectScrollbar(obj, {
					suppressScrollX: true
				});
			}
		},
		counter(obj) {
			let $countdown = $(obj);

			function removeCountdown($countdown) {
				if ($countdown.closest('.js-counter-wrap').length) {
					$countdown.closest('.js-counter-wrap').remove();
				} else $countdown.remove();
			}

			$countdown.each(function () {
				let $countdown = $(this),
					promoperiod,
					isActual = false;
				if ($countdown.attr('data-period')) {
					promoperiod = parseInt($countdown.attr('data-period'), 10);
					isActual = promoperiod > 0;
					promoperiod = new Date().getTime() + promoperiod;
				}
				if ($countdown.attr('data-endtime')) {
					promoperiod = $countdown.attr('data-endtime');
					isActual = Date.parse(promoperiod) - Date.parse(new Date()) > 0;
				}
				if (isActual) {
					$countdown.countdown(promoperiod, function (e) {
						$countdown.html(e.strftime('' + '<span>%D</span>' + '<span>%H</span>' + '<span>%M</span>' + '<span>%S</span>'));
					}).on('finish.countdown', function () {
						removeCountdown($countdown);
					});
				} else {
					if ($countdown.attr('data-endremove') == 'true') {
						removeCountdown($countdown);
					}
				}
			});
		},
		allSlick(obj) {
			let $carousel = $(obj);
			if ($carousel.length) {
				$carousel.each(function () {
					let $this = $(this);
					$this.imagesLoaded(function () {
						$this.on('init', function () {
							$this.find('.slick-arrow').css({
								'opacity': 0
							});
							$this.find('.lazyaspectratio').each(function () {
								$(this).css({
									'height': 'auto'
								})
							})
						})
						$this.slick({
							swipe: true,
							adaptiveHeight: false
						});
						if ($this.hasClass('js-product-carousel')) {
							if ($this.find('.lazyload').length) {
								$this.find('.slick-slide .lazyload').first().on('lazyloaded', function () {
									Theme.initialization.slickNavPos($this, '.slick-arrow', '.product-item-photo > img');
								})
							} else Theme.initialization.slickNavPos($this, '.slick-arrow', '.product-item-photo > img');
						}
					})
				})
			}
		},
		slickNavPos(carousel, arrow, image, delay) {
			let $carousel = carousel;
			image = $carousel.attr('data-center') ? $carousel.attr('data-center') : image;
			delay = delay ? delay : 1000;
			setTimeout(function () {
				$(arrow, $carousel).css({
					'top': $(image, $carousel).height() * 0.5,
					'opacity': 1
				});
			}, delay);
			$carousel.addClass('js-arrowCenter').attr('data-center', image);
		},
		trunkText(obj) {
			$(obj).each(function () {
				let $this = $(this),
					lines = parseInt($this.data('trunk'), 10);
				$this.trunk8({
					lines: lines
				});
			})
		},
		toggleForm(obj) {
			$(obj).on('click', function (e) {
				e.preventDefault();
				let $this = $(this);
				$this.closest('.form-toggle').find('a').removeClass('active');
				$this.addClass('active');
				$($this.attr('href')).siblings().removeClass('active');
				$($this.attr('href')).addClass('active');
			});
		},
		toooltip(obj) {
			$(obj).tooltip({
				trigger: 'hover'
			})
		},
		popoverHtml(popover) {
			$document.on('click', function (event) {
				let $target = $(event.target);
				if ($target.closest(popover).length) {
					let $btn = $target.closest(popover);
					$(popover).not($btn).popover('hide').removeClass('active');
				} else if ($target.closest('.popover').length) {
					event.stopPropagation();
				} else {
					$(popover).popover('hide').removeClass('active');
				}
			});
			$(popover).on('click', function () {
				$(this).toggleClass('active');
			})
			$(popover).each(function () {
				let parent = $(this).closest('.lookbox-item');
				$(this).popover({
					html: true,
					content(){
						return $(this).next('.js-popover-content').html();
					},
					animation: true,
					trigger: 'click',
					container: parent,
					delay: {"show": 100, "hide": 300},
					template: '<div class="popover"><div class="arrow"></div><div class="popover-body"></div></div>',
				});
			});
		},
		dataColor(obj) {
			$(obj).each(function () {
				let $this = $(this),
					colorList = $(this).data('color'),
					color = typeof colorList.color === 'undefined' ? '' : colorList.color,
					bg = typeof colorList.bg === 'undefined' ? '' : colorList.bg,
					bgend = typeof colorList.bgend === 'undefined' ? '' : colorList.bgend,
					brd = typeof colorList.brd === 'undefined' ? '' : colorList.brd,
					hcolor = typeof colorList.hcolor === 'undefined' ? '' : colorList.hcolor,
					hbg = typeof colorList.hbg === 'undefined' ? '' : colorList.hbg,
					hbgend = typeof colorList.hbgend === 'undefined' ? '' : colorList.hbgend,
					hbrd = typeof colorList.hbrd === 'undefined' ? '' : colorList.hbrd;

				if (typeof colorList.bgend !== 'undefined') {
					bg = 'linear-gradient(to right, ' + bg + ',' + bgend + ',' + bg + ')'
				}
				if (typeof colorList.hbgend !== 'undefined') {
					hbg = 'linear-gradient(to right, ' + hbg + ',' + hbgend + ',' + hbg + ')'
				}

				$this.on('mouseenter', function () {
					$(this).css({
						color: hcolor,
						background: hbg,
						borderColor: hbrd
					});
					if (typeof colorList.bgend !== 'undefined') {
						$this.css({
							'background-size': '200% auto',
							'background-position': 'right center'
						});
					}
					;
				}).on('mouseleave', function () {
					$(this).css({
						color: color,
						background: bg,
						borderColor: brd
					});
					if (typeof colorList.hbgend !== 'undefined') {
						$this.css({
							'background-size': '200% auto',
							'background-position': ''
						});
					}
					;
				}).trigger('mouseleave');
			})
		},
		sliderCollection(){
			let slider = '.js-collection-slider',
				sliderTitle = '.js-collection-slider-title',
				$slider = $(slider),
				$sliderTitle = $(sliderTitle),
				$sliderNext = $('.js-collection-slider-next-wrap'),
				$sliderPrev = $('.js-collection-slider-prev-wrap');
			$slider.slick({
				speed: 750,
				swipe: false,
				asNavFor: sliderTitle,
				arrows: false
			});
			$sliderTitle.slick({
				speed: 750,
				swipe: false,
				fade: true,
				arrows: false,
				asNavFor: slider,
				responsive: [{
					breakpoint: 1024,
					settings: {
						arrows: true
					}
				}]
			});
			$sliderNext.slick({
				speed: 750,
				swipe: false,
				fade: true,
				arrows: false
			});
			$sliderPrev.slick({
				speed: 750,
				swipe: false,
				fade: true,
				arrows: false
			});
			$('.js-collection-slider-prev').on('click', function () {
				$slider.slick('slickPrev');
				$sliderNext.slick('slickPrev');
				$sliderPrev.slick('slickPrev');
			});
			$('.js-collection-slider-next').on('click', function () {
				$slider.slick('slickNext');
				$sliderNext.slick('slickNext');
				$sliderPrev.slick('slickNext');
			})
		}
	}
	// listing page
	Theme.catalog = {
		init(){
			this.viewSwitcher();
			this.sideFilter();
			this.dropFilter();
			this.stickyProductGallery();
			this.stickyProductInfo();
		},
		stickyProductInfo(){
			Theme.stickyproductinfo = {
				options: {
					obj: '.js-infobox-sticky',
					hit: '.js-infobox-sticky-hit',
					destroyBreikpoint: 768
				},
				init(options) {
					$.extend(this.options, options);
					this.reinit();
				},
				reinit(windowW) {
					let obj = this.options.obj,
						hit = this.options.hit,
						hitFlag = false;
					if (windowW > this.options.destroyBreikpoint && !$(obj).parent('.sticky-wrapper').length) {
						let $obj = $(obj);
						if ($obj.length) {
							$obj.css({
								'top': '',
								'width': ''
							});
							if ($(window).scrollTop() > $obj.offset().top) {
								$obj.addClass('stuck');
								setCSS();
							}
							let stickyGallery = new Waypoint.Sticky({
								element: $obj[0],
								offset: $('header').outerHeight(),
								handler(direction) {
									if (direction == 'down') {
										setCSS();
									} else $obj.css({
										'top': '',
										'width': ''
									});
								}
							})
							Waypoint = true;
						}

						function setCSS() {
							$obj.css({
								'width': $obj.parent().width() + 'px'
							});
							if ($('header').hasClass('header-sticky')) {
								$obj.css({
									'top': $('header').outerHeight() + 'px'
								})
							}
							if (!hitFlag) {
								hitFlag = true;
								hitwaypoint($('header').outerHeight());
							}
						}

						function hitwaypoint(top) {
							$(hit).waypoint(function (direction) {
								$obj.toggleClass('stuck', direction === 'up');
								$obj.toggleClass('sticky-surpassed', direction === 'down');
							}, {
								offset(){
									return $obj.outerHeight() + top;
								}
							})
						}
					}
				}
			}
			Theme.stickyproductinfo.init();
		},
		stickyProductGallery(){
			Theme.stickyproductgallery = {
				options: {
					obj: '.js-product-gallery-sticky',
					hit: '.js-infobox-sticky-hit',
					destroyBreikpoint: 768
				},
				init(options) {
					$.extend(this.options, options);
					this.reinit();
				},
				reinit(windowW) {
					let obj = this.options.obj,
						hit = this.options.hit,
						hitFlag = false;
					if (windowW > this.options.destroyBreikpoint && !$(obj).parent('.sticky-wrapper').length) {
						let $obj = $(obj);
						if ($obj.length) {
							if ($(window).scrollTop() > $obj.offset().top) {
								$obj.addClass('stuck');
								setCSS();
							}
							let stickyGallery = new Waypoint.Sticky({
								element: $obj[0],
								offset: $('header').outerHeight(),
								handler(direction) {
									if (direction == 'down') {
										setCSS();
									} else $obj.css({
										'top': '',
										'min-height': '',
										'padding-top': '',
										'width': ''
									});
								}
							})
							Waypoint = true;
						}

						function setCSS() {
							let heightPrev = $('.product-gallery-single').outerHeight();
							$obj.css({
								'width': $obj.parent().width() + 'px',
								'min-height': "calc(100vh - " + $('header').outerHeight() + "px)"
							});
							if ($('header').hasClass('header-sticky')) {
								$obj.css({
									'top': $('header').outerHeight() + 'px',
									'padding-top': ($(window).height() - $('header').outerHeight() - heightPrev) / 2,
									'min-height': "calc(100vh - " + $('header').outerHeight() + "px)"
								})
							} else {
								$obj.css({
									'padding-top': ($(window).height() - heightPrev) / 2,
									'min-height': '100vh'
								})
							}
							if (!hitFlag) {
								hitFlag = true;
								hitwaypoint($('header').outerHeight());
							}
						}

						function hitwaypoint(top) {
							$(hit).waypoint(function (direction) {
								$obj.toggleClass('stuck', direction === 'up');
								$obj.toggleClass('sticky-surpassed', direction === 'down');
							}, {
								offset(){
									return $obj.outerHeight() + top;
								}
							})
						}
					}
				}
			}
			Theme.stickyproductgallery.init();
		},
		dropFilter(){
			$('.js-drop-filter').on('click', function (e) {
				$(this).next('.drop-filter').toggleClass('opened');
				e.preventDefault();
				e.stopPropagation();
			})
			$document.on('click', function (e) {
				if (!$(e.target).closest('.drop-filter').length) {
					$('.drop-filter').removeClass('opened');
				}
			})
			Theme.filterrepos = {
				options: {
					filter: '[data-dropcol]',
					dataAttr: 'dropcol',
					sideContainer: '.side-block-detach'
				},
				init(options) {
					$.extend(this.options, options);
					this.reinit();
				},
				reinit(){
					let $filter = $(this.options.filter),
						dataAttr = this.options.dataAttr,
						$sideContainer = $(this.options.sideContainer);
					if (mobileHeader) {
						$filter.each(function () {
							let block = $(this).detach();
							$sideContainer.append(block);
						})
					} else {
						$filter.each(function () {
							let block = $(this).detach();
							$($(this).data(dataAttr)).append(block);
						})
					}
				}
			}
			Theme.filterrepos.init();
		},
		sideFilter(){
			$('.js-sidefilter-open').on('click', function (e) {
				e.preventDefault();
				$('.js-sidefilter').addClass('is-open');
				$body.addClass('fixed').css({
					'margin-right': scrlbarW
				})
			});
			$('.js-sidefilter-close').on('click', function () {
				$('.js-sidefilter').removeClass('is-open');
				$body.removeClass('fixed').css({
					'margin-right': ''
				})
			});
		},
		viewSwitcher(){
			$document.on('click', '.js-view-switcher', function (e) {
				e.preventDefault();
				$('.js-listingGrid').removeClass('product-lg-2 product-lg-3 product-lg-4').addClass('product-lg-' + $(this).attr('data-col'));
				$(this).siblings('a').removeClass('active');
				$(this).toggleClass('active');
			})
		}
	}
	// header
	Theme.header = {
		init(){
			this.pushMenu();
			this.minicart();
			this.searchExpand();
			this.toggleHeader();
			if ($('.js-megamenu').length) this.megamenu('.js-megamenu');
			if ($('.header-sticky').length) this.stickyHeader();
			if ($('.header-cart--bg').length) this.headerCartBg('.header-cart--bg');
		},
		headerCartBg(cart) {
			if (!$(cart).length) return false;
			let $cart = $(cart),
				$parentContainer = $cart.closest('[class*="container"]'),
				left = windowW - $cart.offset().left - scrlbarW,
				bg = '<div class="header-cart-bg" style="width:' + left + 'px"></div>';
			$parentContainer.append(bg);
		},
		pushMenu(){
			Theme.pushmenu = {
				options: {
					menuWrap: 'js-pushmenu',
					menuTrigger: 'js-pushmenu-toggle',
					firstLevel: 'js-pushmenu--first',
					closeSubFirst: 'js-close-pushmenu',
					navLevel: 'pushmenu-sub',
					navLabel: 'pushmenu-sub-label',
					openLevel: 'open-sub',
					closeSub: 'close-sub',
					darkness: 'darkness',
					backText: 'Back',
					navWrap: '.pushmenu-wrapper',
					menuBottom: '.mobile-menu-bottom'
				},
				init(options) {
					$.extend(this.options, options);
					this._handlers(this);
					(windowW < templateOption.mobileHeaderBreikpoint) ? $body.addClass('mobilemenu').removeClass('desktopmenu') : $body.addClass('desktopmenu').removeClass('mobilemenu')
				},
				reinit(){
					(windowW < templateOption.mobileHeaderBreikpoint) ? $body.addClass('mobilemenu').removeClass('desktopmenu') : $body.addClass('desktopmenu').removeClass('mobilemenu')
				},
				_handlers(){
					let that = this,
						$menuTrigger = $('.' + this.options.menuTrigger),
						firstLevel = '.' + this.options.firstLevel,
						openLevel = this.options.openLevel,
						closeSub = this.options.closeSub,
						closeSubFirst = this.options.closeSubFirst,
						darkness = this.options.darkness,
						navLevel = this.options.navLevel,
						navLabel = this.options.navLabel,
						backText = this.options.backText

					$('a', $(firstLevel)).each(function () {
						let $this = $(this);
						if ($this.next('ul').length) {
							$this.addClass(openLevel)
						}
					})

					$('ul', $(firstLevel)).each(function () {
						let $this = $(this),
							cloneLink = $this.prev('a').clone();
						$this.prepend('<li class="' + navLabel + '"></li>')
							.prepend('<li class="' + closeSub + '"><span>' + backText + '</span></li>');
						cloneLink.removeClass(openLevel).prependTo('.' + navLabel, $this);
					})

					$menuTrigger.on('click touchstart', function (e) {
						e.preventDefault();
						$(firstLevel).hasClass('is-open') ? that._closeMenu(this) : that._openMenu(this)
					});

					$document.on('click', '.' + openLevel, function (e) {
						if ($body.hasClass('mobilemenu')) {
							$(this).next('.' + navLevel).addClass('is-open').addClass('is-current');
							$(this).closest('ul').addClass('is-hide').removeClass('is-current');
							$(this).parent('li').removeClass('is-hover');
							e.preventDefault();
						}
					})

					$document.on('mouseenter', firstLevel + ' li', function (e) {
						$(this).addClass('is-hover');
					}).on('mouseleave', firstLevel + ' li', function (e) {
						$(this).removeClass('is-hover');
					})

					$document.on('click', '.' + closeSub, function (e) {
						e.stopPropagation();
						$(this).closest('.' + navLevel).removeClass('is-open').removeClass('is-current');
						$(this).closest('ul').parent('li').closest('ul').removeClass('is-hide').addClass('is-current');
					});

					$document.on('click touchstart', '.' + closeSubFirst, function () {
						this._closeMenu();
					});

					$document.on('click', '.' + darkness, function () {
						this._closeMenu();
					});

					$document.on('mouseenter', firstLevel + ' li', function () {
						if ($('ul', this).length) {
							let $elm = $('ul:first', this),
								isVisible = $elm.offset().left + $elm.width() <= windowW;
							if (!isVisible) {
								$(this).addClass('to-right');
							} else {
								setTimeout(function () {
									$(this).removeClass('to-right');
								}, 0);
							}
							that._setHeight();
						}
					}).on('mouseleave', firstLevel + ' li', function (e) {
						$(this).removeClass('to-right');
					});
				},
				_setHeight(){
					let that = this;
					setTimeout(function () {
						let h = windowH - $(that.options.menuBottom).outerHeight() - 50;
						$(that.options.navWrap).css({'height': h})
						$('.pushmenu').css({'height': h})
					}, 0);
				},
				_openMenu(){
					let $menuWrap = $('.' + this.options.menuWrap),
						$firstLevel = $('.' + this.options.firstLevel);
					$menuWrap.addClass('is-open');
					$firstLevel.addClass('is-open');
					$body.addClass('fixed').css({
						'margin-right': scrlbarW
					})
					this._setHeight();
				},
				_closeMenu(){
					let $menuWrap = $('.' + this.options.menuWrap),
						$firstLevel = $('.' + this.options.firstLevel),
						$openLevel = $('.' + this.options.openLevel),
						$menuTrigger = $('.' + this.options.menuTrigger);
					$menuWrap.removeClass('is-open');
					$firstLevel.removeClass('is-hide').removeClass('is-open');
					$openLevel.siblings().removeClass('is-open').removeClass('is-hide');
					$menuTrigger.find('a').removeClass('active');
					$body.removeClass('fixed').css({
						'margin-right': ''
					})
					$('.header-wrap').css({
						'width': ''
					});
				}
			}
			Theme.pushmenu.init();
		},
		minicart(){
			$('.js-sidecart-toggle').on('click', function (e) {
				$('.js-sidecart').addClass('is-open');
				$body.addClass('fixed').css({
					'margin-right': scrlbarW
				})
				e.preventDefault();
			});
			$('.js-sidecart-close').on('click', function () {
				$('.js-sidecart').removeClass('is-open');
				$body.removeClass('fixed').css({
					'margin-right': ''
				})
			});
		},
		searchExpand(){
			Theme.searchexpand = {
				options: {
					searchBox: '.header-search .searchbox-collapsed, .header-search-dsc .searchbox',
					searchBoxMob: '.header-search-mob .searchbox-collapsed',
					header: 'header',
					submitIcon: '.searchbox-icon',
					inputBox: '.searchbox-input',
					searchDrop: '.js-searchbox-drop',
					isOpen: false
				},
				init(options) {
					$.extend(this.options, options);
					this._dropEvent();
					this.reinit();
					this._handlers();
				},
				reinit(){
					let $header = $(this.options.header),
						that = this;
					$header.each(function () {
						let $header = $(this),
							$searchDrop = $header.find(that.options.searchDrop),
							$searchBox = $header.find(that.options.searchBox),
							searchMove = $searchDrop.detach();
						if (windowW < templateOption.mobileHeaderBreikpoint) {
							$header.append(searchMove);
						} else {
							$searchBox.prepend(searchMove);
						}
					})
				},
				_handlers(){
					let $submitIcon = $(this.options.submitIcon),
						that = this;
					$submitIcon.on('click.searchExpand', function (e) {
						let $this = $(this),
							$searchBox = (windowW < templateOption.mobileHeaderBreikpoint) ? $this.closest(that.options.searchBoxMob) : $this.closest(that.options.searchBox);
						if (!$searchBox.hasClass('is-open')) {
							$searchBox.addClass('is-open');
							$this.closest(that.options.header).find(that.options.searchDrop).addClass('is-open');
							$searchBox.find(that.options.inputBox).focus();
						} else {
							$searchBox.removeClass('is-open');
							$this.closest(that.options.header).find(that.options.searchDrop).removeClass('is-open');
							$searchBox.find(that.options.inputBox).focusout();
						}
						e.preventDefault();
					}).on('mouseup.searchExpand', function () {
						return false;
					});
				},
				_dropEvent(){
					let that = this;
					$('.dropdown').on('show.bs.dropdown', function () {
						that._closeSearch()
					})
					$document.on('click', function (e) {
						if (!$(e.target).closest(that.options.searchBox).length && !$(e.target).closest(that.options.searchBoxMob).length && !$(e.target).closest(that.options.searchDrop).length) {
							that._closeSearch()
						}
					})
				},
				_closeSearch(){
					let that = this,
						$searchBox = (windowW < templateOption.mobileHeaderBreikpoint) ? $(that.options.searchBoxMob) : $(that.options.searchBox);
					$searchBox.each(function () {
						let $this = $(this);
						if ($this.hasClass('is-open')) {
							$this.removeClass('is-open');
							$(that.options.searchDrop).removeClass('is-open');
							$this.find(that.options.inputBox).focusout();
						}
					})
				}
			}
			Theme.searchexpand.init();
		},
		megamenu(obj) {
			$.fn.megaMenu = function () {
				let $megamenu = this,
					link_megamenu = '.js-link-megamenu',
					drop_megamenu = '.dropdown-megamenu',
					link_submenu = '.js-link-submenu',
					submenu = '.js-submenu';

				function mMaxH(link) {
					return ($(window).height() - link.offset().top)
				}

				function rightOff(drop) {
					return ($(window).width() - drop.offset().left - drop.outerWidth());
				}

				$document.on('mouseenter', link_megamenu, function (e) {
					let $this = $(this),
						$mDrop = $this.find(drop_megamenu),
						mW = $mDrop.width(),
						mH = mMaxH($mDrop);
					$mDrop.find('.dropdown-megamenu-scroll').css({
						'max-height': mH
					});
					if ((($(window).width() - $mDrop.outerWidth()) / 2) < $mDrop.offset().left) {
						let lPos = ($(window).width() - $mDrop.outerWidth()) / 2;
						$mDrop.css({
							'left': lPos
						});
					}
				}).on('mouseleave', link_megamenu, function (e) {
					$(this).find(drop_megamenu).css({
						'left': '',
						'max-height': ''
					});
				})

				$document.on('mouseenter', link_submenu, function (e) {
					let $this = $(this),
						$drop = $('>' + submenu, $(this)),
						menuPos = $(this).position();
					if (!$this.closest('ul').hasClass('js-submenu')) {
						$drop.css({
							top: menuPos.top,
							left: menuPos.left + Math.round($drop.outerWidth())
						});
					}
					if (rightOff($drop) < 0) {
						$(this).addClass('link-reverse');
						$drop.addClass('submenu-reverse');
					}
				}).on('mouseleave', link_submenu, function (e) {
					let $drop = $('>' + submenu, $(this));
					$(this).removeClass('link-reverse');
					$drop.removeClass('submenu-reverse');
				})
			}
			$(obj).megaMenu();
		},
		toggleHeader(){
			Theme.toggleheader = {
				options: {
					header: 'header',
					linksContent: '.js-header-links',
					linksMobile: '.js-header-mobile-links',
					currencyContent: '.js-header-currency',
					currencyMobile: '.js-header-mobile-currency',
				},
				init(options) {
					$.extend(this.options, options);
					this.reinit();
					return this;
				},
				reinit(){
					let that = this,
						$header = $(this.options.header);
					if (mobileHeader) {
						if (!$header.data('mobile')) {
							let linksMove = $header.find(that.options.linksContent).children().detach();
							$header.find(that.options.linksMobile).prepend(linksMove);
							let currencyMove = $header.find(that.options.currencyContent).children().detach();
							$header.find(that.options.currencyMobile).prepend(currencyMove);
							$header.data('mobile', true);
							$header.data('desktop', false);
						}
					} else {
						if (!$header.data('desktop')) {
							let linksMove = $header.find(that.options.linksMobile).children().detach();
							$header.find(that.options.linksContent).prepend(linksMove);
							let currencyMove = $header.find(that.options.currencyMobile).children().detach();
							$header.find(that.options.currencyContent).prepend(currencyMove);
							$header.data('desktop', true);
							$header.data('mobile', false);
						}
					}
					return this;
				}
			}
			Theme.toggleheader.init();
		},
		stickyHeader() {
			Theme.stickyheader = {
				options: {
					header: '.header-sticky',
					headerStickyTop: 0,
					headerSticky: '.js-header-sticky-content',
					headerM: '.header-mobile',
					headerD: '.header-desktop',
					pageContent: '.main-content',
					offset: 0,
					linksContent: '.js-header-links',
					linksSticky: '.js-header-sticky-links'
				},
				init(options) {
					$.extend(this.options, options);
					if (!$(this.options.header).length) return false;
					this._setScroll();
					return this;
				},
				reinit(){
					if (!$(this.options.header).length) return false;
					$window.off('scroll.stickyHeader');
					this._setScroll();
					return this;
				},
				_setScroll(){
					let that = this,
						mobile = windowW < templateOption.mobileHeaderBreikpoint,
						$header = mobile ? $(this.options.headerM) : $(this.options.headerD),
						$stickyContent = $header.find(this.options.headerSticky);
					if ($stickyContent.prev().length) {
						that.options.headerStickyTop = $stickyContent.prev().outerHeight();
						$(this.options.header).css({
							'top': 0 - this.options.headerStickyTop
						});
					}
					if ($(this.options.header).hasClass('header-absolute') && !mobile) {
						$(this.options.pageContent).css({
							'margin-top': 0 - $(this.options.header).outerHeight()
						});
						that.options.offset = 50;
					}

					function scrollEvents() {
						if ($body.hasClass('blockSticky')) return false;
						let st = $window.scrollTop();
						if (st > (that.options.headerStickyTop + that.options.offset)) {
							if (!$body.hasClass('has-sticky')) {
								that._setSticky();
							}
						} else {
							if ($body.hasClass('has-sticky')) {
								that._removeSticky();
							}
						}
					}

					$window.on('scroll.stickyHeader', function () {
						scrollEvents();
					});
					scrollEvents();
					return this;
				},
				_setSticky(){
					$body.addClass('has-sticky');
					$(this.options.header).css({
						'top': 0 - this.options.headerStickyTop
					});
					if ($(this.options.linksContent).length && $(this.options.linksSticky).length) {
						let linksMove = $(this.options.linksContent).children().detach();
						$(this.options.linksSticky).append(linksMove);
					}
				},
				_removeSticky(){
					$body.removeClass('has-sticky');
					if ($(this.options.linksContent).length && $(this.options.linksSticky).length) {
						let linksMove = $(this.options.linksSticky).children().detach();
						$(this.options.linksContent).append(linksMove);
					}
				}
			}
			Theme.stickyheader.init();
		}
	}
	// product card
	Theme.product = {
		options: {},
		init(){
			if ($('.product-item').length) this.optionsSelect('.product-item');
			if ($('.product-opts').length) this.optionsSelect('.product-opts');
			if ($('.nav-tabs-mob').length) this.filterSelect('.nav-tabs-mob');
			if ($('.nav-tabs-dsk').length) this.setActiveTab('.nav-tabs-dsk');
			this.productModals();
			this.productScroll();
			this.productSlider('.js-product-single-carousel', '.js-product-thumbs-carousel', '.js-product-gallery-thumbs');
			this.productEvents();
			this.productQty();
			if ($('.easyzoom').length) this.easyZoom('.easyzoom');
		},
		productSlider(single, thumbs, thumbsNoCarousel) {
			let vertical = $(thumbs).closest('.product-gallery').is('.thumbs-bottom, .thumbs-top') ? false : true,
				navThumbs = $(thumbs).length ? thumbs : false;
			$(single).slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
				fade: true,
				asNavFor: navThumbs,
				infinite: false,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							arrows: true
						}
					}]
			});
			$(thumbs).slick({
				slidesToScroll: 1,
				dots: false,
				arrows: true,
				loop: false,
				focusOnSelect: true,
				slidesToShow: 5,
				vertical: vertical,
				infinite: false,
				asNavFor: single,
				responsive: [
					{
						breakpoint: 1200,
						settings: {
							slidesToShow: 3
						}
					},
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 2
						}
					}]
			});
			$(document).on('click', thumbsNoCarousel + ' li', function (e) {
				$(single).slick('slickGoTo', $(this).index());
				e.preventDefault();
			})
		},
		productEvents(){
			Theme.productevents = {
				options: {
					product: '.product-item',
					productColors: '.product-item-gallery',
					productImageParent: '.product-item-photo-wrap',
					productImage: '.product-item-photo > img',
					colorChange: '.js-change-color',
					galleryToggle: '.js-product-toggle-gallery',
					loader: '.mln-loader',
					loadingOpacity: '.5',
					classHideLable: 'hide-label',
					classVisible: 'visible',
					classHidden: 'hidden',
					classPreloading: 'is-preload',
					shiftLeftClass: 'shift-left',
					shiftRightClass: 'shift-right',
					addToCartButton: '.product-item-action',
					productIitle: '.product-item-title',
					classTitleHover: 'hover',
					colorToggle: '.js-product-label-colors',
					galleryScrollUp: '.js-opt-scroll-up',
					galleryScrollDown: '.js-opt-scroll-down',
					galleryScrollSpeed: 4,
					mouseLeaveDelay: 0
				},
				init(options) {
					$.extend(this.options, options);
					this._handlers();
				},
				_handlers(){
					this._colorChange();
					this._shiftCarouselOnHover();
					this._hoverTitle();
				},
				_colorScroll(){
					let that = this,
						step = that.options.galleryScrollSpeed;
					$(document).on("mouseenter", that.options.galleryScrollUp, function () {
						let $content = $(this).parent().find(".js-scroll-content");
						$content.data('scrolling', true);
						scrollContent("up", $content);
					}).on("mouseleave", that.options.galleryScrollUp, function () {
						let $content = $(this).parent().find(".js-scroll-content");
						$content.data('scrolling', false);
					});
					$(document).on("mouseenter", that.options.galleryScrollDown, function () {
						let $content = $(this).parent().find(".js-scroll-content");
						$content.data('scrolling', true);
						scrollContent("down", $content);
					}).on("mouseleave", that.options.galleryScrollDown, function () {
						let $content = $(this).parent().find(".js-scroll-content");
						$content.data('scrolling', false);
					});
					function scrollContent(direction, $content) {
						let amount = (direction === "up" ? "-=" + step + "px" : "+=" + step + "px");
						$content.animate({
							scrollTop: amount
						}, 1, function () {
							if ($content.data('scrolling') === true) {
								scrollContent(direction, $content);
							}
						});
					}
				},
				_colorChange(){
					let timers = new Array();
					let that = this;
					that._colorScroll();
					$document.on('mouseenter', that.options.productColors, function () {
						$(this).closest(that.options.product).addClass(that.options.classHideLable);
					}).on('mouseleave', that.options.productColors, function () {
						$(this).closest(that.options.product).removeClass(that.options.classHideLable);
					}).on('click', that.options.productColors, function (e) {
						e.preventDefault();
					})
					$document.on('mouseenter', '.js-change-color', function () {
						let $this = $(this),
							newSrc = $this.data('img'),
							newImg = new Image(),
							$loader = $this.closest(that.options.product).find(that.options.loader),
							$mainImg = $this.closest(that.options.product).find(that.options.productImage);
						if ($this.closest('.js-product-label-colors').length) {
							$this.closest('.js-product-label-colors').find('.js-active-color').css({'background': $this.attr('data-prd-color')})
						}
						if ($this.hasClass(that.options.classPreloading)) {
							$mainImg.attr('src', newSrc);
							$mainImg.attr('srcset', newSrc);
						} else {
							$loader.addClass(that.options.classVisible);
							$mainImg.css({
								'opacity': that.options.loadingOpacity
							});
							$(newImg).attr({
								src: newSrc
							}).on('load', function () {
								$this.addClass(that.options.classPreloading);
								$mainImg.attr('src', newSrc).attr('srcset', newSrc).css({
									'opacity': ''
								});
								$loader.removeClass(that.options.classVisible);
							})
						}
					})
					$document.on('click', '.js-change-color > a', function (e) {
						e.preventDefault();
					})
					$document.on('click', that.options.galleryToggle, function (e) {
						let $parent = $(this).closest(that.options.product).find(that.options.productImageParent);
						$parent.addClass('expand');
						clearInterval(timers[$parent.data('timer')])
						//$parent.css({'border':''});
						let $scroll = $(this).closest(that.options.product).find('.js-scroll-content'),
							$productColors = $(this).closest(that.options.product).find(that.options.productColors);
						if (($scroll[0].scrollHeight - $scroll.height()) <= 0) {
							$productColors.addClass('arrows-off');
						} else {
							$productColors.removeClass('arrows-off');
						}
						e.preventDefault();
					}).on('mouseleave', that.options.productImageParent, function () {
						let $that = $(this),
							i = timers.length;
						if ($that.hasClass('expand')) {
							$that.data('timer', i);
							timers[i] = setInterval(function () {
								$that.removeClass('expand').off('mouseleave').on('mouseenter');
								$that.css({'border': ''});
							}, that.options.mouseLeaveDelay);
						}
					}).on('mouseenter', that.options.productImageParent, function () {
						let $that = $(this);
						clearInterval(timers[$that.data('timer')])
					});
					$document.on('mouseenter', that.options.colorToggle, function () {
						$(this).closest(that.options.product).addClass('hide-label-exept-colors')
					}).on('mouseleave', that.options.colorToggle, function () {
						$(this).closest(that.options.product).removeClass('hide-label-exept-colors')
					});
				},
				_shiftCarouselOnHover(){
					let that = this;
					$document.on('mouseenter', '.slick-active', function () {
						let $this = $(this);
						if ($this.find(that.options.productColors).length) {
							if (!$this.prev().hasClass('slick-active')) {
								$this.closest('.slick-slider').addClass(that.options.shiftLeftClass);
								$this.prev().addClass(that.options.classHidden);
							}
							if ($this.offset().left < 55) {
								$this.find('.product-item').addClass(that.options.shiftRightClass);
							}
						}
					}).on('mouseleave', '.slick-active', function () {
						let $this = $(this);
						$this.closest('.slick-slider').removeClass(that.options.shiftLeftClass);
						$this.find(that.options.product).removeClass(that.options.shiftRightClass);
						$this.prev().removeClass(that.options.classHidden);
					})
					$document.on('mouseenter', that.options.product, function () {
						let $this = $(this);
						if ($this.find(that.options.productColors).length) {
							$this.offset().left < 55 ? $this.addClass(that.options.shiftRightClass) : 0;
						}
					}).on('mouseleave', that.options.product, function () {
						$(this).removeClass(that.options.shiftRightClass);
					})
				},
				_hoverTitle(){
					let that = this;
					$document.on('mouseenter mouseleave', that.options.addToCartButton, function () {
						$(this).closest(that.options.product).find(that.options.productIitle).toggleClass(that.options.classTitleHover);
					})
				}
			}
			Theme.productevents.init();
		},
		productModals(){
			Theme.productmodals = {
				options: {
					modalContent: '.modal-content',
					modalAddToCart: '.modal .js-addtocart',
					continueShoppingButton: '.js-continue',
					modalOptionsID: '#optModal',
					modalQuickViewID: '#quickView'
				},
				init(options) {
					$.extend(this.options, options);
					this._modalsAll();
					this._modalQuickView();
					this._modalOptions();
				},
				_modalsAll(){
					let that = this;
					$document.on('click', that.options.modalAddToCart, function (e) {
						let $this = $(this);
						$this.closest(that.options.modalContent).find('.js-loader').addClass('visible');
						setTimeout(function () {
							$this.closest(that.options.modalContent).addClass('added');
							$this.closest(that.options.modalContent).find('.js-loader').removeClass('visible');
						}, 2000);
						e.preventDefault();
					})
					$document.on('click', that.options.continueShoppingButton, function (e) {
						let $this = $(this);
						$this.closest(that.options.modalContent).removeClass('added');
						e.preventDefault();
					})
					$document.on('click', '.product-item .js-addtocart, .js-close-modal, .js-product-page-addtocart', function (e) {
						e.preventDefault();
						$('#addedModal').modal('toggle');
					})
				},
				_modalOptions(){
					let that = this,
						$optionsModal = $(that.options.modalOptionsID);
					$optionsModal.on('shown.bs.modal', function () {
						if (!$('.mln-dropdown', $optionsModal).length) {
							Theme.product.optionsSelect(that.options.modalOptionsID);
						}
					})
					$document.on('click', '.js-toggle-options', function (e) {
						e.preventDefault();
						$optionsModal.modal('toggle');
					})
				},
				_modalQuickView(){
					let that = this,
						$optionsQuickView = $(that.options.modalQuickViewID);
					$document.on('click', '.js-quickview', function (e) {
						e.preventDefault();
						$optionsQuickView.modal('toggle');
					})
					$optionsQuickView.on('shown.bs.modal', function () {
						if (!$('.mln-dropdown', $optionsQuickView).length) {
							Theme.product.optionsSelect(that.options.modalQuickViewID);
						}
						if (!$('.slick-initialized', $optionsQuickView).length) {
							setTimeout(function () {
								Theme.product.productSlider('.js-product-single-carousel-modal', '.js-product-thumbs-carousel-modal');
								that._qwScrollHeight(that.options.modalQuickViewID);
							}, 0);
						}
					})
				},
				_qwScrollHeight(modal) {
					let height = $('.col-info').innerHeight() - $('.product-infobox-top').outerHeight() - $('.product-infobox-bot').outerHeight() - 88;
					$('.product-infobox-scroll', $(modal)).css({
						'height': height
					});
				}
			}
			Theme.productmodals.init();
		},
		setActiveTab(tab) {
			let $tabs = $(tab),
				setCurrent = false;
			$('li', $tabs).each(function () {
				let $this = $(this);
				if ($this.is('.js-active-on-start')) {
					$('a', $this).tab('show');
					setCurrent = true;
				}
			});
			if (!setCurrent) {
				$('li:first-child a', $tabs).tab('show');
			}
		},
		filterSelect(el) {
			let $this = $(el),
				optAct = $this.find('.active').html(),
				optBtn = '<a href="#" class="mln-dropdown" data-toggle="dropdown">' + optAct + '</a>';
			$this.prepend(optBtn);
			$('a', $this).on('click', function (e) {
				e.preventDefault();
				let $this = $(this)
				$this.closest('li').siblings().removeClass('active');
				$this.closest('li').addClass('active');
				$this.closest('ul').prev('[data-toggle="dropdown"]').html($this.html());
			})
		},
		optionsSelect(el) {
			let $this = $(el).find('.js-opt-select'),
				optAct = $this.find('.active > a').html(),
				optBtn = '<a href="#" class="mln-dropdown" data-toggle="dropdown">' + optAct + '</a>';
			$this.before(optBtn);
			$document.on('click', '.opt-select a', function (e) {
				let $this = $(this)
				$this.closest('li').siblings().removeClass('active');
				$this.closest('li').addClass('active');
				$this.closest('ul').prev('[data-toggle="dropdown"]').html($this.html());
				e.preventDefault();
			})
		},
		productScroll(){
			Theme.productscroll = {
				options: {
					product: '.product-sm-vertical'
				},
				init(options) {
					$.extend(this.options, options);
					$(this.options.product).each(function () {
						let $this = $(this),
							show = parseInt($this.data('show'), 10),
							height = 0;
						for (let i = 1; i <= show; i++) {
							height += $('>*:nth-child(' + i + ')', $this).outerHeight(true);
						}
						$this.css({
							'height': height + 'px'
						})
					})
				},
				reinit(){
					this.init();
				}
			}
			Theme.productscroll.init();
		},
		productQty(){
			let increaseButton = '.incr-btn';
			$document.on('click', increaseButton, function (e) {
				let $button = $(this),
					$input = $button.parent().find('.product-count'),
					oldValue = $input.val(),
					newVal;
				$button.parent().find('.incr-btn[data-action="decrease"]').removeClass('disable');
				if ($button.data('action') == "increase") {
					if ($input.data('max') < (parseFloat(oldValue) + 1)) return false;
					newVal = parseFloat(oldValue) + 1;
				} else {
					if (oldValue > 1) {
						let newVal = parseFloat(oldValue) - 1;
					} else {
						newVal = 1;
						$button.addClass('disable');
					}
				}
				$input.val(newVal);
				e.preventDefault();
			});
		},
		easyZoom(obj){
			let $easyzoom = $(obj).easyZoom();
		}
	}

	Theme.documentResize = {
		init(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				Waypoint ? Waypoint.destroyAll() : false;
				windowW = window.innerWidth || $window.width();
				windowH = $window.height();
				mobileHeader = windowW < templateOption.mobileHeaderBreikpoint;
				Theme.pushMenu ? Theme.pushMenu.reinit() : false;
				Theme.searchexpand ? Theme.searchexpand.reinit() : false;
				Theme.productscroll ? Theme.productscroll.reinit() : false;
				Theme.scrollproductheight ? Theme.scrollproductheight.reinit() : false;
				Theme.filterrepos ? Theme.filterrepos.reinit() : false;
				Theme.stickyproductgallery ? Theme.stickyproductgallery.reinit() : false;
				Theme.stickyheader ? Theme.stickyheader.reinit() : false;
				Theme.toggleheader ? Theme.toggleheader.reinit() : false;
				Theme.mainslider ? Theme.mainslider.reinit() : false;
				Theme.filtergallery ? Theme.filtergallery.reinit() : false;
				$('.slick-initialized').slick('setPosition');
			}, 500);
		}
	};

	let $document = $(document),
		$window = $(window),
		$body = $('body'),
		scrlbarW = getScrollbarWidth(),
		resizeTimer,
		windowW = window.innerWidth || $window.width(),
		windowH = $window.height(),
		Waypoint = false,
		templateOption = {
			mobileHeaderBreikpoint: 1025, // in px
			mobileMdBreikpoint: 992, // in px
			mobileSmBreikpoint: 768 // in px
		},
		mobileHeader = windowW < templateOption.mobileHeaderBreikpoint;

	$document.ready(function () {
		Theme.initialization.init();
		Theme.catalog.init();
		Theme.header.init();
		Theme.product.init();
	});

	$window.on('resize', Theme.documentResize.init);

})(jQuery);