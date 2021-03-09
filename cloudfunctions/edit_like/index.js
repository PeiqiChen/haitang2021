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
  let type = event.type;
  let id = event.id;
  let openId = event.openId;

  let origin = await db.collection("moments").where({
    "_id": id
  }).get();

  let oldlike = origin.data[0].likes;
  let oldnum = origin.data[0].numberOfLikes;

  if (type === "add"){
    return await db.collection("moments").where({
      "_id": id
    }).update({
      data: {
        numberOfLikes: db.command.inc(1),
        likes: db.command.push(openId)
      }
    })
  }else{
    oldlike.splice(oldlike.indexOf(openId), 1);
    return await db.collection("moments").where({
      "_id": id
    }).update({
      data: {
        numberOfLikes: db.command.inc(-1),
        likes: oldlike
      }
    })
  }
}