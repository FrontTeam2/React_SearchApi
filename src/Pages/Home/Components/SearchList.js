import { useAuth } from 'Contexts/auth'
import styled from 'styled-components'

function SearchList() {
	const auth = useAuth()

	if (auth.searchList === '검색 결과가 없습니다.') {
		return <p>{auth.searchList}</p>
	}

	if (!auth.showSearchList) {
		return
	}

	return (
		<ResultWrapper>
			{auth.searchInput == '' ? (
				<>
					<div>
						<h4>최근 검색어</h4>
					</div>
					<SplitLine />
					{auth.get() ? (
						<>
							{auth.get().map((item, index) => (
								<ResultBox
									key={item}
									onMouseDown={event => {
										event.stopPropagation()
										auth.onSubmitSearch(item)
									}}
								>
									{index === auth.chooseInput ? (
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
					{auth.showSearchList && (
						<>
							{auth.searchList.map((item, index) => (
								<ResultBox
									key={index}
									onMouseDown={event => {
										event.stopPropagation()
										auth.onSubmitSearch(item)
									}}
								>
									{index === auth.chooseInput ? (
										<h4 style={{ backgroundColor: 'pink' }}>
											{item.includes(auth.searchInput) ? (
												<>
													{item.split(auth.searchInput)[0]}
													<span style={{ color: '#ff0000' }}>
														{auth.searchInput}
													</span>
													{item.split(auth.searchInput)[1]}
												</>
											) : (
												item
											)}
										</h4>
									) : (
										<p>
											{item.includes(auth.searchInput) ? (
												<>
													{item.split(auth.searchInput)[0]}
													<span style={{ color: '#ff0000' }}>
														{auth.searchInput}
													</span>
													{item.split(auth.searchInput)[1]}
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
	margin-top: 1rem;
	border: 0.2rem solid gray;
	border-radius: 0.5rem;
`

const ResultBox = styled.div`
	:hover {
		cursor: pointer;
		background-color: pink;
		font-size: 13px;
		font-weight: bold;
	}
`
const SplitLine = styled.hr`
	margin: 0.5rem 0;
`
