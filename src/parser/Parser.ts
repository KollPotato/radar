import { TokenType } from "./Token";
import { ProgramNode, BinaryExpression, Literal, Identifier, BlockStatement, FunctionDeclaration, ReturnStatement, CallExpression, VariableDeclaration, TypeDeclaration, SyntaxNode, EnumMember, EnumDeclaration, ClassDeclaration, Parameter, FunctionParameter, IfStatement } from "./Node"
import { BinaryOperator, Keyword, LogicalOperator, OPERATOR_PRECEDENCE, Operator } from "./Primitives";
import TokenStream from "./TokenStream";
import { EventEmitter } from "events";
import { error } from "../Error";


export default class Parser extends EventEmitter {
    public constructor(public readonly input: TokenStream) {
        super()
    }

    public isTokenType(tokenType: TokenType, character?: string): boolean {
        const token = this.input.peek;

        if (!token) {
            return false;
        }

        else if (token.type != tokenType) {
            return false;
        }

        else if (character && token.value !== character) {
            return false;
        }

        return true;
    }

    public isPunctuation(character: string): boolean {
        return this.isTokenType(TokenType.PUNCTUATION, character)
    }

    public isKeyword(keyword: Keyword | string): boolean {
        return this.isTokenType(TokenType.KEYWORD, keyword)
    }

    public isIdentifier(identifier: string): boolean {
        return this.isTokenType(TokenType.IDENTIFIER, identifier)
    }

    public isOperator(operator?: BinaryOperator | LogicalOperator | string): boolean {
        return this.isTokenType(TokenType.OPERATOR, operator)
    }

    public skip(string: string, check: (string: string) => boolean, expected: string): void {
        if (check(string)) {
            this.input.next
            return
        }

        error({
            type: "SyntaxError",
            input: this.input.input,
            message: `Expecting ${expected}: "${string}"`
        })
    }

    public skipPunctuation(character: string): void {
        this.skip(character, this.isPunctuation.bind(this, character), "punctuation")
    }

    public skipKeyword(keyword: Keyword): void {
        this.skip(keyword, this.isKeyword.bind(this, keyword), "keyword")
    }

    public skipOperator(operator: string) {
        this.skip(operator, this.isOperator.bind(this, operator), "operator")
    }

    public maybeBinary(left: BinaryExpression | Literal<number>, precedence: number): BinaryExpression | Literal<number> {
        if (!this.isOperator()) return left as BinaryExpression;
        
        const operator = this.input.next

        if (operator === null) {
            error({
                input: this.input.input,
                message: "Could not parse binary expression because operator is not defined",
                type: "SyntaxError"
            })
        }

        const operatorPrecedence = OPERATOR_PRECEDENCE[operator.value as Operator]
        if (operatorPrecedence > precedence)
            return new BinaryExpression(
                left,
                this.maybeBinary(this.parseAtom() as BinaryExpression | Literal<number>, operatorPrecedence)!,
                operator.value
            )
     
        error({
            type: "SyntaxError",
            message: "Could not parse binary expression",
            input: this.input.input
        })
    }

    public parseIdentifier(): Identifier {
        const token = this.input.next

        if (token?.type !== TokenType.IDENTIFIER && token?.type !== TokenType.KEYWORD) {
            error({
                type: "SyntaxError",
                message: "Expecting an identifier",
                input: this.input.input
            })
        }

        return new Identifier(token.value)
    }

    public parseVariable(): VariableDeclaration {
        const kind = this.parseIdentifier()
        const id = this.parseIdentifier()

        this.skipOperator("=")

        const value = this.parseAny()

        if (kind.name !== "const" && kind.name !== "let") {
            error({
                input: this.input.input,
                message: "Could not parse variable",
                type: "SyntaxError"
            })
        }

        return new VariableDeclaration(id, kind.name, value)
    }

    public delimited<T>(
        start: string,
        stop: string,
        separator: string,
        parser: (...args: SyntaxNode[]) => T
    ): T[] {
        const nodes: T[] = []
        let isFirst = true

        this.skipPunctuation(start);

        while (!this.input.eof) {
            if (this.isPunctuation(stop)) break
            else if (isFirst) isFirst = false
            else this.skipPunctuation(separator)
            if (this.isPunctuation(stop)) break
            nodes.push(parser.call(this));
        }

        this.skipPunctuation(stop)

        return nodes
    }

