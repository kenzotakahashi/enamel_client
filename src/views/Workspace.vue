<template>
  <div>
    <navigation :auth="true"></navigation>

    <div class="container">
      <aside class="tree-root">
        <div v-if="getTeam.id" class="tree-item"
            @click.right.stop.prevent="$store.dispatch('changeActiveWidget', `folder${getTeam.id}`)"
            @click.left.stop="$router.push({name: 'folder', params: {id: getTeam.id}})">
          <div class="tree-plate"  v-bind:class="{active: $route.params.id === getTeam.id}">
            <div class="circle"></div>              
            <span class="folder no-select-color teamname">{{ getTeam.name }}</span>
            <plus-button @click="openModal('folder')" color="white"></plus-button>

            <div class="dropdown-content left" v-show="activeWidget === `folder${getTeam.id}`">
              <div @click="openModal('folder')">Add Folder</div>
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
      <div v-else-if="mode === 'task'" class="modal-mask move">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div>Select the folder you want to move your task to</div>
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
import { GetFolders, GetTeam } from '../constants/query.gql'

export default {
  components: {
    Tree,
    FolderForm,
  },
  computed: mapState(['activeWidget', 'mode']),
  data() {
    return {
      showModal: false,
      modalConfig: {},
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
      pollInterval: 90000,
      error(error) {
        console.error(error)
      },
    }
  },
  methods: {
    openModal(mode) {
      this.$store.dispatch('changeActiveWidget', null)
      this.showModal = true
      this.modalConfig = {
        mode,
        parent: ''
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
  flex-grow: 1;
}
</style>