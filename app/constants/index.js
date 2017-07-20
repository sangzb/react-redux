// 通用
const ENV = process.env.NODE_ENV || 'development';
export const YES = true;
export const NO = false;

// 接口地址
export const BASE_URI = ENV !== 'production' ? 'http://172.19.88.75:3004/wechat/' : 'http://www.bamaying.com/wechat/discussion/';

// 获取授权码
export const REQUEST_WECHAT_AUTHORIZE_URL = 'REQUEST_WECHAT_AUTHORIZE_URL';
export const RECIEVE_WECHAT_AUTHORIZE_URL = 'RECIEVE_WECHAT_AUTHORIZE_URL';

// 微信快捷登录
export const REQUEST_USER_SIGN_IN = 'REQUEST_USER_SIGN_IN';
export const RECIEVE_USER_SIGN_IN = 'RECIEVE_USER_SIGN_IN';

// 获取个人信息
export const REQUEST_FETCH_MY_INFO = 'REQUEST_FETCH_MY_INFO';
export const RECIEVE_FETCH_MY_INFO = 'RECIEVE_FETCH_MY_INFO';

// 用户登出
export const REQUEST_USER_SIGN_OUT = 'REQUEST_USER_SIGN_OUT';
export const RECIEVE_USER_SIGN_OUT = 'RECIEVE_USER_SIGN_OUT';

//获取用户信息
export const REQUEST_GET_USERINFO = 'REQUEST_GET_USERINFO';
export const RECIEVE_GET_USERINFO = 'RECIEVE_GET_USERINFO';

//获取主菜单
export const REQUEST_MAIN_MENU = 'REQUEST_MAIN_MENU';
export const RECIEVE_MAIN_MENU = 'RECIEVE_MAIN_MENU';

//获取主页kv
export const REQUEST_MAIN_KV = 'REQUEST_MAIN_KV';
export const RECIEVE_MAIN_KV = 'RECIEVE_MAIN_KV';

//获取主页导航
export const REQUEST_MAIN_NAV = 'REQUEST_MAIN_NAV';
export const RECIEVE_MAIN_NAV = 'RECIEVE_MAIN_NAV';

//获取闪购
export const REQUEST_FLASH_SOLD = 'REQUEST_FLASH_SOLD';
export const RECIEVE_FLASH_SOLD = 'RECIEVE_FLASH_SOLD';

//获取全部文章
export const REQUEST_BMY_ARTICLES = 'REQUEST_BMY_ARTICLES';
export const RECIEVE_BMY_ARTICLES = 'RECIEVE_BMY_ARTICLES';

//获取标签
export const REQUEST_BMY_TAGS = 'REQUEST_BMY_TAGS';
export const RECIEVE_BMY_TAGS = 'RECIEVE_BMY_TAGS';

//获取标签集合
export const REQUEST_GET_SUBTAGS = 'REQUEST_GET_SUBTAGS';
export const RECIEVE_GET_SUBTAGS = 'RECIEVE_GET_SUBTAGS';

//获取标签
export const REQUEST_BMY_CATEGORY_ARTICLES = 'REQUEST_BMY_CATEGORY_ARTICLES';
export const RECIEVE_BMY_CATEGORY_ARTICLES = 'RECIEVE_BMY_CATEGORY_ARTICLES';

//文章详情
export const REQUEST_BMY_ARTICLE_DETAIL = 'REQUEST_BMY_ARTICLE_DETAIL';
export const RECIEVE_BMY_ARTICLE_DETAIL = 'RECIEVE_BMY_ARTICLE_DETAIL';



//测试dispatch
export const TEST_DISPATCH = 'TEST_DISPATCH';