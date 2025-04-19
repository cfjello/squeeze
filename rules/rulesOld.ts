import { MatchRecordExt, ParserRules } from "../../parlexa/types.ts";
import { indent } from "../../parlexa/util.ts";
import { LR } from "./lexer.ts";
//
// User defined group-tokens for this set of parser rules
//

export const tokensArray = [
    'always',
    'reset', 
    'whitespace', 
    'singleAssign',
    'assignPrefix',
    'eol',
    'quotedString',
    'number',
    'constant',
    'expression',
    'declaration',
    'argument',
    'extraArgs',
    'delimList',
    'emptyList',
    'emptyObject',
    // 'namedArg',
    'undelimList',
    'listItems',
    'numericLhs',
    'numericRhs',
    'stringLhs',
    'stringExpr',
    'numericExpr',
    'evalGroup',
    'numCompArgs',
    'numCompGroup',
    'numCompExpr',
    'logic', 
    'assignList',
    'assignListEnt',
    'singleAssign',
    'extraAssign',
    'identList',
    'identRef',
    'assignment',
    'multiInit',
    'assignment',
    'lhsList',
    'lhs',
    'rhs',
    'objectDecl',
    'iterator',
    'funcDecl',
    'funcCall',
    'extCallMapping',  
    //'funcCallOrDecl',
    'callChain',
    'funcArgs',
    'funcBody',
    'singleFuncStmt',
    'statement',
    'extraArgs',
    'func',
    'scope',
    'funcReturn',
    'pathFull',
] as const 

export type ParserTokens = typeof tokensArray[number]

// ParserRules groups (key tokens below) are typed as the combination of the user defined  
// ParserTokens (above) and the LexerRules instanse (LR) keys

// User defined data for this parser and testing
export type UserData = { 
    comment: string, 
}  

export type LexerTokens = keyof typeof LR 

