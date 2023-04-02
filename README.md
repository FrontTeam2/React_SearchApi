# 🔍 프로젝트 : 검색어 조회

프로젝트 설명 : 
검색어를 조회하기 위한 데이터를 서버에서 호출하고, 사용자 행동을 중심으로 최근 검색어를 저장하는 프로젝트 입니다. 

## 프로젝트 구현
[New Recording - 2023. 4. 2. 오후 11_27_58 (1).webm](https://user-images.githubusercontent.com/77373566/229359276-0d7e2568-ee12-45a1-9f09-424e854ca1b0.webm)

### 프로젝트 수행 과정

1) API 로직 이해
2) 서버 데이터 호출
3) 최근 검색어 저장
    - 저장 검색어 5개로 제한
4) 중복 검색어 상위 랭킹
5) hover(마우스), focus(키보드) 하이라이트
6) API 콜 최적화 : 디바운싱
7) 관심사 분리

### 수행이슈

1) API 로직 이해 : assemble, disassemble, startsWith ... 처음 보는 메서드에 당황 -> 구글링해서 로직 이해 !

![API 로직이해](https://user-images.githubusercontent.com/77373566/229358275-e0966910-ae6b-4921-9ffb-35e3f9e2cd23.png)

5) hover(마우스), focus(키보드) 하이라이트 : 키보드를 통한 focus 하이라이트에서 역경 -> event key값에 따라 로직이 변경되고, 특히, Enter를 누르기 전의 여러 상황을 고려
    - 아직 해결이 안된 문제 : ArrowDown 이후, Enter일 경우에 최근 검색어에 focus text가 저장이 안되는 중

![e key Enter 이해](https://user-images.githubusercontent.com/77373566/229358861-23965751-dce4-4469-aa34-d78925dfafe4.png)

7) 관심사 분리 : 수행을 하지 못해 아쉬운 것 -> 이번 프로젝트를 통해 소규모 프로젝트이어도 관심사 분리를 통해 코드 가독성을 높혀야 하는 것을 깨달음...
