import { BACKEND_HOST } from "@/config/commonConfig";

interface IParams {
    [propName: string]: string;
}

export const getBackendImageUrl = function (path: string) {
    return BACKEND_HOST + path;
};

export const isValidKey = (key: string | number | symbol, object: object): key is keyof typeof object => {
    return key in object;
}

export const getSelection = () => {
    return window.getSelection().toString();
}

// 替换鼠标选中的文本，对textarea无效
export const replaceSelection = (replacement: string): string => {
    const range = window.getSelection().getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(replacement);
    range.insertNode(textNode);
    return (range.commonAncestorContainer as HTMLDivElement).innerText;
}

// 首字母大写
export const ucFirst = (words: string): string => {
    return words.slice(0, 1).toUpperCase() + words.slice(1);
};

// 防抖
export const throttle = (fn:Function, wait: number, immediate: boolean=false ) => {
    if (immediate) {
        let prevTime = 0;
        return (...args:any)=>{
            let nowTime = Date.now();
            if(nowTime-prevTime >= wait){
                fn.apply(this,args)
                prevTime = nowTime
            }
        }
    } else {
        //定时器
        let timer: NodeJS.Timeout|null;
        return (...args:any)=>{
            if(!timer){
                fn.apply(this,args)
                timer = setTimeout(() => {
                    timer&&clearTimeout(timer)
                    timer= null
                }, wait);
            }
            
        }
    }
}


// 解析Query String参数
export const getUrlQueryParams = function (url: string = location.href) {
    const params: IParams = {};
    const urlObj = new URL(url);

    urlObj.searchParams.forEach((value, key) => {
        let pos = -1;
        let newVal = value;
        if ((pos = value.indexOf('?')) >= 0) {
            newVal = value.substring(0, pos);
        }
        params[key] = newVal;
    });

    return params;
};
