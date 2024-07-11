"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_title2 = common_vendor.resolveComponent("uni-title");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  (_easycom_uni_title2 + _easycom_uni_section2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_uni_popup_message2)();
}
const _easycom_uni_title = () => "../../uni_modules/uni-title/components/uni-title/uni-title.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
if (!Math) {
  (_easycom_uni_title + _easycom_uni_section + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_uni_popup_message)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const server_info = {
      url: "https://oryjk.cn:82",
      appId: "wxc61da17a97f6eb1b",
      secret: "5d07cc90ad39ba23cbedf0b5e4bc8127",
      isMock: false
    };
    const match_info = common_vendor.reactive({
      "activityId": 1,
      "name": "周四友谊赛",
      "date": "2024-07-10",
      "cutOffTime": "2024-07-10 13:00:00",
      "addr": "驿马河二期（2号球场）",
      "registCount": 12,
      "registStatus": 2,
      "unKonwn": 0,
      "ok": 1,
      "cancel": 2,
      "notice": "通知",
      "content": "",
      "msgType": "",
      "message": "",
      "msgStatus": "报名/取消报名",
      "btn": "primary"
    });
    const user_info = common_vendor.reactive({
      code: "",
      cloudID: "",
      encryptedData: "",
      errMsg: "",
      iv: "",
      rawData: "",
      signature: "",
      userInfo: "",
      logined: false,
      openId: "1111111",
      session_key: "",
      nickName: "微信用户",
      avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
    });
    common_vendor.ref(10);
    const alertDialog = common_vendor.ref();
    const message = common_vendor.ref();
    common_vendor.ref();
    function checkAuth() {
      const openId = common_vendor.index.getStorageSync("openId");
      if (openId != "") {
        user_info.logined = true;
        user_info.openId = openId;
      }
    }
    getActivity();
    checkAuth();
    function login() {
      {
        common_vendor.index.getUserProfile({
          provider: "weixin",
          desc: "获取你的昵称、头像、地区级性别",
          success: (res) => {
            console.log(res);
            user_info.userInfo = res.userInfo;
            user_info.cloudID = res.cloudID;
            user_info.encryptedData = res.encryptedData;
            user_info.errMsg = res.errMsg;
            user_info.iv = res.iv;
            user_info.rawData = res.rawData;
            user_info.signature = res.signature;
            common_vendor.index.login({
              provider: "weixin",
              success: (res2) => {
                console.log(res2);
                user_info.code = res2.code;
                user_info.logined = true;
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
                    user_info.openid = res3.data.openid;
                    user_info.session_key = res3.data.session_key;
                    console.log(user_info);
                    getUserActivityInfo();
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
    }
    function getActivity() {
      postRequest(
        `/api/activity/processing`,
        "",
        processActivity,
        "GET"
      );
    }
    function processActivity(data) {
      match_info.name = data.name;
      match_info.date = data.holdingDate;
      match_info.cutOffTime = data.endTime;
      match_info.addr = data.location;
      match_info.activityId = data.id;
      match_info.registCount = data.registCount;
      const group = data.userInfos.reduce((acc, current) => {
        if (current.stand == 1) {
          acc.agree.push(current);
        }
        if (current.stand == 2) {
          acc.disAgree.push(current);
        }
        return acc;
      }, {
        agree: [],
        disAgree: []
      });
      match_info.agreeItems = group.agree;
      match_info.disAgreeItems = group.disAgree;
    }
    function getUserActivityInfo() {
      postRequest(
        `/api/user-activity/${match_info.activityId}/${user_info.openId}`,
        "",
        processUserActivityInfo,
        "GET"
      );
    }
    function processUserActivityInfo(data) {
      console.info(data);
      if (data == "") {
        match_info.registStatus = 0;
        match_info.msgStatus = "未报名";
        match_info.btn = "primary";
        return;
      }
      if (data.stand == "PARTICIPATE") {
        match_info.registStatus = 1;
        match_info.msgStatus = "已报名";
        match_info.btn = "default";
      } else if (data.stand == "PENDING") {
        match_info.registStatus = 2;
        match_info.msgStatus = "无法参加";
        match_info.btn = "warn";
      }
    }
    function inputDialogToggle(registStatus) {
      if (registStatus == match_info.ok) {
        match_info.content = "需要修改状态吗 ？当前为参加状态";
      }
      if (registStatus == match_info.cancel) {
        match_info.content = "需要修改状态吗 ？当前为无法参加状态";
      }
      if (registStatus == match_info.unKonwn) {
        match_info.content = "需要修改状态吗 ？当前为还未表态状态";
      }
      alertDialog.value.open();
    }
    function dialogClose() {
      match_info.registStatus = match_info.cancel;
      let payLoad = {
        "activityId": match_info.activityId,
        "userId": user_info.openId,
        "stand": match_info.registStatus,
        "paid": false
      };
      postRequest("/api/user-activity/registration", payLoad, dialogCloseCallBack, "POST");
    }
    function dialogConfirm() {
      match_info.registStatus = match_info.ok;
      let payLoad = {
        "activityId": match_info.activityId,
        "userId": user_info.openId,
        "stand": match_info.registStatus,
        "paid": true
      };
      postRequest("/api/user-activity/registration", payLoad, dialogConfirmCallBack, "POST");
    }
    function dialogConfirmCallBack(data) {
      console.info(data);
      match_info.msgType = "success";
      match_info.messageText = "报名成功！！！";
      match_info.msgStatus = "已报名";
      match_info.btn = "default";
      message.value.open();
      getActivity();
    }
    function dialogCloseCallBack(data) {
      console.info(data);
      match_info.msgType = "success";
      match_info.messageText = "取消报名成功！！！";
      match_info.msgStatus = "无法参加";
      match_info.btn = "warn";
      message.value.open();
      getActivity();
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
          console.log(res.data);
          callBack(res.data);
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "h1",
          title: match_info.name,
          align: "center"
        }),
        b: common_vendor.p({
          type: "h4",
          title: "比赛时间: " + match_info.date,
          align: "center"
        }),
        c: common_vendor.p({
          type: "h4",
          title: "比赛地点: " + match_info.addr,
          align: "center"
        }),
        d: common_vendor.p({
          type: "h4",
          title: "报名截止时间: " + match_info.cutOffTime,
          align: "center"
        }),
        e: common_vendor.f(match_info.agreeItems, (item, index, i0) => {
          return {
            a: item.avatarUrl
          };
        }),
        f: common_vendor.p({
          title: "报名参加",
          type: "line",
          padding: true
        }),
        g: common_vendor.f(match_info.disAgreeItems, (item, index, i0) => {
          return {
            a: item.avatarUrl
          };
        }),
        h: common_vendor.p({
          title: "无法参加",
          type: "line",
          padding: true
        }),
        i: common_vendor.t(match_info.msgStatus),
        j: match_info.btn,
        k: common_vendor.o(($event) => inputDialogToggle(match_info.registStatus)),
        l: !user_info.logined
      }, !user_info.logined ? {
        m: common_vendor.o(login)
      } : {}, {
        n: common_vendor.o(dialogConfirm),
        o: common_vendor.o(dialogClose),
        p: common_vendor.p({
          type: "success",
          cancelText: "不参加",
          confirmText: "参加",
          title: match_info.notice,
          content: match_info.content
        }),
        q: common_vendor.sr(alertDialog, "7723569a-6", {
          "k": "alertDialog"
        }),
        r: common_vendor.p({
          type: "dialog"
        }),
        s: common_vendor.p({
          type: match_info.msgType,
          message: match_info.messageText,
          duration: 2e3
        }),
        t: common_vendor.sr(message, "7723569a-8", {
          "k": "message"
        }),
        v: common_vendor.p({
          type: "message"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/carlwang/Documents/HBuilderProjects/registration_system_fe/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
