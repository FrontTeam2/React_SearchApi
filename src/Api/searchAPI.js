import axios from 'axios'

const SearchAPI = {
	getSearch({ text }) {
		return axios.get(`http://localhost:9000/search`, {
			params: { key: text },
		})
	},
}
export default SearchAPI
