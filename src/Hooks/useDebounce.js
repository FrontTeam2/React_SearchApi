import { useEffect, useState } from 'react'

function useDebounceValue(value, delay = 300) {
	const [debounceValue, setDebounceValue] = useState()

	useEffect(() => {
		const control = setTimeout(() => {
			setDebounceValue(value)
		}, delay)

		return () => {
			clearTimeout(control)
		}
	}, [value, delay])

	return debounceValue
}

export default useDebounceValue
