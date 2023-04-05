// 디바운스 모듈화

import getData from 'Apis/searchApi'
import { useEffect } from 'react'

function useDebouncing(searchInput, setSearchList) {
	const maxSearchList = 5 // 최대 저장할 최근 검색어 갯수

	useEffect(() => {
		const handler = setTimeout(() => {
			if (searchInput === '') {
				setSearchList([])
				return
			}

			getData(`${searchInput}`)
				.then(data => {
					if (typeof data !== 'string' && data.length > maxSearchList) {
						return setSearchList(data.slice(0, maxSearchList))
					}

					setSearchList(data)
				})
				.catch(error => {
					console.log(error)
				})
		}, 300)

		return () => clearTimeout(handler)
	}, [searchInput, setSearchList])
}

export default useDebouncing
