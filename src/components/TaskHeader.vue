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
import { UpdateTask, DeleteTask, GetTasks } from '../constants/query.gql'

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
      }).then(({ data: { createTask } }) => {
        this.cancel(e)
      }).catch((error) => {
        console.log(error)
      })
    },
    deleteTask() {
      const id = this.task.id
      const folderId = this.$route.params.id

      this.$apollo.mutate({
        mutation: DeleteTask,
        variables: {id},
        update: (store, data) => {
          const parent = this.task.parent ? this.task.parent.id : undefined
          const folders = parent ? [undefined] : this.task.folders.map(o => o.id)
          for (const folder of folders) {
            const variables = {folder, parent}
            const query = GetTasks
            try {
              const data = store.readQuery({ query, variables })
              data.getTasks.splice(data.getTasks.findIndex(o => o.id === id), 1)
              store.writeQuery({ query, variables, data })
            } catch(err) {
              console.log(err)
            }
          }
        }
      }).then(() => {
        this.$router.replace({
          name: "folder",
          params: {id: folderId},
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

.icon {
  padding: 0 7px;
  cursor: pointer;
}
.icon:hover {
  color: #48f;
}
</style>