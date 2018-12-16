/* global window, blockLike, api */
// make stage
let stage;

// The stage is vertical and defualts to common 980 width on phones
// for anything not a vertical phone (mainly PC) we hack...
if (window.innerHeight < 1743 && window.innerHeight < window.innerWidth) {
  // set a fixed stage size
  stage = new blockLike.Stage({ width: 980, height: 1743, pace: 0 });
  // zoom out (scale down)
  stage.ratio = window.innerHeight / 1743;
  stage.css({ transformOrigin: 'top' });
  stage.zoom(stage.ratio * 100);

  // disable user scolling
  window.addEventListener('mousewheel', (e) => {
    e.preventDefault();
  });
  window.onkeydown = function (e) {
    return !(e.keyCode === 32);
  };
} else {
  stage = new blockLike.Stage({ pace: 0 });
}

const paper = new blockLike.Backdrop({
  color: '#fff9f4',
});

paper.addTo(stage);

// we keep the rows for the score table (sprites) globally
let scoreTable = [];

/* render functions for scoreboard start */
function deleteTable() {
  scoreTable.forEach((item) => {
    item.removeFrom(stage);
  });
  scoreTable = [];
}

function renderTable(scores, space) {
  // remove rendered
  deleteTable();

  // make all rows
  scores.reverse().forEach((item, i) => {
    // make template
    const string = `<div class="scores-container">
          <span class="scores-game" style="background-image: url('./${item.game}/img/${item.game}-precious.svg')"></span>
          <span class="scores-username">${item.username}</span>
          <span class="scores-score">${item.score}</span>
        <div>`;

    // make sprites
    const sprite = new blockLike.Sprite({ width: 800, height: space });
    scoreTable.push(sprite);
    sprite.addTo(stage);

    // put text
    sprite.inner(string);

    // alternate between -stage.width and stage.width
    sprite.goTo((((i % 2) * 2) - 1) * stage.width, i * space - (space * scores.length / 2) - 136);

    // glide for 1 second to the middle
    sprite.glide(1, 0, sprite.y);
  });
}

const pug = new blockLike.Sprite({
  image: './pug/img/pug-coloring15.svg',
  width: 200,
  height: 200,
});
const deer = new blockLike.Sprite({
  image: './deer/img/deer-coloring15.svg',
  width: 200,
  height: 200,
});
const toast = new blockLike.Sprite({
  image: './toast/img/toast-coloring15.svg',
  width: 200,
  height: 200,
});
const koala = new blockLike.Sprite({
  image: './koala/img/koala-coloring15.svg',
  width: 200,
  height: 200,
});

const text = new blockLike.Sprite({
  width: 500,
});

pug.addTo(stage);
deer.addTo(stage);
toast.addTo(stage);
koala.addTo(stage);
//text.addTo(stage);

text.inner('Click To Play');
text.addClass('username-display');

pug.goTo(-(stage.width / 2) + 36 + 100, stage.height / 2 - 136);
deer.goTo(-(stage.width / 2) + 72 + 300, stage.height / 2 - 136);
toast.goTo((stage.width / 2) - 72 - 300, stage.height / 2 - 136);
koala.goTo((stage.width / 2) - 36 - 100, stage.height / 2 - 136);
//text.goTo(0, stage.height / 2 - 336);


stage.whenLoaded(() => {
  // get scores
  api.getScores((scores) => {
    // and then:
    stage.invoke(renderTable, [scores, 120]);
  });
});

pug.whenClicked(() => {
  window.open('/pug');
});

deer.whenClicked(() => {
  window.open('/deer');
});

toast.whenClicked(() => {
  window.open('/toast');
});

koala.whenClicked(() => {
  window.open('/koala');
});
