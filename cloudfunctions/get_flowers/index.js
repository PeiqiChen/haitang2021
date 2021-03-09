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

  let num = await db.collection("flowers").where({
    name: type
  }).count();
  num = num.total;
  let total = Math.ceil(num / 100);
  let tasks = [];

  for (let i = 0 ; i < total ; i++){
    let onepiece = db.collection("flowers").where({
      name: type
    }).skip(i * 100).limit(100).get();
    tasks.push(onepiece);
  }
  
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg
    }
  })
}