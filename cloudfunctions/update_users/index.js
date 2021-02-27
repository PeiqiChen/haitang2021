// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true, //跟踪调用云函数的用户
  env: 'begonia-cup'//环境名称
})

const db = cloud.database({ //获取云数据库
  env: 'begonia-cup'
});

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let openid = wxContext.OPENID;

  //首先判断用户信息是否存在，OPENID为唯一标识符
  let count = await db.collection("users").where({
    openId: openid
  }).count();

  let success = null; //操作执行是否成功
  let log = null; //存储错误信息

  if (count.total === 0) { //不存在，新建用户信息
    await db.collection("users").add({
      data: {
        openId: openid,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        gender: event.gender,
        comments: [],
        moments: []
      }
    }).then(() => {
      success = true;
    }).catch((err) => {
      success = false;
      log = err.errMsg;
    })
  } else { //存在，更新已有信息
    await db.collection("users").where({
      openId: openid
    }).update({
      data: {
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        gender: event.gender
      }
    }).then(() => {
      success = true;
    }).catch((err) => {
      success = false;
      log = err.errMsg;
    })
  }

  if (success) {
    return {
      openId: openid,
      log: "ok"
    };
  } else {
    return {
      openId: openid,
      log: log
    };
  }
}