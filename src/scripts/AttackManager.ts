//@ts-ignore Some imports fall to
import { Application } from "pixi.js";

import { animationHandler, animationObject } from "./animationHandler";
import { ButtonHandler, control } from "./ButtonHandler";
import { collisionDetector, colidedEvent } from "./collisionDetector";

export class AttackManager {
  app: Application;
  BH: ButtonHandler;
  AH: animationHandler;
  CD: collisionDetector;
  controls: control;
  animations: animationObject;
  player: string;

  constructor(player, app, BH, AH, CD, animations, controls) {
    this.player = player;
    this.app = app;
    this.BH = BH;
    this.AH = AH;
    this.CD = CD;
    this.controls = controls;
    this.animations = animations;
  }

  loop(delta) {
    if (this.BH.isPress(this.controls.ATTACK1)) {
      for (let i = 0; i < this.CD.colidables.length; i++) {
        let name: string = this.CD.colidables[i].name;

        if (name !== this.player) {
          let pair: colidedEvent = this.CD.colid(this.player, name, 20);
          if (pair) {
            if (pair.ent1.name !== this.player) {
              pair.ent1.entity.takeHit(5);
            } else if (pair.ent2.name !== this.player) {
              pair.ent2.entity.takeHit(5);
            }
          }
        }
      }
      this.AH.setNextAni(this.animations.attack1, 0.4);
    }
  }
}

//Find other player pos
//compaire players pos
//if attacking and past time do damage
