# 프로젝트 설명

본 프로젝트는 API 콜 최적화를 이용한 검색어 입력 사이트입니다.

# 구현 화면

- 검색어 입력전
  ![시작화면](https://user-images.githubusercontent.com/119868766/229359380-796ca3c6-fd46-47ac-88b4-e8c4bf035431.gif)

- 검색어를 입력하면 연관 검색어 표시 및 엔터키 입력 시 최근 검색어 추가

![녹화_2023_04_02_23_36_46_989_AdobeExpress](https://user-images.githubusercontent.com/119868766/229359906-df5f36e3-9e20-477b-a3b6-fd2dedbc9b76.gif)

- 연관 검색어 방향키 컨트롤

![녹화_2023_04_02_23_36_46_989_AdobeExpress (1)](https://user-images.githubusercontent.com/119868766/229360300-04190a63-538d-42c4-a65e-0c538a81559a.gif)

- 최근 검색어 5개 제한
- ![녹화_2023_04_02_23_36_46_989_AdobeExpress (2)](https://user-images.githubusercontent.com/119868766/229360545-d12f023d-ac82-4afb-8db4-ca2304f49f6f.gif)

# 주요 기능 설명

- API 콜 최적화

  사용자가 압력 할 때마다 서버로 부터 데이터 요청을 하기 때문에 비효율적 일수도 있으므로, 디바운싱 작업을 통해 최적화.

- 최근 검색어 5개 제한

  사용자가 입력 완료한 검색어를 로컬 스토리지에 저장하고 검색어를 5개로 제한 함.
  입력 완료한 검색어가 5개가 넘을 시, 최근 검색어 목록 중 가장 먼저 검색 된 것을 삭제.

- 키보드 방향키로 이용한 검색

  사용자가 검색어를 입력하면 연관 검색어 리스트가 나타남. 키보드 상하 방향키 및 Enter키로 검색 컨트롤 가능.

- 검색 단어 하이라이트

  입력한 검색어가 포함된 단어에 하이라이트 작업.

# API 콜 최적화 방법 - Debouncing

API 콜 최적화 방법엔 쓰로틀링 캐싱 디바운싱 등 여러가지가 있지만 이중에 디바운싱을 채택.

useDebounce.js

```
function useDebounce(searchInput) {
	const [debounceValue, setDebounceValue] = useState('')

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounceValue(searchInput)
		}, 300)

		return () => {
			clearTimeout(timer)
		}
	}, [searchInput])

	return debounceValue
}

export default useDebounce


```

App.js

```
useEffect(() => {
		getSearchList()
	}, [debounceSearch])
```
