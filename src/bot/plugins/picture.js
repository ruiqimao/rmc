import { Plugin, Command } from 'plugin';

export default class extends Plugin {

	*init() {
		this.addCommand('picture', Picture);
	}

}

class Picture extends Command {

	get usage() { return ''; }
	get description() { return 'find a picture of me'; }

	*init() {
		// Picture URLs.
		this.pictures = [
			'http://vignette3.wikia.nocookie.net/gakusen-toshi-asterisk/images/7/77/RM-C_Anime.png/revision/latest?cb=20151129023211',
			'http://vignette1.wikia.nocookie.net/animevice/images/4/4f/Ernesta_adn_RM-C_(The_Asterisk_War_Ep_10).jpg/revision/latest?cb=20151207015043',
			'http://asteriskwar.com/assets/img/character/character_ph/rmc.png',
			'http://vignette4.wikia.nocookie.net/gakusen-toshi-asterisk/images/0/0d/AR-D_and_RM-C.png/revision/latest?cb=20151223062540',
			'http://vignette3.wikia.nocookie.net/gakusen-toshi-asterisk/images/7/77/RM-C_Anime.png/revision/20151129023211',
			'http://pa1.narvii.com/6116/979d62ebe858ee55261347c371e24785cf457195_hq.gif',
			'http://pm1.narvii.com/6116/372607a4e340abdaae88ecbad9cb63d26273ad39_hq.jpg',
			'http://asteriskwar.com/assets/img/story/17/ep_slide01.jpg'
		];

		// Responses.
		this.responses = [
			'Here you go!',
			'Don\'t look too closely, b-baka!',
			'Don\'t I look fabulous?',
			'Notice me, senpai!',
			'You better be thankful, I took this one just for you!',
			'I bet you\'re jacking off to this, pervert.'
		];
	}

	*authorize(msg, suffix) {
		// Everyone is allowed to look for pictures.
		return true;
	}

	*process(msg, suffix) {
		// Respond with a random picture and message.
		const index = Math.floor(Math.random() * this.pictures.length);
		const index2 = Math.floor(Math.random() * this.responses.length);
		yield this.client.sendFile(msg, this.pictures[index], 'image.jpg');
		this.client.sendMessage(msg, this.responses[index2]);
	}

}
