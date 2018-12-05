let forever;
let highScore = 0;

if(window.localStorage.high_score) {
  highScore = parseInt(window.localStorage.high_score, 10);
} else {
  window.localStorage.high_score = highScore;
}

let user = JSON.parse(window.localStorage.getItem('user'))

let stage;

// The stage is vertical and defualts to common 980 width on phones
// for anything not a vertical phone (mainly PC) we hack...
if(window.innerHeight < 1743 && window.innerHeight < window.innerWidth) {
  //set a fixed stage size
  stage = new blockLike.Stage({ width: 980, height: 1743 });
  // zoom out (scale down)
  stage.ratio = window.innerHeight/1743;
  stage.zoom(stage.ratio * 100);

  // zooming leaves the body at the same size.
  // need to scroll to target.
  stage.whenLoaded(function(){
    // wait for all sizeing to happen
    this.wait(0.2);
    // scroll to half the reminder after scaling
    window.scrollTo(0, (1743-window.innerHeight)/2);
  });
  // disable user scolling
  window.addEventListener('mousewheel', function(e) {
    e.preventDefault();
  });
  window.addEventListener('scroll', function(e) {
    e.preventDefault();
  });

} else {
  stage = new blockLike.Stage();
}


let paper = new blockLike.Backdrop({
    color: '#fff9f4'
});
let sky = new blockLike.Backdrop({
    color: '#e2edff'
});
let dead = new blockLike.Backdrop({
    color: '#ffe2ed'
});

paper.addTo(stage);
sky.addTo(stage);
dead.addTo(stage);

let playButton = new blockLike.Costume({
  image: './img/button.svg',
  width: 350,
  height: 130,
})

let informationPanel = new blockLike.Costume({
  image: './img/'+ CARD_ID +'-information-panel.png',
  width: 400,
  height: 300,
})

let drawing = new blockLike.Sprite(null);
let text = new blockLike.Sprite(null);
let button = new blockLike.Sprite({
  costume: playButton,
});
let scoreBoard = new blockLike.Sprite({
  image: null,
  width: 450,
});
let information = new blockLike.Sprite({
  costume: informationPanel,
})

scoreBoard.addClass('score-board');

// loading assets into costumes
for (let i = 0; i < NUMBER_OF_COLORING_FRAMES; i++) {
  let path = './img/happy-holidays-coloring' + (i + 1) + '.svg'
  let settings = {
    image: path, 
    width: 450, 
    height: 225,
  }
  let c = new blockLike.Costume(settings)
  text.addCostume(c);
};

for (let i = 0; i < NUMBER_OF_COLORING_FRAMES; i++) {
  let path = './img/' + CARD_ID + '-coloring' + (i + 1) + '.svg'
  let settings = {
    image: path, 
    width: 450, 
    height: 450,
  }
  let c = new blockLike.Costume(settings)
  drawing.addCostume(c);
};


// init
button.hide();
scoreBoard.hide();
information.hide();

drawing.addTo(stage);
text.addTo(stage);
button.addTo(stage);
scoreBoard.addTo(stage);
information.addTo(stage);

button.goTo( -stage.width, 300)
text.goTo(0, 300)
drawing.goTo(0, -100)

stage.whenFlag(function() {
  //stage.broadcastMessage('gameStart')
  stage.broadcastMessage('drawingColor');

  if(!user){
    api.makeUser(function(user){
      window.localStorage.setItem('user', JSON.stringify(user))
    })
    user = JSON.parse(window.localStorage.getItem('user'))
  }

})

function coloring (){
  for (let i = 0; i < NUMBER_OF_COLORING_FRAMES - 1; i++) {
    this.wait(ANIMATION_FRAME_DURATION);
    this.nextCostume();
  };
}


drawing.whenReceiveMessage('drawingColor', function (){
  this.show();
  this.invoke(coloring);

  stage.broadcastMessage('textColor')
})

text.whenReceiveMessage('textColor', function (){
  this.show();
  this.invoke(coloring);

  stage.broadcastMessage('animate');
})


drawing.whenReceiveMessage('animate', function (){
  stage.switchBackdropTo(sky);

  this.goTo(0, -100)
  this.show();

  for (let i = 0; i < 2; i++) {
    this.turnLeft(15);
    this.wait(ANIMATION_FRAME_DURATION);
    this.turnRight(15);
    this.wait(ANIMATION_FRAME_DURATION)
    this.turnRight(15);
    this.wait(ANIMATION_FRAME_DURATION)
    this.turnLeft(15);
    this.wait(ANIMATION_FRAME_DURATION);
  };

  this.wait(ANIMATION_FRAME_DURATION)

  this.glide(1, this.x, -stage.height)
  this.hide();

})

text.whenReceiveMessage('animate', function (){
  this.goTo(0, 300)
  this.show();

  this.setSize(80);
  for (let i = 0; i < 4; i++) {
    this.wait(ANIMATION_FRAME_DURATION);
    this.setSize(120);
    this.wait(ANIMATION_FRAME_DURATION);
    this.setSize(80);
  };
  this.wait(ANIMATION_FRAME_DURATION)
  this.setSize(100); 
  this.wait(ANIMATION_FRAME_DURATION)

  this.glide(1, stage.width, this.y)
  this.hide();
})

button.whenReceiveMessage('animate', function (){
  this.wait(10 * ANIMATION_FRAME_DURATION)
  this.goTo( -stage.width, 300)
  this.show();
  this.glide(1, 0, this.y);
})

button.whenClicked(function (){
  stage.broadcastMessage('gameStart')
  this.hide();
})

