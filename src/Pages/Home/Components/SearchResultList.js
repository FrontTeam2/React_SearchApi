import styled from 'styled-components'

function SearchResultList({ searchResultList }) {

	if (searchResultList == '검색 결과가 없습니다.' || !searchResultList.length) {
		return
	}

	return (
		<ResultList>
			{searchResultList.length ? (
				<>
					<h1>검색해서 나온 리스트</h1>
					{searchResultList.map((result, index) => (
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
	border-radius: 1rem;
	padding: 1rem;
`