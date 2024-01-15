import opTables from "./opCode.js"

export default function pass2(notCompeletedObjectCodes, symbolTable, BASELABEL, programName) {
	console.log("Doing pass2...")
	for (let i = 0; i < notCompeletedObjectCodes.length; i++) {
		const withLabel = notCompeletedObjectCodes[i].sourceCode.length === 3
		const opCode = notCompeletedObjectCodes[i].sourceCode[0 + withLabel]
		const param = notCompeletedObjectCodes[i].sourceCode[1 + withLabel]
		const isFormat4 = opCode[0] == '+'
		const { machineCode, format, type, fn } = opTables.get(
			(isFormat4 ? opCode.slice(1) : opCode)
		)

		if (type == 'OPCODE' && format == '3/4') {
			const flags = { n: "0", i: "0", x: "0", b: "0", p: "0", e: "0" }
			if (!param) {
				notCompeletedObjectCodes[i].objectCode = format34ObjectCode(machineCode, { ...flags, n: '1', i: "1" }, "0", false)
				continue
			}
			flags.n = '1'
			flags.i = '1'
			let newParam = param
			if (param.slice(-2) == ',X') {
				flags.x = '1'
				newParam = param.slice(0, -2)
			}
			if (param[0] == '@') {
				flags.n = "1"
				flags.i = "0"
				newParam = param.slice(1)
			}
			if (param[0] == '#') {
				flags.n = "0"
				flags.i = "1"
				newParam = param.slice(1)
			}
			flags.p = '1'
			const pc = parseInt(notCompeletedObjectCodes[i + 1].loc, 16)
			let numberDisp = parseInt(symbolTable.get(newParam), 16) - pc
			if (numberDisp < 0) numberDisp = 4096 + numberDisp
			if (numberDisp < 0) {
				flags.b = '1'
				flags.p = '0'
				const BASE = parseInt(symbolTable.get(BASELABEL), 16)
				numberDisp = parseInt(symbolTable.get(newParam), 16) - BASE
				if (numberDisp < 0) numberDisp = 4096 + numberDisp
				// notCompeletedObjectCodes[i].BASE = BASE
			}
			const disp = numberDisp.toString(16)
			let dispOrAddr = disp
			// notCompeletedObjectCodes[i].newParam = newParam
			// notCompeletedObjectCodes[i].pc = pc
			// notCompeletedObjectCodes[i].numberDisp = numberDisp
			if (isFormat4) {
				flags.e = '1'
				flags.p = '0'
				dispOrAddr = symbolTable.get(newParam)
				notCompeletedObjectCodes[i].needMRecord = true
			}
			if (param[0] == '#') {
				if (Number(newParam) != NaN) {
					dispOrAddr = Number(newParam).toString(16)
					flags.p = '0'
					notCompeletedObjectCodes[i].needMRecord = false
				}
			}
			// notCompeletedObjectCodes[i].machineCode = machineCode
			// notCompeletedObjectCodes[i].flags = flags
			// notCompeletedObjectCodes[i].dispOrAddr = dispOrAddr
			notCompeletedObjectCodes[i].objectCode = format34ObjectCode(machineCode, flags, dispOrAddr, isFormat4)

		}
	}
	console.log("Finish All object codes!\n")
	console.log("Changing object codes to object program...")
	let objectProgram = ''
	const programLength = (parseInt(notCompeletedObjectCodes[notCompeletedObjectCodes.length - 1].loc, 16) - parseInt(notCompeletedObjectCodes[0].loc, 16)).toString(16)
	objectProgram += `H${programName}${notCompeletedObjectCodes[0].loc.padStart(6, '0')}^${programLength.padStart(6, '0')}\n`

	let curInstrucionCount = 0, curObjectCodes = '', curStartAddr, curObjectLen = 0, lastContainsObjectCode = false
	notCompeletedObjectCodes.forEach(e => {
		if (e.objectCode) {
			if (!curStartAddr) curStartAddr = e.loc.padStart(6, '0')
			curObjectCodes += e.objectCode
			curObjectCodes += '^'
			curInstrucionCount++
			curObjectLen += e.objectCode.length / 2
			lastContainsObjectCode = true
		} else
			lastContainsObjectCode = false

		if (curInstrucionCount >= 10 || !lastContainsObjectCode) {
			if (curStartAddr == null) return
			objectProgram += `T${curStartAddr}^${curObjectLen.toString(16).padStart(2, '0')}^${curObjectCodes}\n`
			curStartAddr = null
			curObjectCodes = ''
			curInstrucionCount = 0
			curObjectLen = 0
		}
	})
	let firstExecutableLoc = ''
	notCompeletedObjectCodes.forEach(e => {
		if (e.needMRecord) objectProgram += `M${(parseInt(e.loc, 16) + 1).toString(16).padStart(6, '0')}^05\n`
		if (e.isExecutable && firstExecutableLoc == '') firstExecutableLoc = e.loc.padStart(6, "0")
	})
	objectProgram += `E${firstExecutableLoc}\n`
	console.log("Finish pass2!")
	return { objectProgram, objectCodes: notCompeletedObjectCodes }
}

function format34ObjectCode(machineCode, flags, dispOrAddr, isFormat4) {
	const p1 = parseInt(machineCode, 16).toString(2).slice(0, -2)
	const p2 = flags.n + flags.i + flags.x + flags.b + flags.p + flags.e
	const p3 = parseInt(dispOrAddr, 16).toString(2).padStart((isFormat4 ? 20 : 12), '0')
	return parseInt(p1 + p2 + p3, 2).toString(16).padStart((isFormat4 ? 8 : 6), '0')
}
