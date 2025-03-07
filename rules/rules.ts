import { ParserRules } from "../../parlexa/types.ts";
import { indent } from "../../parlexa/util.ts";
import { LR } from "./lexer.ts";
//
// User defined group-tokens for this set of parser rules
//

export const tokensArray = [
    'reset', 
    'whitespace', 
    'singleAssign',
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
    'namedArg',
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
    'assignment',
    'multiInit',
    'assignment',
    'lhsList',
    'lhs',
    'rhs',
    'objectDecl',
    'funcDecl',
    'funcCallOrDecl',
    'callChain',
    'funcArgs',
    'funcBody',
    'singleFuncStmt',
    'statement',
    'extraArgs',
    'func',
    'scope',
    'funcReturn'
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
    whitespace: {
        multi: '0:m',  
        expect: [
            [ LR.WS , '1:1', 'ignore', 'xor'],
            [ LR.NL, '1:1']
        ]
    },
    reset: {
        multi: '1:m',
        expect: [
            [ 'singleAssign', '1:m' ]
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
            [ 'funcCallOrDecl', '1:1' ]

        ]
    },
    declaration: {
        multi: '1:1',   
        expect: [
            [ 'delimList', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'funcBody', '1:1', 'xor'],
            [ 'funcCallOrDecl', '1:1'],
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
    namedArg: {
        multi: '1:1',
        expect: [
            [ LR.colon, '1:1'],
            [ LR.identifier, '1:1'],
            [ 'argument', '1:1']
        ]
    },
    funcArgs: {
        multi: '0:m',
        expect: [
            [ 'constant', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'emptyList', '1:1', 'xor'],
            [ 'delimList', '1:1', 'xor'],
            [ LR.identifier, '1:1' ],  // Just an identifier 
        ]   
    },
    listItems: {
        breakOn: [LR.rbracket],
        expect: [
            [ LR.comma, '1:1'],
            [ 'namedArg', '1:1', 'xor'],
            [ 'argument', '1:1', 'xor'],
            [ 'delimList', '1:1'],
            [ 'listItems', '0:m']
        ]   
    },
    delimList: {
        multi: '1:1',
        expect: [
            [ LR.lbracket, '1:1'],
            [ 'namedArg', '1:1', 'xor'],
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
    /*
    undelimList: {   
        multi: '1:1',
        breakOn: [LR.commaNL, LR.NL, LR.semicolon],
        expect: [
            [ 'argument', '1:1' ],
            [ 'listItems', '1:m'],
        ]
    },
    */
    //
    // Numeric Calculations
    //
    numericRhs: {
        multi: '1:1',
        expect: [
            [ LR.numericOper, '1:1'],
            [ 'number', '1:1', 'xor'],
            [ 'evalGroup', '1:1'],
            [ 'numericRhs', '0:m']
        ]     
    },
    numericLhs: {
        multi: '1:1',
        expect: [
            [ 'number', '1:1', 'xor'],
            [ 'identifier', '1:1'],
            [ 'numericRhs', '1:1'],
        ]
    },
    numericExpr: {
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
        multi: '1:1',
        expect: [
            [ 'numCompArgs', '1:1', 'xor'],
            [ 'numCompGroup', '1:1'],
            [ LR.compare, '1:1'],
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
            [ LR.identifier, '1:1', 'xor'],
            [ 'quotedString', '1:1' ]
        ]
    },

    assignList: {
        multi: '1:m',
            expect: [
                [ 'assignListEnt' , '1:m'],
                [ LR.colon, '1:1'],
            ]
    },
    singleAssign: {
        multi: '1:m',
        expect: [
            [ LR.colon, '1:1'],
            [ LR.identifier, '1:1'],
            [ 'assignList', '1:m', 'xor'],
            [ 'argument', '1:1'  ]
        ]
    },
    
    /*
    extraAssign: {
        multi: '0:m',
        expect: [
            [ LR.logicAnd, '1:1'],
            [ 'singleAssign', '1:1'],
            [ 'extraAssign', '0:m']
        ]
    },
    */
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
            [ LR.dot, '1:1'],
            [ LR.identifier, '1:1'],
        ]
    },
    /*
    funcIdent: {
        multi: '0:m',
        expect: [
            [ LR.dot, '1:1'],
            [ LR.funcIdent, '1:1'],
        ]
    },
    */
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
    /*
    func: {
    singleStmt: {
        multi: '1:1',
        expect: [
            [ 'numericExpr', '1:1', 'xor'],
            [ 'numCompExpr', '1:1', 'xor'],
            [ 'stringExpr', '1:1',  'xor'],
            // [ 'assignment', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'funcCallOrDecl', '1:1', 'xor'],
            [ 'singleAssign', '1:1'],
            [ 'funcReturn', '0:1']
        ]
    },
    */
    statement: {
        multi: '1:m',
        expect: [
            [ 'funcReturn', '0:1'],
            [ 'assignment', '1:1', 'xor'],
            [ 'expression', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'funcCallOrDecl', '1:1'],

        ]
    },
    funcReturn: {
        multi: '1:1',
        expect: [
            [ LR.passOn, '1:1', 'xor'],
            [ LR.publish, '1:1']
        ]
    },

    funcBody: { 
        multi: '1:1',
        expect: [
            [ LR.lparen, '1:1'],
            [ 'statement', '1:m'],
            // [ 'funcReturn', '0:1'],
            [ LR.rparen, '1:1'] 
        ]   
    },
    // fn: args ( body )

    /*
    funcDecl: {
        multi: '1:1',
        expect: [
            [ 'funcCallOrDecl', '1:1'],
            [ 'funcBody', '1:1']
        ]
    },
    */
    callChain: {
        multi: '1:1',
        expect: [
            [ LR.passOn, '1:1', 'xor'],
            [ LR.publish],
            [ 'funcCallOrDecl', '1:1']    
        ]
    },
    /*
    funcCall: {
        multi: '1:1',   
        expect: [
            [ 'funcCallOrDecl', '1:1'],
            [ 'callChain', '0:m']
        ]
    },
    */



    funcCallOrDecl: {
        multi: '1:1',
        expect: [
            [ LR.identifier, '1:1'],
            [ 'funcArgs', '0:m'],
            [ 'funcBody', '0:1', 'xor'],
            [ 'callChain', '0:m']
        ]
    },
    // 
    // LHS identifiers 
    // 
      /*
    lhsList: {
        multi: '0:m',
        expect: [
            [ LR.comma, '1:1'],
            [ LR.identifier, '1:1'],
            [ 'lhsList', '0:m']
        ]
    },
  
    lhs: {
        multi: '1:1',
        expect: [
            [ LR.identifier, '1:1'],
            [ 'lhsList', '0:1']
        ],
    },
    rhs: {
        multi: '1:1',
        expect: [
            [ 'argument', '1:1'],
            [ 'eol', '1:1']
        ],
    },
    extraAssigns : { 
        multi: '0:m', 
        expect: [ 
            [ 'eol', '1:1'],
            [ 'singleAssign', '1:1'],
            [ 'extraAssigns', '0:m']
        ]           
    },
    singleAssign : {    
        multi: '1:1', 
        breakOn: [LR.NL],
        expect: [ 
            [ 'lhs', '1:1'],
            [ LR.colon, '1:1'], 
            [ 'rhs', '1:1']
        ]
    },
    assignment: {
        multi: '1:1',
        expect: [
            [ LR.identifier, '1:1'],
            [ LR.colon, '1:1'],
            [ 'rhs', '1:1'],
            [ 'extraAssigns', '0:m'],
        ]
    },
    */
    /*
    scope: {
        multi: '1:1',
        expect: [
            [ LR.lbrace, '1:1'],
            [ LR.NL, '0:m'],
            [ 'assignment', '1:m'],
            [ LR.rbrace, '1:1'],
            [LR.NL, '0:m'],
        ]
    },  
    */
    /*
    arg: {
        multi: '1:1',
        expect: [
            [ 'assignment', '1:1', 'xor'],
            [ LR.identifier, '1:1']     
        ]
    },
    extraArgs: {    
        multi: '0:m', 
        expect: [
            [ LR.comma, '1:1'],
            [ LR.identifier, '1:1'],
            [ 'extraArgs', '0:m']
        ]
    },
    funcArgs: {
        multi: '0:m',
        expect: [
            [ LR.identifier, '1:1'], 
            [ 'extraArgs', '0:m']
        ]
    },  

    */
   
}