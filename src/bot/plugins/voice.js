import { Plugin, Command, Util } from 'plugin';

export default class extends Plugin {

	*init() {
		this.addCommand('join', Join);
		this.addCommand('leave', Leave);
	}

}

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
