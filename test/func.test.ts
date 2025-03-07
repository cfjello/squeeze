import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"

Deno.test({
    name: '01 - Parsing function call', 
    fn: () => {  
        const input_01 = " :var_01 int 89  "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'assignment')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'identifier' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 2  )
        /*
        const matcher_01 = tree.filter( v => (v.token === 'funcIdent' && v.type === 'terminal' && v.matched ) )
        assert( matcher_01.length === 1  )
        */
        const input_02 = " :var_01 fruits ['orange', 'apple', 'cherry'] "

        parser.debug = false
        parser.reset(input_02)
        const tree_02 = parser.getParseTree()
        const matcher_02 = tree_02.filter( v => (v.token === 'identifier' && v.type === 'terminal' && v.matched ) )

        assert( matcher_02.length === 2 )
        assert ( matcher_02[0].value === 'var_01'  )
        assert ( matcher_02[1].value === 'fruits' )

        /*
        const matcher_03 = tree_02.filter( v => (v.token === 'identifier' && v.type === 'terminal' && v.matched ) )

        assert( matcher_03.length === 1 )
        assert ( matcher_03[0].value === 'var_01' )
        */
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '02 - Parsing chained function calls', 
    fn: () => {  
        const input_01 = " :var_01 int [ 1,2,3,4,5,6,7,8,9] -> sum "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'assignment')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'identifier' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 3  )
        assert ( matcher_00[0].value === 'var_01' )
        assert ( matcher_00[1].value === 'int' )
        assert ( matcher_00[2].value === 'sum' )
  
        const input_02 = " :var_01 objBuild { :a 1, :b 2 } -> ( a * 2 + b )"

        parser.debug = false
        parser.reset(input_02)
        const tree_02 = parser.getParseTree()
        const matcher_02 = tree_02.filter( v => (v.token === 'identifier' && v.type === 'terminal' && v.matched ) )

        assert( matcher_02.length === 6 )
        assert ( matcher_02[0].value === 'var_01' )
        assert ( matcher_02[1].value === 'objBuild' )

    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '03 - Parsing a function declaration with a single argument and a single return value', 
    fn: () => {  
        const _data = { name: 'John', age: 25 }
        const input_00 = `  :plusTen data  ( -> data.age  + 10 )`
        // const input_01 = `  sumUp :  89, 99 , 100  ( for i in args  { sum += i } )`
        // const input_011 = `  sumUp :  [ 89, 99 , 100 ]  ( for i in args  { sum += i } )`
        // const input_02 = `  calcSum :  {a: int 15  , b: int 89}  ( -> a + b  ) -> ( -> )`
         // const input_03 = `  calcSum :  [ 15  , b: int 89,  ]  ( -> a + b  ) -> ( -> )`
         
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'singleAssign')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_00)
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => (v.token === 'rparen' && v.type=== 'terminal' && v.matched ) )
        // console.log(matcher_01)
        assert( matcher_01.length === 1  )

        const matcher_02 = tree.filter( v => (v.token === 'passOn' && v.type=== 'terminal' && v.matched ) )
        assert( matcher_02.length === 1  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '04 - Parsing simple function declaration', 
    fn: () => {  
        const input_01 = `:sum int [] ( 
            :res 49
            -> res  )`
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'assignment')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'identifier' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 4  )

    },
    sanitizeResources: false,
    sanitizeOps: false
})



Deno.test({
    name: '05 - Parsing a function declaration with a multiple statements', 
    fn: () => {  
        const input_00 = `  
        :data { 
            :name 'John', 
            :age 25 
        }
        :plusTen  [ data, :val 99, 43] (  
            -> data.age + val 
        )`
         
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'singleAssign')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_00)
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => (v.token === 'rparen' && v.type=== 'terminal' && v.matched ) )
        // console.log(matcher_01)
        assert( matcher_01.length === 1  )

        const matcher_02 = tree.filter( v => (v.token === 'passOn' && v.type=== 'terminal' && v.matched ) )
        assert( matcher_02.length === 1  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})