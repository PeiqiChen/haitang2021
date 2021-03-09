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
  const wxContext = cloud.getWXContext()
  let openId = wxContext.OPENID;
  let count = event.count;

  return await db.collection("moments").where({
    comments: db.command.elemMatch({
      openId: openId
    })
  }).orderBy("time", "desc")
    .skip(count)
    .limit(10)
    .get()
}