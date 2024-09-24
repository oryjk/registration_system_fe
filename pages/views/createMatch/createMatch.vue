<template>

	<view class="container">
		<uni-section title="比赛基本信息" type="line">

			<view class="form">
				<uni-forms ref="baseForm1" :modelValue="matchInfo" :rules="baseForm1.rules" label-position="top">
					<uni-forms-item label="比赛名称" name="name" required>
						<uni-easyinput v-model="matchInfo.name" placeholder="比赛名称" />
					</uni-forms-item>
					<uni-forms-item label="报名开始时间" name="start_time" required>
						<uni-datetime-picker type="datetime" v-model="matchInfo.start_time" />
					</uni-forms-item>
					<uni-forms-item label="报名结束时间" name="end_time" required>
						<uni-datetime-picker type="datetime" v-model="matchInfo.end_time" />
					</uni-forms-item>
					<uni-forms-item label="比赛时间" name="holding_date" required>
						<uni-datetime-picker type="datetime" v-model="matchInfo.holding_date" />
					</uni-forms-item>
					<uni-forms-item label="比赛地点" name="location" required>
						<uni-easyinput v-model="matchInfo.location" placeholder="比赛地点" />
					</uni-forms-item>
					<uni-forms-item label="颜色" name="color" required>
						<uni-data-select class="history-select" v-model="matchInfo.color"
							:localdata="colorSelect.range"></uni-data-select>
					</uni-forms-item>
					<uni-forms-item label="对手">
						<uni-easyinput v-model="matchInfo.opposing" placeholder="对手" />
					</uni-forms-item>
					<uni-forms-item label="对手颜色">
						<uni-data-select class="history-select" name="color" v-model="matchInfo.opposing_color"
							:localdata="colorSelect.range"></uni-data-select>
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="button-container">
				<button form-type="submit" type="primary" @click="handleSubmit('baseForm')">提交</button>
			</view>
			<uni-popup ref="message" type="message">
				<uni-popup-message type="success" message="创建比赛成功" :duration="2000"></uni-popup-message>
			</uni-popup>
		</uni-section>
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

	import {
		useShareMethods
	} from '@/pages/composables/shareMethods.js';

	const {
		asyncRequest
	} = useShareMethods()

	const message = ref()
	const colors = ref([{
			text: '白色',
			value: "#FFFFFF"
		},
		{
			text: '红色',
			value: "#C44D41"
		},
		{
			text: '蓝色',
			value: "#007BFF"
		},
		{
			text: '紫色',
			value: "#C678DD"
		}
	])

	const baseForm1 = ref({
		rules: {
			name: {
				rules: [{
					required: true,
					errorMessage: '姓名不能为空'
				}]
			},
			start_time: {
				rules: [{
					required: true,
					errorMessage: '请选择开始报名时间'
				}]
			},
			end_time: {
				rules: [{
					required: true,
					errorMessage: '请选择结束报名时间'
				}]
			},
			holding_date: {
				rules: [{
					required: true,
					errorMessage: '请选择比赛时间'
				}, {
					validateFunction: function(rule, value, data, callback) {
						if (value.length < 2) {
							callback('请至少勾选两个兴趣爱好')
						}
						return true
					}
				}]
			},
			location: {
				rules: [{
					required: true,
					errorMessage: '请填写比赛地点'
				}]
			},
			color: {
				rules: [{
					required: true,
					errorMessage: '请填写球服颜色'
				}]
			}
		}
	})


	let colorSelect = ref({
		value: "#FFFFFF",
		range: colors.value
	})

	const colorsMap = new Map();

	// 遍历数组，将每个对象添加到 Map 中，使用 name 作为键
	colors.value.forEach(color => {
		colorsMap.set(color.name, color.value);
	});

	const matchInfo = ref({
		name: "周四友谊赛",
		start_time: "",
		end_time: "",
		holding_date: "",
		location: "驿马河二期足球场",
		color: colors.value[0].name,
		opposing: "待定",
		opposing_color: colors.value[1].name
	})

	function handleSubmit(ref) {
		// 打印 matchInfo 中的所有属性的值
		console.log('比赛名称:', matchInfo.value.name);
		console.log('开始时间:', matchInfo.value.start_time);
		console.log('结束时间:', matchInfo.value.end_time);
		console.log('举行日期:', matchInfo.value.holding_date);
		console.log('地点:', matchInfo.value.location);
		console.log('颜色:', matchInfo.value.color);
		console.log('对手:', matchInfo.value.opposing);
		console.log('对手颜色:', matchInfo.value.opposing_color);

		baseForm1.value.validate().then(res => {
			console.log('success', res);
			uni.showToast({
				title: `校验通过`
			})
		}).catch(err => {
			console.log('err', err);
		})

		// 也可以直接打印整个对象
		console.log('matchInfo:', matchInfo.value);
		// asyncRequest("/rs/admin/create_match", matchInfo.value, 'POST', 'http://127.0.0.1:7878').then((res) => {

		// })
		message.value.open()
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		text-align: center;
		flex-direction: column;

		padding-left: 20px;
		padding-right: 20px;

		.form {

			flex-grow: 0;
			/* 默认情况下flex-grow为0，意味着不会基于额外空间增长 */
			flex-shrink: 0;
			/* 防止元素缩小 */
			overflow: auto;
			margin-bottom: 60%;
		

			/* 如果内容超出容器，则显示滚动条 */
			.form-item {
				margin-bottom: 20px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				

				.picker {
					flex: 1;
					padding: 10px;
					margin-left: 10px;
					/* 选择器和文本间距 */
					background-color: #f0f0f0;
					/* 选择器背景色 */
				}

				text {
					width: 40%;
					text-align: left;
				}

				input {
					width: 60%;
					box-sizing: border-box;
					text-align: left;
				}
			}
		}





		.button-container {
			display: flex;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 10px;
			justify-content: space-between;
			padding-left: 20px;
			padding-right: 20px;
			/* 居中按钮 */

			button {
				padding: 0;
				margin: 0;
				// background-color: #007bff;
				color: white;
				border: none;
				border-radius: 5px;
				cursor: pointer;
				width: 100%;

			}
		}

	}
</style>