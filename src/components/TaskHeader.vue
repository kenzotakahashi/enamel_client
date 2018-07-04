<template>
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
</template>

<script>
import { UpdateTask, DeleteTask } from '../constants/query.gql'

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
  props: ['task'],
  data() {
    return {
      taskName: this.task.name
    }
  },
  watch: {
    task() {
      this.taskName = this.task.name
    }
  },
  methods: {
    updateTask(e) {
      const id = this.task.id
      const name = this.taskName
      if (name === this.task.name) return
      this.$apollo.mutate({
        mutation: UpdateTask,
        variables: { id, name },
        optimisticResponse: {
          __typename: "Mutation",
          updateTask: {
            id,
            __typename: "Task",
            ...this.task,
            name
          }
        }
      }).then(({ data: { createTask } }) => {
        this.cancel(e)
      }).catch((error) => {
        console.log(error)
      })
    },
    deleteTask() {
      const taskId = this.task.id
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
