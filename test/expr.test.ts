import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"
import { Parser } from "../imports.ts";
import  { LR } from "../rules/lexer.ts"
import { PR, UserData, LexerTokens, Tokens } from "../rules/rules.ts"

Deno.test({
    name: '01 - Parsing a numeric expression', 
    fn: () => {  
        const input_01 = "  3 + 5.0 - 7.55 / 9 * 11 % 13 "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'numListUnDelim')
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_03 = tree.filter( v => (v.token === 'numericOper' && v.matched ) )
        assert( matcher_03.length === 5  )
        const matcher_06 = tree.filter( v => (v.token === 'digits' && v.matched ) ) 
        assert( matcher_06.length === 4  )
        const matcher_07 = tree.filter( v => (v.token === 'double' && v.matched ) )
        assert( matcher_07.length === 2  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '02 - Parsing a numeric expression with evalution groups', 
    fn: () => {  
        const input_01 = " 3 + 5.0 - ( 7.55 / ( 9 * 11) ) % 13 "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'numListUnDelim')
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => (v.token === 'lparen' && v.matched ) )
        assert( matcher_01.length === 2 )
        const matcher_02 = tree.filter( v => (v.token === 'rparen' && v.matched ) )
        assert( matcher_02.length === 2  )
        const matcher_03 = tree.filter( v => (v.token === 'numericOper' && v.matched ) )
        assert( matcher_03.length === 5  )
        const matcher_06 = tree.filter( v => (v.token === 'digits' && v.matched ) ) 
        assert( matcher_06.length === 4  )
        const matcher_07 = tree.filter( v => (v.token === 'double' && v.matched ) )
        assert( matcher_07.length === 2  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '03 - Parsing a numeric expression with an outer evalution group', 
    fn: () => {  
        const input_01 = " ( 3 + 5.0 - ( 7.55 / ( 9 * 11) ) % 13 ) "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'numListUnDelim')
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()
        const matcher_01 = tree.filter( v => (v.token === 'lparen' && v.matched ) )
        assert( matcher_01.length === 3 )
        const matcher_02 = tree.filter( v => (v.token === 'rparen' && v.matched ) )
        assert( matcher_02.length === 3  )
        const matcher_03 = tree.filter( v => (v.token === 'numericOper' && v.matched ) )
        assert( matcher_03.length === 5  )
        const matcher_06 = tree.filter( v => (v.token === 'digits' && v.matched ) ) 
        assert( matcher_06.length === 4  )
        const matcher_07 = tree.filter( v => (v.token === 'double' && v.matched ) )
        assert( matcher_07.length === 2  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '04 - Parsing a single numeric comparison expression', 
    fn: () => {  
        const input_01 = " 3 > 5.0   " 
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'compareExpr')
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()
       
        const matcher_01 = tree.filter( v => (v.token === 'compareExpr' && v.matched ) )
        assert( matcher_01.length === 1  )

        const input_02 = "7.55 <= ( 9 * 11)"
        parser.reset(input_02)
        const tree_02 = parser.getParseTree()
        const matcher_02 = tree_02.filter( v => (v.token === 'compareExpr' && v.matched ) )
        assert( matcher_02.length === 1 )

        const matcher_03 = tree_02.filter( v => (v.token === 'lparen' && v.matched === true ) )

        assert( matcher_03.length === 1 )
        const matcher_04 = tree_02.filter( v => (v.token === 'rparen' && v.matched ) )
        assert( matcher_04.length === 1  )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '05 - Parsing multiple numeric comparisons separated by logic operators', 
    fn: () => {  
        const input_01 = " 3 > 5.0  & 7.55 <= ( 9 * 11) | ( 13.0 >= 17.0)"
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'logicListUnDelim')
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()
       
        const matcher_01 = tree.filter( v => (v.token === 'compareOper' && v.matched ) )
        assert( matcher_01.length === 3  )

        const matcher_02 = tree.filter( v => (v.token === 'logicOper' && v.type === 'terminal' && v.matched ) )
        assert( matcher_02.length === 2 )

        const matcher_03 = tree.filter( v => (v.token === 'lparen' && v.matched ) )
        assert( matcher_03.length === 2 )

        const matcher_04 = tree.filter( v => (v.token === 'lparen' && v.matched ) )
        assert( matcher_04.length === 2 )
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '06 - Parsing outer comparisons group', 
    fn: () => {  
        const input_01 = " ( 3 > 5.0  & 7.55 <= ( 9 * 11) | ( 13.0 >= 17.0) ) "
        const parser = new Parser<LexerTokens, Tokens, UserData>( LR, PR, 'logicExpr')
        parser.debug = false
        parser.reset(input_01)
        const tree = parser.getParseTree()
       
        const matcher_01 = tree.filter( v => (v.token === 'compareOper' && v.matched ) )
        assert( matcher_01.length === 3  )

        const matcher_02 = tree.filter( v => (v.token === 'logicOper' && v.type === 'terminal' && v.matched ) )
        assert( matcher_02.length === 2 )

        const matcher_03 = tree.filter( v => (v.token === 'lparen' && v.matched ) )
        assert( matcher_03.length === 3 )

        const matcher_04 = tree.filter( v => (v.token === 'lparen' && v.matched ) )
        assert( matcher_04.length === 3 )

    },
    sanitizeResources: false,
    sanitizeOps: false
})