import { ProgramNode, ReturnStatement } from "../parser/Node";

export default class Analyzer {
    public constructor(public readonly ast: ProgramNode) { }

    private error(message: string): never {
        console.log(message)
        process.exit(0)
    }

    public analyze(): void {
        if (this.ast.body.find(node => node instanceof ReturnStatement)) {
            this.error("Illegal return statement")
        }

    }
}