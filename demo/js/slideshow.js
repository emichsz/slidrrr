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
		/**
		 * @cfg {int} visualType Megjelenes tipusa (0 - nagykep, 1 - nagy lejatszo, 2 - egymas mellett)
		 */
		visualType: 2,
		BIG_SLIDE: 0,
		BIG_PLAYER: 1,
		SIDE_BY_SIDE: 2,
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
			// iPad-on a kezelo felulet pont nem latszodik, emiatt...
			// TODO: ezt a feltetelt lecserelni.
			//       de: $('window').height() === undefined
			if ($.browser.touch) {
				$('body').scrollTop(this.el.offset().top);
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
			if (this.player && this.player.isPlayed()) {
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
				playerWidth = width * 0.38;
			} else if (this.visualType === this.SIDE_BY_SIDE) {
				slidesWidth = Math.round(width * 0.6);
				playerHeight = Math.round(width * 0.6 * 3 / 4);
				playerWidth = Math.round(playerHeight / 9 * 16);
			} else if (this.visualType === this.BIG_PLAYER) {
				playerWidth = Math.round(width * 0.8);
				slidesWidth = width - playerWidth;
			} else {
				throw new Error('this.visualType is wrong: ' + this.visualType);
			}
			if (!slidesWidth) {
				slidesWidth = Math.round(slidesHeight * 4 / 3);
			}
			if (!slidesHeight) {
				slidesHeight = Math.round(slidesWidth * 3 / 4);
			}
			if (!playerWidth) {
				playerWidth = Math.round(playerHeight * 9 / 16);
			}
			if (!playerHeight) {
				playerHeight = Math.round(playerWidth / 16 * 9);
			}
			// atmeretezes:
			this.slidesPanel.setSize(slidesWidth, slidesHeight);
			this.player.setSize(playerWidth, playerHeight);
			// player mozgatas:
			if (this.visualType === this.BIG_SLIDE) {
				this.player.enableDragging();
			} else {
				this.player.disableDragging();
			}
			// pozicio javitas:
			if (this.visualType === this.BIG_SLIDE) {
				this.player.fixPosition();
				this.slidesPanel.el.css({
					top: 0,
					left: 0
				});
			} else {
				marginTop = Math.round((height - Math.max(slidesHeight, playerHeight)) / 2);
				this.player.el.css({
					top: marginTop,
					right: 0
				});
				this.slidesPanel.el.css({
					top: marginTop,
					left: 0
				});
			}
			// overflow + z-index javitas:
			if (this.visualType === this.SIDE_BY_SIDE) {
				this.el.css('overflow', 'hidden');
				this.player.el.css({
					'z-index': 0,
					right: Math.round((width - playerWidth - slidesWidth) / 2)
				});
				this.slidesPanel.el.css('z-index', 1);
			} else {
				this.el.css('overflow', 'visible');
				this.player.el.css('z-index', 1);
				this.slidesPanel.el.css('z-index', 0);
			}
			// nagy player eseten helycsere:
			if (this.visualType === this.BIG_PLAYER) {
				this.player.el.css('right', width - playerWidth);
				this.slidesPanel.el.css('left', playerWidth);
			}
		}
	});
}());