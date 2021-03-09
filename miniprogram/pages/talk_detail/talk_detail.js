// miniprogram/pages/talk_detail/talk_detail.js
const app = getApp();
const defaultUrl = "https://6265-begonia-cup-1304541542.tcb.qcloud.la/image.jpg?sign=9b01f1e16e35af750e10fc648cfae25d&t=1614738974"

Page({
  data: {
    openId: "",
    avatarUrl: "", //用户头像URL
    youLike: true, //用户是否点赞
    changeLike: false,
    newData: {},
    commentValue: "", //输入框中的值
    errorImage: []
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
   
    let id = options.id;
    let tempLike = false;
    //从数据库拉取该新闻的全部信息
    //使用Promise风格
    wx.cloud.callFunction({
      name: "get_detail",
      data: {
        id: id
      },
      success: function(res){
        let likes = res.result.data[0].likes;
        if (likes.indexOf(app.globalData.openId) > -1) {
          tempLike = true;
        }

        let now = new Date(res.result.data[0].time);
        
        let time = {
          year: now.getFullYear(),
          month: now.getMonth(),
          day: now.getDate(),
          hour: now.getHours(),
          minute: now.getMonth()
        };
        res.result.data[0].time = time;

        that.setData({
          openId: app.globalData.openId,
          newData: res.result.data[0],
          avatarUrl: app.globalData.userInfo.avatarUrl,
          youLike: tempLike
        })
      },
      fail: function(err){
        console.log("get_detail云函数调用失败", err.errMsg);
        wx.showToast({
          title: '获取信息失败，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
      },
      complete: function(){
        wx.hideLoading();
      }
    })
  },

  onUnload:function(){
    if (this.data.changeLike){
      wx.cloud.callFunction({
        name: "edit_like",
        data: {
          type: this.data.youLike ? "add" : "not",
          openId: app.globalData.openId,
          id: this.data.newData["_id"]
        },
        fail: function(err){
          wx.showToast({
            title: '网络错误，请检查你的网络设置',
            icon: 'none'
          })
          console.log(err.errMsg);
        }
      })
    }
  },

  viewImage: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, //当前显示的图片链接(多张预览中点击后显示的)
      urls: [src] //需要预览的图片连接（多张预览）
    })
  },

  changeDefault: function(e){
    let index = e.target.dataset.index;
    let oldData = this.data.newData;
    oldData.comments[index].avatarUrl = defaultUrl;
    this.setData({
      newData: oldData
    })
  },

  //点赞or取消点赞
  like: function () {
    let temp = this.data.newData;
    if (this.data.youLike){
      temp.numberOfLikes--;
    }else{
      temp.numberOfLikes++;
    }

    this.setData({
      youLike: !this.data.youLike,
      changeLike: !this.data.changeLike,
      newData: temp
    })
  },

  add_comment: function (e) {
    wx.showLoading({
      title: '请稍后...',
    })

    let that = this;
    let new_comment = e.detail.value;
    let tempData = this.data.newData;

    wx.cloud.callFunction({
      name: "add_comment",
      data: {
        id: that.data.newData["_id"],
        openId: that.data.openId,
        content: new_comment
      },
      success: function(res){
        console.log(res);
        if (res.result.ok !== undefined){
          wx.showToast({
            title: '评论失败，含有敏感词汇',
            icon: "none"
          })
        }else{
          tempData.comments.push({
            "openId": app.globalData.openId,
            "nickName": app.globalData.userInfo.nickName,
            "avatarUrl": app.globalData.userInfo.avatarUrl,
            "content": new_comment
          })
          wx.hideLoading();
          tempData.numberOfComments++;

          that.setData({
            newData: tempData,
            commentValue: "" //清空输入框
          })
        }
      },
      fail: function(err){
        wx.hideLoading();
        console.log("add_comment云函数调用失败", err.errMsg)
        wx.showToast({
          title: '评论失败，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  deleteComment: function(e){
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: (res => {
        if (res.cancel){
          return;
        }else{
          wx.showLoading({
            title: '请稍后',
          })

          let that = this;
          let index = e.target.dataset.id;
          let content = this.data.newData.comments[index].content;
          let origin = this.data.newData;

          wx.cloud.callFunction({
            name: "delete_comment",
            data: {
              id: this.data.newData["_id"],
              index: index
            },
            success: function (res) {
              wx.showToast({
                title: '删除成功',
              })
              origin.numberOfComments--;
              origin.comments.splice(index, 1);
              that.setData({
                newData: origin
              })
            },
            fail: function (err) {
              wx.showToast({
                title: '删除失败，请检查你的网络设置',
                icon: 'none',
                duration: 1000
              })
              console.log(err.errMsg);
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        }
      })
    })

  },

  deleteMoment: function(){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除本条动态吗？',
      success: function(res){
        if (res.confirm){
          wx.showLoading({
            title: '删除中',
          })

          wx.cloud.callFunction({
            name: "delete_moment",
            data: {
              id: that.data.newData["_id"]
            },
            success: function(res){
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              })
            },
            fail: function(err){
              wx.hideLoading();
              console.log(err.errMsg);
              wx.showToast({
                title: '网络错误，请检查你的网络设置',
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    })
  },

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