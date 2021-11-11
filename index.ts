//interface

//@ts-ignore Some imports fall to
import { Application, Sprite } from "pixi.js";
import { MainMeue } from "./src/scripts/MainMeue";
import { ButtonHandler } from "./src/scripts/ButtonHandler";
import { Player } from "./src/scripts/Player";
import { collisionDetector } from "./src/scripts/collisionDetector";
import { animationObject } from "./src/scripts/animationHandler";
const inputImageAspectRatio = window.innerWidth / window.innerHeight;

const outputImageAspectRatio = 16 / 9;

let outputWidth = window.innerWidth;
let outputHeight = window.innerHeight;

if (inputImageAspectRatio > outputImageAspectRatio) {
  outputWidth = window.innerHeight * outputImageAspectRatio;
} else if (inputImageAspectRatio < outputImageAspectRatio) {
  outputHeight = window.innerWidth / outputImageAspectRatio;
}

const app = new Application(outputWidth, outputHeight, {
  autoResize: true,
  resolution: devicePixelRatio,
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  //@ts-ignore
  resolution: window.devicePixelRatio || 1,
  backgroundColor: 0x1099bb
});

//@ts-ignore
app.stage.sortableChildren = true;

let BH: ButtonHandler;
let MM: MainMeue;

let CD = new collisionDetector(app);

document.body.appendChild(app.view);

//import { Application, Loader } from 'pixi.js';

//const loader = Loader.shared;
//or this one
//const loader = app.loader;

let loaded = false;
let map;
let player1: Player;
let player2: Player;

function resize() {
  const inputImageAspectRatio = window.innerWidth / window.innerHeight;

  const outputImageAspectRatio = 16 / 9;

  let outputWidth = window.innerWidth;
  let outputHeight = window.innerHeight;

  if (inputImageAspectRatio > outputImageAspectRatio) {
    outputWidth = window.innerHeight * outputImageAspectRatio;
  } else if (inputImageAspectRatio < outputImageAspectRatio) {
    outputHeight = window.innerWidth / outputImageAspectRatio;
  }

  app.renderer.resize(outputWidth, outputHeight);

  let oldmapx = map.texture.orig.width;
  let oldmapy = map.texture.orig.height;

  map.width = app.view.width;
  map.height = app.view.height;
  //@ts-ignore
  app.mapscaley = app.view.height / oldmapy;
  //@ts-ignore
  app.mapscalex = app.view.width / oldmapx;

  //@ts-ignore
  app.xm = app.view.width / 500;
  //@ts-ignore
  app.ym = app.view.height / 200;

  player1.onresize();
  player2.onresize();
}

function setup() {
  // get a reference to the sprite sheet we've just loaded:

  let MH1sheet = app.loader.resources["./src/players/MH1/spritesheet.json"];
  let MH2sheet = app.loader.resources["./src/players/MH2/spritesheet.json"];

  let mapData = app.loader.resources["./src/maps/map1/data.json"];
  let mapImg = app.loader.resources["./src/maps/map1/map.png"];

  let Data = app.loader.resources["./src/data.json"];
  //@ts-ignore
  app.data = Data.data;
  //@ts-ignore
  app.solid = mapData.data.solid;

  map = new Sprite(mapImg.texture);

  map.width = app.view.width;
  map.height = app.view.height;
  app.stage.addChild(map);

  BH = new ButtonHandler(app);
  MM = new MainMeue(app);

  /*
  To create a sprite simply retrieve its data from the sheet using sheet.textures['<name>']:

    // initialize background sprite
    background = new Sprite(sheet.textures["background.png"]);

    // add it to the stage
    app.stage.addChild(background);
  */
  //32 by 32csheet
  let animations1 = MH1sheet.spritesheet.animations;
  let animations2 = MH2sheet.spritesheet.animations;

  let anis1: animationObject = {
    death: animations1["death"],
    hit: animations1["hit"],
    attack2: animations1["attack2"],
    attack1: animations1["attack1"],
    fall: animations1["fall"],
    jump: animations1["jump"],
    run: animations1["run"],
    idle: animations1["idle"]
  };

  let anis2: animationObject = {
    death: animations2["death"],
    hit: animations2["hit"],
    attack2: animations2["attack2"],
    attack1: animations2["attack1"],
    fall: animations2["fall"],
    jump: animations2["jump"],
    run: animations2["run"],
    idle: animations2["idle"]
  };

  //app.stage.addChild(new Sprite(animations2["idle"][0]));

  player1 = new Player(app, "player1", anis1["idle"], animations1, CD);
  player2 = new Player(app, "player2", anis2["idle"], animations2, CD);
  //set speed, start play
  CD.add("player1", player1);
  CD.add("player2", player2);
  loaded = true;

  resize();
  MM.getOpen();
}
//@ts-ignore
app.xm = app.view.width / 500;
//@ts-ignore
app.ym = app.view.height / 200;

interface xypair {
  x: number;
  y: number;
}

//@ts-ignore
app.toPos = (obj: xypair) => {
  //convert app xy to real xy
  //@ts-ignore
  return { x: obj.x * app.xm, y: obj.y * app.ym };
};

//@ts-ignore
app.fromPos = (obj: xypair) => {
  //convert real xy to app xy
  //@ts-ignore
  return { x: obj.x / app.xm, y: obj.y / app.ym };
};

app.loader
  .add("./src/data.json", {
    crossOrigin: "anonymous"
  })
  .add("./src/images/circle/spritesheet.json", {
    crossOrigin: "anonymous"
  })
  .add("./src/players/MH1/spritesheet.json", {
    crossOrigin: "anonymous"
  })
  .add("./src/players/MH2/spritesheet.json", {
    crossOrigin: "anonymous"
  })
  .add("./src/maps/map1/data.json", {
    crossOrigin: "anonymous"
  })
  .add("./src/maps/map1/map.png", {
    crossOrigin: "anonymous"
  })
  .load(setup);

// Listen for animate update
app.ticker.add(function (delta) {
  if (loaded) {
    CD.check();
    MM.loop(delta);
    player1.update(delta);
    player2.update(delta);
  }
});

window.addEventListener("resize", resize);
