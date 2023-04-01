import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import List from './searchList'
import useDeBounce from '../CustomHooks/useDebounce'
import RecentList from './recentList'

function SearchMain() {
	const [list, setList] = useState([])
	const [input, setInput] = useState('')
	const [recent, setRecent] = useState(
		JSON.parse(localStorage.getItem('recent')),
	)
	// 커스텀훅 만들어서 api를 0.5sec로 조절함
	const debounceVal = useDeBounce(input)

	// axios통신
	const getData = async () => {
		try {
			const { data } = await axios.get(
				`http://localhost:8080/search?key=${debounceVal}`,
			)
			setList(data)
		} catch (err) {
			setList([err.response.data])
		}
	}
	console.log(recent)
	// input값 state관리
	const searchInput = e => {
		setInput(e.target.value)
	}

	// debounceVal 변경할때마다 axios 통신
	useEffect(() => {
		getData()
	}, [debounceVal])

	//추가버튼
	const onSearchBtn = () => {
		if (!input) return
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

	//최근검색 초기화버튼
	const [focusInx, setFocusInx] = useState(-1)
	const [focusRecentInx, setFocusRecentInx] = useState(-1)

	const onResetBtn = () => {
		localStorage.clear()
		setRecent([])
	}

	//키보드 이벤트
	const onkeyDown = e => {
		//검색list
		if (e.key === 'ArrowDown') {
			setFocusInx(prev => (prev + 1) % list.length)
			if (!input) {
				{
					setFocusRecentInx(prev => (prev + 1) % recent.length)
				}
			}
		}
		if (e.key === 'ArrowUp') {
			focusInx === -1
				? setFocusInx(list.length - 1)
				: setFocusInx(prev => prev - 1)
		}
		if (!input) {
			focusRecentInx === -1
				? setFocusRecentInx(list.length - 1)
				: setFocusRecentInx(prev => prev - 1)
		}
		console.log(list[focusInx + 1])
	}
	return (
		<S.Div>
			<S.Search>
				<S.Input onChange={searchInput} onKeyDown={onkeyDown} />
				<Button onClick={onSearchBtn}>검색</Button>
				<Button onClick={onResetBtn}>reset</Button>
			</S.Search>
			{debounceVal.length === 0 && recent ? (
				<RecentList recent={recent} focusRecentInx={focusRecentInx} />
			) : (
				<List list={list} focusInx={focusInx} />
			)}
		</S.Div>
	)
}

export default SearchMain

const Div = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 100px;
`
const Input = styled.input`
	padding: 8px 84px;
	font-size: 18px;
	text-align: center;
	border: none;
	font-weight: bold;
`
const Not = styled.div`
	padding: 8px 138px;
	font-size: 18px;
	font-weight: bold;
	font-size: 18px;
	border: none;
`

const Search = styled.button`
	display: flex;
	margin: 0;
	padding: 0;
`
const S = {
	Div,
	Input,
	Not,
	Search,
}
const Button = styled.button`
	padding: 10px 5px;
	font-size: 18;
	border: none;
`
