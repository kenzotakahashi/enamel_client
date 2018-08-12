<template>
	<div class="inner-space">
	  <div class="max-height wrapper">
	    <div class="white card max-height">
	    	<div v-for="log in getLogs" class="tree-item"
	    		v-bind:class="{active: $route.params.taskId === log.target.item._id}">
    			<router-link :to="{name: 'notification-task', params: {taskId: log.target.item._id}}"
    			  class="notification-container">
			      <avatar :obj="log.user" :size="32" class="task-avatar"></avatar>
  			    <div class="notification-body">
  			    	<div>
								<div class="user-name">{{ log.user.firstname }} {{ log.user.lastname }}</div>
								<div class="date">{{ formatDate(log.createdAt) }}</div>    			    		
  			    	</div>
  			    	<div v-if="log.body">
  			    		<div>{{ log.body }}</div>
  			    	</div>
  			    	<div v-else>
  			    		<div>created task</div>
  			    		<div class="task-title">{{ log.target.item.name }}</div>
  			    	</div>
  			    </div>
    			</router-link>
	    	</div>
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
				console.log(getLogs)
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

.wrapper {
	width: 50%;
}

.max-height {
  height: 100%;
}

.white.card {
  display: flex;
  flex-direction: column;
}

.tree-item:hover {
  background-color: $hover;
}
.tree-item.active {
  background-color: #4488ff29;
}

.task-title {
	padding-left: 10px;
	color: rgba(0,0,0,.9);
  white-space: nowrap;
}

.task-avatar {
  margin-right: 10px;
  align-self: center;
}

.user-name {
	font-weight: 600;
	font-size: 12px;
	color: rgba(0,0,0,.9);
}

.date {
	margin-left: 10px;
	font-size: 12px;
	color: rgba(0, 0, 0, 0.56);
}

.notification-container {
  display: flex;
  width: 100%;
  padding: 5px 0 5px 10px;
}

.notification-body {
	div {
		display: flex;
		line-height: 22px;
	}
	&:last-child {
		font-size: 14px;
	}
}

</style>