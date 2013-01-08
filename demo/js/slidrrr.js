/*jslint plusplus: true */
/*global window, document, Image, $, navigator */

var Slidrrr = {
	version: '0.1.12'
};

(function () {
	"use strict";
	if ($.browser.msie) {
		// hogy CSS-bol is tudjuk, ha IE-t hasznalunk:
		$(function () {
			$(document.body).addClass('ie ie' + parseInt($.browser.version, 10));
		});
	}
	// https://github.com/madeinstefano/jquery.unselectable
	$.fn.unselectable = function () {
		var returnFalseFn = function() { return false; };
		$(this).attr('unselectable', 'on').css({
			MozUserSelect: 'none',
			KhtmlUserSelect: 'none',
			WebkitUserSelect: 'none',
			userSelect: 'none'
		}).each(function() {
			this.onselectstart = returnFalseFn;
		});
		return this;
	};
	$(function () {
		// kijeloles tiltas:
		$(document.body).unselectable();
	});
	/* jQuery.browser.mobile (http://detectmobilebrowser.com/)
	 * jQuery.browser.mobile will be true if the browser is a mobile device
	 */
	(function (ua) {
		$.browser.mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4));
	}(navigator.userAgent || navigator.vendor || window.opera));
	/**
	 * @class Slidrrr
	 * JQuery hianyossagait itt potoljuk. :)
	 * @singleton
	 */
	/**
	 * Osztaly "oroklodes". Az elso parameterban kapott osztalyt kiegeszitjuk a masodik parameterben kapott metodusokkal/attributomokkal. Visszateresi ertek az uj osztaly.
	 * @param {Object} superClass Az os osztaly.
	 * @param {Object} overrides A kiegeszites.
	 * @return {Object} Az uj osztaly.
	 * @member Slidrrr extend
	 */
	Slidrrr.extend = function (superClass, overrides) {
		var result = overrides.constructor !== Object.prototype.constructor ? overrides.constructor : function () { superClass.apply(this, arguments); };
		$.extend(result.prototype, superClass.prototype, overrides);
		result.superclass = superClass.prototype;
		return result;
	};
	/**
	 * Nevter letrehozasa
	 * @param {String} namespace
	 * @member Slidrrr ns
	 */
	Slidrrr.ns = function (namespace) {
		var o = window, ns = namespace.split("."), i;
		for (i = 0; i < ns.length; ++i) {
			if (!o[ns[i]]) {
				o[ns[i]] = {};
			}
			o = o[ns[i]];
		}
	};
	/**
	 * Egyedi jelszo generalasa
	 * @return {String} Az egyedi azonosito
	 * @member Slidrrr id
	 */
	Slidrrr.id = (function () {
		var n = 0;
		return function () {
			return 'slidrrr-' + (++n);
		};
	}());
	/**
	 * A slideShow elinditasa
	 * @return {Object} A slideShow-hoz tartozo konfiguracio
	 * @member Slidrrr init
	 */
	Slidrrr.init = function (config) {
		var owner = $('#' + config.renderTo);
		config.el = owner.html('<div class="slide-show"></div>').find('div');
		return new Slidrrr.SlideShow(config);
	};
	/**
	 * @class Slidrrr.Observable
	 * Ez az osztaly valositja meg az esemenykezelest.
	 */
	Slidrrr.Observable = Slidrrr.extend(Object, {
		events: {},
		constructor: function (config) {
			this.initialConfig = config || {};
			$.extend(this, config);
			if (this.listeners) {
				var scope = this.listeners.scope || this, i;
				for (i in this.listeners) {
					if (this.listeners.hasOwnProperty(i) && i !== 'scope') {
						this.on(i, this.listeners[i], scope);
					}
				}
				delete this.listeners;
			}
		},
		/**
		 * Hozzarendeljuk a metodust az esemnyhez.
		 * @param {String} eventName Esemeny neve
		 * @param {Function} callback A metodus, amit majd meg kell hivni
		 * @param {Object} scope (optional) Referencia a <code>this</code> valtozora
		 */
		on: function (eventName, callback, scope) {
			if (!this.events[eventName]) {
				this.events[eventName] = [];
			}
			this.events[eventName].push({
				callback: callback,
				scope: scope || this
			});
		},
		/**
		 * Elinditja a megadott esemenyhez tartozo callback fuggvenyeket.
		 * @param {String} eventName Esemeny neve
		 * @param {Object...} args Tovabbi parameterek, amiket atadunk a callback fuggvenynek.
		 */
		fireEvent: function (eventName) {
			var args = Array.prototype.slice.call(arguments, 1);
			$.each(this.events[eventName] || [], function () {
				this.callback.apply(this.scope, args);
			});
		}
	});
	/**
	 * @class Slidrrr.Component
	 * @extends Slidrrr.Observable
	 * Az absztrak elem
	 */
	Slidrrr.Component = Slidrrr.extend(Slidrrr.Observable, {
		constructor: function () {
			Slidrrr.Component.superclass.constructor.apply(this, arguments);
			/**
			 * @cfg {DOM} el A komponenshez tartozo HTML elem
			 */
			if (this.el) {
				this.el = $(this.el);
				this.render();
			}
			/**
			 * @cfg {String} toolTip A komponenshez tartozo ...
			 */
			if (this.toolTip) {
				this.setToolTip(this.toolTip);
			}
		},
		setToolTip: function (toolTip) {
			this.toolTip = toolTip;
			this.el.data('toolTip', toolTip);
			if (!this.toolTipRegistered) {
				this.toolTipRegistered = true;
				Slidrrr.ToolTipManager.register(this.el);
			}
			Slidrrr.ToolTipManager.textRefresh();
		},
		/**
		 * Visszaadja a komponens szelesseget.
		 * @return {Number}
		 */
		getWidth: function () {
			return this.el.outerWidth();
		},
		/**
		 * Visszaadja a komponens magassagat.
		 * @return {Number}
		 */
		getHeight: function () {
			return this.el.outerHeight();
		},
		/**
		 * Beallitja a komponens meretet.
		 * @param {Number} width
		 * @param {Number} height
		 */
		setSize: function (width, height) {
			return this.setWidth(width).setHeight(height);
		},
		/**
		 * Beallitja a komponens szelesseget.
		 * @param {Number} width
		 */
		setWidth: function (width) {
			this.el.outerWidth(width);
			return this;
		},
		/**
		 * Beallitja a komponens magassagat.
		 * @param {Number} height
		 */
		setHeight: function (height) {
			this.el.outerHeight(height);
			return this;
		}
	});
	/**
	 * @class Slidrrr.Button
	 * @extends Slidrrr.Component
	 * Gomb
	 */
	/**
	 * @cfg {Function} handler A gombhoz tartozo kattintas esemeny
	 */
	/**
	 * @cfg {Object} scope Referencia a this valtozora
	 */
	Slidrrr.Button = Slidrrr.extend(Slidrrr.Component, {
		constructor: function () {
			Slidrrr.Button.superclass.constructor.apply(this, arguments);
			this.addClickEvent();
		},
		render: function () {
			this.el.addClass('button');
		},
		addClickEvent: function () {
			var scope = this.scope || this;
			this.el.on('click', $.proxy(this.handler, scope, this));
		}
	});

	Slidrrr.ns('Slidrrr.util');
	/**
	 * @class Slidrrr.util.Preloader
	 * Kepek elotoltesere hasznalt segedeszkoz
	 * @singleton
	 */
	Slidrrr.util.Preloader = (function () {
		return {
			/**
			 * Kepek betoltese
			 * @param {String[]} list A kepekhez tartaozo fajlnevek
			 * @param {Function} callback (optional) Az utolso kep betoltese utan meghivando fuggveny
			 */
			load: function (list, callback) {
				var loaded = 0,
					onLoad = function () {
						loaded++;
						if (loaded === list.length) {
							if (typeof callback === 'function')  {
								callback();
							}
						}
					},
					// megjegyzes: IE miatt kell a t tombot hasznalni!
					t = [],
					i;
				for (i = 0; i < list.length; i++) {
					t.push(new Image(1, 1));
					t[t.length - 1].onload = onLoad;
					t[t.length - 1].src = list[i];
				}
			}
		};
	}());
	/**
	 * @class Slidrrr.util.Log
	 * Naplozashoz keszult segedeszkoz
	 * @singleton
	 */
	Slidrrr.util.Log = (function () {
		var el, i = 0;
		return {
			/**
			 * Naplozas
			 * @param {String} str Az atadott szoveg
			 */
			info: function (str) {
				this.log(str);
			},
			/**
			 * Hiba naplozas
			 * @param {String} str Az atadott szoveg
			 */
			error: function (str) {
				this.log(str, 'error');
			},
			// private:
			log: function (str, cls) {
				var html = '<div class="' + (cls || '') + '">' + (++i) + ': ' + str + '</div>';
				this.getEl().append(html);
			},
			getEl: function () {
				if (!el) {
					el = this.createEl();
				}
				return el;
			},
			createEl: function () {
				var id = Slidrrr.id();
				$(document.body).append('<div id="' + id + '" class="debug"></div>');
				return $('#' + id);
			}
		};
	}());
	window.onerror = function (errorMsg, file, line) {
		var str = errorMsg + ' (' + file + ':' + line + ')';
		Slidrrr.util.Log.error(str);
		return false;
	};
}());