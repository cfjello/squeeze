import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"

Deno.test({
    name: '01 - Parsing a string', 
    fn: () => {  
        const input_01 = " 'æblegrød' "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'quotedString')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
  
        const tree = parser.getParseTree()
        // console.log(JSON.stringify(tree, null, 2))
        const matcher_01 = tree.filter( v => (v.token === 'singleQuoted' ) )
        assert( matcher_01.length === 1  )

         
        const input_02 = ' "æblegrød  "    '
        parser.debug = false
        parser.reset(input_02)  
        const tree_02 = parser.getParseTree()
        const matcher_02 = tree_02.filter( v => (v.token === 'doubleQuoted' ) )
        assert( matcher_02.length === 1  )

        const input_03 = ' "\\"\\"\\"\\" "    '
        parser.debug = false
        parser.reset(input_03)  
        const tree_03 = parser.getParseTree()
        const matcher_03 = tree_03.filter( v => (v.token === 'doubleQuoted' ) )
        assert( matcher_03.length === 1  )


        const input_04 = ' `æblegrød  ${ dummy }`    '
        parser.debug = false
        parser.reset(input_04)  
        const tree_04 = parser.getParseTree()
        const matcher_04 = tree_04.filter( v => (v.token === 'tmplQuoted' ) )
        assert( matcher_04.length === 1  )
        
    },
    sanitizeResources: false,
    sanitizeOps: false
})
