/*jslint plusplus: true */
/*global window, document, $, Slidrrr, YT */

(function () {
	"use strict";
	Slidrrr.ns('Slidrrr.player');
	/**
	* @class Slidrrr.player.Base
	* @extends Slidrrr.Component
	* Az alap lejatszo osztaly, amely meghatarozza, hogy milyen fuggvenyeket varunk a leszarmazottaktol.
	*/
	Slidrrr.player.Base = Slidrrr.extend(Slidrrr.Component, {
		align: 'bottom',
		/**
		 * Visszaadja a video hosszat.
		 * @return {Number}
		 */
		getDuration: function () {
			throw new Error('getDuration: You must override this method!');
		},
		/**
		 * Visszaadja az aktualis idopontot.
		 * @return {Number}
		 */
		getCurrentTime: function () {
			throw new Error('getCurrentTime: You must override this method!');
		},
		/**
		 * Visszaadja, hogy a video lejatszas kozben van-e?
		 * @return {Boolean} played
		 */
		isPlayed: function () {
			throw new Error('isPlayed: You must override this method!');
		},
		/**
		 * Megallitja a videot.
		 */
		pause: function () {
			throw new Error('pause: You must override this method!');
		},
		/**
		 * Elinditja a videot.
		 */
		play: function () {
			throw new Error('play: You must override this method!');
		},
		/**
		 * Beallitja az aktualis idopontot, majd elinditja a videot.
		 * @param {Number} time
		 */
		gotoAndPlay: function (time) {
			throw new Error('gotoAndPlay(' + time + '): You must override this method!');
		},
		// private
		onReady: function () {
			/**
			 * @event ready
			 * Amikor a video elkeszult.
			 */
			this.fireEvent('ready');
			if (this.autoPlay) {
				this.play();
			}
			this.createDragDropItems();
			this.createToggleBtn();
		},
		onStateChange: function () {
			/**
			 * @event stateChange
			 * Amikor a video allapota megvaltozik
			 */
			this.fireEvent('stateChange');
		},
		render: function () {},
		createDragDropItems: function () {
			var me = this;
			this.el.append('<div class="drag"></div>');
			this.el.draggable({
				disabled: this.disabledDragging,
				start: function () {
					me.dropItems.show();
				},
				stop: function () {
					var diff = Number.MAX_VALUE, elPos = me.el.position(), item, pos, t, i;
					for (i = 0; i < me.dropItems.length; i++) {
						pos = $(me.dropItems[i]).position();
						t = Math.pow(pos.left - elPos.left, 2) + Math.pow(pos.top - elPos.top, 2);
						if (t < diff) {
							diff = t;
							item = me.dropItems[i];
							if (i === 0) {
								me.align = 'top';
							} else {
								me.align = 'bottom';
							}
						}
					}
					me.copyCssPositionProperties(item);
					me.dropItems.hide();
				}
			});
			this.createDropItems();
		},
		createDropItems: function () {
			this.el.after('<div class="video-drop"></div><div class="video-drop"></div>');
			this.dropItems = $('div.video-drop', this.el.parent());
			this.dropItems.css({
				right: 10,
				width: this.getWidth(),
				height: this.getHeight(),
				opacity: 0.5
			}).hide();
			this.dropItems.first().css('top', 10);
			this.dropItems.last().css('bottom', 50);
		},
		fixPosition: function () {
			var item;
			if (this.dropItems) {
				if (this.align === 'bottom') {
					item = this.dropItems.last()[0];
				} else {
					item = this.dropItems.first()[0];
				}
				this.copyCssPositionProperties(item);
			}
		},
		copyCssPositionProperties: function (dom) {
			var list = ['top', 'left', 'bottom', 'right'], i;
			for (i = 0; i < list.length; i++) {
				this.el.css(list[i], dom.style[list[i]]);
			}
		},
		setSize: function (width, height) {
			if (this.dropItems) {
				this.dropItems.css({width: width, height: height});
			}
			return Slidrrr.player.Base.superclass.setSize.call(this, width, height);
		},
		createToggleBtn: function () {
			this.el.append('<div class="toggle"></div>');
			this.toggleBtn = $('div.toggle', this.el);
			this.toggleBtn.on('click', $.proxy(this.fireEvent, this, 'toggle'));
		},
		/**
		 * @cfg {Boolean} disabledDragging A mozgatas tiltasa.
		 */
		disabledDragging: false,
		/**
		 * Engedelyezzuk a mozgatast.
		 */
		enableDragging: function () {
			this.disabledDragging = false;
			this.el.draggable('enable');
			this.el.css('cursor', 'move');
		},
		/**
		 * Tiltjuk a mozgatast.
		 */
		disableDragging: function () {
			this.disabledDragging = true;
			this.el.draggable('disable');
			this.el.css('cursor', 'default');
		}
	});
	/**
	 * @class Slidrrr.player.Mock
	 * @extends Slidrrr.player.Base
	 * Internet kapcsolat nelkuli, teszteleshez hasznalt lejatszo.
	 */
	Slidrrr.player.Mock = Slidrrr.extend(Slidrrr.player.Base, {
		constructor: function () {
			Slidrrr.player.Mock.superclass.constructor.apply(this, arguments);
			window.setTimeout($.proxy(this.onReady, this), 1);
		},
		played: false,
		currentTime: 0,
		duration: 1000,
		getDuration: function () {
			return this.duration;
		},
		getCurrentTime: function () {
			return this.currentTime;
		},
		isPlayed: function () {
			return this.played;
		},
		pause: function () {
			if (this.played) {
				this.played = false;
				this.fireEvent('stateChange');
			}
			return this;
		},
		play: function () {
			if (!this.played) {
				this.played = true;
				this.fireEvent('stateChange');
			}
			return this;
		},
		gotoAndPlay: function (time) {
			this.currentTime = time;
			return this.play();
		}
	});
	/**
	 * @class Slidrrr.player.YouTube
	 * @extends Slidrrr.player.Base
	 * A YouTube api-t hasznalo lejatszo.
	 */
	Slidrrr.player.YouTube = Slidrrr.extend(Slidrrr.player.Base, {
		constructor: function () {
			Slidrrr.player.YouTube.superclass.constructor.apply(this, arguments);
			this.loadYouTubeScript();
			window.onYouTubeIframeAPIReady = $.proxy(this.createYouTubePlayer, this);
			if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
				this.oldIEhack();
			}
		},
		loadYouTubeScript: function () {
			var tag = document.createElement('script'),
				firstScriptTag = document.getElementsByTagName('script')[0];
			tag.src = "//www.youtube.com/iframe_api";
			tag.onerror = function () {
				Slidrrr.util.Log.error("YouTube api: Failed to load...");
			};
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		},
		render: function () {
			this.innerDivId = Slidrrr.id();
			this.el.append('<div id="' + this.innerDivId + '"></div>');
		},
		createYouTubePlayer: function () {
			this.yt = new YT.Player(this.innerDivId, {
				videoId: this.videoId,
				width: this.getWidth(),
				height: this.getHeight(),
				playerVars: {
					autoplay: this.autoPlay ? 1 : 0,
					showinfo: 0,
					controls: 0,
					modestbranding: 1,
					wmode: "opaque"
				},
				events: {
					onReady: $.proxy(this.onReady, this),
					onStateChange: $.proxy(this.onStateChange, this)
				}
			});
		},
		getDuration: function () {
			return this.yt.getDuration();
		},
		/* Sajnos egy buta bug-ba futottam bele, mobilon mind a megallitas,
		 * mind az elinditas utan nincs/illetve kesik a status valtas esemeny,
		 * emiatt kenytelen voltam kezzel belenyulni.
		 *
		 * iPad-on csak akkor indithatjuk el a videot, ha elotte rakattintunk.
		 */
		onReady: function () {
			// megjegyzes: amig CUED, addig nem vagyunk keszen!
			if (this.yt.i.playerState === YT.PlayerState.CUED) {
				window.setTimeout($.proxy(this.onReady, this), 100);
				return;
			}
			Slidrrr.player.YouTube.superclass.onReady.call(this);
		},
		pause: function () {
			this.yt.pauseVideo();
			if (this.yt.i.playerState !== YT.PlayerState.PAUSED) {
				this.yt.i.playerState = YT.PlayerState.PAUSED;
				this.onStateChange();
			}
			return this;
		},
		play: function () {
			if (!this.yt || this.yt.i.playerState === YT.PlayerState.CUED) {
				return this;
			}
			if (this.yt.playVideo) {
				this.yt.playVideo();
			}
			if (this.yt.i.playerState !== YT.PlayerState.PLAYING) {
				this.yt.i.playerState = YT.PlayerState.PLAYING;
				this.onStateChange();
			}
			return this;
		},
		gotoAndPlay: function (time) {
			this.currentTime = time;
			if (!this.yt || this.yt.i.playerState === YT.PlayerState.CUED) {
				return this;
			}
			if (this.yt.seekTo) {
				this.yt.seekTo(time);
			}
			return this.play();
		},
		/* Eredetileg nem lett volna szukseg a this.currentTime-ra, mivel a YT is kezeli az idot.
		 * Mi meg miert tudnank jobban, hogy o eppen hol tart? :)
		 * Am fentall a kovetkezo jelenseg:
		 * - beallitom az uj idopontot
		 * - elindul az elotoltes
		 * - kozben lekerem az idot, meg a regi idopontot kapom vissza
		 * Ez swipe-nel volt kulonosen zavaro.
		 */
		currentTime: null,
		getCurrentTime: function () {
			var result = this.getYtCurrentTime();
			if (this.currentTime !== null) {
				if (Math.abs(this.currentTime - result) > 3) {
					// azaz, meg nem fejezodott be a seekTo:
					return this.currentTime;
				}
				this.currentTime = null;
			}
			return result;
		},
		getYtCurrentTime: function () {
			return this.yt ? this.yt.getCurrentTime() : 0;
		},
		isPlayed: function () {
			if (!this.yt || !this.yt.getPlayerState) {
				return false;
			}
			return this.yt.getPlayerState() === YT.PlayerState.PLAYING;
		},
		setSize: function (width, height) {
			if (this.yt) {
				this.yt.setSize(width, height);
			}
			return Slidrrr.player.YouTube.superclass.setSize.call(this, width, height);
		},
		oldIEhack: function () {
			// IE7-tel nem mukodik a YouTube api, emiatt a video
			// megjelenesen kivul minden mas ugy viselkedik, mint a Mock-ban.
			// Azaz, ekkor a slide valtas nem automatikus, hanem "kezzel" kell csinalni.
			var methods = ['play', 'pause', 'gotoAndPlay', 'getCurrentTime', 'getDuration', 'isPlayed', 'onReady'], i;
			for (i = 0; i < methods.length; ++i) {
				this[methods[i]] = Slidrrr.player.Mock.prototype[methods[i]];
			}
			this.onReady();
		}
	});
}());