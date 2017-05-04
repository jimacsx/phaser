var Sector = {
	_WIDTH: window.innerWidth * window.devicePixelRatio,
	_HEIGHT: window.innerHeight * window.devicePixelRatio
};
Sector.Boot = function(game) {};
Sector.Boot.prototype = {
	preload: function() {
		this.load.image('logo','img/logo-sectorcine.png');
		this.load.image('carrete','img/carrete.png');
		this.load.image('text-1', 'img/text-1.png');
		this.load.image('text-2', 'img/text-2.png');
		this.load.image('instructions', 'img/instructions.png');
		this.load.spritesheet('button-play', 'img/button-play.png');
		this.load.spritesheet('button-playAgain', 'img/button-playAgain.png');
		this.load.spritesheet('leo','img/leo.png',77, 169);
		this.load.image('oscar','img/oscar.png');
		this.load.image('cherry','img/cherry.png');
		this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);
		this.load.audio('punto','audio/numkey.wav');
		this.load.image('move','img/line-score.png', 32, 48);
	},
	create: function() {
		this.fullScreen();
		this.game.state.start('MainMenu');
	},
	fullScreen: function() {
		this.game.stage.backgroundColor = "#1d1f20";
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.setScreenSize(true);
	}
};
