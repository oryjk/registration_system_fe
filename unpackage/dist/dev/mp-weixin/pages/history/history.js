"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_composables_shareMethods = require("../composables/shareMethods.js");
if (!Array) {
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_data_select2 + _easycom_uni_section2)();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_data_select + _easycom_uni_section + regisInfo)();
}
const regisInfo = () => "../components/regisInfo.js";
const _sfc_main = {
  __name: "history",
  setup(__props) {
    const {
      asyncRequest,
      formatDate,
      matchGroup
    } = pages_composables_shareMethods.useShareMethods();
    let select_info = common_vendor.reactive({
      value: "0",
      range: []
    });
    common_vendor.onShow(() => {
      getAllActivityInfo().then((result) => {
        console.log(result);
        result.forEach(function(value) {
          let date = formatDate(value.holdingDate);
          select_info.range.push({
            "value": value.id,
            "text": date + value.name
          });
        });
        select_info.value = select_info.range[0].value;
        change(select_info.value);
      });
    });
    function getAllActivityInfo() {
      return asyncRequest("/api/activity/all", "", "GET");
    }
    function getActivityInfoById(id) {
      return asyncRequest(`/api/activity/${id}`, "", "GET");
    }
    function getActivityOrderById(id) {
      return asyncRequest(`/api/activity-order/${id}`, "", "GET");
    }
    function change(e) {
      console.log(e);
      getActivityInfoById(e).then((data) => {
        console.log(data);
        match_info.name = data.name;
        match_info.date = data.holdingDate;
        match_info.cutOffTime = data.endTime;
        match_info.addr = data.location;
        match_info.activityId = data.id;
        match_info.registCount = data.registCount;
        const group = matchGroup(data);
        match_info.agreeItems = group.agree;
        match_info.disAgreeItems = group.disAgree;
        getAllUser().then((data2) => {
          processAllUser(data2);
        });
      });
      getActivityOrderById(e).then((data) => {
        match_info.order.fee = data.fee;
        match_info.order.total = data.total;
        match_info.order.desc = data.desc;
      }).catch((error) => {
        match_info.order.fee = 998;
        match_info.order.total = 998;
        match_info.order.desc = "杰哥还在找双胞胎算账，暂时不入账~~";
        console.log(error + "!!!!!!!!!!!!!!");
      });
    }
    function getAllUser() {
      return asyncRequest(
        `/api/user/info/all`,
        "",
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
    common_vendor.reactive({
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
      positionValue: ""
    });
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
      "opposingColor": "",
      "order": {
        "total": "",
        "fee": "",
        "desc": ""
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(change),
        b: common_vendor.o(($event) => common_vendor.unref(select_info).value = $event),
        c: common_vendor.p({
          localdata: common_vendor.unref(select_info).range,
          modelValue: common_vendor.unref(select_info).value
        }),
        d: common_vendor.p({
          title: "历史报名列表",
          type: "line"
        }),
        e: common_vendor.t(match_info.order.total),
        f: common_vendor.t(match_info.order.fee),
        g: common_vendor.t(match_info.order.desc),
        h: common_vendor.p({
          title: "费用",
          type: "line"
        }),
        i: common_vendor.p({
          match_info
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
