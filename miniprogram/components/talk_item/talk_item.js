// components/talk_item.js
Component({
  properties: {
    avatar_url: {
      type: String,
      value: '../../images/home.png'
    },
    user_name: {
      type: String,
      value: 'user_name'
    },
    post_date: {
      type: Date,
      value: new Date()
    },
    post_content: {
      type: String,
      value: '你若盛开，清风自来'
    },
    post_img: {
      type: String,
      value: '../../images/testimg.jpg'
    },
    like_number: {
      type: String,
      value: '0'
    },
    comment_number: {
      type: String,
      value: '0'
    }
  },

  data: {

  },

  methods: {

  }
})
