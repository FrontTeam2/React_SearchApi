import { useEffect, useState } from 'react'

import { SearchApi } from './Apis/SearchApi'
import { FaRegClock, FaSearch, FaSearchPlus, FaTimes } from 'react-icons/fa'
import styled from 'styled-components'

function App() {
	const [search, setSearch] = useState('')
	const [focus, setFocus] = useState(false)
	const [relevantSearch, setRelevantSearch] = useState([])
	const [recentSearch, setRecentSearch] = useState([])
	const storedData = JSON.parse(localStorage.getItem('recentSearch'))

	const [focusIdx, setFocusIdx] = useState(-1)
	const getSearchList = async key => {
		try {
			const { data } = await SearchApi.getSearch(key)

			setRelevantSearch(data.slice(0, 10))
		} catch (err) {
			setRelevantSearch([err.response.data])
		}
	}

	const onFocus = () => {
		setFocus(true)
	}
	const onBlur = () => {
		setFocus(false)
	}
	useEffect(() => {
		// 디바운싱 작업
		const timer = setTimeout(() => {
			getSearchList(search)
		}, 300)

		return () => {
			clearTimeout(timer)
		}
	}, [search])

	useEffect(() => {
		if (storedData) {
			setRecentSearch(storedData)
		}
	}, [])

	useEffect(() => {
		// 로컬 스토리지에 최근검색어 저장
		localStorage.setItem('recentSearch', JSON.stringify(recentSearch))
	}, [recentSearch])

	const handleSearch = event => {
		event.preventDefault()

		setRecentSearch([search])
		if (recentSearch) {
			const newRecent = [search, ...recentSearch.slice(0, 4)]
			setRecentSearch(newRecent)
		}
		if (recentSearch) {
			//중복 키워드 작업
			const elseRecent = recentSearch.filter(item => item !== search)
			setRecentSearch([search, ...elseRecent.slice(0, 4)])
		}
	}

	const handleInputChange = event => {
		setSearch(event.target.value)
	}

	const onDeleteSearch = () => {
		setSearch('')
	}
	const onClickChangeSearch = value => {
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
		<Wrapper>
			<SearchBox onSubmit={handleSearch} onFocus={onFocus}>
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
						onChange={handleInputChange}
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
										search === '' ? null : item === '검색 결과가 없습니다.' ? (
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
	)
}

export default App

const Wrapper = styled.div`
	width: 600px;
	height: 500px;
	margin: 0 auto;
	margin-top: 100px;
	border-radius: 10px;
	box-shadow: 3px 3px 3px 3px gray;
	background-color: #fff;
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
	/* border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px; */
	/* box-shadow: 0px 0px 3px 0px gray; */
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
	:focus {
		outline: none;
	}

	padding: 10px 40px;
`

const SearchButton = styled.button`
	width: 10%;

	border: none;
	background-color: white;
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
