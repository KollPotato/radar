import { ProgramNode } from "../parser/Node";
import {
    APInt,
    BasicBlock,
    ConstantInt,
    FunctionType,
    IRBuilder,
    LLVMContext,
    Module,
    Type,
    DIBuilder,
    DICompileUnit,
    DIFile,
    DINode,
    DISubprogram,
    DINamespace
} from "llvm-bindings"

export default class Compiler {
    public constructor(public readonly ast: ProgramNode) { }

    private createFunction(module: Module, name: string, type: FunctionType) {
        module.getOrInsertFunction(name, type)
        const func = module.getFunction(name)!

        return func
    }
    
    public compile(): string {
        const context = new LLVMContext()
        const module = new Module("main", context)
        
        if (!this.ast.hasFunction("main")) {
            console.log("CompilerError: Can not compile code without a main function")
        }
        
        const i32 = Type.getInt32Ty(context)
        
        const main = this.createFunction(module, "main", FunctionType.get(i32, false))
        const mainBasicBlock = BasicBlock.Create(context, "entry", main)
        const mainBuilder = new IRBuilder(mainBasicBlock)

        const helloWorld = mainBuilder.CreateGlobalString("Hello, World\n", "hello_world")

        const print = this.createFunction(module, "print", FunctionType.get(Type.getVoidTy(context), false))
        const printBasicBlock = BasicBlock.Create(context, "entry", print)
        const printBuilder = new IRBuilder(printBasicBlock)

        printBuilder.CreateRetVoid()
        
        const returnValue = ConstantInt.get(context, new APInt(8, 16))

        mainBuilder.CreateCall(print, [helloWorld])
        mainBuilder.CreateRet(returnValue)

        return module.print()
    }
}