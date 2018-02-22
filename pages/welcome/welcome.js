// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avator: '../../images/avatar.jpg'
  },
  onTap: function () {
    // wx.navigateTo({
    //   url: "../post/post"
    // });
    wx.switchTab({
      url: "../post/post"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})