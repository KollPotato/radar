export default class Position {
    public index: number = 0
    public line: number = 1
    public column: number = 0

    public advance(character: string) {
        if (character === "\n") {
            this.line++
            this.column = 0
            return character
        }
        
        this.column++
        return character
    }
}