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

		//create groups of oscares and cherries
 		this.gameOscares = this.add.group();
		this.gameCherries = this.add.group();

		//Add the moves
		x = this.rnd.integerInRange(10, this.world.width);
 		this.gameMove = this.add.sprite(x, 10, 'move');
		this.gameMove.visible = true;
		x2 = this.rnd.integerInRange(10, this.world.width);
 		this.gameMove2 = this.add.sprite(x, 10, 'move');
		this.gameMove2.visible = true;

		//Sound
    this.sndPunto = this.add.audio('audio-bounce');

		/*--------------------------- Add the "fisica" ------------------------- */
		this.physics.enable(this.gameLeo, Phaser.Physics.ARCADE);
		this.gameLeo.body.collideWorldBounds = true;
    this.gameLeo.body.bounce.set(1);
    this.gameLeo.body.immovable = true;

		this.physics.enable(this.gameCarrete, Phaser.Physics.ARCADE);
		this.physics.enable(this.gameMove, Phaser.Physics.ARCADE);
		this.gameMove.body.velocity.x = 100;
		this.physics.enable(this.gameMove2, Phaser.Physics.ARCADE);
		this.gameMove2.body.velocity.x = 100;

		//variables
		this.gameStarted = true;
		this.pausa = false;
		this.velocityOscares = 100;
		this.giro = 50;
		this.puntaje = 0;
		this.cherryArray = [];
		this.oscarArray = [];
		this.posxLeo = 0;


		this.upLevel = this.time.events.loop(10000, this.upLevel, this);
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

		//Si el juego ha empezado, se habilita el movimiento de LEO
		if(this.gameStarted) {
			//Mover a Leo con el cursor
			this.gameLeo.x = this.input.x;

			if(!this.pausa){
				console.log("no pausa");
				this.gameLeo.x = this.input.x;
				if(this.gameLeo.x < 24) {
					this.gameLeo.x = 24;
				} else if(this.gameLeo.x > this.world.width - 75) {
					this.gameLeo.x = this.world.width - 101;
				}
			}else{
				console.log("pausa");
				this.gameLeo.x = Math.round((this.world.width-77)/2) ;
			}
			this.gameLeo.y = (this.world.height-167)-75;

			//tiramos oscares de acuerdo a la posicion de move
			if(this.gameMove.body.velocity.x > 0 && this.gameMove.x > this.giro){
				this.gameMove.body.velocity.x *= -1;
				this.giro = this.rnd.integerInRange(0, this.gameMove.x - 800);
				this.releaseOscar();
			}
			if(this.gameMove.body.velocity.x < 0 && this.gameMove.x < this.giro){
				this.gameMove.body.velocity.x *= -1;
				this.giro = this.rnd.integerInRange(this.gameMove.x + 800, this.world.width);
				//this.giro = this.rnd.integerInRange(0, this.gameMove.x - 50);
				this.releaseOscar();
			}
			//tiramos cherries de acuerdo a la posicion de move
			if(this.gameMove2.body.velocity.x > 0 && this.gameMove2.x > this.giro){
				this.gameMove2.body.velocity.x *= -1;
				this.giro = this.rnd.integerInRange(0, this.gameMove2.x - 800);
				this.releaseOscar();
			}
			if(this.gameMove2.body.velocity.x < 0 && this.gameMove2.x < this.giro){
				this.gameMove2.body.velocity.x *= -1;
				this.giro = this.rnd.integerInRange(this.gameMove2.x + 800, this.world.width);
				//this.giro = this.rnd.integerInRange(0, this.gameMove.x - 50);
				this.releaseCherry();
			}
			//this.releaseOscar();

			//mandamos a llamar función killOscares cada que haya collision entre carrete y oscares
			this.physics.arcade.overlap(this.gameCarrete, this.gameOscares, this.killOscares, null, this);
			this.physics.arcade.overlap(this.gameCarrete, this.gameCherries, this.killCherries, null, this);
			//
			this.physics.arcade.overlap(this.gameLeo, this.gameOscares, this.catchOscares, null, this);
			this.physics.arcade.overlap(this.gameLeo, this.gameCherries, this.catchCherries, null, this);
		} else {
			if(this.pausa){
				this.gameLeo.x = this.posxLeo;
			}
		}
	},
	releaseOscar: function () {
		xrandom = this.world.randomX;
		if(xrandom > this.world.width - 80) {
			xrandom = xrandom - 80;
		} else if(xrandom < 24){
			xrandom = 80;
		} else {
			xrandom = xrandom;
		}
		var oscar = this.gameOscares.create(xrandom, -(Math.random()*800), 'oscar');
		oscar.scale.setTo(1, 1);
    this.physics.arcade.enable(oscar);
		console.log("velocityOscares: " +Math.round(this.velocityOscares));
    oscar.body.velocity.y = Math.round(this.velocityOscares);

		//guardamos oscares para poder hacer la Pausa del juego
		this.oscarArray.push(oscar);
	},
	releaseCherry: function () {
		xrandom = this.world.randomX;
		if(xrandom > this.world.width - 80) {
			xrandom = xrandom - 80;
		} else if(xrandom < 24){
			xrandom = 80;
		} else {
			xrandom = xrandom;
		}
		cherry = this.gameCherries.create(xrandom, -(Math.random()*800), 'cherry');
    this.physics.arcade.enable(cherry);
    cherry.body.velocity.y = Math.round(this.velocityOscares);
		//guardamos oscares para poder hacer la Pausa del juego
		this.cherryArray.push(cherry);
	},
	killOscares: function (carrete, oscar) {
		oscar.kill();
	},
	killCherries: function (carrete, oscar) {
		oscar.kill();
	},
	catchOscares: function (leo, oscar) {
		oscar.kill();
		this.puntaje += 1;
		this.gameScore.setText(this.puntaje);
		this.sndPunto.play();
		leo.animations.play('feliz');
		this.time.events.add(300, function() { leo.animations.play('neutro');  }, this);
	},
	catchCherries: function (leo, cherry) {
		//cherry.kill();
		this.sndPunto.play();
		leo.animations.play('triste');
		/*this.game.paused = true;
		this.input.onDown.add(function(){
			this.game.paused = false;
		}, this);*/
		//detenemos cherries para simular PAUSA del juego
		this.cherryArray.filter(function(cherry) {
			return cherry.body.velocity = false;
		});
		//detenemos oscares para simular PAUSA del juego
		this.oscarArray.filter(function(oscar) {
			return oscar.body.velocity = false;
		});
		//guardamos la posición en la que LEO tocó una cherry para poder detenerlo
		this.posxLeo = this.input.x;
		//pausamos juego
		this.gameStarted = false;
		this.pausa = true;
	},
	upLevel: function () {
		this.velocityOscares += 10;
		this.gameMove.body.velocity.x *= 1.2;
		this.gameMove2.body.velocity.x *= 0.5;
	}
};
