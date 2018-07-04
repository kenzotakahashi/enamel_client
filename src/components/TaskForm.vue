<template>
  <div>
    <div v-show="isFormOpen">
      <input @focusout="closeForm" @keyup.enter="createTask" @keyup.esc="closeForm"
        class="task-form" ref="taskform" type="text" name="task"
        v-model="newTaskName" placeholder="Enter title for new task"></input>
    </div>
    <div v-show="!isFormOpen" @click="openForm" class="btn btn-sm">+ New task</div>
  </div>
</template>

<script>
import { GetFolder, GetTask, CreateTask } from '../constants/query.gql'
import shortid from 'shortid'

export default {
  props: ['parentId'],
  data() {
    return {
      isFormOpen: false,
      newTaskName: '',
    }
  },
  methods: {
    openForm() {
      this.isFormOpen = true
      this.$nextTick(() => this.$refs.taskform.focus())
    },
    closeForm() {
      this.isFormOpen = false
    },
    createTask() {
      if (!this.newTaskName) return
      const id = this.$route.params.id
      if (this.parentId) {
        this.createSubtask(id, this.parentId)
      } else {
        this.createToptask(id)
      }
    },
    createToptask(id) {
      this.$apollo.mutate({
        mutation: CreateTask,
        variables: {
          folder: id,
          parent: null,
          name: this.newTaskName
        },
        update: (store, { data: { createTask } }) => {
          try {
            const data = store.readQuery({
              query: GetFolder,
              variables: {id}
            })
            data.getFolder.tasks.unshift(createTask)
            store.writeQuery({
              query: GetFolder,
              variables: {id},
              data
            })
          } catch(err) {
          }
        }
      }).then(({ data: { createTask } }) => {
        this.newTaskName = ''
      }).catch((error) => {
        console.log(error)
      })
    },
    createSubtask(id, parent) {
      this.$apollo.mutate({
        mutation: CreateTask,
        variables: {
          folder: null,
          parent,
          name: this.newTaskName
        },
        update: (store, { data: { createTask } }) => {
          try {
            const data = store.readQuery({
              query: GetTask,
              variables: { id: parent }
            })
            console.log(data.getTask)
            console.log(createTask)
            data.getTask.subtasks.push(createTask)
            store.writeQuery({
              query: GetTask,
              variables: { id: parent },
              data
            })
          } catch(err) {
          }
        }
      }).then(({ data: { createTask } }) => {
        this.newTaskName = ''
        this.$router.replace({
          name: "task",
          params: {id, taskId: parent},
          query: { refetch: shortid.generate() }
        })
      }).catch((error) => {
        console.log(error)
      })
    },
  }
}

</script>

<style scoped>

</style>