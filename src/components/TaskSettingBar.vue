<template>
	<div class="task-setting-bar">
		<div class="tooltip">
			<el-button type="text" class="black-text-button"
			  @click.stop="changeActiveWidget('daterange')">
			  <i class="far fa-calendar"></i>
				<span class="date-button-label">{{ dateLabel }}</span>
			</el-button>	
			<DateRangePicker v-show="activeWidget === 'daterange'" :task="task"></DateRangePicker>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import DateRangePicker from './DateRangePicker'

export default {
	components: {
		DateRangePicker
	},
	props: ['task'],
	computed: {
		...mapState(['activeWidget']),
		dateLabel() {
			const { startDate, finishDate, duration } = this.task
			if (startDate) {
				const start = moment(startDate).format('MMM DD')
				if (startDate === finishDate) {
					return `${start} (1d)`
				} else {
					return `${start} - ${moment(finishDate).format('MMM DD')} (${duration}d)`
				}
			} else if (duration) {
				return `Backlogged (${duration}d)`
			} else {
				return 'Set date'
			}
		}
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
  padding-left: 18px;
  border-top: solid 1px;
  border-bottom: solid 1px;
  border-color: rgba(0,0,0,.16);
}

.fa-calendar {
	padding-right: 7px;
}

.date-button-label {
	font-size: 12px;
}
	
</style>