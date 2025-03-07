// @deno-types='https://deno.land/x/xregexp/types/index.d.ts'
import XRegExp from  'https://deno.land/x/xregexp/src/index.js'
import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts"

import  { LR } from "../rules/lexer.ts"

Deno.test({
    name: '01 - Lexing an identifier string', 
    fn: () => {  
        const identifiers = ['x', 'Æblegrød', '_var', '$var', '§var', 'v_$§ar']
        for( const identifier of identifiers ) {
            const matcher: XRegExp.ExecArray | null = XRegExp.exec(identifier, LR.identifier, 0)
            assert( matcher !== null)
            assertEquals( matcher.groups?.value, identifier)
            // console.log( matcher)
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '02 - Lexer fails on bad bad identifier', 
    fn: () => {  
        const identifiers = ['%x', ' Æblegrød', ' _var']
        for( const identifier of identifiers ) {
            const matcher: XRegExp.ExecArray | null = XRegExp.exec(identifier, LR.identifier, 0, 'sticky')
            assert( matcher === null)
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '03 - Lexer follows position and the sticky flag', 
    fn: () => {  
        const identifiers = ['  Æblegrød',  '  _var', '  $var', '  §var', '  v_$§ar']
        for( const identifier of identifiers ) {
            const matcher: XRegExp.ExecArray | null = XRegExp.exec(identifier, LR.identifier, 2, 'sticky')
            assert( matcher !== null)
            const ident = identifier.trim()
            assertEquals( matcher.groups?.value, ident)
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '04 - Lexer matches whitespace', 
    fn: () => {  
        const whitespace = ['  ',  '       ', ' \t', ' \t\t', ' \t\t\t']
        for( const ws of whitespace ) {
            const matcher: XRegExp.ExecArray | null = XRegExp.exec(ws, LR.WS , 0, 'sticky')
            assert( matcher !== null)
            assertEquals( matcher.groups?.value, ws)
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '05 - Lexer matches linebreaks', 
    fn: () => {  
        const lineBreaks = ['\n',  '\r\n', '\r\n\r', `
            `, `
\r\n` ]
        for( const nl of lineBreaks ) {
            const matcher: XRegExp.ExecArray | null = XRegExp.exec(nl, LR.NL , 0, 'sticky')
            assert( matcher !== null)
            assertEquals( matcher.groups?.value, nl.replace(/[ \t]*$/g, ''))
        }
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '06 - Lexer matches doubleQuoted string with escapes', 
    fn: () => {  
        let str  = '"hello world"'
        let matcher: XRegExp.ExecArray | null = XRegExp.exec(str, LR.doubleQuoted , 0, 'sticky')
        assert( matcher !== null)
        // console.log( matcher)
        // assertEquals( matcher.groups?.token, 'doubleQuoted')
        assertEquals( matcher.groups?.value, str.substring(1, str.length-1) ) 

        str  = '"hello \\"world\\""'
        matcher = XRegExp.exec(str, LR.doubleQuoted , 0, 'sticky')
        assert( matcher !== null)
        // console.log( matcher)
        // assertEquals( matcher.groups?.token, 'doubleQuoted')
        assertEquals( matcher.groups?.value, str.substring(1, str.length-1) ) 
    },
    sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
    name: '07 - Lexer matches singleQuoted string with escapes', 
    fn: () => {  
        let str  = "'hello world'"
        let matcher: XRegExp.ExecArray | null = XRegExp.exec(str, LR.singleQuoted , 0, 'sticky')
        assert( matcher !== null)
        // console.log( matcher)
        // assertEquals( matcher.groups?.token, "singleQuoted")
        assertEquals( matcher.groups?.value, str.substring(1, str.length-1) ) 

        str  = "'hello \\'world\\''"
        matcher = XRegExp.exec(str, LR.singleQuoted , 0, 'sticky')
        assert( matcher !== null)
        // console.log( matcher)
        // assertEquals( matcher.groups?.token, "singleQuoted")
        assertEquals( matcher.groups?.value, str.substring(1, str.length-1) ) 
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '08 - Lexer matches tmplQuoted string with escapes', 
    fn: () => {  
        let str  = "`hello ${brave_new} world`"
        let matcher: XRegExp.ExecArray | null = XRegExp.exec(str, LR.tmplQuoted , 0, 'sticky')
        assert( matcher !== null)
        // console.log( matcher)
        // assertEquals( matcher.groups?.token, "singleQuoted")
        assertEquals( matcher.groups?.value, str.substring(1, str.length-1) ) 

        str  = "`hello \\`world\\``"
        matcher = XRegExp.exec(str, LR.tmplQuoted , 0, 'sticky')
        assert( matcher !== null)
        // console.log( matcher)
        // assertEquals( matcher.groups?.token, "singleQuoted")
        assertEquals( matcher.groups?.value, str.substring(1, str.length-1) ) 
    },
    sanitizeResources: false,
    sanitizeOps: false
})

Deno.test({
    name: '08 - Lexer matches regex', 
    fn: () => {  
        const str  = '/[A-z]+]/'
        const matcher: XRegExp.ExecArray | null = XRegExp.exec(str, LR.regex , 0, 'sticky')
        assert( matcher !== null)
        // console.log( matcher)
        // assertEquals( matcher.groups?.token, "singleQuoted")
        assertEquals( matcher.groups?.value, str ) 
    },
    sanitizeResources: false,
    sanitizeOps: false
})