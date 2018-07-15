<template>
  <div class="user-detail white">
    <div class="user-detail-container">
      <div class="user-detail-inner-container">
        <div class="user-main-info-container">
          <Avatar :user="user" :size="144"></Avatar>
        </div>
        <div class="button-group-selector">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from './Avatar'

export default {
  props: ['user'],
  components: {
    Avatar
  }
}

</script>

<style scoped>
.user-detail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: block;
  width: 424px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.56), 0 0 1px 0 rgba(0, 0, 0, 0.16);
  z-index: 1;
}

.user-detail-container {
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-height: 100%;
  padding-left: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;    
}

.user-detail-inner-container {
  flex-grow: 0;
  flex-shrink: 0;
  width: 376px;
  height: 100%;
  padding: 32px 0 32px 24px;    
}

.user-main-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;    
}



</style>