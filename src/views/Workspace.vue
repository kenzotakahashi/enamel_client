<template>
  <div class="container">
    <h3>enamel</h3>
    <div class="columns">
      <div class="column col-2">
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
import { GetFolders } from '../constants/query.gql'

export default {
  components: {
    Tree
  },
  data() {
    return {
      getFolders: []
    }
  },
  apollo: {
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


