import { useEffect, useState } from 'react'

function useDeBounce(value, delay = 500) {
	//(1) 매개변수 value는 props로 input값을 받아온거임, delay는 0.5초
	const [debounceVal, setDebounceVal] = useState(value) //(2) 이 스테이트는 기본값이 value야 즉 input값을 기본값으로 가지고있음

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebounceVal(value) //(4) 이건 즉 input값을 debounceVal에 넣으려고 setDebounceVal사용, 시간은 설정한 0.5초이다.
		}, delay)
		return () => {
			clearTimeout(handler) // (5)
			// 이건 언마운트일때 handler를 초기화 시키라는건데
			// 내 생각은 6개의 문자를 하나당 0.5초 이하로 계속 눌렀다면 이게 0.5*6 즉 3초로 하지않았을까?
			// 그래서 저걸 다시 초기화? 느낌으로 한거같기도한다.
		}
	}, [value, delay]) // (3)
	// useEffect에서 의존성 배열에 value,delay가 들어있음 즉 저 말은 input에 value가 들어오면 0.5초 후에
	// 입력이 없으면 이제 저 handler가 시작함.

	return debounceVal // (6) 함수를 어디선가 import해서 실행하면 return 값으로 지금까지 계산한 debounceVal를 반환해줄려고
}
export default useDeBounce
