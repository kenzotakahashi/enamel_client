<template>
  <div class="white card max-height">
    <div class="space">
      <h4>{{folder.name}}</h4>

      <el-row>
        <span class="shared-with">{{folder.shareWith && folder.shareWith.length}}</span>
      </el-row>

      <div class="description-field">
        <span class="description-text">Click to add the description</span>
      </div>

    </div>
  </div>
</template>

<script>
import { formatDate } from '@/helpers/helpers'

export default {
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
