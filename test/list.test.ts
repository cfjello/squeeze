import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"


Deno.test({
    name: '01 - Parsing a delimited list', 
    fn: () => {  
        const input_01 = "  [ 888, 8.88 , 'æblegrød' , 'hamster' , `GOAT` ] "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'delimList')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        // console.log(JSON.stringify(tree, null, 2))
        const matcher_01 = tree.filter( v => (v.token === 'comma' && v.matched ) )
        assert( matcher_01.length === 4  )
        const matcher_02 = tree.filter( v => (v.token === 'digits' && v.matched ) )
        assert( matcher_02.length === 1  )
        const matcher_03 = tree.filter( v => (v.token === 'double' && v.matched ) )
        assert( matcher_03.length === 1  )
        const matcher_04 = tree.filter( v => (v.token === 'singleQuoted' && v.matched ) )
        assert( matcher_04.length === 2  )
        const matcher_05 = tree.filter( v => (v.token === 'tmplQuoted' && v.matched ) ) 
        assert( matcher_05.length === 1  )
        const matcher_06 = tree.filter( v => (v.token === 'lbracket' && v.matched ) )
        assert( matcher_06.length === 1  )
        const matcher_07 = tree.filter( v => (v.token === 'rbracket' && v.matched ) )
        assert( matcher_07.length === 1  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '02 - Parsing Nested delimited list', 
    fn: () => {  
        const input_01 = "  [ 888, 8.88 , ['æblegrød' , ['hamster', 'rat' ] ] , `GOAT` ] "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'delimList')
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
        assert( matcher_06.length === 3  )
        const matcher_07 = tree.filter( v => (v.token === 'rbracket' && v.matched ) )
        assert( matcher_07.length === 3  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '03 - Parsing list with and named elements', 
    fn: () => {  
        const input_01 = "  [ 888, { :dbl 8.88 } , [ :str 'æblegrød' , :arr ['hamster', 'rat' ] ] , :tmpl `GOAT`] "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'delimList')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        // console.log(JSON.stringify(tree, null, 2))
        const matcher_00 = tree.filter( v => (v.token === 'identifier' && v.type == 'terminal' && v.matched ) )
        // console.log(matcher_00)
        assert( matcher_00.length === 4 )
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
        assert( matcher_06.length === 3 )
        const matcher_07 = tree.filter( v => (v.token === 'rbracket' && v.matched ) )
        assert( matcher_07.length === 3 )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

