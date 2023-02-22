import Radar from "../src/index"
import { EnumDeclaration } from "../src/parser/Node";
import { EnumMember } from "../src/parser/Node";
import { Literal } from "../src/parser/Node";
import { VariableDeclaration } from "../src/parser/Node";
import { BlockStatement, FunctionDeclaration, FunctionParameter, Identifier, ProgramNode, TypeDeclaration } from "../src/parser/Node";

test("Parses functions", () => {
    const code = "fun main(args: String): Void {}"
    const radar = new Radar(code)

    expect(radar.ast).toStrictEqual(new ProgramNode([
        new FunctionDeclaration(
            new Identifier("main"),
            [new FunctionParameter(new Identifier("args"), new TypeDeclaration(new Identifier("String")))],
            new BlockStatement([]),
            new TypeDeclaration(new Identifier("Void")))]
        )
    )
})

test("Parser variables", () => {
    const code = `
    const x = 0
    let y = "oo"
    let z = fun main() {}
    `

    const radar = new Radar(code)

    expect(radar.ast).toStrictEqual(new ProgramNode([
        new VariableDeclaration(new Identifier("x"), "const", new Literal(0)),
        new VariableDeclaration(new Identifier("y"), "let", new Literal("oo")),
        new VariableDeclaration(new Identifier("z"), "let", new FunctionDeclaration(new Identifier("main"), [], new BlockStatement([]))),
    ]))
})

test("Parses enums", () => {
    const code = `
    enum AnimalType {
        DOG = "dog",
        CAT = 5,
        MONKE
    }
    `

    const radar = new Radar(code)

    expect(radar.ast).toStrictEqual(new ProgramNode([
        new EnumDeclaration(
            new Identifier("AnimalType"),
            [
                new EnumMember(new Identifier("DOG"), new Literal("dog")),
                new EnumMember(new Identifier("CAT"), new Literal(5)),
                new EnumMember(new Identifier("MONKE")),
            ]
        )
    ]))
})