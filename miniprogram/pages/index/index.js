//index.js
const app = getApp()

Page({
  data: {
    type: "未选择",
    markers: [{
      id: 1,
      longitude: 117.167947,
      latitude: 39.106324,
      url: "https://lv.nongbangzhu.cn/resources/image/81a29ee2-ae65-4112-9059-d1291ce7198c.jpg",
      iconPath: "/images/location.png",
      customCallout: {
        anchorY: 0,
        anchorX: 0,
        display: 'BYCLICK'
      },
      width: 30,
      height: 30,
      name: "鸡毛松",
    }, {
      id: 0,
      longitude: 117.174719,
      latitude: 39.113814,
      url: "https://lv.nongbangzhu.cn/resources/image/a702c840-a144-4174-b369-b49924329fd8.jpg",
      iconPath: "/images/location.png",
      customCallout: {
        anchorY: 0,
        anchorX: 0,
        display: 'BYCLICK'
      },
      width: 30,
      height: 30,
      name: "鸡毛松",
    }],
    customCalloutMarkerIds: [0, 1]
  },

  marketTap: function(e) {
    let id = e.markerId;
  },

  //拍照识别
  toCamera: function() {

  },

  //扫描二维码
  toScan: function() {

  },

  changePlant: function(e) {
    wx.navigateTo({
      url: '/pages/select_flower/select_flower',
    })
  },

  loadPlant: function(){
    let that = this;

    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({
      name: "get_flowers",
      data: {
        type: this.data.type
      },
      success: function(res){
        let origin = res.result.data;
        let ids = [];
        for (let i = 0 ; i < origin.length ; i++){
          origin[i].id = i;
          ids.push(i);
          origin[i].iconPath = "/images/location.png",
          origin[i].customCallout={
            anchorY: 0,
            anchorX: 0,
            display: 'BYCLICK'
          },
          origin[i].width = origin[i].height = 30;
          let pos = origin[i].pos.split(",");
          origin[i].longitude = +pos[0];
          origin[i].latitude = +pos[1];
          delete origin[i].pos;
        }

        that.setData({
          markers: origin,
          customCalloutMarkerIds: ids
        })
      },
      fail: function(err){
        wx.showToast({
          title: '网络错误，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
        console.log("get_flowers云函数调用失败", err.errMsg);
      },
      complete: function(){
        wx.hideLoading();
      }
    })
  },

  viewPic: function(e){
    let src = e.target.dataset.src;
    wx.previewImage({
      current: src, //当前显示的图片链接(多张预览中点击后显示的)
      urls: [src] //需要预览的图片连接（多张预览）
    })
  }
})