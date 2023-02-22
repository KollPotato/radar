import { ProgramNode } from "../parser/Node"
import InputStream from "../parser/InputStream"
import TokenStream from "../parser/TokenStream"
import Parser from "../parser/Parser"
import Compiler from "./Compiler"
import File from "../File"
import Analyzer from "./Analyzer"

export default class Radar {
    public constructor(public readonly code: string) {
        this.inputStream = new InputStream(this.code)
        this.tokenStream = new TokenStream(this.inputStream)
        this.ast = new Parser(this.tokenStream).parse()
    }

    public readonly inputStream: InputStream
    public readonly tokenStream: TokenStream
    public readonly ast: ProgramNode

    public analyze() {
        const analyzer = new Analyzer(this.ast)
        analyzer.analyze()
    }

    public compile({ outFile }: CompileOptions) {
        const file = new File(outFile)
        if (!file.exists) throw new FileNotFoundError(outFile)
        else if (!file.writable) throw new FileAccessError(`Can not write to file ${outFile}`)

        this.analyze()
    
        const compiler = new Compiler(this.ast)
        compiler.compile()
    }
}

export class FileNotFoundError extends Error {
    public constructor(path: string) {
        super(`File ${path} does not exist`)
    }
}

export class FileAccessError extends Error {
    public constructor(message: string) {
        super(message)
    }
}

export interface CompileOptions {
    outFile: string
}