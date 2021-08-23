
function preload (){
  bg=loadImage("background.jpg")
  restartImg = loadImage("restart.png")
  obstacle1=loadImage("stone.png")
  home = loadImage("home.jpg")
  
  zombieImg = loadAnimation("zombie-0.png","zombie-1.png","zombie-2.png","zombie-3.png","zombie-4.png")

  boyImg = loadAnimation("boy-0.png","boy-1.png","boy-3.png","boy-4.png","boy-5.png")
  coin1 = loadAnimation("coin.gif")
  obstacle2=loadAnimation("fire.gif")

  coinSound=loadSound ("coin_collect.wav")
  playerJump=loadSound("player_jump.wav")
  playerLose=loadSound("player_lose-1.wav")
  
  zombieDie = loadAnimation("venom.png")
  
}


function setup() {
  createCanvas(600,400)
  
  zombie = createSprite(-200,330)
  zombie.addAnimation("running",zombieImg)
  zombie.addAnimation("dying",zombieDie)
  zombie.scale = 0.3
  zombie.velocityX=2
  
  cGrp =new Group();
  obstacleGrp  = new Group()
  
  boy=createSprite(50,330)
  boy.addAnimation("walking",boyImg)
  boy.scale=0.8
  
  
  
  gameState = "play"
  score = 0
  
  invisibleGround = createSprite(width/2,height-20,width,2);
  invisibleGround.visible= false
  
  
  
  button  = createImg('restart.png')
  button.position(width/2-20,height/2+10)
  button.size(50,50)
  button.hide()
  button.mouseClicked(reset)
  
  
}

function draw() {
  
  if(gameState === "play"){
    background(bg); 
  //  console.log(boy.y)
    if(keyDown("space")&&boy.y>329){
      boy.velocityY=-10
      playerJump.play()
    }
    boy.velocityY=boy.velocityY+0.3
    
    score = score + Math.round(getFrameRate()/60)
    camera.x=boy.x
    invisibleGround.x= camera.x
    
    boy.collide(invisibleGround)
    zombie.collide(invisibleGround)
    if (invisibleGround.x < 0){
      invisibleGround.x = invisibleGround.width/2;
    }
    
    if (keyDown("right"))
    {
      boy.x=boy.x+5
    }
    if(zombie.isTouching(boy) ){
      gameState = "end" 
      playerLose.play()
    }
    if( boy.x>=2500){
      background(home)
      gameState = "win"
      boy.velocityX = 1
      boy.setVelocity(0,0) 
      //boy.y = height-50
      zombie.x = 2300
      zombie.velocityX = 0
      zombie.changeAnimation("dying")
      zombie.scale=1.5
      fill("red")
      textSize(22)
      text("Reached Home,Safe from Zombie",2200,20)
      obstacleGrp.destroyEach()
      
    }
    coin()
    spawnObstacles()
    for(var i = 0;i<cGrp.length;i++){ 
      if(cGrp.isTouching(boy)){
        coinSound.play()
        if(cGrp.get(i)!= null){
          cGrp. get(i).destroy();
        }
      }
    }
    if(obstacleGrp.isTouching(boy) ){
      boy.x -=15
    }
    drawSprites();
  }
  
  
  else if(gameState === "end"){
     background(0)
     button.show()
     fill("red")
     textSize(20)
     text("Score:"+score,camera.x,50)
     boy.destroy()
     fill("red")
     textSize(29)
     text("GameOver, Try Again", camera.x-100,height/2)    
  }  
  
}
function reset(){
  
  gameState = "play"
  score = 0
  boy=createSprite(100,350)
  boy.addAnimation("walking",boyImg)
  boy.scale=0.8
  
  zombie.x = -50
  button.hide()
  
}
function coin(){
  if (frameCount%50===0){
      var   coin = createSprite(camera.x+300,250,20,20)
      coin.y=random(100,250)
      coin.addAnimation("me2",coin1);
      coin.scale=0.1;      
      coin  .velocityX = -2;
      cGrp.add(coin);
    }
}

function spawnObstacles() {
  if (frameCount % 150 === 0) {
    obstacle = createSprite(boy.x+width, height-50 , 40, 40); 
    obstacle.scale = 0.25;
    obstacle.velocityX = -(2 + Math.round(score/30)); 
    var rand = Math.round(random(1, 2)); 
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
        case 2: obstacle.addAnimation("me", obstacle2);
        break;
        default: break;
    }
    obstacle.lifetime = 1000;
    obstacleGrp.add(obstacle);
    obstacle.setCollider("circle", 10, 10, 60); 
  }
}


                      