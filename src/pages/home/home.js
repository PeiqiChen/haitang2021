const app = getApp();
Page({
  data: {
    name: '张三',
    now: app.globalData.now,
  },
  buttonHandler(event) {
    const that = this;
    wx.showModal({
      title: 'confirm',
      content:'are you sure?',
      success(res){
        if(res.confirm){
          that.setData({
            name: 'Lisi'
          },function(){
            wx.showToast({
              title:'done',
              duration:700
            });
          });
        }else if(res.cancel){
          console.log('user cancel.')
        }
      }
    })

  }
});