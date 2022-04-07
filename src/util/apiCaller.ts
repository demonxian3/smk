import axios from 'axios';
import qs from 'qs';
import { BACKEND_HOST } from '@/config/commonConfig';
import RequestMap from '@/config/requestMap';

const get = (apiPath:RequestMap, param:object) => {
    const url = BACKEND_HOST + apiPath;
    return axios({
        method: 'get',
        url,
        params: param,
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error(`status: ${response.status}`);
        }
        return response.data;
    }).catch((error) => {
        console.log(`${apiPath}:访问接口失败，错误信息：${error}`);
    });
};

const post = (apiPath:RequestMap, param:object) => {
    const url = BACKEND_HOST + apiPath;
    return axios({
        method: 'post',
        url,
        data: qs.stringify(param),
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error(`status: ${response.status}`);
        }
        return response.data;
    }).catch((error) => {
        console.log(`${apiPath}:访问接口失败，错误信息：${error}`);
    });
};

const apiCaller = {
    get,
    post,
};

export const API = RequestMap;

export default apiCaller;
