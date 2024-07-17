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
      secret: "5d07cc90ad39ba23cbedf0b5e4bc8127"
    };
    const match_info = common_vendor.reactive({
      "activityId": 0,
      "name": "",
      "date": "",
      "cutOffTime": "",
      "addr": "",
      "registCount": 0,
      "registStatus": 2,
      "unKonwn": 0,
      "ok": 1,
      "cancel": 2,
      "notice": "通知",
      "content": "",
      "msgType": "",
      "message": "",
      "msgStatus": "报名/取消报名",
      "btn": "primary",
      "matchRegistStatus": false,
      "agreeItems": [],
      "disAgreeItems": [],
      "nullAgreeItems": []
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
      openId: "",
      session_key: "",
      nickName: "",
      avatarUrl: "",
      avatarValue: ""
    });
    common_vendor.ref(10);
    const alertDialog = common_vendor.ref();
    const message = common_vendor.ref();
    common_vendor.ref();
    common_vendor.ref();
    common_vendor.onMounted(() => {
      getActivity();
    });
    common_vendor.onShow(() => {
      getActivity();
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      user_info.code = userInfo.code;
      user_info.cloudID = userInfo.cloudID;
      user_info.cloudID = userInfo.cloudID;
      user_info.iv = userInfo.iv;
      user_info.signature = userInfo.signature;
      user_info.userInfo = userInfo.userInfo;
      user_info.openId = userInfo.openId;
      user_info.session_key = userInfo.session_key;
      user_info.nickName = userInfo.nickName;
      user_info.avatarUrl = userInfo.avatarUrl;
      user_info.avatarValue = userInfo.avatarValue;
      user_info.logined = userInfo.logined;
    });
    function checkouSubmitBtnStatus() {
      let now = /* @__PURE__ */ new Date();
      const cutOffTime = new Date(match_info.cutOffTime.replace(/-/g, "/"));
      if (isNaN(cutOffTime.getTime())) {
        console.log("时间字符串格式不正确");
        return false;
      }
      if (cutOffTime < now) {
        match_info.msgStatus = "报名时间已过，无法修改状态";
        match_info.matchRegistStatus = true;
      } else {
        return true;
      }
    }
    getActivity();
    function login() {
      {
        common_vendor.index.switchTab({
          url: "../mine/mine"
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
      match_info.agreeItems = group.agree;
      match_info.disAgreeItems = group.disAgree;
      setInterval(checkouSubmitBtnStatus, 1e3);
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
          color: "#FFFFFF",
          type: "h2",
          title: "比赛时间: " + match_info.date,
          align: "center"
        }),
        b: common_vendor.p({
          color: "#999DA2",
          type: "h4",
          title: "比赛地点: " + match_info.addr,
          align: "center"
        }),
        c: common_vendor.p({
          color: "#999DA2",
          type: "h4",
          title: "报名截止时间: " + match_info.cutOffTime,
          align: "center"
        }),
        d: common_vendor.f(match_info.agreeItems, (item, index, i0) => {
          return {
            a: item.avatarValue,
            b: common_vendor.t(item.nickName),
            c: item.nickName
          };
        }),
        e: common_vendor.p({
          title: "报名参加",
          type: "line",
          padding: true,
          ["title-color"]: "#3A404A",
          ["sub-title"]: match_info.agreeItems.length + "人"
        }),
        f: common_vendor.f(match_info.disAgreeItems, (item, index, i0) => {
          return {
            a: item.avatarValue,
            b: common_vendor.t(item.nickName),
            c: item.nickName
          };
        }),
        g: common_vendor.p({
          title: "无法参加",
          type: "line",
          padding: true,
          ["title-color"]: "#3A404A",
          ["sub-title"]: match_info.disAgreeItems.length + "人"
        }),
        h: common_vendor.f(match_info.nullAgreeItems, (item, index, i0) => {
          return {
            a: item.avatarValue,
            b: common_vendor.t(item.nickName),
            c: item.nickName
          };
        }),
        i: common_vendor.p({
          title: "未接龙人员",
          type: "line",
          padding: true,
          ["title-color"]: "#3A404A",
          ["sub-title"]: match_info.nullAgreeItems.length + "人"
        }),
        j: !user_info.logined
      }, !user_info.logined ? {
        k: common_vendor.o(login)
      } : {}, {
        l: !user_info.openId == ""
      }, !user_info.openId == "" ? {
        m: common_vendor.t(match_info.msgStatus),
        n: match_info.btn,
        o: match_info.matchRegistStatus,
        p: common_vendor.o(($event) => inputDialogToggle(match_info.registStatus))
      } : {}, {
        q: common_vendor.o(dialogConfirm),
        r: common_vendor.o(dialogClose),
        s: common_vendor.p({
          type: "success",
          cancelText: "不参加",
          confirmText: "参加",
          title: match_info.notice,
          content: match_info.content
        }),
        t: common_vendor.sr(alertDialog, "7723569a-6", {
          "k": "alertDialog"
        }),
        v: common_vendor.p({
          type: "dialog"
        }),
        w: common_vendor.p({
          type: match_info.msgType,
          message: match_info.messageText,
          duration: 2e3
        }),
        x: common_vendor.sr(message, "7723569a-8", {
          "k": "message"
        }),
        y: common_vendor.p({
          type: "message"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/carlwang/Documents/HBuilderProjects/registration_system_fe/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
