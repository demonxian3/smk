import { observable, makeObservable, action } from 'mobx'
import RootStore from './rootStore';


interface ITaskManagerStore {
    currentId: number,
    currentPath: string,
}

class TaskManagerStore {
    rootStore: RootStore = null;
    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @observable currentId = 0;
    @observable currentPath = "";

    @action.bound setCurrentId = (id:number) => this.currentId = id;
    @action.bound setCurrentPath = (path:string) => this.currentPath = path;
}

export default TaskManagerStore;