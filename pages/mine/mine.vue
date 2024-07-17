<template>
	<view class="container">
		<uni-data-select v-model="userInfo.positionValue" :localdata="position_info"
			@change="positionChange"></uni-data-select>
		<view class="avatar-container">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image class="avatar" :src="userInfo.avatarValue" mode="aspectFit"></image>
			</button>
		</view>
		<view class="separator"></view> <!-- 用来分隔的容器 -->
		<view class="nick-name user-attr">
			<label>昵称</label>
			<input class="nick-name-input" type="nickname" placeholder="请输入昵称" :value="userInfo.nickName"
				@blur="bindBlur" @input="bindInput" />
		</view>
		<view class="location user-attr">
			<text>场上位置</text>
			<uni-data-select v-model="userInfo.positionValue" :localdata="position_info"
				@change="positionChange"></uni-data-select>
		</view>

		<view class="btn">
			<button class="submit-btn" type="primary" @click="saveUserInfo">保存用户信息</button>
		</view>

		<uni-popup ref="message" type="message">
			<uni-popup-message :type="messageData.type" :message="messageData.message"
				:duration="messageData.duration"></uni-popup-message>
		</uni-popup>

	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'

	const messageData = reactive({
		type: "success",
		message: "保存用户信息成功~~",
		duration: 2000,
	})

	const message = ref()


	onShow(() => {
		getUserInfo()
	})

	const server_info = {
		url: 'https://oryjk.cn:82',
		appId: "wxc61da17a97f6eb1b",
		secret: "5d07cc90ad39ba23cbedf0b5e4bc8127",
		isMock: false
	}

	const position_info = reactive([{
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
	])



	const userInfo = reactive({
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
	})

	function onChooseAvatar(e) {
		const {
			avatarUrl
		} = e.detail
		userInfo.avatarUrl = avatarUrl
		userInfo.avatarValue = avatarUrl
		uni.setStorageSync('avatarUrl', avatarUrl)
		uni.setStorageSync('avatarValue', avatarUrl)
	}

	function positionChange(e) {
		console.log("e:", e)
	}

	function bindBlur(e) {
		userInfo.nickName = e.detail.value
	}

	function bindInput(e) {
		userInfo.nickName = e.detail.value
	}

	function saveUserInfo() {
		if (userInfo.avatarUrl == "" || userInfo.nickName == "") {
			messageData.type = "error"
			messageData.message = "请绑定用户头像和昵称！！！"
			messageData.duration = 6000
			message.value.open()
			return
		}
		uni.showLoading({
			title: '保存数据中'
		})
		uni.getUserProfile({
			provider: 'weixin',
			desc: '获取你的昵称、头像、地区级性别',
			success: (res) => {
				console.log(res)
				userInfo.userInfo = res.userInfo
				userInfo.cloudID = res.cloudID
				userInfo.encryptedData = res.encryptedData
				userInfo.errMsg = res.errMsg
				userInfo.iv = res.iv
				userInfo.rawData = res.rawData
				userInfo.signature = res.signature

				uni.login({
					provider: 'weixin',
					success: (res) => {
						console.log(res)
						userInfo.code = res.code
						userInfo.logined = true

						postRequest("/api/user/login", {
								appid: server_info.appId,
								secret: server_info.secret,
								js_code: res.code, // wx.login登录code
								grant_type: 'authorization_code' // 固定赋值
							}, (res) => {
								console.log('res', res)
								userInfo.openId = res.openid
								userInfo.session_key = res.session_key
								console.log(userInfo)
								postRequest("/api/user/info", userInfo, (data) => {
										uni.setStorageSync("openId", userInfo.openId)
										uni.setStorageSync("avatarUrl", userInfo
											.avatarUrl)
										uni.setStorageSync("nickName", userInfo
											.nickName)
										uni.setStorageSync("userInfo", userInfo)

										uni.uploadFile({
											url: server_info.url +
												'/api/user/upload/' + userInfo
												.openId,
											filePath: userInfo.avatarUrl,
											name: "file",
											formData: {
												'user': 'test'
											},
											success: (res) => {
												console.log(res.data)
											}
										})
										uni.hideLoading()
										message.value.open()
									},
									'POST')
							},
							'POST')
					}
				})

			},
			fail: (res) => {
				console.log(res)
			}
		})
	}

	function getUserInfo() {
		const openId = uni.getStorageSync("openId")
		if (openId != "") {
			console.log("不用登录了，缓存中有信息")
			userInfo.openId = uni.getStorageSync("openId")
			userInfo.avatarUrl = uni.getStorageSync("avatarUrl")
			userInfo.nickName = uni.getStorageSync("nickName")
			postRequest(`/api/user/info/${userInfo.openId}`, "", processUserInfo,
				'GET')
		} else {
			console.log("没有登录过，需要登录一下")
		}

	}

	function processUserInfo(data) {
		console.log(data)
		userInfo.avatarValue = 'data:image/jpeg;base64,' + data.avatarUrl;
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
				callBack(res.data)
			}
		});
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;

		.avatar-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 100rpx;
			margin-bottom: 100rpx;

			.avatar {
				width: 100rpx;
				/* 根据需要调整头像大小 */
				height: 100rpx;
				/* 根据需要调整头像大小 */
				border-radius: 50%;
				/* 圆形头像 */

			}

		}


		.user-attr {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 80%;
			margin-top: 50rpx;

			text {
				width: 30%;
			}

			input {
				width: 70%;
			}

		}

		.btn {
			position: fixed;
			width: 100%;
			bottom: 0;

			.submit-btn {
				position: absolute;
				bottom: 0;
				width: 100%;
				left: 0;
				padding: 10px 0;
				text-align: center;
			}
		}

	}
</style>