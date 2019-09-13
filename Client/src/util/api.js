import axios from 'axios'

const BASE = 'http://localhost:3000'

export default {
    get (path) {
        return axios.get(BASE + path)
    },
    post (path, data) {
        return axios.post(BASE + path, data)
    }
}