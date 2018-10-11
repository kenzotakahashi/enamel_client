<template>
  <div id="app" @click="$store.dispatch('changeActiveWidget', null)">
    <router-view></router-view>
  </div>
</template>

<script>
import { GetUser } from '@/constants/query.gql'

export default {
  data() {
    return {
      getUser: {}
    }
  },
  apollo: {
    getUser: {
      query: GetUser,
      result({data: {getUser}}) {
      	const el = document.querySelector('body')
      	el.classList.add(getUser.appearance)
      	el.classList.remove(getUser.appearance === 'Classic' ? 'Dark' : 'Classic')
      }
    }
  }
}
</script>
