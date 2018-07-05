import Vue from 'vue'
import VeeValidate from 'vee-validate'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import { onError } from "apollo-link-error"
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { withClientState } from 'apollo-link-state'
import { enableExperimentalFragmentVariables } from 'graphql-tag'
import VueApollo from 'vue-apollo'

import App from './App.vue'
import router from './router'
import store from './store'
// import './registerServiceWorker'

import './assets/css/style.scss'

Vue.use(VeeValidate)
Vue.config.productionTip = false

const uri = `${process.env.VUE_APP_URI}/graphql`
const httpLink = new HttpLink({
  uri,
})

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      showPurchase: (_, args, { getCacheKey }) => {
        return getCacheKey({ __typename: 'Purchase', id: args.id })
      }
    },
  },
})

// persistCache({
//   cache,
//   storage: window.localStorage,
// })

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('user-token')
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  })
  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authMiddleware,
    httpLink
  ]),
  cache,
  connectToDevTools: true,
})

const apolloProvider = new VueApollo({
  defaultClient: client,
  defaultOptions: {
    $loadingKey: 'loading'
  }
})

Vue.use(VueApollo)

const userId = localStorage.getItem('user-id')

new Vue({
  router,
  data: {
    userId
  },
  provide: apolloProvider.provide(),
  store,
  render: h => h(App)
}).$mount('#app')
