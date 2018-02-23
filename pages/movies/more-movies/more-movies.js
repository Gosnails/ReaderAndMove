// pages/movies/more-movies/more-movies.js
var utils = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    var dataUrl = '';
    this.setData({
      navigateTitle: category
    })
    switch (category) {
      case "正在热映":
        var dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters'
        break;
      case "即将上映":
        var dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon'
        break;
      case "豆瓣Top250":
        var dataUrl = app.globalData.doubanBase + '/v2/movie/top250'
        break;
    }
    utils.http(dataUrl, this.processDoubanData)
    this.setData({
      requestUrl: dataUrl
    })
  },
  onReachBottom: function(event) {
    var nextUrl = this.data.requestUrl + "?start=" +this.data.totalCount+ "&count = 20";
    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh:function(event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count = 20";
    this.data.movies = {};
    this.data.isEmpty = true;
    utils.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: utils.converToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }

    // 如果要绑定新的数据，新加载的数据要同就有的数据合并在一起
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
})