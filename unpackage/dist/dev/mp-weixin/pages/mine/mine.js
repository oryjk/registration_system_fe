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
    const message = common_vendor.ref();
    const server_info = {
      url: "https://oryjk.cn:82",
      appId: "wxc61da17a97f6eb1b",
      secret: "5d07cc90ad39ba23cbedf0b5e4bc8127",
      isMock: false
    };
    const userInfo = common_vendor.reactive({
      avatarUrl: "",
      nickName: "",
      openId: ""
    });
    function onChooseAvatar(e) {
      const {
        avatarUrl
      } = e.detail;
      userInfo.avatarUrl = avatarUrl;
      common_vendor.index.setStorageSync("avatarUrl", avatarUrl);
    }
    function bindBlur(e) {
      userInfo.nickName = e.detail.value;
    }
    function bindInput(e) {
      userInfo.nickName = e.detail.value;
    }
    function saveUserInfo() {
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
              common_vendor.index.request({
                url: "https://api.weixin.qq.com/sns/jscode2session",
                data: {
                  appid: server_info.appId,
                  secret: server_info.secret,
                  js_code: res2.code,
                  // wx.login登录code
                  grant_type: "authorization_code"
                  // 固定赋值
                },
                success(res3) {
                  console.log("res", res3);
                  userInfo.openId = res3.data.openid;
                  userInfo.session_key = res3.data.session_key;
                  console.log(userInfo);
                  postRequest(
                    "/api/user/info",
                    userInfo,
                    (data) => {
                      common_vendor.index.setStorageSync("openId", userInfo.openId);
                      common_vendor.index.setStorageSync("avatarUrl", userInfo.avatarUrl);
                      common_vendor.index.setStorageSync("nickName", userInfo.nickName);
                    },
                    "POST"
                  );
                  message.value.open();
                }
              });
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
    getUserInfo();
    function processUserInfo(data) {
      console.log(data);
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
        a: userInfo.avatarUrl,
        b: common_vendor.o(onChooseAvatar),
        c: userInfo.nickName,
        d: common_vendor.o(bindBlur),
        e: common_vendor.o(bindInput),
        f: common_vendor.o(saveUserInfo),
        g: common_vendor.p({
          type: "success",
          message: "用户信息保存成功",
          duration: 2e3
        }),
        h: common_vendor.sr(message, "a806c726-0", {
          "k": "message"
        }),
        i: common_vendor.p({
          type: "message"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/carlwang/Documents/HBuilderProjects/registration_system_fe/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);
