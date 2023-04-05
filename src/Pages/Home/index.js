import { useAuth } from 'Contexts/auth'
import { useEffect } from 'react'
import styled from 'styled-components'
import SearchList from './Components/SearchList'
import SearchResultList from './Components/SearchResultList'
import getData from 'Apis/searchApi'
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

			onSubmitSearch()
			auth.setChooseInput(-1)
			auth.setShowSearchList(false)
			return
		}

		// Backspace 키 입력
		if (e.key === 'Backspace') {
			auth.setChooseInput(-1)
		}

		// ⬆️키 입력
		if (e.key === 'ArrowUp') {
			console.log('키보드 ⬆️ 입력됨!')

			if (auth.chooseInput < 0) {
				return
			}
			auth.setChooseInput(prev => prev - 1)
		}

		// ⬇️키 입력
		if (e.key === 'ArrowDown') {
			console.log('키보드 ⬇️ 입력됨!')

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

	// 검색어로 데이터 가져오기
	const onSubmitSearch = () => {
		if (auth.focusText == '' && auth.searchInput == '') {
			alert('검색어를 입력해주세요')
			return
		}

		getData(`${auth.focusText || auth.searchInput}`)
			.then(data => {
				auth.setSearchResultList(data)
				auth.setSearchList(data)
			})
			.catch(error => {
				console.log(error)
			})
		auth.search(`${auth.focusText || auth.searchInput}`)
	}

	// 검색어 부분 하이라이트 텍스트로 변경
	useEffect(() => {
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

	// console.log('searchInput : ' + searchInput)
	// console.log('focusText : ' + focusText)

	return (
		<div className="App">
			<Wrapper>
				<InputArea
					type="text"
					placeholder="검색어를 입력하세요"
					name="searchInput"
					value={auth.focusText || auth.searchInput}
					onChange={handleSearchTermChange}
					onKeyDown={handleKeyPress}
					autoComplete="off"
				/>
				<SearchList
					searchInput={auth.searchInput}
					setSearchInput={auth.setSearchInput}
					searchList={auth.searchList}
					setSearchList={auth.setSearchList}
					chooseInput={auth.chooseInput}
					recentSearchArray={recentSearchArray}
					showSearchList={auth.showSearchList}
					setSearchResultList={auth.setSearchResultList}
					setShowSearchList={auth.setShowSearchList}
				/>
				{auth.searchResultList && (
					<SearchResultList
						searchResultList={auth.searchResultList}
						chooseInput={auth.chooseInput}
					/>
				)}
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
	border: 1px solid gray;
	border-radius: 1rem;
	padding: 1rem;
`
