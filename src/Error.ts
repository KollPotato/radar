import InputStream from "./parser/InputStream"

export interface ErrorOptions {
    input: InputStream
    type: ErrorType
    message: string
}

export type ErrorType = "SyntaxError"

export function error(options: ErrorOptions): never {
    const { type, message, input,  } = options

    const line = input.input.split("\n")[input.position.line - 1]

    console.log(line)
    console.log("^".repeat(line.length))
    console.log(`${type}: ${message} at line ${input.position.line} column ${input.position.column}`)
    
    process.exit()
}