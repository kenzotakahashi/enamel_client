<template>
  <div class="container">
    <h2>enamel</h2>
    <div class="columns">
      <div class="column col-4 col-mx-auto">
        <div>Welcome to enamel! Finish setting up your account</div>
        <div class="form-group">
          <label class="form-label" for="name-1">Full Name</label>
          <input class="form-input" type="text" id="name-1" v-model="form.name" placeholder="Your full name">
          <label class="form-label" for="password-1">Password</label>
          <input class="form-input" type="password" id="password-1" v-model="form.password" placeholder="Create password">
        </div>
        <button class="btn btn-primary" @click="signup">Complete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Signup } from '../constants/query.gql'

export default {
  components: {
  },
  data() {
    return {
      form: {
        name: '',
        password: '',
      }
    }
  },
  methods: {
    async signup() {
      const validated = await this.$validator.validate()
      const { name, password } = this.form
      if (validated && name && password) {
        this.$apollo.mutate({
          mutation: Signup,
          variables: {
            id: this.$route.params.id,
            name,
            password
          }
        }).then(({data: {signup}}) => {
          const id = signup.user.id
          const token = signup.token
          this.saveUserData(id, token)

          this.$router.push({name: 'workspace'})
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    saveUserData (id, token) {
      localStorage.setItem('user-id', id)
      localStorage.setItem('user-token', token)
      this.$root.$data.userId = localStorage.getItem('user-id')
    },
  }
}
</script>
