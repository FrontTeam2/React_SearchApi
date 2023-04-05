import { useEffect, useState } from 'react'

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
