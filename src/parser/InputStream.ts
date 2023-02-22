import Position from "./Position";

export default class InputStream {
    public constructor(input: string) {
        this.input = input.replace(/\r\n/g, "\n");
        this.position = new Position()
    }

    public readonly input: string
    public readonly position: Position

    public get next(): string {
        const character = this.input.charAt(this.position.index++)
        this.position.advance(character)
        
        return character
    }

    public get peek(): string {
        return this.input.charAt(this.position.index);
    }

    public get eof(): boolean {
        return this.peek === "";
    }
}
