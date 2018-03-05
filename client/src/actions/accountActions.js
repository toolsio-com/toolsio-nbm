import axios from 'axios'
import { ACCOUNT_FETCHED, ACCOUNT_UPDATED } from './types'

export function accountFetched(account) {
  return {
    type: ACCOUNT_FETCHED,
    account
  }
}

export function accountUpdated(account) {
  return {
    type: ACCOUNT_UPDATED,
    account
  }
}

export function fetchAccount(subdomain) {
  return dispatch => {
    return axios.get(`/accounts/${subdomain}`)
      .then(res => {
        dispatch(accountFetched(res.data.result))
      })
  }
}

export function updateAccount(account) {
  return dispatch => {
    return axios.put(`/accounts/update/${account.subdomain}`, account)
      .then(res => { 
        dispatch(accountUpdated(res.data.result)) 
      })
  }
}

export function uploadLogo(signedRequest, file, options) {
  return dispatch => {
    return axios.put(signedRequest, file, options)
  }
}

export function saveLogo(subdomain, url) {
  return dispatch => {
    return axios.put(`/accounts/update/${subdomain}`, url)
      .then(res => { 
        dispatch(accountUpdated(res.data.result)) 
      })
  }
}