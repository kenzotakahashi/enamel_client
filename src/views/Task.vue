<template>
  <div class="white container">
    <TaskHeader :task="task"></TaskHeader>
    <div class="task-statebar columns">
      <div class="column col-2">
        <span>{{task.status}}</span>
      </div>
      <div class="column col-5">
        <span v-if="task.assignees.length > 0">TODO: Assignees</span>
        <span v-else>+ Add assignee</span>        
      </div>
      <div class="column col-5">
        <span class="small-text">by {{task.creator.name}} at {{formatDate(task.createdAt)}}</span>        
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
        <span v-if="subtasks.length > 0">{{formatSubtaskCount(subtasks)}}</span>
        <span v-else>Add subtask</span>
      </div>
      <div class="column col-3">
        <span class="shared-with">{{task.shareWith.length}}</span>
      </div>
    </div>
    <TaskTree
      class="item task-list-group"
      v-for="model in subtasks" :key="model.id" :model="model">
    </TaskTree>
    <TaskForm :parentId="taskId"></TaskForm>
    <div class="description-field">
      <span class="description-text">Click to add the description</span>
    </div>
    <Comments :comments="task.comments"></Comments>
    <CommentBox></CommentBox>
  </div>
</template>

<script>
import { GetTask, GetTasks } from '../constants/query.gql'
import { formatDate } from '@/helpers/helpers'
import TaskHeader from '@/components/TaskHeader'
import TaskTree from '@/components/TaskTree'
import TaskForm from '@/components/TaskForm'
import Comments from '@/components/Comments'
import CommentBox from '@/components/CommentBox'

export default {
  components: {
    TaskHeader,
    TaskTree,
    TaskForm,
    Comments,
    CommentBox
  },
  props: ['taskId'],
  data() {
    return {
      formatDate,
      task: {
        parent: {},
        creator: {},
        folders: [],
        assignees: [],
        shareWith: [],
        comments: []
      },
      subtasks: [],
    }
  },
  apollo: {
    getTask: {
      query: GetTask,
      variables() {
        return {id: this.taskId}
      },
      result({ data: { getTask } }) {
        this.task = getTask
      }
    },
    getTasks: {
      query: GetTasks,
      variables() {
        return { parent: this.task.id }
      },
      skip() {
        return !this.task.id
      },
      result({ data: {getTasks} }) {
        this.subtasks = getTasks
      },
    }
  },
  methods: {
    formatSubtaskCount(subtasks) {
      const count = subtasks.length
      return `${count} subtask${count > 1 ? 's' : ''}`
    },
  }
}
</script>

<style scoped>

</style>