//@ts-ignore Some imports fall to
import { Application, TextStyle, Text } from "pixi.js";

export interface press {
  code: number;
  time: number;
  isCurPress: boolean;
}

export interface control {
  UP: number;
  DOWN: number;
  LEFT: number;
  RIGHT: number;
  ATTACK1: number;
  ATTACK2: number;
}

export class ButtonHandler {
  app: Application;
  pressed: press[];
  delay: Array<number>; //An array of char used _sec ago
  text: Text;
  elapedTime: number;

  constructor(app) {
    this.app = app;
    this.pressed = [];
    this.elapedTime = 0;

    const style = new TextStyle({
      fill: ["#ffffff"]
    });

    this.text = new Text("", style);
    this.text.y = 400;
    app.stage.addChild(this.text);

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown = (e) => {
    //console.log("KeyDown event fired!", e.keyCode);
    let notin = true;
    for (let i in this.pressed) {
      if (e.keyCode === this.pressed[i].code) {
        notin = false;
        this.pressed[i].time = 0;
        this.pressed[i].isCurPress = true;
      }
    }
    if (notin) {
      this.pressed.push({ code: e.keyCode, time: 0, isCurPress: true });
    }
  };

  onKeyUp = (e) => {
    //console.log("KeyUp event fired!", e.keyCode);

    for (let i in this.pressed) {
      if (this.pressed[i].code === e.keyCode) {
        this.pressed[i].isCurPress = false;
      }
    }
  };

  isPress = (code: number) => {
    for (let i in this.pressed) {
      let press = this.pressed[i];
      if (code === press.code && press.isCurPress) {
        return true;
      } else {
      }
    }
    return false;
  };

  loop = (d) => {
    for (let i = 0; i < this.pressed.length; i++) {
      let button = this.pressed[i];
      if (button.time > 100) {
        this.pressed.splice(i, 1);
      } else {
        button.time += d;
      }
    }

    this.elapedTime += d;
  };
}
