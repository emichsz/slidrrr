/*jslint plusplus: true */
/*global window, document, $, Slidrrr */

(function () {
	"use strict";
	/**
	 * @class Slidrrr.ToolTip
	 * @extends Slidrrr.Component
	 * A gyorstipp elem.
	 */
	Slidrrr.ToolTip = Slidrrr.extend(Slidrrr.Component, {
		offsetX: 0,
		offsetY: 0,
		text: '',
		/**
		 * A gyorstipp szovegenek modositasa.
		 * @param {String} text
		 */
		setText: function (text) {
			if (this.text !== text) {
				this.text = text;
				this.textEl.html(text);
			}
			return this;
		},
		visible: false,
		/**
		 * A gyorstipp megjelenitese.
		 * @param {String} text
		 */
		show: function () {
			if (!this.visible) {
				this.el.show();
				this.visible = true;
			}
			return this;
		},
		/**
		 * A gyorstipp eltuntetese.
		 * @param {String} text
		 */
		hide: function () {
			if (this.visible) {
				this.el.hide();
				this.visible = false;
			}
			return this;
		},
		render: function () {
			this.el.addClass('tooltip');
			this.el.html('<div class="inner">' + this.text + '</div><div class="arrow"></div>');
			this.textEl = $('div.inner', this.el);
			this.offsetX = parseInt(this.el.css('left'), 10) || 0;
			this.offsetY = parseInt(this.el.css('top'), 10) || 0;
		},
		/**
		 * A gyorstipp mozgatasa a megadott poziciora.
		 * @param {Number} x
		 * @param {Number} y
		 */
		move: function (x, y) {
			var left = x + this.offsetX,
				top = y + this.offsetY,
				windowWidth = $(window).width(),
				toolTipWidth = this.getWidth();
			// ha jobbra kilogna:
			if (windowWidth <= left + toolTipWidth) {
				this.el.addClass('tooltip-right');
				left -= toolTipWidth + (2 * this.offsetX);
				left = Math.min(windowWidth - toolTipWidth, left);
			} else {
				this.el.removeClass('tooltip-right');
			}
			this.el.css({left: left, top: top});
		}
	});
	/**
	 * @class Slidrrr.ToolTipManager
	 * A kulonbozo helyen megjeleno tooltip-et itt kezeljuk le.
	 * @singleton
	 */
	Slidrrr.ToolTipManager = (function () {
		var tooltip, currentEl;
		// megjegyzes: ha atmeretezzuk az ablakot, akkor tunjon el a tooltip!
		$(window).resize(function () {
			if (tooltip && tooltip.visible) {
				tooltip.hide();
			}
		});
		// megjegyzes: fullscreen eseten at kell mozgatni az elemet:
		$(window).resize(function () {
			if (tooltip) {
				var owner = Slidrrr.util.FullScreen.getEl() || $(document.body);
				owner.append(tooltip.el);
			}
		});
		return {
			/**
			 * Visszaadja a ToolTipManager altal hasznalt ToolTip elemet
			 */
			getToolTip: function () {
				if (!tooltip) {
					tooltip = this.createToolTip();
				}
				return tooltip;
			},
			createToolTip: function () {
				var id = Slidrrr.id();
				$(document.body).append('<div id="' + id + '"></div>');
				return new Slidrrr.ToolTip({
					el: $('#' + id)
				});
			},
			textRefresh: function () {
				if (currentEl) {
					tooltip.setText(currentEl.data('toolTip'));
				}
			},
			/**
			 * A HTML elemen aktivalja a gyorstippet.
			 * @param {jQuery} el
			 */
			register: function (el) {
				var me = this, fn = function (e) {
					tooltip.move(e.pageX, e.pageY);
				};
				el.hover(function () {
					var tooltip = me.getToolTip();
					tooltip.setText(el.data('toolTip')).show(el);
					$(document).mousemove(fn);
					currentEl = el;
				}, function () {
					var tooltip = me.getToolTip();
					tooltip.hide();
					$(document).unbind('mousemove', fn);
					currentEl = null;
				});
			}
		};
	}());
}());