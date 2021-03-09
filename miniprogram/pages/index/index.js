//index.js
const app = getApp()

Page({
  data: {
    type: "未选择",
    markers: [],
    customCalloutMarkerIds: [],
    height: 0,
  },

  onLoad: function(){
    let that = this;

    //获取屏幕高度
    wx.getSystemInfo({
      success: function(res) {
        let height = res.windowHeight;
        let width = res.windowWidth;
        height = (800 * height / width) - 300;

        that.setData({
          height: height
        })
      },
    })
  },

  //关闭事件
  _success() {
    console.log('你点击了关闭');
    this.popup.hidePopup();
  },

  _tree_success() {
    console.log('你点击了关闭');
    this.tree_popup.hidePopup();
  },

  //拍照识别
  toCamera: function() {
    //获得popup组件
    var this_ = this;
    this_.popup = this_.selectComponent("#popup");
    var APP_CODE = "ab1ba98f2abe48768d95672761200ca1";
    var BASE_URL = "https://plant.market.alicloudapi.com/";
    wx.chooseImage({
      // 默认9
      count: 1,
      // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempPath = res.tempFilePaths[0];
        // 图片的base64值的处理
        var base64 = wx.getFileSystemManager().readFileSync(tempPath, 'base64');
        // 提示
        wx.showLoading({
          title: '图像检测中...',
          mask: true
        });
        wx.request({
          url: BASE_URL + 'plant/recognize2',
          data: {
            img_base64: base64,
            image_type: 'BASE64'
          },
          method: 'POST',
          header: {
            'Authorization': 'APPCODE ' + APP_CODE,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success(res) {
            if (res.statusCode == 200) {
              var Result = res.data.Result;
              // console.log(Result);
              // 隐藏加载窗口
              wx.hideLoading();
              console.log(Result[0])
              // 前端显示识别结果
              this_.popup.setData({
                'hyyy': JSON.stringify(Result[0].hyyy).replace(/"/g, ''),
                'aliasName': JSON.stringify(Result[0].AliasName).replace(/"/g, ''),
                'family': JSON.stringify(Result[0].Family).replace(/"/g, ''),
                'genus': JSON.stringify(Result[0].Genus).replace(/"/g, ''),
                // 'imageUrl':JSON.stringify(Result[0].ImageUrl),
                'latinName': JSON.stringify(Result[0].LatinName).replace(/"/g, ''),
                'name': JSON.stringify(Result[0].Name).replace(/"/g, ''),
                'score': JSON.stringify(Result[0].Score).replace(/"/g, '')
              });
              this_.popup.showPopup();
            } else {
              wx.showToast({
                title: '检测失败 ' + res.statusCode,
                icon: 'loading',
                duration: 3000
              });
            }
          }
        });
      }
    });
  },

  //扫描二维码
  toScan: function() {
    //获得tree_popup组件
    var this_ = this;
    this_.tree_popup = this_.selectComponent("#tree_popup");
    console.log(this_.tree_popup)

    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        
        wx.cloud.callFunction({
          name: 'get_tree',
          data: {
            name:res.result
          },
          complete: data => {
            console.log('get_tree'+data)
            let tree = [{"description":"榆叶梅（学名：Amygdalus triloba），又叫小桃红，因其叶片像榆树叶，花朵酷似梅花而得名。为灌木稀小乔木，高2-3米；枝条开展，具多数短小枝；小枝灰色，一年生枝灰褐色，无毛或幼时微被短柔毛；冬芽短小，长2-3毫米。枝紫褐色，叶宽椭圆形至倒卵形，先端3裂状，缘有不等的粗重锯齿；花单瓣至重瓣，紫红色，1～2朵生于叶腋，花期4月；核果红色，近球形，有毛。榆叶梅在中国已有数百年栽培历史，全国各地多数公园内均有栽植。本种开花早，主要供观赏，常见栽培类型有重瓣榆叶梅（花重瓣，粉红色；萼片通常10枚）、鸾枝（花瓣与萼片各10枚，花粉红色；叶片下面无毛）。",
            "env":"喜光，稍耐阴，耐寒，能在-35℃下越冬。对土壤要求不严，以中性至微碱性而肥沃土壤为佳。根系发达，耐旱力强。不耐涝。抗病力强。生于低至中海拔的坡地或沟旁乔、灌木林下或林缘。",
            "area":"产黑龙江、吉林、辽宁、内蒙古、河北、山西、陕西、甘肃、山东、江西、江苏、浙江等省区。中国各地多数公园内均有栽植。俄罗斯，中亚也有。",
            "value":"药用价值：种子治理润燥，滑肠，下气，利水。枝条治黄疸，小便不利。（《图朝药》）\n园林价值：榆叶梅其叶象榆树，其花象梅花，所以得名“榆叶梅”。榆叶梅枝叶茂密，花繁色艳，是中国北方园林，街道，路边等重要的绿化观花灌木树种。其植物有较强的抗盐碱能力。适宜种植在公园的草地、路边或庭园中的角落、水池等地。如果将榆叶梅种植在常绿树周围或种植于假山等地，其视觉效果更理想，能够让其具有良好的视觉观赏效果。与其他花色的植物搭配种植，在春秋季花盛开时候，花形、花色均极美观，各色花争相斗艳，景色宜人，是不可多得的园林绿化植物。"
            }]
            // 前端显示树木结果
            this_.tree_popup.setData({
              title:res.result,
              description: tree[0]["description"],
              area: tree[0]['area'],
              env: tree[0]["env"],
              value:tree[0]["value"]
            });
            this_.tree_popup.showPopup();
            //data = data[0]
          },
        })
      },
      fail: (e) => {
        wx.showToast({
          title: '二维码无效',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  listenerConfirm:function() {
    this.setData({
        hiddenModal: true
    })
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
    let id = e.detail.markerId
    let src = this.data.markers[id].url;
    wx.previewImage({
      current: src, //当前显示的图片链接(多张预览中点击后显示的)
      urls: [src] //需要预览的图片连接（多张预览）
    })
  }
})