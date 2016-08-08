const Command = require('plugin').Command;

class Join extends Command {

	get usage() { return ''; }
	get description() { return 'join a voice channel'; }

	*authorize(msg, suffix) {
		return !msg.channel.isPrivate; // Cannot be PM.
	}

	*process(msg, suffix) {
		// Get the voice channel to join.
		const channel = msg.author.voiceChannel;

		// If the channel is null, don't do anything.
		if (channel == null) {
			return this.client.reply(msg, 'You\'re not in a voice channel, dummy.');
		}

		// Join the channel.
		this.client.joinVoiceChannel(channel);
	}

}

module.exports = Join;
