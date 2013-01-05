/*jslint plusplus: true */
/*global Slidrrr, $ */

(function () {
	"use strict";
	Slidrrr.ns('Slidrrr.slides');
	/**
	 * @class Slidrrr.SlidesPanel
	 * @extends Slidrrr.Component
	 * A slide-okat tartalmazo kontainer elem.
	 */
	Slidrrr.SlidesPanel = Slidrrr.extend(Slidrrr.Component, {
		index: 0,
		render: function () {
			this.el.html(this.getHtml());
			this.fixClasses();
			this.addClickEvents();
			this.preloadNextImages();
		},
		getHtml: function () {
			return [
				this.getImgHtml(),
				'<div class="prev"></div>',
				'<div class="next"></div>'
			].join('');
		},
		getImgHtml: function () {
			return '<img src="' + this.slides[this.index].src + '" alt="" width="100%" height="100%" />';
		},
		addClickEvents: function () {
			var me = this;
			$('div.prev', this.el).click(function () {
				me.fireEvent('step', me.index - 1);
			});
			$('div.next', this.el).click(function () {
				me.fireEvent('step', me.index + 1);
			});
		},
		setCurrentTime: function (time) {
			var me = this, oldImage, index = this.time2index(time);
			if (index === this.index) {
				return;
			}
			this.index = index;
			this.fixClasses();
			oldImage = $('img', this.el);
			this.el.append(this.getImgHtml(index));
			oldImage.css('z-index', 1).animate({opacity: 0}, 200, function () {
				oldImage.remove();
				// Firefox-om néha(???) a képeket nem jelenítette meg(???)
				// az alábbi kis hack segített ezen:
				if ($.browser.mozilla) {
					$('img', me.el).each(function () {
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
		}
	});
}());