<template>
  <div id="app" @click="$store.dispatch('changeActiveDropdown', null)">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
</style>
