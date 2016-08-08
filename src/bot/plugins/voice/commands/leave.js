const Command = require('plugin').Command;

class Leave extends Command {

	get usage() { return ''; }
	get description() { return 'leave a voice channel'; }

	*authorize(msg, suffix) {
		return !msg.channel.isPrivate; // Cannot be PM.
	}

	*process(msg, suffix) {
		const connection = this.getVoiceConnection(msg.server);

		// If not connected to a voice channel on the server, don't do anything.
		if (connection == null) {
			return this.client.reply(msg, 'I\'m not in a voice channel, dummy.');
		}

		// Stop playing if doing so.
		if (connection.playing) connection.stopPlaying();

		// Leave the voice channel.
		this.client.leaveVoiceChannel(connection.voiceChannel);
	}

}

module.exports = Leave;
