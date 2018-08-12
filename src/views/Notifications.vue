<template>
	<div class="inner-space">
	  <div class="max-height wrapper">
	    <div class="white card max-height">
	    	<router-link
	    		:to="{name: 'notification-task', params: {id: log.id, taskId: log.target.item._id}}"
	    		v-for="log in getLogs" :key="log.id"
	    		class="notification-container"
	    		v-bind:class="{active: $route.params.id === log.id}">

					<div class="date">{{ formatDate(log.createdAt) }}</div>    			    		
	    		<div class="task-title">{{ log.target.item.name }}</div>

		      <avatar class="notification-avatar" :obj="log.user" :size="32" ></avatar>
			    <div class="notification-body">
						<span class="user-name">{{ log.user.firstname }} {{ log.user.lastname[0] }}</span>
			    	<span v-if="log.body">{{ log.body }}</span>
			    	<span v-else>created task</span>
			    </div>
  			</router-link>
	    </div>
		</div>
		<div v-if="subRoute==='task'" class="subspace">
		  <Task :taskId="$route.params.taskId"></Task>
		</div>		
	</div>
</template>

<script>
import moment from 'moment'
import { GetLogs, UpdateUser } from '@/constants/query.gql'
import { formatDate } from '@/helpers/helpers'
import Task from './Task'

export default {
	components: {
		Task
	},
	data() {
		return {
			moment,
			formatDate,
			getLogs: [],
			subRoute: ''
		}
	},
	beforeRouteUpdate (to, from, next) {
	  this.subRoute = to.name
	  next()
	},
	mounted() {
	  if (this.$route.params.taskId) {
	    this.subRoute = 'task'
	  }
	  this.$store.commit('setNotification', false)
	  if (document.title[0] === '*') {
	    document.title = document.title.slice(2)            
	  }
	  this.$apollo.mutate({
	  	mutation: UpdateUser,
	  	variables: {
	  		input: {
	  			readNotificationsAt: moment().valueOf()
	  		}
	  	}
	  }).then(() => {
	  }).catch((error) => {
	    console.log(error)
	  })
	},
	apollo: {
		getLogs: {
			query: GetLogs,
			pollInterval: 10000,
			result({data: {getLogs}}) {
				// console.log(getLogs)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.inner-space {
  display: flex;
  height: 100%;
}

.subspace {
  width: 50%;
  height: 100%;
}

.wrapper {
	width: 50%;
}

.max-height {
  height: 100%;
}

.white.card {
  display: flex;
  flex-direction: column;
  overflow: scroll;
}

.notification-container {
	box-sizing: border-box;
  display: grid;
  grid-template-columns: 44px 1fr;
  grid-template-rows: 24px 32px;
  grid-row-gap: 4px;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
	font-size: 12px;
  &:hover {
    background-color: $hover;
  }
  &.active {
    background-color: #4488ff29;
  }
}

.date {
	grid-column: 1;
	grid-row: 1;
	color: rgba(0, 0, 0, 0.56);
}

.task-title {
	grid-column: 2;
	grid-row: 1;
	font-size: 14px;
	color: rgba(0, 0, 0, 0.56);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.notification-avatar {
  grid-column: 1;
  grid-row: 2;
  margin-right: 10px;
  align-self: center;
}

.notification-body {
	grid-column: 2;
	grid-row: 2;
	color: rgba(0,0,0,.9);
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.user-name {
	margin-right: 5px;
	font-weight: 600;
	font-size: 12px;
}

</style>