"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _component_nullAggre = common_vendor.resolveComponent("nullAggre");
  (_easycom_uni_section2 + _component_nullAggre)();
}
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  _easycom_uni_section();
}
const _sfc_main = {
  __name: "regisInfo",
  props: {
    match_info: Object
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.match_info.agreeItems, (item, index, i0) => {
          return {
            a: item.avatarValue,
            b: common_vendor.t(item.nickName),
            c: item.nickName
          };
        }),
        b: common_vendor.p({
          title: "报名参加",
          type: "line",
          padding: true,
          ["title-color"]: "#3A404A",
          ["sub-title"]: __props.match_info.agreeItems.length + "人"
        }),
        c: common_vendor.f(__props.match_info.disAgreeItems, (item, index, i0) => {
          return {
            a: item.avatarValue,
            b: common_vendor.t(item.nickName),
            c: item.nickName
          };
        }),
        d: common_vendor.p({
          title: "无法参加",
          type: "line",
          padding: true,
          ["title-color"]: "#3A404A",
          ["sub-title"]: __props.match_info.disAgreeItems.length + "人"
        }),
        e: common_vendor.f(__props.match_info.nullAgreeItems, (item, index, i0) => {
          return {
            a: item.avatarValue,
            b: common_vendor.t(item.nickName),
            c: item.nickName
          };
        }),
        f: common_vendor.p({
          title: "未接龙人员",
          type: "line",
          padding: true,
          ["title-color"]: "#3A404A",
          ["sub-title"]: __props.match_info.nullAgreeItems.length + "人"
        }),
        g: common_vendor.p({
          match_info: __props.match_info
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
