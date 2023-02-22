import { BinaryOperator, LogicalOperator } from "./Primitives"
import * as util from "util"

export class ProgramNode {
    public constructor(public readonly body: SyntaxNode[]) { }

    public view(): void {
        const tree = util.inspect(
            this,
            {
                depth: null,
                colors: true,
                breakLength: Infinity
            }
        )

        console.log(tree)
    }

    public get variables(): VariableDeclaration[] {
        return this.body.filter(value => value instanceof VariableDeclaration) as VariableDeclaration[]
    }

    public get functions(): FunctionDeclaration[] {
        return this.body.filter(value => value instanceof FunctionDeclaration) as FunctionDeclaration[]
    }

    public getVariable(name: string): VariableDeclaration | null {
        const variable = this.body.find(value => {
            return value instanceof VariableDeclaration && value.id.name === name
        })

        return (variable as VariableDeclaration) || null
    }

    public getFunction(name: string): FunctionDeclaration | null {
        const func = this.body.find(value => {
            return value instanceof FunctionDeclaration && value.id.name === name
        })

        return (func as FunctionDeclaration) || null
    }

    public hasFunction(name: string): boolean {
        return this.getFunction(name) !== null
    }
}

export class BinaryExpression {
    public constructor(
        public readonly left: ExpressionNode,
        public readonly right: ExpressionNode,
        public readonly operator: BinaryOperator
    ) { }
}

export class Literal<T = string | number | boolean> {
    public constructor(public readonly value: T) { }
}

export class ReturnStatement {
    public constructor(public readonly value: SyntaxNode) { }
}

export class Identifier<T = string> {
    public constructor(public readonly name: T) { }
}

export class CallExpression {
    public constructor(
        public readonly callee: Identifier,
        public readonly args: SyntaxNode[]
    ) { }
}

export class LogicalExpression {
    public constructor(
        public readonly left: ExpressionNode,
        public readonly right: ExpressionNode,
        public readonly operator: LogicalOperator
    ) { }
}

export class FunctionDeclaration {
    public constructor(
        public readonly id: Identifier,
        public readonly params: FunctionParameter[],
        public readonly body: BlockStatement,
        public readonly returnType?: TypeDeclaration
    ) { }
}

export class TypeDeclaration {
    public constructor(
        public readonly type: Identifier | UnionType
    ) { }
}

export class EnumDeclaration {
    public constructor(
        public readonly id: Identifier,
        public readonly body: EnumMember[]
    ) { }
}

export class EnumMember {
    public constructor(
        public readonly id: Identifier,
        public readonly value?: Literal<number | string>
    ) {}
}

export class UnionType {
    public constructor(
        public readonly types: Identifier[]
    ) { }
}

export class Parameter {
    public constructor(
        public readonly id: Identifier,
        public readonly type: TypeDeclaration
    ) { }
}

export class BlockStatement {
    public constructor(public readonly body: any[]) { }
}

export class ArrowStatement {
    public constructor(public readonly value: SyntaxNode) { }
}

export class IfStatement {
    public constructor(
        public readonly condition: Condition,
        public readonly body: BlockStatement
    ) { }
}

export class ElseStatement {
    public constructor(
        public readonly condition: Condition,
        public readonly body: BlockStatement
    ) { }
}

export class ElifStatement {
    public constructor(
        public readonly condition: Condition,
        public readonly body: BlockStatement
    ) { }
}

export class VariableDeclaration {
    public constructor(
        public readonly id: Identifier,
        public readonly kind: "const" | "let",
        public readonly value: any
    ) { }
}

export class FunctionParameter {
    public constructor(
        public readonly id: Identifier,
        public readonly type?: TypeDeclaration
    ) { }
}

export class ClassParamater {
    public constructor(
        public readonly id: Identifier,
        public readonly isReadonly: boolean,
        public readonly accessModifier: ""
    ) { }
}

export class ClassDeclaration {
    public constructor(
        public readonly id: Identifier,
        public readonly accessModifier: AccessModifier,
        public readonly body: ClassMember[]
    ) { }
}

export class ClassMember {
    public constructor(
        public readonly id: Identifier
    ) { }
}

export type AccessModifier = "public" | "private" | "protected"
export type SyntaxNode = (
    ProgramNode |
    BinaryExpression |
    Literal |
    ReturnStatement |
    Identifier |
    CallExpression |
    LogicalExpression |
    FunctionDeclaration |
    TypeDeclaration |
    UnionType |
    BlockStatement |
    IfStatement |
    ElseStatement |
    ElifStatement |
    VariableDeclaration |
    EnumDeclaration |
    EnumMember |
    ArrowStatement
)
export type ExpressionNode = Literal | Identifier | BinaryExpression | LogicalExpression
export type Expression = BinaryExpression | CallExpression | LogicalExpression
export type Condition = Identifier | Literal | BinaryExpression | LogicalExpression | CallExpression
