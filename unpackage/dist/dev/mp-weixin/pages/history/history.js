"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_data_select = common_vendor.resolveComponent("uni-data-select");
  _component_uni_data_select();
}
const _sfc_main = {
  __name: "history",
  setup(__props) {
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
      positionValue: ""
    });
    const position_info = common_vendor.reactive([
      {
        value: "守门员",
        text: "GK"
      },
      {
        value: "中后卫",
        text: "CB"
      },
      {
        value: "左后卫",
        text: "LB"
      },
      {
        value: "右后卫",
        text: "RB"
      },
      {
        value: "中前卫",
        text: "CMF"
      },
      {
        value: "左前卫",
        text: "LMF"
      },
      {
        value: "右前卫",
        text: "RMF"
      },
      {
        value: "后腰",
        text: "DMF"
      },
      {
        value: "前腰",
        text: "AMF"
      },
      {
        value: "左边锋",
        text: "LWF"
      },
      {
        value: "右边锋",
        text: "RWF"
      },
      {
        value: "中锋",
        text: "CF"
      },
      {
        value: "前锋",
        text: "ST"
      },
      {
        value: "影锋",
        text: "SS"
      }
    ]);
    function positionChange(e) {
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(positionChange),
        b: common_vendor.o(($event) => userInfo.positionValue = $event),
        c: common_vendor.p({
          localdata: position_info,
          modelValue: userInfo.positionValue
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/carlwang/Documents/HBuilderProjects/registration_system_fe/pages/history/history.vue"]]);
wx.createPage(MiniProgramPage);
