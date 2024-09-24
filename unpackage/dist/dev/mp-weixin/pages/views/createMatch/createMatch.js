"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_datetime_picker2 + _easycom_uni_data_select2 + _easycom_uni_forms2 + _easycom_uni_popup_message2 + _easycom_uni_popup2 + _easycom_uni_section2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_popup_message = () => "../../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_section = () => "../../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_datetime_picker + _easycom_uni_data_select + _easycom_uni_forms + _easycom_uni_popup_message + _easycom_uni_popup + _easycom_uni_section)();
}
const _sfc_main = {
  __name: "createMatch",
  setup(__props) {
    const message = common_vendor.ref();
    const colors = common_vendor.ref([
      {
        text: "白色",
        value: "#FFFFFF"
      },
      {
        text: "红色",
        value: "#C44D41"
      },
      {
        text: "蓝色",
        value: "#007BFF"
      },
      {
        text: "紫色",
        value: "#C678DD"
      }
    ]);
    const baseForm1 = common_vendor.ref({
      rules: {
        name: {
          rules: [{
            required: true,
            errorMessage: "姓名不能为空"
          }]
        },
        start_time: {
          rules: [{
            required: true,
            errorMessage: "请选择开始报名时间"
          }]
        },
        end_time: {
          rules: [{
            required: true,
            errorMessage: "请选择结束报名时间"
          }]
        },
        holding_date: {
          rules: [{
            required: true,
            errorMessage: "请选择比赛时间"
          }, {
            validateFunction: function(rule, value, data, callback) {
              if (value.length < 2) {
                callback("请至少勾选两个兴趣爱好");
              }
              return true;
            }
          }]
        },
        location: {
          rules: [{
            required: true,
            errorMessage: "请填写比赛地点"
          }]
        },
        color: {
          rules: [{
            required: true,
            errorMessage: "请填写球服颜色"
          }]
        }
      }
    });
    let colorSelect = common_vendor.ref({
      value: "#FFFFFF",
      range: colors.value
    });
    const colorsMap = /* @__PURE__ */ new Map();
    colors.value.forEach((color) => {
      colorsMap.set(color.name, color.value);
    });
    const matchInfo = common_vendor.ref({
      name: "周四友谊赛",
      start_time: "",
      end_time: "",
      holding_date: "",
      location: "驿马河二期足球场",
      color: colors.value[0].name,
      opposing: "待定",
      opposing_color: colors.value[1].name
    });
    function handleSubmit(ref) {
      console.log("比赛名称:", matchInfo.value.name);
      console.log("开始时间:", matchInfo.value.start_time);
      console.log("结束时间:", matchInfo.value.end_time);
      console.log("举行日期:", matchInfo.value.holding_date);
      console.log("地点:", matchInfo.value.location);
      console.log("颜色:", matchInfo.value.color);
      console.log("对手:", matchInfo.value.opposing);
      console.log("对手颜色:", matchInfo.value.opposing_color);
      baseForm1.value.validate().then((res) => {
        console.log("success", res);
        common_vendor.index.showToast({
          title: `校验通过`
        });
      }).catch((err) => {
        console.log("err", err);
      });
      console.log("matchInfo:", matchInfo.value);
      message.value.open();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => matchInfo.value.name = $event),
        b: common_vendor.p({
          placeholder: "比赛名称",
          modelValue: matchInfo.value.name
        }),
        c: common_vendor.p({
          label: "比赛名称",
          name: "name",
          required: true
        }),
        d: common_vendor.o(($event) => matchInfo.value.start_time = $event),
        e: common_vendor.p({
          type: "datetime",
          modelValue: matchInfo.value.start_time
        }),
        f: common_vendor.p({
          label: "报名开始时间",
          name: "start_time",
          required: true
        }),
        g: common_vendor.o(($event) => matchInfo.value.end_time = $event),
        h: common_vendor.p({
          type: "datetime",
          modelValue: matchInfo.value.end_time
        }),
        i: common_vendor.p({
          label: "报名结束时间",
          name: "end_time",
          required: true
        }),
        j: common_vendor.o(($event) => matchInfo.value.holding_date = $event),
        k: common_vendor.p({
          type: "datetime",
          modelValue: matchInfo.value.holding_date
        }),
        l: common_vendor.p({
          label: "比赛时间",
          name: "holding_date",
          required: true
        }),
        m: common_vendor.o(($event) => matchInfo.value.location = $event),
        n: common_vendor.p({
          placeholder: "比赛地点",
          modelValue: matchInfo.value.location
        }),
        o: common_vendor.p({
          label: "比赛地点",
          name: "location",
          required: true
        }),
        p: common_vendor.o(($event) => matchInfo.value.color = $event),
        q: common_vendor.p({
          localdata: common_vendor.unref(colorSelect).range,
          modelValue: matchInfo.value.color
        }),
        r: common_vendor.p({
          label: "颜色",
          name: "color",
          required: true
        }),
        s: common_vendor.o(($event) => matchInfo.value.opposing = $event),
        t: common_vendor.p({
          placeholder: "对手",
          modelValue: matchInfo.value.opposing
        }),
        v: common_vendor.p({
          label: "对手"
        }),
        w: common_vendor.o(($event) => matchInfo.value.opposing_color = $event),
        x: common_vendor.p({
          name: "color",
          localdata: common_vendor.unref(colorSelect).range,
          modelValue: matchInfo.value.opposing_color
        }),
        y: common_vendor.p({
          label: "对手颜色"
        }),
        z: common_vendor.sr(baseForm1, "0c919186-1,0c919186-0", {
          "k": "baseForm1"
        }),
        A: common_vendor.p({
          modelValue: matchInfo.value,
          rules: baseForm1.value.rules,
          ["label-position"]: "top"
        }),
        B: common_vendor.o(($event) => handleSubmit()),
        C: common_vendor.p({
          type: "success",
          message: "创建比赛成功",
          duration: 2e3
        }),
        D: common_vendor.sr(message, "0c919186-18,0c919186-0", {
          "k": "message"
        }),
        E: common_vendor.p({
          type: "message"
        }),
        F: common_vendor.p({
          title: "比赛基本信息",
          type: "line"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
