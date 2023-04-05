import { useEffect, useState } from 'react'

import { SearchApi } from './Apis/SearchApi'
import {
	FaRegClock,
	FaSearch,
	FaSearchMinus,
	FaSearchPlus,
	FaTimes,
} from 'react-icons/fa'
import styled from 'styled-components'
import useDebounce from './hooks/useDebounce'
import Logo from './Logo/DongGle.png'

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
	const onDeleteRecent = target => {
		// 최근 검색어 삭제기능
		const deleteRecent = recentSearch.filter(item => item !== target)
		setRecentSearch(deleteRecent)
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
				<a href="/">
					<img src={Logo} />
				</a>
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
							<>
								{recentSearch.map((item, index) => {
									return (
										<Recent key={index}>
											<div onClick={() => onClickChangeSearch(item)}>
												<FaRegClock
													style={{
														position: 'absolute',
														top: '50%',
														left: '20px',
														transform: 'translate(-50%,-50%)',
													}}
												/>
												{item}
											</div>
											<div>
												<FaSearchMinus
													style={{
														position: 'absolute',
														right: '10px',
														top: '50%',
														transform: 'translate(-50%,-50%)',
														cursor: 'pointer',
													}}
													onClick={() => onDeleteRecent(item)}
												/>
											</div>
										</Recent>
									)
								})}
							</>
						)}
					</RecentBox>
					<RelevantBox>
						{focus && relevantSearch.length > 0 && (
							<>
								{relevantSearch.map((item, idx) => {
									return (
										<Relvant key={idx}>
											<div
												onClick={() => onClickChangeSearch(item)}
												style={{
													backgroundColor:
														focusIdx === idx && 'rgb(255,255,255)',
												}}
											>
												{item === '검색어를 입력해주세요.' ||
												search === '' ? null : item ===
												  '검색 결과가 없습니다.' ? (
													<>{item}</>
												) : item.includes(search) ? (
													<>
														<FaSearchPlus
															style={{
																position: 'absolute',
																top: '50%',
																left: '20px',
																transform: 'translate(-50%,-50%)',
															}}
														/>
														<div>
															{item.split(search)[0]}
															<span style={{ fontWeight: 'bold' }}>
																{search}
															</span>
															{item.split(search)[1]}
														</div>
													</>
												) : (
													<>
														<FaSearchPlus
															style={{
																position: 'absolute',
																top: '50%',
																left: '20px',
																transform: 'translate(-50%,-50%)',
															}}
														/>
														{item}
													</>
												)}
											</div>
										</Relvant>
									)
								})}
							</>
						)}
					</RelevantBox>
				</SearchBox>
			</Wrapper>
		</>
	)
}

export default App

const LogoBox = styled.div`
	margin: 0 auto;
	margin-top: 100px;
	text-align: center;
	width: 600px;
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
const Relvant = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0px 40px;
	:hover {
		background-color: #fff;
	}
	}
`

const RecentBox = styled.div`
	width: 100%;
`
const Recent = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0px 40px;
	:hover {
		background-color: #fff;
	}
`
