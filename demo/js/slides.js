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
		getImgHtml: function (index, config) {
			var result = '<img alt="" width="100%" height="100%"';
			result += ' src = "' + (this.slides[index] ? this.slides[index].src : 'img/pixel.gif') + '"';
			if (config && config.cls) {
				result += ' class="' + config.cls + '"';
			}
			if (config && config.style) {
				result += ' style="' + config.style + '"';
			}
			return result + ' />';
		},
		addDragEvent: function () {
			var me = this;
			this.imageCt.draggable({
				axis: 'x',
				containment: this.getContainment(),
				start: function () {
					me.imageCt.append(me.getImgHtml(me.index + 1, {style: 'left: ' + me.el.width() + 'px', cls: 'neighbor'}));
					me.imageCt.append(me.getImgHtml(me.index - 1, {style: 'left: ' + (me.el.width() * -1) + 'px', cls: 'neighbor'}));
				},
				stop: function (e, ui) {
					var width = me.el.width(),
						index = me.index,
						left = 0,
						diff = Math.abs(ui.position.left);
					if (diff * 2 > width) {
						if (ui.position.left > 1) {
							if (me.slides[index - 1]) {
								left = width;
							}
						} else {
							if (me.slides[index + 1]) {
								left = -width;
							}
						}
					}
					me.imageCt.draggable('disable');
					me.imageCt.animate({'left': left}, width - diff, function () {
						if (left) {
							me.setCurrentTime(me.slides[index + (left > 0 ? -1 : 1)].time, true);
							me.fireEvent('step', index + (left > 0 ? -1 : 1));
						} else {
							$('img.neighbor', me.imageCt).remove();
						}
						me.imageCt.draggable('enable');
					});
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
		setCurrentTime: function (time, skipAnim) {
			var me = this, oldImage, index = this.time2index(time);
			if (index === this.index) {
				return;
			}
			this.index = index;
			this.fixClasses();
			oldImage = $('img', this.imageCt);
			this.imageCt.css('left', 0).append(this.getImgHtml(index));
			oldImage.css('z-index', 1).animate({opacity: 0}, skipAnim ? 0 : 200, function () {
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