# 🚀 프로젝트 설명
* 본 프로젝트는 **API 콜 최적화**를 적용한 **검색어 조회 웹 사이트** 입니다.

<br>

# 💻 실제 구현 화면
* 메인 화면
<img src="https://user-images.githubusercontent.com/61799492/229288180-4a126af8-c054-4526-b70c-58f57e1f9381.png" />

<hr>

* 검색 시 화면
<img src="https://user-images.githubusercontent.com/61799492/229288369-7bcdd27e-64a7-42bd-94c6-070af9576164.png" />

<hr>

* 검색 후 화면
<img src="https://user-images.githubusercontent.com/61799492/229288424-02ed0321-2565-4330-b810-71d4f9855044.png" />

<br>

# ⚒️ 주요 기능 구현
* **API 콜 최적화**
  * 검색 서비스는 사용자가 입력할 때마다 API 콜을 요청하기 때문에 비효율적일 수 있어, 이를 최적화
  * 단, axios만 사용 가능(axios의 cache 옵션 X, react-query와 같은 캐싱 라이브러리 사용 X)
  * react, react-router-dom, styled-componet와 같은 기본적인 라이브러리만 사용 가능
  
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
  * 검색 결과가 없을 시 "검색결과가 없습니다"라는 백엔드에서 전송한 메시지 출력

<br>

# ✨ API 콜 최적화 방법 - Debouncing

* 추후 내용 추가

# 🔐 CORS 에러 정의
#### CORS(Cross Origin Resource Sharing)

* 추후 내용 추가
