import React, { useState } from "react";
import { Space, Input, Button } from "antd";
import { ICommonOperateProps } from "@/interfaces/index"
import withObserver from "@/stores/observer"


const MiscFunction: React.FC<ICommonOperateProps> = (props) => {
    const { source, onChange, historyStackStore } = props;
    const [replaceRight, setReplaceRight] = useState("");
    const [replaceLeft, setReplaceLeft] = useState("");

    const replaceSource = (replaceAll: boolean) => {
        const specialList = ["|", "^", "[", "]", "(", ")", "*", ".", "$", "+", "{", "}", "?", "\\"];

        let sourceNew = source;
        let filterReplaceLeft = "";
        for (let c of replaceLeft) {
            filterReplaceLeft += specialList.includes(c) ? "\\" + c : c;
        }

        if (replaceAll) {
            sourceNew = source.replace(new RegExp(filterReplaceLeft, "gm"), replaceRight);
        } else {
            sourceNew = source.replace(replaceLeft, replaceRight);
        }

        onChange(sourceNew);
        historyStackStore.pushStack("文本替换", sourceNew);
    };

    return (
        <Space size={5}>
            <label>文本替换 &nbsp;</label>
            <Input
                style={{ width: "80px" }}
                onChange={(e) => setReplaceLeft(e.target.value)}
                placeholder="被替换值"
            ></Input>
            <Input
                style={{ width: "80px" }}
                onChange={(e) => setReplaceRight(e.target.value)}
                placeholder="替换值"
            ></Input>
            <Button onClick={() => replaceSource(false)}>单替换</Button>
            <Button onClick={() => replaceSource(true)}>全替换</Button>
        </Space>
    );
};

export default withObserver(MiscFunction, ["historyStackStore"]) ;
