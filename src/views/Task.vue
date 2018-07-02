<template>
  <div class="container">
    Task
  </div>
</template>

<script>
// import { GetFolder } from '../constants/query.gql'

export default {
  data() {
    return {
      folder: {}
    }
  },
  // apollo: {
  //   getFolder: {
  //     query: GetFolder,
  //     variables() {
  //       return {id: this.$route.params.id}
  //     },
  //     result({ data }) {
  //       this.folder = data.getFolder
  //     }
  //   },
  // }
}
</script>

<style>

</style>