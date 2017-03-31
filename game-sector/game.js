window.onload = function() {

	// game definition, 100% of browser window dimension
	var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,Phaser.CANVAS,"",{
		preload:onPreload,
		create:onCreate,
		update:onUpdate,
		resize:onResize // <- this will be called each time the game is resized
	});

	var gameStarted = false;
	// first function to be called, when the game preloads I am loading the sprite sheet with all game tiles
	function onPreload() {
		game.load.spritesheet('logo','logo-sectorcine.png');
		game.load.spritesheet('carrete','carrete.png');
		game.load.spritesheet('leo','leo.png');
		//game.load.spritesheet('triste','triste.png');
		game.load.spritesheet('linea','line-score.png');
		game.load.spritesheet('upsText','ups.png');
		game.load.spritesheet('button','boton.png', 193, 71);
		game.load.spritesheet('button2','boton2.png', 193, 71);
		game.load.spritesheet('instructionsText','instructions.png');
		game.load.image('move','line-score.png', 32, 48);
		game.load.image('move2','line-score.png', 32, 48);
		game.load.image('oscar','oscar.png');
		game.load.image('cherry','cherry.png');
		game.load.audio('punto','numkey.wav');
	}

	// function to scale up the game to full screen
	function goFullScreen(){
		// setting a background color
		game.stage.backgroundColor = "#1d1f20";
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		// using RESIZE scale mode
		game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		game.scale.setScreenSize(true);
	}

	// function to be called when the game has been created
	function onCreate() {
		// going full screen with the function defined at line 32
		goFullScreen();

		logo = game.add.sprite(80,25, 'logo');
		logo.width = 194;
		logo.height = 68;

		carrete = game.add.sprite(0, game.world.height -75, 'carrete');
		carrete.width = window.innerWidth;
		carrete.height = 75;

		leo = game.add.sprite(0, game.world.height - 100, 'leo');
		leo.width = 77;
		leo.height = 167;

		linea = game.add.sprite(0, 200, 'linea');
		linea.width = 175;
		linea.height = 2;

		score = game.add.text(game.width/2,0,"0",{
			font:"bold 42px Arial",
			fill: "#ffffff"
		});
		scoreText = game.add.text(game.width/2,190,"Estamos consultando con",{
			font:"bold 14px Arial",
			fill: "#ffffff"
		});
		scoreText.anchor.y=1;
		scoreText2 = game.add.text(game.width/2,190,"el oráculo qué pasó.",{
			font:"bold 14px Arial",
			fill: "#ffffff"
		});
		scoreText2.anchor.y=1;

		/*--------------------------- Pantalla 1 ------------------------- */
		upsText = game.add.sprite(100,100,'upsText');
		upsText.anchor.setTo(0.5, 0.5)
		//upsText.width = 200;
		//upsText.height = 100;
		//  Standard button (also used as our pointer tracker)
	 	boton = game.add.button(100, 100, 'button', '', this, 2, 1, 0);
	 	boton.name = 'play';
	 	boton.anchor.setTo(0.5, 0.5);
    boton.onInputUp.add(actionPlay, this);
		//boton.inputEnable = true;
		boton.input.useHandCursor = true;

		/*--------------------------- Pantalla 2 ------------------------- */
		instructionsText = game.add.sprite(100,100,'instructionsText');
		instructionsText.anchor.setTo(0.5, 0.5);
		instructionsText.visible = false;

		//Agregamos el move
 		move = game.add.sprite(32, 10, 'move');
		move.visible = false;
		move2 = game.add.sprite(32, 10, 'move2');
		move2.visible = false;
		/*--------------------------- Pantalla 5 ------------------------- */
		ups2Text = game.add.text(200, 250, '¡Ups!', {font:'34px Arial', fill: '#fff'});
		ups2Text.anchor.setTo(0.5, 0.5);
		ups2Text.visible = false;
    atrapasteText = game.add.text(200, 400, '', {font:'18px Arial', fill: '#fff'});
		atrapasteText.anchor.setTo(0.5, 0.5);
		atrapasteText.visible = false;

		boton2 = game.add.button(100, 100, 'button2', '', this, 2, 1, 0);
	 	boton2.name = 'gameOver';
	 	boton2.anchor.setTo(0.5, 0.5);
    boton2.onInputUp.add(actionPlayAgain, this);
		//boton2.inputEnable = true;
		boton2.input.useHandCursor = true;
		boton2.visible = false;
		/*--------------------------- Agregamos la "fisica" ------------------------- */
		game.physics.enable(leo, Phaser.Physics.ARCADE);
		game.physics.enable(move, Phaser.Physics.ARCADE);
		game.physics.enable(move2, Phaser.Physics.ARCADE);

    leo.body.collideWorldBounds = true;
    leo.body.bounce.set(1);
    leo.body.immovable = true;

		//Para que el move no se caiga
 		//move.body.gravity.y = 300;
		move.body.immovable = true;
		//Empieza a correr
 		move.body.velocity.x = 200;

		move2.body.immovable = true;
		//Empieza a correr
 		move2.body.velocity.x = 80;

 		//Variables del juego
 		game.giro = 250;
 		game.gravedadOscares = 150;

		game.giro2 = 250;
 		game.gravedadCherries = 150;

		game.puntaje = 0;
 		oscares = game.add.group();
		cherries = game.add.group();
		//Sonidos
    sndPunto = game.add.audio('punto');
		//nivel
		game.nivel = 1;
		game.subirNivel = game.time.events.loop(10000, subirNivel, this);
		// normall, onResize is called each time the browser is resized, anyway I am calling it the first time
		// to place all responsive elements in their right positions.
    onResize();
	}
	function actionPlay () {
		//ocultamos texto y boton de pantalla 1
		upsText.visible = false;
		boton.visible = false;
		//mostramos texto de pantalla 2
		instructionsText.visible = true;
		move.visible = true;
		move2.visible = true;
		//iniciar juego
		gameStarted = true;
	}
	function onResize(){
		// this function is called each time the browser is resized, and re-positions
		// game elements to keep them in their right position according to game size
		carrete.y = game.height-75;
		carrete.width = window.innerWidth;

		leo.x = Math.round((game.width-77)/2) ;
		leo.y = (game.height-167)-75;

		upsText.x = game.world.centerX;
		upsText.y = game.world.centerY - 80;

		boton.x = game.world.centerX;
		boton.y = game.world.centerY + 40 ;

		score.x = game.width-score.width - 135;
		score.y = 170;
		linea.x = game.width-linea.width - 50;
		linea.y = 220;
		scoreText.x = game.width-scoreText.width - 50;
		scoreText.y = 250;
		scoreText2.x = game.width-scoreText2.width - 50;
		scoreText2.y = 270;

		instructionsText.x = game.world.centerX;
		instructionsText.y = game.world.centerY;

		ups2Text.x = game.world.centerX;
		ups2Text.y = game.world.centerY - 80;
		atrapasteText.x = game.world.centerX;
		atrapasteText.y = game.world.centerY - 40;
		boton2.x = game.world.centerX;
		boton2.y = game.world.centerY + 40 ;
	}

	function onUpdate() {
		//Si el juego ha empezado, se habilita el movimiento de LEO
		if(gameStarted) {
			console.log(game.nivel);
			//Ponemos delay para esconder instrucciones
			game.time.events.add(5000, function() { instructionsText.destroy();  }, this);
			//Mover a Leo con el cursor
			leo.x = game.input.x;
	    if(leo.x < 24) {
	      leo.x = 24;
	    } else if(leo.x > game.width - 75) {
	      leo.x = game.width - 101;
	    }
			leo.y = (game.height-167)-75;

			//tiramos oscares de acuerdo a la posicion de move
			if(move.body.velocity.x > 0 && move.x > game.giro){
	    	move.body.velocity.x *= -1;
    		game.giro = game.rnd.integerInRange(100, move.x - 1);
				soltarOscar();
			}
			if(move.body.velocity.x < 0 && move.x < game.giro){
	    	move.body.velocity.x *= -1;
    		game.giro = game.rnd.integerInRange(move.x+1, game.width);
				soltarOscar();
			}

			//tiramos cherries de acuerdo a la posicion de move2
			if(move2.body.velocity.x > 0 && move2.x > game.giro2){
	    	move2.body.velocity.x *= -1;
    		game.giro2 = game.rnd.integerInRange(100, move2.x - 1);
				soltarCherry();
			}
			if(move2.body.velocity.x < 0 && move2.x < game.giro2){
	    	move2.body.velocity.x *= -1;
    		game.giro2 = game.rnd.integerInRange(move2.x+1, game.width);
				soltarCherry();
			}
			//mandamos a llamar función recogerOscar cada que haya collision entre oscar y leo
			game.physics.arcade.overlap(leo, oscares, recogerOscar, null, this);
			//mandamos a llamar función gameOver cada que haya collision entre cherry y leo
			game.physics.arcade.overlap(leo, cherries, gameOver, null, this);
		}
	}

	function soltarOscar() {
		xrandom = move.x;
		if(xrandom > game.width - 80) {
			xrandom = xrandom - 80;
		} else if(xrandom < 24){
			xrandom = 80;
		} else {
			xrandom = xrandom;
		}
		oscar = oscares.create(xrandom, -50, 'oscar');
    game.physics.arcade.enable(oscar);
    oscar.body.gravity.y = game.gravedadOscares;
	}

	function soltarCherry() {
		xrandom = move2.x;
		if(xrandom > game.width - 80) {
			xrandom = xrandom - 80;
		} else if(xrandom < 24){
			xrandom = 80;
		} else {
			xrandom = xrandom;
		}
		cherry = cherries.create(xrandom, -50, 'cherry');
    game.physics.arcade.enable(cherry);
    cherry.body.gravity.y = game.gravedadCherries;
	}

	function recogerOscar(leo, oscar){
 		oscar.kill();
 		game.puntaje += 1;
		score.setText(game.puntaje);
		sndPunto.play();
	}

	function gameOver(leo, cherry){
		//termina juego
		game.nivel = 0;
		gameStarted = false;
		move.kill();
    move2.kill();
		cherry.kill();
		ups2Text.visible = true;
		atrapasteText.setText('Atrapaste '+game.puntaje+' estatuillas');
		atrapasteText.visible = true;
		boton2.visible = true;

	}
	function actionPlayAgain () {
		//reiniciamos nivel
		game.nivel = 1;
		game.subirNivel = 0;
		//iniciar juego de nuevo
		gameStarted = true;
		//ocultamos texto y boton de pantalla 1
		ups2Text.visible = false;
		atrapasteText.visible = false;
		boton2.visible = false;
		game.puntaje = 0;
		score.setText(game.puntaje);
		move.visible = true;
		move2.visible = true;
		move.revive();
    move2.revive();
	}

	function subirNivel(){
 		game.gravedadOscares *= 1.2;
 		move.body.velocity.x *= 1.2;

		game.gravedadCherries *= 1.2;
 		move2.body.velocity.x *= 1.2;
 		game.nivel += 1;
 		console.log('Nivel: '+game.nivel);
	}
}
