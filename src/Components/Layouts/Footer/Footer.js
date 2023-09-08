import styled from 'styled-components'

function Footer() {
	return <S.FooterSection>Created By LeeJuhong</S.FooterSection>
}

export default Footer

const FooterSection = styled.footer`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 24rem;
	background: var(--color--ultralight-gray);
`

const S = {
	FooterSection,
}
