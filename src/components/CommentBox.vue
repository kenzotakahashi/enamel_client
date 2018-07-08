<template>
  <div class="comment-box container">
    <div class="columns">
      <span class="column col-10">
        <input class="no-outline" type="text" name="comment" v-model="form.body"
          placeholder="Add comment"></input>
      </span>
      <span class="column col-2">
        <span @click="createComment" class="btn btn-primary btn-sm">Send</span>
      </span>
    </div>
  </div>
</template>

<script>
import { GetComments, CreateComment } from '../constants/query.gql'

export default {
  props: ['parent'],
  data() {
    return {
      form: {
        body: ''
      }
    }
  },
  methods: {
    createComment() {
      if (!this.form.body) return
      const parent = this.parent
      this.$apollo.mutate({
        mutation: CreateComment,
        variables: {
          parent: {
            "kind": "Task",
            "item": parent
          },
          body: this.form.body
        },
        update: (store, { data: { createComment } }) => {
          try {
            const data = store.readQuery({
              query: GetComments,
              variables: {parent}
            })
            data.getComments.push(createComment)
            store.writeQuery({
              query: GetComments,
              variables: {parent},
              data
            })
          } catch(err) {
            console.log(err)
          }
        }
      }).then(() => {
        this.form.body = ''
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

</script>

<style scoped>

</style>
