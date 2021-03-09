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
  let content = event.content;
  let imgId = event.imgId;
  let avatarUrl = event.avatarUrl;
  let nickName = event.nickName;
  let openId = event.openId;
  let time = event.date;

  return await db.collection("moments").add({
    data: {
      openId: openId,
      picUrl: imgId,
      time: time,
      avatarUrl: avatarUrl,
      nickName: nickName,
      content: content,
      numberOfLikes: 0,
      numberOfComments: 0,
      likes: [],
      comments: []
    }
  })
}