// @deno-types='https://deno.land/x/xregexp/types/index.d.ts'
import XRegExp from  'https://deno.land/x/xregexp/src/index.js'
import { MatchRecordExt } from '../../parlexa/types.ts';
import { UserData } from './rules.ts';

export const LR = {
    NL:             XRegExp('(?<value>[\\n\\r]+)', 'ug'), 
    WS:             XRegExp('(?<value>[ \\t]+)', 'ug'),
    args:        XRegExp('(?<value>args)(?=[ \t]*:)', 'ug'),
    commaNL:        XRegExp('(?<value>,[ \\t]*[\\n\\r]+)', 'ug'),

    assignOper:     XRegExp('(?<value>:)(?<mutable>~{0,1})', 'ug'),
    // comment:    XRegExp('//.*|/\\*[^]*?\\*/', 'xuig'),
    listEntry:      XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?=[ \t]*,)', 'xuig'),
    // identifier:     XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)', 'xuig'),
    //singleIdent:    XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?=[ \t]*[^\\.\\p{L}0-9\\-_$§])', 'xuig'),
    identName:      { 
        match: XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?=[ \t]*[^\\.\\p{L}0-9\\-_$§])', 'xuig'),
        cb: ( m: MatchRecordExt<string>, _u: UserData ) => { 
            m.value   = (m.value as string).trim()
        }
    },
    pathPrefix:     XRegExp('(?<value>(\\.\\./){1,})', 'ug'),
    pathIdent:      XRegExp('(?<value>([\\p{L}_$§][\\p{L}0-9\\-_$§]*/){1,})', 'xuig'),
    identDotted:    XRegExp('(?<value>([\\p{L}_$§][\\p{L}0-9\\-_$§]*\\.){1,}[\\p{L}_$§][\\p{L}0-9\\-_$§]*)', 'xuig'), 
    // fullPathIdent:  XRegExp('(?<prefix>(\\.\\./){0,}(\\.\\.){0,1})(?<path>([\\p{L}_$§][\\p{L}0-9\\-_$§]*/){1,})(?<value>([\\p{L}_$§][\\p{L}0-9\\-_$§]*/){1,}[\\p{L}_$§][\\p{L}0-9\\-_$§]*)', 'xuig'),
    // currLevel:      XRegExp('(?<value>\\./)', 'ug'),  
    prevLevels:      XRegExp('(?<value>(\\.\\.\\/){1,})', 'ug'),
    // indentRef:      XRegExp('(?<path>(\\.\\./){1,})', 'ug'),
    // slash:          XRegExp('(?<value>\\/)', 'ug'),
    // reference:     XRegExp('(?<value>\\.[\\p{L}_$§][\\p{L}0-9\\-_$§]*)', 'xuig'),
    // assignIdent:    XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?=[ \t]*:)', 'xuig'),
    funcIdent:      XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?=[ \t]*\.)', 'xuig'),
    funcName:       XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?!=[ \t]*[:\.])', 'xuig'),
    /*
    colon:          {
        match: XRegExp('(?<value>:([\t ]*(?<privat>#){0,1})', 'ug'),
        cb: ( m: MatchRecordExt<string>, _u: UserData ) => { 
            m.value   = (m.value as string).replace(/[\t ]/g, '')
            m.private = (m.value as string).endsWith('#') ? true : false
            m.value = (m.value as string).replace('#', '')
            m.mutable =  false
        }
    },
    */
    colon:  XRegExp('(?<value>:)', 'ug'),
    privat: XRegExp('(?<value>#)', 'ug'),
    /*
    tilde:          {
        match: XRegExp('(?<value>~[\t ]*#{0,1})(?!\=)', 'ug'),
        cb: ( m: MatchRecordExt<string>, _u: UserData ) => { 
            m.value   = (m.value as string).replace(/[\t ]/g, '')
            m.private = (m.value as string).endsWith('#') ? true : false
            m.mutable =  true
            m.private = (m.value as string).endsWith('#') ? true : false
        }
    },
    */
    tilde:          XRegExp('(?<value>~)', 'ug'),
    tildePlus:    XRegExp('(?<value>\\+~)', 'ug'),
    tildeMinus:   XRegExp('(?<value>-~)', 'ug'),
    tildeStar:   XRegExp('(?<value>\\*~)', 'ug'),
    tildeSlash:  XRegExp('(?<value>\\/~)', 'ug'),
    unknown:        XRegExp('(?<value>\\?)', 'ug'),
    // privat:         XRegExp('(?<value>#)', 'ug'),
    comma:          XRegExp('(?<value>,)', 'ug'),
    singleDot:      XRegExp('(?<value>\\.)(?![ \t]*\\.)', 'ug'),
    doubleDot:      XRegExp('(?<value>\\.{2})(?![ \t]*[\\.\\/])', 'ug'),
    semicolon:      XRegExp('(?<value>;)', 'ug'),
    atSign:         XRegExp('(?<value>@)', 'ug'),   
    lparen:         XRegExp('(?<value>\\()', 'ug'),
    rparen:         XRegExp('(?<value>\\))', 'ug'),
    paranStrap:     XRegExp('(?<value>\\(\\)\\.)', 'ug'),
    lbrace:         XRegExp('(?<value>\\{)', 'ug'),
    rbrace:         XRegExp('(?<value>\\})', 'ug'),
    dbrace:         XRegExp('(?<value>\\{[\t ]*\\})', 'ug'),
    objectEmpty:    XRegExp('(?<value>\\{[\t ]*\\})', 'ug'),
  
    doubleQuoted:   XRegExp('"(?<value>(\\\\"|[^"])+)"', 'umg'),
    // doubleQStrap:   XRegExp('(?<value>(""\\.', 'umg'),
    singleQuoted:   XRegExp("'(?<value>(\\\\'|[^'])+)'", 'umg'),
    // singleQStrap:   XRegExp('(?<value>(\'\'\\.)', 'umg'),
    tmplQuoted:     XRegExp("`(?<value>(\\\\`|[^`])+)`", 'umg'),
    // tmplQStrap:     XRegExp('(?<value>(``\\.)', 'umg'),
    digits:         XRegExp('(?<value>\\d+)', 'ug'),
    double:         XRegExp('(?<value>\\d+\\.\\d+)', 'ug'), 
    lbracket:       XRegExp('(?<value>\\[)', 'ug'),
    rbracket:       XRegExp('(?<value>\\])', 'ug'),
    listEmpty:      XRegExp('(?<value>\\[[\t ]*\\])', 'ug'),
    // dbracket:       XRegExp('(?<value>\\[[\t ]*\\])', 'ug'),
    // modifier:       XRegExp('(?<value>var|const|type)', 'ug'),
    logicOper:      XRegExp('(?<value>\\||&|!|\\^)', 'ug'),
    regex:          XRegExp('(?<value>\\/[^\\/]+\\/)(?![ \t]*\\.)', 'ug'),
    // regexOper:      XRegExp('(?<value>=~)', 'ug'), 
    // logicAnd:       XRegExp('(?<value>&)', 'ug'),
    // logicOr:        XRegExp('(?<value>\\|)', 'ug'),
    // logicNot:       XRegExp('(?<value>!)', 'ug'),   
    // logicXor:       XRegExp('(?<value>\\^)', 'ug'),
    // numericOper:    XRegExp('(?<value>\\+=\\+|-=|-|\\*=\\*|\\/=|\\/|%=|%)', 'ug'),
    numericOper:    XRegExp('(?<value>\\+|-|\\*|\\/|%)(?!>)', 'ug'),
    numericUpd:     XRegExp('(?<value>\\+~|-~|\\*~|\\/~|%~)', 'ug'),
    numericIncr:    XRegExp('(?<value>\\+\\+|--)', 'ug'),   
    compareOper:    XRegExp('(?<value>!=|<=|>=|=|>(?!>))', 'ug'),
    // compLT:         XRegExp('(?<value><(?!-))', 'ug'),
    strPlusOper:    XRegExp('(?<value>\\+)', 'ug'),
    bool:           XRegExp('(?<value>true|false)', 'ug'),  
    chainArgs:          XRegExp('(?<value>->)', 'ug'),
    feed:           XRegExp('(?<value>\>\>)', 'ug'),
    return:         XRegExp('(?<value><-)', 'ug'),
    // passBack:       XRegExp('(?<value><V)', 'ug'),
    // passBackType:   XRegExp('(?<value><T )', 'ug'),
    chainDeps:        XRegExp('(?<value>=>)', 'ug'),  
    comment:        XRegExp('(?<value>\\/\\/.*)', 'ug'),
   //  commentStart :  XRegExp('(?<value>\\/\\*)', 'umg'),
   //  commentEnd :    XRegExp('(?<value>\\*\\/)', 'umg'),
    // numOperator:    XRegExp('(?<value>\\+|-|\\*|\\/|%)', 'ug'),
    // number: XRegExp('\\d+'),
    // string: XRegExp('"(?:[^"\\\\]|\\\\.)*"'), 
    // operator: XRegExp('\\+|\\-|\\*|\\/|\\^|\\=|\\!|\\?|\\:|\\<|\\>|\\&|\\||\\%|\\~|\\@|\\#|\\$|\\`|\\.|\\,|\\;|\\(|\\)|\\[|\\]|\\{|\\}|\\'),
    // keyword: XRegExp('(?:if|else|while|for|break|continue|return|function|var|let|const|class|extends|super|new|this|true|false|null|undefined|void|typeof|instanceof|in|delete|import|export|default|from|as|try|catch|finally|throw|switch|case|default|yield|await|async|get|set|static|public|private|protected|interface|implements|package|protected|abstract|final|synchronized|transient|volatile|native|throws|extends|module|namespace|export|require|module|global|declare|type
};

