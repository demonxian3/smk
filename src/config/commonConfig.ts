const Config:any = {};
Config.dev = {
    BACKEND_HOST: 'http://portal-test.px.woa.com/api',
};
Config.test = {
    BACKEND_HOST: 'http://portal-test.px.woa.com/api',
};
Config.olsb = {
    BACKEND_HOST: 'http://portal-olsb.px.woa.com/api',
};
Config.prod = {
    BACKEND_HOST: 'http://portal-prod.px.woa.com/api',
};
const envInfo:any = process.env.INFO;
const thisConfig:any = Config[envInfo.ENV];

export const { BACKEND_HOST } = thisConfig;
