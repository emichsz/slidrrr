/*jslint plusplus: true, todo: true */
/*global document, Slidrrr */

(function () {
	"use strict";
	Slidrrr.ns('Slidrrr.util');
	/**
	 * @class Slidrrr.util.FullScreen
	 * Segedfuggvenyek a teljes kepernyos modhoz.
	 * @singleton
	 */
	Slidrrr.util.FullScreen = (function () {
		var el;
		return {
			/**
			 * Visszaadja, hogy tamogatja-e a bongeszo a teljes kepernyos modot?
			 * @return {Boolean}
			 */
			isSupport: function () {
				var doc = document.documentElement;
				return 'requestFullscreen' in doc ||
					('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) ||
					'webkitRequestFullScreen' in doc ||
					false;
			},
			/**
			 * Visszaadja, hogy jelenleg teljes kepernyos uzemmodban vagyunk-e?
			 * @return {Boolean}
			 */
			isFullScreen: function () {
				return el ? true : false;
			},
			/**
			 * Visszaadja azt az elemet, amelyre ervenyes a teljes kepernyos mod.
			 * @return {jQueryElement}
			 */
			getEl: function () {
				return el;
			},
			/**
			 * Teljes kepernyore valtas a megadott elemre.
			 * @param {jQueryElement} element
			 */
			request: function (element) {
				var dom = element[0];
				if (dom) {
					if (dom.requestFullscreen) {
						dom.requestFullscreen();
					} else if (dom.mozRequestFullScreen) {
						dom.mozRequestFullScreen();
					} else if (dom.webkitRequestFullScreen) {
						dom.webkitRequestFullScreen();
					}
					// TODO: lekérhető valahogy a full screen elem?
					el = element;
				}
				if ($.browser.safari) {
					this.resizeRepeater();
				}
			},
			/**
			 * A teljes kepernyo mod kikapcsolasa.
			 */
			exit: function () {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
				el = null;
				if ($.browser.safari) {
					this.resizeRepeater();
				}
			},
			// private
			/*
			 * Safari a FullScreen valtast animalva vegzi, a resize
			 * esemeny nem mindig a megfelelo idoben kovetkezik be, emiatt:
			 */
			resizeRepeater: function () {
				var win = $(window), fn = $.proxy(win.resize, win), i;
				for (i = 0; i < 20; i++) {
					window.setTimeout(fn, i * 100);
				}
			}
		};
	}());
}());