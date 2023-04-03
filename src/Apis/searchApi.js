import Axios from './@core'

const SearchApi = {
	searchApi(debounceVal) {
		return Axios.get('/search', {
			params: {
				key: debounceVal,
			},
		})
	},
}

export default SearchApi
