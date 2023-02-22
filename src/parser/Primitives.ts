export const BINARY_OPERATORS = ["+", "-", "*", "**", "/", "%", "==", "!=", "!", ">=", ">", "<", "<=", "="] as const
export const LOGICAL_OPERATORS = ["&&", "||", "in"] as const

export const KEYWORDS = [
    "if",
    "true",
    "false",
    "fun",
    "none",
    "return",
    "for",
    "while",
    "const",
    "let",
    "enum",
    "class",
    "break",
    "as",
    "import",
    "from",
    "export",
    "in",
    "not",
    "struct",
    "none",
    "throw",
] as const

export const OPERATOR_PRECEDENCE: Record<Operator, number> = {
    "=": 1,
    "||": 2,
    "&&": 3,
    "in": 3,
    "<": 7,
    ">": 7,
    "<=": 7,
    ">=": 7,
    "==": 7,
    "!=": 7,
    "+": 10,
    "-": 10,
    "*": 20,
    "/": 20,
    "%": 20,
    "**": 20,
    "!": 20
};

export type Operator = BinaryOperator | LogicalOperator
export type Keyword = typeof KEYWORDS[number]
export type BinaryOperator = typeof BINARY_OPERATORS[number]
export type LogicalOperator = typeof LOGICAL_OPERATORS[number]