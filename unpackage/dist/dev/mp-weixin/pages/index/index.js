"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_title2 = common_vendor.resolveComponent("uni-title");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  (_easycom_uni_title2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_uni_popup_message2)();
}
const _easycom_uni_title = () => "../../uni_modules/uni-title/components/uni-title/uni-title.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
if (!Math) {
  (_easycom_uni_title + regisInfo + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_uni_popup_message)();
}
const regisInfo = () => "../components/regisInfo.js";
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
      "nullAgreeItems": [],
      "opposing": "",
      "color": "",
      "opposingColor": ""
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
    const myTeamStyle = common_vendor.reactive({
      "text-decoration": `underline ${match_info.color}`,
      "text-decoration-thickness": "20rpx",
      "text-decoration-style": "solid",
      "color": "white"
    });
    const opposingTeamStyle = common_vendor.reactive({
      "text-decoration": `underline ${match_info.opposingColor}`,
      "text-decoration-thickness": "20rpx",
      "text-decoration-style": "solid",
      "color": "white"
    });
    common_vendor.onMounted(() => {
      getActivityWithPromoise().then((result) => {
        console.log(result);
        return getActivityInfo(result.id);
      }).then((result) => {
        console.log(result);
        myTeamStyle["text-decoration"] = `underline ${match_info.color}`;
        opposingTeamStyle["text-decoration"] = `underline ${match_info.opposingColor}`;
      });
    });
    common_vendor.onShow(() => {
      getActivity();
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      user_info.code = userInfo.code;
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
    function getAllUser() {
      postRequest(
        `/api/user/info/all`,
        "",
        processAllUser,
        "GET"
      );
    }
    function processAllUser(data) {
      let disAgreeIds = match_info.disAgreeItems.map((user) => user.openId);
      let agreeIds = match_info.agreeItems.map((user) => user.openId);
      let nullUsers = data.filter((user) => !(disAgreeIds.includes(user.openId) || agreeIds.includes(user.openId)));
      let nullAgreeItems = [];
      nullUsers.forEach(function(current) {
        current.avatarValue = "data:image/jpeg;base64," + current.avatarUrl;
        nullAgreeItems.push(current);
      });
      match_info.nullAgreeItems = nullAgreeItems;
    }
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
    function getActivityWithPromoise() {
      return asyncRequest(
        `/api/activity/processing`,
        "",
        processActivity,
        "GET"
      );
    }
    function getActivityInfo(activityId) {
      return asyncRequest(
        `/api/activity-info/${activityId}`,
        "",
        processActivityInfo,
        "GET"
      );
    }
    function processActivityInfo(data) {
      match_info.opposing = data.opposing;
      match_info.color = data.color;
      match_info.opposingColor = data.opposingColor;
      return data;
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
      getAllUser();
      setInterval(checkouSubmitBtnStatus, 1e3);
      return data;
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
    function asyncRequest(path, payload, callBack, method) {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: server_info.url + path,
          data: payload,
          method,
          header: {
            "content-type": "application/json"
          },
          success: (res) => {
            resolve(callBack(res.data));
          }
        });
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
        b: common_vendor.s(myTeamStyle),
        c: common_vendor.t(match_info.opposing),
        d: common_vendor.s(opposingTeamStyle),
        e: common_vendor.p({
          color: "#999DA2",
          type: "h4",
          title: "比赛地点: " + match_info.addr,
          align: "center"
        }),
        f: common_vendor.p({
          color: "#999DA2",
          type: "h4",
          title: "报名截止时间: " + match_info.cutOffTime,
          align: "center"
        }),
        g: common_vendor.p({
          match_info
        }),
        h: !user_info.logined
      }, !user_info.logined ? {
        i: common_vendor.o(login)
      } : {}, {
        j: !user_info.openId == ""
      }, !user_info.openId == "" ? {
        k: common_vendor.t(match_info.msgStatus),
        l: match_info.btn,
        m: match_info.matchRegistStatus,
        n: common_vendor.o(($event) => inputDialogToggle(match_info.registStatus))
      } : {}, {
        o: common_vendor.o(dialogConfirm),
        p: common_vendor.o(dialogClose),
        q: common_vendor.p({
          type: "success",
          cancelText: "不参加",
          confirmText: "参加",
          title: match_info.notice,
          content: match_info.content
        }),
        r: common_vendor.sr(alertDialog, "298bcdb9-4", {
          "k": "alertDialog"
        }),
        s: common_vendor.p({
          type: "dialog"
        }),
        t: common_vendor.p({
          type: match_info.msgType,
          message: match_info.messageText,
          duration: 2e3
        }),
        v: common_vendor.sr(message, "298bcdb9-6", {
          "k": "message"
        }),
        w: common_vendor.p({
          type: "message"
        })
      });
    };
  }
};
_sfc_main.__runtimeHooks = 6;
wx.createPage(_sfc_main);
