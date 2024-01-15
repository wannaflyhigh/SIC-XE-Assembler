import pass1 from "./pass1.js";
import pass2 from "./pass2.js";
import readFile from "./readFile.js";

const sourcePrograms = readFile()
console.log('')
// byte and format 2 finish in pass 1
const [notCompeletedObjectCodes, symbolTable, BASELABEL, programName] = pass1(sourcePrograms)
console.log('')
const { objectProgram, objectCodes } = pass2(notCompeletedObjectCodes, symbolTable, BASELABEL, programName)
console.log('')

console.log("symbolTable:")
console.log(symbolTable)
console.log()
console.log("Details:")
console.log(objectCodes)
console.log()
console.log("Result:")
console.log(objectProgram)
