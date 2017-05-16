// 通用
const ENV = process.env.NODE_ENV || 'development';
export const YES = true;
export const NO = false;

// 接口地址
export const BASE_URI = ENV === 'development' ? 'http://localhost:2995/wechat/discussion/' : 'http://www.bamaying.com/wechat/discussion/';

//temp
export const REQUEST_TOP_TOP_TOP = 'REQUEST_TOP_TOP_TOP';
export const RECIEVE_TOP_TOP_TOP = 'RECIEVE_TOP_TOP_TOP';