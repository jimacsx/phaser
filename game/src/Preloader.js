Sector.Preloader = function(game) {};
Sector.Preloader.prototype = {
	preload: function() {
		this.load.image('logo','img/logo-sectorcine.png');
		this.load.image('carrete','img/carrete.png');
		this.load.image('text-1', 'img/text-1.png');
		this.load.image('text-2', 'img/text-2.png');
		this.load.image('instructions', 'img/instructions.png');
		this.load.spritesheet('button-play', 'img/button-play.png');
		this.load.spritesheet('leo','img/leo.png',77, 169);
		this.load.image('oscar','img/oscar.png');
		this.load.image('cherry','img/cherry.png');
		this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);
		this.load.audio('punto','audio/numkey.wav');

		this.load.image('move','img/line-score.png', 32, 48);
		/*this.load.image('ball', 'img/ball.png');
		this.load.image('hole', 'img/hole.png');
		this.load.image('element-w', 'img/element-w.png');
		this.load.image('element-h', 'img/element-h.png');
		this.load.image('panel', 'img/panel.png');
		this.load.image('title', 'img/title.png');
		this.load.image('button-pause', 'img/button-pause.png');
		this.load.image('screen-bg', 'img/screen-bg.png');
		this.load.image('screen-mainmenu', 'img/screen-mainmenu.png');
		this.load.image('screen-howtoplay', 'img/screen-howtoplay.png');
		this.load.image('border-horizontal', 'img/border-horizontal.png');
		this.load.image('border-vertical', 'img/border-vertical.png');

		this.load.spritesheet('button-audio', 'img/button-audio.png', 35, 35);
		this.load.spritesheet('button-start', 'img/button-start.png', 146, 51);

		this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);*/
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};
