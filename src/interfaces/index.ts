import HistoryStackStore from "@/stores/historyStackStore";

interface ICommonOperateProps {
    onChange: (str: string) => void;
    source: string;
    historyStackStore: HistoryStackStore,
}

interface ISelectionRecord {
    start: number;
    end: number;
    content: string;
}

export {
    ISelectionRecord,
    ICommonOperateProps
}