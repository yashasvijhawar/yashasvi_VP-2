var dog, happyDog, database, foodS, foodStock;
var dogImg, dogHappy;
var milk, addFood, feed, fedTime, lastFed, foodObj;

function preload() {
  dogImg = loadImage("dogImg.png");
  dogHappy = loadImage("dogImg1.png");
}

function setup() {

  createCanvas(500, 500);

  database = firebase.database();

  dog = createSprite(250, 300);
  dog.addImage("Bob", dogImg);
  dog.scale = 0.25;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods)
}


function draw() {  

  background(46, 139, 87);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data) {
    lastFed = data.val();
  });

 

  foodObj.display();
  drawSprites();
  textSize(20);
  fill("white");
  stroke(5);
  var Text = text("Food remaining: " + foodS, 165, 150);

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12) {
    var Text1 = text("Last Fed: " + lastFed%12 + " PM", 350, 30);
  } else if(lastFed==0) {
    var Text2 = text("Last Feed : 12 AM", 350, 30);
  } else {
    var Text3 = text("Last Feed : " + lastFed + " AM", 350, 30);
  }
 
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x) {

  if(x<=0) {
    x = 0;
  } else {
    x = x - 1;
  }

  database.ref('/').update({
    Food:x
  })

}

function add() {

  addFood.mousePressed(function(x) {

    if(x>=20) {
      x = 20;
    } else {
      x = x + 1;
    }
  
    database.ref('/').update({
      Food:x
    })

  })
}

function feedDog() {

  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
  //  FeedTime:hour()
  });
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}