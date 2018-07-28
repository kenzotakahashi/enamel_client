<template>
	<div class="task-setting-bar">
		<div class="tooltip">
			<el-button type="text" class="black-text-button"
			  @click.stop="changeActiveWidget('daterange')">
			  <i class="far fa-calendar"></i>
				<span class="date-button-label">{{ dateLabel }}</span>
			</el-button>	
			<el-button type="text" class="black-text-button"
			  @click.stop="changeActiveWidget('record-form')">
			  <i class="far fa-clock"></i>
				<span class="date-button-label">{{ recordLabel }}</span>
			</el-button>	

			<DateRangePicker v-show="activeWidget === 'daterange'" :task="task"></DateRangePicker>
			<!-- <Record></Record> -->
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import DateRangePicker from '../DateRangePicker'
import Record from '../DateRangePicker'
import { GetRecord } from '@/constants/query.gql'

export default {
	components: {
		DateRangePicker,
		Record
	},
	props: ['task'],
	data() {
		return {
			getRecord: {}
		}
	},
	apollo: {
		getRecord: {
			query: GetRecord,
			varables() {
				return {
					task: this.task.id					
				}
			},
			error(err) {
				console.log(err)
			}
		}
	},
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
		},
		recordLabel() {
			if (!this.getRecord) return '0:00'
			return this.getRecord.timeSpent
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

.fa-calendar, .fa-clock {
	padding-right: 7px;
}

.date-button-label {
	font-size: 12px;
}
	
</style>