import React, { useState } from "react";
import { isValidKey } from "@/util/commonUtil";
import { Button, Input, message, List, Select, Space, Modal, Checkbox, Form } from "antd";
import Crypto from "@/components/crypto";
import DataWorkshop from "@/components/common/dataWorkshop/dataWorkshop";
import { ICommonOperateProps, ISelectionRecord } from "@/interfaces/index"
import withObserver from "@/stores/observer";
import "../../index.less";


const CryptoEditor: React.FC<ICommonOperateProps> = (props) => {
    const { source, onChange, historyStackStore } = props;
    const crypto = new Crypto();

    const [visDESSetting, setVisDesSetting] = useState(false);
    const [selectRangeRecord, setSelectRangeRecord] = useState<ISelectionRecord>({ start: 0, end: 0, content: "" });
    
    
    const [desSetting, setDESSetting] = useState({
        mode: 'ECB',
        padding: 'ZeroPadding',
        key: '',
        iv: '',
        encode: 'Base64', //Hex
        charset: 'Utf8',
    });

    // 哪些方法需要配置的，作为参数传进coder里
    const settingMap = {
        desEncrypt: desSetting,
        desDecrypt: desSetting,
        tripleDesEncrypt: desSetting,
        tripleDesDecrypt: desSetting,
        aesEncrypt: desSetting,
        aesDecrypt: desSetting,
    };

    // const showVisibleMap = {
    //     desEncrypt: () => setVisDesSetting(true),
    //     desDecrypt: () => setVisDesSetting(true),
    // };


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
            const label = isValidKey(m, crypto.methodsCnMap) ? crypto.methodsCnMap[m] : "无效方法";
            let method: CallableFunction = () => console.log("调用无效函数");
            if (isValidKey(m, crypto) && typeof crypto[m] === "function") {
                method = crypto[m];
            }

            let param: any[] = [];
            if (isValidKey(m, settingMap)) {
                param = [settingMap[m]];
            }

            let handleFn = () => handleClick(label, method, crypto, param);
            // if (Icon && isValidKey(m, showVisibleMap)) {
            //     handleFn = showVisibleMap[m];
            // } 

            return (
                <Button 
                    block
                    onClick={() => handleFn()} 
                    key={m}
                >
                    {label}
                </Button>
            );
        });

    const leftMethods = [
        "md5",
        "sha1",
        "desEncrypt",
        "tripleDesEncrypt",
        "aesEncrypt",
        
    ];

    const rightMethods = [
        "sha256",
        "sha512",
        "desDecrypt",
        "tripleDesDecrypt",
        "aesDecrypt",
    ];

    return (
        <div className="coderEditor">
            <div className="tools">
                <div className="toolbar">
                    <div className="toolbar-side">
                        {makeCoderBtn(leftMethods)}
                        <Button block onClick={() => setVisDesSetting(true)}>
                            DES配置 
                        </Button>
                        {/* <Button block onClick={() => setVisOtherFunc(true)}>
                            其他功能
                        </Button> */}
                    </div>
                    <div className="toolbar-side">
                        {makeCoderBtn(rightMethods)}
                        {/* <Button block onClick={() => setVisSettings(true)}>
                            编码配置
                        </Button> */}
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
                title="DES配置"
                visible={visDESSetting}
                onCancel={() => setVisDesSetting(false)}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item label="模式">
                        <Select defaultValue="ECB" onChange={(v: string) => setDESSetting({...desSetting, mode: v})}>
                            <Select.Option value="ECB">ECB</Select.Option>
                            <Select.Option value="CFB">CFB</Select.Option>
                            <Select.Option value="CTR">CTR</Select.Option>
                            <Select.Option value="OFB">OFB</Select.Option>
                            <Select.Option value="CBC">CBC</Select.Option>
                            <Select.Option value="CTRGladman">CTRGladman</Select.Option>
                            
                        </Select>
                    </Form.Item>
                    <Form.Item label="填充">
                        <Select defaultValue="ZeroPadding" onChange={(v: string) => setDESSetting({...desSetting, padding: v})}>
                            <Select.Option value="ZeroPadding">ZeroPadding</Select.Option>
                            <Select.Option value="NoPadding">NoPadding</Select.Option>
                            <Select.Option value="Pkcs7">Pkcs7</Select.Option>
                            <Select.Option value="Ansix923">Ansix923</Select.Option>
                            <Select.Option value="Iso10126">Iso10126</Select.Option>
                            <Select.Option value="Iso97971">Iso97971</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="密钥" >
                        <Input onChange={(e) => setDESSetting({...desSetting, key: e.target.value})}/>
                    </Form.Item>
                    <Form.Item label="IV" >
                        <Input onChange={(e) => setDESSetting({...desSetting, iv: e.target.value})}/>
                    </Form.Item>
                    <Form.Item label="编码">
                        <Select defaultValue="Base64" onChange={(v: string) => setDESSetting({...desSetting, encode: v})}>
                            <Select.Option value="Base64">Base64</Select.Option>
                            <Select.Option value="Hex">Hex</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="字符集">
                        <Select defaultValue="Utf8" onChange={(v: string) => setDESSetting({...desSetting, charset: v})}>
                            <Select.Option value="Utf8">Utf8</Select.Option>
                            <Select.Option value="Latin1">Latin1</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default withObserver(CryptoEditor, ["historyStackStore"]);
