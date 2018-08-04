<template>
	<div class="grid" v-bind:style="gridConfig">
		<div v-for="(monday, i) in getMondays" :key="i" class="week"
			v-bind:style="{'grid-column': `${i * 7 + 1} / ${(i + 1) * 7 + 1}`}">
			{{ monday }}
		</div>
		<div v-for="(day, i) in days" :key="i" class="day-of-week"
			v-bind:style="{'grid-column': `${i+1} / ${i+2}` }">
			{{ day.format('dd')[0] }}
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import { GetTasks, UpdateTask } from '../constants/query.gql'

export default {
	props: ['id'],
	data() {
		return {
			tasks: [],
			days: [],
			gridConfig: {
				'grid-template-columns': '',
				'grid-template-rows': '',
			}
		}
	},
	computed: {
		getMondays() {
			if (this.days.length === 0) return []
			return [...Array(this.days.length / 7).keys()].map(
				o => this.days[o * 7].format('MMM DD, YYYY'))
		}
	},
	apollo: {
	  getTasks: {
	    query: GetTasks,
	    variables() {
	      return { folder: this.id }
	    },
	    pollInterval: 10000,
	    result({ data: { getTasks } }) {
	    	this.tasks = getTasks.filter(o => o.finishDate)
	    	// Last Sunday
	    	const start = moment(Math.min(...this.tasks.map(o => o.startDate))).day(-7)
	    	// This Sunday
	    	const end = moment(Math.max(...this.tasks.map(o => o.finishDate))).day(7)

	    	const days = []
	    	for (const i of [...Array(moment.duration(end.diff(start)).days()).keys()]) {
	    		days.push(moment(start).add(i+1, 'd'))
	    	}
	    	this.days = days

	    	this.gridConfig['grid-template-columns'] = days.map(
	    		 o => `[d${o.format('YYYY-MM-DD')}] 25px`).join(' ')

	    	let assignees = new Set()
	    	for (const id of [].concat(...this.tasks.map(o => o.assignees.map(p => p.id)))) {
					assignees.add(id)	    		
	    	}
	    	assignees = [...assignees].map(o => `[u${o}] 40px`).join(' ')
	    	this.gridConfig['grid-template-rows'] = `20px 20px ${assignees}`
	    },
	    error(error) {
	      console.error(error)
	    }
	  }
	}
}
</script>

<style scoped lang="scss">
.grid {
	display: grid;
	margin-top: 10px;
	background-color: #F6F6F6;
}

.week {
	grid-row: 1;
	text-align: center;
	font-size: 12px;
	background-color: #F6F6F6;
	border: 1px solid	rgba(0,0,0,.16);
	border-left: none;
}

.day-of-week {
	grid-row: 2;
	text-align: center;
	font-size: 12px;
	background-color: #F6F6F6;
	border: 1px solid	rgba(0,0,0,.16);
	border-top: none;	
	border-left: none;	
}

</style>