import * as fs from "fs"

export default class File {
    public constructor(public readonly path: string) {

    }
    
    private testFlag(number: number): boolean {
        try {
            fs.accessSync(this.path, number)
            return true
        } catch {
            return false
        }
    }

    public get content(): string {
        return fs.readFileSync(this.path, { encoding: "utf-8" })
    }

    public get writable(): boolean {
        return this.testFlag(fs.constants.W_OK)
    }

    public get readable(): boolean {
        return this.testFlag(fs.constants.R_OK)
    }

    public get exists(): boolean {
        return fs.existsSync(this.path)
    }
}