'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Profile = function (_Command) {
	_inherits(Profile, _Command);

	function Profile() {
		_classCallCheck(this, Profile);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Profile).apply(this, arguments));
	}

	_createClass(Profile, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							if (!msg.channel.isPrivate) {
								_context.next = 2;
								break;
							}

							return _context.abrupt('return', false);

						case 2:
							return _context.abrupt('return', true);

						case 3:
						case 'end':
							return _context.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var user, details, count, entries, response;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!(suffix.length == 0)) {
								_context2.next = 2;
								break;
							}

							return _context2.abrupt('return', this.client.reply(msg, 'Yeah I\'d do that for you... if you actually gave me someone to look up. Dumbass.'));

						case 2:

							// Get the user mentioned.
							user = this.getUserFromMention(suffix);

							if (!(user === null)) {
								_context2.next = 5;
								break;
							}

							return _context2.abrupt('return', this.client.reply(msg, 'I dunno who that is... too bad.'));

						case 5:

							// Get the user's info in the server.
							details = msg.server.detailsOfUser(user);

							// Get the message count.

							count = 0;
							_context2.next = 9;
							return this.plugin.MessageCount.find({
								'server': msg.server.id,
								'author': user.id
							});

						case 9:
							entries = _context2.sent;

							if (entries[0]) count = entries[0].get('count');

							// Construct the response.
							response = '**@' + (details.nick || user.username) + '**';

							if (user.bot) response += ' (Bot)';
							response += ':\n';
							response += 'ID: ' + user.id + '\n';
							response += 'Username: ' + user.username + '\n';
							if (details.nick) response += 'Nickname: ' + details.nick + '\n';
							response += 'Avatar: ' + user.avatarURL + '\n';
							if (details.roles) response += 'Roles: ' + details.roles.map(function (role) {
								return role.name;
							}).join(', ') + '\n', response += 'Messages: ' + count;

							// Respond.
							this.client.sendMessage(msg, response);

						case 20:
						case 'end':
							return _context2.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '<user>';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'get a user\'s profile';
		}
	}]);

	return Profile;
}(_plugin.Command);

exports.default = Profile;