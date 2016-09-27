import apiAction from './apiAction' ;
const backfireUri = (process.env.NODE_ENV === 'development' ? 'http://ox.bamaying.com:3300/' : 'http://api.bamaying.com/v2/');
const choasUri = (process.env.NODE_ENV === 'development' ? 'http://ox.bamaying.com:2000/' : 'http://chaos.bamaying.com/');
// 用户登录
export const userSignIn = apiAction({
  method: 'post',
  url: '/sign_in',
  state: 'USER_SIGN_IN'
});

export const wechatAuthorizeUrl = apiAction({
  method: 'post',
  url: '/authorize_url',
  state: 'WECHAT_AUTHORIZE_URL'
});

// 获取个人信息
export const fetchMyInfo = apiAction({
  method: 'get',
  url: '/admin_users/me',
  state: 'FETCH_MY_INFO',
  formatter: 'backfire'
});

// 用户登出
export const userSignOut = apiAction({
  method: 'delete',
  url: '/admin_users/sign_out',
  state: 'USER_SIGN_OUT'
});

// 获取轮播图
export const getCarousel = apiAction({
  method: 'get',
  url: '/actions',
  state: 'GET_CAROUSEL'
});


//上传文件
export const uploadFile = apiAction({
  method: 'post',
  url: (backfireUri + 'stars/upload/post'),
  state: 'FILE_UPLOAD',
  formatter: 'backfire'
});

//上传匿名图片
export const uploadAnonymousAvatar = apiAction({
  method: 'post',
  url: (`${choasUri}stars/upload/posts`),
  state: 'UPLOAD_ANONYMOUS_AVATAR',
  formatter: 'backfire'
});

//获取用户信息
export const getUserInfo = apiAction({
  method: 'get',
  url: `${choasUri}stars/profile`,
  state: 'GET_USERINFO',
  formatter: 'backfire'
});

//设置匿名头像名称
export const setUserInfo = apiAction({
  method: 'post',
  url: `${choasUri}stars/profile`,
  state: 'SET_USERINFO',
  formatter: 'backfire'
});
//刷新头像昵称
export const refreshUserInfo = function(incognito) {
  return {
    type: 'REFRESH_USER_INFO',
    incognito
  };
};

//获取求助列表
export const getRequestList = function(url) {
  return apiAction({
    method: 'get',
    url: url ? url : `${backfireUri}discussions`,
    state: 'GET_REQUEST_LIST',
    formatter: 'backfire'
  });
};
//获取快速回复列表
export const getQuickAnsereList = function(url) {
  return apiAction({
    method: 'get',
    url: url ? url : `${backfireUri}discussions/nocomment`,
    state: 'GET_QUICKANSWER_LIST',
    formatter: 'backfire'
  });
};
//刷新快速回复列表
export const refreshQucickAnswerList = function(discussionID) {
  return {
    type: 'REFRESH_QUICKANSWER_LIST',
    discussionID
  };
};
//设置页面scroll
export const setListPageScroll = function(scroll) {
  return {
    type: 'SET_LISTPAGR_SCROLL',
    scroll
  };
};

//获取个人求助列表
export const getOwnerRequestLst = function(url) {
  return apiAction({
    method: 'get',
    url: url ? url : `${backfireUri}discussions/posted`,
    state: 'GET_OWNER_REQUEST_LIST',
    formatter: 'backfire'
  });
};

//删除发帖
export const deletePost = function(id) {
  return apiAction({
    method: 'delete',
    url: `${backfireUri}discussion/${id}`,
    state: 'DELETE_USER_DISCUSSION'
  });
};

//删除回复
export const deleteComment = function(id) {
  return apiAction({
    method: 'delete',
    url: `${backfireUri}comment/${id}`,
    state: 'DELETE_UESR_COMMENT'
  });
};

//列表喜欢
export const questionListFavor = function(type) {
  return apiAction({
    method: type,
    url: (backfireUri + 'likes'),
    state: 'QUESTION_LIST_FAVOR',
    formatter: 'backfire'
  });
};
//获取他人求助列表
export const getOthersRequestList = function(uid) {
  return apiAction({
    method: 'get',
    url: `${backfireUri}discussions/${uid}/posted`,
    state: 'GET_OTHERS_REQUEST_LIST',
    formatter: 'backfire'
  });
};
//填充求助列表数据
export const pushRequestList = function(lists, tabtype) {
  return {
    type: 'ADD_REQUEST_LIST',
    lists,
    tabtype
  };
};
//清空列表数据
export const clearRequestList = function() {
  return {
    type: 'CLEAR_REQUEST_LIST'
  };
};
//设置更多请求连接
export const addMoreLink = function(moreLink) {
  return {
    type: 'SET_MORE_LINK',
    moreLink
  };
};
//获取求助帖回答
export const getRequestAnswers = function(url) {
  return apiAction({
    method: 'get',
    url: (backfireUri + url),
    state: 'GET_REQUEST_ANSWER',
    formatter: 'backfire'
  });
};

