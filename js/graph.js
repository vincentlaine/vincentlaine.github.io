//
// site.js
//
// the arbor.js website
//
(function ($) {
	// var trace = function(msg){
	//   if (typeof(window)=='undefined' || !window.console) return
	//   var len = arguments.length, args = [];
	//   for (var i=0; i<len; i++) args.push("arguments["+i+"]")
	//   eval("console.log("+args.join(",")+")")
	// }  

	var Renderer = function (elt) {
		var dom = $(elt)
		var canvas = dom.get(0)
		var ctx = canvas.getContext("2d");
		var gfx = arbor.Graphics(canvas)
		var sys = null

		var _vignette = null
		var selected = null,
			nearest = null,
			_mouseP = null;


		var that = {
			init: function (pSystem) {
				sys = pSystem
				sys.screen({
					size: {width: dom.width(), height: dom.height()},
					padding: [36, 60, 36, 60]
				})

				$(window).resize(that.resize)
				that.resize()
				that._initMouseHandling()
			},
			resize: function () {
				canvas.width = $(window).width() > 1280 ? 1280 : $(window).width();
				canvas.height = .75 * $(window).height()
				sys.screen({size: {width: canvas.width, height: canvas.height}})
				_vignette = null
				that.redraw()
			},
			redraw: function () {
				gfx.clear()
				sys.eachEdge(function (edge, p1, p2) {
					if (edge.source.data.alpha * edge.target.data.alpha == 0) return
					gfx.line(p1, p2, {stroke: "#3b323c", width: 2, alpha: edge.target.data.alpha})
				})
				sys.eachNode(function (node, pt) {
					var w = Math.max(20, 20 + gfx.textWidth(node.name))
					if (node.data.alpha === 0) return
					if (node.data.shape == 'dot') {
						gfx.oval(pt.x - w / 2, pt.y - w / 2, w, w, {fill: node.data.color, alpha: node.data.alpha})
						gfx.text(node.name, pt.x, pt.y + 7, {
							color: "white",
							align: "center",
							font: "Open Sans",
							size: 12
						})
						gfx.text(node.name, pt.x, pt.y + 7, {
							color: "white",
							align: "center",
							font: "Open Sans",
							size: 12
						})
					} else {
						gfx.rect(pt.x - w / 2, pt.y - 8, w, 20, 4, {fill: node.data.color, alpha: node.data.alpha})
						gfx.text(node.name, pt.x, pt.y + 9, {
							color: "white",
							align: "center",
							font: "Open Sans",
							size: 12
						})
						gfx.text(node.name, pt.x, pt.y + 9, {
							color: "white",
							align: "center",
							font: "Open Sans",
							size: 12
						})
					}
				})
				that._drawVignette()
			},

			_drawVignette: function () {
				var w = canvas.width
				var h = canvas.height
				var r = 20

				if (!_vignette) {
					/*var top = ctx.createLinearGradient(0,0,0,r)
					top.addColorStop(0, "#e0e0e0")
					top.addColorStop(.7, "rgba(255,255,255,0)")*/

					var bot = ctx.createLinearGradient(0, h - r, 0, h)
					bot.addColorStop(0, "rgba(255,255,255,0)")
					bot.addColorStop(1, "white")

					_vignette = {top: top, bot: bot}
				}

				// top
				ctx.fillStyle = _vignette.top
				ctx.fillRect(0, 0, w, r)

				// bot
				ctx.fillStyle = _vignette.bot
				ctx.fillRect(0, h - r, w, r)
			},

			switchMode: function (e) {
				if (e.mode == 'hidden') {
					dom.stop(true).fadeTo(e.dt, 0, function () {
						if (sys) sys.stop()
						$(this).hide()
					})
				} else if (e.mode == 'visible') {
					dom.stop(true).css('opacity', 0).show().fadeTo(e.dt, 1, function () {
						that.resize()
					})
					if (sys) sys.start()
				}
			},

			switchSection: function (newSection) {
				var parent = sys.getEdgesFrom(newSection)[0].source
				var children = $.map(sys.getEdgesFrom(newSection), function (edge) {
					return edge.target
				})

				sys.eachNode(function (node) {
					if (node.data.shape == 'dot') return // skip all but leafnodes

					var nowVisible = ($.inArray(node, children) >= 0)
					var newAlpha = (nowVisible) ? 1 : 0
					var dt = (nowVisible) ? .5 : .5
					sys.tweenNode(node, dt, {alpha: newAlpha})

					if (newAlpha == 1) {
						node.p.x = parent.p.x + .05 * Math.random() - .025
						node.p.y = parent.p.y + .05 * Math.random() - .025
						node.tempMass = .001
					}
				})
			},


			_initMouseHandling: function () {
				// no-nonsense drag and drop (thanks springy.js)
				selected = null;
				nearest = null;
				var dragged = null;
				var oldmass = 1

				var _section = null

				var handler = {
					moved: function (e) {
						var pos = $(canvas).offset();
						_mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)
						nearest = sys.nearest(_mouseP);

						if (!nearest.node) return false

						if (nearest.node.data.shape != 'dot') {
						} else if ($.inArray(nearest.node.name, ['Skills', 'Database', 'Software', 'Web', 'System', 'Versioning', 'Other']) >= 0) {
							if (nearest.node.name != _section) {
								_section = nearest.node.name
								that.switchSection(_section)
							}
							dom.removeClass('linkable')
							window.status = ''
						}

						return false
					},
					clicked: function (e) {
						var pos = $(canvas).offset();
						_mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)
						nearest = dragged = sys.nearest(_mouseP);

						if (nearest && selected && nearest.node === selected.node) {
							var link = selected.node.data.link
							if (link.match(/^#/)) {
								$(that).trigger({type: "navigate", path: link.substr(1)})
							} else {
								window.location = link
							}
							return false
						}


						if (dragged && dragged.node !== null) dragged.node.fixed = true

						$(canvas).unbind('mousemove', handler.moved);
						$(canvas).bind('mousemove', handler.dragged)
						$(window).bind('mouseup', handler.dropped)

						return false
					},
					dragged: function (e) {
						var old_nearest = nearest && nearest.node._id
						var pos = $(canvas).offset();
						var s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)

						if (!nearest) return
						if (dragged !== null && dragged.node !== null) {
							var p = sys.fromScreen(s)
							dragged.node.p = p
						}

						return false
					},

					dropped: function (e) {
						if (dragged === null || dragged.node === undefined) return
						if (dragged.node !== null) dragged.node.fixed = false
						dragged.node.tempMass = 1000
						dragged = null;
						// selected = null
						$(canvas).unbind('mousemove', handler.dragged)
						$(window).unbind('mouseup', handler.dropped)
						$(canvas).bind('mousemove', handler.moved);
						_mouseP = null
						return false
					}


				}

				$(canvas).mousedown(handler.clicked);
				$(canvas).mousemove(handler.moved);

			}
		}

		return that
	}


	var Nav = function (elt) {
		var dom = $(elt)

		var _path = null

		var that = {
			init: function () {
				$(window).bind('popstate', that.navigate)
				dom.find('> a').click(that.back)
				$('.more').one('click', that.more)

				$('#docs dl:not(.datastructure) dt').click(that.reveal)
				that.update()
				return that
			},
			more: function (e) {
				$(this).removeAttr('href').addClass('less').html('&nbsp;').siblings().fadeIn()
				$(this).next('h2').find('a').one('click', that.less)

				return false
			},
			less: function (e) {
				var more = $(this).closest('h2').prev('a')
				$(this).closest('h2').prev('a')
					.nextAll().fadeOut(function () {
					$(more).text('creation & use').removeClass('less').attr('href', '#')
				})
				$(this).closest('h2').prev('a').one('click', that.more)

				return false
			},
			reveal: function (e) {
				$(this).next('dd').fadeToggle('fast')
				return false
			},
			back: function () {
				_path = "/"
				if (window.history && window.history.pushState) {
					window.history.pushState({path: _path}, "", _path);
				}
				that.update()
				return false
			},
			navigate: function (e) {
				var oldpath = _path
				if (e.type == 'navigate') {
					_path = e.path
					if (window.history && window.history.pushState) {
						window.history.pushState({path: _path}, "", _path);
					} else {
						that.update()
					}
				} else if (e.type == 'popstate') {
					var state = e.originalEvent.state || {}
					_path = state.path || window.location.pathname.replace(/^\//, '')
				}
				if (_path != oldpath) that.update()
			},
			update: function () {
				var dt = 'fast'
				if (_path === null) {
					// this is the original page load. don't animate anything just jump
					// to the proper state
					_path = window.location.pathname.replace(/^\//, '')
					dt = 0
					dom.find('p').css('opacity', 0).show().fadeTo('slow', 1)
				}

				switch (_path) {
					case '':
					case '/':
						dom.find('p').text('a graph visualization library using web workers and jQuery')
						dom.find('> a').removeClass('active').attr('href', '#')

						$('#docs').fadeTo('fast', 0, function () {
							$(this).hide()
							$(that).trigger({type: 'mode', mode: 'visible', dt: dt})
						})
						break

					case 'introduction':
					case 'reference':
						$(that).trigger({type: 'mode', mode: 'hidden', dt: dt})
						dom.find('> p').text(_path)
						dom.find('> a').addClass('active').attr('href', '#')
						$('#docs').stop(true).css({opacity: 0}).show().delay(333).fadeTo('fast', 1)

						$('#docs').find(">div").hide()
						$('#docs').find('#' + _path).show()
						document.title = "arbor.js Â» " + _path
						break
				}

			}
		}
		return that
	}

	$(document).ready(function () {
		var CLR = {
			branch: "#b2b19d",
			code: "orange",
			doc: "#922E00",
			demo: "#a7af00",
			blue: "#020C77",
			red: "#e72d2e",
			blue2: "#21BAC1"
		}

		var theUI = {
			nodes: {
				"Skills": {color: "#8bc34a", shape: "dot", alpha: 1},

				Web: {color: "#3b323c", shape: "dot", alpha: 1},
				HTML: {color: CLR.demo, alpha: 0},
				CSS: {color: CLR.demo, alpha: 0},
				JavaScript: {color: CLR.demo, alpha: 0},
				Angular: {color: CLR.demo, alpha: 0},
				"Sencha Touch / Ext JS": {color: CLR.demo, alpha: 0},
				Bootstrap: {color: CLR.demo, alpha: 0},
				"Node.JS": {color: CLR.demo, alpha: 0},
				AJAX: {color: CLR.demo, alpha: 0},

				Software: {color: "#3b323c", shape: "dot", alpha: 1},
				Java: {color: CLR.doc, alpha: 0},
				C: {color: CLR.doc, alpha: 0},
				"C++": {color: CLR.doc, alpha: 0},

				Versioning: {color: "#3b323c", shape: "dot", alpha: 1},
				Git: {color: CLR.blue2, alpha: 0},
				SVN: {color: CLR.blue2, alpha: 0},

				System: {color: "#3b323c", shape: "dot", alpha: 1},
				Linux: {color: CLR.blue, alpha: 0},
				SSH: {color: CLR.blue, alpha: 0},
				LDAP: {color: CLR.blue, alpha: 0},
				Cryptology: {color: CLR.blue, alpha: 0},
				Network: {color: CLR.blue, alpha: 0},
				Kali: {color: CLR.blue, alpha: 0},

				Other: {color: "#3b323c", shape: "dot", alpha: 1},
				Illustrator: {color: CLR.red, alpha: 0},
				IoT: {color: CLR.red, alpha: 0},
				"Distributed Systems": {color: CLR.red, alpha: 0},
				"Smart-cities": {color: CLR.red, alpha: 0},
				"Smart-grid": {color: CLR.red, alpha: 0},
				DevOps: {color: CLR.red, alpha: 0},
				"Scrum/Agile": {color: CLR.red, alpha: 0},
				ChatBots: {color: CLR.red, alpha: 0},
				"Network & Security": {color: CLR.red, alpha: 0},

				Database: {color: "#3b323c", shape: "dot", alpha: 1},
				Oracle: {color: CLR.code, alpha: 0},
				MongoDb: {color: CLR.code, alpha: 0},
				MySQL: {color: CLR.code, alpha: 0}
			},
			edges: {
				"Skills": {
					Web: {length: .8},
					Software: {length: .8},
					Database: {length: .8},
					Versioning: {length: .8},
					System: {length: .8},
					Other: {length: .8}
				},
				Web: {
					HTML: {},
					CSS: {},
					JavaScript: {},
					Angular: {},
					"Sencha Touch / Ext JS": {},
					Bootstrap: {},
					"Node.JS": {},
					AJAX: {}
				},
				Software: {
					Java: {},
					C: {},
					"C++": {}
				},
				Database: {
					Oracle: {},
					MongoDb: {},
					MySQL: {}
				},
				Versioning: {
					Git: {},
					SVN: {}
				},
				System: {
					Linux: {},
					SSH: {},
					LDAP: {},
					Cryptology: {},
					Network: {},
					Kali: {}
				},
				Other: {
					Illustrator: {},
					IoT: {},
					"Distributed Systems": {},
					"Smart-cities": {},
					"Smart-grid": {},
					DevOps: {},
					"Scrum/Agile": {},
					ChatBots: {},
					"Network & Security": {}
				}
			}
		}


		var sys = arbor.ParticleSystem()
		sys.parameters({stiffness: 900, repulsion: 2000, gravity: true, dt: 0.015})
		sys.renderer = Renderer("#sitemap")
		sys.graft(theUI)

		var nav = Nav("#nav")
		$(sys.renderer).bind('navigate', nav.navigate)
		$(nav).bind('mode', sys.renderer.switchMode)
		nav.init()
	})
})(this.jQuery)