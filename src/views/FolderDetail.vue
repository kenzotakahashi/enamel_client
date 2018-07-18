<template>
  <div class="white card max-height">
    <div class="space">
      <h4>{{folder.name}}</h4>

      <el-row>
        <span class="shared-with">{{folder.shareWith && folder.shareWith.length}}</span>
      </el-row>

      <DescriptionField :model="folder" kind="folder"></DescriptionField>

    </div>
  </div>
</template>

<script>
import { formatDate } from '@/helpers/helpers'
import DescriptionField from '@/components/DescriptionField'

export default {
  components: {
    DescriptionField
  },
  data() {
    return {
      formatDate
    }
  },
  props: ['folder'],
}
</script>

<style scoped>
</style>
