<template>
	<view class="view view-50 regis-info">
		<scroll-view scroll-y="true" class="user-container-scroll">
			<uni-section title="报名参加" type="line" padding title-color="#3A404A"
				:sub-title="match_info.agreeItems.length+'人'">
				<view class="user-container">
					<view class="image-name-container" v-for="(item,index) in match_info.agreeItems"
						:key="item.nickName">
						<image class="avatar" mode="aspectFit" :src="item.avatarValue"></image>
						<text>{{item.nickName}}</text>
					</view>

				</view>
			</uni-section>

			<uni-section title="无法参加" type="line" padding title-color="#3A404A"
				:sub-title="match_info.disAgreeItems.length+'人'">
				<view class="user-container">
					<view class="image-name-container" v-for="(item,index) in match_info.disAgreeItems"
						:key="item.nickName">
						<image class="avatar" mode="aspectFit" :src="item.avatarValue"></image>
						<text>{{item.nickName}}</text>
					</view>
				</view>
			</uni-section>

			<uni-section title="未接龙人员" type="line" padding title-color="#3A404A"
				:sub-title="match_info.nullAgreeItems.length+'人'">
				<view class="user-container">
					<view class="image-name-container" v-for="(item,index) in match_info.nullAgreeItems"
						:key="item.nickName">
						<image class="avatar" mode="aspectFit" :src="item.avatarValue"></image>
						<text>{{item.nickName}}</text>
					</view>
				</view>

			</uni-section>

			<nullAggre :match_info="match_info"></nullAggre>

		</scroll-view>
	</view>
</template>

<script setup>
	const props = defineProps({
		match_info: Object
	})
</script>

<style lang="scss">
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
</style>