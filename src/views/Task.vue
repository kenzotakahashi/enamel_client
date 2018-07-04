<template>
  <div class="white container">
    <div class="task-view-header columns">
      <div class="column col-8">
        <div v-if="task.parent">{{task.parent.name}}</div>
        <div>
          <input type="text" name="taskname" ref="taskname" v-model="taskName"
            @keyup.enter="updateTask" @keyup.esc="cancel">
          </input>
        </div>
      </div>
      <div class="column col-4">
        <span class="icon">
          <i class="far fa-star"></i>
        </span>
        <span class="icon">
          <i class="fas fa-thumbtack"></i>
        </span>
        <span class="icon">
          <i class="fas fa-link"></i>
        </span>
        <span class="icon dropdown">
          <i class="fas fa-ellipsis-h"></i>
          <div class="dropdown-content">
            <div>Make reccurent</div>
            <div>Duplicate task</div>
            <div>Request status update</div>
            <div>Print</div>
            <hr></hr>
            <div>Enter full screeen</div>
            <div>Open task in separate tab</div>
            <hr></hr>
            <div @click="deleteTask">Delete task</div>
            <hr></hr>
            <div>Close panel</div>
          </div>
        </span>
      </div>
      <span v-for="folder in task.folders">
        <span class="folder-tag">{{ folder.name }}</span>
      </span>
      <span>
        <span>+</span>        
      </span>
    </div>
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
        <span v-if="task.subtasks.length > 0">{{formatSubtaskCount(task.subtasks)}}</span>
        <span v-else>Add subtask</span>
      </div>
      <div class="column col-3">
        <span class="shared-with">{{task.shareWith.length}}</span>
      </div>
    </div>
    <TaskTree
      class="item task-list-group"
      v-for="model in task.subtasks" :key="model.id" :model="model">
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
import { GetTask, UpdateTask, DeleteTask, GetFolder } from '../constants/query.gql'
import { formatDate } from '@/helpers/helpers'
import TaskTree from '@/components/TaskTree'
import TaskForm from '@/components/TaskForm'
import Comments from '@/components/Comments'
import CommentBox from '@/components/CommentBox'

function deleteTaskInFolder(id, tasks) {
  // Only works for a non-subtask
  for (const [i, task] of tasks.entries()) {
    if (task.id === id) {
      tasks.splice(i, 1)
      return true
    }
    deleteTaskInFolder(id, task.subtasks)    
  }
}

export default {
  components: {
    TaskTree,
    TaskForm,
    Comments,
    CommentBox
  },
  props: ['taskId'],
  data() {
    return {
      formatDate,
      taskName: '',
      option: false,
      task: {
        parent: {},
        creator: {},
        folders: [],
        assignees: [],
        subtasks: [],
        shareWith: [],
        comments: []
      }
    }
  },
  apollo: {
    getTask: {
      query: GetTask,
      variables() {
        return {id: this.taskId}
      },
      result({ data: {getTask} }) {
        // console.log(getTask)
        this.task = getTask
        this.taskName = getTask.name
      }
    },
  },
  methods: {
    formatSubtaskCount(subtasks) {
      const count = subtasks.length
      return `${count} subtask${count > 1 ? 's' : ''}`
    },
    updateTask(e) {
      const id = this.taskId
      const name = this.taskName
      if (name === this.task.name) return
      // this.$apollo.mutate({
      //   mutation: UpdateTask,
      //   variables: { id, name },
      //   optimisticResponse: {
      //     __typename: "Mutation",
      //     updateTask: {
      //       id,
      //       __typename: "Task",
      //       ...this.task,
      //       name
      //     }
      //   }
      // }).then(({ data: { createTask } }) => {
      //   this.cancel(e)
      // }).catch((error) => {
      //   console.log(error)
      // })
    },
    deleteTask() {
      const taskId = this.taskId
      const id = this.$route.params.id
      const parent = this.task.parent ? this.task.parent.id : null
      this.$apollo.mutate({
        mutation: DeleteTask,
        variables: { id: taskId, parent },
      }).then((result) => {
        this.$router.replace({
          name: "folder",
          params: {id},
          query: { refetch: 'true' }
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    cancel(e) {
      e.target.blur()
    }
  }
}
</script>

<style scoped>
.task-view-header {
  padding: 10px;
}

.new-task {
  position: relative;
  left: 30px;
}

.icon {
  padding: 0 7px;
  cursor: pointer;
}
.icon:hover {
  color: #48f;
}

</style>