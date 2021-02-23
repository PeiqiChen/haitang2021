const util = require('../../utils/util.js')
Page({
  data: {
    plant: 'weed'
  },
  recognize(event){
    this.setData({
      plant:'apple blosome'
    });
    util.main()
  },

})