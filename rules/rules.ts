import { MatchRecordExt, ParserRules } from "../../parlexa/types.ts";
import { indent } from "../../parlexa/util.ts";
import { LR } from "./lexer.ts";
//
// User defined group-tokens for this set of parser rules
//

export const tokensArray = [
    // Whitespace 
    'always',
    'reset', 
    'eol',
    'comment',
    // Variable Declaration
    'identRef',
    'identDeclLHS',
    'identAliasList',
    'identDeclRHS',
    'identAssignList',
    'identTextDesc',
    'identAssign',
    'identNumUpd',
    // Objects
    'objectEmpty',
    'objectDecl',
    'objectBraced',
    'objectItem',  
    'objectItemList',
    'funcDecl',
    // Lists    
    'listEntry',
    'listItem',
    'listUnDelim',
    'listDelim',
    'list',
    // Number operations
    'numListEntry',
    'numListItem',
    'numListUnDelim',
    'numListDelim',
    'numCalculation',
    // Compare
    'compareItem',
    'compareExpr',
    // Logic operations
    'logicListEntry',
    'logicListItem',
    'logicListUnDelim',
    'logicListDelim',
    'logicExpr',
    // Function
    'depsItem',
    'funcArgs',
    'funcArgsNamed',
    'funcDeps',
    // 'exprList',
    'funcStmt',
    'funcBody',
    'funcReturn',
    'funcCall',
    // Iterators
    'collection',
    'iterator',
    // Constants
    'quotedString',
    'number',
    'constant',
    // Meta tags
    'declaration',
    'expression',
  

    /*

  ,
    'argument',
    'extraArgs',
        */
    // 'numericLhs',
    // 'numericRhs',
    // 'stringLhs',
    // 'stringExpr',
    // 'numericExpr',
    // 'evalGroup',
    /*
    'assignment',
    'multiInit',
    'assignment',

    'objectDecl',
    'objectEmpty',
  
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
    */
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
    eol: {  
        multi: '1:1', 
        expect: [
            [ LR.semicolon, '1:1', 'xor'],
            [ LR.NL, '1:1']
        ]
    },
    always: {
        multi: '0:m',  
        expect: [
            [ LR.WS , '1:1', 'ignore', 'or'],
            [ LR.NL, '1:1', 'or'],
            [ LR.comment, '1:1'],
        ]
    },
    reset: {
        multi: '1:m',
        expect: [
            // [ 'assignSingle', '1:m' ],
            [ 'always', '1:1'],
        ]
    },
     //
    // Constants
    // 
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
    //
    // Identifiers
    //
    identRef: {
        multi: '1:1',
        expect: [
            [ LR.pathPrefix, '0:m'],
            [ LR.doubleDot, '0:1'],
            [ LR.identDotted, '1:1', 'xor'],
            [ LR.identName, '1:1']
        ]
    },
    //
    // Identifier declaration
    //
    identDeclLHS: {
        multi: '1:1',
        expect: [
            [ LR.privat, '0:1'],
            [ LR.identName, '1:1'],
            [ 'identAliasList', '0:m' ],   
            [ LR.colon, '1:1', 'xor'], 
            [ LR.tilde, '0:1'],
        ]
    },
    identTextDesc: {
        multi: '1:1',       
        expect: [
            [ LR.comma, '1:1'], 
            [ 'quotedString', '1:1']   
        ]   
    },
    identAliasList: {
        multi: '1:1',       
        expect: [
            [ LR.comma, '1:1'], 
            [ LR.identName, '1:1'],
            [ 'identAliasList', '0:m'], 
            [ 'identTextDesc', '0:m' ]    
        ]   
    },
    identDeclRHS: {
        multi: '1:1',
        expect: [
            [ 'constant', '1:1', 'xor'],
            [ LR.listEmpty, '1:1', 'xor'],
            [ 'listDelim', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'funcCall', '1:1', 'xor'],
            [ 'listUnDelim', '1:1', 'xor'],
            [ 'identRef', '1:1'],
        ]               
    },
    identAssign: {
        multi: '1:1',
        expect: [
            ['identDeclLHS', '1:1'],
            ['identDeclRHS', '1:1']
        ]
    },
    identNumUpd: {
        multi: '1:1',
        expect: [
            [ 'identRef', '1:1', 'xor'],
            [ 'collection', '1:1' ],
            [ LR.numericUpd, '0:1'],
            [ 'numCalculation', '1:1', 'xor' ],
            [ 'number', '1:1' ],
        ]
    },
    //
    // objects
    //
    objectItemList: {   
        multi: '1:1',
        breakOn: [LR.rbrace],
        expect: [
            [ LR.comma, '1:1', 'or'],
            [  'eol', '1:m'],
            [ 'objectItem', '0:m']
        ]
    },  
    objectItem: {    
        multi: '1:1',
        expect: [
            [ 'identDeclLHS', '1:1'],
            [ 'identDeclRHS', '1:1'],
            [ 'objectItemList', '0:m']
        ]
    },  
    objectBraced: {
        multi: '1:1',
        expect: [
            [ LR.lbrace, '1:1'],
            [ 'objectItem', '0:m'],
            [ LR.comma, '0:1'], // optional comma at the very end
            [ LR.rbrace, '1:1'] 
        ]   
    }, 
    objectDecl: {
        multi: '1:1',
        expect: [
            [ LR.objectEmpty, '1:1', 'xor'],
            [ 'objectBraced', '1:1']
        ]   
    },
    
    
    //
    // Lists
    //
    listEntry: {
        multi: '1:1',
        expect: [
            [ 'constant', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'listDelim', '1:1', 'xor'],
            [ 'identRef', '1:1'],
        ]               
    },
    listItem: {
        expect: [
            [ LR.comma, '1:1'],
            [ 'listEntry', '1:1'],
            [ 'listItem', '0:m']
        ]   
    },

    listUnDelim: {   
        multi: '1:1',
        expect: [      
            [ 'listEntry', '1:1'],
            [ 'listItem', '0:m'],   
        ]
    },

    listDelim: {
        multi: '1:1',
        expect: [
            [ LR.lbracket, '1:1'],
            [ 'listUnDelim', '1:1'],
            [ LR.comma, '0:1'], // optional comma at the very end
            [ LR.rbracket, '1:1']       
        ]
    },

    list: {
        multi: '1:1',
        expect: [
            [ LR.listEmpty, '1:1', 'xor'],
            [ 'listDelim', '1:1',  'xor'],
            [ 'listUnDelim', '1:1']
        ]   
    },
    //
    // Meta concepts
    //
    declaration: {
        multi: '1:1',   
        expect: [
            [ 'listDelim', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            [ 'funcDecl', '1:1'],
        ]
    },
    /*
    expression: {
        multi: '1:1',      
        expect: [
            [ 'numericExpr', '1:1', 'xor'],
            [ 'stringExpr', '1:1', 'xor'],
            [ 'numCompExpr', '1:1', 'xor'],
            // [ 'funcCall', '1:1' ]
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
      */ 
    // 
    // Expressions
    //
  
    expression: {
        multi: '1:1',      
        expect: [
            [ 'list', '1:1', 'xor'],
            [ 'logicExpr', '1:1', 'xor'],
            // [ 'stringExpr', '1:1', 'xor'],
            // [ 'numCompExpr', '1:1', 'xor'],
            [ 'funcCall', '1:1',  'xor'],
            [  'identRef', '1:1', 'xor'],
            [ 'numListUnDelim', '1:1'],
        ]
    },
  
    //
    // Functions
    //
  
    funcCall: {
        multi: '1:1',
        expect: [
            [ 'identRef', '1:1'],
            [ 'identDeclRHS', '0:1'],
        ]
    },
    funcStmt: {
        multi: '1:1',
        expect: [
            [ 'identAssign', '1:1', 'xor'],
            [ 'iterator', '1:1', 'xor'],
            [ 'funcReturn', '1:1', 'xor'],
            [ 'funcBody' , '1:1' ],   
        ]
    },
    funcReturn: {
        multi: '1:1',
        expect: [
            [ LR.return, '1:1'],
            [ 'expression', '1:1', 'xor'],
            [ 'identRef', '1:1' ],   
        ]
    },
    funcArgsNamed: {
        multi: '0:m',
        expect: [
            [ LR.chainArgs, '1:1'],
            ['identAssign' , '1:1']
        ]   
    },
    funcArgs: {
        multi: '1:1',
        expect: [
            [ LR.args, '1:1', 'xor'],
            [ 'funcArgsNamed', '1:1'],
            [ LR.colon, '1:1'],
            [ 'identDeclRHS']

        ]   
    },
    depsItem: {
        expect: [
            [ LR.comma, '1:1'],
            [ LR.funcName, '1:1'],
            [ 'depsItem', '0:m']
        ]   
    },
    funcDeps: {   
        multi: '1:1',
        expect: [ 
            [ LR.chainArgs, '1:1'],     
            [ LR.funcName, '1:1'],
            [ 'depsItem', '0:m'],   
        ]
    },
    funcBody: {
        multi: '1:1',
        expect: [    
            // [ LR.return , '0:1'], 
            [ LR.lparen, '1:1' ],
            [ 'funcArgs', '0:1'],
            [ 'funcDeps', '0:1'],
            [ 'funcStmt', '1:1'],
            [ LR.rparen, '1:1' ],
        ]
    },
    funcDecl: {
        multi: '1:1',
        expect: [
            // [ LR.return, '1:1'],
            [ 'funcBody', '1:1']
        ]
    },  
    //
    // Iterators
    //
    collection: {
        multi: '1:1',
        expect: [
            [ 'objectDecl', '1:1', 'xor'],
            [ 'list', '1:1', 'xor'],
            [ 'identRef', '1:1'], // could be a declaration or a function call returning/streaming a collection 
        ]               
    },
    iterator: {
        multi: '1:1',
        expect: [
            [ 'collection', '1:1'],
            [ LR.feed, '1:1'],
            [ 'funcBody', '1:1', 'xor'],
            [ 'funcCall' , '1:1'], // the values to feed from the iterator
        ]
    },
    //
    // Expressions
    //
    /*
    expression: {
        multi: '1:1',      
        expect: [
            [ 'numericExpr', '1:1', 'xor'],
            // [ 'stringExpr', '1:1', 'xor'],
            // [ 'numCompExpr', '1:1', 'xor'],
            // [ 'funcCall', '1:1' ]
        ]
    },
   */
    //
    // Numeric expressions
    // 
    numListEntry: {
        multi: '1:1',
        expect: [
            [ 'number', '1:1', 'xor'],
            [ 'identRef', '1:1', 'xor'],
            [ 'numListDelim', '1:1']
        ]   
    },
    numListItem: {
        expect: [
            [ LR.numericOper, '1:1'],
            [ 'numListEntry', '1:1'],
            [ 'numListItem', '0:m']
        ]   
    },
    numListUnDelim: {   
        multi: '1:1',
        expect: [      
            [ 'numListEntry', '1:1'],
            [ 'numListItem', '0:m'],   
        ]
    },
    numListDelim: {
        multi: '1:1',
        expect: [
            [ LR.lparen, '1:1'],
            [ 'numListUnDelim', '1:1'],
            [ LR.rparen, '1:1']       
        ]
    },
    numCalculation: {
        multi: '1:1',
        expect: [
            [ 'numListDelim', '1:1', 'xor'],
            [  'numListUnDelim', '1:1']
        ]       

    },

    //
    // Compare expressions
    // 
    compareItem: {
        multi: '1:1',
        expect: [
            [ 'number', '1:1', 'xor'],
            [ 'quotedString', '1:1', 'xor'],
            [ 'numListDelim', '1:1', 'xor'],
            // [ 'numListUnDelim', '1:1', 'xor'],
            [ 'identRef', '1:1']
        ]   
    },

    /*
    compCheck: {
        multi: '1:1',
        expect: [
            [ LR.compareOper, '1:1'],
            [ 'compareItem', '1:1'],
            [ 'compCheck', '0:m']
        ]   
    },
    */

    compareExpr: {
        multi: '1:1',
        expect: [
            [ 'compareItem', '1:1'],
            [ LR.compareOper],
            [ 'compareItem', '1:1'],
        ]       
    },
    //
    // Logic expressions
    // 
    logicListEntry: {
        multi: '1:1',
        expect: [
            [ 'compareExpr', '1:1', 'xor'],
            [ 'number', '1:1', 'xor'],
            [ 'identRef', '1:1', 'xor'],
            [ 'logicListDelim', '1:1']
        ]   
    },

    logicListItem: {
        expect: [
            [ LR.logicOper, '1:1' ],
            [ 'logicListEntry', '1:1'],
            [ 'logicListItem', '0:m']
        ]   
    },
    logicListUnDelim: {   
        multi: '1:1',
        expect: [      
            [ 'logicListEntry', '1:1'],
            [ 'logicListItem', '0:m'],   
        ]
    },
    logicListDelim: {
        multi: '1:1',
        expect: [
            [ LR.lparen, '1:1'],
            [ 'logicListUnDelim', '1:1'],
            [ LR.rparen, '1:1']       
        ]
    },
    logicExpr: {
        multi: '1:1',
        expect: [
            [ 'logicListDelim', '1:1', 'xor'],
            [ 'logicListUnDelim', '1:1'],
        ]       
    }
    /*
    numericRhs: {
        multi: '1:1',
        expect: [
            [ LR.numericOper, '1:1'],
            [ 'number', '1:1', 'xor'],
            [ 'identRef', '1:1'],
            // [ 'evalGroup', '1:1'],
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
    */
    /*
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
            [ 'evalGroup', '0:1', 'xor'],
            [ LR.rparen, '1:1'],
        ]
    },
 */

    //
    // Assigments
    //
    /*
    assignOper: {
        multi: '1:1',   
        expect: [
            [ LR.colon, '1:1', 'xor'],
            [ LR.tilde, '1:1'], 
            [ LR.privat, '0:1' ]
        ]
    },

    assignList: {    
        multi: '1:1',
        expect: [
            [ LR.comma, '1:1', 'xor'],
            ['eol', '1:1'],
            [ 'assignSingle', '1:1']
        ]
    },
    assignSingle: {
        multi: '1:m',
        expect: [
            [ 'assignOper', '1:1' ],
            [ LR.identDecl, '1:1'],         // Variable first name
            [ 'assignList', '0:1'],         // Additional names and description
            [ 'argument', '1:1'  ]          // The value to assign to the variable  
        ]
    },
    assignment: {
        multi: '1:m',
        expect: [
            [ 'assignSingle', '1:1'],
            [ 'assignList','0:m']
        ]
    },
*/ 
    /*
    //
    // Meta concepts
    //
    declaration: {
        multi: '1:1',   
        expect: [
            [ 'listDecl', '1:1', 'xor'],
            [ 'objectDecl', '1:1', 'xor'],
            // [ 'funcDecl', '1:1'],
        ]
    },
    expression: {
        multi: '1:1',      
        expect: [
            [ 'numericExpr', '1:1', 'xor'],
            [ 'stringExpr', '1:1', 'xor'],
            [ 'numCompExpr', '1:1', 'xor'],
            // [ 'funcCall', '1:1' ]
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
    //
    // Assigments
    //
    assignOper: {
        multi: '1:1',   
        expect: [
            [ LR.colon, '1:1', 'xor'],
            [ LR.tilde, '1:1'], 
            [ LR.privat, '0:1' ]
        ]
    },

    assignList: {    
        multi: '1:1',
        expect: [
            [ LR.comma, '1:1', 'xor'],
            ['eol', '1:1'],
            [ 'assignSingle', '1:1']
        ]
    },
    assignSingle: {
        multi: '1:m',
        expect: [
            [ 'assignOper', '1:1' ],
            [ LR.declIdent, '1:1'],         // Variable first name
            [ 'assignList', '0:1'],         // Additional names and description
            [ 'argument', '1:1'  ]          // The value to assign to the variable  
        ]
    },
    assignment: {
        multi: '1:m',
        expect: [
            [ 'assignSingle', '1:1'],
            [ 'assignList','0:m']
        ]
    },
    //
    // Constants
    // 
    quotedString: {
        expect: [
            [LR.doubleQuoted, '1:1', 'xor'],
            [LR.singleQuoted, '1:1', 'xor' ],
            [LR.tmplQuoted, '1:1']
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
    // Lists
    //  
    listDecl: {
        multi: '1:1',
        expect: [
            [ 'listDelim', '1:1', 'xor'],
            [ 'listEmpty', '1:1']
        ]
    },
    listItems: {
        breakOn: [LR.rbracket],
        expect: [
            [ LR.comma, '1:1'],
            [ 'assignSingle', '1:1', 'xor'],
            [ 'argument', '1:1', 'xor'],
            [ 'listDelim', '1:1'],
            [ 'listItems', '0:m']
        ]   
    },
    listDelim: {
        multi: '1:1',
        expect: [
            [ LR.lbracket, '1:1'],
           //  [ 'assignSingle', '1:1', 'xor'],
            [ 'argument', '1:1', 'xor'],
            [ 'listDelim', '1:1'],
            [ 'listItems', '0:m'],
            [ LR.rbracket, '1:1']       
        ]
    },
    listEmpty: {
        multi: '1:1',
        expect: [
            [ LR.lbracket, '1:1'],
            [ LR.rbracket, '1:1']
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
    // identifiers
    //
    
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
   
    /*
    objectEmpty: {
        multi: '1:1',
        expect: [
            [ LR.lbrace, '1:1'],
            [ LR.rbrace, '1:1']
        ]
    },
    */
    /*
    declaration: {
        multi: '1:1',   
        expect: [
            [ 'listDelim', '1:1', 'xor'],
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
            [ 'listEmpty', '1:1', 'xor'],
            [ 'objectEmpty', '1:1', 'xor'],
            [ 'listDelim', '1:1', 'xor'],
        ]   
    },

    
  
   //
   // Initializers
   //
   assignList: {    
        multi: '1:1',
        expect: [
            [ LR.comma, '1:1', 'xor'],
            ['eol', '1:1'],
            [ 'assignSingle', '1:1']
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
    assignOper: {
        multi: '1:1',   
        expect: [
            [ LR.colon, '1:1', 'xor'],
            [ LR.tilde, '1:1'], 
            [ LR.privat, '0:1' ]
        ]
    },
    assignSingle: {
        multi: '1:m',
        expect: [
            [ 'assignOper', '1:1' ],
            [ LR.declIdent, '1:1'],         // Variable first name
            [ 'assignList', '0:1'],         // Additional names and description
            [ 'argument', '1:1'  ]          // The value to assign to the variable  
        ]
    },
    assignment: {
        multi: '1:m',
        expect: [
            [ 'assignSingle', '1:1'],
            [ 'assignList','0:m']
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