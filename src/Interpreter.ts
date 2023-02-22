import { ProgramNode } from "./parser/Node";

export default class Interpreter {
    public constructor(public readonly ast: ProgramNode) { }

    public interpret() { }
}