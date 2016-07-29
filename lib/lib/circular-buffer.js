'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CircularBuffer = function () {

	/*
  * Constructor.
  *
  * @param size The size of the buffer.
  */
	function CircularBuffer(size) {
		_classCallCheck(this, CircularBuffer);

		this.buffer = Buffer.alloc(size); // Allocate the buffer.
		this.capacity = size; // The capacity of the buffer.
		this.length = 0; // Nothing stored in the buffer.
		this.remaining = size; // All space is still remaining.
		this.begin = 0; // Beginning of the buffer.
		this.end = 0; // End of the buffer.
	}

	/*
  * Push data into the buffer.
  *
  * @param data A buffer of data.
  */


	_createClass(CircularBuffer, [{
		key: 'push',
		value: function push(data) {
			// Truncate the data if necessary.
			data = data.slice(0, Math.min(this.remaining, data.length));

			// Get the amount of data until the end of the buffer.
			var tilEnd = this.buffer.length - this.end;

			// Write as much data as possible.
			var toWrite = Math.min(tilEnd, data.length);
			data.copy(this.buffer, this.end, 0, toWrite);

			// Write the rest to the beginning if necessary.
			data.copy(this.buffer, 0, toWrite, data.length);

			// Adjust the end pointer as needed.
			this.end += data.length;
			this.end = this.end % this.buffer.length;

			// Adjust length and remaining.
			this.length += data.length;
			this.remaining -= data.length;
		}

		/*
   * Peek at the first element in the buffer.
   *
   * @param size The amount of data to peek at.
   *
   * @return A buffer containing the data.
   */

	}, {
		key: 'peek',
		value: function peek(size) {
			// Reduce the size if necessary.
			size = Math.min(this.length, size);

			// Find if the data wraps around.
			var wraps = this.begin + size >= this.buffer.length;
			var result = void 0;
			if (wraps) {
				// Wraps, so allocate a new buffer for the result.
				result = Buffer.alloc(size);
				this.buffer.copy(result, 0, this.begin, this.buffer.length);
				var alreadyCopied = this.buffer.length - this.begin;
				this.buffer.copy(result, alreadyCopied, 0, size - alreadyCopied);
			} else {
				// Doesn't wrap, so just give a slice of the buffer.
				result = this.buffer.slice(this.begin, this.begin + size);
			}

			// Return the result.
			return result;
		}

		/*
   * Shift data from the buffer.
   *
   * @param size The amount of data to shift.
   *
   * @return A buffer containing the data shifted.
   */

	}, {
		key: 'shift',
		value: function shift(size) {
			// Reduce the size if necessary.
			size = Math.min(this.length, size);

			// Get the result from peek.
			var result = this.peek(size);

			// Adjust the begin pointer as needed.
			this.begin += size;
			this.begin = this.begin % this.buffer.length;

			// Adjust the length and remaining.
			this.length -= size;
			this.remaining += size;

			// Return the result.
			return result;
		}
	}]);

	return CircularBuffer;
}();

exports.default = CircularBuffer;
;