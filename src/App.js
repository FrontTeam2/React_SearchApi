import { useEffect, useState } from 'react'

import { GlobalStyle } from './Styles/global'
import S from './Styles/styles'
import { AiOutlineEnter } from 'react-icons/ai'

import ColoredItem from './Components/ColoredItem'
import SearchApi from './Apis/searchApi'
import useDebounce from './Hooks/useDebounce'
import Bottom from './Components/Bottom'

function App() {
	const [searchText, setSearchText] = useState('')
	const [searchList, setSearchList] = useState([])

	const [focusIdx, setFocusIdx] = useState(-1)
	const [focusText, setFocusText] = useState('')

	const [recentView, setRecentView] = useState(true)
	const [recentList, setRecentList] = useState(
		JSON.parse(localStorage.getItem('recent')),
	)

	const debounceSearchTerm = useDebounce(searchText, 300)

	const getSearchList = async key => {
		try {
			const { data } = await SearchApi.getSearchValue(key)
			setSearchList(data.slice(0, 10))
		} catch (err) {
			setSearchList([err.response.data])
			setFocusIdx(-1)
			setFocusText('')
		}
	}

	const changeFocus = e => {
		const search_len = searchList.length
		const recent_len = recentList.length

		const isFocusable =
			search_len > 0 &&
			searchList[0] !== '검색어를 입력해주세요.' &&
			searchList[0] !== '검색 결과가 없습니다.'

		if (e.key === 'ArrowDown') {
			isFocusable && setFocusIdx(prev => (prev + 1) % search_len)
			if (!searchText) setFocusIdx(prev => (prev + 1) % recent_len) // 최근 검색어에서의 focus 로직
		}
		if (e.key === 'ArrowUp') {
			isFocusable && setFocusIdx(prev => (prev - 1) % search_len)
			if (!searchText) setFocusIdx(prev => (prev - 1) % recent_len) // 최근 검색어에서의 focus 로직
		}
		if (e.key === 'Escape' || e.key === 'Backspace') {
			setFocusIdx(-1)
		}
		if (e.key === 'Enter') {
			isFocusable && focusIdx >= 0 && setSearchText(searchList[focusIdx])
			let addList

			if (recentList !== null)
				addList = [searchList[focusIdx] || searchText, ...recentList]
			else addList = [searchList[focusIdx] || searchText]

			const filterList = addList.filter((el, i) => addList.indexOf(el) === i) // 중복되어 있는 word 미리 지우는 작업

			if (recentList === null) {
				setRecentList([...addList])
			} else {
				if (recentList.length >= 5) {
					setRecentList([...filterList.slice(0, -1)])
				} else {
					setRecentList([...filterList])
				}
			}

			if (!searchText) onClickSearch(recentList[focusIdx])

			setSearchText('') // 보기 편하게

			// 초기화
			setFocusText('')
			setFocusIdx(-1)
			setSearchList([])
		}
	}

	const onClickSearch = word => {
		const newList = [word, ...recentList]
		setRecentList(newList.filter((el, i) => newList.indexOf(el) === i))
	}

	useEffect(() => {
		if (!searchText) setFocusText(focusIdx >= 0 && recentList[focusIdx])
		else setFocusText(focusIdx >= 0 && searchList[focusIdx])
	}, [focusIdx])

	useEffect(() => {
		if (recentList !== null) {
			localStorage.setItem('recent', JSON.stringify([...new Set(recentList)]))
		}
	}, [recentList])

	const handleSearchTermChange = e => {
		if (recentList !== null || !searchText) setRecentView(true)
		setFocusIdx(-1)
		setSearchText(e.target.value)
	}

	useEffect(() => {
		getSearchList(debounceSearchTerm)
	}, [debounceSearchTerm])

	return (
		<>
			<GlobalStyle />
			<S.Wrapper>
				<S.Container>
					<div>
						<input
							value={focusText || searchText}
							onChange={handleSearchTermChange}
							onKeyDown={changeFocus}
							placeholder="검색어를 입력해주세요 :D"
						/>
					</div>
					<S.ResultContainer>
						{searchList.length > 0 &&
							searchText &&
							searchList.map((text, i) => (
								<S.ResultBox
									key={i}
									onClick={() => {
										onClickSearch(text)
										setSearchText('') // 보기 편하도록
									}}
									style={{
										display: text === '검색어를 입력해주세요.' && 'none',
										backgroundColor: focusIdx === i && 'rgb(220, 220, 220)',
									}}
								>
									<ColoredItem item={text} query={searchText} />
									<span style={{ display: focusIdx !== i && 'none' }}>
										<AiOutlineEnter />
									</span>
								</S.ResultBox>
							))}
					</S.ResultContainer>
					<S.ResultContainer state={!recentView}>
						<S.SmallText state={recentView && !searchText}>
							최근 검색어
						</S.SmallText>
						{recentList !== null &&
							recentView &&
							!searchText &&
							recentList.map((word, i) => (
								<S.ResultBox
									key={i}
									style={{
										backgroundColor: focusIdx === i && 'rgb(220, 220, 220)',
									}}
									onClick={() => {
										onClickSearch(word)
										setFocusIdx(-1)
									}}
								>
									{word}
								</S.ResultBox>
							))}
					</S.ResultContainer>
					<Bottom />
				</S.Container>
			</S.Wrapper>
		</>
	)
}

export default App

/*
      진행 과정 정리 🚀

      1. input을 통해 onChange={ handleSearchTermChange } 가 실행된다.
      
        -> input창에 보이는 searchText가 실시간으로 변경
        -> debouncedSearch(입력한 값)을 실시간으로 호출

      2. debouncedSearch(입력한 값)으로 delayedSearchState가 변경되고

        -> 변경되면 API 요청을 보낸다

      3. delayedSearchState가가 변경되었으니 해당 state를 걸어둔 useEffect가 실행된다

        -> 그런데 그 요청은 0.3초 이후에 보내도록
        -> ※ 그런데 이 delayedSearchState가 계속 계속 바뀌게 되면 timer가 생기고 api 요청이 이루어지기도 전에
            지워지고를 바로 하다보니
            ==> 결론적으로는 입력이 멈춘 후 0.3초 동안 기다린 후에 API 요청을 보낸다


      ==> 결론적으로는 onChange 이벤트가 발생할 때마다 
            API 요청을 보내지 않고, 일정 term을 두고 요청을 보낸다.
            너무 많은 이벤트를 호출하지 않아 과도한 api 요청을 하지 않아 성능 개선에 도움이 되어 보인다.

            특히, 사용감에도 큰 불편이 없었다 !
  */
