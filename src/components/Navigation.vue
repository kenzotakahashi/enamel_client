<template>
  <el-row class="nav">
    <el-col :span="2">
      <div class="logo">enamel</div>
    </el-col>
    <el-col :span="17"></el-col>
    <el-col :span="5">
      <div>
        <Avatar :user="getUser" :size="32"></Avatar>
        <span class="name">{{getUser.name}}</span>
        <i class="fas fa-angle-down"></i>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from  'vuex'
import Avatar from '@/components/Avatar'
import { GetTeam, GetUser } from '../constants/query.gql'

export default {
  components: {
    Avatar,
  },
  computed: mapState(['activeDropdown']),
  data() {
    return {
      modalConfig: {},
      getTeam: {},
      getUser: {}
    }
  },
  apollo: {
    getUser: {
      query: GetUser,
      variables: {},
      result({data}) {
      }
    },
    getTeam: {
      query: GetTeam,
    },
  }
}

</script>
