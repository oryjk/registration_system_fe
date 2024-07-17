<template>
	<view class="container">
		<view class="fixed-content">
			<text>历史报名列表</text>
		</view>
		<view class="scrollable-content">
			<view class="overlay-content">
				暂时没有历史报名信息
			</view>

		</view>

		<view class="footer">
			没有更多内容了
			<uni-data-select v-model="userInfo.positionValue" :localdata="position_info" class="select-cus"
				@change="positionChange"></uni-data-select>
		</view>


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
	
	function positionChange(e){
		
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		min-height: 100%;

		.fixed-content {
			position: sticky;
			top: 0;
			display: flex;
			width: 100%;
			height: 80px;
			overflow: hidden;
		}
		.select-cus{
			z-index: 999;
		}

		.scrollable-content {
			// margin-top: 80px;
			// height: 70%;
			overflow-y: auto;
			background-color: white;
			z-index: 2;
		}

		.footer {
			position: sticky;
			bottom: 0;
			height: 80px;
		}

	}
</style>