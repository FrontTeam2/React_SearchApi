import { Axios } from './index'

const PATH = 'search'

const SearchApi = {
	getSearch(searchInput) {
		return Axios.get(`/${PATH}`, {
			params: { key: searchInput },
		})
	},
}

// API에서 Promise형태의 데이터 받아오기
const getData = async params => {
	try {
		const res = await SearchApi.getSearch(params)
		return res.data
	} catch (err) {
		console.log(err.response.data)
		return err.response.data
	}
}
export default getData
