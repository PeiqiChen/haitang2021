//app.js
App({

  globalData: {
    openId: null,
    userInfo: null,
    auth: {
      userInfo: null
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
