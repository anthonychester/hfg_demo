//@ts-ignore Some imports fall to
import { Graphics, Application } from "pixi.js";

export class MainMeue {
  app: Application;
  platforms: Graphics;

  constructor(app) {
    this.app = app;
    this.platforms = new Graphics();

    //this.platforms.beginFill(0xff00ff);
    //this.platforms.lineStyle(10, 0x00ff00);
    //this.platforms.drawRect(200, 200, 25, 25);
    //this.platforms.endFill();

    //@ts-ignore
    this.platforms.zIndex = 11;
    //console.log("form: ", this.platforms);

    this.app.stage.addChild(this.platforms);
  }

  resize = () => {};

  getOpen = () => {
    const graphy: Graphics = new Graphics();

    // we give instructions in order. begin fill, line style, draw circle, end filling
    graphy.beginFill(0xff00ff);
    graphy.lineStyle(10, 0x00ff00);
    graphy.drawCircle(0, 0, 25); // See how I set the drawing at 0,0? NOT AT 100, 100!
    graphy.endFill();

    this.app.stage.addChild(graphy); //I can add it before setting position, nothing bad will happen.

    // Here we set it at 100,100
    graphy.x = 0;
    graphy.y = 0;

    //@ts-ignore
    graphy.zIndex = 10;
    /*
    console.log(this.app.solid);
    for (let i in this.app.solid) {
      let point = this.app.solid[i];
      let tl = this.app.toPos(point.tl);
      let tr = this.app.toPos(point.tr);
      let bl = this.app.toPos(point.bl);
      let br = this.app.toPos(point.br);

      let dis = this.app.fromPos({
        y: (br.y - tl.y) * this.app.mapscaley,
        x: (br.x - tl.x) * this.app.mapscalex
      });

      let xy = this.app.fromPos({
        y: tl.y * this.app.mapscaley,
        x: tl.x * this.app.mapscalex
      });
      this.platforms.beginFill(0xff00ff);
      this.platforms.lineStyle(10, 0x00ff00);
      this.platforms.drawRect(xy.x, xy.y, dis.x, dis.y);
      this.platforms.endFill();
    }

    console.log(this.app.solid);
    for (let i in this.app.solid) {
      let point = this.app.solid[i];
      let tl = this.app.toPos(point.tl);
      let tr = this.app.toPos(point.tr);
      let bl = this.app.toPos(point.bl);
      let br = this.app.toPos(point.br);

      let dis = this.app.fromPos({
        y: (br.y - tl.y) * this.app.mapscaley,
        x: (br.x - tl.x) * this.app.mapscalex
      });

      let xy = this.app.fromPos({
        y: tl.y * this.app.mapscaley,
        x: tl.x * this.app.mapscalex
      });
      this.platforms.beginFill(0xff00ff);
      this.platforms.lineStyle(10, 0xffff00);
      this.platforms.drawRect(
        xy.x + dis.x,
        xy.y + dis.y,
        xy.x + dis.x,
        xy.y - dis.y
      );
      this.platforms.endFill();

    }
    */
  };

  loop = (delta) => {};
}
