
import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"


/*
Deno.test({
    name: '00 - Parsing assigment LHS', 
    fn: () => {  
        const input_01 = "æblegrød"
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'lhs')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => (v.token === 'identifier' && v.matched) )
        assert( matcher_01.length === 1  )

        const input_02 = "  æblegrød, hamster, GOAT   "
        parser.debug = false
        parser.reset(input_02)  
        const tree_02 = parser.getParseTree()
        const matcher_02 = tree_02.filter(  v => (v.token === 'identifier' && v.type === 'terminal' && v.matched) )
        // console.log(JSON.stringify(matcher_02, null, 2))
        assert( matcher_02.length === 3 )

    },
    sanitizeResources: false,
    sanitizeOps: false
})
*/


/*
Deno.test({
    name: '02 - Parsing an identifier', 
    fn: () => {  
        const input_01 = "  Identifier  "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'identifier')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => (v.token === 'identifier' && v.type=== 'terminal' && v.matched ) )
        console.log(matcher_01)
        assert( matcher_01.length === 1  )

        const input_02 = "  Identifier.subIdentifier.field  "
        parser.reset(input_02)
        const tree_02 = parser.getParseTree()
        const matcher_02 = tree_02.filter( v => (v.token === 'identifier' && v.type=== 'terminal' && v.matched ) )
        // console.log(matcher_02)
        assert( matcher_02.length === 3  )
        
    },
    sanitizeResources: false,
    sanitizeOps: false
})
*/








/*
Deno.test({
    name: '05 - Parsing undelimited list', 
    fn: () => {  
        const input_01 = "  888, 8.88 , ['æblegrød' , ['hamster', 'rat' ] ] , `GOAT` "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'undelimList')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        // console.log(JSON.stringify(tree, null, 2))
        const matcher_01 = tree.filter( v => (v.token === 'comma' && v.matched ) )
        assert( matcher_01.length === 5  )
        const matcher_02 = tree.filter( v => (v.token === 'digits' && v.matched ) )
        assert( matcher_02.length === 1  )
        const matcher_03 = tree.filter( v => (v.token === 'double' && v.matched ) )
        assert( matcher_03.length === 1  )
        const matcher_04 = tree.filter( v => (v.token === 'singleQuoted' && v.matched ) )
        assert( matcher_04.length === 3  )
        const matcher_05 = tree.filter( v => (v.token === 'tmplQuoted' && v.matched ) ) 
        assert( matcher_05.length === 1  )
        const matcher_06 = tree.filter( v => (v.token === 'lbracket' && v.matched ) )
        assert( matcher_06.length === 2 )
        const matcher_07 = tree.filter( v => (v.token === 'rbracket' && v.matched ) )
        assert( matcher_07.length === 2 )
    },
    sanitizeResources: false,
    sanitizeOps: false
})
*/







/*
Deno.test({
    name: '01 - Parsing assigment RHS', 
    fn: () => {  
        const input_01 = "myFunc hamster, GOAT   "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'rhs')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => v.token === 'func' )
        assert( matcher_01.length === 1  )
        const matcher_02 = tree.filter( v => v.token === 'identifier' )
        assert( matcher_02.length === 3  )

    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '01 - Parsing full assigment', 
    fn: () => {  
        const input_01 = "var_01, v1 : myFunc hamster, GOAT   "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'assignment')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => v.token === 'func' )
        assert( matcher_01.length === 1  )
        const matcher_02 = tree.filter( v => v.token === 'colon' )
        assert( matcher_02.length === 1  )
        const matcher_03 = tree.filter( v => v.token === 'lhs' )
        assert( matcher_03.length === 1 )
        const matcher_04 = tree.filter( v => v.token === 'rhs' )
        assert( matcher_04.length === 1 )
        const matcher_05 = tree.filter( v => v.token === 'identifier' )
        assert( matcher_05.length === 5  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})
/*
Deno.test({
    name: '01 - Parsing a Scope', 
    fn: () => {  
        const input_01 = `{ 
            var_01: myFunc ar01, arg02, arg03
            var_02: myFunc ar01, arg02, arg03
            var_03: myFunc ar01, arg02, arg03
         }`   
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'scope')
        parser.debug = true
        parser.always = 'whitespace'
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => v.token === 'func' )
        assert( matcher_01.length === 3  )
        const matcher_02 = tree.filter( v => v.token === 'identifier' )
        assert( matcher_02.length > 10  )

    },
    sanitizeResources: false,
    sanitizeOps: false
})
*/