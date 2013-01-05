/*jslint plusplus: true */
/*global window, Slidrrr, $ */

(function () {
	"use strict";
	/**
	 * @class Slidrrr.SlideShow
	 * @extends Slidrrr.Component
	 * A slide-okat, a control elemeket es a videot osszefogo elem.
	 */
	Slidrrr.SlideShow = Slidrrr.extend(Slidrrr.Component, {
		isBigSlide: true,
		constructor: function () {
			Slidrrr.SlideShow.superclass.constructor.apply(this, arguments);
			this.createItems();
			this.fixSize();
			$(window).resize($.proxy(this.fixSize, this));
		},
		render: function () {
			var html = [
				'<div class="slides"></div>',
				'<div class="video"></div>',
				'<div class="controls"></div>'
			].join('');
			this.el.append(html);
			if (this.backgroundColor) {
				this.el.css('background-color', this.backgroundColor);
			}
		},
		createItems: function () {
			this.createPlayer();
			this.createControlPanel();
			this.createSlidesPanel();
		},
		createPlayer: function () {
			this.player = new Slidrrr.player.YouTube({
				el: $('div.video', this.el),
				videoId: this.video.id,
				width: this.video.width,
				height: this.video.height,
				duration: this.video.duration,
				autoPlay: true,
				listeners: {
					scope: this,
					stateChange: this.onPlayerStateChange
				}
			});
		},
		createControlPanel: function () {
			this.controlPanel = new Slidrrr.controls.Panel({
				el: $('div.controls', this.el),
				duration: this.video.duration,
				slides: this.slides,
				player: this.player,
				listeners: {
					scope: this,
					clickResize: function () {
						this.isBigSlide = !this.isBigSlide;
						this.fixSize();
					}
				}
			});
		},
		createSlidesPanel: function () {
			this.slidesPanel = new Slidrrr.SlidesPanel({
				el: $('div.slides', this.el),
				slides: this.slides,
				listeners: {
					scope: this,
					step: function (index) {
						this.player.gotoAndPlay(this.slides[index].time);
					}
				}
			});
		},
		onPlayerStateChange: function () {
			if (this.player.isPlayed()) {
				this.startTimer();
			} else {
				this.stopTimer();
			}
		},
		startTimer: function () {
			if (!this.timer) {
				var me = this;
				this.timer = window.setInterval(function () {
					var time = me.player.getCurrentTime();
					me.controlPanel.setCurrentTime(time);
					me.slidesPanel.setCurrentTime(time);
				}, 600);
			}
		},
		stopTimer: function () {
			if (this.timer) {
				window.clearInterval(this.timer);
				this.timer = null;
			}
		},
		fixSize: function () {
			var height = this.getHeight() - this.controlPanel.getHeight(),
				width = this.getWidth(),
				slidesHeight,
				slidesWidth,
				playerHeight,
				playerWidth;
			if (this.isBigSlide) {
				slidesHeight = height;
			} else {
				slidesHeight = parseInt(width / 2 * (3 / 4), 10);
			}
			slidesWidth = parseInt(slidesHeight * 4 / 3, 10);
			playerWidth = width - slidesWidth;
			playerHeight = parseInt(playerWidth / 16 * 9, 10);
			this.slidesPanel.setSize(slidesWidth, slidesHeight);
			this.player.setSize(playerWidth, playerHeight);
		}
	});
}());