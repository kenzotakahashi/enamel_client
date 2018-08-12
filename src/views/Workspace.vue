<template>
  <div>
    <navigation :auth="true"></navigation>

    <div class="container">
      <aside class="tree-root">
        <div v-if="getTeam.id" class="tree-item"
            @click.right.stop.prevent="changeActiveWidget"
            @click.left.stop="leftClick">
          <div class="tree-plate"  v-bind:class="{active: $route.params.id === getTeam.id}">
            <div class="circle"></div>              
            <span class="folder no-select-color teamname">{{ getTeam.name }}</span>
            <plus-button @click="openModal" color="white"></plus-button>

            <div class="dropdown-content left" v-show="activeWidget === `folder${getTeam.id}`">
              <div @click="openModal">Add Folder</div>
            </div>
          </div>
        </div>

        <Tree
          v-for="folder in getFolders"
          :key="folder.id"
          :model="folder"
          :team="getTeam.id" >
        </Tree>
      </aside>

      <div v-if="mode === 'default'" class="workspace-main">
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <div v-else class="modal-mask move">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div>Select the folder you want to move your {{mode}} to</div>
            <el-button type="text" class="cancel-button" size="small"
              @click="$store.commit('changeMode', {type: 'default'})">Cancel</el-button>
          </div>
        </div>
      </div>

      <FolderForm v-if="showModal" :config="modalConfig" @close="showModal = false"></FolderForm>
    </div>

  </div>

</template>

<script>
import { mapState } from  'vuex'
import Tree from '@/components/FolderTree'
import FolderForm from '@/components/FolderForm'
import { UpdateFolder, GetFolders, GetTeam } from '../constants/query.gql'
import { moveTask } from '@/helpers/helpers'

export default {
  components: {
    Tree,
    FolderForm,
  },
  computed: mapState(['activeWidget', 'mode', 'tempItem']),
  data() {
    return {
      showModal: false,
      modalConfig: {
        mode: 'folder',
        parent: ''
      },
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
      pollInterval: 90000
    }
  },
  methods: {
    openModal() {
      this.$store.dispatch('changeActiveWidget', null)
      this.showModal = true
    },
    changeActiveWidget() {
      if (this.mode === 'default') {
        this.$store.dispatch('changeActiveWidget', `folder${this.getTeam.id}`)        
      }
    },
    leftClick() {
      const folder = this.getTeam.id
      const item = this.tempItem
      if (this.mode === 'default') {
        this.$store.dispatch('changeActiveWidget', null)
        this.$router.push({name: 'folder', params: {id: folder}})
      } else if (this.mode === 'task') {
        moveTask(this, folder, item)
      } else if (this.mode === 'folder') {
        if (!item.parent) return
        this.$apollo.mutate({
          mutation: UpdateFolder,
          variables: {
            id: item.id,
            input: {
              parent: null,
              shareWith: [{ kind: 'Team', item: folder }]
            }
          },
          update(store, { data: { updateFolder } }) {
            const variables = { parent: item.parent }
            const data = store.readQuery({ query: GetFolders, variables })
            data.getFolders = data.getFolders.filter(o => o.id !== updateFolder.id)
            store.writeQuery({ query: GetFolders, variables, data })

            const data2 = store.readQuery({ query: GetFolders })
            data2.getFolders.push(updateFolder)
            data2.getFolders.sort((a,b) => a.createdAt - b.createdAt)
            store.writeQuery({ query: GetFolders, data: data2 })
          }
        }).then(() => {
          this.$store.commit('changeMode', {type: 'default'})
          this.$router.push({name: 'folder', params: {id: item.id}})
        }).catch((error) => {
          console.log(error)
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
.modal-mask.move {
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.75);
  div {
    .modal-container {
      width: 500px;
      background-color: inherit;
    }
  }
}

.cancel-button, .cancel-button:hover {
  width: 100px;
  color: #fff;
  border: 1px solid #fff;
  margin-top: 10px;
}

.container {
  width: 100%;
  height: calc(100% - 52px);
}

.plus-button {
  position: absolute;
  right: 0;
  top: 7px;
  margin: 0 2px;
}

aside {
  width: 220px;
  height: 100%;
  display: inline-block;
}

.workspace-main {
  flex: 1 1;
}
</style>