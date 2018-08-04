<template>
	<div class="grid" v-bind:style="gridConfig">
		<div v-for="(monday, i) in getMondays" :key="monday" class="week"
			v-bind:style="{'grid-column': `${i * 7 + 2} / ${(i + 1) * 7 + 2}`}">
			{{ monday }}
		</div>
		<div v-for="(day, i) in days" :key="`day${i}`" class="day-of-week"
			v-bind:style="{'grid-column': `${i+2} / ${i+3}` }">
			{{ day.format('dd')[0] }}
		</div>
		<div v-for="user in users" :key="user.id" class="user"
			v-bind:style="{
				'grid-column': `1`,
				'grid-row': `u${user.id}`
			}">
			<avatar :obj="user" :size="24" class="user-avatar"></avatar>
			<span>{{ user.name }}</span>
		</div>
		<div v-for="t in tasks" :key="`${t.task.id}-${t.assignee}`" class="task"
			v-bind:style="{
				'grid-column': `d${moment(t.task.startDate).format('YYYY-MM-DD')} /
												d${moment(t.task.finishDate).format('YYYY-MM-DD')}`,
				'grid-row': `u${t.assignee}`
			}">
			{{ t.task.name }}
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
			moment,
			tasks: [],
			days: [],
			users: [],
			assignees: {},
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
	    	const tasks = getTasks.filter(o => o.finishDate)
	    	// Last Sunday
	    	const start = moment(Math.min(...tasks.map(o => o.startDate))).day(-7)
	    	// This Sunday
	    	const end = moment(Math.max(...tasks.map(o => o.finishDate))).day(7)

	    	const days = []
	    	for (const i of [...Array(moment.duration(end.diff(start)).days()).keys()]) {
	    		days.push(moment(start).add(i+1, 'd'))
	    	}
	    	this.days = days

	    	this.gridConfig['grid-template-columns'] = '170px ' + days.map(
	    		 o => `[d${o.format('YYYY-MM-DD')}] 25px`).join(' ')

	    	const users = []
	    	const assignees = {}
	    	this.tasks = []
	    	for (const task of tasks) {
	    		for (const a of task.assignees) {
	    			if (assignees[a.id]) {
	    				assignees[a.id].push(task)
	    			} else {
	    				assignees[a.id] = [task]
	    				users.push(a)
	    			}
	    			this.tasks.push({task, assignee: a.id})
	    		}
	    	}
	    	this.assignees = assignees
	    	this.users = users
	    	console.log(users)

	    	const ids = users.map(o => `[u${o.id}] 40px`).join(' ')
	    	this.gridConfig['grid-template-rows'] = `20px 20px ${ids}`
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
	background-color: #fff;
}

.week {
	grid-row: 1;
	text-align: center;
	font-size: 12px;
	background-color: #F6F6F6;
	border: 1px solid	rgba(0,0,0,.16);
	&not(:first) {
		border-left: none;
	}
}

.day-of-week {
	grid-row: 2;
	text-align: center;
	font-size: 12px;
	background-color: #F6F6F6;
	border: 1px solid	rgba(0,0,0,.16);
	border-top: none;	
	&not(:first) {
		border-left: none;
	}
}

.task {
	white-space: nowrap;
	font-size: 12px;
	background-color: #98DCE8;
	border: 1px solid	rgba(0,0,0,.16);
}

.user {
	font-size: 12px;
	display: flex;
	align-self: center;
	align-items: center;
}

.user-avatar {
	margin: 0 5px;
}

</style>