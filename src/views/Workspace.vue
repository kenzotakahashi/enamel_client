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

    <el-container :style="styleObj">
      <el-aside width="220px">
        <div v-if="getTeam.id">
          <div class="tree-item dropdown"
              @click.right.stop.prevent="$store.dispatch('changeActiveDropdown', `folder${getTeam.id}`)"
              @click.left.stop="$router.push({name: 'folder', params: {id: getTeam.id}})">
            <span class="folder no-select-color">{{ getTeam.name }}</span>
          </div>
          <div class="dropdown-content left" v-show="activeDropdown === `folder${getTeam.id}`">
            <div @click="openModal('folder')">Add Folder</div>
            <div @click="openModal('project')">Add Project</div>
          </div>
        </div>
        <Tree
          v-for="folder in getFolders"
          :key="folder.id"
          :model="folder"
          :team="getTeam.id" >
        </Tree>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

    <Modal v-if="showModal" :config="modalConfig" @close="showModal = false"></Modal>
  </el-container>
</template>

<script>
import { mapState } from  'vuex'
import Tree from '@/components/FolderTree'
import Avatar from '@/components/Avatar'
import Modal from '@/components/Modal'
import { GetFolders, GetTeam, GetUser } from '../constants/query.gql'

export default {
  components: {
    Tree,
    Avatar,
    Modal
  },
  computed: mapState(['activeDropdown']),
  data() {
    return {
      showModal: false,
      modalConfig: {},
      getFolders: [],
      getTeam: {},
      getUser: {},
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
    openModal(mode) {
      this.$store.dispatch('changeActiveDropdown', null)
      this.showModal = true
      this.modalConfig = {
        mode,
        parent: ''
      }
    },
  }
}
</script>
