import { useAuth } from 'Contexts/auth'
import { useEffect } from 'react'
import styled from 'styled-components'
import SearchList from './Components/SearchList'
import SearchResultList from './Components/SearchResultList'
import useDebouncing from 'Hooks/useDebouncing'

function HomePage() {
	const auth = useAuth()

	const recentSearchArray = auth.get() // 토큰을 이용한 최근검색어 관리

	// 디바운스 사용
	// searchInput값이 바뀔 때마다 안에 정의 실행
	useDebouncing(auth.searchInput, auth.setSearchList)

	// 키 입력
	const handleKeyPress = e => {
		// Enter 키 입력
		if (e.key === 'Enter') {
			// 검색중인 경우
			auth.chooseInput >= 0 &&
				auth.searchList.length &&
				auth.setSearchInput(auth.searchList[auth.chooseInput])

			// 검색창이 빈 경우
			auth.chooseInput >= 0 &&
				!auth.searchList.length &&
				auth.setSearchInput(recentSearchArray[auth.chooseInput])

			auth.onSubmitSearch(auth.focusText || auth.searchInput)
			auth.setChooseInput(-1)
			auth.setSearchList([])
			auth.setShowSearchList(false)
			return
		}

		// Backspace 키 입력
		if (e.key === 'Backspace') {
			auth.setChooseInput(-1)
		}

		// ⬆️키 입력
		if (e.key === 'ArrowUp') {
			// console.log('키보드 ⬆️ 입력됨!')

			if (auth.chooseInput < 0) {
				return
			}
			auth.setChooseInput(prev => prev - 1)
		}

		// ⬇️키 입력
		if (e.key === 'ArrowDown') {
			// console.log('키보드 ⬇️ 입력됨!')

			// 검색결과가 없는 경우
			if (auth.searchList == '검색 결과가 없습니다.') return

			// 검색중인 경우
			if (auth.searchList.length) {
				if (auth.chooseInput > auth.searchList.length - 2) {
					auth.setChooseInput(0)
				} else {
					auth.setChooseInput(prev => prev + 1)
				}
			} else if (recentSearchArray !== null && recentSearchArray.length) {
				// 검색창이 빈 경우
				if (auth.chooseInput > recentSearchArray.length - 2) {
					auth.setChooseInput(0)
				} else {
					auth.setChooseInput(prev => prev + 1)
				}
			}
		}

		// 다른 (한글 혹은 영어)키 입력
		if (e.key === 'Process') {
			auth.setChooseInput(-1)
		}

		auth.setShowSearchList(true)
	}

	// 검색어 변경 핸들러
	const handleSearchTermChange = e => {
		const key = e.target.value
		auth.setSearchInput(key)
	}

	// 검색창 활성화 핸들러
	const handleSearchOn = () => {
		auth.setShowSearchList(true)
	}

	// 검색창 비활성화 핸들러
	const handleSearchOff = () => {
		auth.setShowSearchList(false)
	}

	// 검색어 부분 하이라이트 텍스트로 변경
	useEffect(() => {
		// 검색어가 비어있다면
		if (auth.searchInput == '') {
			auth.setFocusText(
				auth.chooseInput >= 0 && recentSearchArray[auth.chooseInput],
			)
			return
		}
		auth.setFocusText(
			auth.chooseInput >= 0 && auth.searchList[auth.chooseInput],
		)
	}, [auth.chooseInput])

	return (
		<div className="App">
			<Wrapper
				onFocus={() => auth.setShowSearchList(true)}
				onBlur={() => auth.setShowSearchList(false)}
			>
				<InputArea
					type="text"
					placeholder="검색어를 입력하세요"
					name="searchInput"
					value={auth.focusText || auth.searchInput}
					onChange={handleSearchTermChange}
					onKeyDown={handleKeyPress}
					autoComplete="off"
				/>
				<SearchList />
				{auth.searchResultList.length !== 0 && <SearchResultList />}
			</Wrapper>
		</div>
	)
}

export default HomePage

const Wrapper = styled.div`
	width: 80%;
	margin: 5% auto;
`

const InputArea = styled.input`
	width: 100%;
	border: 0.2rem solid gray;
	border-radius: 1rem;
	padding: 1rem;
`
