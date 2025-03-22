import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"

Deno.test({
    name: '01 - Parsing a long form LHS single assignment', 
    fn: () => {  
        const input_01 = " :var_01, v1, 'my random variable': 89  "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'singleAssign')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'colon' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 2  )

   
        const matcher_01 = tree.filter( v => (v.token === 'singleIdent' && v.type === 'terminal' && v.matched ) )
        assert( matcher_01.length === 2  )

        const matcher_02 = tree.filter( v => (v.token === 'singleQuoted' && v.type === 'terminal' && v.matched ) )
        assert( matcher_02.length === 1  )

        const matcher_03 = tree.filter( v => (v.token === 'digits' && v.type === 'terminal' && v.matched ) )
        assert( matcher_03.length === 1  )

        const input_04 = " : #var_01, v1, 'my random variable': 89  "
        parser.reset(input_04)
        const tree_04 = parser.getParseTree()
        const matcher_04 = tree_04.filter( v => (v.token === 'colon' && v.type === 'terminal' && v.matched && v.text === ': #' ) )
        assert( matcher_04.length === 1 )
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '02 - Parsing a simple object initializer', 
    fn: () => {  
        // const input_01 = `  { a: int 89  , b: fruits ['orange', 'grape', 'apple'] } `
        const input_01 = `  { :a 89  , :b ['orange', 'grape', 'apple'] } `
        // const input_01 = `  sumUp :  89, 99 , 100  ( for i in args  { sum += i } )`
        // const input_011 = `  sumUp :  [ 89, 99 , 100 ]  ( for i in args  { sum += i } )`
        // const input_02 = `  calcSum :  {a: int 15  , b: int 89}  ( -> a + b  ) -> ( -> )`
        // const input_03 = `  calcSum :  [ 15  , b: int 89,  ]  ( -> a + b  ) -> ( -> )`
         
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'objectDecl' ) 
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
        const tree = parser.getParseTree()

        const matcher_01 = tree.filter( v => (v.token === 'singleQuoted' && v.type === 'terminal' && v.value === 'apple' && v.matched ) )
        // console.log(matcher_01)
        assert( matcher_01.length === 1  )
        
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '03 - Parsing an object initializer with mutable function initializers', 
    fn: () => {  
        // const input_01 = `  { a: int 89  , b: fruits ['orange', 'grape', 'apple'] } `
        const input_01 = `  { :~ a int 89  , ~ b fruits ['orange', 'grape', 'apple'] } `
        // const input_01 = `  sumUp :  89, 99 , 100  ( for i in args  { sum += i } )`
        // const input_011 = `  sumUp :  [ 89, 99 , 100 ]  ( for i in args  { sum += i } )`
        // const input_02 = `  calcSum :  {a: int 15  , b: int 89}  ( -> a + b  ) -> ( -> )`
        // const input_03 = `  calcSum :  [ 15  , b: int 89,  ]  ( -> a + b  ) -> ( -> )`
         
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'objectDecl' ) 
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
        const tree = parser.getParseTree()

        const matcher_01 = tree.filter( v => (v.token === 'singleQuoted' && v.type === 'terminal' && v.value === 'apple' && v.matched ) )
        // console.log(matcher_01)
        assert( matcher_01.length === 1  )
        
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '04 - Failing a "single identifier" assignment - (expect to see a parser error)', 
    fn: () => {  
        const input_01 = ": this.Is.NOT.Single.Identifier. 'my random variable' "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'singleAssign')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)

        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'singleIdent' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 0 )

    },
    sanitizeResources: false,
    sanitizeOps: false
})
