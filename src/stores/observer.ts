import { inject, observer } from 'mobx-react'

export default function (App: any, Injects: string[]) {
    return inject(...Injects)(observer(App));
}