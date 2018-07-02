<template>
  <div class="container">
    <h2>Enamel</h2>
    <div class="columns">
      <div class="column col-3">
        <div v-for="tree in folderTree">
          <Tree
            class="item"
            :model="tree">
          </Tree>
        </div>
      </div>
      <div class="column col-9">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Tree from '@/components/Tree'
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


