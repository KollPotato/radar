# Radar
Radar is a high-level programming language.


## Why Radar?
- ⌛ High-level
- ✨ Statically-typed
- ⚡ Blazingly fast

## Examples

#### Hello World
```radar
# main.rd

fun main() {
	println("Hello, World!")
}
```

#### Fibonacci
```radar
# main.rd

fun main() {
	for i in Range(10) {
    	println("Fibonacci of $i is ${fibonacci(i)}")
    }
}

fun fibonacci(n: Int): Int {
	if n in [0, 1] return n
    return fibonacci(n - 1) + fibonacci(n - 2)
}
```

#### HTTP Server
```radar
# main.r

import { Server } from "http"

fun main() {
    const server = new Server({
        host: "localhost",
        port: 5000
    })

    server.get("/", () => {
        return "Hello, World!"
    })

    server.start()
}
```