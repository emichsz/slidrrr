/*jslint plusplus: true */
/*global window, document, $, Slidrrr */

(function () {
	"use strict";
	Slidrrr.ns('Slidrrr.controls');
	/**
	 * @class Slidrrr.controls.Panel
	 * @extends Slidrrr.Component
	 * A kontroll elemeket iranyito kontainer elem.
	 */
	Slidrrr.controls.Panel = Slidrrr.extend(Slidrrr.Component, {
		constructor: function () {
			Slidrrr.controls.Panel.superclass.constructor.apply(this, arguments);
			this.fixSize();
			$(window).resize($.proxy(this.fixSize, this));
		},
		currentTime: null,
		render: function () {
			var html = [
				'<div class="timeline-start"></div>',
				'<div class="timeline"><div class="marker"></div></div>',
				'<div class="timeline-end"></div>',
				'<div class="sections"></div>',
				'<div class="timer"></div>',
				// gombok:
				'<div class="play"></div>',
				'<div class="resize"></div>',
				'<div class="fullscreen"></div>'
			].join('');
			this.el.html(html);
			this.createItems();
		},
		createItems: function () {
			this.sections = new Slidrrr.controls.Sections({
				el: $('div.sections', this.el),
				slides: this.slides,
				listeners: {
					scope: this,
					change: function (time) {
						this.player.gotoAndPlay(time);
					}
				}
			});
			this.timer = new Slidrrr.controls.Timer({
				el: $('div.timer', this.el),
				duration: this.duration
			});
			this.timeline = new Slidrrr.controls.TimeLine({
				el: $('div.timeline', this.el),
				slides: this.slides,
				duration: this.duration,
				listeners: {
					scope: this,
					click: function (time) {
						this.player.gotoAndPlay(time);
					},
					slideOver: function (slideIndex) {
						this.showThumb(slideIndex);
					},
					slideOut: function () {
						this.hideThumb();
					}
				}
			});
			this.marker = new Slidrrr.controls.Marker({
				el: $('div.marker', this.el),
				timeline: this.timeline,
				listeners: {
					scope: this,
					change: function (time) {
						this.player.gotoAndPlay(time);
					}
				}
			});
			if (Slidrrr.util.FullScreen.isSupport()) {
				this.createFullScreenButton();
			}
			this.createPlayButton();
			this.createResizeButton();
		},
		createPlayButton: function () {
			var me = this,
				player = this.player,
				el = $('div.play', this.el);
			this.playBtn = new Slidrrr.Button({
				el: el,
				toolTip: 'Lejátszás',
				scope: this,
				handler: function () {
					if (player.isPlayed()) {
						player.pause();
					} else {
						player.play();
					}
				}
			});
			player.on('stateChange', function () {
				if (player.isPlayed()) {
					el.addClass('pause');
					me.playBtn.setToolTip('Leállítás');
				} else {
					el.removeClass('pause');
					me.playBtn.setToolTip('Lejátszás');
				}
			});
		},
		createResizeButton: function () {
			this.resizeBtn = new Slidrrr.Button({
				el: $('div.resize', this.el),
				toolTip: 'Átméretezés',
				scope: this,
				handler: function (btn) {
					this.fireEvent('clickResize', this);
					btn.el.toggleClass('resize-big-slide');
				}
			});
			// ha egymas melletti kinezettel indulunk:
			if (this.visualType === Slidrrr.SlideShow.prototype.SIDE_BY_SIDE) {
				this.resizeBtn.el.addClass('resize-big-slide');
			}
		},
		createFullScreenButton: function () {
			this.fullScreenBtn = new Slidrrr.Button({
				toolTip: 'Teljes képernyős nézet',
				el: $('div.fullscreen', this.el),
				scope: this,
				handler: function (btn) {
					if (Slidrrr.util.FullScreen.isFullScreen()) {
						Slidrrr.util.FullScreen.exit();
						btn.setToolTip('Teljes képernyős nézet');
					} else {
						var parent = this.el.parent();
						Slidrrr.util.FullScreen.request(parent);
						btn.setToolTip('Normál nézet');
					}
				}
			});
		},
		fixSize: function () {
			var start = this.el.offset().left,
				end = $('div.timeline-end', this.el).offset().left;
			this.timeline.setWidth(Math.round(end - start));
		},
		setCurrentTime: function (time) {
			time = Math.round(time);
			if (this.currentTime !== time) {
				this.currentTime = time;
				this.timeline.setCurrentTime(time);
				this.timer.setCurrentTime(time);
				this.sections.setCurrentTime(time);
				this.marker.setCurrentTime(time);
			}
		},
		showThumb: function (i) {
			this.thumb = new Slidrrr.controls.Thumb({
				src: this.slides[i].src.replace('.jpg', '_thumb.jpg'),
				slide: $($('div.slide', this.el).get(i)),
				listeners: {
					scope: this,
					click: function () {
						var time = this.slides[i].time;
						this.player.gotoAndPlay(time);
					}
				}
			});
			this.thumb.show();
		},
		hideThumb: function () {
			if (this.thumb) {
				this.thumb.hide();
				delete this.thumb;
			}
		}
	});
	/**
	 * @class Slidrrr.controls.Timer
	 * @extends Slidrrr.Component
	 * Ido megjelenito: aktualis ido / ossz. ido
	 */
	/**
	 * @cfg {Number} duration Az össz. idő
	 */
	Slidrrr.controls.Timer = Slidrrr.extend(Slidrrr.Component, {
		render: function () {
			var html = '<span>' + this.timeRenderer(0) + '</span> / ' + this.timeRenderer(this.duration);
			this.el.html(html);
			this.currentTimeEl = $('span', this.el);
		},
		timeRenderer: function (time) {
			var minute = parseInt(time / 60, 10),
				sec = parseInt(time - (minute * 60), 10);
			return (minute > 9 ? minute : '0' + minute) + ':' + (sec > 9 ? sec : '0' + sec);
		},
		/**
		 * Frissiti az aktualis idopontot.
		 * @param {Number} time
		 */
		setCurrentTime: function (time) {
			this.currentTimeEl.html(this.timeRenderer(time));
		}
	});
	/**
	 * @class Slidrrr.controls.Sections
	 * @extends Slidrrr.Component
	 * A témakör lista (választó)
	 */
	/**
	 * @cfg {slideConfig[]} slides A slide lista, ami alapjan fel kell epiteni a listat.
	 */
	Slidrrr.controls.Sections = Slidrrr.extend(Slidrrr.Component, {
		listClass: 'sections-list',
		render: function () {
			this.el.html(this.getHtml());
			this.currentEl = $('div', this.el);
			this.createList();
			this.addClickEvents();
		},
		getHtml: function () {
			var title = this.slides[0] ? this.slides[0].title : '';
			return ['<div class="current">', title, '</div>'].join('');
		},
		createList: function () {
			this.el.after(this.getListHtml());
			this.listEl = this.el.next();
			this.listEl.hide();
		},
		getListHtml: function () {
			var result = ['<div class="', this.listClass, '">'], i;
			for (i = 0; i < this.slides.length; ++i) {
				if (this.slides[i].title) {
					result.push('<div data-time="', this.slides[i].time, '">', this.slides[i].title, '</div>');
				}
			}
			result.push('</div>');
			return result.join('');
		},
		addClickEvents: function () {
			var me = this,
				documentClick = function (e) {
				if (e) {
					var el = $(e.target);
					if (el.is('div.' + me.listClass)) {
						return;
					}
					if (el.parents('div.' + me.listClass).length) {
						return;
					}
				}
				me.listEl.hide();
				$(document).unbind('click', documentClick);
			};
			this.el.click(function () {
				if (me.listEl.is(':hidden')) {
					me.listEl.show();
					$(document).click(documentClick);
					return false;
				}
				return true;
			});
			$('div', this.listEl).click(function () {
				var time = $(this).data('time');
				me.fireEvent('change', time);
				documentClick();
			});
		},
		/**
		 * Frissiti a kivalasztott elemet a megadott idopont alapjan.
		 * @param {Number} time
		 */
		setCurrentTime: function (time) {
			var t = null, i;
			for (i = 0; i < this.slides.length; ++i) {
				if (this.slides[i].title) {
					if (this.slides[i].time <= time) {
						t = this.slides[i].title;
					} else {
						break;
					}
				}
			}
			if (this.currentEl.html() !== t) {
				this.currentEl.html(t);
			}
		}
	});
	/**
	 * @class Slidrrr.controls.Thumb
	 * @extends Slidrrr.Component
	 * A kiskepeket megjelenito komponens.
	 */
	Slidrrr.controls.Thumb = Slidrrr.extend(Slidrrr.Component, {
		fadeTime: 200,
		/**
		 * Komponens megjelenitese.
		 */
		show: function () {
			var ownerCt = this.slide.parent();
			ownerCt.append(this.getHtml());
			this.el = $('div.thumb:last', ownerCt);
			this.fixPosition();
			this.addClickEvent();
		},
		getHtml: function () {
			return [
				'<div class="thumb">',
				'<img src="', this.src, '" width="100" height="75" alt="" />',
				'</div>'
			].join('');
		},
		fixPosition: function () {
			this.el.outerHeight(76).css({
				opacity: 0,
				left: parseInt(this.slide.css('left'), 10)
			}).animate({opacity: 1}, this.fadeTime);
		},
		addClickEvent: function () {
			var me = this;
			$('img', this.el).on('click', function () {
				/**
				 * @event click
				 * Amikor rakattintunk a kepre.
				 */
				me.fireEvent('click');
			});
		},
		/**
		 * Komponens eltuntetese.
		 */
		hide: function () {
			this.el.animate({opacity: 0}, this.fadeTime, null, function () {
				$(this).remove();
			});
		}
	});
	/**
	 * @class Slidrrr.controls.TimeLine
	 * @extends Slidrrr.Component
	 * Az idovonal, benne a slide határokkal.
	 */
	Slidrrr.controls.TimeLine = Slidrrr.extend(Slidrrr.Component, {
		render: function () {
			this.el.append(this.getHtml());
			this.slideElements = $('div.slide', this.el);
			this.slideElements.last().addClass('last-slide');
			this.addSlidesEvents();
		},
		getHtml: function () {
			var slides = this.slides,
				total = this.duration,
				tpl = '<div class="slide" data-duration="{0}" data-time="{1}"><div class="background"></div><div class="border"></div></div>',
				result = [],
				i,
				duration;
			for (i = 0; i < slides.length - 1; ++i) {
				duration = slides[i + 1].time - slides[i].time;
				result.push(tpl.replace('{0}', duration).replace('{1}', slides[i].time));
				total -= duration;
			}
			result.push(tpl.replace('{0}', total).replace('{1}', slides[slides.length - 1].time));
			// a ket plusz div dekoraciohoz:
			return result.join('') + '<div class="start"></div><div class="end"></div>';
		},
		setWidth: function (width) {
			var duration = this.duration, left = 0, lastEl;
			this.el.outerWidth(width);
			this.slideElements.each(function () {
				var el = $(this),
					slideWidth = Math.round(el.data('duration') / duration * width);
				el.css('left', left).width(slideWidth);
				left += slideWidth;
			});
			// kerekitesei hibak elfedese miatt a kulonbseget hozzaadjuk az utolsohoz:
			if (width !== left) {
				lastEl = this.slideElements.last();
				lastEl.width(lastEl.width() + (width - left));
			}
			this.fireEvent('resize', width, this.el.height());
		},
		addSlidesEvents: function () {
			var me = this, slides = $('div.slide', this.el);
			slides.click(function () {
				me.fireEvent('click', $(this).data('time'));
			});
			slides.each(function (index) {
				$(this).hover(function () {
					me.fireEvent('slideOver', index);
				}, function () {
					me.fireEvent('slideOut');
				});
			});
		},
		/**
		 * Frissiti az aktualis idopontot.
		 * @param {Number} time
		 */
		setCurrentTime: function (time) {
			this.slideElements.each(function () {
				var el = $(this),
					start = el.data('time'),
					duration = el.data('duration'),
					width;
				if (start > time) {
					width = 0;
				} else if (start + duration < time) {
					width = '100%';
				} else {
					width = parseInt((time - start) / duration * 100, 10) + '%';
				}
				$('div.background', el).css('width', width);
				if (width === '100%') {
					el.addClass('watched');
				} else {
					el.removeClass('watched');
				}
			});
		}
	});
	/**
	 * @class Slidrrr.controls.Marker
	 * @extends Slidrrr.Component
	 * Az idovonalon a jelolo.
	 */
	Slidrrr.controls.Marker = Slidrrr.extend(Slidrrr.Component, {
		currentTime: null,
		draggabled: false,
		render: function () {
			this.markOffset = parseInt(this.el.css('left'), 10) || 0;
			this.createContainment();
			this.addDraggableEvent();
			this.timeline.on('resize', this.fixPosition, this);
		},
		createContainment: function () {
			this.el.before('<div></div>');
			this.containmentEl = this.el.prev();
			this.containmentEl.css({
				position: 'absolute',
				top: this.el.css('top'),
				height: this.el.css('height'),
				'z-index': -1
			});
		},
		fixPosition: function () {
			var time = this.currentTime;
			this.currentTime = null;
			this.setCurrentTime(time);
			this.containmentEl.css({
				left: this.markOffset,
				width: this.timeline.getWidth() - 2 * this.markOffset
			});
		},
		addDraggableEvent: function () {
			var me = this;
			this.el.draggable({
				axis: 'x',
				containment: this.containmentEl,
				start: function () {
					me.draggabled = true;
				},
				stop: function () {
					var left = parseInt(me.el.css('left'), 10),
						time = (left - me.markOffset) / me.timeline.getWidth() * me.timeline.duration;
					me.fireEvent('change', time);
					me.draggabled = false;
				}
			});
		},
		setCurrentTime: function (time) {
			if (this.currentTime !== time) {
				this.currentTime = time;
				if (!this.draggabled) {
					this.el.css({
						left: Math.round(time / this.timeline.duration * this.timeline.getWidth()) + this.markOffset
					});
				}
			}
		}
	});
}());