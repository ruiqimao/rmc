import { EventEmitter } from 'events';
import { Duplex } from 'stream';

import CircularBuffer from 'circular-buffer';

export default class BufferStream extends Duplex {

	/*
	 * Constructor.
	 *
	 * @param initial The amount of data to wait for before writing.
	 * @param max The maximum size of the buffer.
	 */
	constructor(initial, max) {
		// Build the options for the base stream.
		const options = {
			decodeStrings: false,
			objectMode: false
		};

		// Call the stream.Duplex constructor.
		super(options);

		this.initial = initial; // Initial amount needed to flow.
		this.initialPass = false; // Set the initial pass to false.
		this.buffer = new CircularBuffer(max); // Create a circular buffer.
		this.waiting = null; // Used for the waiting chunk.
		this.requestedSize = 0; // Last requested size.
		this.canPush = true; // Can push right now.
		this.finished = false; // Not finished yet.
	}

	/*
	 * Override the emit function.
	 */
	emit(evt) {
		if (!Duplex.prototype._flush && evt === 'finish') {
			this._flush((err) => {
				if (err) EventEmitter.prototype.emit.call(this, 'error', err);
				else EventEmitter.prototype.emit.call(this, 'finish');
			});
		} else {
			const args = Array.prototype.slice.call(arguments);
			EventEmitter.prototype.emit.apply(this, args);
		}
	}

	/*
	 * Read event.
	 */
	_read(size) {
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
	tryPush() {
		// Get the total length of what would be pushed.
		const amountToPush = Math.min(this.buffer.length, this.requestedSize);

		// Check if it's possible to push right now.
		if (this.canPush &&
			amountToPush > 0 &&
			(this.initialPass || this.finished || this.buffer.length >= this.initial)) {
			this.initialPass = true;

			// Push the data.
			this.requestedSize = -1;
			this.canPush = this.push(Buffer.from(this.buffer.shift(amountToPush)));
		}

		// Append part of the waiting chunk if possible.
		if (this.waiting) {
			const chunk = this.waiting.chunk;
			const callback = this.waiting.callback;

			// Append the data to the buffer.
			const toPush = Math.min(this.buffer.remaining, chunk.length);
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
	_write(chunk, encoding, callback) {
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
	_flush(callback) {
		// Set finished to true.
		this.finished = true;

		// Callback with no errors.
		callback();
	}

};
