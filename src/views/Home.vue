<template>
  <el-container>
    <el-header>
      <navigation></navigation>
    </el-header>

    <el-main>
      <el-row>
        <el-col :span="6" :offset="9" justify="center">
          <h2>Welcome!</h2>
          <div>Enter your email address to start free trial</div>

          <el-form ref="form" :model="form">
            <el-form-item>
              <label>Email</label>
              <el-input v-model="form.email" placeholder="Email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="capture">Create my enamel account</el-button>
            </el-form-item>
          </el-form>

          <div v-if="submitted">
            <div>Thank you!</div>
            <div>Please check your email.</div>
            <!-- <router-link :to="{name: 'signup', params: {id}}">Set up my account</router-link> -->
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

</template>

<script>
import { mapState } from 'vuex'
import { CaptureEmail } from '../constants/query.gql'

export default {
  data() {
    return {
      submitted: false,
      // id: '',
      form: {
        email: '',
      }
    }
  },
  computed: {
    ...mapState(['userId'])
  },
  methods: {
    async capture() {
      // const validated = await this.$validator.validate()
      const {email} = this.form
      if (email) {
        this.$apollo.mutate({
          mutation: CaptureEmail,
          variables: {email}
        }).then(({data}) => {
          this.submitted = true
          // this.id = data.captureEmail.id
        }).catch((error) => {
          console.log(error)
        })
      }
    },
  }
}
</script>

<style scoped>
.el-button {
  width: 100%;
}
</style>