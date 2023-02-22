export default function timer(func: (...args: any[]) => any): number {
    const start = Date.now()
    func()
    const end = Date.now()

    const elapsed = start - end

    console.log(`Function ${func.name} executed in ${new Date(elapsed)}`)
    return 0
}