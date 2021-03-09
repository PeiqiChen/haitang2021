// miniprogram/pages/add_talk/add_talk.js
const app = getApp();
const defaultImg = "https://6265-begonia-cup-1304541542.tcb.qcloud.la/image.jpg?sign=9b01f1e16e35af750e10fc648cfae25d&t=1614738974";
const defaultId = "cloud://begonia-cup.6265-begonia-cup-1304541542/image.jpg";

Page({
  data: {
    date: null,
    imgUrl: defaultImg,
    hasUpload: false
  },

  onLoad: function (options) {
    let date = new Date();
    this.setData({
      date: date
    })
  },

  upload: function(){
    let that = this;
    wx.showToast({
      title: '建议选择4M以下的照片',
      icon: 'none',
      duration: 2000
    })

    if (this.data.hasUpload) {
      wx.showModal({
        title: '提示',
        content: '图片已存在，是否替换',
        success: function (res) {
          if (res.confirm) { //点击确定
            chooseImg();
          } else {
            return false;
          }
        }
      })
    } else {
      chooseImg();
    }

    //这是个闭包
    function chooseImg() {
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"], 
        success: function (res) {
          //临时URL
          let newImage = res.tempFilePaths[0];
          wx.showLoading({
            title: '图片审核中',
          })
          
          //压缩图片
          wx.compressImage({
            src: newImage,
            quality: 1,
            success: function (res) {
              wx.getFileSystemManager().readFile({
                filePath: res.tempFilePath,
                success: function (res) {
                  let value = wx.arrayBufferToBase64(res.data)
                  if (value.length > 500000) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '图片大小过大或尺寸过大，请更换图片',
                      icon: 'none',
                      duration: 2000
                    })
                    return false;
                  }

                  wx.cloud.callFunction({
                    name: "check_img",
                    data: {
                      value: wx.arrayBufferToBase64(res.data)
                    },
                    success: res => {
                      if (res.result.errCode === 87014) {
                        wx.hideLoading();
                        wx.showToast({
                          title: '审核未通过，请更换图片',
                          icon: 'none',
                          duration: 2000
                        })
                      } else {
                        wx.hideLoading();
                        that.setData({
                          imgUrl: newImage,
                          hasUpload: true
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },

  cancel: function(){
    let that = this;

    if (this.data.hasUpload) {
      wx.showModal({
        title: '提示',
        content: '删除图片吗',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              imgUrl: defaultImg,
              hasUpload: false
            })
          } else {
            return false;
          }
        }
      })
    }
  },

  newSubmit: function(e){
    let that = this;
    let content = e.detail.value.content;
    let cloudId = defaultId;
    
    if (content === "" && !this.data.hasUpload){
      wx.showToast({
        title: '内容和图片不能都为空',
        icon: 'none',
        duration: 2000
      })

      return false;
    }

    wx.showLoading({
      title: '请稍后',
    })

    if (content !== ""){
      wx.cloud.callFunction({
        name: "text_check",
        data: {
          content: content
        }
      }).then(res => {
        if (res.result.ok) {
          if (that.data.hasUpload) {
            upload();
          } else {
            create();
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '内容含有敏感词汇',
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(err => {
        wx.showToast({
          title: '网络错误，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
        wx.hideLoading();
        console.log(err.errMsg);
      })
    }else{
      upload();
    }

    function upload(){
      let date = that.data.date;
      wx.cloud.uploadFile({
        cloudPath: "user/" + app.globalData.openId + "-" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + ".jpg",
        filePath: that.data.imgUrl,
        success: function (res) {
          cloudId = res.fileID;
          create();
        },
        fail: function (err) {
          console.log("图片上传失败", err.errMsg);
          wx.showToast({
            title: '图片上传失败，请检查你的网络设置',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }

    function create(){
      wx.cloud.callFunction({
        name: "add_moment",
        data: {
          content: content,
          imgId: cloudId,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          nickName: app.globalData.userInfo.nickName,
          openId: app.globalData.openId,
          date: that.data.date
        },
        success: function(res){
          wx.hideLoading();
          wx.showToast({
            title: '发布成功',
          })

          wx.navigateBack({
            delta: 1
          })
        },
        fail: function(err){
          wx.hideLoading();
          console.log(err.errMsg);
          wx.showToast({
            title: "网络错误，请检查您的网络设置",
            icon: "none",
            duration: 1000
          })
        }
      })
    } 
  }
})