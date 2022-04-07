import React, { useState } from "react";
import { isValidKey } from "@/util/commonUtil";
import { Button, Input, message, List, Select, Space, Modal, Checkbox, Form } from "antd";
import Coder from "@/components/coder";
import MiscFunction from "./miscFunction";
import DataWorkshop from "@/components/common/dataWorkshop/dataWorkshop";
import "../../index.less";
import { ICommonOperateProps, ISelectionRecord } from "@/interfaces/index"
import withObserver from "@/stores/observer";


const CoderEditor: React.FC<ICommonOperateProps> = (props) => {
    const { source, onChange, historyStackStore } = props;
    const coder = new Coder();

    const [visOtherFunc, setVisOtherFunc] = useState(false);
    const [visSettings, setVisSettings] = useState(false);

    const [signSetting, setSignSetting] = useState(["n", "t", '"']);
    const [charsetSetting, setCharsetSetting] = useState("utf8");
    const [selectRangeRecord, setSelectRangeRecord] = useState<ISelectionRecord>({ start: 0, end: 0, content: "" });

    // 哪些方法需要配置的，作为参数传进coder里
    const settingMap = {
        escape: signSetting,
        unescape: signSetting,
        urlencode: charsetSetting,
        urldecode: charsetSetting,
    };

    const handleClick = (historyTitle: string, coderMethod: Function, bindObject: Object, params: any[]) => {
        // 鼠标是否有选中文本
        const selectText = selectRangeRecord.content;
        try {
            const input = selectText ? selectText : source;
            const output: string = coderMethod.call(bindObject, input, ...params);

            if (input.length && !output.length) {
                message.warning("文本处理结果为空");
                return;
            }

            if ((selectText && selectText === output) || source === output) {
                return;
            }

            if (!historyStackStore.stack.length) {
                historyStackStore.pushStack('初始值', input);
            }

            const result: string = selectText ? replaceSelection(output) : output;
            onChange(result);
            historyStackStore.pushStack(historyTitle, result);
        } catch (e) {
            message.error(e.toString());
        }
    };

    const replaceSelection = (replacement: string): string => {
        const content = source;

        const start = selectRangeRecord.start;
        const end = selectRangeRecord.end;

        const prefixText = content.substr(0, start);
        const suffixText = content.substr(end);

        return prefixText + replacement + suffixText;
    };

    const makeCoderBtn = (arr: string[]) =>
        arr.map((m) => {
            const label = isValidKey(m, coder.methodsCnMap) ? coder.methodsCnMap[m] : "无效方法";
            let method: CallableFunction = () => console.log("调用无效函数");
            if (isValidKey(m, coder) && typeof coder[m] === "function") {
                method = coder[m];
            }

            let param: any[] = [];
            if (isValidKey(m, settingMap)) {
                param = [settingMap[m]];
            }

            return (
                <Button block onClick={() => handleClick(label, method, coder, param)} key={m}>
                    {label}
                </Button>
            );
        });

    const leftMethods = [
        "urlencode",
        "base64encode",
        "hexencode",
        "binencode",
        "unicodeencode",
        "entityencode",
        "toTimestamp",
        "jsonParse",
        "addBackslash",
        "escape",
        "paramSplit",
    ];

    const rightMethods = [
        "urldecode",
        "base64decode",
        "hexdecode",
        "bindecode",
        "unicodedecode",
        "entitydecode",
        "toDatetime",
        "jsonCompress",
        "delBackslash",
        "unescape",
        "paramJoinl",
    ];

    return (
        <div className="coderEditor">
            <div className="tools">
                <div className="toolbar">
                    <div className="toolbar-side">
                        {makeCoderBtn(leftMethods)}
                        <Button block onClick={() => setVisOtherFunc(true)}>
                            其他功能
                        </Button>
                    </div>
                    <div className="toolbar-side">
                        {makeCoderBtn(rightMethods)}
                        <Button block onClick={() => setVisSettings(true)}>
                            编码配置
                        </Button>
                    </div>
                </div>
            </div>

            <DataWorkshop
                source={source}
                onChange={onChange}
                updateSelectRangeRecord={(record: ISelectionRecord) => setSelectRangeRecord(record)}
            />

            <Modal
                centered
                footer={null}
                title="其他功能"
                visible={visOtherFunc}
                onCancel={() => setVisOtherFunc(false)}
            >
                <MiscFunction {...props} />
            </Modal>

            <Modal
                centered
                footer={null}
                title="编码配置 "
                visible={visSettings}
                onCancel={() => setVisSettings(false)}
            >
                <Form>
                    <Form.Item label="转义符配置">
                        <Checkbox.Group
                            options={Object.keys(coder.specialSigns).map((sign) => ({
                                label: `\\${sign ? sign : "\\"}`,
                                value: sign,
                            }))}
                            value={signSetting}
                            onChange={(v) => {
                                setSignSetting(v as string[]);
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="编码配置">
                        <Select value={charsetSetting} onChange={(v) => setCharsetSetting(v)}>
                            <Select.Option value="utf8">UTF-8</Select.Option>
                            <Select.Option value="gbk">GBK</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default withObserver(CoderEditor, ["historyStackStore"]);
