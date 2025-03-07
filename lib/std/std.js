import XRegExp from  'https://deno.land/x/xregexp/src/index.js'


export const isStr = (str) => {
    return ( str && typeof str === 'string' )
}

export const doubleQuoted = (str) => {
    if ( typeof str !== 'string' ) return false
    const pattern = XRegExp('"(\\\\"|[^"])+"', 'umg') 
    const res = pattern.exec(str)
    return ( res !== null )
}

export const singleQuoted = (str) => {
    if ( typeof str !== 'string' ) return false
    const pattern = XRegExp("'(\\\\'|[^'])+'", 'umg') 
    const res = pattern.exec(str)
    return ( res !== null )
}       

export const tmplQuoted = (str) => {
    if ( typeof str !== 'string' ) return false
    const pattern = XRegExp('`[^`]*`', 'umg') 
    const res = pattern.exec(str)
    return ( res !== null )
}