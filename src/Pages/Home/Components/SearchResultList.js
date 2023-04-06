import { useAuth } from 'Contexts/searchAuth'
import styled from 'styled-components'

function SearchResultList() {
	const auth = useAuth()

	if (auth.searchResultList === '검색 결과가 없습니다.') {
		return
	}

	return (
		<ResultList>
			{auth.searchResultList.length ? (
				<>
					<h1>검색해서 나온 리스트</h1>
					{auth.searchResultList.map((result, index) => (
						<p key={index}>{result}</p>
					))}
				</>
			) : (
				<></>
			)}
		</ResultList>
	)
}
export default SearchResultList

const ResultList = styled.div`
	background-color: #bfffb9;
	border: 0.2rem solid gray;
	border-radius: 0.5rem;
	padding: 1rem;
	margin-top: 1rem;
`
