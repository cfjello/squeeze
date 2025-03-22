import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"

Deno.test({
    name: '01 - Parsing "single identifier" assignment', 
    fn: () => {  
        const input_01 = " : thisIsSingleIdentifier 'my random variable' "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'singleAssign')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'singleIdent' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 1 )

        /*
         const input_02 = ": this.Is.NOT.Single.Identifier. 'my random variable' "
         parser.debug = false
         parser.reset(input_02)
         const tree_02 = parser.getParseTree()
         const matcher_02 = tree_02.filter( v => (v.token === 'singleIdent' && v.type === 'terminal' && v.matched ) )
         assert( matcher_02.length === 0 )
         */
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '02 - Parsing a dotted identifier reference with a doubleDot', 
    fn: () => {  
        const input_00 = " ..var_01.data.value.set "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'identRef')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_00)
        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'identifier' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 4  )

        const matcher_01 = tree.filter( v => (v.token === 'doubleDot' && v.type === 'terminal' && v.matched ) )
        assert( matcher_01.length === 1  )


    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '01 - Parsing a identifier reference with a prefix', 
    fn: () => {  
        const input_00 = "../../data.var_01.data.value.set "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'identRef')
        parser.debug = false
        parser.always = 'whitespace'
        parser.reset(input_00)
        const tree = parser.getParseTree()
        const matcher_00 = tree.filter( v => (v.token === 'identifier' && v.type === 'terminal' && v.matched ) )
        assert( matcher_00.length === 5  )

        const matcher_02 = tree.filter( v => (v.token === 'prevLevels' && v.type === 'terminal' && v.matched ) )
        assert( matcher_02.length === 1  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})
   

