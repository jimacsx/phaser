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
		this.gameLeo.animations.add('feliz', [0], 10, true);
		this.gameLeo.animations.add('neutro', [1], 10, true);
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
    this.sndPunto = this.add.audio('punto');

		this.playAgainButton = this.add.button((Sector._WIDTH)*0.5, (Sector._HEIGHT)*0.5, 'button-playAgain', this.playAgain, this, 2, 0, 1);
		this.playAgainButton.anchor.set(0.5,0.5);
		this.playAgainButton.input.useHandCursor = true;
		this.playAgainButton.visible = false;

		/*--------------------------- Pantalla 5 ------------------------- */
		this.upsText = this.add.text(200, 250, '¡Ups!', {font:'34px Arial', fill: '#fff'});
		this.upsText.anchor.setTo(0.5, 0.5);
		this.upsText.visible = false;
    this.atrapasteText = this.add.text(200, 400, '', {font:'18px Arial', fill: '#fff'});
		this.atrapasteText.anchor.setTo(0.5, 0.5);
		this.atrapasteText.visible = false;

		/*--------------------------- Add the "fisica" ------------------------- */
		this.physics.enable(this.gameLeo, Phaser.Physics.ARCADE);
		this.gameLeo.body.collideWorldBounds = true;
    this.gameLeo.body.bounce.set(1);
    this.gameLeo.body.immovable = true;

		this.physics.enable(this.gameCarrete, Phaser.Physics.ARCADE);
		this.physics.enable(this.gameMove, Phaser.Physics.ARCADE);
		this.gameMove.body.velocity.x = 200;
		this.physics.enable(this.gameMove2, Phaser.Physics.ARCADE);
		this.gameMove2.body.velocity.x = 200;

		//variables
		this.gameStarted = true;
		this.pausa = false;
		this.velocityOscares = 200;
		this.giro = 100;
		this.puntaje = 0;
		this.cherryArray = [];
		this.oscarArray = [];
		this.posxLeo = 0;

		//up level each ten seconds
		this.upLevel = this.time.events.loop(10000, this.upLevel, this);
	},
	update: function() {
		this.onResize();
		//Si el juego ha empezado, se habilita el movimiento de LEO
		if(this.gameStarted) {
			this.onResize();
			//Mover a Leo con el cursor
			this.gameLeo.x = this.input.x;
			if(this.gameLeo.x < 24) {
	      this.gameLeo.x = 24;
	    } else if(this.gameLeo.x > this.world.width - 75) {
	      this.gameLeo.x = this.world.width - 101;
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
		oscar = this.gameOscares.create(xrandom, -(Math.random()*800), 'oscar');
		oscar.scale.setTo(1, 1);
    this.physics.arcade.enable(oscar);
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
		//detenemos moves que sueltan oscares y cherries
		this.gameMove.kill();
		this.gameMove2.kill();

		this.sndPunto.play();
		leo.animations.play('triste');
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
		//mostramos texto y botón de "JUGAR OTRA VES"
		this.upsText.visible = true;
		this.atrapasteText.setText('Atrapaste '+this.puntaje+' estatuillas');
		this.atrapasteText.visible = true;
		this.playAgainButton.visible = true;
		//pausamos juego
		this.gameStarted = false;
		this.pausa = true;
	},
	upLevel: function () {
		this.velocityOscares += 25;
		this.gameMove.body.velocity.x *= 1.2;
		this.gameMove2.body.velocity.x *= 0.75;
	},
	playAgain: function () {
		//Hide text and button of "JUGAR OTRA VES"
		this.upsText.visible = false;
		this.atrapasteText.visible = false;
		this.playAgainButton.visible = false;
		if(this.pausa) {
			//matamos arreglo de cherries que se mantienen en pausa
			this.cherryArray.filter(function(cherry) {
				return cherry.kill();
			});
			this.cherryArray = [];
			//matamos arreglo de oscares que se mantienen en pausa
			this.oscarArray.filter(function(oscar) {
				return oscar.kill();
			});
			this.oscarArray = [];
			//quitamos pausa en el juego
			this.pausa = false;
			//revivimos los moves que arrejan oscares y cherries
			this.gameMove.revive();
	    this.gameMove2.revive();
			//reiniciamos Juego
			this.reinit();
			this.gameStarted = true;
			this.gameLeo.animations.play('neutro');
		}
	},
	reinit: function () {
		this.velocityOscares = 200;
		this.puntaje = 0;
		this.gameScore.setText(this.puntaje);
		this.giro = 100;
		this.gameMove.body.velocity.x = 200;
		this.gameMove2.body.velocity.x = 200;
	},
	onResize: function () {
		this.gameCarrete.y = this.world.height -75;
		this.gameCarrete.width = this.world.width;

		this.gameScore.x = this.world.width-this.gameScore.width - 90;
		this.gameScore.y = 80;

		this.gameText2.x = this.world.width - 100;
		this.gameText2.y = 150;

		this.gameInstructions.x = this.world.centerX;
		this.gameInstructions.y = this.world.centerY + 100;

		this.upsText.x = this.world.centerX;
		this.upsText.y = this.world.centerY - 80;
		this.atrapasteText.x = this.world.centerX;
		this.atrapasteText.y = this.world.centerY - 40;

		this.playAgainButton.x = this.world.centerX;
		this.playAgainButton.y = this.world.centerY;

		if(this.pausa){
			this.gameLeo.x = this.input.x;
		}else{
			this.gameLeo.x = Math.round((this.world.width-77)/2) ;
		}
		this.gameLeo.y = (this.world.height-167)-75;
	}
};
