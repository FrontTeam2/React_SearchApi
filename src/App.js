import { ThemeProvider } from 'styled-components'
import GlobalStyles from './Styles/global'
import theme from './Styles/theme'
import Search from './Component/Search/Search'
function App() {
	return (
		<>
			<ThemeProvider theme={theme}>
				<GlobalStyles />
				<Search />
			</ThemeProvider>
		</>
	)
}

export default App
