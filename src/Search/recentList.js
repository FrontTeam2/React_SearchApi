import styled from 'styled-components'

function RecentList({ recent, focusRecentInx }) {
	return (
		<>
			<S.Ul>
				<H2>최근검색어</H2>
				{recent.map((e, idx) => {
					return (
						<S.Li
							style={{
								backgroundColor:
									idx == focusRecentInx ? 'rgb(220, 220, 220)' : 'white',
							}}
						>
							{idx + 1}번: {e}
						</S.Li>
					)
				})}
			</S.Ul>
		</>
	)
}
export default RecentList

const Ul = styled.div``
const Li = styled.div`
	width: 408px;
	font-weight: bold;
	font-size: 18px;
	border-bottom: 1px solid black;
	text-align: center;
	padding: 5px 0;
`
const H2 = styled.h2`
	text-align: center;
`
const S = {
	Ul,
	Li,
}
