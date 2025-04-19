import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"



Deno.test({
    name: '03 - Parsing simple one item object', 
    fn: () => {  
        const input_01 = "{ dbl: 8.88 }"
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'objectDecl')
        parser.debug = false
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        // console.log(JSON.stringify(tree, null, 2))
        const matcher_00 = tree.filter( v => (v.token === 'identDecl' && v.type == 'terminal' && v.matched ) )
        assert( matcher_00.length === 1 )
        const matcher_06 = tree.filter( v => (v.token === 'lbrace' && v.matched ) )
        assert( matcher_06.length === 1)
        const matcher_07 = tree.filter( v => (v.token === 'rbrace' && v.matched ) )
        assert( matcher_07.length === 1 )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '03 - Parsing a more complex object', 
    fn: () => {  
        const input_01 = `{ 
            dbl: 8.88, 
            str: [ 'æblegrød', 'rødgrød', 'øllebrød' ],
            bool: 'true'
            obj: { a: 1, b: 2, c: 3 },
        }`
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'objectDecl')
        parser.debug = false
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        // console.log(JSON.stringify(tree, null, 2))
        const matcher_00 = tree.filter( v => (v.token === 'identDecl' && v.type == 'terminal' && v.matched ) )
        assert( matcher_00.length === 7 )
        const matcher_06 = tree.filter( v => (v.token === 'lbrace' && v.matched ) )
        assert( matcher_06.length === 2)
        const matcher_07 = tree.filter( v => (v.token === 'rbrace' && v.matched ) )
        assert( matcher_07.length === 2 )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

