//index.js
const app = getApp()

Page({
  data: {
    types: ["1", "2", "3"],
    now: -1,
    type: "未选择"
  },

  onLoad: function(){
    //获取植物的类型：
  },

  //拍照识别
  toCamera: function(){

  },

  //扫描二维码
  toScan: function(){

  },

  changePlant: function(e){
    let newnum = e.detail.value;
    if (newnum === this.data.now){
      return;
    }else{
      this.setData({
        now: newnum,
        type: this.data.types[newnum]
      })
    }
  }
})