export type Tokens = LexerTokens | ParserTokens 
// 
export const PR: ParserRules<Tokens, UserData> = {
    always: {
        multi: '0:m',  
        expect: [
            [ LR.WS , '1:1', 'ignore', 'xor'],
            [ LR.NL, '1:1']
        ]
    },
    reset: {
        multi: '1:m',
        expect: [
            [ 'singleAssign', '1:m' ],

        ]
    },
    eol: {  
        multi: '1:1', 
        expect: [
            [ LR.semicolon, '1:1', 'xor'],
            [ LR.NL, '1:1']
        ]
    },
    quotedString: {
        expect: [
            [LR.doubleQuoted, '1:1', 'xor'],
            [LR.singleQuoted, '1:1', 'xor' ],
            [LR.tmplQuoted, '1:1']
        ]
    },
    number: {  
        multi: '1:1', 
        expect: [ 
            [ LR.double, '1:1', 'xor'],
            [ LR.digits, '1:1']
        ]
    },
    constant: {    
        multi: '1:1', 
        expect: [ 
            [ 'quotedString' ,'1:1', 'xor'],
            [ 'number', '1:1'],
        ]
    },
    expression: {
        multi: '1:1',      
        expect: [
            [ 'numericExpr', '1:1', 'xor'],
            [ 'stringExpr', '1:1', 'xor'],
            [ 'numCompExpr', '1:1', 'xor'],
            [ 'funcCall', '1:1' ]

        ]
    },

    /*
    declaration: {
        multi: '1:1',   
        expect: [
            [ 'delimList', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'funcDecl', '1:1'],
        ]
    },
    argument: {
        multi: '1:1',
        breakOn: [LR.commaNL, LR.NL, LR.semicolon],
        expect: [
            [ 'constant', '1:1', 'xor'],
            [ 'expression', '1:1', 'xor'],
            [ 'declaration', '1:1'],
        ]
    },
    
    funcArgs: {
        multi: '0:1',
        breakOn: [LR.comma, LR.chain, LR.publish],   
        expect: [
            [ 'funcCall', '1:1' ],
            [ 'constant', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'emptyList', '1:1', 'xor'],
            [ 'emptyObject', '1:1', 'xor'],
            [ 'delimList', '1:1', 'xor'],
        ]   
    },
    listItems: {
        breakOn: [LR.rbracket],
        expect: [
            [ LR.comma, '1:1'],
            [ 'singleAssign', '1:1', 'xor'],
            [ 'argument', '1:1', 'xor'],
            [ 'delimList', '1:1'],
            [ 'listItems', '0:m']
        ]   
    },
    delimList: {
        multi: '1:1',
        expect: [
            [ LR.lbracket, '1:1'],
            [ 'singleAssign', '1:1', 'xor'],
            [ 'argument', '1:1', 'xor'],
            [ 'delimList', '1:1'],
            [ 'listItems', '0:m'],
            [ LR.rbracket, '1:1']       
        ]
    },
    emptyList: {
        multi: '1:1',
        expect: [
            [ LR.lbracket, '1:1'],
            [ LR.rbracket, '1:1']
        ]
    },
    emptyObject: {
        multi: '1:1',
        expect: [
            [ LR.lbrace, '1:1'],
            [ LR.rbrace, '1:1']
        ]
    },
    
    //
    // Numeric Calculations
    //
    numericRhs: {
        multi: '1:1',
        expect: [
            [ LR.numericOper, '1:1'],
            [ 'number', '1:1', 'xor'],
            [ 'identRef', '1:1', 'xor'],
            [ 'evalGroup', '1:1'],
            [ 'numericRhs', '0:m']
        ]     
    },
    numericLhs: {
        multi: '1:1',
        expect: [
            [ 'number', '1:1', 'xor'],
            [ 'identRef', '1:1'],
            [ 'numericRhs', '1:1'],
        ]
    },
    numericExpr: {
        breakOn: [LR.comma],
        multi: '1:1',
        expect: [
            [ 'numericLhs', '1:1', 'xor'],
            [ 'evalGroup', '1:1']
        ]
    },
    evalGroup: {
        multi: '1:1',
        expect: [
            [ LR.lparen, '1:1'],
            [ 'numericLhs', '1:1'],
            ['evalGroup', '0:1', 'xor'],
            [LR.rparen, '1:1'],
        ]
    },
    //
    // String operators
    //
    stringLhs: {
        multi: '1:1',
        expect: [
            [ LR.strPlusOper, '1:1'],
            [ 'quotedString', '1:1'],
            [ 'stringLhs', '0:m']
        ]
    },
    stringExpr: {
        multi: '1:1',
        expect: [
            [ 'quotedString', '1:1'],
            [ 'stringLhs', '1:1'],
        ]
    },
    //
    // numeric compare
    //
    numCompArgs: {
        multi: '1:1',
        expect: [
            [ 'number', '1:1', 'xor'],
            [ 'numericExpr', '1:1', 'xor'],
            [ 'evalGroup', '1:1'],
        ]
    },
    numCompGroup: {
        multi: '1:1',
        expect: [
            [ LR.lparen, '1:1'],
            [ 'numCompExpr', '1:1', 'xor'],
            ['numCompGroup', '0:1' ],
            [ LR.rparen, '1:1']
        ]
    },
    numCompExpr: {
        breakOn: [LR.comma],
        multi: '1:1',
        expect: [
            [ 'numCompArgs', '1:1', 'xor'],
            [ 'numCompGroup', '1:1'],
            [ LR.compare, '1:1', 'xor'],
            [ LR.compLT, '1:1'],
            [ 'numCompArgs', '1:1', 'xor'],
            [ 'numCompGroup', '1:1'],
            [ LR.logic, '0:1']
        ]
    },
    logic: {
        multi: '1:1',
        expect: [
            [ 'numCompExpr', '1:1']
        ]      
    },
   //
   // Initializers
   //
   extraAssign: {    
        multi: '1:1',
        expect: [
            [ LR.comma, '1:1', 'xor'],
            ['eol', '1:1'],
            [ 'singleAssign', '1:1']
        ]
    },
    assignListEnt: {    
        multi: '1:1',
        expect: [
            [ LR.comma, '1:1'],
            [ LR.singleIdent, '1:1', 'xor'],
            [ 'quotedString', '1:1' ]
        ]
    },
    assignList: {
        multi: '1:1',
            expect: [
                [ 'assignListEnt' , '1:m'],
                [ LR.colon, '1:1' ]
            ]
    },
    assignPrefix: {
        multi: '1:1',   
        expect: [
            [ LR.colon, '1:1', 'xor'],
            [ LR.tilde, '1:1'], 
            [ LR.privat, '0:1' ]
        ]
    },
    singleAssign: {
        multi: '1:m',
        expect: [
            [ 'assignPrefix', '1:1' ],
            [ LR.declIdent, '1:1'],         // Variable first name
            [ 'assignList', '0:1'],         // Additional names and description
            [ 'argument', '1:1'  ]          // The value to assign to the variable  
        ]
    },
    assignment: {
        multi: '1:m',
        expect: [
            [ 'singleAssign', '1:1'],
            [ 'extraAssign','0:m']
        ]
    },
    identifier: {
        multi: '0:m',
        expect: [
            [ LR.singleDot, '1:1'],
            [ LR.identifier, '1:1'],
        ]
    },

    // Identifier paths
    pathPrefix: {
        multi: '1:1',
        expect: [
            [ LR.pathIdent, '0:1'],
        ]   
    },

    pathFull: {
        multi: '1:1',
        expect: [
            [ LR.pathPrefix, '1:1', 'xor'],
            [ LR.doubleDot, '1:1'],
         ]
    },

    identRef: {
        multi: '1:1',
        expect: [
            [ 'pathFull', '0:1'],
            [ LR.identDotted, '1:1', 'xor'],
            [ LR.singleIdent, '1:1']
        ]
    },
    // 
    // Objects
    // 
    objectDecl: {
        multi: '1:1',
        expect: [
            [ LR.lbrace, '1:1'],
            [ 'assignment', '0:m'],
            [ LR.rbrace, '1:1'] 
        ]   
    },
    //
    // functions
    //
    declIdent: {
        multi: '1:1',
        expect: [
            [ LR.comma, '1:1'],
            [ LR.declIdent, '1:1'],
        ]
    },
    iterator: {
        multi: '1:1',
        expect: [
            [ LR.feed, '1:1'],
            [ 'identRef' , '1:1'], // the values to feed from the iterator
            // [ 'identRef', '0:1'],
            // [ LR.singleIdent, '1:3'], // all value here can be inferred -they are value, idx, key 
            [ LR.chain, '0:1'],
            [ 'funcBody', '1:1' ],
        ]
    },
    statement: {
        multi: '1:m',
        expect: [
            [ LR.return, '0:1'],
            [ 'extCallMapping', '1:1', 'xor'],
            [ 'assignment', '1:1', 'xor'],
            [ 'expression', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'funcDecl', '1:1', 'xor'],
            [ 'iterator', '1:1', 'xor'],
            [ 'funcCall', '1:1']
        ]
    },
    funcReturn: {
        multi: '1:1',
        expect: [
            [ LR.return, '1:1', 'xor'],
            [ LR.publish, '1:1']
        ]
    },
    funcBody: { 
        multi: '1:1',
        expect: [
            [ LR.lparen, '1:1'],
            [ 'statement', '1:m'],
            [ LR.rparen, '1:1'] 
        ]   
    },
    funcDecl: {
        multi: '1:1',
        expect: [
            [ LR.return, '0:1'],
            [ 'funcArgs', '0:m'],
            [ 'funcBody', '1:1'],
        ]
    },
    chain: {
        multi: '1:1',
        expect: [
            [ 'funcCall', '1:1', 'xor'] ,
            [ 'evalGroup', '1:1']  
        ]
    },
    extCallMapping: {
        multi: '1:1',
        expect: [
            [ LR.atSign, '1:1'],
            [ 'identRef', '1:1'],
            [ LR.lparen, '1:1'],
            [ LR.singleIdent, '1:1'],
            [ LR.rparen, '1:1'],
        ]
    },
    funcCall: { // The shared part of a function call and a function declaration
        multi: '1:1',
        expect: [
            [ 'identRef', '1:1', 'or'],
            [ 'funcArgs', '0:1'],
            [ LR.chain, '0:1', 'xor'],
            [ 'iterator', '0:1']
        ]
    },
    */
}