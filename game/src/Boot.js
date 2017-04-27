var Sector = {
	_WIDTH: window.innerWidth * window.devicePixelRatio,
	_HEIGHT: window.innerHeight * window.devicePixelRatio
};
Sector.Boot = function(game) {};
Sector.Boot.prototype = {
	preload: function() {
	},
	create: function() {
		this.game.stage.backgroundColor = "#1d1f20";
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.state.start('Preloader');
	}
};
