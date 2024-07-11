<template>
	<view class="container">
		<view class="view view-30">
			<uni-title type="h1" :title="match_info.name" align="center"></uni-title>
			<uni-title type="h4" :title="'比赛时间: ' + match_info.date" align="center"></uni-title>
			<uni-title type="h4" :title="'比赛地点: ' + match_info.addr" align="center"></uni-title>
			<uni-title type="h4" :title="'报名截止时间: ' +match_info.cutOffTime" align="center"></uni-title>
		</view>

		<view class="view view-50">
			<scroll-view scroll-y="true">

				<uni-section title="报名参加" type="line" padding>
					<image v-for="(item,index) in match_info.agreeItems"
						style="width: 50px; height: 50px; background-color: #eeeeee; margin: 3px;" mode="aspectFit"
						:src="item.avatarUrl"></image>
				</uni-section>

				<uni-section title="无法参加" type="line" padding>
					<image v-for="(item,index) in match_info.disAgreeItems"
						style="width: 50px; height: 50px; background-color: #eeeeee;margin: 3px;" mode="aspectFit"
						:src="item.avatarUrl"></image>
				</uni-section>

			</scroll-view>
		</view>

		<view class="btn-container view view-20">
			<button class="submit-btn" :type="match_info.btn"
				@click="inputDialogToggle(match_info.registStatus)">{{match_info.msgStatus}}</button>

			<button ref="submitLoginBtn" @click="login" v-if="! user_info.logined">登录微信</button>
			<!-- 输入框示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="success" cancelText="不参加" confirmText="参加" :title="match_info.notice"
					:content="match_info.content" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>

			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="match_info.msgType" :message="match_info.messageText"
					:duration="2000"></uni-popup-message>
			</uni-popup>
		</view>


	</view>


</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue'

	const config = {
		isMock: false
	}

	const server_info = {
		url: 'https://oryjk.cn:82',
		appId: "wxc61da17a97f6eb1b",
		secret: "5d07cc90ad39ba23cbedf0b5e4bc8127",
		isMock: false
	}

	const match_info = reactive({
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


	})

	const user_info = reactive({
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
	})

	const count = ref(10)
	const alertDialog = ref()
	const message = ref()
	const submitLoginBtn = ref()

	function checkAuth() {
		const openId = uni.getStorageSync("openId")
		if (openId != "") {
			user_info.logined = true
			user_info.openId = openId
		}
	}
	getActivity()
	checkAuth()

	function login() {

		if (config.isMock) {
			console.info("devlop mode")
			user_info.logined = true
			uni.setStorageSync("openId", user_info.openid)
			return;
		} else {

			uni.getUserProfile({
				provider: 'weixin',
				desc: '获取你的昵称、头像、地区级性别',
				success: (res) => {
					console.log(res)
					user_info.userInfo = res.userInfo
					user_info.cloudID = res.cloudID
					user_info.encryptedData = res.encryptedData
					user_info.errMsg = res.errMsg
					user_info.iv = res.iv
					user_info.rawData = res.rawData
					user_info.signature = res.signature

					uni.login({
						provider: 'weixin',
						success: (res) => {
							console.log(res)
							user_info.code = res.code
							user_info.logined = true
							uni.request({
								url: 'https://api.weixin.qq.com/sns/jscode2session',
								data: {
									appid: server_info.appId,
									secret: server_info.secret,
									js_code: res.code, // wx.login登录code
									grant_type: 'authorization_code' // 固定赋值
								},
								success(res) {
									console.log('res', res)
									user_info.openid = res.data.openid
									user_info.session_key = res.data.session_key
									console.log(user_info)
									getUserActivityInfo()
								}
							})
						}
					})

				},
				fail: (res) => {
					console.log(res)
				}
			})
		}





	}

	function getActivity() {
		postRequest(`/api/activity/processing`, "", processActivity,
			'GET')
	}


	function processActivity(data) {
		match_info.name = data.name
		match_info.date = data.holdingDate
		match_info.cutOffTime = data.endTime
		match_info.addr = data.location
		match_info.activityId = data.id
		match_info.registCount = data.registCount

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
		})


		match_info.agreeItems = group.agree
		match_info.disAgreeItems = group.disAgree

	}



	function getUserActivityInfo() {

		postRequest(`/api/user-activity/${match_info.activityId}/${user_info.openId}`, "", processUserActivityInfo,
			'GET')
	}

	function processUserActivityInfo(data) {
		console.info(data)
		if (data == "") {
			match_info.registStatus = 0
			match_info.msgStatus = "未报名"
			match_info.btn = "primary"
			return;
		}

		if (data.stand == "PARTICIPATE") {
			match_info.registStatus = 1
			match_info.msgStatus = "已报名"
			match_info.btn = "default"
		} else if (data.stand == "PENDING") {
			match_info.registStatus = 2
			match_info.msgStatus = "无法参加"
			match_info.btn = "warn"
		}

	}

	function inputDialogToggle(registStatus) {
		if (registStatus == match_info.ok) {
			match_info.content = "需要修改状态吗 ？当前为参加状态"
		}
		if (registStatus == match_info.cancel) {
			match_info.content = "需要修改状态吗 ？当前为无法参加状态"
		}
		if (registStatus == match_info.unKonwn) {
			match_info.content = "需要修改状态吗 ？当前为还未表态状态"
		}
		alertDialog.value.open()
	}

	function dialogClose() {
		match_info.registStatus = match_info.cancel
		let payLoad = {
			"activityId": match_info.activityId,
			"userId": user_info.openId,
			"stand": match_info.registStatus,
			"paid": false
		}
		postRequest("/api/user-activity/registration", payLoad, dialogCloseCallBack, 'POST')
	}

	function dialogConfirm() {
		match_info.registStatus = match_info.ok
		let payLoad = {
			"activityId": match_info.activityId,
			"userId": user_info.openId,
			"stand": match_info.registStatus,
			"paid": true
		}
		postRequest("/api/user-activity/registration", payLoad, dialogConfirmCallBack, 'POST')
	}

	function dialogConfirmCallBack(data) {
		console.info(data)
		match_info.msgType = "success"
		match_info.messageText = "报名成功！！！"
		match_info.msgStatus = "已报名"
		match_info.btn = "default"
		message.value.open()
		getActivity()

	}

	function dialogCloseCallBack(data) {
		console.info(data)
		match_info.msgType = "success"
		match_info.messageText = "取消报名成功！！！"
		match_info.msgStatus = "无法参加"
		match_info.btn = "warn"
		message.value.open()
		getActivity()

	}

	function postRequest(path, payload, callBack, method) {
		uni.request({
			url: server_info.url + path,
			data: payload,
			method: method,
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				console.log(res.data);
				callBack(res.data)
			}
		});
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100%;

		.submit-btn {
			position: absolute;
			bottom: 0;
			width: 100%;
			left: 0;
			padding: 10px 0;
			text-align: center;

		}


		.view {
			flex-grow: 0;
			/* 默认情况下flex-grow为0，意味着不会基于额外空间增长 */
			flex-shrink: 0;
			/* 防止元素缩小 */
			overflow: auto;
			/* 如果内容超出容器，则显示滚动条 */
		}

		.view-20 {
			height: 20%;
		}

		.view-30 {
			height: 20%;
		}

		.view-50 {
			height: 50%;
		}


		.right-badge {
			width: 80%;
		}

		.btn-container {
			position: fixed;
			width: 100%;
			bottom: 0;
		}

	}
</style>