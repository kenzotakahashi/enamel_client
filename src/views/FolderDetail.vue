<template>
  <div class="white container">
    <h4>{{folder.name}}</h4>
    folder
    <div class="columns">
      <div class="column col-3">
        <span class="shared-with">{{folder.shareWith && folder.shareWith.length}}</span>
      </div>
    </div>
    <div class="description-field">
      <span class="description-text">Click to add the description</span>
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