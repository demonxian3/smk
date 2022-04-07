import { observable, makeObservable, action } from 'mobx'
import RootStore from './rootStore';


interface IHistoryInfo {
    title: string,
    source: string,
}

class HistoryStackStore {
    rootStore: RootStore = null;
    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @observable stack: Array<IHistoryInfo> = [];
    @observable currentStep = -1;

    @action.bound pushStack = (title: string, source: string): void => {
        // 在当前记录后面追加历史记录,并请掉之前后面的记录
        this.currentStep += 1;
        this.stack.splice(this.currentStep, this.stack.length - this.currentStep, { title, source })

    }

    @action.bound removeStack = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        this.currentStep -= 1;
        this.stack.splice(idx, 1);
    }

    @action.bound cleanStack = () => {
        this.stack = [];
    }
    
    @action.bound setCurrentStep = (idx: number) => {
        this.currentStep = idx;
    }
}

export default HistoryStackStore;