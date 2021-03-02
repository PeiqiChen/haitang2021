// miniprogram/pages/talk_detail/talk_detail.js
const app = getApp();
let t = new Date();
Page({
  data: {
    newData: {
      avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/P5koHWGR9N0GqRF3MibGowpTtNjjA7xxf435Fot1ajIh96F7gsqhe0wpy6ZhGu3lKBI0buqiaaVMbqia5dZ2bapPw/132",
      nickName: "Curiosity",
      content: "这是一条动态的文字内容，不会超过150字，这是一条动态的文字内容，不会超过150字，这是一条动态的文字内容，不会超过150字，这是一条动态的文字内容，不会超过150字，这是一条动态的文字内容，不会超过150字。",
      numberOfLikes: 1,
      numberOfComments: 1,
      picUrl: "https://lv.nongbangzhu.cn/resources/image/a702c840-a144-4174-b369-b49924329fd8.jpg",
      time: {
        year: 2021,
        month: 2,
        day: 28,
        hour: 22,
        minute: 2
      },
      openId: "ocyRs5LUzj3vXD_bV0dJRuFQzkr8",
      likes: ["ocyRs5LUzj3vXD_bV0dJRuFQzkr8"],
      comments: [{
        avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/P5koHWGR9N0GqRF3MibGowpTtNjjA7xxf435Fot1ajIh96F7gsqhe0wpy6ZhGu3lKBI0buqiaaVMbqia5dZ2bapPw/132",
        content: "真好看真不错666真好看真不错666真好看真不错666真好看真不错666",
        nickName: "Curiosity",
        openId: "ocyRs5LUzj3vXD_bV0dJRuFQzkr8"
      }]
    }, //数据
    openId: "ocyRs5LUzj3vXD_bV0dJRuFQzkr8",
    avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/P5koHWGR9N0GqRF3MibGowpTtNjjA7xxf435Fot1ajIh96F7gsqhe0wpy6ZhGu3lKBI0buqiaaVMbqia5dZ2bapPw/132", //用户头像URL
    youLike: true, //用户是否点赞
    commentValue: ""
  },

  onLoad: function (options) {
    let that = this;
   
    let id = options.id;
    let tempLike = false;
    //从数据库拉取该新闻的全部信息，再拉取评论对应的用户信息
    //使用Promise风格
    wx.cloud.callFunction({
      name: "get_detail",
      data: {
        id: id
      }
    }).then(res => {
      //判断用户是否点过赞
      if (res.result.data[0].likes.indexOf(app.globalData.openId) !== -1) {
        tempLike = true;
      }

      that.setData({
        newData: res.result.data[0],
        avatarUrl: app.globalData.userInfo.avatarUrl,
        youLike: tempLike
      })
    }).catch(err => {
      console.error("get_detail云函数调用失败", err.errMsg);
      wx.showToast({
        title: '获取信息失败，请检查你的网络设置',
        icon: 'none',
        duration: 1000
      })
    })
  },

  viewImage: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, //当前显示的图片链接(多张预览中点击后显示的)
      urls: [src] //需要预览的图片连接（多张预览）
    })
  },

  //点赞or取消点赞
  like: function () {
    let that = this;
    let tempData = this.data.newData;

    if (this.data.youLike) {
      tempData.numberOfLikes--;
      tempData.likes.splice(tempData.likes.indexOf(app.globalData.openId), 1);
      this.setData({
        newData: tempData,
        youLike: false
      }, () => {
        wx.cloud.callFunction({
          name: "change_like",
          data: {
            id: that.data.newData["_id"],
            like: true
          }
        }).then(() => {
          wx.showToast({
            title: '取消赞成功',
            duration: 1000
          })
        }).catch((err) => {
          console.error("change_like云函数调用失败", err.errMsg)
          wx.showToast({
            title: '取消赞失败，请检查你的网络设置',
            icon: 'none',
            duration: 1000
          })
        })
      })
    } else {
      tempData.numberOfLikes++;
      tempData.likes.push(app.globalData.openId);
      this.setData({
        newData: tempData,
        youLike: true
      }, () => {
        wx.cloud.callFunction({
          name: "change_like",
          data: {
            id: that.data.newData["_id"],
            like: false
          }
        }).then(() => {
          wx.showToast({
            title: '赞成功',
            duration: 1000
          })
        }).catch((err) => {
          console.error("change_like云函数调用失败", err.errMsg)
          wx.showToast({
            title: '赞失败，请检查你的网络设置',
            icon: 'none',
            duration: 1000
          })
        })
      })
    }
  },

  add_comment: function (e) {
    let that = this;
    let new_comment = e.detail.value;
    let tempData = this.data.newData;

    tempData.comments.push({
      "openId": app.globalData.openId,
      "nickName": app.globalData.userInfo.nickName,
      "avatarUrl": app.globalData.userInfo.avatarUrl,
      "content": new_comment
    })

    tempData.numberOfComments++;

    this.setData({
      newData: tempData,
      commentValue: "" //清空输入框
    }, () => {
      wx.cloud.callFunction({
        name: "add_comment",
        data: {
          id: that.data.newData["_id"],
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          content: new_comment
        }
      }).then(() => {
        wx.showToast({
          title: '评论成功',
          duration: 1000
        })
      }).catch(() => {
        console.error("add_comment云函数调用失败", err.errMsg)
        wx.showToast({
          title: '评论失败，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
      })
    })
  },

  deleteComment: function(e){

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(this.data.newData)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.newData.title,
      path: '/pages/login/login', //注意防止用户跳过登录
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