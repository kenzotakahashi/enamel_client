<template>
  <div class="container">
    <h3>Enamel</h3>
    <div class="columns">
      <div class="column col-2">
        <div v-for="tree in folderTree">
          <Tree
            class="item"
            :model="tree">
          </Tree>
        </div>
      </div>
      <div class="column col-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Tree from '@/components/FolderTree'
import { FolderTree } from '../constants/query.gql'

export default {
  components: {
    Tree
  },
  data() {
    return {
      folderTree: []
    }
  },
  apollo: {
    folderTree: {
      query: FolderTree,
      // update: data => {
      // },
      // result({ data }) {
      // },
      error(error) {
        console.error(error)
      },
    }
  },
  methods: {
  }
}
</script>


