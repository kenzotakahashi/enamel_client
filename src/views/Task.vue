<template>
  <div class="container">
    <div v-if="task.parent">{{task.parent.name}}</div>
    <h4>{{task.name}}</h4>
    <div class="task-statebar columns">
      <div class="column col-2">
        <span>{{task.status}}</span>
      </div>
      <div class="column col-5">
        <span v-if="task.assignees.length > 0">TODO: Assignees</span>
        <span v-else>+ Add assignee</span>        
      </div>
      <div class="column col-5">
        <span class="creator">by {{task.creator.name}} at {{formatDate(task.createdAt)}}</span>        
      </div>
    </div>
    <div class="columns">
      <div class="column col-3">
        <span>Set Date</span>
      </div>
      <div class="column col-3">
        0.00
      </div>
      <div class="column col-3">
        <span v-if="task.subtasks.length > 0">{{formatSubtaskCount(task.subtasks)}}</span>
      </div>
      <div class="column col-3">
        <span class="shared-with">{{task.shareWith.length}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { GetTask } from '../constants/query.gql'
import moment from 'moment'

export default {
  data() {
    return {
      task: {
        parent: {},
        creator: {},
        assignees: [],
        subtasks: [],
        shareWith: []
      }
    }
  },
  apollo: {
    getTask: {
      query: GetTask,
      variables() {
        return {id: this.$route.params.taskId}
      },
      result({ data: {getTask} }) {
        console.log(getTask)
        this.task = getTask
      }
    },
  },
  methods: {
    formatDate(date) {
      // TODO show hours if it's today
      return moment(date).format('HH:mm')
    },
    formatSubtaskCount(subtasks) {
      const count = subtasks.length
      return `${count} subtask${count > 1 ? 's' : ''}`
    }
  }
}
</script>

<style scoped>
.task-statebar {
  border: solid 1px;
}

.creator {
  color: rgba(0,0,0,.56);
  font-size: 11px;
}

</style>