/*jslint plusplus: true */
/*global window, document, Image, $ */

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
	(function () {
		$.browser.touch = ('ontouchstart' in document.documentElement);
	}());
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
		if (config.title) {
			document.title += ' - ' + config.title;
		}
		var owner = $('#' + config.renderTo);
		config.el = owner.html('<div class="slide-show"></div>').find('div');
		return new Slidrrr.SlideShow(config);
	};
	/**
	 * @class Slidrrr.Observable
	 * Ez az osztaly valositja meg az esemenykezelest.
	 */
	Slidrrr.Observable = Slidrrr.extend(Object, {
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
			if (!this.events) {
				this.events = {};
			}
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
			if ($.browser.touch) {
				return;
			}
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