import { Roulette, StateListener, EState } from "./roulette/roulette";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component { // TODO 如何開啟 log的時間搓?

    protected onLoad(): void {
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        
        let rouletteNode = this.node.getChildByName("roulette");
        if (!rouletteNode) {
            cc.log('error: node(roulette) not found');
            return;
        }

        let roulette = rouletteNode.getComponent(Roulette);
        if (!roulette) {
            cc.log('error: component(Roulette) not found');
            return;
        }

        let callback: StateListener = function (state: EState) {
            cc.log(new Date() + " : callback:" + state);
        }

        roulette.init(
            37, // 獎項數量
            true, // 小球 true順時針旋轉, false則是逆時針旋轉
            true,// 小球位置對應的獎項提示
            true,// 內圈輪盤是否旋轉
            false,// 內圈輪盤 true順時針旋轉, false則是逆時針旋轉
            callback, // 輪盤狀態
        );

        cc.log(new Date() + " : trigger play");
        roulette.play(); // 觸發轉動

        // roulette.scheduleOnce(() => {
        //     cc.log(new Date() + " : trigger stop");

        //     let bonusIndex = 1; // 設定要中獎的獎項索引
        //     let delay = 3; // 觸發停止後過幾秒才完全靜止, 單位:秒
        //     roulette.stop(bonusIndex, delay);
        // }, 5);
    }
}
