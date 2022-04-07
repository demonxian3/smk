import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Select, Switch, Form, InputNumber } from "antd";
import JsonViewer from "react-json-view";
import "../../index.less";

interface IJsonEditor {
    onChange: (str: string) => void;
    source: string;
    pushHistory: (title: string, source: string) => void;
}

const JsonEditor: React.FC<IJsonEditor> = (props) => {
    const { source, onChange, pushHistory } = props;

    const [theme, setTheme] = useState("ocean");
    const [icon, setIcon] = useState("circle");
    const [showType, setShowType] = useState(false);
    const [showIndex, setShowIndex] = useState(false);
    const [showSize, setShowSize] = useState(true);
    const [showSort, setShowSort] = useState(false);
    const [collapse, setCollapse] = useState("2");

    const parse2Json = () => {
        try {
            return JSON.parse(source);
        } catch (e) {
            return {};
        }
    };

    const themeOptions = [
        "apathy",
        "ashes",
        "bespin",
        "brewer",
        "bright",
        "chalk",
        "codeschool",
        "colors",
        "eighties",
        "embers",
        "flat",
        "google",
        "grayscale",
        "greenscreen",
        "harmonic",
        "hopscotch",
        "isotope",
        "marrakesh",
        "mocha",
        "monokai",
        "ocean",
        "paraiso",
        "pop",
        "railscasts",
        "rjv-,default",
        "shapeshifter",
        "inverted",
        "solarized",
        "summerfruit",
        "threezerotwofour",
        "tomorrow",
        "tube",
        "twilight",
    ];

    const iconOptions = ["circle", "triangle", "square"];

    return (
        <div className="jsonEditor">
            <Form className="toolbar">
                <Form.Item label="选择主题">
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        value={theme}
                        onChange={(v) => setTheme(v as string)}
                    >
                        {themeOptions.map((item) => (
                            <Select.Option key={item} value={item}>
                                {item}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="选择图标">
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        value={theme}
                        onChange={(v) => setIcon(v as string)}
                    >
                        {iconOptions.map((item) => (
                            <Select.Option key={item} value={item}>
                                {item}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="显示类型">
                    <Switch checked={showType} onChange={(v) => setShowType(v)} />
                </Form.Item>
                <Form.Item label="显示个数">
                    <Switch checked={showSize} onChange={(v) => setShowSize(v)} />
                </Form.Item>
                <Form.Item label="显示排序">
                    <Switch checked={showSort} onChange={(v) => setShowSort(v)} />
                </Form.Item>
                <Form.Item label="显示索引">
                    <Switch checked={showIndex} onChange={(v) => setShowIndex(v)} />
                </Form.Item>

                <Form.Item label="折叠数量">
                    <InputNumber size="large" min={"0"} max={"10"} value={collapse} onChange={(v) => setCollapse(v)} />
                </Form.Item>
                <div>
                    编辑: <kbd>Ctrl + Click</kbd>
                    <br />
                    确定: <kbd>Ctrl + Enter</kbd>
                    <br />
                    取消: <kbd>Esc</kbd>
                    <br />
                </div>
            </Form>
            <JsonViewer
                style={{ padding: "12px" }}
                src={parse2Json()}
                collapseStringsAfterLength={25}
                theme={theme as any}
                iconStyle={icon as any}
                displayObjectSize={showSize}
                displayDataTypes={showType}
                enableClipboard={true}
                quotesOnKeys={false}
                sortKeys={showSort}
                collapsed={parseInt(collapse, 10)}
                onEdit={(e: any) => {
                    console.log("edit callback", e);
                    if (e.new_value == "error") {
                        return false;
                    }
                    const updated_src = JSON.stringify(e.updated_src);
                    pushHistory("Json编辑", updated_src);
                    onChange(JSON.stringify(e.updated_src));
                }}
                onDelete={(e: any) => {
                    console.log("delete callback", e);
                    onChange(JSON.stringify(e.updated_src));
                    const updated_src = JSON.stringify(e.updated_src);
                    pushHistory("Json删除", updated_src);
                }}
                onAdd={(e: any) => {
                    console.log("add callback", e);
                    if (e.new_value == "error") {
                        return false;
                    }
                    const updated_src = JSON.stringify(e.updated_src);
                    pushHistory("Json添加", updated_src);
                    onChange(JSON.stringify(e.updated_src));
                }}
                onSelect={(e: any) => {
                    console.log("select callback", e);
                    console.log(e.namespace);
                }}
            />
        </div>
    );
};

export default JsonEditor;
