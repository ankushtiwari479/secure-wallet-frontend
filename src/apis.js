import axios from 'axios'
export const fetchWallet =  (walletId) => axios.get(`/wallet/${walletId}`)

export const fetchTransaction = (walletId,skip,limit) => axios.get('/transactions',{params:{walletId,skip,limit}})