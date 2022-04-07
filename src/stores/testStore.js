import { observable, makeObservable, action } from 'mobx'


class TestStore {
    constructor(rootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @observable list = [];
    @observable count = 1;
    @action.bound incr = function () {
        this.count++;
    }
    @action.bound setList = function (list) {
        this.list = list;
    }
}

export default TestStore;