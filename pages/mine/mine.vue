<template>
	<view class="container">

		<view class="avatar-container">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image class="avatar" :src="userInfo.avatarUrl" mode="aspectFit"></image>
			</button>
		</view>
		<view class="separator"></view> <!-- 用来分隔的容器 -->
		<view class="nick-name">
			<text>昵称</text>
			<input class="nick-name-input" type="nickname" placeholder="请输入昵称" :value="userInfo.nickName"
				@blur="bindBlur" @input="bindInput" />
		</view>

		<view class="btn">
			<button class="submit-btn" type="primary" @click="saveUserInfo">保存用户信息</button>
		</view>

		<uni-popup ref="message" type="message">
			<uni-popup-message type="success" message="用户信息保存成功" :duration="2000"></uni-popup-message>
		</uni-popup>

	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue'
	
	const message = ref()
	
	const server_info = {
		url: 'https://oryjk.cn:82',
		appId: "wxc61da17a97f6eb1b",
		secret: "5d07cc90ad39ba23cbedf0b5e4bc8127",
		isMock: false
	}


	const userInfo = reactive({
		avatarUrl: "",
		nickName: "",
		openId: ""
	})

	function onChooseAvatar(e) {
		const {
			avatarUrl
		} = e.detail
		userInfo.avatarUrl = avatarUrl
		uni.setStorageSync('avatarUrl', avatarUrl)
	}

	function bindBlur(e) {
		userInfo.nickName = e.detail.value
	}

	function bindInput(e) {
		userInfo.nickName = e.detail.value
	}

	function saveUserInfo() {
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
								userInfo.openId = res.data.openid
								userInfo.session_key = res.data.session_key
								console.log(userInfo)

								postRequest("/api/user/info", userInfo, (data) => {
										uni.setStorageSync("openId", userInfo.openId)
										uni.setStorageSync("avatarUrl",userInfo.avatarUrl)
										uni.setStorageSync("nickName",userInfo.nickName)
									},
									'POST')

								message.value.open()
								
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

	function getUserInfo() {
		const openId = uni.getStorageSync("openId")
		if (openId != "") {
			console.log("不用登录了，缓存中有信息")
			userInfo.openId=uni.getStorageSync("openId")
			userInfo.avatarUrl=uni.getStorageSync("avatarUrl")
			userInfo.nickName=uni.getStorageSync("nickName")
			postRequest(`/api/user/info/${userInfo.openId}`, "", processUserInfo,
				'GET')
		} else {
			console.log("没有登录过，需要登录一下")
		}

	}
	getUserInfo()

	function processUserInfo(data) {
		console.log(data)
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


		.nick-name {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 80%;
			margin-top: 50rpx;

			text {
				width: 20%;
			}

			input {
				width: 80%;
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