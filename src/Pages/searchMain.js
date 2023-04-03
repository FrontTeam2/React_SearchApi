import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import List from './searchList'
import useDeBounce from '../CustomHooks/useDebounce'
import RecentList from '../Pages/recentList'
function SearchMain() {
	const [list, setList] = useState([])
	const [input, setInput] = useState('')
	const [recent, setRecent] = useState([])
	const [focusInx, setFocusInx] = useState(-1)

	const debounceVal = useDeBounce(input)

	const getData = async () => {
		try {
			const { data } = await axios.get(
				`http://localhost:8080/search?key=${debounceVal}`,
			)
			setList(data)
		} catch (err) {}
	}

	const searchInput = e => {
		setInput(e.target.value)
	}

	useEffect(() => {
		getData()
	}, [debounceVal])

	const onSearchBtn = () => {
		if (input.trim().length === 0) return

		if (!localStorage.getItem('recent')) {
			localStorage.setItem('recent', JSON.stringify([]))
		}
		localStorage.setItem('recent', JSON.stringify(recent))
		const arr = JSON.parse(localStorage.getItem('recent'))

		if (arr.find(el => el === input)) {
			let overlapArr = arr.filter(el => el !== input)
			return (
				overlapArr.unshift(input),
				setRecent(overlapArr),
				localStorage.setItem('recent', JSON.stringify(overlapArr))
			)
		}
		arr.unshift(input)
		if (arr.length === 6) {
			arr.pop()
		}
		setRecent(arr)
		localStorage.setItem('recent', JSON.stringify(arr))
	}

	const onkeyDown = e => {
		if (e.nativeEvent.isComposing) return
		if (e.key === 'ArrowDown') {
			setFocusInx(prev => (prev + 1) % list.length)
		}
		if (e.key === 'ArrowUp') {
			focusInx === -1
				? setFocusInx(list.length - 1)
				: setFocusInx(prev => prev - 1)
		}
		if (e.key === 'Enter') {
			if (input.trim().length === 0) return
			if (!localStorage.getItem('recent')) {
				localStorage.setItem('recent', JSON.stringify([]))
			}
			localStorage.setItem('recent', JSON.stringify(recent))
			const arr = JSON.parse(localStorage.getItem('recent'))
			if (arr.find(el => el === input)) {
				let overlapArr = arr.filter(el => el !== input)
				return (
					overlapArr.unshift(input),
					setRecent(overlapArr),
					localStorage.setItem('recent', JSON.stringify(overlapArr))
				)
			}
			arr.unshift(list[focusInx])
			if (arr.length === 6) {
				arr.pop()
			}
			setRecent(arr)
			localStorage.setItem('recent', JSON.stringify(arr))
			setFocusInx(-1)
		}
	}

	return (
		<S.Div>
			<S.Search>
				<S.Input
					onChange={searchInput}
					onKeyDown={onkeyDown}
					value={list[focusInx]}
					placeholder={'무엇이든 검색해보살 :)'}
				/>
				<S.Button1 onClick={onSearchBtn}>검색</S.Button1>

				{debounceVal.length === 0 && recent ? (
					<RecentList recent={recent} setRecent={setRecent} />
				) : (
					<List list={list} focusInx={focusInx} input={input} recent={recent} />
				)}
			</S.Search>
		</S.Div>
	)
}

export default SearchMain

const Div = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 100px;
	background-color: #505050;
	border: none;
	height: 2000px;
`
const Input = styled.input`
	padding: 10px 320.5px 10px 22.5px;
	font-size: 18px;
	text-align: left;
	font-weight: bold;
	border-radius: 20px 20px 0 0;
	border: 1px solid white;
	position: relative;
	:focus {
		outline: none;
		border-radius: 20px 20px 0 0;
	}
`

const Search = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0;
	padding: 0;
	border: none;
	border-bottom: 1px solid gray;
	background-color: #505050;
`
const Button1 = styled.button`
	font-size: 20px;
	opacity: 0.6;
	font-weight: bold;
	border: none;
	cursor: pointer;
	position: absolute;
	right: 600px;
	top: 117px;
	border: none;
	background-color: white;
	:hover {
		color: gray;
	}
`
const S = {
	Div,
	Input,
	Search,
	Button1,
}