    public parseType(): TypeDeclaration {
        const id = this.parseIdentifier()

        return new TypeDeclaration(id)
    }

    public parseFunctionParameter(): FunctionParameter {
        const id = this.parseIdentifier()

        if (this.input.peek?.value === ":") {
            this.skipPunctuation(":")
            const type = this.parseType()
            return new FunctionParameter(id, type)
        }

        return new FunctionParameter(id)
    }

    public parseFunction(): FunctionDeclaration {
        this.skipKeyword("fun")

        const id = this.parseIdentifier()
        const params = this.delimited("(", ")", ",", this.parseFunctionParameter)!
        let returnType

        if (this.input.peek?.value === ":") {
            this.skipPunctuation(":")
            returnType = this.parseType()
        }


        const body = this.parseBlock(this.parseAny)
        return new FunctionDeclaration(id, params, body, returnType)
    }

    public parseEnum(): EnumDeclaration {
        this.skipKeyword("enum")

        const id = this.parseIdentifier()
        const body = this.delimited("{", "}", ",", this.parseEnumMember)

        return new EnumDeclaration(id, body)
    }

    public parseEnumMember(): EnumMember {
        const id = this.parseIdentifier()

        if (this.input.peek?.value === "=") {
            this.input.next
            const value = new Literal(this.input.next!.value)
            return new EnumMember(id, value)
        }

        return new EnumMember(id)
    }

    public parseClass(): ClassDeclaration {
        this.skipKeyword("class")

        const id = this.parseIdentifier()
        if (this.input.peek?.value === "(") {
            const parameters = this.delimited("(", ")", ",", () => {

            })

        }

        return new ClassDeclaration(id, "private", [])
    }

    public parseReturn(): ReturnStatement {
        this.skipKeyword("return")

        const value = this.parseAny()

        return new ReturnStatement(value)
    }

    public parseAtom(): SyntaxNode {
        if (this.isKeyword("true") || this.isKeyword("false")) return this.parseBool()
        else if (this.isKeyword("fun")) return this.parseFunction()
        else if (this.isKeyword("enum")) return this.parseEnum()
        else if (this.isKeyword("class")) return this.parseClass()
        else if (this.isKeyword("return")) return this.parseReturn()
        else if (this.isPunctuation("{")) return this.parseBlock(this.parseAny)
        else if (this.isKeyword("const") || this.isKeyword("let")) return this.parseVariable()

        const token = this.input.next

        switch (token?.type) {
            case TokenType.IDENTIFIER:
                return new Identifier(token.value)
            case TokenType.FLOAT:
                return new Literal(parseFloat(token.value))
            case TokenType.INTEGER:
                return new Literal(parseInt(token.value))
            case TokenType.STRING:
                return new Literal(token.value)
        }

        error({
            input: this.input.input,
            message: `Could not parse token type of ${token?.type} ${token?.value}`,
            type: "SyntaxError"
        })
    }

    public parseAny(): SyntaxNode {
        const atom = this.parseAtom()

        if (atom instanceof Literal) {
            const expression = this.maybeBinary(atom as Literal<number>, 0)
            if (expression instanceof Literal) return atom
            return expression
        }

        else if (atom instanceof Identifier) {
            if (this.isPunctuation("(")) {
                const args = this.delimited("(", ")", ",", this.parseAny)
                return new CallExpression(atom, args)
            }
        }

        return atom
    }

    public parseWhile(parser: () => SyntaxNode, predicate?: () => boolean): SyntaxNode[] {
        const nodes: SyntaxNode[] = []

        if (predicate) {
            while (!this.input.eof && predicate()) {
                const node = parser.call(this)
                nodes.push(node)
            }

            return nodes
        }

        while (!this.input.eof) {
            const node = parser.call(this)
            nodes.push(node)
        }

        return nodes
    }

    public parseAll(): SyntaxNode[] {
        return this.parseWhile(this.parseAny)
    }

    public parseBlock(parser: () => SyntaxNode): BlockStatement {
        this.skipPunctuation("{")

        const body = this.parseWhile(parser.bind(this), () => this.input.peek?.value !== "}")

        this.skipPunctuation("}")

        return new BlockStatement(body)
    }

    public parseBool(): Literal<boolean> {
        const value = this.input.next?.value === "true"
        return new Literal(value)
    }

    public parse(): ProgramNode {
        return new ProgramNode(this.parseAll())
    }
}
