"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_message2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_message + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    const messageData = common_vendor.reactive({
      type: "success",
      message: "保存用户信息成功~~",
      duration: 2e3
    });
    const message = common_vendor.ref();
    common_vendor.onShow(() => {
      getUserInfo();
    });
    const server_info = {
      url: "https://oryjk.cn:82",
      isMock: false
    };
    const userInfo = common_vendor.reactive({
      code: "",
      cloudID: "",
      encryptedData: "",
      errMsg: "",
      iv: "",
      rawData: "",
      signature: "",
      userInfo: "",
      logined: false,
      openId: "",
      session_key: "",
      nickName: "",
      avatarUrl: "",
      avatarValue: "",
      positionValue: "",
      isManager: false
    });
    function navigateToCreatePage() {
      common_vendor.index.navigateTo({
        url: "/pages/views/createMatch/createMatch"
        // 指定跳转页面的路径
      });
    }
    function onChooseAvatar(e) {
      const {
        avatarUrl
      } = e.detail;
      userInfo.avatarUrl = avatarUrl;
      userInfo.avatarValue = avatarUrl;
      common_vendor.index.setStorageSync("avatarUrl", avatarUrl);
      common_vendor.index.setStorageSync("avatarValue", avatarUrl);
    }
    function bindBlur(e) {
      userInfo.nickName = e.detail.value;
    }
    function bindInput(e) {
      userInfo.nickName = e.detail.value;
    }
    function saveUserInfo() {
      if (userInfo.avatarUrl == "" || userInfo.nickName == "") {
        messageData.type = "error";
        messageData.message = "请绑定用户头像和昵称！！！";
        messageData.duration = 6e3;
        message.value.open();
        return;
      }
      common_vendor.index.showLoading({
        title: "保存数据中"
      });
      common_vendor.index.getUserProfile({
        provider: "weixin",
        desc: "获取你的昵称、头像、地区级性别",
        success: (res) => {
          console.log(res);
          userInfo.userInfo = res.userInfo;
          userInfo.cloudID = res.cloudID;
          userInfo.encryptedData = res.encryptedData;
          userInfo.errMsg = res.errMsg;
          userInfo.iv = res.iv;
          userInfo.rawData = res.rawData;
          userInfo.signature = res.signature;
          common_vendor.index.login({
            provider: "weixin",
            success: (res2) => {
              console.log(res2);
              userInfo.code = res2.code;
              userInfo.logined = true;
              postRequest(
                "/api/user/login",
                {
                  js_code: res2.code,
                  // wx.login登录code
                  grant_type: "authorization_code"
                  // 固定赋值
                },
                (res3) => {
                  console.log("res", res3);
                  userInfo.openId = res3.openid;
                  userInfo.session_key = res3.session_key;
                  console.log(userInfo);
                  postRequest(
                    "/api/user/info",
                    userInfo,
                    (data) => {
                      common_vendor.index.setStorageSync("openId", userInfo.openId);
                      common_vendor.index.setStorageSync("avatarUrl", userInfo.avatarUrl);
                      common_vendor.index.setStorageSync("nickName", userInfo.nickName);
                      common_vendor.index.setStorageSync("userInfo", userInfo);
                      common_vendor.index.uploadFile({
                        url: server_info.url + "/api/user/upload/" + userInfo.openId,
                        filePath: userInfo.avatarUrl,
                        name: "file",
                        formData: {
                          "user": "test"
                        },
                        success: (res4) => {
                          console.log(res4.data);
                        }
                      });
                      common_vendor.index.hideLoading();
                      message.value.open();
                    },
                    "POST"
                  );
                },
                "POST"
              );
            }
          });
        },
        fail: (res) => {
          console.log(res);
        }
      });
    }
    function getUserInfo() {
      const openId = common_vendor.index.getStorageSync("openId");
      if (openId != "") {
        console.log("不用登录了，缓存中有信息");
        userInfo.openId = common_vendor.index.getStorageSync("openId");
        userInfo.avatarUrl = common_vendor.index.getStorageSync("avatarUrl");
        userInfo.nickName = common_vendor.index.getStorageSync("nickName");
        postRequest(
          `/api/user/info/${userInfo.openId}`,
          "",
          processUserInfo,
          "GET"
        );
      } else {
        console.log("没有登录过，需要登录一下");
      }
    }
    function processUserInfo(data) {
      console.log(data);
      userInfo.avatarValue = "data:image/jpeg;base64," + data.avatarUrl;
      userInfo.isManager = data.isManager;
    }
    function postRequest(path, payload, callBack, method) {
      common_vendor.index.request({
        url: server_info.url + path,
        data: payload,
        method,
        header: {
          "content-type": "application/json"
        },
        success: (res) => {
          callBack(res.data);
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: userInfo.avatarValue,
        b: common_vendor.o(onChooseAvatar),
        c: userInfo.nickName,
        d: common_vendor.o(bindBlur),
        e: common_vendor.o(bindInput),
        f: common_vendor.o(saveUserInfo),
        g: common_vendor.o(navigateToCreatePage),
        h: userInfo.isManager,
        i: common_vendor.p({
          type: messageData.type,
          message: messageData.message,
          duration: messageData.duration
        }),
        j: common_vendor.sr(message, "46109ef3-0", {
          "k": "message"
        }),
        k: common_vendor.p({
          type: "message"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
