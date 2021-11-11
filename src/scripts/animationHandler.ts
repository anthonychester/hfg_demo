//@ts-ignore
import { TextStyle, Text, Texture, AnimatedSprite, Application } from "pixi.js";

/*################################
##### Add number importance ######
################################*/

export interface animationObject {
  death: Texture[];
  hit: Texture[];
  attack2: Texture[];
  attack1: Texture[];
  fall: Texture[];
  jump: Texture[];
  run: Texture[];
  idle: Texture[];
}

export class animationHandler {
  curantAni: Texture[];
  change: boolean;
  nextAni: Texture[];
  sprite: AnimatedSprite;
  app: Application;
  text: Text;
  timesPlayed: number;
  limit: number;
  allAni: animationObject;
  speed: number;
  nextSpeed: number;
  player: string;

  constructor(app, player, sprite, curantAni, allAni) {
    this.app = app;
    this.sprite = sprite;
    this.curantAni = curantAni;
    this.nextAni = curantAni;
    this.timesPlayed = 0;
    this.limit = -1;
    this.allAni = allAni;
    this.speed = 0.167;
    this.nextSpeed = 0.167;
    this.player = player;
    const style = new TextStyle({
      fill: ["#ffffff"]
    });

    this.text = new Text("", style);
    this.text.x = 200;
    this.text.y = 0;

    app.stage.addChild(this.text);
  }

  setNextAni(ani, speed = 0.167, time = -1) {
    if (ani !== this.curantAni) {
      this.nextAni = ani;
      if (time !== -1) {
        this.change = false;
      } else {
        this.change = true;
      }

      this.limit = time;
      this.timesPlayed = 0;
      this.nextSpeed = speed;
    }
  }

  play() {
    //For debuging textures
    //console.log(this.nextAni);
    this.sprite.textures = this.nextAni;
    this.curantAni = this.nextAni;
    this.speed = this.nextSpeed;
    this.sprite.animationSpeed = this.speed;
    this.sprite.play();
    this.timesPlayed = 0;
    if (this.limit !== -1) {
      this.limit = 0;
    } else {
      this.limit = -1;
    }
  }

  loop(delta) {
    //debuging text
    //declare varables

    if (this.sprite.currentFrame === this.sprite.totalFrames - 1) {
      this.timesPlayed++;
    }

    //If limit is conting check

    if (this.nextAni !== this.curantAni && this.change) {
      if (
        this.curantAni === this.allAni.idle ||
        this.curantAni === this.allAni.run ||
        (this.curantAni === this.allAni.jump &&
          this.nextAni === this.allAni.fall)
      ) {
        this.play();
      } else if (this.sprite.currentFrame === this.sprite.totalFrames - 1) {
        if (this.limit !== -1) {
          this.play();
        } else if (this.timesPlayed >= this.limit) {
          this.sprite.textures = this.allAni.idle;
          this.curantAni = this.allAni.idle;
          this.nextAni = this.allAni.idle;
          this.sprite.animationSpeed = 0.167;
          this.sprite.play();
          this.limit = -1;
          this.timesPlayed = 0;
        }
      }
    }

    /*
    this.sprite.textures = this.allAni.idle;
          this.curantAni = this.allAni.idle;
          this.nextAni = this.allAni.idle;
          this.sprite.animationSpeed = 0.167;
          this.sprite.play();
          this.timesPlayed = -1;
    */

    if (this.player === "player1") {
      this.text.text =
        String(this.curantAni[this.sprite.currentFrame].textureCacheIds[0]) +
        "  (" +
        this.sprite.currentFrame +
        "/" +
        this.sprite.totalFrames +
        ") " +
        "\n" +
        String(this.nextAni[0].textureCacheIds[0]) +
        "\n" +
        this.timesPlayed +
        "\n" +
        String(this.sprite.textures[0].textureCacheIds[0]) +
        "\n" +
        "text";
    }
  }
}
