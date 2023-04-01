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

	// 포커스된 인덱스의 순서를 관리할 state
	const [focusIdx, setFocusIdx] = useState(-1)
	// 포커스된 텍스트를 관리할 state
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
				setResult([err.res.data])
			}
		}
		if (debounceValue) getSearchData()
	}, [debounceValue])

	useEffect(() => {
		if (focusIdx < result.length) {
			setFocusText(focusIdx >= 0 && result[focusIdx])
		}

		if (focusIdx < 0) {
			setFocusText(isSearch)
		}
	}, [focusIdx])

	// input에서 Enter 이후 실행
	const handleSearch = e => {
		if (e.key === 'ArrowDown') {
			setFocusIdx((focusIdx + 1) % result.length)
		}

		if (e.key === 'ArrowUp') {
			setFocusIdx((focusIdx - 1) % result.length)
		}

		if (e.key === 'Escape' || e.key === 'Backspace') {
			setFocusIdx(-1)
		}

		if (e.key === 'Enter') {
			e.preventDefault()

			// 없는 검색어 -> alert
			const isValid = result.find(prev => prev === isSearch)
			if (!isValid) {
				alert('검색 결과가 없습니다.')
				return
			}

			// 최근 검색어 : 5개 제한
			setRecentList([isSearch])
			if (recentList !== null) {
				const newRecentSearch = [isSearch, ...recentList.slice(0, 4)]
				setRecentList(newRecentSearch)
			}
			setIsSearch('')

			// 중복 검색어 : 최근 검색어를 첫 번째로
			if (recentList !== null) {
				const elseList = recentList.filter(prev => prev !== isSearch)
				setRecentList([isSearch, ...elseList.slice(0, 4)])
			}
		}
	}

	// 연관 검색어에 생성된 Box 클릭시, input value에 담게끔
	const handleConvertDefault = e => {
		const sameValue = result.find(
			prev => prev === e.target.children[1].innerText,
		)
		setIsSearch(sameValue)
	}

	// 최근 검색어에 생성된 Box 클릭시, input value에 담게끔
	const handleConvertRecent = e => {
		const sameValue = recentList.find(
			prev => prev === e.target.children[1].innerText,
		)
		setIsSearch(sameValue)
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
								result.map((list, index) => {
									return (
										<S.ResultBox key={index} onClick={handleConvertDefault}>
											<IoSearchCircle style={{ fontSize: '3rem' }} />
											<p>{list}</p>
										</S.ResultBox>
									)
								})}
						</S.DefaultSearch>
						{recentList && (
							<S.RecentSearch>
								<h3>최근 검색어</h3>
								{recentList.map((list, index) => {
									return (
										<S.ResultBox key={index} onClick={handleConvertRecent}>
											<IoSearchCircle style={{ fontSize: '3rem' }} />
											<p>{list}</p>
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
