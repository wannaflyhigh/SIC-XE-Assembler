const opTable = [
	['STL', { machineCode: '14', format: "3/4", type: 'OPCODE' }],
	['LDB', { machineCode: '68', format: "3/4", type: 'OPCODE' }],
	['JSUB', { machineCode: '48', format: "3/4", type: 'OPCODE' }],
	['LDA', { machineCode: '00', format: "3/4", type: 'OPCODE' }],
	['COMP', { machineCode: '28', format: "3/4", type: 'OPCODE' }],
	['JEQ', { machineCode: '30', format: "3/4", type: 'OPCODE' }],
	['J', { machineCode: '3C', format: "3/4", type: 'OPCODE' }],
	['STA', { machineCode: '0C', format: "3/4", type: 'OPCODE' }],
	['CLEAR', { machineCode: 'B4', format: "2", type: 'OPCODE' }],
	['LDT', { machineCode: '74', format: "3/4", type: 'OPCODE' }],
	['TD', { machineCode: 'E0', format: "3/4", type: 'OPCODE' }],
	['COMPR', { machineCode: 'A0', format: "2", type: 'OPCODE' }],
	['STCH', { machineCode: '54', format: "3/4", type: 'OPCODE' }],
	['TIXR', { machineCode: 'B8', format: "2", type: 'OPCODE' }],
	['JLT', { machineCode: '38', format: "3/4", type: 'OPCODE' }],
	['STX', { machineCode: '10', format: "3/4", type: 'OPCODE' }],
	['RSUB', { machineCode: '4C', format: "3/4", type: 'OPCODE' }],
	['LDCH', { machineCode: '50', format: "3/4", type: 'OPCODE' }],
	['WD', { machineCode: 'DC', format: "3/4", type: 'OPCODE' }],
	['RD', { machineCode: 'D8', format: "3/4", type: 'OPCODE' }],

	['END', { type: 'IGNOREME' }],
	['BASE', { type: 'IGNOREME' }],
	['START', { type: 'IGNOREME' }],

	['RESW', { type: 'VARIABLE' }],
	['RESB', { type: 'VARIABLE' }],
	['BYTE', {
		type: 'VARIABLE', fn: param => {
			function extract(string) {
				return string.slice(2, string.length - 1)
			}
			function stringToAscii(string) {
				let asciis = ''
				for (let i = 0; i < string.length; i++)
					asciis += Number(string[i].charCodeAt()).toString(16)
				return asciis
			}
			if (param[0] == 'X') {
				const data = extract(param)
				return { data, byteCount: 1 }
			}
			if (param[0] == 'C') {
				const data = stringToAscii(extract(param))

				return { data, byteCount: data.length / 2 }
			}
		}
	}],

]

const opTables = new Map(opTable)
export default opTables

const registers = [
	['A', 0],
	['X', 1],
	['L', 2],
	['S', 4],
	['T', 5],
	['F', 6],
]

const registerMapToID = new Map(registers)
export { registerMapToID }
