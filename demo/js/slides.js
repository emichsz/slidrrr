/*jslint plusplus: true */
/*global Slidrrr, $ */

(function () {
	"use strict";
	Slidrrr.ns('Slidrrr.slides');
	/**
	 * @class Slidrrr.SlidesPanel
	 * @extends Slidrrr.Component
	 * A slide-okat tartalmazo kontener elem.
	 */
	Slidrrr.SlidesPanel = Slidrrr.extend(Slidrrr.Component, {
		index: 0,
		render: function () {
			this.el.html(this.getHtml());
			this.imageCt = $('div.images', this.el);
			this.fixClasses();
			this.preloadNextImages();
			if ($.browser.touch) {
				this.addDragEvent();
			} else {
				this.addClickEvents();
			}
		},
		getHtml: function () {
			return '<div class="images">' + this.getImgHtml(this.index) + '</div>';
		},
		getImgHtml: function (index) {
			var src = this.slides[index] ? this.slides[index].src : 'img/pixel.gif';
			return '<img src="' + src + '" alt="" width="100%" height="100%" />';
		},
		addDragEvent: function () {
			var me = this;
			$('div.images', this.el).draggable({
				axis: 'x',
				containment: this.getContainment(),
				start: function () {
					me.imageCt.append(me.getImgHtml(me.index + 1));
					$('img:last', me.imageCt).css('left', me.el.width()).addClass('neighbor');
					me.imageCt.append(me.getImgHtml(me.index - 1));
					$('img:last', me.imageCt).css('left', -me.el.width()).addClass('neighbor');
				},
				stop: function (e, ui) {
					var width = ui.helper.width();
					var diff = Math.abs(ui.position.left);
					if (diff * 2 > width) {
						if (ui.position.left > 1) {
							me.stepPrevious();
						} else {
							me.stepNext();
						}
					}
					ui.helper.css('left', 0);
					$('img.neighbor').remove();
				}
			});
		},
		getContainment: function () {
			if (!this.containment) {
				this.el.prepend('<div class="containment"></div>');
				this.containment = $('div.containment', this.el);
			}
			return this.containment;
		},
		addClickEvents: function () {
			this.el.append('<div class="prev"></div><div class="next"></div>');
			$('div.prev', this.el).click($.proxy(this.stepPrevious, this));
			$('div.next', this.el).click($.proxy(this.stepNext, this));
		},
		stepNext: function () {
			if (this.slides[this.index + 1]) {
				this.fireEvent('step', this.index + 1);
			}
		},
		stepPrevious: function () {
			if (this.slides[this.index - 1]) {
				this.fireEvent('step', this.index - 1);
			}
		},
		setCurrentTime: function (time) {
			var me = this, oldImage, index = this.time2index(time);
			if (index === this.index) {
				return;
			}
			this.index = index;
			this.fixClasses();
			oldImage = $('img', this.imageCt);
			this.imageCt.append(this.getImgHtml(index));
			oldImage.css('z-index', 1).animate({opacity: 0}, 200, function () {
				oldImage.remove();
				// Firefox-om néha(???) a képeket nem jelenítette meg(???)
				// az alábbi kis hack segített ezen:
				if ($.browser.mozilla) {
					$('img', me.imageCt).each(function () {
						var src = this.src;
						this.src = src;
					});
				}
			});
			this.preloadNextImages();
		},
		time2index: function (time) {
			var slides = this.slides, length = slides.length, i;
			for (i = 0; i < length; ++i) {
				if (slides[i].time > time) {
					break;
				}
			}
			return i - 1;
		},
		fixClasses: function () {
			if (this.index) {
				this.el.removeClass('first-slide');
			} else {
				this.el.addClass('first-slide');
			}
			if (this.index === this.slides.length - 1) {
				this.el.addClass('last-slide');
			} else {
				this.el.removeClass('last-slide');
			}
		},
		preloadNextImages: function () {
			var images = [];
			if (this.slides[this.index + 1]) {
				images.push(this.slides[this.index + 1].src);
			}
			if (this.slides[this.index - 1]) {
				images.push(this.slides[this.index - 1].src);
			}
			if (images.length) {
				Slidrrr.util.Preloader.load(images);
			}
		},
		setWidth: function (width) {
			if (this.containment) {
				this.containment.css({
					left: -1 * width,
					width: width * 3
				});
			}
			return Slidrrr.SlidesPanel.superclass.setWidth.call(this, width);
		}
	});
}());