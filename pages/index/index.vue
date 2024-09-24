<template>
	<view class="container">
		<view class="view view-30 match-info">
			<view class="match-date">
				<uni-title color="#FFFFFF" class="match-info-text" type="h2" :title="'比赛时间: ' + match_info.date"
					align="center"></uni-title>
			</view>
			<view class="team-info">
				<view class="team">
					<text class="team1-name" :style="myTeamStyle">东安洺悦联队</text>
				</view>
				<view class="team">
					<text>VS</text>
				</view>
				<view class="team">
					<text class="team2-name" :style="opposingTeamStyle">{{match_info.opposing}}</text>
				</view>
			</view>
			<view class="addr">
				<uni-title color="#999DA2" class="match-info-text" type="h4" :title="'比赛地点: ' +match_info.addr"
					align="center"></uni-title>
			</view>

			<view class="cut-off-time">
				<uni-title color="#999DA2" class="match-info-text" type="h4" :title="'报名截止时间: ' +match_info.cutOffTime"
					align="center"></uni-title>
			</view>
		</view>
		<regisInfo :match_info="match_info"></regisInfo>

		<view class="btn-container view view-20">
			<button class="submit-btn weixin-login" ref="submitLoginBtn" @click="login"
				v-if="! user_info.logined">登录微信</button>
			<button ref="submitBtn" class="submit-btn" :type="match_info.btn" v-if="! user_info.openId==''"
				:disabled="match_info.matchRegistStatus"
				@click="inputDialogToggle(match_info.registStatus)">{{match_info.msgStatus}}</button>
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
		computed,
		onMounted
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'

	import regisInfo from '../components/regisInfo.vue'


	const config = {
		isMock: false
	}

	const server_info = {
		url: 'https://oryjk.cn:82',
		appId: "wxc61da17a97f6eb1b",
		secret: "5d07cc90ad39ba23cbedf0b5e4bc8127",
	}

	const match_info = reactive({
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
		"opposing": '',
		"color": '',
		"opposingColor": ''
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
		openId: "",
		session_key: "",
		nickName: "",
		avatarUrl: "",
		avatarValue: ""
	})

	const count = ref(10)
	const alertDialog = ref()
	const message = ref()
	const submitLoginBtn = ref()
	const submitBtn = ref()

	const myTeamStyle = reactive({
		'text-decoration': `underline ${match_info.color}`,
		'text-decoration-thickness': '20rpx',
		'text-decoration-style': 'solid',
		'color': 'white'
	})
	const opposingTeamStyle = reactive({
		'text-decoration': `underline ${match_info.opposingColor}`,
		'text-decoration-thickness': '20rpx',
		'text-decoration-style': 'solid',
		'color': 'white'
	})


	onMounted(() => {
		// getActivity()
		getActivityWithPromoise().then(result => {
			console.log(result)
			return getActivityInfo(result.id)
		}).then(result => {
			console.log(result)
			myTeamStyle['text-decoration'] = `underline ${match_info.color}`
			
			opposingTeamStyle['text-decoration'] = `underline ${match_info.opposingColor}`
			
		})
	})


	onShow(() => {
		getActivity()
		const userInfo = uni.getStorageSync("userInfo")
		user_info.code = userInfo.code
		user_info.cloudID = userInfo.cloudID
		user_info.iv = userInfo.iv
		user_info.signature = userInfo.signature
		user_info.userInfo = userInfo.userInfo
		user_info.openId = userInfo.openId
		user_info.session_key = userInfo.session_key
		user_info.nickName = userInfo.nickName
		user_info.avatarUrl = userInfo.avatarUrl
		user_info.avatarValue = userInfo.avatarValue
		user_info.logined = userInfo.logined
	})

	function getAllUser() {
		postRequest(`/api/user/info/all`, "", processAllUser,
			'GET')
	}

	function processAllUser(data) {
		let disAgreeIds = match_info.disAgreeItems.map(user => user.openId)
		let agreeIds = match_info.agreeItems.map(user => user.openId)
		let nullUsers = data.filter(user => !(disAgreeIds.includes(user.openId) || agreeIds.includes(user.openId)))
		let nullAgreeItems = []

		nullUsers.forEach(function(current) {

			current.avatarValue = 'data:image/jpeg;base64,' + current.avatarUrl

			nullAgreeItems.push(current)
		})
		match_info.nullAgreeItems = nullAgreeItems
	}

	function onShareAppMessage() {
		return {
			title: '足球集散地',
			path: '/pages/index/index'
		}
	}

	function onShareTimeline() {
		return {
			title: '足球集散地',
			path: '/pages/index/index',
			imageUrl: ''
		}
	}

	function checkouSubmitBtnStatus() {
		let now = new Date();
		const cutOffTime = new Date(match_info.cutOffTime.replace(/-/g, '/'))
		if (isNaN(cutOffTime.getTime())) {
			console.log("时间字符串格式不正确");
			return false;
		}
		if (cutOffTime < now) {
			match_info.msgStatus = "报名时间已过，无法修改状态"
			match_info.matchRegistStatus = true
		} else {
			return true;
		}
	}

	// function checkAuth() {
	// 	const openId = uni.getStorageSync("openId")
	// 	if (openId != "") {
	// 		user_info.logined = true
	// 		user_info.openId = openId
	// 	}
	// }
	// checkAuth()

	function login() {

		if (config.isMock) {
			uni.switchTab({
				url: '../mine/mine'
			})
			console.info("devlop mode")
			user_info.logined = true
			uni.setStorageSync("openId", user_info.openid)
			return;
		} else {
			uni.switchTab({
				url: '../mine/mine'
			})
		}
	}

	function getActivity() {
		postRequest(`/api/activity/processing`, "", processActivity,
			'GET')
	}

	function getActivityWithPromoise() {
		return asyncRequest(`/api/activity/processing`, "", processActivity,
			'GET')
	}

	function getActivityInfo(activityId) {
		return asyncRequest(`/api/activity-info/${activityId}`, "", processActivityInfo,
			'GET')
	}

	function processActivityInfo(data) {
		match_info.opposing = data.opposing
		match_info.color = data.color
		match_info.opposingColor = data.opposingColor
		return data
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
				current.avatarValue = 'data:image/jpeg;base64,' + current.avatarUrl
				acc.agree.push(current);
			}
			if (current.stand == 2) {
				current.avatarValue = 'data:image/jpeg;base64,' + current.avatarUrl
				acc.disAgree.push(current);
			}
			return acc;

		}, {
			agree: [],
			disAgree: []
		})


		match_info.agreeItems = group.agree
		match_info.disAgreeItems = group.disAgree

		getAllUser()

		let intervalId = setInterval(checkouSubmitBtnStatus, 1000);

		return data

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
		} else if (data.stand == "NOT_PARTICIPATE") {
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

	function asyncRequest(path, payload, callBack, method) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: server_info.url + path,
				data: payload,
				method: method,
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					resolve(callBack(res.data))
				}
			});
		})
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		// width: 100%;

		.view {
			flex-grow: 0;
			/* 默认情况下flex-grow为0，意味着不会基于额外空间增长 */
			flex-shrink: 0;
			/* 防止元素缩小 */
			overflow: auto;
			/* 如果内容超出容器，则显示滚动条 */
		}

		.match-info {
			background-color: #38404B;
			position: fixed;
			top: 0%;
			height: 30%;
			width: 100%;

			.team-info {
				display: flex;
				flex-direction: row;
				justify-content: space-around;

				.team {
					display: flex;
					flex-direction: column;
					color: #eeeeee;
				}
			}

			.addr {
				margin-top: 25rpx;
			}

		}


		.regis-info {
			// position: relative;
			margin-top: 50%;
			margin-bottom: 20%;
			height: 100%;
			flex: 1;
			overflow-y: auto;
			z-index: 2;

			.user-container {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;

				.image-name-container {
					display: flex;
					/* 启用Flexbox */
					flex-direction: column;
					/* 使子元素垂直排列，即图片在上，文本在下 */
					align-items: center;
					/* 使子元素在交叉轴（此处为水平方向）上居中 */
					justify-content: center;
					/* 使子元素在主轴（此处为垂直方向）上居中（如果不需要垂直居中可省略） */
					margin-right: 3px;
					/* 示例：使容器水平居中 */
					width: calc(100% / 5 - 3px);

					.avatar {
						border-radius: 50%;
						width: 50px;
						height: 50px;
						background-color: #eeeeee;
						margin: 3px;

					}

					text {
						width: 70px;
						overflow: hidden;
						text-overflow: ellipsis;
						text-align: center;
					}
				}


			}
		}

		.btn-container {
			// flex: 1;
			/* 占据剩余空间 */
			position: fixed;
			bottom: 0;
			display: flex;
			width: 100%;
			flex-direction: column;
			justify-content: flex-end;
			z-index: 3;
			/* 使内容向下对齐，紧贴底部 */

			.submit-btn {
				// position: absolute;
				// bottom: 0;
				margin-top: 10px;
				width: 100%;
				left: 0;
				padding: 10px 0;
				text-align: center;

			}

		}


	}
</style>