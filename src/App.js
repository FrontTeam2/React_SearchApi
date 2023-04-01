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

	const onChangeFocus = event => {
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
			<SearchBox onSubmit={handleSearch}>
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
					onFocus={onFocus}
					onBlur={onBlur}
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
			</SearchBox>
			<RecentBox>
				{focus && recentSearch.length > 0 && (
					<Recent>
						{recentSearch.map((item, index) => (
							<li key={index}>
								<FaRegClock />
								{item}
							</li>
						))}
					</Recent>
				)}
			</RecentBox>
			<RelevantBox>
				{focus &&
					relevantSearch &&
					relevantSearch.map((item, idx) => {
						return (
							<Relvant
								key={idx}
								style={{
									backgroundColor: focusIdx === idx && 'rgb(220,220,200)',
								}}
							>
								{item === '검색어를 입력해주세요.' ||
								search === '' ? null : item === '검색 결과가 없습니다.' ? (
									<>{item}</>
								) : (
									<>
										<FaSearchPlus />
										{item}
									</>
								)}
							</Relvant>
						)
					})}
			</RelevantBox>
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
	align-items: center;
`

const SearchBox = styled.form`
	position: relative;
	width: 100%;
	display: flex;
	padding: 0 10 0 10px;
`

const Input = styled.input`
	width: 90%;
	border-radius: 3px;

	padding: 10px 30px;
`

const SearchButton = styled.button`
	width: 10%;
	border-radius: 3px;
	background-color: white;
	cursor: pointer;
`
const RelevantBox = styled.div`
	width: 100%;

	align-items: flex-start;
`
const Relvant = styled.span`
	margin-left: 20px;
	display: flex;
	gap: 10px;
	align-items: center;
	:hover {
		background-color: rgb(220, 220, 200);
	}
`

const RecentBox = styled.div`
	width: 100%;
`
const Recent = styled.ul`
	margin-left: 20px;
	align-items: flex-start;
	padding: 0;
	& > li {
		list-style: none;
		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 16px;
		:hover {
			background-color: rgb(220, 220, 200);
		}
	}
`
