import Axios from './@core'

const SearchApi = {
	getSearchValue(key) {
		return Axios.get(`/search`, { params: { key } })
	},
}
export default SearchApi
