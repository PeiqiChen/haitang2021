// miniprogram/pages/my_comment/my_comment.js
Page({


  data: {
    moments: [],
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({
      name: "get_my_comment",
      data: {
        count: 0
      },
      success: function (res) {
        console.log(res);
        let moments = res.result.data;
        if (moments.length === 0) {
          wx.showToast({
            title: '暂时还没有动态',
          })
        }

        that.changeDate(moments);
        that.setData({
          moments: moments,
          count: 10
        })
        wx.hideLoading();
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
        console.log(err.errMsg)
      }
    })
  },

  onShow: function(){
    this.onPullDownRefresh();
  },

  toDetail: function (e) {
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/talk_detail/talk_detail?id=' + id,
    })
  },

  changeDate: function (array) {
    for (let i = 0; i < array.length; i++) {
      let now = new Date(array[i].time);

      let newtime = {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMonth()
      }
      array[i].time = newtime;
    }

    return array;
  },


  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    let that = this;
    //下拉刷新新闻，当前类型，重新拉取前10个
    wx.showLoading({
      title: '刷新中',
    })

    wx.cloud.callFunction({
      name: "get_my_comment",
      data: {
        count: 0
      },
      success: function (res) {
        let moments = res.result.data;
        if (moments.length === 0) {
          wx.showToast({
            title: '暂时还没有动态',
          })
        }

        that.changeDate(moments);
        that.setData({
          moments: moments,
          count: 10
        })
        wx.hideLoading();
      },
      fail: function (err) {
        wx.hideLoading();
        console.log("get_news云函数调用失败", err.errMsg);
        wx.showToast({
          title: '拉取数据失败，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
      },
      complete: function () {
        wx.stopPullDownRefresh(); //停止下拉
      }
    })
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    let that = this;

    //上拉触底，如果获取到的数据为空，则代表没有更多内容了
    wx.showLoading({
      title: '加载中',
    })

    wx.cloud.callFunction({
      name: "get_my_comment",
      data: {
        count: that.data.count
      },
      success: function (res) {
        if (res.result.data.length === 0) {
          wx.showToast({
            title: '没有更多内容了',
            icon: 'none',
            duration: 1000
          })
        } else {
          //拼接新数据，注意不能直接在this.setData中拼接
          let newmoment = res.result.data;
          that.changeDate(newmoment);;
          let tempMoment = that.data.moments;
          let tempCount = that.data.count;

          tempMoment = tempMoment.concat(newmoment)
          tempCount += 10

          that.setData({
            moments: tempMoment,
            count: tempCount
          })
        }
        wx.hideLoading();
      },
      fail: function (err) {
        wx.hideLoading();
        console.log("get_news云函数调用失败", err.errMsg);
        wx.showToast({
          title: '拉取数据失败，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  onShareAppMessage: function () {
    if (res.from == "button") {
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