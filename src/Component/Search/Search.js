import { useRef } from 'react'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SearchAPI from '../../Api/searchAPI'
// import { IoMdCloseCircleOutline } from "react-icons/io";

function Search() {
	const inputRef = useRef()

	const [text, setText] = useState('')
	const [textList, setTextList] = useState([])

	const [isFocus, setIsFocus] = useState(false)
	const [focusIdx, setFocusIdx] = useState(-1)
	const [focusText, setFocusText] = useState('')

	const [history, setHistory] = useState(
		JSON.parse(localStorage.getItem('search')),
	)

	const [isSearch, setIsSearch] = useState(false)

	const onChangeText = e => {
		setIsSearch(false)
		setIsFocus(true)
		setText(e.target.value)
	}

	const getData = useCallback(async () => {
		try {
			const res = await SearchAPI.getSearch({ text })
			setTextList(res.data.slice(0, 5))
		} catch (err) {
			setTextList([err.response.data])
		}
	}, [text])

	useEffect(() => {
		getData()
	}, [getData])

	useEffect(() => {
		if (!text) setFocusText(focusIdx >= 0 && history[focusIdx])
		else setFocusText(focusIdx >= 0 && textList[focusIdx])
	}, [focusIdx])

	const onKeydown = e => {
		let length = textList.length
		let isFocusable =
			length > 0 &&
			textList[0] !== '검색어를 입력해주세요.' &&
			textList[0] !== '검색 결과가 없습니다.'

		if (e.key === 'ArrowDown') {
			isFocusable && setFocusIdx(prev => (prev + 1) % length)
			if (!text) setFocusIdx(prev => (prev + 1) % history.length)
		} else if (e.key === 'ArrowUp') {
			isFocusable && setFocusIdx(prev => (prev - 1 + length) % length)
			if (!text) setFocusIdx(prev => (prev - 1) % history.length)
		} else if (e.key === 'Enter') {
			if (!text) setText(history[focusIdx])
			isFocusable && focusIdx >= 0 && setText(textList[focusIdx])

			console.log(text)

			let newHistory = [history[focusIdx], ...history]
			console.log(newHistory)

			if (history !== null) {
				newHistory = [
					textList[focusIdx] || history[focusIdx] || text,
					...history,
				]
			} else {
				newHistory = [textList[focusIdx] || history[focusIdx] || text]
			}

			const filterList = newHistory.filter(
				(el, i) => newHistory.indexOf(el) === i,
			)
			console.log(newHistory)

			if (history == null) {
				setHistory([...newHistory])
			} else {
				if (history.length >= 5) {
					setHistory([...filterList.slice(0, -1)])
				} else {
					setHistory([...filterList])
				}
			}

			setIsFocus(false)
			setIsSearch(true)
			inputRef.current.blur()
		}
	}
	console.log(text, focusText)
	console.log(focusIdx)

	const onSearch = word => {
		const newList = [word, ...history]
		setHistory(newList.filter((el, i) => newList.indexOf(el) === i))
	}

	useEffect(() => {
		if (history !== null) {
			localStorage.setItem('search', JSON.stringify([...new Set(history)]))
		}
	}, [history])

	useEffect(() => {
		setFocusIdx(-1)
	}, [isFocus])

	return (
		<S.Wrapper>
			<S.Container
				onFocus={() => {
					setIsFocus(true)
				}}
				onBlur={() => {
					setIsFocus(false)
				}}
			>
				{/* <S.Logo>HN</S.Logo> */}
				<S.SearchBox>
					<S.SearchBar
						onChange={onChangeText}
						onKeyDown={onKeydown}
						value={focusText || text}
						ref={inputRef}
						onFocus={() => {
							setIsSearch(false)
						}}
					/>
					{/* <IoMdCloseCircleOutline /> */}
					<S.SearchButton>
						<S.SearchImg src="../../search.png" />
					</S.SearchButton>
				</S.SearchBox>
				<S.SearchResult state={isFocus}>
					{!text && (
						<S.SearchHistories>
							<div>최근 검색어</div>
							{history ? (
								history.map((item, index) => {
									return (
										<S.SearchFocus
											key={index}
											style={{
												backgroundColor: focusIdx === index && '#D9D9D9',
											}}
											onClick={() => onSearch(text)}
										>
											{item}
										</S.SearchFocus>
									)
								})
							) : (
								<div>최근 검색어가 없습니다</div>
							)}
						</S.SearchHistories>
					)}
					{text && (
						<S.SearchChange>
							<div>추천 검색어</div>
							{textList.map((text, index) => {
								return (
									<S.SearchFocus
										key={index}
										style={{
											backgroundColor: focusIdx === index && '#D9D9D9',
										}}
										onClick={() => onSearch(text)}
									>
										{text}
									</S.SearchFocus>
								)
							})}
						</S.SearchChange>
					)}
				</S.SearchResult>
			</S.Container>
			{isSearch && <div>'{text}'검색 결과입니다</div>}
		</S.Wrapper>
	)
}
export default Search

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Container = styled.div`
	width: 40%;
`

const SearchBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0px auto;
	margin-top: 20px;
`

const Logo = styled.div`
	color: ${({ theme }) => theme.PALETTE.primary};
	font-size: xx-large;
	font-weight: 900;
	margin-right: 10px;
`

const SearchResult = styled.div`
	border: 2px solid ${({ theme }) => theme.PALETTE.gray[200]};
	display: ${({ state }) => (state ? 'block' : 'none')};
`

const SearchBar = styled.input`
	border: 2px solid ${({ theme }) => theme.PALETTE.primary};
	font-size: large;
	padding: 10px;
	margin: 0px;
	width: 100%;
`

const SearchButton = styled.button`
	width: 44.67px;
	height: 44.67px;
	background-color: ${({ theme }) => theme.PALETTE.primary};
`

const SearchImg = styled.img`
	width: 50%;
	height: 50%;
`

const SearchHistories = styled.ul`
	width: 100%;
	margin-top: 10px;
`

const SearchFocus = styled.li`
	padding: 10px 5px;
`

const SearchChange = styled.div`
	margin-top: 10px;
	/* text-align: center; */
`

const S = {
	Wrapper,
	Container,
	SearchBox,
	Logo,
	SearchResult,
	SearchBar,
	SearchButton,
	SearchImg,
	SearchHistories,
	SearchFocus,
	SearchChange,
}
