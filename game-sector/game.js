window.onload = function() {
	//la definición del juego como, el 100% de la dimensión de la ventana del navegador
	var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,Phaser.CANVAS,"gameDiv",{
		preload:onPreload,
		create:onCreate,
		update:onUpdate,
		resize:onResize // <- esta se deberá llamar cada ves que el juego es reized
	});
	//variables utilizadas dentro del juegp
	var gameStarted = false;
	var pausa = false;
	var cherryArray = [];
	var oscarArray = [];
	var posxLeo = 0;

	var nivel = 0;
	var subir = false;
	//primer function que es llamada, cuando el juego precarga
	//todos los elementos del juego se cargan
	function onPreload() {
		game.load.spritesheet('logo','assets/images/logo-sectorcine.png');
		game.load.spritesheet('carrete','assets/images/carrete.png');
		game.load.spritesheet('leo','assets/images/leo.png', 77, 169);
		game.load.spritesheet('linea','assets/images/line-score.png');
		game.load.spritesheet('upsText','assets/images/ups.png');
		game.load.spritesheet('button','assets/images/boton.png');
		game.load.spritesheet('button2','assets/images/boton2.png');
		game.load.spritesheet('instructionsText','assets/images/instructions.png');
		game.load.image('move','assets/images/line-score.png', 32, 48);
		game.load.image('move2','assets/images/line-score.png', 32, 48);
		game.load.image('oscar','assets/images/oscar.png');
		game.load.image('cherry','assets/images/cherry.png');
		game.load.audio('punto','assets/numkey.wav');
	}
	//function que se llama cuando el juego ha sido creado
	function onCreate() {
		//hacemos full screen  del juego
		goFullScreen();
		//creamos todos los elementos del juego
		logo = game.add.sprite(80,25, 'logo');
		logo.width = 194;
		logo.height = 68;
		logo.scale.setTo(1,1);

		carrete = game.add.sprite(0, game.world.height -75, 'carrete');
		carrete.width = window.innerWidth;
		carrete.height = 75;
		carrete.scale.setTo(1,1);

		leo = game.add.sprite(32, game.world.height - 100, 'leo');
		leo.animations.add('neutro', [1], 10, true);
    leo.animations.add('feliz', [0], 10, true);
		leo.animations.add('triste', [2], 100, true);
    leo.animations.play('neutro');

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

	 	boton = game.add.button(100, 100, 'button', '', this, 2, 1, 0);
		boton.width = 223;
		boton.height = 51;
	 	boton.name = 'play';
	 	boton.anchor.setTo(0.5, 0.5);
		boton.inputEnable = true;
		boton.input.useHandCursor = true;
    boton.onInputUp.add(actionPlay, this);
		/*--------------------------- Pantalla 2 ------------------------- */
		instructionsText = game.add.sprite(100,100,'instructionsText');
		instructionsText.anchor.setTo(0.5, 0.5);
		instructionsText.visible = false;
		//Agregamos los moves
		x = game.rnd.integerInRange(10, game.width);
 		move = game.add.sprite(x, 10, 'move');
		move.visible = false;
		x2 = game.rnd.integerInRange(10, game.width);
		move2 = game.add.sprite(x2, 10, 'move2');
		move2.visible = false;
		/*--------------------------- Pantalla 5 ------------------------- */
		ups2Text = game.add.text(200, 250, '¡Ups!', {font:'34px Arial', fill: '#fff'});
		ups2Text.anchor.setTo(0.5, 0.5);
		ups2Text.visible = false;
    atrapasteText = game.add.text(200, 400, '', {font:'18px Arial', fill: '#fff'});
		atrapasteText.anchor.setTo(0.5, 0.5);
		atrapasteText.visible = false;

		boton2 = game.add.button(100, 100, 'button2', '', this, 2, 1, 0);
		boton2.width = 223;
		boton2.height = 51;
	 	boton2.name = 'gameOver';
	 	boton2.anchor.setTo(0.5, 0.5);
		boton2.inputEnabled = true;
		boton2.input.useHandCursor = true;
    boton2.onInputUp.add(actionPlayAgain, this);
		boton2.visible = false;
		/*--------------------------- Agregamos la "fisica" ------------------------- */
		game.physics.enable(leo, Phaser.Physics.ARCADE);
		game.physics.enable(move, Phaser.Physics.ARCADE);
		game.physics.enable(move2, Phaser.Physics.ARCADE);
		game.physics.enable(carrete, Phaser.Physics.ARCADE);

    leo.body.collideWorldBounds = true;
    leo.body.bounce.set(1);
    leo.body.immovable = true;
		//Para que los moves no se caigan
		move.body.immovable = true;
		move2.body.immovable = true;
		//para cuando los oscares toquen el carrete estos desaparecen
		carrete.body.collideWorldBounds = true;
    carrete.body.bounce.set(1);
    carrete.body.immovable = true;
		//creamos los grupos de oscares y cherries
 		oscares = game.add.group();
		cherries = game.add.group();
		//Sonido
    sndPunto = game.add.audio('punto');
		//normalmente, la function onResize es llamada  cada ves que el navegador es resized,
		//de cualquier forma llamo a esta function la primera ves
    onResize();
	}
	//function que es activada cuando damos click en boton "JUGAR"
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
		//inicialiazar Variables
		reinit();
	}

	function onUpdate() {
		onResize();
		//Si el juego ha empezado, se habilita el movimiento de LEO
		if(gameStarted) {
			//Ponemos delay para esconder instrucciones
			game.time.events.add(3000, function() { instructionsText.destroy();  }, this);
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
    		game.giro = game.rnd.integerInRange(100, move.x - 50);
				soltarOscar();
			}
			if(move.body.velocity.x < 0 && move.x < game.giro){
	    	move.body.velocity.x *= -1;
    		game.giro = game.rnd.integerInRange(move.x + 50, game.width);
				soltarOscar();
			}

			//tiramos cherries de acuerdo a la posicion de move2
			if(move2.body.velocity.x > 0 && move2.x > game.giro2){
	    	move2.body.velocity.x *= -1;
    		game.giro2 = game.rnd.integerInRange(100, move2.x - 50);
				console.log("soltarCherry");
				soltarCherry();
			}
			if(move2.body.velocity.x < 0 && move2.x < game.giro2){
	    	move2.body.velocity.x *= -1;
    		game.giro2 = game.rnd.integerInRange(move2.x + 50, game.width);
				soltarCherry();
			}
			//mandamos a llamar función recogerOscar cada que haya collision entre oscar y leo
			game.physics.arcade.overlap(leo, oscares, recogerOscar, null, this);
			//mandamos a llamar función gameOver cada que haya collision entre cherry y leo
			game.physics.arcade.overlap(leo, cherries, gameOver, null, this);
			//mandamos a llamar función killOscares cada que haya collision entre carrete y oscares
			game.physics.arcade.overlap(carrete, oscares, killOscares, null, this);
			//mandamos a llamar función killCherries cada que haya collision entre carrete y cherries
			game.physics.arcade.overlap(carrete, cherries, killCherries, null, this);
		} else {
			if(pausa){
				leo.x = posxLeo;
			}
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
		console.log("gravedadOscares: " +Math.round(game.gravedadOscares));
    oscar.body.gravity.y = Math.round(game.gravedadOscares);
		//guardamos oscares para poder hacer la Pausa del juego
		oscarArray.push(oscar);
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
    cherry.body.gravity.y = Math.round(game.gravedadCherries);
		//guardamos cherries para poder hacer la Pausa del juego
		cherryArray.push(cherry);
	}
	function recogerOscar(leo, oscar){
 		oscar.kill();
 		game.puntaje += 1;
		score.setText(game.puntaje);
		sndPunto.play();
		game.time.events.add(300, function() { leo.animations.play('neutro');  }, this);
		leo.animations.play('feliz');
		//subimos nivel cada 10 de puntaje
		subirNivel();
	}
	function killOscares(carrete, oscar){
		oscar.kill();
	}
	function killCherries(carrete, cherry){
		cherry.kill();
	}
	function gameOver(leo, cherry){
		//detenemos moves que sueltan oscares y cherries
		move.kill();
		move2.kill();
		//detenemos cherries para simular PAUSA del juego
		cherryArray.filter(function(cherry) {
			return cherry.body.gravity = false;
		});
		//detenemos oscares para simular PAUSA del juego
		oscarArray.filter(function(oscar) {
			return oscar.body.gravity = false;
		});
		//guardamos la posición en la que LEO tocó una cherry para poder detenerlo
		posxLeo = game.input.x;
		//cambiamos estado de leo
		leo.animations.play('triste');
		//mostramos texto y botón de "JUGAR OTRA VES"
		ups2Text.visible = true;
		atrapasteText.setText('Atrapaste '+game.puntaje+' estatuillas');
		atrapasteText.visible = true;
		boton2.visible = true;
		//pausamos juego
		gameStarted = false;
		pausa = true;
	}

	function actionPlayAgain() {
		//borramos texto y botón de "JUGAR OTRA VES"
		ups2Text.visible = false;
		atrapasteText.visible = false;
		boton2.visible = false;
		if(pausa) {
			//matamos arreglo de cherries que se mantienen en pausa
			cherryArray.filter(function(cherry) {
				return cherry.kill();
			});
			cherryArray = [];
			//matamos arreglo de oscares que se mantienen en pausa
			oscarArray.filter(function(oscar) {
				return oscar.kill();
			});
			//quitamos pausa en el juego
			pausa = false;
			//revivimos los moves que arrejan oscares y cherries
			move.revive();
	    move2.revive();
			//reiniciamos Juego
			reinit();
			gameStarted = true;
		}
	}

	function reinit(){
		game.puntaje = 0;
		score.setText(game.puntaje);
		leo.animations.play('neutro');
		//moves
		move.body.velocity.x = 200;
		move2.body.velocity.x = 80;
		//giros
		game.giro = 50;
		game.gravedadOscares = 100;

		game.giro2 = 250;
		game.gravedadCherries = 100;
	}

	function subirNivel(){
		if(game.puntaje % 10 == 0){
			game.gravedadOscares *= 1.5;
	 		move.body.velocity.x *= 0.5;

			game.gravedadCherries *= 1.5;
	 		move2.body.velocity.x *= 1.5;
			nivel += 1;
			console.log("nivel: " + nivel);
		}
	}

	//function que hace full screen del juego
	function goFullScreen(){
		//asignamos el color de fondo del juego
		game.stage.backgroundColor = "#1d1f20";
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		// using RESIZE scale mode
		game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		game.scale.setScreenSize(true);
	}

	//function que es llamada cada ves que el navegador hace resize, y re-posiciona
	//los elementos del juego para mantener su posición deacuerdo al tamaño del juego
	function onResize(){
		carrete.y = game.height-75;
		carrete.width = window.innerWidth;

		if(pausa){
			leo.x = game.input.x;
		}else{
			leo.x = Math.round((game.width-77)/2) ;
		}
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

}
