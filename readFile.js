import fs from "fs"

export default function readFile() {
	const filePath = './Fig2_5.txt'
	console.log(`Reading ${filePath}...`)
	const file = fs.readFileSync(filePath, "utf8")

	const parsedFile = file.split('\n')
		.map(e => e.replace('\r', ''))
		.map(e => e.split('\t'))
		.map(e => (
			(e[0] == ''
				? (() => {
					const prevE = e
					prevE.shift()
					return prevE
				})()
				: e
			)
		))
		.map(e => { return { sourceCode: e } })
	console.log(`Read ${filePath} successfully!`)
	return parsedFile
}
