var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameoverimage,restartimage;

var jumpsound, checkpoint,diesound;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
 gameoverimage = loadImage("gameOver.png");
 restartimage = loadImage("restart.jpeg");

 jumpsound = loadSound("jump.mpeg");
 checkpoint = loadSound("checkpoint.mpeg");
 diesound = loadSound("erro.mpeg");

 sunanimation = loadImage("sun.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun",sunanimation);
  sun.scale=0.1;

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width /2;
  
  
  invisibleGround = createSprite(width/2,height-10,width,125);
 // invisibleGround.visible = false;
  invisibleGround.shapeColor="#f4cbaa";
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;

 gameOver = createSprite(width/2,height/2- 50);
 gameOver.addImage(gameoverimage);

 Restart = createSprite(width/2,height/2);
 Restart.addImage(restartimage);

Restart.scale=0.5;
gameOver.scale=0.5;

}

function draw() {
  background(180);
  //exibindo pontuacãO
  text("Score: "+ score, 500,50);
  
  
  
  if(gameState === PLAY){
    //mover o solo
    ground.velocityX = -(6 + 3*score/100);
    //pontuação
    score = score + Math.round(frameCount/60);
    trex.changeAnimation("running", trex_running);
    if (score > 0 && score%100 === 0) {
      checkpoint.play();
    }
    gameOver.visible=false;
    Restart.visible=false;

    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla de espaço for pressionada
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( );
      trex.velocityY = -10;
       touches = [];
    }
    
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8


  
    //gere as nuvens
    spawnClouds();
  
    //gere obstáculos no solo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        diesound.play();
    }
  }
   else if (gameState === END) {
    gameOver.visible=true;
    Restart.visible=true;
    
    ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
     trex.changeAnimation("collided",trex_collided);
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width+20,height-300,40,10);
   obstacle.velocityX = -(6 + score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
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
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo       
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir vida útil à variável
    //cloud.lifetime = 134;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
    }
}

function reset() {
gameState = PLAY ;
gameOver.visible=false;
Restart.visible=false;

obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
trex.changeAnimation("collided",trex_collided);
score = 0;
}