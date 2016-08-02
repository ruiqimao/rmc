'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dashboard = function (_Command) {
	_inherits(Dashboard, _Command);

	function Dashboard() {
		_classCallCheck(this, Dashboard);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Dashboard).apply(this, arguments));
	}

	_createClass(Dashboard, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			var allowed;
			return regeneratorRuntime.wrap(function authorize$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							allowed = !msg.channel.isPrivate && // Cannot be a PM.
							_plugin.Util.checkPermission(msg.channel, msg.author, 'administrator'); // Must be an admin.

							return _context.abrupt('return', allowed);

						case 2:
						case 'end':
							return _context.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var dashboard, token;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return this.plugin.Dash.getEntry(msg.server.id, null);

						case 2:
							dashboard = _context2.sent;

							if (!(suffix == 'generate')) {
								_context2.next = 7;
								break;
							}

							// Generate the new token and save it.
							dashboard.val(this.generateRandomToken(msg.server.id));
							_context2.next = 7;
							return dashboard.save();

						case 7:

							// Get the dashboard token.
							token = void 0;

							if (!(dashboard.val() !== null)) {
								_context2.next = 12;
								break;
							}

							// Dashboard exists, so get the token.
							token = dashboard.val();
							_context2.next = 16;
							break;

						case 12:
							// Dashboard doesn't exist, so create one.
							token = this.generateRandomToken(msg.server.id);

							// Set the dashboard and save.
							dashboard.val(token);
							_context2.next = 16;
							return dashboard.save();

						case 16:

							// Let the user know the dashboard link in a PM.
							this.client.sendMessage(msg.author, this.config.SERVER_URL + '/dashboard/' + token);
							this.client.sendMessage(msg, 'Check your PMs.');

						case 18:
						case 'end':
							return _context2.stop();
					}
				}
			}, process, this);
		})

		/*
   * Generate a new random token.
   *
   * @param id The server id.
   *
   * @return The random token.
   */

	}, {
		key: 'generateRandomToken',
		value: function generateRandomToken(id) {
			return _crypto2.default.createHash('md5').update(id + _crypto2.default.randomBytes(128).toString('hex')).digest('hex');
		}
	}, {
		key: 'usage',
		get: function get() {
			return '[generate]';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'View the admin dashboard or regenerate the link for one.';
		}
	}]);

	return Dashboard;
}(_plugin.Command);

exports.default = Dashboard;