import { useState } from 'react'
import styled from 'styled-components'

function List({ list }) {
	const [focusIdx, setFocusIdx] = useState(-1)

	// if (e.key === 'ArrowDown') {
	// 	recLength > 0 && recLength < maxList
	// 		? setFocusIdx(prev => (prev + 1) % recLength)
	// 		: setFocusIdx(prev => (prev + 1) % maxList)
	// }

	return (
		<>
			<H2>추천검색어</H2>
			<S.Ul>
				{list.map((e, idx) => {
					return <S.Li focus={focusIdx === idx}>{e}</S.Li>
				})}
			</S.Ul>
		</>
	)
}
export default List
const H2 = styled.h2`
	text-align: center;
`
const Ul = styled.div``
const Li = styled.div`
	width: 408px;
	font-weight: bold;
	font-size: 18px;
	border-bottom: 1px solid black;
	text-align: center;
	padding: 5px 0;
	cursor: pointer;
	&:hover {
		background-color: #f0f0f0;
	}
`
const S = {
	Ul,
	Li,
}
