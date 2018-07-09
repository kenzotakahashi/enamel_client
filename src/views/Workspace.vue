<template>
  <el-container>
    <el-header height="56px">
      <el-row class="nav">
        <el-col :span="2">
          <div class="logo">enamel</div>
        </el-col>
        <el-col :span="17"></el-col>
        <el-col :span="5">
          <Avatar :user="getUser" :size="32"></Avatar>
          <span class="name">{{getUser.name}}</span>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="220px">
        <div v-if="getTeam.id">
          <router-link :to="{name: 'folder', params: {id: getTeam.id}}">
            <span class="folder no-select-color">{{ getTeam.name }}</span>
          </router-link>
        </div>
        <Tree
          v-for="folder in getFolders"
          :key="folder.id"
          :model="folder">
        </Tree>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
import Tree from '@/components/FolderTree'
import Avatar from '@/components/Avatar'
import { GetFolders, GetTeam, GetUser } from '../constants/query.gql'

export default {
  components: {
    Tree,
    Avatar
  },
  data() {
    return {
      getFolders: [],
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
    getFolders: {
      query: GetFolders,
      error(error) {
        console.error(error)
      },
    }
  },
  methods: {
  }
}
</script>
