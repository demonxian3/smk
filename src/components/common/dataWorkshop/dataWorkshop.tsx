import React, { useState } from "react";
import { Space, Input, Button } from "antd";
import { ICommonOperateProps, ISelectionRecord } from "@/interfaces/index"
import withObserver from "@/stores/observer";


interface IDataWorkshop extends ICommonOperateProps {
    updateSelectRangeRecord: (record: ISelectionRecord) => void;
}
const DataWorkshop: React.FC<IDataWorkshop> = (props) => {
    const { source, onChange, historyStackStore, updateSelectRangeRecord } = props;

    // 检查是否有选中元素，并记录开始和结束的位置方便替换文本
    const checkSelection = () => {
        const textarea = document.activeElement as HTMLTextAreaElement;
        const selectRangeRecord: ISelectionRecord = { start: 0, end: 0, content: "" };

        if (!textarea || !textarea.value) {
            selectRangeRecord.content = "";
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (end <= start) {
            selectRangeRecord.content = "";
        }

        selectRangeRecord.start = start;
        selectRangeRecord.end = end;
        selectRangeRecord.content = textarea.value.substring(start, end);
        updateSelectRangeRecord(selectRangeRecord);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const data = e.clipboardData?.getData("Text");
        historyStackStore.pushStack("粘贴值", data);
    };

    return (
        <Input.TextArea
            value={source}
            onChange={(e) => onChange(e.target.value)}
            placeholder=""
            autoSize={{ minRows: 30, maxRows: 30 }}
            onMouseUp={checkSelection}
            onPaste={(e) => handlePaste(e)}
        ></Input.TextArea>
    );
};

export default withObserver(DataWorkshop, ["historyStackStore"]);
