import { css } from 'styled-components'

export const FlexCenterCSS = css`
	display: flex;
	justify-content: center;
	align-items: center;
`

export const FlexBetWeenCSS = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const FlexAlignCSS = css`
	display: flex;
	align-items: center;
`

export const FlexColumnCSS = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
`

export const GridCenter = css`
	display: grid;
	justify-items: center;
`

export const GridColumnFive = css`
	grid-template-columns: repeat(5, 1fr);
	column-gap: 3rem;
`

export const GridColumnThree = css`
	grid-template-columns: repeat(3, 1fr);
	column-gap: 3rem;
`

export const GridColumnTwo = css`
	grid-template-columns: repeat(2, 1fr);
	column-gap: 3rem;
`

export const GridColumnOne = css`
	grid-template-columns: repeat(1, 1fr);
	column-gap: 3rem;
`

export const MarginAuto = css`
	width: 95%;
	max-width: 120rem;
	margin: 0 auto;
`

export const ShadowCSS = css`
	box-shadow: 2px 2px 2px rgb(220, 220, 220);
`

export const HoverCSS = css`
	:hover {
		cursor: pointer;
	}
`
