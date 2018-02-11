// pages/post/post-detail/post-detail.js
var postsData = require('../../../data/post-data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    console.log(postsData.postList)
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    })

    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      if (!postsCollected[postId]) {
        postsCollected[postId] = false;
        this.setData({
          collected: postsCollected[postId]
        })
        wx.setStorageSync('posts_collected', postsCollected);
      }
      this.setData({
        collected: postsCollected[postId]
      })
    }
    else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
  },
  onColletionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 更新收藏状态
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // 更新文章是否缓存
    wx.setStorageSync('posts_collected', postsCollected)
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
  }
})