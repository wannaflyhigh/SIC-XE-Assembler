import opTables, { registerMapToID } from "./opCode.js";

export default function pass1(sourcePrograms) {
	let BASELABEL
	console.log("Doing pass 1...")

	let programName = sourcePrograms[0].sourceCode[0]
	let decLocCounter = Number(`0x${sourcePrograms[0].sourceCode[2]}`)
	console.log(`decLocCounter starts from ${decLocCounter} (hex: 0x${sourcePrograms[0].sourceCode[2]})`)

	const symbolTable = new Map()

	for (let i = 0; i < sourcePrograms.length; i++) {
		const withLabel = sourcePrograms[i].sourceCode.length === 3
		const opCode = sourcePrograms[i].sourceCode[0 + withLabel]
		const isFormat4 = opCode[0] == '+'

		if (withLabel) {
			symbolTable.set(sourcePrograms[i].sourceCode[0], decLocCounter.toString(16).padStart(4, '0'))
		}

		sourcePrograms[i].loc = decLocCounter.toString(16)
		const { machineCode, format, type, fn } = opTables.get(
			(isFormat4 ? opCode.slice(1) : opCode)
		)
		if (opCode == 'BASE') BASELABEL = sourcePrograms[i].sourceCode[1 + withLabel]
		if (type == "IGNOREME")
			continue

		if (type == "OPCODE") {
			decLocCounter += (isFormat4 ?
				4
				: format == '2' ? 2 : 3
			)
			sourcePrograms[i].machineCode = machineCode
			sourcePrograms[i].format = format
			sourcePrograms[i].isExecutable = true

			if (format == "2") {
				const [p1, p2] = sourcePrograms[i].sourceCode[1 + withLabel].split(',')
				sourcePrograms[i].objectCode = machineCode + registerMapToID.get(p1).toString(16) + (p2 ? registerMapToID.get(p2).toString(16) : '0')
			}
		}

		if (type == "VARIABLE") {
			if (opCode == 'RESW' || opCode == 'RESB') {
				const count = Number(sourcePrograms[i].sourceCode[2])
				decLocCounter += (count * (opCode == 'RESB' ? 1 : 3))
			}
			if (opCode == 'BYTE') {
				const { data, byteCount } = fn(sourcePrograms[i].sourceCode[2])
				decLocCounter += byteCount
				sourcePrograms[i].objectCode = data
			}
		}

	}
	// sourceProgram[0][3] = '0'
	console.log("Finish pass1!")

	return [sourcePrograms, symbolTable, BASELABEL, programName]
}
