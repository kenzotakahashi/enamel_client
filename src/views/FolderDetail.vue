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
          <div class="contact-field">
            <div class="add-additional">
              <avatar v-for="group in shareWith" :key="group.id" 
                class="member-avatar" :obj="group" :size="32">
                <remove-button @click="removeGroup(group.id)"></remove-button>
              </avatar>
            </div>
          </div>
          <div>
            <div class="search-user-input">
              <el-input type="text" v-model="searchGroup" placeholder="Search group"
                @keyup.esc="changeActiveWidget(null)">
              </el-input>                
            </div>
          </div>
          <div class="contact-picker-item-list">
            <div v-for="group in filteredGroups" class="contact-picker-item"
              @click.stop="addGroup(group)">
              <div class="picker-item">
                <div class="item">
                  <avatar class="picker-avatar" :obj="group" :size="32"></avatar>
                  <div>
                    <div class="name">{{group.name}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-button type="text" class="black-text-button share-info"
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
import { UpdateFolder } from '../constants/query.gql'
import DescriptionField from '@/components/DescriptionField'

export default {
  components: {
    DescriptionField
  },
  data() {
    console.log(this.folder.shareWith)
    return {
      searchGroup: '',
      formatDate,
      folderName: this.folder.name,
      shareWith: this.folder.shareWith
    }
  },
  props: ['folder'],
  computed: {
    shareInfo() {
      const share = this.folder.shareWith
      // !share || share.length ===
    },
    filteredGroups() {
      return []
      const s = this.searchGroup.toLowerCase()
      const groups = this.shareWith.map(o => o.id)
      return this.folder.shareWith.filter(o => !groups.includes(o.id) && o.name.toLowerCase().includes(s))
    },
    ...mapState(['activeWidget'])
  },
  methods: {
    changeActiveWidget(key) {
      this.$store.dispatch('changeActiveWidget', key)
    },
    addGroup(group) {
      // this.form.groups.push(group)
    },
    removeGroup(id) {
      // this.form.groups = this.form.groups.filter(o => o.id !== id)
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

/*tooltip*/

.field-title {
  margin-bottom: 8px;
  font-size: 12px;
}

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

.search-user-input {
  padding: 15px;
}

.contact-picker-item-list {
  padding-bottom: 24px;
  max-height: 295px;
  overflow: auto;
}

.contact-field {
  box-sizing: border-box;
  height: 36px;
}

.add-additional {
  display: flex;
  flex-direction: row;
}

.role-select {
  width: 100%;
}

</style>
