Sector.MainMenu = function(game) {};
Sector.MainMenu.prototype = {
	create: function() {
		this.gameLogo = this.add.sprite(30,30, 'logo');
		this.gameLogo.scale.setTo(1,1);

		this.gameCarrete = this.add.sprite(0, this.world.height - 75, 'carrete');
		this.gameCarrete.width = window.innerWidth;
		this.gameCarrete.height = 75;
		this.gameCarrete.scale.setTo(1,1);

		this.gameScore = this.add.text(this.world.width/2,0,"0",{
			font:"bold 42px Arial",
			fill: "#ffffff"
		});

		this.gameText1 = this.add.sprite((Sector._WIDTH)*0.5,(Sector._HEIGHT - 150)*0.5,'text-1');
		this.gameText1.anchor.setTo(0.5, 0.5);

		this.gameText2 = this.add.sprite((Sector._WIDTH)*0.5,(Sector._HEIGHT - 150)*0.5,'text-2');
		this.gameText2.anchor.setTo(0.5, 0.5);

		this.playButton = this.add.button((Sector._WIDTH)*0.5, (Sector._HEIGHT)*0.5, 'button-play', this.startGame, this, 2, 0, 1);
		this.playButton.anchor.set(0.5,0.5);
		this.playButton.input.useHandCursor = true;

		this.gameLeo = this.add.sprite(Math.round((this.world.width-77)/2), this.world.height - 100, 'leo');
		this.gameLeo.animations.add('feliz', [0], 10, true);
		this.gameLeo.animations.add('neutro', [1], 10, true);
		this.gameLeo.animations.add('triste', [2], 100, true);
    this.gameLeo.animations.play('neutro');

		//asignamos el color de fondo del juego
		this.stage.backgroundColor = "#1d1f20";
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		// using RESIZE scale mode
		this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.scale.setScreenSize(true);

	},
	update: function() {
		this.gameCarrete.y = this.world.height -75;
		this.gameCarrete.width = this.world.width;

		this.gameScore.x = this.world.width-this.gameScore.width - 90;
		this.gameScore.y = 80;

		this.gameText1.x = this.world.centerX;
		this.gameText1.y = this.world.centerY - 100;
		this.gameText2.x = this.world.width - 100;
		this.gameText2.y = 150;

		this.playButton.x = this.world.centerX;
		this.playButton.y = this.world.centerY;

		this.gameLeo.x = Math.round((this.world.width-77)/2) ;
		this.gameLeo.y = (this.world.height-167)-75;
	},
	startGame: function() {
		this.game.state.start('Game');
	}
};
