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
  let id = event.id

  let data = await db.collection("moments").where({
    "_id": id
  }).field({
    picUrl: true
  }).get();

  let fileId = data.data[0].picUrl;

  await cloud.deleteFile({
    fileList: [fileId]
  })

  return await db.collection("moments").where({
    "_id": id
  }).remove()
}