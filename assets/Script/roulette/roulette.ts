
const { ccclass, property } = cc._decorator;

class Visible {
    visible: boolean;
}

class Position {
    position: cc.Vec2;
}

class Ball {
    visible: Visible;
    position: Position;
}

class Arrow {
    visible: Visible;
    position: Position;
}

/**
 * 輪盤種類
 */
enum EMode {
    arrow,
    ball,
}

/**
 * 輪盤狀態
 */
export enum EState {
    running, // 旋轉中
    slowDown, // 減速準備停止
    stopped, // 停止
}

/**
 * 輪盤狀態
 */
export type StateListener = (state: EState) => void;

@ccclass
export class Roulette extends cc.Component {
    bonusCount: number; // 輪盤上的獎勵數量

    state: EState; // 目前輪盤狀態

    mode: EMode; // 目前輪盤種類
    clockwise: boolean; // true順時針旋轉, false則是逆時針旋轉
    highlight: boolean; // 指向的獎項提示

    rouletteRotate: boolean; // 內圈輪盤是否旋轉
    rouletteClockwise: boolean;// 內圈輪盤 true順時針旋轉, false則是逆時針旋轉

    stateListener: StateListener; // 輪盤狀態

    public init(): Roulette {
        this.bonusCount = 37;

        this.state = EState.stopped;

        this.mode = EMode.arrow;
        this.clockwise = true;
        this.highlight = true;

        this.rouletteRotate = true;
        this.rouletteClockwise = true;

        this.updateUI();

        return this;
    }

    getState(): EState {
        return this.state;
    }

    setStateListener(stateListener: StateListener): Roulette {
        this.stateListener = stateListener;
        return this;
    }

    setBonus(count: number): Roulette {
        this.bonusCount = count;
        this.updateUI();
        return this;
    }

    setMode(mode: EMode, clockwise: boolean, highlight: boolean): Roulette {
        this.mode = mode;
        this.clockwise = clockwise;
        this.highlight = highlight;
        this.updateUI();
        return this;
    }

    setRoulette(roatate: boolean, clockwise: boolean): Roulette {
        this.rouletteRotate = roatate;
        this.rouletteClockwise = clockwise;
        this.updateUI();
        return this;
    }

    private updateUI() {
        this.node.getChildByName("arrow").active = this.mode == EMode.arrow;
        this.node.getChildByName("ball").active = this.mode == EMode.ball;
    }

    /**
     * 開始轉動
     */
    play() {
        if (this.state != EState.stopped) {
            return;
        }

        this.state = EState.running;

        if (this.stateListener) {
            this.stateListener(EState.running);
        }
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

        this.state = EState.slowDown;

        if (this.stateListener) {
            this.stateListener(EState.slowDown);
        }
    }

    update(dt) {
        if (this.state == EState.running) {
            this.node.getChildByName("roulette").rotation += 0.1;
            return;
        }

        if (this.state == EState.slowDown) {

            return;
        }
    }
}
