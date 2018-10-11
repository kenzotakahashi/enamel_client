<template>
	<div>
		<div class="grid" v-bind:style="gridConfig">
			<div v-for="(monday, i) in getMondays" :key="monday" class="week"
				v-bind:style="{'grid-column': `${i * 7 + 2} / ${(i + 1) * 7 + 2}`}">
				{{ monday }}
			</div>
			<div v-for="(day, i) in days" :key="`day${i}`" class="day-of-week"
				v-bind:style="{'grid-column': `${i+2} / ${i+3}` }">
				{{ day.format('dd')[0] }}
			</div>
			<div v-for="i in getWeekends" :key="`saturday-${i}`" class="saturday"
				v-bind:style="{'grid-column': `${i * 7 + 7}` }">
			</div>		
			<div v-for="i in getWeekends" :key="`sunday-${i}`" class="sunday"
				v-bind:style="{'grid-column': `${i * 7 + 8}` }">
			</div>		

			<div v-for="user in users" :key="user.id" class="user"
				v-bind:style="{
					'grid-column': `1`,
					'grid-row': `u${user.id}-0 / span ${assignees[user.id].slots}`
				}">
				<avatar :obj="user" :size="24" class="user-avatar"></avatar>
				<span>{{ user.name }}</span>
			</div>
			<div v-for="t in tasks" :key="`${t.task.id}-${t.assignee}`" class="task"
				@click="showTaskModal(t.task.id)"
				v-bind:style="{
					'grid-column': `d${moment(t.task.startDate).format('YYYY-MM-DD')} /
													d${moment(t.task.finishDate).format('YYYY-MM-DD')}`,
					'grid-row': `u${t.assignee}-${t.slot}`,
					'align-self': t.slot ? 'start' : 'center',
					'background-color': borderColorMap[t.task.status]
				}">
				<div>{{ t.task.name }}</div>
			</div>

			<div class="today" v-bind:style="{'grid-column': `d${moment().format('YYYY-MM-DD')}` }"></div>
		</div>

	  <div v-if="showTask"
	   	class="modal-mask" @click="showTask = false">
	    <div class="modal-wrapper">
	      <div class="modal-container" @click.stop="$store.dispatch('changeActiveWidget', null)">
	      	<Task :taskId="taskId"></Task>
	      </div>
	    </div>
	  </div>
	</div>

</template>

<script>
import moment from 'moment'
import { GetAllTasks, UpdateTask } from '../constants/query.gql'
import { borderColorMap } from '@/helpers/helpers'
import Task from '@/views/Task'

function rearrangeTasks (tasks) {
	const sorted = tasks.sort((a,b) => a.startDate - b.startDate)
	const rearraned = [{
		slot: 0,
		task: sorted[0]
	}]
	const slots = [sorted[0].finishDate]
	for (const task of sorted.slice(1)) {
		const set = false
		for (const [i, slot] of slots.entries()) {
			if (task.startDate >= slot) {
				slots[i] = task.finishDate
				rearraned.push({ slot: i, task })
				set = true
				break
			}
		}
		if (!set) {
			slots.push(task.finishDate)
			rearraned.push({ slot: slots.length - 1, task })
		}
	}
	return {
		slots: slots.length,
		tasks: rearraned
	}
}

export default {
	props: ['id'],
	components: {
		Task
	},
	data() {
		return {
			moment,
			borderColorMap,
			showTask: false,
			taskId: null,
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
			return [...Array(this.days.length / 7).keys()].map(
				o => this.days[o * 7].format('MMM DD, YYYY'))
		},
		getWeekends() {
			return [...Array(this.days.length / 7).keys()]
		}
	},
	apollo: {
	  getAllTasks: {
	    query: GetAllTasks,
	    variables() {
	      return { folder: this.id }
	    },
	    pollInterval: 10000,
	    result({ data: { getAllTasks } }) {
	    	const tasks = getAllTasks.filter(o => o.finishDate)
	    	// Last Sunday
	    	const start = moment(Math.min(...tasks.map(o => o.startDate))).day(-7)
	    	// This Sunday
	    	const end = moment(Math.max(...tasks.map(o => o.finishDate))).day(7)
				const diff = end.diff(start, 'days') 
				if (!diff) return

				const days = []
				for (const i of [...Array(diff).keys()]) {
					days.push(moment(start).add(i+1, 'd'))
				}
				this.days = days

	    	this.gridConfig['grid-template-columns'] = '170px ' + days.map(
	    		 o => `[d${o.format('YYYY-MM-DD')}] 25px`).join(' ')

	    	const users = []
	    	const assignees = {}
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
	    	this.tasks = []
	    	let rows = []
	    	for (const id in assignees) {
	    		const rearraned = rearrangeTasks(assignees[id])
	    		assignees[id] = rearraned
	    		this.tasks = this.tasks.concat(rearraned.tasks.map(o => ({ ...o, assignee: id })))
	    		rows = rows.concat([...Array(rearraned.slots).keys()].map(
	    			o => `[u${id}-${o}] ${o ? 30 : 35}px`))
	    	}
	    	this.assignees = assignees
				this.users = users	    	

	    	this.gridConfig['grid-template-rows'] = `20px 20px ${rows.join(' ')} [end]`
	    },
	    error(error) {
	      console.error(error)
	    }
	  }
	},
	methods: {
		showTaskModal(id) {
			this.taskId = id
			this.showTask = true
		}
	}
}
</script>

<style scoped lang="scss">

.grid {
	display: grid;
	margin-top: 10px;
	border: 1px solid	rgba(0,0,0,.16);
	border-left: 0;
	border-right: 0;
}

.week {
	grid-row: 1;
	text-align: center;
	font-size: 12px;
	background-color: #F6F6F6;
	border: 1px solid	rgba(0,0,0,.16);
	border-top: 0;
	+ .week {
		border-left: 0;
	}
}
.Dark .week {
	background-color: $dark-background3;
}

.day-of-week {
	grid-row: 2;
	text-align: center;
	font-size: 12px;
	background-color: #F6F6F6;
	border: 1px solid	rgba(0,0,0,.16);
	border-top: 0;	
	+ .day-of-week {
		border-left: 0;
	}
}
.Dark .day-of-week {
	background-color: $dark-background3;
}

.saturday, .sunday {
	grid-row: 3 / end;
	background-color: #F3F3F3;
}
.Dark .saturday, .Dark .sunday {
	background-color: $dark-background3;
}

.saturday {
	margin-right: 1px;
}

.sunday {
	margin-left: 1px;
	border-right: 1px solid	rgba(0,0,0,.16);
}

.today {
	grid-row: 1 / end;
	border-left: 1px solid red;
}

.task {
	overflow: hidden;
	white-space: nowrap;
	cursor: pointer;
	font-size: 12px;
	border: 1px solid	rgba(0,0,0,.16);
	margin: 0 1px;
	div {
		padding: 2px 0;
		height: 20px;
	}
}

.user {
	font-size: 12px;
	display: flex;
	align-self: center;
	align-items: center;
	height: 100%;
	border: 1px solid	rgba(0,0,0,.16);
	border-bottom: 0;
}

.user-avatar {
	margin: 0 5px;
}

.modal-container {
  width: 600px;
  padding: 0;
  .card {
  	margin: 0;
  }
}

</style>