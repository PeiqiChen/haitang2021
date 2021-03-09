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
  try {
    const res = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: Buffer.from(event.value, "base64")
      }
    })

    return res;
  } catch (err) {
    return err;
  }
}