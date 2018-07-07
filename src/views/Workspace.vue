<template>
  <div class="container">
    <nav class="columns">
      <!-- <div class="column col-1">
        <a class="logo">enamel</a>
      </div>
      <div class="column col-9">
      </div>
      <div class="column col-2">
        <a>{{getUser.name}}</a>
      </div> -->
      <a class="column col-1 logo">enamel</a>
      <a class="column col-9"></a>
      <span class="column col-2">
        <Avatar :user="getUser" :size="32"></Avatar>
        <span class="name">{{getUser.name}}</span>
      </span>
    </nav>
    <div class="columns">
      <div class="column col-2">
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
      </div>
      <div class="column col-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
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
        console.log(data)
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
