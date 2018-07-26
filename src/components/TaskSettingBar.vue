<template>
	<div class="task-setting-bar">
		<div class="tooltip">
			<el-button type="text" class="black-text-button"
			  @click.stop="changeActiveWidget('daterange')">Set date</el-button>	
			<DateRangePicker v-show="activeWidget === 'daterange'" :task="task"></DateRangePicker>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import DateRangePicker from './DateRangePicker'

export default {
	components: {
		DateRangePicker
	},
	props: ['task'],
	data() {
		return {
			date: ''
		}
	},
	computed: {
		...mapState(['activeWidget'])
	},
	methods: {
		changeActiveWidget(key) {
		  this.$store.dispatch('changeActiveWidget', key)
		},
	}
}
</script>

<style scoped>
.task-setting-bar {  
  display: flex;
  height: 44px;
  position: relative;
  padding-right: 8px;
  border-top: solid 1px;
  border-bottom: solid 1px;
  border-color: rgba(0,0,0,.16);
}
	
</style>