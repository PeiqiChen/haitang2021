//app.js
App({

  globalData: {
    openId: "",
    userInfo: {
      nickName: "",
      avatarUrl: ""
    },
    auth: {
      "scope.userInfo": false
    }
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'begonia-cup',
        traceUser: true,
      })
    }

    let that = this;

    wx.showLoading({
      title: '获取授权信息中...',
    })

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {//登陆过
          that.globalData.auth['scope.userInfo'] = true
          console.log("已授权");

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;

              wx.cloud.callFunction({
                name: "update_users",
                data: {
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender
                },
                success: function (res) {
                  that.globalData.openId = res.result.openId;
                  console.log("用户信息更新成功");
                },

                fail: function (err) {
                  wx.showToast({
                    title: "更新用户信息失败，请检查你的网络状态",
                    duration: 1000,
                    icon: "none"
                  });
                  console.error("云函数update_userInfo调用失败", err.errMsg);
                }
              })
            },
            fail: function (err) {
              wx.showToast({
                title: "获取用户信息失败，请检查你的网络状态",
                duration: 1000,
                icon: "none"
              });
              console.error("wx.getUserInfo调用失败", err.errMsg);
            }
          })
        } else {
          console.log("未授权");
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "请检查你的网络状态",
          duration: 1000,
          icon: "none"
        });
        console.error("wx.getSetting调用失败", err.errMsg);
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  onShow: function() {
    wx.loadFontFace({
      family: "siyuan",
      global: true,
      source: 'url("https://6265-begonia-cup-1304541542.tcb.qcloud.la/siyuan-font.ttf?sign=bc91016329da73075182937f5b0afd1d&t=1614321470")',
      success: () => {
        console.log("Font loaded successfully.")
      },
      fail: (err) => {
        console.log("Font loaded failed", err.errMsg);
      }
    })
  }
})
