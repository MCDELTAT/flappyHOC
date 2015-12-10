//create a game window that corresponds to HTML Element ID. 
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

var mainState = {
	preload: function(){
		//create the sky
		game.stage.backgroundColor = '#71c5cf';
		//load all sprites (images) from online location
		game.load.baseURL = 'https://40.media.tumblr.com/';
		game.load.crossOrigin = 'anonymous';
		game.load.image('bird', '64dff69596c2e1b193154761757cc1d5/tumblr_nz4rn5LcB21qf0ncwo1_75sq.png');
		game.load.image('pipe', 'b5472e0e1f79bfc4983828d262362523/tumblr_nz4rn5LcB21qf0ncwo2_75sq.png');
	},
	create: function(){
		//start arcade phyics and render bird sprite
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.bird = this.game.add.sprite(100, 245, 'bird');

		//apply physics to the bird
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y =  1000;

		//add the spacebar to accepted inputs, call jump on press
		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		//create a group of pipes, apply physics.
		this.pipes = game.add.group();
		this.pipes.enableBody = true;
		this.pipes.createMultiple(20, 'pipe');

		//create a new row of pipes every 1.5 seconds
		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

		//create a score label
		this.score = 0;
		this.labelScore = game.add.text(20,20, "0", {font: "30px Arial",fill:"#ffffff"});
	},
	update: function(){
		//if we fly too high or low, kill the bird.
		if (this.bird.inWorld == false)
			this.restartGame();

		//if the bird and pipe ever collide, kill the bird.
		game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
	},
	jump: function(){
		//move the bird upward 
		this.bird.body.velocity.y = -350;
	},
	addOnePipe: function(x, y){
		//make the pipe group appear, move to the left
		var pipe = this.pipes.getFirstDead();
		pipe.reset(x, y);
		pipe.body.velocity.x = -200;

		//Kill the pipe when it's no longer visible
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},
	addRowOfPipes: function(){
		//Randomly pick where the hole will be
		var hole = Math.floor(Math.random() * 5) + 1;

		//add the 6 pipes
		for (var i=0; i < 8; i++)
			if (i != hole && i != hole+1)
				this.addOnePipe(400, i*60 + 10);

		//for each pipe survived, add one to the score.
		this.score += 1;
		this.labelScore.text = this.score;	
	},
	restartGame: function(){
		//for any death condition, start the main state over again.
		game.state.start('main');
	}
};

//once everything is set up the very first time, start the game.
game.state.add('main', mainState);
game.state.start('main');