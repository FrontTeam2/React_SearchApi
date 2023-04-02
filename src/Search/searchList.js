import styled from 'styled-components'

function List({ list, focusInx, input }) {
	return (
		<>
			<S.Ul>
				<S.Div>
					<S.Sel>연관 검색어</S.Sel>
				</S.Div>
				{list.map((e, idx) => {
					return (
						<S.Li
							style={{
								backgroundColor:
									idx == focusInx ? 'rgb(220, 220, 220)' : 'white',
							}}
						>
							{e.includes(input) ? (
								<>
									{e.split(input)[0]}
									<span style={{ color: 'gray', fontWeight: '900' }}>
										{input}
									</span>
									{e.split(input)[1]}
								</>
							) : (
								<>{e}</>
							)}
						</S.Li>
					)
				})}
			</S.Ul>
		</>
	)
}
export default List
const Div = styled.div`
	width: 528px;
	display: flex;
	align-items: flex-end;
	border: 1px solid white;
	background-color: white;
	padding: 20px 0;
	font-weight: bold;
	justify-content: flex-start;
	font-size: 18px;
	opacity: 0.6;
`
const Sel = styled.div`
	font-size: 17px;
	padding-left: 20px;
`
const Ul = styled.div`
	border: 1px solid white;
	border-top: 1px solid gray;
	border-radius: 0 0 20px 20px;
	background-color: white;
`
const Li = styled.div`
	width: 528px;
	font-weight: bold;
	opacity: 0.7;
	font-size: 18px;
	text-align: left;
	padding: 5px 0 5px 20px;
	:last-child {
		border-radius: 0 0 20px 20px;
		border: 1px solid white;
	}
	border: 1px solid white;
	background-color: white;
`
const S = {
	Ul,
	Div,
	Sel,
	Li,
}
