import { ThemeProvider } from 'styled-components'
import theme from './Styles/theme'
import GlobalStyles from './Styles/global'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/routing'

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			<RouterProvider router={router} />
		</ThemeProvider>
	)
}

export default App
