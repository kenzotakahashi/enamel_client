<template>
  <div class="nav">
    <div class="nav-left">
      <router-link :to="{name: 'home'}" class="logo">enamel</router-link>
    </div>
    <NavigationRight v-if="auth"></NavigationRight>
  </div>
</template>

<script>
import NavigationRight from './NavigationRight'

export default {
  components: {
    NavigationRight
  },
  props: ['auth'],
}

</script>

<style scoped>
.nav {
  display: flex;
}

.nav-left {
  flex-grow: 1;
}

.nav > div {
  overflow: hidden;
  padding: 10px 10px;
  cursor: pointer;
}

.logo {
  font-size: 25px;
  font-family: 'Questrial', sans-serif;
  letter-spacing: 3px;
}
</style>
