var PLAY = 1;
var END = 0;
var gameState = PLAY;

var fox, fox_running, fox_collided;
var fox_jumping;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5

var bcg; 
var forest;
var score;
var gameOverImg,restartImg
var jumpSound , dieSound

function preload(){
  fox_running = loadAnimation("fox1.png","fox2.png","fox3.png","fox4.png");
  fox_collided = loadImage("foxc.png");
  fox_jumping = loadImage("foxj.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("ob1.png");
  obstacle2 = loadImage("ob2.png");
  obstacle3 = loadImage("ob3.png");
  obstacle4 = loadImage("ob4.png");
  obstacle5 = loadImage("ob5.png");

  bcg = loadImage("bg.capstone21.jpg")
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  //checkPointSound = loadSound("checkPoint.mp3")

 
}

function setup() {
  createCanvas(600, 200);

  forest = createSprite(300,10,1000,200);
  forest.addImage("forest",bcg);
//forest.visible=false
  forest.scale=0.5;
  fox= createSprite(50,160,20,50);
 fox.addAnimation("running", fox_running);
  fox.addAnimation("collided", fox_collided);
  

 fox.scale = 1;
  
  ground = createSprite(200,185,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  fox.setCollider("rectangle",0,0,fox.width,fox.height);
  fox.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background(225);
  //displaying score
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    

    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if (forest.x<0){
      forest.x = forest.width/2
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& fox.y >= 100) {
        fox.velocityY = -12;
        jumpSound.play();
        fox.changeAnimation("jump",fox_jumping)
    }
    
    //add gravity
    fox.velocityY = fox.velocityY + 0.8
  
    
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(fox)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      fox.changeAnimation("collided", fox_collided);
    
     
     forest.velocityX = 0;
      ground.velocityX = 0;
      fox.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
     
     if(mousePressedOver(restart)) {
      reset();
    }
  
   }
  
 
  //stop trex from falling down
  fox.collide(invisibleGround);
  
  

  drawSprites();
  text("Score: "+ score, 500,50);
score.visible=true
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
fox.changeAnimation("running",fox_running);
score=0;

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,160,10,40);

   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstaclesGroup.scale=1.5;
 }
}
