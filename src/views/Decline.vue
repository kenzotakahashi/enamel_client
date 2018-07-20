<template>
  <el-container>
    <el-header height="52px">
      <navigation></navigation>
    </el-header>

    <el-main>
      <el-row>
        <el-col :span="6" :offset="9" justify="center">
          <div>Invitation declined.</div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

</template>

<script>
import { Decline } from '../constants/query.gql'

export default {
  mounted() {
    this.decline()
  },
  methods: {
    async decline() {
      this.$apollo.mutate({
        mutation: Decline,
        variables: { id: this.$route.params.id }
      }).then(async (data) => {
      }).catch((error) => {
        console.log(error)
      })
    },
  }
}
</script>

<style scoped>
.el-button {
  width: 100%;
}
</style>
