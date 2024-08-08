<template>
	<view class="container">
		<view class="fixed-content">
			<uni-section title="历史报名列表" type="line">
				<uni-data-select class="history-select"  v-model="select_info.value" :localdata="select_info.range"
					@change="change"></uni-data-select>
			</uni-section>
			<uni-section class="order-info" title="费用" type="line">
				<text class="fee-text">总共: {{match_info.order.total}} 元, 人均: {{match_info.order.fee}} 元</text>
				<text class="fee-text">说明: {{match_info.order.desc}}</text>
			</uni-section>
		</view>


		<!-- {{range}} -->
		<view class="regis-info">
			<regisInfo :match_info="match_info"></regisInfo>
		</view>

	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app';

	import regisInfo from '../components/regisInfo.vue';
	import {
		useShareMethods
	} from '../composables/shareMethods.js';

	const {
		asyncRequest,
		formatDate,
		matchGroup
	} = useShareMethods()

	let select_info = reactive({
		value: "0",
		range: []
	})
	
	onShow(() => {
		getAllActivityInfo().then(result => {
			console.log(result)
			select_info.range=[]
			result.forEach(function(value) {
				let date = formatDate(value.holdingDate)
				select_info.range.push({
					"value": value.id,
					"text": date + value.name
				})
			})
			select_info.value = select_info.range[0].value
			change(select_info.value)
		})
	})

	function getAllActivityInfo() {
		return asyncRequest('/api/activity/all', "", 'GET')
	}

	function getActivityInfoById(id) {
		return asyncRequest(`/api/activity/${id}`, "", 'GET')
	}

	function getActivityOrderById(id) {
		return asyncRequest(`/api/activity-order/${id}`, "", 'GET')
	}

	function change(e) {
		console.log(e)
		getActivityInfoById(e).then(data => {
			console.log(data)
			match_info.name = data.name
			match_info.date = data.holdingDate
			match_info.cutOffTime = data.endTime
			match_info.addr = data.location
			match_info.activityId = data.id
			match_info.registCount = data.registCount
			const group = matchGroup(data)

			match_info.agreeItems = group.agree
			match_info.disAgreeItems = group.disAgree
			getAllUser().then(data => {
				processAllUser(data)
			})
		})

		getActivityOrderById(e).then(data => {

			match_info.order.fee = data.fee
			match_info.order.total = data.total
			match_info.order.desc = data.desc
		}).catch(error => {
			match_info.order.fee = 998
			match_info.order.total = 998
			match_info.order.desc = "杰哥还在找双胞胎算账，暂时不入账~~"
			console.log(error + "!!!!!!!!!!!!!!")
		})
	}



	function getAllUser() {
		return asyncRequest(`/api/user/info/all`, "",
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
		"opposingColor": '',
		"order": {
			"total": "",
			"fee": "",
			"desc": ""
		}
	})
</script>

<style lang="scss">
	.container {
		width: 100%;
		min-height: 100%;

		.fixed-content {
			position: fixed;
			top: 0;
			width: 100%;
			z-index: 999;
			// display: flex;
			// overflow: hidden;
			overflow: visible;

			.history-select {
				z-index: 999;
				// height: 30rpx;
			}

			.uni-section-content {
				display: flex;
				flex-direction: column;

				.fee-text {
					margin-left: 20rpx;
				}
			}

		}

		.footer {
			position: sticky;
			bottom: 0;
			height: 80px;
		}

	}
</style>