import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import List from './searchList'
import useDeBounce from '../src/Use/useDebounce'
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

	// input값 state관리
	const searchInput = e => {
		setInput(e.target.value)
	}

	// debounceVal 변경할때마다 axios 통신
	useEffect(() => {
		getData()
	}, [debounceVal])

	//추가버튼
	/*
		추가버튼을 누를시
		1. localStorage에 값이 없다 그러면 로컬 스토리지에 빈배열 집어놓고
		2. 그리고 localStorage에 빈배열 집어 넣어라
		3. arr즉 변수 만들고 'recent'
	*/
	const onSearchBtn = () => {
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
	const onResetBtn = () => {
		localStorage.clear()
		setRecent([])
	}

	const onkeyDown = e => {
		// -1에서 시작해서 인덱스 0~4까지 가는 형식으로 가야한다.
		//
		let recLength = recent.length
		console.log(recLength)
		if (e.key === 'ArrowDown') {
			setFocusInx(prev => (prev + 1) % recLength)
		}

		console.log(focusInx)
	}
	return (
		<S.Div>
			<S.Search>
				<S.Input onChange={searchInput} onKeyDown={onkeyDown} />
				<Button onClick={onSearchBtn}>검색</Button>
				<Button onClick={onResetBtn}>reset</Button>
			</S.Search>
			{debounceVal.length === 0 && recent ? (
				<RecentList recent={recent} />
			) : (
				<List list={list} />
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
