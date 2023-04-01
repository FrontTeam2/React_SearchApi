# 🚀 프로젝트 설명
* 본 프로젝트는 **API 콜 최적화**를 적용한 **검색어 조회 웹 사이트** 입니다.

<br>

# 💻 실제 구현 화면
* 메인 화면
<img src="https://user-images.githubusercontent.com/112946860/229263441-2c9e789d-bcfd-4fe1-a061-e37766ee6da2.png" />

* 검색 시 화면
<img src="https://user-images.githubusercontent.com/112946860/229263490-8d9cade7-8153-4275-85da-775f3d2f76b3.png" />

<br>

# ⚒️ 주요 기능 구현
* **API 콜 최적화**
  * 검색 서비스는 사용자가 입력할 때마다 API 콜을 요청하기 때문에 비효율적일 수 있어, 이를 최적화
  * 단, axios만 사용 가능(axios의 cache 옵션 X, react-query와 같은 캐싱 라이브러리 사용 X)
  
* **최근 검색어 기능**
  * 최근 검색어 최대 5개
  * 5개 안에 중복된 검색어 있을 경우, 새로 추가 X ➡️ 기존에 있던 검색어가 가장 첫 번째로 이동
  * 5개가 넘었을 때 새로운 검색어가 추가되면, 가장 마지막 검색어 삭제
  * 해당 데이터는 웹 페이지 종료 후에도 유지되도록
  
* **키보드 만으로 추천 검색어 및 일반 검색 기능**
  * 키보드 만으로 상하 이동, ENTER로 검색
  * 마우스 클릭으로도 검색어로 검색 가능
  * 검색 시 별다른 페이지 이동 없이 최근 검색어가 추가되는 형태
  
* **검색 단어 하이라이트**
  * 검색어가 포함된 부분을 하이라이트
  
<br>
  
# ✨ API 콜 최적화 방법 - Debouncing
* API 콜 최적화 방법으로는 쓰로틀링, 디바운싱, API 캐시, axios에서 관련 설정, 캐싱 라이브러리 사용 등 여러 방법이 존재합니다.
  * **쓰로틀링** : 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
  * **디바운싱** : 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 것

  👉 저는 이 중 **디바운싱** 방법을 채택하여 본 프로젝트에 적용했습니다. 해당 방법은 택한 이유는 다음과 같습니다.
    * 설정한 특정 시간 주기로 계 실행되는 쓰로틀링 방식보다는 <br>이벤트가 연속적으로 발생하더라도 설정한 특정 시간 동안은 이벤트가 발생하지 않고, 맨 마지막 이벤트에서 발생시키는 디바운싱 방식을 검색 기능에 적용하는 것이 맞다고 판단했습니다.
    
* 적용한 방식 설명
  ```
  // 디바운싱된 검색하기 기능 함수
	const debouncedSearch = value => {
		setDelaySearchState(value)
	}

	// 디바운싱텀(0.3sec)마다 api 요청을 보내도록
	useEffect(() => {
		const handler = setTimeout(() => {
			getSearchList(delaySearchState)
		}, 300)

		console.log(delaySearchState)

		return () => {
			clearTimeout(handler)
		}
	}, [delaySearchState])

	// 검색어 변경 핸들러
	const handleSearchTermChange = e => {
		const key = e.target.value
		setSearchText(key)
		debouncedSearch(key)
	}
  
  // ...
  <input onChange={ handleSearchTermChange } />
  ```
  
**1**. input을 통해 onChange={ handleSearchTemChange }가 실행된다. <br>
    ➡️ input창에 보이는 searchText가 실시간으로 변경 <br>
    ➡️ debouncedSearch(입력한 값)을 실시간으로 호출 <br>
    <br>
**2**. debouncedSearch(입력한 값)으로 delatedSearchState가 변경되고 <br>
    ➡️ 변경되면 API 요청을 보낸다.<br>
    <br>
**3**. delayedSearchState가가 변경되었으니 해당 state를 걸어둔 useEffect가 실행된다.<br>
    ➡️ 그런데 그 요청은 0.3초 이후에 보내도록<br>
    ➡️ ※ 그런데 이 delayedSearchState가 계속 계속 바뀌게 되면 timer가 생기고 api 요청이 이루어지기도 전에 지워지고를 바로 하다보니<br>
        ==> 결론적으로는 입력이 멈춘 후 0.3초 동안 기다린 후에 API 요청을 보낸다<br>
    
    ==> 결론적으로 onChange 이벤트가 발생할 떄마다
        매번 API 요청을 보내지 않고, 일정 term을 두고 요청을 보낸다.
        너무 많은 이벤트를 호출하지 않아 과도한 API 콜을 하지 않아 성능 개선에도 도움이 된다.
     
    ==> 특히, 사용감에도 큰 불편이 없었다.
    
![search_1](https://user-images.githubusercontent.com/112946860/229265996-6eafbdc2-96f5-4fdd-9028-b439746c58d6.gif)

* 특정 구간에 검색어를 입력할 경우 API 요청을 보내지 않고, 마지막 이벤트에서만 API 요청을 보내고 있습니다.
* 이벤트가 발생할 때마다 요청을 보내는 것이 아닌, 특정 구간에서만 API 요청을 보냅니다.   

    
# 🔐 CORS 에러 정의
#### CORS(Cross Origin Resource Sharing)
    CORS는 다른 도메인을 가진 리소스에 엑세스할 수 있게 하는 보안 메커니즘
  👉 아무나 우리 서버에 요청을 보낼 수 있다면, 누군가 악의적으로 서버에 접근이 가능해진다는 것입니다.<br>
      이를 방지하기 위해 기본적으로 브라우저에서는 현재 있는 도메인/포트와 다른 곳으로 요청을 보내는 것을 원천적으로 막아놓습니다.
  <br>    
#### CORS 에러 해결방법
**🪄 1. 클라이언트에서 해결**<br />
  * Proxy 패턴 이용<br />
      클라이언트 웹페이지에서 직접 요청을 보내는 것이 아니라, 클라이언트 페이지 -> 클라이언트 서버 -> 백엔드 서버<br>
      👉 중간 다리를 하나 놓는다!<br>
      👉 서버에서 서버끼리 통신할 때는 CORS 정책이 적용X을 이용<br>
      
**🪄 2. 서버(NodeJS)에서 해결**<br />
  * 응답 헤더에 Access-Control-Allow-Origin 헤더를 삽입
  * cors 미들웨어 사용
  * 쿠키 요청 허용
    
  
