<template>
  <div class="container">
    <h3 class="logo">enamel</h3>
    <div class="columns">
      <div class="column col-4 col-mx-auto">
        <div>Welcome to enamel! Finish setting up your account</div>
        <div class="form-group">
          <label class="form-label" for="firstname">First name</label>
          <input class="form-input" type="text" id="firstname" v-model="form.firstname" placeholder="Your first name">
          <label class="form-label" for="lastname">Last name</label>
          <input class="form-input" type="text" id="lastname" v-model="form.lastname" placeholder="Your last name">
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
        firstname: '',
        lastname: '',
        password: '',
      }
    }
  },
  methods: {
    async signup() {
      // const validated = await this.$validator.validate()
      const { firstname, lastname, password } = this.form
      if (firstname && lastname && password) {
        this.$apollo.mutate({
          mutation: Signup,
          variables: {
            id: this.$route.params.id,
            firstname,
            lastname,
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
