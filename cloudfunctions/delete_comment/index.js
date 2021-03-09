const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true, //跟踪调用云函数的用户
  env: 'begonia-cup'//环境名称
})

const db = cloud.database({ //获取云数据库
  env: 'begonia-cup'
});

const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id;
  let index = event.index;

  let origin = await db.collection("moments").where({
    "_id": id
  }).get();

  origin = origin.data[0].comments;
  origin.splice(index, 1);

  return await db.collection("moments").where({
    "_id": id
  }).update({
    data: {
      numberOfComments: _.inc(-1),
      comments: origin
    }
  })
}