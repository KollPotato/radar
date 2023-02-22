import { error } from "../Error";
import InputStream from "./InputStream";
import { Keyword, KEYWORDS } from "./Primitives";
import { Token, TokenType } from "./Token";

export default class TokenStream {
    public constructor(public readonly input: InputStream) { }

    public current: Token | null = null;

    public isKeyword(character: Keyword | string) {
        return KEYWORDS.includes(character as Keyword);
    }

    public isDigit(character: string) {
        return /[0-9]/i.test(character);
    }

    public isIdentifierStart(ch: string) {
        return /[a-z_]/i.test(ch);
    }

    public isIdentifier(character: string) {
        return this.isIdentifierStart(character)
    }

    public isOperatorCharacter(character: string) {
        return "+-*/%=&|<>!".indexOf(character) >= 0;
    }

    public isPunctuation(character: string) {
        return ",:;(){}[]".indexOf(character) >= 0;
    }

    public isWhitespace(character: string) {
        return " \t\n".indexOf(character) >= 0;
    }

    public readWhile(predicate: (character: string) => boolean) {
        let string = ""

        while (!this.input.eof && predicate.call(this, this.input.peek)) {
            string += this.input.next
        }
        
        return string;
    }

    public readNumber(): Token {
        let hasDot = false

        const number = this.readWhile(character => {
            if (character === ".") {
                if (hasDot) return false
                hasDot = true
                return true
            }

            return this.isDigit(character)
        });

        if (hasDot) return { type: TokenType.FLOAT, value: parseFloat(number) }

        return { type: TokenType.INTEGER, value: parseInt(number) };
    }

    public readIdentifier(): Token {
        const identifier = this.readWhile(this.isIdentifier);

        return {
            type: this.isKeyword(identifier) ? TokenType.KEYWORD : TokenType.IDENTIFIER,
            value: identifier
        };
    }
    
    public readOperator(): Token {
        return {
            type: TokenType.OPERATOR,
            value: this.readWhile(this.isOperatorCharacter)
        };
    }

    public readEscaped(end: string) {
        let isEscaped = false
        let string = "";
        this.input.next;

        while (!this.input.eof) {
            let character = this.input.next;

            if (isEscaped) {
                string += character;
                isEscaped = false;
            } else if (character === "\\") {
                isEscaped = true
            } else if (character === end) {
                break
            } else {
                string += character
            }
        }

        return string;
    }

    public readPunctuation(): Token {
        return { type: TokenType.PUNCTUATION, value: this.input.next }
    }

    public readString(): Token {
        return { type: TokenType.STRING, value: this.readEscaped('"') };
    }

    public skipComment() {
        this.readWhile(character => character !== "\n");
        this.input.next;
    }

    public readNext(): Token | null {
        this.readWhile(this.isWhitespace);
        if (this.input.eof) return null;
        const character = this.input.peek;
        if (character == "#") {
            this.skipComment();
            return this.readNext();
        }
        else if (character === '"') return this.readString()
        else if (this.isDigit(character)) return this.readNumber()
        else if (this.isIdentifierStart(character)) return this.readIdentifier()
        else if (this.isPunctuation(character)) return this.readPunctuation()
        else if (this.isOperatorCharacter(character)) return this.readOperator()

        error({
            input: this.input,
            message: `Can't handle character: ${character}`,
            type: "SyntaxError"
        });
    }

    public get peek(): Token | null {
        return this.current || (this.current = this.readNext());
    }

    public get next(): Token | null {
        const token = this.current;
        this.current = null;
        return token || this.readNext();
    }

    public get eof() {
        return this.peek === null;
    }
}