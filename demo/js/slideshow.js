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
		BIG_SLIDE: 0,
		BIG_PLAYER: 1,
		SIDE_BY_SIDE: 2,
		constructor: function () {
			Slidrrr.SlideShow.superclass.constructor.apply(this, arguments);
			this.visualType = this.BIG_SLIDE;
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
					stateChange: this.onPlayerStateChange,
					toggle: function () {
						this.visualType = this.visualType === this.BIG_PLAYER ? this.BIG_SLIDE : this.BIG_PLAYER;
						this.fixSize();
					}
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
						this.visualType = this.visualType === this.SIDE_BY_SIDE ? this.BIG_SLIDE : this.SIDE_BY_SIDE;
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
				playerWidth,
				marginTop;
			if (this.visualType === this.BIG_SLIDE) {
				slidesHeight = height;
			} else if (this.visualType === this.SIDE_BY_SIDE) {
				slidesHeight = parseInt(width / 2, 10);
				playerHeight = slidesHeight;
				playerWidth = parseInt(playerHeight / 9 * 16, 10);
			} else if (this.visualType === this.BIG_PLAYER) {
				slidesHeight = width / 6;
			} else {
				throw new Error('this.visualType is wrong: ' + this.visualType);
			}
			slidesWidth = parseInt(slidesHeight * 4 / 3, 10);
			if (!playerWidth) {
				playerWidth = width - slidesWidth;
			}
			if (!playerHeight) {
				playerHeight = parseInt(playerWidth / 16 * 9, 10);
			}
			this.slidesPanel.setSize(slidesWidth, slidesHeight);
			this.player.setSize(playerWidth, playerHeight);
			if (this.visualType === this.BIG_SLIDE) {
				this.player.enableDragging();
				this.player.fixPosition();
				this.slidesPanel.el.css('top', 0);
			} else {
				this.player.disableDragging();
				marginTop = parseInt((height - Math.max(slidesHeight, playerHeight)) / 2, 10);
				this.player.el.css('top', marginTop);
				this.slidesPanel.el.css('top', marginTop);
			}
			if (this.visualType === this.SIDE_BY_SIDE) {
				this.el.css('overflow', 'hidden');
				this.player.el.css({
					'z-index': 0,
					right: parseInt((width - playerWidth - slidesWidth) / 2, 10)
				});
				this.slidesPanel.el.css('z-index', 1);
			} else {
				this.el.css('overflow', 'visible');
				this.player.el.css({
					'z-index': 1,
					right: 0
				});
				this.slidesPanel.el.css('z-index', 0);
			}
		}
	});
}());