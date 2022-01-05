
const { ccclass, property } = cc._decorator;

/**
 * 輪盤狀態
 */
export enum EState {
    running, // 運轉中
    slowDown, // 減速準備停止
    stopped, // 停止
}

enum EAction {
    triggerRunning, // 觸發運轉
    triggerStopped, // 觸發停止
}

/**
 * 輪盤狀態
 */
export type StateListener = (state: EState) => void;

@ccclass
export class Roulette extends cc.Component {
    bonusCount: number; // 輪盤上的獎勵數量

    state: EState; // 目前輪盤狀態

    ballClockwise: boolean; // 小球 true順時針旋轉, false則是逆時針旋轉
    ballHighlight: boolean; // 小球位置對應的獎項提示

    rouletteRoatate: boolean; // 內圈輪盤是否旋轉
    rouletteClockwise: boolean;// 內圈輪盤 true順時針旋轉, false則是逆時針旋轉

    stateListener: StateListener; // 輪盤狀態

    action: EAction; // 觸發事件

    public init(
        count: number,
        ballClockwise: boolean, ballHighlight: boolean,
        rouletteRoatate: boolean, rouletteClockwise: boolean,
        stateListener: StateListener,
    ) {
        this.bonusCount = count;

        this.ballClockwise = ballClockwise;
        this.ballHighlight = ballHighlight;

        this.rouletteRoatate = rouletteRoatate;
        this.rouletteClockwise = rouletteClockwise;

        this.stateListener = stateListener;

        this.state = EState.stopped;
    }

    getState(): EState {
        return this.state;
    }

    /**
     * 開始運轉
     */
    play() {
        if (this.state != EState.stopped) {
            return;
        }

        this.action = EAction.triggerRunning;
    }


    /**
     * 停止轉動(呼叫後並不會立即調下, 則是依據帶入的時間參數來判斷幾秒後停止)
     * @param index 中獎的項目
     * @param delay 幾秒後停止
     */
    stop(index: number, delay: number) {
        if (this.state != EState.running) {
            return;
        }

        this.action = EAction.triggerStopped;
    }

    update(dt) {
        if (this.action == EAction.triggerRunning) {
            this.action = null;
            this.running();
        } else if (this.action == EAction.triggerStopped) {
            this.action = null;
        }

        if (this.state == EState.running) {
            this.node.getChildByName("wheel_roulette").rotation -= 1;
            return;
        }

        if (this.state == EState.slowDown) {

            return;
        }
    }

    private running(): void {
        {
            let ballNode = this.node.getChildByName("ball");
            let ballRigidBody = ballNode.getComponent(cc.RigidBody);

            // cc.tween(ballNode)
            //     .call(() => {
            //         cc.log("初始化小球位置");
            //         ballNode.active = false;
            //         ballNode.setPosition(-200, 275);
            //         ballRigidBody.angularVelocity = 1000;
            //     })
            //     // .delay(1)
            //     .call(() => {
            //         cc.log("顯示小球");
            //         ballNode.active = true;
            //     })
            //     .start();
        }


        this.state = EState.running;

        if (this.stateListener) {
            this.stateListener(EState.running);
        }
    }
}
