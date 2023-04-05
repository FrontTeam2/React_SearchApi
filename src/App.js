import { useEffect, useState } from 'react'

import { SearchApi } from './Apis/SearchApi'
import { FaRegClock, FaSearch, FaSearchPlus, FaTimes } from 'react-icons/fa'
import styled from 'styled-components'
import useDebounce from './hooks/useDebounce'
import Logo from './Logo/YoonGle.png'

function App() {
	const [search, setSearch] = useState('')
	const [focus, setFocus] = useState(false)
	const [relevantSearch, setRelevantSearch] = useState([])
	const [recentSearch, setRecentSearch] = useState([])
	const storedData = JSON.parse(localStorage.getItem('recentSearch'))

	const debounceSearch = useDebounce(search) // 디바운싱 커스텀 hook함수화

	const [focusIdx, setFocusIdx] = useState(-1)
	const getSearchList = async () => {
		try {
			const { data } = await SearchApi.getSearch(debounceSearch)

			setRelevantSearch(data.slice(0, 10))
		} catch (err) {
			setRelevantSearch([err.response.data])
		}
	}

	const onFocus = () => {
		// 검색어 입력창 포커스
		setFocus(true)
	}
	const onBlur = () => {
		setFocus(false)
	}
	useEffect(() => {
		getSearchList()
	}, [debounceSearch])

	useEffect(() => {
		if (storedData) {
			setRecentSearch(storedData)
			// 화면이 랜더링 될때마다 로컬 스토리지의 저장 값들을  최근 검색어에 set
		}
	}, [])

	useEffect(() => {
		// 로컬 스토리지에 최근검색어 저장
		localStorage.setItem('recentSearch', JSON.stringify(recentSearch))
	}, [recentSearch])

	const onSearch = event => {
		event.preventDefault()

		setRecentSearch([search])
		if (recentSearch) {
			// 최근 검색어 5개까지만 담아주기
			const newRecent = [search, ...recentSearch.slice(0, 4)]
			setRecentSearch(newRecent)
		}
		if (recentSearch) {
			//최근 검색어 중복키워드 작업
			const elseRecent = recentSearch.filter(item => item !== search)
			setRecentSearch([search, ...elseRecent.slice(0, 4)])
		}
	}

	const onInputChange = event => {
		setSearch(event.target.value)
	}

	const onDeleteSearch = () => {
		// 검색어 입력 도중 X버튼 클릭시 검색어 초기화
		setSearch('')
	}
	const onClickChangeSearch = value => {
		// 마우스로 연관 검색어 및 최근 검색어 클릭시 해당 키워드로 변경
		setSearch(value)
	}
	const onChangeFocus = event => {
		//키보드 이벤트
		let length = relevantSearch.length

		let isFocus =
			length > 0 &&
			relevantSearch[0] !== '검색어를 입력해주세요.' &&
			relevantSearch[0] !== '검색 결과가 없습니다.'

		if (event.key === 'ArrowDown') {
			isFocus && setFocusIdx(prev => (prev + 1) % length)
		}
		if (event.key === 'ArrowUp') {
			isFocus && setFocusIdx(prev => (prev - 1 + length) % length)
		}
		if (event.key === 'Escape' || event.key === 'Backspace') {
			setFocusIdx(-1)
		}
		if (event.key === 'Enter') {
			isFocus && focusIdx >= 0 && setSearch(relevantSearch[focusIdx])
			setFocusIdx(-1)
			setRelevantSearch([])
		}
	}

	return (
		<>
			<LogoBox>
				<img src={Logo} />
			</LogoBox>
			<Wrapper>
				<SearchBox onSubmit={onSearch} onFocus={onFocus}>
					<InputBox>
						<FaSearch
							style={{
								position: 'absolute',
								top: '50%',
								left: '20px',
								transform: 'translate(-50%,-50%)',
							}}
						/>
						<Input
							type="text"
							placeholder="검색어를 입력해주세요."
							value={search}
							onChange={onInputChange}
							onKeyDown={onChangeFocus}
						/>
						{search !== '' && (
							<FaTimes
								style={{
									position: 'absolute',
									top: '50%',
									right: '55',
									transform: 'translate(-50%,-50%)',
									cursor: 'pointer',
								}}
								onClick={onDeleteSearch}
							/>
						)}

						<SearchButton type="submit">검색</SearchButton>
					</InputBox>
					<RecentBox>
						{focus && recentSearch.length > 0 && (
							<Recent>
								{recentSearch.map((item, index) => (
									<li key={index} onClick={() => onClickChangeSearch(item)}>
										<FaRegClock />
										{item}
									</li>
								))}
							</Recent>
						)}
					</RecentBox>
					<RelevantBox>
						{focus && relevantSearch.length > 0 && (
							<Relvant>
								{relevantSearch.map((item, idx) => {
									return (
										<li
											key={idx}
											onClick={() => onClickChangeSearch(item)}
											style={{
												backgroundColor: focusIdx === idx && 'rgb(220,220,200)',
											}}
										>
											{item === '검색어를 입력해주세요.' ||
											search === '' ? null : item ===
											  '검색 결과가 없습니다.' ? (
												<>{item}</>
											) : item.includes(search) ? (
												<>
													<FaSearchPlus />
													<p>
														{item.split(search)[0]}
														<span style={{ fontWeight: 'bold' }}>{search}</span>
														{item.split(search)[1]}
													</p>
												</>
											) : (
												<>
													<FaSearchPlus />
													{item}
												</>
											)}
										</li>
									)
								})}
							</Relvant>
						)}
					</RelevantBox>
				</SearchBox>
			</Wrapper>
		</>
	)
}

export default App

const LogoBox = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 100px;
`

const Wrapper = styled.div`
	width: 600px;
	height: 500px;
	margin: 0 auto;
	margin-top: 10px;
	border-radius: 10px;
	box-shadow: 3px 3px 3px 3px gray;
	background-color: #f7f7f7;
	display: flex;
	flex-direction: column;
`

const SearchBox = styled.form`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1px;
	margin-top: 10px;
	border: none;
	border-radius: 10px;
`
const InputBox = styled.div`
	position: relative;
	width: 100%;
	display: flex;

	border-bottom: 1px solid gray;
`
const Input = styled.input`
	width: 90%;
	border: none;
	background-color: #f7f7f7;
	:focus {
		outline: none;
	}

	padding: 10px 40px;
`

const SearchButton = styled.button`
	width: 10%;

	border: none;
	background-color: #f7f7f7;
	cursor: pointer;
`
const RelevantBox = styled.div`
	width: 100%;
`
const Relvant = styled.ul`
	margin: 0 20px;
	align-items: flex-start;
	padding: 0;

	& > li {
		list-style: none;
		align-items: center;
		font-size: 16px;
		cursor: pointer;
		display: flex;
		gap: 10px;
		> p {
			margin: 0;
		}

		:hover {
			background-color: rgb(220, 220, 200);
		}
	}
`

const RecentBox = styled.div`
	width: 100%;
`
const Recent = styled.ul`
	margin: 20px 20px;
	align-items: flex-start;
	padding: 0;

	& > li {
		list-style: none;
		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 16px;
		cursor: pointer;

		:hover {
			background-color: rgb(220, 220, 200);
		}
	}
`
