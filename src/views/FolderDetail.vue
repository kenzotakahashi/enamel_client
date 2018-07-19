<template>
  <div class="white card max-height">
    <div class="folder-header">
      <input class="no-outline header-title folder-name" type="text" name="taskname" ref="taskname"
        v-model="folderName" @keyup.enter="updateFolder" @keyup.esc="cancel">
      </input>
    </div>
    <div class="folder-statebar">


      <div class="tooltip">
        <div v-show="activeWidget === 'addFolderShareTooltip'" class="tooltip-content bottom" @click.stop="">
          <div class="group-field">
            <div class="add-additional">
              <avatar v-for="group in shareWith" :key="group.id" 
                class="member-avatar" :kind="group.__typename" :obj="group" :size="32">
                <remove-button @click="removeGroup(group.id)"></remove-button>
              </avatar>
            </div>
          </div>
          <div>
            <div class="search-input">
              <div class="label">Share with:</div>
              <el-input type="text" v-model="searchGroup" placeholder="Add by name or email"
                @keyup.esc="changeActiveWidget(null)">
              </el-input>                
            </div>
          </div>
          <div class="contact-picker-item-list">
            <div v-for="group in filteredGroups" :key="group.id" class="contact-picker-item"
              @click.stop="addGroup(group)">
              <div class="picker-item">
                <div class="item">
                  <avatar class="picker-avatar" :kind="group.__typename" :obj="group" :size="32"></avatar>
                  <div>
                    <div class="name">{{group.name}}</div>
                    <div class="email">{{group.email}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-button v-if="folder.parent" type="text" class="black-text-button subfolder share-info">
          <i class="fas fa-share-alt"></i>
          <span class="shared-with">{{folder.shareWith && folder.shareWith.length}}</span>
        </el-button>
        <el-button v-else type="text" class="black-text-button share-info"
          @click.stop="changeActiveWidget('addFolderShareTooltip')" >
          <i class="fas fa-share-alt"></i>
          <span class="shared-with">{{folder.shareWith && folder.shareWith.length}}</span>
        </el-button>

      </div>

    </div>

    <DescriptionField :model="folder" kind="folder"></DescriptionField>
   
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/helpers/helpers'
import { UpdateFolder, GetUser, GetUsers, GetGroups, GetTeam } from '../constants/query.gql'
import DescriptionField from '@/components/DescriptionField'

export default {
  components: {
    DescriptionField
  },
  data() {
    return {
      getUser: {},
      getUsers: [],
      getGroups: [],
      getTeam: {},
      excludeList: [],
      searchGroup: '',
      formatDate,
      folderName: this.folder.name,
      shareWith: this.folder.shareWith.map(o => ({
        ...o,
        id: o.item,
        __typename: o.kind
      }))
    }
  },
  props: ['folder'],
  apollo: {
    getUser: GetUser,
    getUsers: GetUsers,
    getGroups: GetGroups,
    getTeam: GetTeam,
  },
  computed: {
    shareInfo() {
      const share = this.shareWith
      // !share || share.length ===
    },
    groups() {
      return [this.getTeam].concat(this.getUsers).concat(this.getGroups)
    },
    filteredGroups() {
      const s = this.searchGroup.toLowerCase()
      const shared = this.shareWith.map(o => o.id)
      return this.groups.filter(o => {
        if (shared.includes(o.id)) return false
        if (this.excludeList.includes(o.id)) return false
        if (o.email && o.email.includes(s)) return true
        return o.name && o.name.toLowerCase().includes(s)
      })
    },
    ...mapState(['activeWidget'])
  },
  methods: {
    changeActiveWidget(key) {
      this.$store.dispatch('changeActiveWidget', key)
    },
    addGroup(group) {
      this.shareWith.push(group)
      this.mergeGroup(this.shareWith)
    },
    removeGroup(id) {
      // if (this.shareWith.length === 1) {
      //   const obj = this.shareWith[0]
      //   if (obj.__typename === 'User') {
      //     if (obj.id === this.getUser.id)
      //   }
      // }
      this.mergeGroup(this.shareWith.filter(o => o.id !== id))
    },
    mergeGroup(shareWith) {
      this.excludeList = []
      if (shareWith.length === 0) {
        this.shareWith = [this.getUser]
        return
      }
      if (shareWith.find(o => o.__typename === 'Team')) {
        this.excludeList = shareWith.filter(o =>
          ['Regular User','Owner','Administrator'].includes(o.role)).map(p => p.id)
      }
      const members = shareWith.filter(o => o.__typename === 'Group').map(p => p.users)
      this.excludeList = this.excludeList.concat(...members)
      this.shareWith = shareWith.filter(o => !this.excludeList.includes(o.id))
    },
    updateFolder(e) {
      const name = this.folderName
      if (name === this.folder.name) {
        this.cancel(e)
        return
      }
      this.$apollo.mutate({
        mutation: UpdateFolder,
        variables: { id: this.folder.id, input: {name} },
      }).then(() => {
        this.cancel(e)
      }).catch((error) => {
        console.log(error)
      })
    },
    cancel(e) {
      e.target.blur()
    }
  }

}
</script>

<style scoped>
.folder-header {
  padding: 15px 24px 0;
  line-height: 21px;
  min-height: 40px;
}

.folder-statebar {  
  display: flex;
  min-width: 400px;
  height: 48px;
  position: relative;
  padding: 0 24px;
  border-top: solid 1px;
  border-bottom: solid 1px;
  border-color: rgba(0,0,0,.16);
}

.folder-name {
  padding: 0;
  margin: 5px 0;
  height: 32px;
  width: 100%;
}

.shared-with {
  padding-left: 7px;
}

.subfolder:hover {
  color: initial;
  cursor: default;
}

/*tooltip*/

.member-avatar {
  margin-right: 8px;
  cursor: pointer;
}

.member-avatar:hover .remove-button {
  visibility: visible;
}

.tooltip .tooltip-content {
  width: 278px;
  left: 50%; 
  margin-left: -139px;
}

.search-input {
  padding: 15px;
}

.contact-picker-item-list {
  padding-bottom: 24px;
  max-height: 295px;
  overflow: auto;
}

.group-field {
  box-sizing: border-box;
  /*height: 36px;*/
  padding: 15px;
}

.add-additional {
  display: flex;
  flex-direction: row;
}

.label {
  text-align: left;
}

</style>
