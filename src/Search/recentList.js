import styled from 'styled-components'

function RecentList({ recent, setRecent }) {
	const onResetBtn = () => {
		localStorage.clear()
		setRecent([])
	}

	return (
		<>
			<S.Ul>
				<S.Div>
					<S.Sel>최근 검색어</S.Sel>
					<S.Button2 onClick={onResetBtn}>전체삭제</S.Button2>
				</S.Div>
				{recent.map(e => {
					return <S.Li>{e}</S.Li>
				})}
			</S.Ul>
		</>
	)
}
export default RecentList

const Ul = styled.div`
	border: 1px solid white;
	border-top: 1px solid gray;
	border-radius: 0 0 20px 20px;
	background-color: white;
`
const Div = styled.div`
	width: 528px;
	display: flex;
	align-items: flex-end;
	border: 1px solid white;
	background-color: white;
	padding: 5px 0 5px 20px;
	font-weight: bold;
	justify-content: space-between;
	font-size: 18px;
	opacity: 0.6;
`
const Li = styled.div`
	font-weight: bold;
	font-size: 18px;
	text-align: left;
	opacity: 0.7;
	width: 528px;
	padding: 5px 0 5px 20px;
	:last-child {
		border-radius: 0 0 20px 20px;
		border: 1px solid white;
	}
	border: 1px solid white;
	background-color: white;
`
const Button2 = styled.button`
	font-size: 17px;
	border: none;
	border-radius: 50%;
	background-color: white;
	cursor: pointer;
	:hover {
		color: gray;
	}
`
const Sel = styled.div`
	font-size: 17px;

	background-color: white;
`
const S = {
	Ul,
	Div,
	Sel,
	Button2,
	Li,
}
