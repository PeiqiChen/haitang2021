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
  let id = event.id;
  let content = event.content;
  let openId = event.openId;
  let ok = true;

  const res = await cloud.openapi.security.msgSecCheck({
    content: content
  }).catch(err => {
    ok = false;
  })

  if (!ok){
    return {
      ok: false
    }
  }

  let userinfo = await db.collection("users").where({
    openId: openId
  }).get();

  let newcomment = {
    avatarUrl: userinfo.data[0].avatarUrl,
    nickName: userinfo.data[0].nickName,
    openId: openId,
    content: content
  }

  return await db.collection("moments").where({
    "_id": id
  }).update({
    data: {
      numberOfComments: db.command.inc(1),
      comments: db.command.push(newcomment)
    }
  })
}