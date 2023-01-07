import { Roulette, StateListener, EState } from "./roulette/roulette";

const { ccclass, property } = cc._decorator;

class Zhuanpan{
    speed:number;
    rotation: number;
}

class Ball {
    speed: number;
    rotation: number;
}

// ref:
// https://blog.csdn.net/Ctrls_/article/details/103532339
// https://www.jianshu.com/p/d76dc3cf5aa7

@ccclass
export default class Main extends cc.Component { 
    zhuanpan: Zhuanpan;
    ball: Ball;
    circleCenter: cc.Vec2;
    circleRadius: number;
    radian:number;

    result: string;
    isrotate: boolean;
    isadd: boolean = true;

    zhuanpanNode:cc.Node;
    ballNode: cc.Node;
    
    protected onLoad(): void { // zhuanpan
        this.zhuanpanNode = this.node.getChildByName("zhuanpan");
        this.ballNode = this.node.getChildByName("ball");

        this.result = "2"; // 控制結果位置

        this.zhuanpan = new Zhuanpan();
        this.ball = new Ball();

        this.zhuanpan.speed = 0.5; // 轉盤旋轉速度
        this.ball.speed = 0.5; // 小球速度
        this.circleCenter = new cc.Vec2(0, 0); // 中心點位置座標
        this.circleRadius = 250; // 半徑
        this.radian = 0; // 弧度
        this.schedule(this.circleMove, 0.01); // 執行小球員周運動

        this.scheduleOnce(this.trigger, 6);
    }

    trigger(dt){
        this.schedule(this.startBallRotate, 0.01);
    }

    protected update(dt: number): void {
        this.zhuanpan.rotation += this.zhuanpan.speed;
    }

    circleMove(dt){
        this.radian+=dt*(this.ball.speed);
        let x = this.circleRadius * Math.cos(this.radian) + this.circleCenter.x;
        let y = this.circleRadius * Math.sin(this.radian) + this.circleCenter.y;
        let angle = 360 - 180 / Math.PI * this.radian;
        // this.ballNode.rotation = angle; // 小球轉向
        this.ballNode.position = cc.v2(x,y); // 小球圓周運動
    }

    startBallRotate(dt){
        // cc.log("startBallRotate");

        this.circleRadius -= 15 * dt;
        let ballPos = this.nodeConvertToNodeSpaceAR(this.ballNode, this.zhuanpanNode);
        let str = ""+this.result;
        let dist = ballPos.sub(this.zhuanpanNode.getChildByName(str).position).mag();
        if(this.circleRadius < 180 && dist < 50){
            if(this.isrotate){
                let ballPos1 = this.nodeConvertToNodeSpaceAR(this.ballNode, this.zhuanpanNode.getChildByName(str));
                this.ballNode.setPosition(ballPos1);
            }
            this.ballNode.parent = this.zhuanpanNode.getChildByName(str);
            this.isrotate = false;
        }
        if(!this.isrotate){
            cc.log("startJumpAni");
            this.startJumpAni(dt);
            // this.moveToPos();
        }
    }

    nodeConvertToNodeSpaceAR(node: cc.Node, target: cc.Node): cc.Vec2 {
        let worldPos = node.convertToWorldSpaceAR(cc.v2(0,0));
        let pos = target.convertToNodeSpaceAR(worldPos);
        return pos;
    }

    startJumpAni(dt){
        if(this.isadd){
            this.ballNode.x += dt * 100;
            this.ballNode.y += dt * 50;
            cc.log("ball y:"+this.ballNode.y);
            if(this.ballNode.y> -20){
                this.ballNode.x -= dt * 300;
                this.ballNode.y -= dt * 100;
                this.moveToPos();
                this.isadd = false;
            }
        }
    }

    moveToPos(){
        this.unschedule(this.circleMove);
        this.unschedule(this.startBallRotate);

        let moveCenterUp = cc.moveTo(0.2,cc.v2(0, 48));
        let moveUp1 = cc.moveTo(0.2, cc.v2(-30, 44));
        let moveUp2 = cc.moveTo(0.2, cc.v2(30, 44));
        let moveLeft = cc.moveTo(0.2, cc.v2(-24, 0));
        let moveSmall1 = cc.moveTo(0.2, cc.v2(-2, 4));
        let moveSmall2 = cc.moveTo(0.3, cc.v2(3, 7));
        let moveRight = cc.moveTo(0.2, cc.v2(24, 0));
        let moveCenter = cc.moveTo(0.3, cc.v2(0, 0));
        let action = cc.sequence(moveCenterUp, moveLeft, moveUp1, moveRight, moveUp2, moveSmall1, moveSmall2, moveCenter);
        this.ballNode.runAction(action);
        // this.ballNode.position.sub(this.zhuanpanNode.getChildByName("number").getChildByName("0").position).mag();
        this.ballNode.position.sub(this.zhuanpanNode.getChildByName(this.result).position).mag();
    }
}

// @ccclass
// export default class Main extends cc.Component { // TODO 如何開啟 log的時間搓?

//     protected onLoad(): void {
//         let physicsManager = cc.director.getPhysicsManager();
//         physicsManager.enabled = true;
        
//         let rouletteNode = this.node.getChildByName("roulette");
//         if (!rouletteNode) {
//             cc.log('error: node(roulette) not found');
//             return;
//         }

//         let roulette = rouletteNode.getComponent(Roulette);
//         if (!roulette) {
//             cc.log('error: component(Roulette) not found');
//             return;
//         }

//         let callback: StateListener = function (state: EState) {
//             cc.log(new Date() + " : callback:" + state);
//         }

//         roulette.init(
//             37, // 獎項數量
//             true, // 小球 true順時針旋轉, false則是逆時針旋轉
//             true,// 小球位置對應的獎項提示
//             true,// 內圈輪盤是否旋轉
//             false,// 內圈輪盤 true順時針旋轉, false則是逆時針旋轉
//             callback, // 輪盤狀態
//         );

//         cc.log(new Date() + " : trigger play");
//         roulette.play(); // 觸發轉動

//         // roulette.scheduleOnce(() => {
//         //     cc.log(new Date() + " : trigger stop");

//         //     let bonusIndex = 1; // 設定要中獎的獎項索引
//         //     let delay = 3; // 觸發停止後過幾秒才完全靜止, 單位:秒
//         //     roulette.stop(bonusIndex, delay);
//         // }, 5);
//     }
// }
