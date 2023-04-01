const jsonServer = require('json-server')
const data = require('./db.json')
const Hangul = require('hangul-js')
const cors = require('cors')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(cors())

// Custom API endpoint
server.get('/search', (req, res) => {
	const { key } = req.query
	if (!key) {
		return res.status(400).send('검색어를 입력해주세요.')
	}
	const initialsResult = data.products.filter(product => {
		const words = product.split(' ')
		const initials = words.map(word =>
			Hangul.disassemble(word)
				.map(char => Hangul.assemble(char.charAt(0)))
				.join(''),
		)

		const searchInitial = Hangul.disassemble(key)
			.map(char => Hangul.assemble(char.charAt(0)))
			.join('')

		return initials.some(initial => initial.startsWith(searchInitial))
	})

	const wordsResult = data.products.filter(product => {
		return product.includes(key)
	})

	const result = [...new Set([...initialsResult, ...wordsResult])]

	if (result.length === 0) {
		return res.status(404).send('검색 결과가 없습니다.')
	}

	return res.json(result)
})

server.use(router)

server.listen(8080, () => {
	console.log('JSON Server is running')
})
