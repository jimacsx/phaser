Sector.Game = function(game) {};
Sector.Game.prototype = {
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

		this.gameText2 = this.add.sprite((Sector._WIDTH)*0.5,(Sector._HEIGHT - 150)*0.5,'text-2');
		this.gameText2.anchor.setTo(0.5, 0.5);

		this.gameInstructions = this.add.sprite(100,100,'instructions');
		this.gameInstructions.anchor.setTo(0.5, 0.5);
		//put delay to hide instructions
		this.time.events.add(3000, function() { this.gameInstructions.destroy();  }, this);

		this.gameLeo = this.add.sprite(Math.round((this.world.width-77)/2), this.world.height - 100, 'leo');
		this.gameLeo.animations.add('neutro', [1], 10, true);
    this.gameLeo.animations.add('feliz', [0], 10, true);
		this.gameLeo.animations.add('triste', [2], 100, true);
    this.gameLeo.animations.play('neutro');
		this.gameLeo.scale.setTo(1,1);

		//variables
		this.pausa = false;

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

		this.gameText2.x = this.world.width - 100;
		this.gameText2.y = 150;

		this.gameInstructions.x = this.world.centerX;
		this.gameInstructions.y = this.world.centerY + 100;

		if(this.pausa){
			console.log("pausa");
			this.gameLeo.x = this.input.x;
		}else{
			console.log("no pausa");
			this.gameLeo.x = Math.round((this.world.width-77)/2) ;
		}
		this.gameLeo.y = (this.world.height-167)-75;
	}
};
/*Sector.Game = function(game) {};
Sector.Game.prototype = {
	create: function() {
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(0, 0, 'panel');
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.fontSmall = { font: "16px Arial", fill: "#e4beef" };
		this.fontBig = { font: "24px Arial", fill: "#e4beef" };
		this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
		this.audioStatus = true;
		this.timer = 0;
		this.totalTimer = 0;
		this.level = 1;
		this.maxLevels = 5;
		this.movementForce = 10;
		this.ballStartPos = { x: Sector._WIDTH*0.5, y: 450 };

		this.pauseButton = this.add.button(Sector._WIDTH-8, 8, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.audioButton = this.add.button(Sector._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);
		this.timerText = this.game.add.text(15, 15, "Time: "+this.timer, this.fontBig);
		this.levelText = this.game.add.text(120, 10, "Level: "+this.level+" / "+this.maxLevels, this.fontSmall);
		this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontSmall);

		this.hole = this.add.sprite(Sector._WIDTH*0.5, 90, 'hole');
		this.physics.enable(this.hole, Phaser.Physics.ARCADE);
		this.hole.anchor.set(0.5);
		this.hole.body.setSize(2, 2);

		this.ball = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'ball');
		this.ball.anchor.set(0.5);
		this.physics.enable(this.ball, Phaser.Physics.ARCADE);
		this.ball.body.setSize(18, 18);
		this.ball.body.bounce.set(0.3, 0.3);

		this.initLevels();
		this.showLevel(1);
		this.keys = this.game.input.keyboard.createCursorKeys();

		Sector._player = this.ball;
		window.addEventListener("deviceorientation", this.handleOrientation, true);

		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.borderGroup.create(0, 50, 'border-horizontal');
		this.borderGroup.create(0, Sector._HEIGHT-2, 'border-horizontal');
		this.borderGroup.create(0, 0, 'border-vertical');
		this.borderGroup.create(Sector._WIDTH-2, 0, 'border-vertical');
		this.borderGroup.setAll('body.immovable', true);
		this.bounceSound = this.game.add.audio('audio-bounce');
	},
	initLevels: function() {
		this.levels = [];
		this.levelData = [
			[
				{ x: 96, y: 224, t: 'w' }
			],
			[
				{ x: 72, y: 320, t: 'w' },
				{ x: 200, y: 320, t: 'h' },
				{ x: 72, y: 150, t: 'w' }
			],
			[
				{ x: 64, y: 352, t: 'h' },
				{ x: 224, y: 352, t: 'h' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 200, y: 52, t: 'h' }
			],
			[
				{ x: 78, y: 352, t: 'h' },
				{ x: 78, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 192, y: 240, t: 'w' },
				{ x: 30, y: 150, t: 'w' },
				{ x: 158, y: 150, t: 'w' }
			],
			[
				{ x: 188, y: 352, t: 'h' },
				{ x: 92, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 256, y: 240, t: 'h' },
				{ x: 180, y: 52, t: 'h' },
				{ x: 52, y: 148, t: 'w' }
			]
		];
		for(var i=0; i<this.maxLevels; i++) {
			var newLevel = this.add.group();
			newLevel.enableBody = true;
			newLevel.physicsBodyType = Phaser.Physics.ARCADE;
			for(var e=0; e<this.levelData[i].length; e++) {
				var item = this.levelData[i][e];
				newLevel.create(item.x, item.y, 'element-'+item.t);
			}
			newLevel.setAll('body.immovable', true);
			newLevel.visible = false;
			this.levels.push(newLevel);
		}
	},
	showLevel: function(level) {
		var lvl = level | this.level;
		if(this.levels[lvl-2]) {
			this.levels[lvl-2].visible = false;
		}
		this.levels[lvl-1].visible = true;
	},
	updateCounter: function() {
		this.timer++;
		this.timerText.setText("Time: "+this.timer);
		this.totalTimeText.setText("Total time: "+(this.totalTimer+this.timer));
	},
	managePause: function() {
		this.game.paused = true;
		var pausedText = this.add.text(Sector._WIDTH*0.5, 250, "Game paused,\ntap anywhere to continue.", this.fontMessage);
		pausedText.anchor.set(0.5);
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
		}, this);
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},
	update: function() {
		if(this.keys.left.isDown) {
			this.ball.body.velocity.x -= this.movementForce;
		}
		else if(this.keys.right.isDown) {
			this.ball.body.velocity.x += this.movementForce;
		}
		if(this.keys.up.isDown) {
			this.ball.body.velocity.y -= this.movementForce;
		}
		else if(this.keys.down.isDown) {
			this.ball.body.velocity.y += this.movementForce;
		}
		this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
		this.physics.arcade.collide(this.ball, this.levels[this.level-1], this.wallCollision, null, this);
		this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);
	},
	wallCollision: function() {
		if(this.audioStatus) {
			this.bounceSound.play();
		}
		// Vibration API
		if("vibrate" in window.navigator) {
			window.navigator.vibrate(100);
		}
	},
	handleOrientation: function(e) {
		// Device Orientation API
		var x = e.gamma; // range [-90,90], left-right
		var y = e.beta;  // range [-180,180], top-bottom
		var z = e.alpha; // range [0,360], up-down
		Sector._player.body.velocity.x += x;
		Sector._player.body.velocity.y += y*0.5;
	},
	finishLevel: function() {
		if(this.level >= this.maxLevels) {
			this.totalTimer += this.timer;
			alert('Congratulations, game completed!\nTotal time of play: '+this.totalTimer+' seconds!');
			this.game.state.start('MainMenu');
		}
		else {
			alert('Congratulations, level '+this.level+' completed!');
			this.totalTimer += this.timer;
			this.timer = 0;
			this.level++;
			this.timerText.setText("Time: "+this.timer);
			this.totalTimeText.setText("Total time: "+this.totalTimer);
			this.levelText.setText("Level: "+this.level+" / "+this.maxLevels);
			this.ball.body.x = this.ballStartPos.x;
			this.ball.body.y = this.ballStartPos.y;
			this.ball.body.velocity.x = 0;
			this.ball.body.velocity.y = 0;
			this.showLevel();
		}
	},
	render: function() {
		// this.game.debug.body(this.ball);
		// this.game.debug.body(this.hole);
	}
};*/
