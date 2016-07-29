import Command, { Util } from './command';

export class Join extends Command {

	get usage() { return ''; }
	get description() { return 'join a voice channel'; }

	authorize(msg, suffix, next) {
		const allowed =
			  !msg.channel.isPrivate && // Cannot be PM.
			  Util.checkRole(msg.server, msg.author, this.config.commander); // Must be a commander.
		next(allowed);
	}

	process(msg, suffix) {
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

export class Leave extends Command {

	get usage() { return ''; }
	get description() { return 'leave a voice channel'; }

	authorize(msg, suffix, next) {
		const allowed =
			  !msg.channel.isPrivate && // Cannot be PM.
			  Util.checkRole(msg.server, msg.author, this.config.commander); // Must be a commander.
		next(allowed);
	}

	process(msg, suffix) {
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
