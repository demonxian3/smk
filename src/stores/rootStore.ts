import HistoryStackStore from "./historyStackStore";
import TaskManagerStore from "./taskManagerStore";

class RootStore {
    name = 111;
    historyStackStore: HistoryStackStore = null;
    taskManagerStore: TaskManagerStore = null;
    constructor() {
        this.taskManagerStore = new TaskManagerStore(this);
        this.historyStackStore = new HistoryStackStore(this);
    }
}

export default RootStore;