drawing.whenReceiveMessage('gameStart', function(){
  this.hide();
})

scoreBoard.whenReceiveMessage('animate', function(){
  this.wait(10*ANIMATION_FRAME_DURATION)
  this.goTo(0, -stage.height)
  this.css('-webkit-text-stroke', '7px black')
  this.inner(highScore + '')
  this.show();
  this.glide(1, this.x, -400);
}) 

scoreBoard.whenReceiveMessage('gameStart', function(){
  this.inner('0')
  this.css('-webkit-text-stroke', '')
})

information.whenReceiveMessage('animate', function(){
  this.wait(10*ANIMATION_FRAME_DURATION)
  this.goTo(0, -stage.height)
  this.show();
  this.glide(1, this.x, -100);  
})

/**
 Game
*/

let score = 0;

let deadly = new blockLike.Costume({
  image: './img/'+ CARD_ID +'-deadly.svg',
})

let precious = new blockLike.Costume({
  image: './img/' + CARD_ID +'-precious.svg',
})

let preciousPhrase = new blockLike.Costume()
preciousPhrase.inner(CARD_PHRASE)
preciousPhrase.addClass('precious-bubble');

function random (){
  return Math.floor(Math.random() * 4) * 200 - 300
}

function createRegular (number){
  let myCostume = new blockLike.Costume({
    image: './img/' + CARD_ID +'-regular'+number+'.svg',
  })

  let newSprite = new blockLike.Sprite({
    costume: myCostume,
  })
  newSprite.spriteType ='gamePiece'
  newSprite.value = number;
  newSprite.css({filter: 'drop-shadow(rgb(102, 102, 102) 3px 3px 6px)'})

  newSprite.addTo(stage);
  newSprite.goTo(random(), stage.height / 2 + 100)
   
  newSprite.whenClicked(function (){
    this.css({filter: 'none'})
    this.addClass('score-bubble');
    score += this.value;
    this.playSound('../sounds/' + this.value + '.wav');
    this.inner('+' + this.value)
    this.glide(0.5, this.x + 100, this.y);
    this.removeFrom(stage);
  })

  newSprite.glide(5, newSprite.x, -stage.height / 2 - 100)
}

function createDeadly (){
  let newSprite = new blockLike.Sprite({
    costume: deadly,
  })
  newSprite.spriteType ='gamePiece'
  newSprite.css({filter: 'drop-shadow(rgb(102, 102, 102) 3px 3px 6px)'})

  newSprite.addTo(stage);
  newSprite.goTo(random(), stage.height / 2 + 100)
  
  newSprite.whenClicked(function (){
    stage.broadcastMessage('endGame')
    this.removeFrom(stage);
  })

  newSprite.glide(5, newSprite.x, -stage.height / 2 - 100)

  return newSprite;
}

function createPrecious (){
  let newSprite = new blockLike.Sprite({
    costume: precious,
  })
  newSprite.spriteType ='gamePiece'  
  newSprite.css({filter: 'drop-shadow(rgb(102, 102, 102) 3px 3px 6px)'})

  newSprite.addTo(stage);
  newSprite.goTo(random(), stage.height / 2 + 100)

  newSprite.clicked = false;

  newSprite.whenClicked(function (){
    if(!this.clicked) {
      this.clicked  = true;
      this.css({filter: 'none'})
      score += 10;
      this.playSound('../sounds/good.wav');
      this.addCostume(preciousPhrase);
      this.switchCostumeTo(preciousPhrase);
      this.changeY(175); 
      this.glide(0.5, this.x - 100, this.y);
      this.removeFrom(stage);
      thePrecious = null;
    }
  })

  newSprite.glide(5, newSprite.x, -stage.height / 2 - 100);

  return newSprite;
}

thePrecious = null;
theDeadly = null;

information.whenReceiveMessage('gameStart', function(){
  this.hide()
})

stage.whenReceiveMessage('gameStart', function() {
  forever = true;
  
  while(forever){
    // decide what to drop
    if(!thePrecious){
      thePrecious = createPrecious();
    } else if(!theDeadly){
      theDeadly = createDeadly();
    } else {
      createRegular(Math.floor((Math.random() * 8) + 1));
    }

    this.wait(0.5)

    // check if precious wasn't caught
    if(thePrecious) {
      if (thePrecious.touchingEdge() === 'bottom'){
        stage.broadcastMessage('endGame');
      }
    }

    // allow new deadly
    if(theDeadly) {
      if (theDeadly.touchingEdge() === 'bottom'){
        theDeadly = null;
      }
    }

    scoreBoard.inner(score + '')
  }
})

stage.whenReceiveMessage('endGame', function (){
    forever = false;
    thePrecious = null;
    theDeadly = null;  

    this.switchBackdropTo(dead);
    this.playSound('../sounds/end.wav')
    // clone the array
    let arr = stage.sprites.slice();
    // removes the game pieces
    for (var i = 0; i < arr.length; i++) {
      if(arr[i].spriteType === 'gamePiece'){
        stage.removeSprite(arr[i])
      }
    };

    let options = {
      game: CARD_ID,
      score: score,
      user_id: user._id,
      username: user.username
    }

    api.setScore(options)

    if (score > highScore) {
      highScore = score;
      window.localStorage.high_score = highScore;
    };

    this.wait(1)
    this.switchBackdropTo(sky);
    scoreBoard.glide(1, 0, 0)
    scoreBoard.wait(1);
    scoreBoard.hide();
    score = 0;
    this.broadcastMessage('animate');
})

stage.whenKeyPressed('Escape', () => { forever = false; });
