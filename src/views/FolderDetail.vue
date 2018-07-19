<template>
  <div class="white card max-height">
    <div class="folder-header">
      <input class="no-outline header-title folder-name" type="text" name="taskname" ref="taskname"
        v-model="folderName" @keyup.enter="updateFolder" @keyup.esc="cancel">
      </input>

      <el-row>
        <span class="shared-with">{{folder.shareWith && folder.shareWith.length}}</span>
      </el-row>

      <DescriptionField :model="folder" kind="folder"></DescriptionField>

    </div>
  </div>
</template>

<script>
import { formatDate } from '@/helpers/helpers'
import { UpdateFolder } from '../constants/query.gql'
import DescriptionField from '@/components/DescriptionField'

export default {
  components: {
    DescriptionField
  },
  data() {
    return {
      formatDate,
      folderName: this.folder.name
    }
  },
  props: ['folder'],
  methods: {
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

.folder-name {
  padding: 0;
  margin: 5px 0;
  height: 32px;
  width: 100%;
}
</style>
