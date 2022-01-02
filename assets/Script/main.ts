import { Roulette, StateListener, EState } from "./roulette/roulette";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component { // TODO 如何開啟 log的時間搓?

    protected onLoad(): void {
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

        roulette.init();

        let callback: StateListener = function (state: EState) {
            cc.log("callback:" + state);
        }
        roulette.setStateListener(callback)

        roulette.play();

        roulette.scheduleOnce(() => {
            roulette.stop(1, 3);
        }, 5);
    }
}
