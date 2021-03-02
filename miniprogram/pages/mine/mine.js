// miniprogram/pages/mine/mine.js
const app = getApp();

Page({
  data: {
    hasLogged: false,
    nickName: null,
    avatarUrl: null
  },

  onLoad: function (options) {
    let that = this;

    wx.showLoading({
      title: '获取授权信息中...',
    })

    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']){//登陆过
          app.globalData.auth['scope.userInfo'] = true
          console.log("已授权");

          wx.getUserInfo({
            success: function(res){
              app.globalData.userInfo = res.userInfo;

              wx.cloud.callFunction({
                name: "update_users",
                data: {
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender
                },
                success: function(res){
                  app.globalData.openId = res.result.openId;
                  console.log("用户信息更新成功");

                  that.setData({
                    hasLogged: true,
                    nickName: app.globalData.userInfo.nickName,
                    avatarUrl: app.globalData.userInfo.avatarUrl
                  })
                },

                fail: function(err){
                  wx.showToast({
                    title: "更新用户信息失败，请检查你的网络状态",
                    duration: 1000,
                    icon: "none"
                  });
                  console.error("云函数update_userInfo调用失败", err.errMsg);
                }
              })
            },
            fail: function(err){
              wx.showToast({
                title: "获取用户信息失败，请检查你的网络状态",
                duration: 1000,
                icon: "none"
              });
              console.error("wx.getUserInfo调用失败", err.errMsg);
            }
          })
        }else{
          console.log("未授权");
        }
      },
      fail: function(err){
        wx.showToast({
          title: "请检查你的网络状态",
          duration: 1000,
          icon: "none"
        });
        console.error("wx.getSetting调用失败", err.errMsg);
      },
      complete: function(){
        wx.hideLoading();
      }
    })
  },

  getUserInfo: function(e){
    let that = this;

    if (e.detail.errMsg === "getUserInfo:ok") {
      let userInfo = e.detail.userInfo;

      //loading
      wx.showLoading({
        title: '获取中',
      })

      wx.cloud.callFunction({
        name: "update_users",
        data: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender
        },
        success: function (res) {
          //将用户信息存入全局变量

          if (res.openId === null) { //数据库出现错误
            console.error("数据库操作失败，请检查", res.log);
            wx.showToast({
              title: '数据库错误',
              icon: "none",
              duration: 1000
            })
            return;
          }

          //正常
          app.globalData.userInfo = userInfo;
          app.globalData.openId = res.result.openId;
          app.globalData.auth['scope.userInfo'] = true;
          console.log("授权成功");

          //跳转至主页面
          that.setData({
            hasLogged: true,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
          })
        },
        fail: function (err) {
          console.log("云函数create_user调用失败", err.errMsg);
        },
        complete: function () {
          wx.hideLoading(); //隐藏loading
        }
      })
    } else {
      console.log("用户拒绝了授权");
      wx.showToast({
        title: '拒绝授权无法登录',
        icon: 'none',
        duration: 1000
      })
    }
  },

  onShareAppMessage: function () {
    if (res.from == "button"){
      console.log(res.target)
    }

    return {
      title: '天大数字景观',
      path: '/pages/index/index',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: "none",
          duration: 1500
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          icon: "none",
          duration: 1500
        })
      }
    }
  }
})