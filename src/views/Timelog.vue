<template>
	<div class="inner-space">
	  <div class="max-height">
	    <div class="white card max-height">
	    	<div class="user-list">
	    		<div class="name">{{selectedUser.name}}</div>
	    		<router-link v-for="user in getUsers" :key="user.id" class="user"
	    			:to="{name: 'timelog', params: {id: user.id, year, month}}" >
	    			<avatar :obj="user" :size="24" class="user-avatar"
              :selected="user.id === id"
	    			></avatar>
	    		</router-link>
	    	</div>
	    	<div class="timelog-info">
	    		<router-link :to="{name: 'timelog', params: getParam('previous')}" class="angle">
	    			<i class="fas fa-angle-left"></i>
	    		</router-link>
	    		<div class="month">{{moment({month: month-1}).format('MMMM')}} {{year}}</div>
	    		<router-link :to="{name: 'timelog', params: getParam('next')}" class="angle">
	    			<i class="fas fa-angle-right"></i>
	    		</router-link>
	    	</div>
	    	<div class="timelog-view" v-bind:style="gridConfig">
	    		<div v-for="l in [1,2,3,4,5]" class="line vertical" v-bind:style="{'grid-column': l}"></div>

	    		<div v-for="d in getDays()" :key="`${d}line`" class="line horizontal"
	    			v-bind:style="{'grid-row': `d${d}`}">
	    		</div>

					<div v-for="d in getDays()" :key="`${d}day`" class="day"
						v-bind:style="{'grid-row': `d${d}` }">
						{{d}}
					</div>
					<div v-for="d in getDays()" :key="`${d}log`" class="total-time-day"
						v-bind:style="{'grid-row': `d${d}` }">
						{{totalTimeForDay(d)}}
					</div>

					<div v-for="record in getRecords" :key="`${record.id}log`" class="time-spent"
						v-bind:style="recordRow(record)"
						@click.stop="showRecordForm(record)">
						{{formatRecord(record.timeSpent)}}							
					</div>
					<div v-for="record in getRecords" :key="`${record.id}name`" class="task-name"
						v-bind:style="recordRow(record)"
						@click="showTaskModal(record.task.id)">
						{{record.task.name}}
					</div>
					<div v-for="record in getRecords" :key="`${record.id}comment`" class="comment"
						v-bind:style="recordRow(record)" >
						{{record.comment}}
					</div>
	    	</div>

		    <Record v-if="activeWidget === 'record-form'"
		    	:task="selectedRecord.task" :record="selectedRecord"
		    	v-bind:style="{'top': '0px', 'right': '0px'}"></Record>
	    </div>
		</div>

		<div v-if="showTask"
		 	class="modal-mask" @click="showTask = false">
		  <div class="modal-wrapper">
		    <div class="modal-container" @click.stop="$store.dispatch('changeActiveWidget', null)">
		    	<Task :taskId="taskId" :isModal="true"></Task>
		    </div>
		  </div>
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { GetUser, GetUsers, GetRecords } from '@/constants/query.gql'
import Task from './Task'
import Record from '@/components/Record'

export default {
	components: {
		Task,
		Record
	},
	props: ['id','year','month'],
	data() {
		return {
			moment,
			getUsers: [],
			getRecords: [],
			gridConfig: {
				'grid-template-columns': '35px 55px 55px 350px auto',
				'grid-template-rows': ''
			},
			end: moment({year: this.year, month: this.month - 1}).endOf('month').date(),
			showTask: false,
			taskId: null,
			selectedRecord: {}
		}
	},
	computed: {
		selectedUser() {
			return this.getUsers.find(o => o.id === this.id) || {}
		},
		...mapState(['activeWidget'])
	},
	apollo: {
	  getUsers: {
	    query: GetUsers,
	    pollInterval: 10000
	  },
	  getRecords: {
	  	query: GetRecords,
	  	variables() {
	  		return {
	  			id: this.id,
	  			date: moment({ year: this.year, month: this.month - 1}).format('YYYY-MM-DD')
	  		}
	  	},
	  	result({data: {getRecords}}) {
	  		let row = [...Array(this.end+1).keys()].map(o => `[d${o}] 25px`)
	  		for (const record of getRecords) {
	  			const date = moment(record.date).date()
  				row[date] = `${row[date]} [d${date}_${record.id}] 25px`
	  		}
	  		this.gridConfig['grid-template-rows'] = row.slice(1).join(' ')
	  	},
	    pollInterval: 10000,
	  }
	},
	methods: {
		getDays() {
			return [...Array(this.end+1).keys()].slice(1)
		},
		recordRow(record) {
			return {'grid-row': `d${moment(record.date).date()}_${record.id}` }
		},
		formatRecord(t) {
			const [h, m] = t.split(':')
			return m === '0' ? h : t
		},
		totalTimeForDay(d) {
			const records = this.getRecords.filter(
				o => moment(o.date).date() === d).map(
				p => p.timeSpent.split(':').map(q => parseInt(q)))
			const hours = records.map(o => o[0]).reduce((a,b) => a+b, 0)
			const minutes = records.map(o => o[1]).reduce((a,b) => a+b, 0)
			const h = hours + Math.floor(minutes / 60)
			const m = minutes % 60
			return m ? `${h}:${m}` : h
		},
		getParam(c) {
			const id = this.id
			const year = parseInt(this.year)
			const month = parseInt(this.month)
			if (c === 'next') {
				return month === 12
					? {id, year: year+1, month: 1}
					: {id, year, month: month+1}
			} else {
				return month === 1
					? {id, year: year-1, month: 12}
					: {id, year, month: month-1}
			}
		},
		showTaskModal(id) {
			this.taskId = id
			this.showTask = true
		},
		showRecordForm(record) {
			this.selectedRecord = record
			this.$store.commit('changeActiveWidget', 'record-form')
		}
	}
}
</script>

<style scoped lang="scss">

.inner-space > .max-height {
	width: 100%;
}

.user-list {
	display: flex;
	padding: 10px;
}
.user {
	margin: 0 5px;
}
.name {
	width: 170px;
}

.timelog-info {
	display: flex;
	padding: 10px;
	margin-bottom: 10px;
}
.month {
	width: 200px;
	text-align: center;
}
.angle {
	padding: 0 10px;
	height: 100%;
	i {
		font-size: 16px;		
	}
}

.timelog-view {
	display: grid;
	overflow: scroll;
}

.horizontal {
	grid-column: 1 / 6;
	border-top: 1px solid rgba(0,0,0,.16);
}
.vertical {
	grid-row: 1 / end;
	border-right: 1px solid rgba(0,0,0,.16);
}

.day {
	grid-column: 1;
	padding: 0 5px;
}

.total-time-day {
	grid-column: 2;
	padding: 0 5px;
}

.task-name {
	grid-column: 4;
	padding: 0 5px;
	border-top: 1px solid rgba(0,0,0,.16);
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	cursor: pointer;
}

.comment {
	grid-column: 5;
	padding: 0 5px;
	border-top: 1px solid rgba(0,0,0,.16);
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.time-spent {
	grid-column: 3;
	padding: 0 5px;
	border-top: 1px solid rgba(0,0,0,.16);
	cursor: pointer;
}

.time-spent:hover, .task-name:hover {
	background-color: $hover;
}
.Dark .time-spent:hover, .Dark .task-name:hover {
	background-color: $dark-hover;
}

.modal-container {
  width: 600px;
  padding: 0;
  .card {
  	margin: 0;
  }
}
</style>