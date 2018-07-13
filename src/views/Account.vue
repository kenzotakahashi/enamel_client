<template>
  <el-container>
    <el-header height="52px">
      <Navigation></Navigation>
    </el-header>

    <el-container class="white account" :style="styleObj">
      <h2>Users & Groups</h2>
      <el-row>
        <el-col :span="8">

        </el-col>
        <el-col :span="16">
        </el-col>
      </el-row>
    </el-container>

  </el-container>

</template>

<script>
import Navigation from '@/components/Navigation'
import { GetUsers } from '../constants/query.gql'

export default {
  components: {
    Navigation
  },
  data() {
    return {
      showModal: false,
      modalConfig: {},
      getUsers: [],
      styleObj: {
        position: "absolute",
        left: "0px",
        top: "52px",
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight - 52}px`
      }
    }
  },
  apollo: {
    getUsers: {
      query: GetUsers
    },
    getGroups: {
      query: GetGroups
    }
  }
}
</script>

<style scoped>
</style>
