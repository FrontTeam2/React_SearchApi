import { useAuth } from 'Contexts/auth'
import styled from 'styled-components'

function SearchList({
	searchInput,
	setSearchInput,
	searchList,
	setSearchList,
	chooseInput,
	recentSearchArray,
	showSearchList,
	setSearchResultList,
	setShowSearchList,
}) {
	const auth = useAuth()

	// 클릭으로 데이터 가져오기
	function onClickSearch(value) {
		console.log('클릭됨!')
		getData(value)
			.then(data => {
				setSearchResultList(data)
				setSearchList([])
			})
			.catch(error => {
				console.log(error)
			})
		auth.search(value)
		setSearchInput(value)
		setShowSearchList(false)
	}

	if (searchList === '검색 결과가 없습니다.') {
		return <p>{searchList}</p>
	}

	return (
		<ResultWrapper>
			{searchInput == '' ? (
				<>
					<div>
						<span>최근 검색어</span>
					</div>
					{recentSearchArray ? (
						<>
							{recentSearchArray.map((item, index) => (
								<ResultBox key={item} onClick={() => onClickSearch(item)}>
									{index === chooseInput ? (
										<h3 style={{ backgroundColor: 'pink' }}>{item}</h3>
									) : (
										<p>{item}</p>
									)}
								</ResultBox>
							))}
						</>
					) : (
						<>
							<p>최근 검색어가 없습니다.</p>
						</>
					)}
				</>
			) : (
				<>
					{showSearchList && (
						<>
							{searchList.map((item, index) => (
								<ResultBox key={index} onClick={() => onClickSearch(item)}>
									{index === chooseInput ? (
										<h4 style={{ backgroundColor: 'pink' }}>
											{item.includes(searchInput) ? (
												<>
													{item.split(searchInput)[0]}
													<span style={{ color: '#ff0000' }}>
														{searchInput}
													</span>
													{item.split(searchInput)[1]}
												</>
											) : (
												item
											)}
										</h4>
									) : (
										<p>
											{item.includes(searchInput) ? (
												<>
													{item.split(searchInput)[0]}
													<span style={{ color: '#ff0000' }}>
														{searchInput}
													</span>
													{item.split(searchInput)[1]}
												</>
											) : (
												item
											)}
										</p>
									)}
								</ResultBox>
							))}
						</>
					)}
				</>
			)}
		</ResultWrapper>
	)
}
export default SearchList

const ResultWrapper = styled.div`
	padding: 5px 10px;
`

const ResultBox = styled.div`
	:hover {
		cursor: pointer;
		background-color: pink;
		font-size: large;
	}
`
