// miniprogram/pages/mine/mine.js
const app = getApp();

Page({
  data: {
    hasLogged: false,
    nickName: null,
    avatarUrl: null
  },

  onLoad: function (options) {
    if (app.globalData.auth['scope.userInfo']){
      this.setData({
        hasLogged: true,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }
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
          console.log(app.globalData);

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

  toMyComment: function(){
    if (!app.globalData.auth['scope.userInfo']) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 2000
      })

      return false;
    }

    wx.navigateTo({
      url: '/pages/my_comment/my_comment',
    })
  },

  toMyTalk: function(){
    if (!app.globalData.auth['scope.userInfo']) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 2000
      })

      return false;
    }

    wx.navigateTo({
      url: '/pages/my_talk/my_talk',
    })
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