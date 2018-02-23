const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const converToStarsArray = stars => {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array
}

const http = (url, callBack) => {
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      callBack(res.data);
    }
  })
}

module.exports = {
  formatTime: formatTime,
  converToStarsArray: converToStarsArray,
  http: http
}
