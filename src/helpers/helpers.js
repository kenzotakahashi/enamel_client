import moment from 'moment'
import { UpdateTask, GetTasks } from '@/constants/query.gql'

export const formatDate = (date) => {
  const day = moment(date).format('MMM DD')
  const today = moment().format('MMM DD')
  return today === day ? moment(date).format('HH:mm') : day
}

export function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())]
}

export const backgroundColorMap = {
  New: 'rgb(227, 242, 253)',
  'In Progress': '#e0f7fa',
  Completed: '#f1f8e9',
  'On Hold': '#fafafa',
  Cancelled: '#fafafa',
}

export const backgroundStrongColorMap = {
  New: '#1976d2',
  'In Progress': '#0097a7',
  Completed: '#689f38',
  'On Hold': '#616161',
  Cancelled: '#616161',
}

export const borderColorMap = {
  New: 'rgb(211, 228, 242)',
  'In Progress': '#ceeaee',
  Completed: '#e3ebd9',
  'On Hold': '#e5e5e5',
  Cancelled: '#e5e5e5',
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase())
}

export function moveTask(vm, folder, item) {
  vm.$apollo.mutate({
    mutation: UpdateTask,
    variables: {
      id: item.id,
      input: {
        parent: null,
        folders: [folder]
      }
    },
    update(store, { data: { updateTask } }) {
      try {
        const data = store.readQuery({
          query: GetTasks,
          variables: { folder }
        })
        data.getTasks.push(updateTask)
        data.getTasks.sort((a,b) => b.order - a.order)
        store.writeQuery({
          query: GetTasks,
          variables: { folder },
          data
        })

        const variables = item.parent
          ? { parent: item.parent.id }
          : { folder: item.folders[0].id }
        const data2 = store.readQuery({
          query: GetTasks,
          variables
        })
        data2.getTasks = data2.getTasks.filter(o => o.id !== updateTask.id)
        store.writeQuery({
          query: GetTasks,
          variables,
          data: data2
        })        
      } catch(error) {
      }
    }
  }).then(() => {
    vm.$store.commit('changeMode', {type: 'default'})
    vm.$router.push({name: 'folder', params: {id: folder}})
  }).catch((error) => {
    console.log(error)
  })
}