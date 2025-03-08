// @deno-types='https://deno.land/x/xregexp/types/index.d.ts'
import XRegExp from  'https://deno.land/x/xregexp/src/index.js'
import { MatchRecordExt } from '../../parlexa/types.ts';
import { UserData } from './rules.ts';

export const LR = {
    NL:             XRegExp('(?<value>[\\n\\r]+)', 'ug'), 
    WS:             XRegExp('(?<value>[ \\t]+)', 'ug'),
    commaNL:        XRegExp('(?<value>,[ \\t]*[\\n\\r]+)', 'ug'),
    // comment:    XRegExp('//.*|/\\*[^]*?\\*/', 'xuig'),
    listEntry:      XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?=[ \t]*,)', 'xuig'),
    identifier:     XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)', 'xuig'),
    reference:     XRegExp('(?<value>\\.[\\p{L}_$§][\\p{L}0-9\\-_$§]*)', 'xuig'),
    // assignIdent:    XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?=[ \t]*:)', 'xuig'),
    funcIdent:      XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?=[ \t]*\.)', 'xuig'),
    funcName:       XRegExp('(?<value>[\\p{L}_$§][\\p{L}0-9\\-_$§]*)(?!=[ \t]*[:\.])', 'xuig'),
    colon:          {
        match: XRegExp('(?<value>:[\t ]*#{0,1})', 'ug'),
        cb: ( m: MatchRecordExt<string>, _u: UserData ) => { 
            m.private = (m.value as string).endsWith('#') ? true : false
        }
    },
    comma:          XRegExp('(?<value>,)', 'ug'),
    dot:            XRegExp('(?<value>\\.)', 'ug'),
    semicolon:      XRegExp('(?<value>;)', 'ug'),
    lparen:         XRegExp('(?<value>\\()', 'ug'),
    rparen:         XRegExp('(?<value>\\))', 'ug'),
    paranStrap:     XRegExp('(?<value>\\(\\)\\.)', 'ug'),
    lbrace:         XRegExp('(?<value>\\{)', 'ug'),
    rbrace:         XRegExp('(?<value>\\})', 'ug'),
    braceStrap:     XRegExp('(?<value>\\{\\}\\.)', 'ug'),
    lbracket:       XRegExp('(?<value>\\[)', 'ug'),
    doubleQuoted:   XRegExp('"(?<value>(\\\\"|[^"])+)"', 'umg'),
    // doubleQStrap:   XRegExp('(?<value>(""\\.', 'umg'),
    singleQuoted:   XRegExp("'(?<value>(\\\\'|[^'])+)'", 'umg'),
    // singleQStrap:   XRegExp('(?<value>(\'\'\\.)', 'umg'),
    tmplQuoted:     XRegExp("`(?<value>(\\\\`|[^`])+)`", 'umg'),
    // tmplQStrap:     XRegExp('(?<value>(``\\.)', 'umg'),
    digits:         XRegExp('(?<value>\\d+)', 'ug'),
    double:         XRegExp('(?<value>\\d+\\.\\d+)', 'ug'), 
    rbracket:       XRegExp('(?<value>\\])', 'ug'),
    modifier:       XRegExp('(?<value>var|const|type)', 'ug'),
    logic:          XRegExp('(?<value>\\||&|!|\\^)', 'ug'),
    regex:          XRegExp('(?<value>\\/[^\\/]+\\/)', 'ug'),
    regexOper:      XRegExp('(?<value>=~)', 'ug'),  
    logicAnd:       XRegExp('(?<value>&)', 'ug'),
    // numericOper:    XRegExp('(?<value>\\+=\\+|-=|-|\\*=\\*|\\/=|\\/|%=|%)', 'ug'),
    numericOper:    XRegExp('(?<value>\\+|-|\\*|\\/|%)(?!>)', 'ug'),
    compare:        XRegExp('(?<value>!=|<=|>=|=|>(?!>))', 'ug'),
    compLT:         XRegExp('(?<value><(?!-))', 'ug'),
    strPlusOper:    XRegExp('(?<value>\\+)', 'ug'),
    bool:           XRegExp('(?<value>true|false)', 'ug'),  
    chain:          XRegExp('(?<value>->)', 'ug'),
    return:         XRegExp('(?<value><-)', 'ug'),
    passBack:       XRegExp('(?<value><V)', 'ug'),
    passBackType:   XRegExp('(?<value><T )', 'ug'),
    publish:        XRegExp('(?<value>=>)', 'ug'),  
    comment:        XRegExp('(?<value>\\/\\/.*)', 'ug'),
    commentStart :  XRegExp('(?<value>\\/\\*)', 'ug'),
    commentEnd :    XRegExp('(?<value>\\*\\/)', 'ug'),
    // numOperator:    XRegExp('(?<value>\\+|-|\\*|\\/|%)', 'ug'),
    // number: XRegExp('\\d+'),
    // string: XRegExp('"(?:[^"\\\\]|\\\\.)*"'), 
    // operator: XRegExp('\\+|\\-|\\*|\\/|\\^|\\=|\\!|\\?|\\:|\\<|\\>|\\&|\\||\\%|\\~|\\@|\\#|\\$|\\`|\\.|\\,|\\;|\\(|\\)|\\[|\\]|\\{|\\}|\\'),
    // keyword: XRegExp('(?:if|else|while|for|break|continue|return|function|var|let|const|class|extends|super|new|this|true|false|null|undefined|void|typeof|instanceof|in|delete|import|export|default|from|as|try|catch|finally|throw|switch|case|default|yield|await|async|get|set|static|public|private|protected|interface|implements|package|protected|abstract|final|synchronized|transient|volatile|native|throws|extends|module|namespace|export|require|module|global|declare|type
};

