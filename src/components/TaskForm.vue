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
import { GetTasks, GetTask, CreateTask } from '../constants/query.gql'
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
      const parent = this.parentId
      const folder = parent ? undefined : this.$route.params.id
      this.$apollo.mutate({
        mutation: CreateTask,
        variables: {
          folder,
          parent,
          name: this.newTaskName
        },
        update: (store, { data: { createTask } }) => {
          try {
            const data = store.readQuery({
              query: GetTasks,
              variables: {folder, parent}
            })
            if (parent) {
              data.getTasks.push(createTask)
            } else {
              data.getTasks.unshift(createTask)
            }
            store.writeQuery({
              query: GetTasks,
              variables: {folder, parent},
              data
            })
          } catch(err) {
            console.log(err)
          }
        }
      }).then(() => {
        this.newTaskName = ''
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

</script>

<style scoped>

</style>