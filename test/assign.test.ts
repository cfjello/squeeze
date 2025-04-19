import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"

Deno.test({
    name: '01 - Parsing a long form LHS single assignment', 
    fn: () => {  
        const input_01 = " var_01, v1 : 89  "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'identAssign')
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'colon' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 1  )

        const matcher_01 = tree.filter( v => (v.token === 'identName' && v.type === 'terminal' && v.matched ) )
        assert( matcher_01.length === 2  )

        const matcher_03 = tree.filter( v => (v.token === 'digits' && v.type === 'terminal' && v.matched ) )
        assert( matcher_03.length === 1  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '02 - Parsing a private long form LHS single assignment', 
    fn: () => {  
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'identAssign')
        parser.debug = false
        const input_04 = " # var_01, v1, 'My random variable description' : 89  "
        parser.reset(input_04)
        const tree_04 = parser.getParseTree()

        const matcher_04 = tree_04.filter( v => (v.token === 'colon' && v.type === 'terminal' && v.matched ) )
        assert( matcher_04.length === 1 )

        const matcher_05 = tree_04.filter( v => (v.token === 'privat' && v.type === 'terminal' && v.matched ) )
        assert( matcher_05.length === 1 )
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '03 - Assigning a simple object', 
    fn: () => {      
        const input_01 = ` fruitObj, foo, 'A few fruits' :  { a ~ 89  , b ~ ['orange', 'grape', 'apple'] } `
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'identAssign' ) 
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()

        const matcher_01 = tree.filter( v => (v.token === 'singleQuoted' && v.type === 'terminal' && v.matched ) )
        assert( matcher_01.length === 4 )

        const matcher_02 = tree.filter( v => (v.token === 'tilde' && v.type === 'terminal' && v.matched ) )
        assert( matcher_02.length === 2 )
        
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '04 - Modifying a number using a tilde operator', 
    fn: () => {  
        const input_01 = `  sum +~ 5`
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'identNumUpd' ) 
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()

        const matcher_01 = tree.filter( v => (v.token === "identName" && v.type === 'terminal' && v.matched ) )
        // console.log(matcher_01)
        assert( matcher_01.length === 1  )

        const matcher_02 = tree.filter( v => (v.token === 'numericUpd' && v.type === 'terminal' && v.matched ) )
        // console.log(matcher_02)
        assert( matcher_02.length === 1  )
        const matcher_03 = tree.filter( v => (v.token === 'digits' && v.type === 'terminal' && v.matched ) )
        // console.log(matcher_03)
        assert( matcher_03.length === 1  )
    }, 
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '05 - Modifying a number array using a tilde operator', 
    fn: () => {  
        const input_01 = `  [1,2,3,4,5] *~ 5`
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'identNumUpd' ) 
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()

        const matcher_02 = tree.filter( v => (v.token === 'numericUpd' && v.type === 'terminal' && v.matched ) )
        // console.log(matcher_02)
        assert( matcher_02.length === 1  )
        const matcher_03 = tree.filter( v => (v.token === 'digits' && v.type === 'terminal' && v.matched ) )
        // console.log(matcher_03)
        assert( matcher_03.length === 6  )
    }, 
    sanitizeResources: false,
    sanitizeOps: false
})

/*
Deno.test({
    name: '04 - Failing a "single identifier" assignment - (expect to see a parser error)', 
    fn: () => {  
        const input_01 = ": this.Is.NOT.Single.Identifier. 'my random variable' "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'singleAssign')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)

        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'declIdent' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 0 )

    },
    sanitizeResources: false,
    sanitizeOps: false
})
*/