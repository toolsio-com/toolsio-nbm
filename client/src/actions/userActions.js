import axios from 'axios'
import { SET_USERS, USER_UPDATED } from './types'

export function setUsers(users) {
  return {
    type: SET_USERS,
    users
  }
}

export function userUpdated(user) {
  return {
    type: USER_UPDATED,
    user
  }
}

export function fetchUsers() {
  return dispatch => {
    return axios.get('/users/all/users')
      .then(res => {
        dispatch(setUsers(res.data.results))
      })
  }
}

export function sendInvitation(email) {
  return dispatch => {
    return axios.post('/users/account/invitation', email)
  }
}

export function updateUser(user) {
  return dispatch => {
    return axios.post('/users/account/update', user)
  }
}

export function uploadAvatar(signedRequest, file, options) {
  return dispatch => {
    return axios.put(signedRequest, file, options)
  }
}

export function saveAvatar(_id, url) {
  return dispatch => {
    return axios.put(`/user/account/update/${_id}`, url)
      .then(res => { 
        dispatch(userUpdated(res.data.result)) 
      })
  }
}