// pages/post/post-detail/post-detail.js
var postsData = require('../../../data/post-data.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
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

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }

    this.setMusicMonitor()
  },
  setMusicMonitor: function() {
    var _this = this
    wx.onBackgroundAudioPlay(function () {
      _this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = _this.data.currentPostId;
    })
    wx.onBackgroundAudioPause(function () {
      _this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
    wx.onBackgroundAudioStop(function () {
      _this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },
  // 文章收藏
  onColletionTap: function (event) {
    // this.getPostsCollectedSyc();
    this.getPostsCollectedSyc();
  },
  // 异步缓存
  getPostsCollectedAsy: function () {
    var _this = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[_this.data.currentPostId];
        // 更新收藏状态
        postCollected = !postCollected;
        postsCollected[_this.data.currentPostId] = postCollected;
        _this.showToast(postsCollected, postCollected);
      },
    })
  },
  //  同步缓存
  getPostsCollectedSyc: function () {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 更新收藏状态
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },
  showModal: function (postsCollected, postCollected) {
    var _this = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '是否收藏该文章？' : '取消收藏该文章？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected)
          // 更新数据绑定变量，从而实现切换图片
          _this.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  // 
  showToast: function (postsCollected, postCollected) {
    var _this = this;
    // 更新文章是否缓存
    wx.setStorageSync('posts_collected', postsCollected)
    // 更新数据绑定变量，从而实现切换图片
    _this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功'
    })
  },
  // 分享
  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '无法实现',
        })
      }
    })
  },

  // 音乐播放
  onMusicTap: function (event) {
    var currentPostId =  this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
      console.log(isPlayingMusic)
      
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImgUrl
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})