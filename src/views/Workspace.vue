<template>
  <div class="container">
    <h3>enamel</h3>
    <div class="columns">
      <div class="column col-2">
        <div v-if="getTeam.id">
          <router-link :to="{name: 'folder', params: {id: getTeam.id}}">
            <span class="folder">{{ getTeam.name }}</span>
          </router-link>
        </div>
        <Tree
          class="item"
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
import { GetFolders, GetTeam } from '../constants/query.gql'

export default {
  components: {
    Tree
  },
  data() {
    return {
      getFolders: [],
      getTeam: {}
    }
  },
  apollo: {
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
