export interface Token {
    type: TokenType
    value: any
}

export enum TokenType {
    IDENTIFIER = "IDENTIFIER",
    STRING = "STRING",
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    KEYWORD = "KEYWORD",
    PUNCTUATION = "PUNCTUATION",
    OPERATOR = "OPERATOR",
    BOOL = "BOOL",
    PROGRAM = "PROGRAM",
    FUNCTION = "FUNCTION"
}