//获取求助
export const getRequestItem = function(id) {
  return apiAction({
    method: 'get',
    url: `${backfireUri}discussion/${id}`,
    state: 'GET_REQUEST_BYID',
    formatter: 'backfire'
  });
};

//添加上传图片
export const addUpdatePicutre = function(data) {
  return {
    type: 'ADD_UPDATE_PICTRUE',
    actionType: 'add',
    data
  };
};

//添加上传图片
export const removeUpdatePicutre = function(pid) {
  return {
    type: 'REMOVE_UPDATE_PICTRUE',
    actionType: 'remove',
    pid
  };
};

//移除所有图片
export const clearPicutre = function() {
  return {
    type: 'REMOVE_ALL_PICTRUE'
  };
};

//提交求助帖回答
export const postAnswerContent = function(qid) {
  return apiAction({
    method: 'post',
    url: `${backfireUri}discussion/${qid}/comments`,
    state: 'ANSWER_CONTENT',
    formatter: 'backfire'
  });
};

//提交新求助,吐槽帖
export const postRequestContent = apiAction({
  method: 'post',
  url: `${backfireUri}discussions`,
  state: 'QUESTION_CONTENT',
  formatter: 'backfire'
});

//记录标题
export const titleHistory = function(param) {
  return {
    type: 'FORM_TITLE_HISTORY',
    param
  };
};

//记录内容
export const contentHistory = function(param) {
  return {
    type: 'FORM_CONTENT_HISTORY',
    param
  };
};

//重置记录
export const resetHistory = function(cate) {
  return {
    type: 'FORM_RESET_HISTORY',
    cate
  };
};

//设置当前评论
export const setCurrentComment =  function(comment) {
  return {
    type: 'SET_CURRENT_COMMENT',
    comment
  };
};

//更新回答数量
export const setAnswerAmount = function(qid) {
  return {
    type: 'SET_ANSWER_AMOUNT',
    discussionID: qid
  };
};

//喜欢
export const requestFavor = function(type) {
  return apiAction({
    method: type,
    url: (backfireUri + 'likes'),
    state: 'QUESTION_FAVOR',
    formatter: 'backfire'
  });
};

//赞
export const commentLike = apiAction({
  method: 'post',
  url: (backfireUri + 'likes'),
  state: 'COMMENT_LIKE',
  formatter: 'backfire'
});

//踩
export const commentUnlike = apiAction({
  method: 'post',
  url: (backfireUri + 'dislikes'),
  state: 'COMMENT_UNLIKE',
  formatter: 'backfire'
});

//清除求助列表
export const removeUserQuestionList = function() {
  return {
    type: 'REMOVE_USER_QUESTIONS_LIST'
  };
};
//清除喜欢列表
export const removeUserLikedList = function() {
  return {
    type: 'REMOVE_USER_LIKED_LIST'
  };
};
//清除回答列表
export const removeUserAnsweredList = function() {
  return {
    type: 'REMOVE_USER_ANSWERED_LIST'
  };
};
//获取用户喜欢
export const getOwnerLikedList = function(url) {
  return apiAction({
    method: 'get',
    url: url ? url : (backfireUri + 'likes/'),
    state: 'GET_OWNER_LIKED_LIST',
    formatter: 'backfire'
  });
};
//用户列表删除喜欢
export const userDeleteFavor = apiAction({
  method: 'delete',
  url: (backfireUri + 'likes'),
  state: 'USER_DELETE_FAVOR',
  formatter: 'backfire'
});
//获取用户回答
export const getOwnerAnsweredList = function(url) {
  return apiAction({
    method: 'get',
    url: url ? url : `${backfireUri}comments/posted`,
    state: 'GET_OWNER_ANSWERED_LIST',
    formatter: 'backfire'
  });
};

//获取帮助达人列表
export const getHelperRank = apiAction({
  method: 'get',
  url: `${backfireUri}users/top/respondent`,
  state: 'HELPER_RANK_LIST',
  formatter: 'backfire'
});

//获取所有标签
export const getTags = apiAction({
  method: 'get',
  url: `${backfireUri}tags`,
  state: 'GET_TAGS',
  formatter: 'backfire'
});

//设置标签状态
export const tagPermission = function(tagState) {
  return {
    type: 'TAG_PERMISSION',
    permission: tagState
  };
};

//设置选择的标签
export const tagChoice = function(tag) {
  return {
    type: 'TAG_CHOICE',
    tag
  };
};

//清空标签
export const removeTagChoice = function() {
  return {
    type: 'REMOVE_TAG_CHOICE'
  };
};

//temp
export const toptop = apiAction({
  method: 'post',
  url: `${backfireUri}discussion/517/top`,
  state: 'TOP_TOP_TOP',
  formatter: 'backfire'
});