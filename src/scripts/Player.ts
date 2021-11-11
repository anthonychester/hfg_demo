//@ts-ignore Some imports fall to
import {
  TextStyle,
  Text,
  Application,
  //@ts-ignore
  AnimatedSprite
} from "pixi.js";

import { animationHandler, animationObject } from "./animationHandler";
import { ButtonHandler, control } from "./ButtonHandler";
import { AttackManager } from "./AttackManager";
import { healthBar } from "./healthBar";
import { collisionDetector } from "./collisionDetector";

interface xypair {
  x: number;
  y: number;
}

export class Player {
  lives: number;
  health: number;
  onGround: Boolean;
  app: Application;
  BH: ButtonHandler;
  AH: animationHandler;
  AM: AttackManager;
  animations: animationObject;
  sprite: AnimatedSprite;
  x: number;
  y: number;
  gravity: number;
  gravitySpeed: number;
  speedY: number;
  speedX: number;
  text: Text;
  out: string;
  jumps: number;
  runSpeedMax: number;
  walkSpeedMax: number;
  state: string;
  direction: string;
  player: string;
  controls: control;
  limit: xypair;
  padding: number;
  HB: healthBar;
  CD: collisionDetector;

  constructor(app, player, textures, animations, CD) {
    this.x = 100;
    this.y = 0;
    this.app = app;
    this.lives = 3;
    this.health = 100;
    this.onGround = false;
    this.animations = animations;
    this.sprite = new AnimatedSprite(textures);
    this.gravity = 0.4;
    this.gravitySpeed = 0;
    this.speedY = 0;
    this.speedX = 0;
    this.out = "";
    this.jumps = 0;
    this.runSpeedMax = 5;
    this.walkSpeedMax = 2.5;
    this.state = null;
    this.direction = "left";
    this.player = player;
    this.controls = app.data.control[player];
    this.padding = 9;

    let wh = { x: this.app.view.width, y: this.app.view.height };

    this.limit = {
      //@ts-ignore
      y: this.app.fromPos(wh).y - this.padding - 50,
      //@ts-ignore
      x: this.app.fromPos(wh).x - this.padding
    };
    const style = new TextStyle({
      fill: ["#ffffff"]
    });

    this.text = new Text(this.out, style);
    this.text.x = 50;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    //@ts-ignore
    this.sprite.scale.set(this.app.xm, this.app.xm);
    this.sprite.animationSpeed = 0.167;
    this.sprite.play();
    this.sprite.x = 50;
    app.stage.addChild(this.sprite);
    //@ts-ignore
    this.BH = new ButtonHandler(app);
    this.CD = CD;
    this.AH = new animationHandler(
      app,
      this.player,
      this.sprite,
      textures,
      this.animations
    );
    this.AM = new AttackManager(
      player,
      app,
      this.BH,
      this.AH,
      CD,
      animations,
      this.controls
    );

    app.stage.addChild(this.text);

    this.HB = new healthBar(app, player, this.health, this.lives);
  }

  up = () => {
    //this.y -= 1;
    if (this.jumps <= 2) {
      this.speedY += -3;
      this.jumps++;
      //this.sprite.textures = this.animations.down;
      this.AH.setNextAni(this.animations.jump, 0.045);
    }
  };

  down = () => {
    this.speedY += 0.2;
  };

  left = () => {
    if (Math.abs(this.speedX - 1) >= this.runSpeedMax + 1) {
    } else {
      this.speedX -= 1;
    }
  };

  right = () => {
    if (Math.abs(this.speedX + 1) >= this.runSpeedMax + 1) {
    } else {
      this.speedX += 1;
    }
  };

  reset = () => {
    this.x = 0;
    this.y = 0;
    this.gravitySpeed = 0;
    this.speedY = 0;
    this.speedX = 0;
  };

  applyForces = () => {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;

    if (this.y >= this.limit.y) {
      this.jumps = 0;
      this.y = this.limit.y;
      this.onGround = true;
      this.gravitySpeed = 0;
      this.speedY = 0;
      //this.out += " " + this.sprite.height;
    } else {
      this.onGround = false;
    }

    if (this.y <= this.padding) {
      this.jumps = 0;
      this.y = this.padding;
      this.onGround = true;
      this.gravitySpeed = 0;
      this.speedY = 0;
    }

    if (this.x <= this.padding) {
      this.x = this.padding;
      this.speedX = 0;
    }

    if (this.x >= this.limit.x) {
      this.x = this.limit.x;
      this.speedX = 0;
    }
  };

  applyDrag = () => {
    if (this.speedX === 0) {
    } else if (this.speedX > 0) {
      this.speedX -= 0.2;
    } else if (this.speedX < 0) {
      this.speedX += 0.2;
    }
  };

  //limit maximue foreces

  takeHit = (ammount) => {
    this.health -= ammount;
  };

  update = (delta) => {
    if (this.BH.isPress(this.controls.RIGHT)) {
      this.right();
    }
    if (this.BH.isPress(this.controls.LEFT)) {
      this.left();
    } else if (this.BH.isPress(this.controls.DOWN)) {
      this.down();
    } else {
      this.applyDrag();
    }
    if (this.BH.isPress(this.controls.UP)) {
      this.up();
    }
    if (this.BH.isPress(82)) {
      this.reset();
      this.health -= 0.5;
    }

    this.AH.loop(delta);
    this.BH.loop(delta);
    this.AM.loop(delta);
    this.applyForces();

    let xypair = { x: this.x, y: this.y };

    //@ts-ignore
    this.sprite.x = this.app.toPos(xypair).x;
    //@ts-ignore
    this.sprite.y = this.app.toPos(xypair).y;

    if (this.onGround) {
      if (Math.abs(this.speedX) > this.walkSpeedMax) {
        this.state = "run";

        this.AH.setNextAni(this.animations.run);
      } else if (
        Math.abs(this.speedX) <= this.walkSpeedMax &&
        this.speedX !== 0
      ) {
        this.state = "walk";
        this.AH.setNextAni(this.animations.run, 0.087);
      } else {
        this.state = "idle";
        this.AH.setNextAni(this.animations.idle);
      }
    } else {
      if (this.speedY + this.gravitySpeed > 0) {
        this.state = "fall";
        this.AH.setNextAni(this.animations.fall);
      }
    }

    if (Math.abs(this.speedX) < 0.001) {
      this.speedX = 0;
    }

    if (this.speedX > 0) {
      this.sprite.scale.x = Math.abs(this.sprite.scale.x);
    } else if (this.speedX < 0) {
      this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
    }

    if (this.health <= 0) {
      this.health = 100;
      this.lives--;
    }

    this.HB.update(this.health, this.lives);

    if (this.player === "player1") {
      this.text.text =
        this.CD.colid("player1", "player2") +
        "\n" +
        this.CD.log() +
        "\n||" +
        //@ts-ignore
        this.app.xm +
        "||";
      this.x += this.speedX;
      this.out = "";
    }
  };

  onresize = () => {
    //@ts-ignore
    this.sprite.scale.set(this.app.xm, this.app.xm);
    this.HB.resize();
  };
}
