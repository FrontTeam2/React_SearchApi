import S from '../Styles/styles'
import { AiOutlineEnter } from 'react-icons/ai'
import { BsArrowDownUp } from 'react-icons/bs'

function Bottom() {
	return (
		<S.BottomBox>
			<div>
				<ul>
					<li>
						<span>
							<BsArrowDownUp />
						</span>
						<span>선택</span>
					</li>
					<li>
						<span>
							<AiOutlineEnter />
						</span>
						<span>검색</span>
					</li>
				</ul>
			</div>
		</S.BottomBox>
	)
}

export default Bottom
