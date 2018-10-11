<template>
  <el-container>
    <el-header>
      <navigation :auth="true"></navigation>
    </el-header>

    <el-main>
      <div class="container-center">
        <h2>Settings</h2>
        
        <div>
          <h3>Appearance</h3>

          <el-radio-group v-model="form.appearance" size="medium"
            @change="updateAppearance()">
            <el-radio-button label="Classic"></el-radio-button>
            <el-radio-button label="Dark"></el-radio-button>
          </el-radio-group>
        </div>

      </div>

    </el-main>
  </el-container>

</template>

<script>
import { GetUser, UpdateUser } from '../constants/query.gql'

export default {
  data() {
    return {
      getUser: {},
      form: {
        appearance: null,
      }
    }
  },
  apollo: {
    getUser: {
      query: GetUser,
      result({data: {getUser}}) {
        this.form.appearance = getUser.appearance
      }
    },
  },
  methods: {
    updateAppearance() {
      this.$apollo.mutate({
        mutation: UpdateUser,
        variables: {
          id: this.getUser.id, 
          input: this.form
        },
      }).then(() => {
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.el-button {
  width: 100%;
}

</style>
