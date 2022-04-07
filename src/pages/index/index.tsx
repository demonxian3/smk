/* eslint-disable indent */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Card, Tabs } from "antd";
import CoderEditor from "./components/coderEditor/coderEditor";
import JsonEditor from "./components/jsonEditor/jsonEditor";
import CryptoEditor from "./components/cryptoEditor/cryptoEditor";
import ErrorBoundary from "./components/errorboudary";
import { Provider } from "mobx-react";
import RootStore from "@/stores/rootStore";
import withObserver from "@/stores/observer";
import HistoryStack from "@/components/common/historyStack/historyStack";

// https://github.com/mac-s-g/react-json-view

import "antd/dist/antd.css";
import "./index.less";

const App: React.FC<any> = (props) => {
    const [target, setTarget] = useState("");
    const {historyStackStore } = props;
    return (
        <>
            <ErrorBoundary>
                <Card className="main">
                    <Tabs type="card" className="operation" defaultActiveKey="Crypto">
                        <Tabs.TabPane tab="Coder" key="Coder">
                            <CoderEditor source={target} onChange={setTarget} pushHistory={historyStackStore.pushStack} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Json" key="Json">
                            <JsonEditor source={target} onChange={setTarget} pushHistory={historyStackStore.pushStack} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Crypto" key="Crypto">
                            <CryptoEditor source={target} onChange={setTarget} pushHistory={historyStackStore.pushStack} />
                        </Tabs.TabPane>
                    </Tabs>
                    <HistoryStack setTarget={setTarget}/>
                </Card>
            </ErrorBoundary>
        </>
    );
};

const Apps = withObserver(App, ["historyStackStore"]);
ReactDOM.render(
    <Provider {...new RootStore()}>
        <Apps />
    </Provider>,
    document.getElementById("root")
);
