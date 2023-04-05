import getData from 'Apis/searchApi'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import TokenService from 'Repositorys/tokenService'

const { createContext } = require('react')

const AuthContext = createContext()

/**  
어디서든 useAuth를 사용하면 AuthContext를 사용할 수 있음
*/
export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
	const [searchToken, setSearchToken] = useState()	// 토큰 관리
	const [searchInput, setSearchInput] = useState('') // 검색창에 있는 value 관리
	const [searchList, setSearchList] = useState([]) // 연관검색어 list관리
	const [searchResultList, setSearchResultList] = useState([]) // 검색결과 list관리
	const [chooseInput, setChooseInput] = useState(-1) // 검색창에서 하이라이트의 대상이 될 인덱스번호를 기억할 state
	const [focusText, setFocusText] = useState('') // Focus된 텍스트
	const [showSearchList, setShowSearchList] = useState(false) // 검색창 활성화 관리

	useEffect(() => {
		// 만약에 웹 스토리지에 token이 남아 있다면
		const token = TokenService.getSearchTokens()
		if (token) {
			setSearchToken([token])
		}
	}, [])

	/**
	 * 검색 : 토큰 생성
	 */
	const search = token => {
		if (searchToken) {
			return TokenService.setToken(token)
		}
		TokenService.setToken(token)
	}

	/**
	 * 토큰 값 얻기
	 */
	const get = () => {
		return TokenService.getSearchTokens()
	}

	// 검색어로 데이터 가져오기
	function onSubmitSearch(value) {
		if (value == '') {
			alert('검색어를 입력해주세요')
			return
		}

		getData(value)
			.then(data => {
				setSearchResultList(data)
				setSearchList(data)
			})
			.catch(error => {
				console.log(error)
			})
		search(value)
		setSearchInput(value)
		setShowSearchList(false)
	}

	return (
		<AuthContext.Provider
			value={{
				searchToken,
				search,
				get,
				searchInput,
				setSearchInput,
				searchList,
				setSearchList,
				searchResultList,
				setSearchResultList,
				chooseInput,
				setChooseInput,
				focusText,
				setFocusText,
				showSearchList,
				setShowSearchList,
				onSubmitSearch,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
export default AuthProvider
