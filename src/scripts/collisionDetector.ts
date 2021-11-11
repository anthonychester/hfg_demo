import { Player } from "./Player";
import { Application } from "pixi.js";

export interface xypair {
  x: number;
  y: number;
}

export interface colidable {
  name: string;
  entity: Player;
}

export interface colidedEvent {
  ent1: colidable;
  ent2: colidable;
  d: xypair;
}

export class collisionDetector {
  colidables: colidable[];
  colided: colidedEvent[];
  out: String;
  app: Application;

  constructor(app) {
    this.colidables = [];
    this.app = app;
    this.out = "test";
    this.colided = [];
  }
  add = (name, entity) => {
    this.colidables.push({ name: name, entity: entity });
  };

  colid = (ent1, ent2, range?) => {
    for (let i = 0; i < this.colided.length; i++) {
      let pair = this.colided[i];
      if (
        (pair.ent1.name === ent1 || ent2) &&
        (pair.ent2.name === ent1 || ent2) &&
        ent1 !== ent2
      ) {
        if (range) {
          if (pair.d.x < range && pair.d.y < range) {
            return pair;
          }
        } else {
          return pair;
        }
      }
    }
    return undefined;
  };

  log = () => {
    return this.out;
  };

  check = () => {
    this.colided = [];

    for (let i = 0; i < this.colidables.length; i++) {
      let cent = this.colidables[i].entity;
      for (let ii = 0; ii < this.colidables.length; ii++) {
        let lent = this.colidables[ii].entity;

        if (cent !== lent) {
          //check for colidion
          //@ts-ignore
          let lwh = this.app.fromPos({
            x: lent.sprite.width,
            y: lent.sprite.height
          });

          let min = {
            x: lent.x - lwh.x,
            y: lent.y - lwh.y
          };
          let max = {
            x: lent.x + lwh.x,
            y: lent.y + lwh.y
          };

          this.out =
            max.x +
            ">" +
            cent.x +
            "\n" +
            lwh.x +
            "||" +
            lent.sprite.width +
            "/n" +
            //@ts-ignoreigrnore
            this.app.xm;

          if (max.x > cent.x && min.x < cent.x) {
            //They are coliding
            //{ ent1: { name: "pl1" }, ent2: { name: "pl2" } }

            let d = {
              x: Math.abs(cent.x - lent.x),
              y: Math.abs(cent.y - lent.y)
            };
            this.out += "\nD: " + d.x;

            this.colided.push({
              ent1: this.colidables[ii],
              ent2: this.colidables[i],
              d: d
            });
          } else {
            //They are not coliding
          }
        }
      }
    }
  };
}

/*
if(CD.colid(player1, player2, 5)

min
player.image.wdith ex: 200
*/
