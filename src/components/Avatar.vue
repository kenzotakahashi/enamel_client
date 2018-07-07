<template>
  <span class="avatar" v-bind:style="{
    backgroundColor: `#${user.avatarColor}`,
    height: size + 'px',
    width: size + 'px',
    lineHeight: size + 'px'
  }">
    {{getInitials}}
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
