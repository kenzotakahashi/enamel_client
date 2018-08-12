<template>
  <el-row class="comment-box">
    <el-col :span="20">
      <input class="no-outline" type="text" name="comment" v-model="form.body"
        placeholder="Add comment"></input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" size="small" @click="createComment">Send</el-button>
    </el-col>
  </el-row>
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
      const target = this.parent
      this.$apollo.mutate({
        mutation: CreateComment,
        variables: {
          target: {
            "kind": "Task",
            "item": target
          },
          body: this.form.body
        },
        update: (store, { data: { createComment } }) => {
          try {
            const data = store.readQuery({
              query: GetComments,
              variables: {target}
            })
            data.getComments.push(createComment)
            store.writeQuery({
              query: GetComments,
              variables: {target},
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

<style scoped lang="scss">
.comment-box {
  color: rgba(0,0,0,.56);
  margin-top: 10px;
  padding: 12px;
  border-top: 1px solid;
  border-color: rgba(0,0,0,.16);
  position: relative;
  bottom: 0;
  left: 0;
}
</style>
