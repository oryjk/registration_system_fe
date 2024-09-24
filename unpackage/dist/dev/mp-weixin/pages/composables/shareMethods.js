"use strict";
const common_vendor = require("../../common/vendor.js");
function useShareMethods() {
  const server_info = {
    url: "https://oryjk.cn:82",
    appId: "wxc61da17a97f6eb1b",
    secret: "5d07cc90ad39ba23cbedf0b5e4bc8127"
  };
  const asyncRequest = (path, payload, method, host) => {
    return new Promise((resolve, reject) => {
      const hostUrl = host === void 0 ? server_info.url : host;
      common_vendor.index.request({
        url: hostUrl + path,
        data: payload,
        method,
        header: {
          "content-type": "application/json"
        },
        success: (res) => {
          if (res.statusCode == 500) {
            reject("请求服务器报错了: " + res.data.message);
          } else {
            resolve(res.data);
          }
        }
      });
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "/" + month + "/" + day;
  };
  const matchGroup = (data) => {
    return data.userInfos.reduce((acc, current) => {
      if (current.stand == 1) {
        current.avatarValue = "data:image/jpeg;base64," + current.avatarUrl;
        acc.agree.push(current);
      }
      if (current.stand == 2) {
        current.avatarValue = "data:image/jpeg;base64," + current.avatarUrl;
        acc.disAgree.push(current);
      }
      return acc;
    }, {
      agree: [],
      disAgree: []
    });
  };
  return {
    asyncRequest,
    formatDate,
    matchGroup
  };
}
exports.useShareMethods = useShareMethods;
