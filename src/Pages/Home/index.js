import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import SearchApi from '../../Apis/searchApi'
import { FlexAlignCSS, MarginAuto } from '../../Styles/common'
import { IoSearchCircle } from 'react-icons/io5'
import useDebounceValue from '../../Hooks/useDebounce'

function HomePage() {
	const [result, setResult] = useState([])
	const [isSearch, setIsSearch] = useState('')
	const [recentList, setRecentList] = useState(
		JSON.parse(localStorage.getItem('recentList' || '')),
	)
	const [focusIdx, setFocusIdx] = useState(-1)
	const [focusText, setFocusText] = useState('')
	const debounceValue = useDebounceValue(isSearch)

	const handleChange = e => {
		setIsSearch(e.target.value)
	}

	// 데이터 호출
	useEffect(() => {
		const getSearchData = async () => {
			try {
				const res = await SearchApi.getSearch(debounceValue)
				setResult(res.data)
			} catch (error) {
				setResult([error.response.data])
				setFocusIdx(-1)
				setFocusText('')
			}
		}
		if (debounceValue) getSearchData()
	}, [debounceValue])

	useEffect(() => {
		if (!isSearch) {
			setFocusText(focusIdx >= 0 && recentList[focusIdx])
		} else {
			setFocusText(focusIdx >= 0 && result[focusIdx])
		}

		if (focusIdx < 0) {
			setFocusText('')
		}
	}, [focusIdx])

	// input 관련 핸들링
	const handleSearch = e => {
		if (e.key === 'ArrowDown') {
			if (isSearch) {
				setFocusIdx(prev => (prev + 1) % result.length)
			}

			if (!isSearch) setFocusIdx(prev => (prev + 1) % recentList.length)
		}

		if (e.key === 'ArrowUp') {
			if (isSearch) {
				setFocusIdx(prev => (prev - 1) % result.length)
			}

			if (!isSearch && focusIdx > -1) {
				setFocusIdx(prev => (prev - 1) % recentList.length)
			}
		}

		if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Process') {
			setFocusIdx(-1)
		}

		if (e.key === 'Enter') {
			// ArrowDown 이후에 담기고, Enter ? Enter 후에 로직이 실행 ?
			focusIdx >= 0 && result.length && setIsSearch(result[focusIdx])

			let addList
			if (recentList !== null) {
				addList = [result[focusIdx] || isSearch, ...recentList]
			} else {
				addList = [result[focusIdx] || isSearch]
			}

			setRecentList([...addList])

			// 포커스...?
			if (recentList !== null) {
				const newFocus = [result[focusIdx], ...recentList.slice(0, 4)]
				setRecentList(newFocus)
			}

			// 최근 검색어 : 5개 제한
			if (recentList !== null) {
				const newRecentSearch = [isSearch, ...recentList.slice(0, 4)]
				setRecentList(newRecentSearch)
			}

			// 중복 검색어 : 최근 검색어를 첫 번째로
			if (recentList !== null) {
				const elseList = recentList.filter(prev => prev !== isSearch)
				setRecentList([isSearch, ...elseList.slice(0, 4)])
			}

			setIsSearch('')
			setFocusText('')
		}
	}

	// 연관 검색어에 생성된 Box 클릭시, input value에 담게끔
	const searchClick = word => {
		setRecentList([word, ...recentList.slice(0, 4)])

		const newResult = recentList.find(item => item === word)
		const newList = recentList.filter(prev => prev !== word)

		if (newResult) {
			setRecentList([newResult, ...newList.slice(0, 4)])
		}

		setIsSearch(word)
	}

	// 로컬 스토리지 저장
	useEffect(() => {
		if (recentList !== null) {
			localStorage.setItem('recentList', JSON.stringify(recentList))
		}
	}, [recentList])

	return (
		<>
			<S.bodySection>
				<S.SearchContainer>
					<input
						value={focusText || isSearch}
						onChange={handleChange}
						onKeyDown={handleSearch}
						placeholder="검색어를 입력하세요."
					/>
					<S.SearchList>
						<S.DefaultSearch>
							{debounceValue &&
								result.map((resultText, index) => {
									return (
										<S.ResultBox
											key={index}
											onClick={() => searchClick(resultText)}
											style={{ background: focusIdx === index && '#f7f7f7' }}
										>
											<IoSearchCircle style={{ fontSize: '3rem' }} />
											{resultText.includes(isSearch) ? (
												<p>
													{resultText.split(isSearch)[0]}
													<span style={{ fontWeight: 'bold' }}>{isSearch}</span>
													{resultText.split(isSearch)[1]}
												</p>
											) : (
												<p>{resultText}</p>
											)}
										</S.ResultBox>
									)
								})}
						</S.DefaultSearch>
						{recentList && (
							<S.RecentSearch>
								<h3>최근 검색어</h3>
								{recentList.map((recentText, index) => {
									return (
										<S.ResultBox
											key={index}
											onClick={() => searchClick(recentText)}
											style={{
												background:
													!isSearch && focusIdx === index && '#f7f7f7',
											}}
										>
											<IoSearchCircle style={{ fontSize: '3rem' }} />
											<p>{recentText}</p>
										</S.ResultBox>
									)
								})}
							</S.RecentSearch>
						)}
					</S.SearchList>
				</S.SearchContainer>
			</S.bodySection>
		</>
	)
}

export default HomePage

const bodySection = styled.section`
	position: relative;
	${FlexAlignCSS}
	flex-direction: column;
`

const SearchContainer = styled.div`
	width: 100%;

	& > input {
		width: 100%;
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
		text-indent: 2rem;
		height: 5rem;
		box-sizing: border-box;
	}
`

const SearchList = styled.div`
	/* ${MarginAuto} */
	/* margin-top: 2rem; */
`

const DefaultSearch = styled.div`
	padding: 2rem 0;
`

const RecentSearch = styled.div`
	position: relative;

	& > h3 {
		padding: 0 2rem;
		margin-bottom: 1rem;
	}
`

const ResultBox = styled.div`
	padding: 0 2rem;
	cursor: pointer;
	width: 100%;
	height: 4rem;
	${FlexAlignCSS}

	&:hover {
		background: #f7f7f7;
	}

	& > svg {
		margin-right: 1rem;
		color: var(--color-light-gray);
	}
`

const S = {
	bodySection,
	SearchContainer,
	SearchList,
	DefaultSearch,
	RecentSearch,
	ResultBox,
}
