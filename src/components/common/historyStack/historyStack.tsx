/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { List } from "antd";

import withObserver from "@/stores/observer";
import HistoryStackStore from "@/stores/historyStackStore";
import "./index.less";

const HistoryStack: React.FC<{historyStackStore: HistoryStackStore; setTarget: any}> = (props) => {
    const {historyStackStore, setTarget } = props;

    useEffect(() => {
    }, [historyStackStore.currentStep]);

    return (<div className="history">
    <List
        style={{ width: "145px", maxHeight: "670px", overflowY: "scroll" }}
        size="small"
        locale={{ emptyText: "暂无数据" }}
        header={<div className="text-center">操作历史</div>}
        footer={
            <div className="text-center cursor-pointer" onClick={historyStackStore.cleanStack}>
                {" "}
                清空历史{" "}
            </div>
        }
        bordered
        dataSource={historyStackStore.stack}
        renderItem={(item: any, idx) => (
            <List.Item
                className={`cursor-pointer ${historyStackStore.currentStep === idx ? "active-item" : ""}`}
                onClick={(e: React.MouseEvent) => {
                    historyStackStore.setCurrentStep(idx);
                    setTarget(historyStackStore.stack[idx].source);
                }}
                onDoubleClick={(e: React.MouseEvent) => historyStackStore.removeStack(e, idx)}
            >{`${idx + 1}. ${item.title}`}</List.Item>
        )}
    />
</div>);
}

export default withObserver(HistoryStack, ["historyStackStore"]);
