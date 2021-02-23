const APP_CODE="e56feede0d3c4c08addf2ddd8a4fb2ea"
const BASE_URL="https://plant.market.alicloudapi.com/"
// const BASE_URL = "https://plantgw.nongbangzhu.cn/"

const fs = wx.getFileSystemManager()//require('./fs.js');
// var request = require('request');
function main() {
  console.log("main!")
  // recognize2();
  // info();
  weed();
  // console.log(res1,res2,res3);
}

/**
 * 植物花卉识别接口_v2 的请求示例
 */
function recognize2() {
  //先准备数据
  var img_base64 = base64_encode('/data/img4.jpg');
  // console.log(img_base64)
  var apiContextUrl = 'plant/recognize2';

  var formData = {
      img_base64: img_base64
  };

  res = post(apiContextUrl, formData);
  // console.log(res)
  return res;
}

/**
 * 植物百科信息获取
 */
function info() {
  //先准备数据
  var code = "CwZ0AVGtMcl5LJom"; //这个植物代号是调用 recognize2()接口可获得的InfoCode字段
  var apiContextUrl = 'plant/info';

  var formData = {
      code: code
  };

  info = post(apiContextUrl, formData);
  return info;
}

/**
* 常见杂草识别
*/
function weed() {
  //先准备数据
  var img_base64 = base64_encode('/data/weed.jpg');
  var apiContextUrl = 'plant/recognize_weed';

  var formData = {
      img_base64: img_base64
  };

  res = post(apiContextUrl, formData);
  return res;
}

function post(apiContextUrl, formData) {
  var opts = {
      url: BASE_URL + apiContextUrl,
      headers: {
          'Authorization': 'APPCODE ' + APP_CODE
      },
      form: formData
  };


        wx.request({
          url : opts.url,
          method: "POST",
          header: {
            "Authorization": 'APPCODE ' + APP_CODE,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);
            console.log('success!')
            return res
            // wx.navigateBack({
            //   delta: 1  //小程序关闭当前页面返回上一页面
            // })
            wx.showToast({
              title: '评教成功！',
              icon: 'success',
              duration: 2000
            })
          },
        })
}

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  let base64 = wx.getFileSystemManager().readFileSync(file, "base64")
  return base64;
}


module.exports = {
  main,
  recognize2,
  info,
  weed,
  // post,
  // base64_encode
}