'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _stream = require('stream');

var _circularBuffer = require('circular-buffer');

var _circularBuffer2 = _interopRequireDefault(_circularBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferStream = function (_Duplex) {
	_inherits(BufferStream, _Duplex);

	/*
  * Constructor.
  *
  * @param initial The amount of data to wait for before writing.
  * @param max The maximum size of the buffer.
  */
	function BufferStream(initial, max) {
		_classCallCheck(this, BufferStream);

		// Build the options for the base stream.
		var options = {
			decodeStrings: false,
			objectMode: false
		};

		// Call the stream.Duplex constructor.

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferStream).call(this, options));

		_this.initial = initial; // Initial amount needed to flow.
		_this.initialPass = false; // Set the initial pass to false.
		_this.buffer = new _circularBuffer2.default(max); // Create a circular buffer.
		_this.waiting = null; // Used for the waiting chunk.
		_this.requestedSize = 0; // Last requested size.
		_this.canPush = true; // Can push right now.
		_this.finished = false; // Not finished yet.
		return _this;
	}

	/*
  * Override the emit function.
  */


	_createClass(BufferStream, [{
		key: 'emit',
		value: function emit(evt) {
			var _this2 = this;

			if (!_stream.Duplex.prototype._flush && evt === 'finish') {
				this._flush(function (err) {
					if (err) _events.EventEmitter.prototype.emit.call(_this2, 'error', err);else _events.EventEmitter.prototype.emit.call(_this2, 'finish');
				});
			} else {
				var args = Array.prototype.slice.call(arguments);
				_events.EventEmitter.prototype.emit.apply(this, args);
			}
		}

		/*
   * Read event.
   */

	}, {
		key: '_read',
		value: function _read(size) {
			console.log(size);
			this.requestedSize = size;

			// If the stream is finished and the buffer is empty, finish.
			if (this.finished && this.buffer.length == 0 && this.waiting == null) {
				this.push(null);
				return;
			}

			// Try to push data.
			this.canPush = true;
			this.tryPush();
		}

		/*
   * Try to push data.
   */

	}, {
		key: 'tryPush',
		value: function tryPush() {
			// Get the total length of what would be pushed.
			var amountToPush = Math.min(this.buffer.length, this.requestedSize);

			// Check if it's possible to push right now.
			if (this.canPush && amountToPush > 0 && (this.initialPass || this.finished || this.buffer.length >= this.initial)) {
				this.initialPass = true;

				// Push the data.
				this.requestedSize = -1;
				this.canPush = this.push(Buffer.from(this.buffer.shift(amountToPush)));
			}

			// Append part of the waiting chunk if possible.
			if (this.waiting) {
				var chunk = this.waiting.chunk;
				var callback = this.waiting.callback;

				// Append the data to the buffer.
				var toPush = Math.min(this.buffer.remaining, chunk.length);
				this.buffer.push(chunk.slice(0, toPush));

				// Adjust the waiting chunk.
				this.waiting.chunk = chunk.slice(toPush);

				// If the waiting chunk is gone, callback and reset.
				if (this.waiting.chunk.length == 0) {
					this.waiting = null;
					callback();
				}

				// Try pushing.
				if (toPush > 0) this.tryPush();
			}
		}

		/*
   * Write event.
   */

	}, {
		key: '_write',
		value: function _write(chunk, encoding, callback) {
			// Determine if the chunk is too big.
			if (this.buffer.remaining < chunk.length) {
				// Put the chunk in waiting.
				this.waiting = {
					chunk: chunk,
					callback: callback
				};

				// Try pushing.
				this.tryPush();

				return;
			}

			// Write the chunk into the buffer.
			this.buffer.push(chunk);

			// Try pushing if appropriate.
			this.tryPush();

			// Callback.
			callback();
		}

		/*
   * Flush event.
   */

	}, {
		key: '_flush',
		value: function _flush(callback) {
			// Set finished to true.
			this.finished = true;

			// Callback with no errors.
			callback();
		}
	}]);

	return BufferStream;
}(_stream.Duplex);

exports.default = BufferStream;
;