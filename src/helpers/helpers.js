import moment from 'moment'

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