import { Axios } from './core'

const PATH = 'search'

const SearchApi = {
	getSearch(isSearch) {
		return Axios.get(`/${PATH}`, {
			params: { key: isSearch },
		})
	},
}

export default SearchApi
