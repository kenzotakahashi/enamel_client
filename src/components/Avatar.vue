<template>
  <span>
    <span v-if="user" class="avatar" v-bind:style="{
      backgroundColor: `#${user.avatarColor}`,
      height: size + 'px',
      width: size + 'px',
      lineHeight: size + 'px'
    }">
      {{getInitials}}
    </span>
    <span v-else class="avatar" v-bind:style="{
      backgroundColor: '#f2f7ff',
      height: size + 'px',
      width: size + 'px',
      lineHeight: size + 'px'
    }">
      <svg viewBox="0 0 14 9" width="14px">
        <path fill-rule="evenodd" stroke="none" fill="#bcd4ff"
          d="M9,4 C10.11,4 11,3.1 11,2 C11,0.9 10.11,0 9,0 C7.9,0 7,0.9 7,2 C7,3.1 7.9,4 9,4 L9,4 Z M9,5.2 C7.33,5.2 4,6.03 4,7.7 L4,9 L14,9 L14,7.7 C14,6.03 10.67,5.2 9,5.2 L9,5.2 Z M5,3 L3,3 L3,1 L2,1 L2,3 L0,3 L0,4 L2,4 L2,6 L3,6 L3,4 L5,4 L5,3 L5,3 Z">
        </path>
      </svg>
    </span>
  </span>
</template>

<script>

export default {
  props: ['user', 'size'],
  computed: {
    getInitials() {
      const {firstname, lastname} = this.user
      if (!firstname) return
      return `${firstname[0]}${lastname[0]}`.toUpperCase()
    },
  }
}
</script>


<style scoped>
.avatar {
  text-align: center;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
  font-family: Roboto;
  font-size: 14px;
  letter-spacing: 1px;
}
</style>
