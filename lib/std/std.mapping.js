import XRegExp from  'https://deno.land/x/xregexp/src/index.js'

//
// A few simple type checking functions
//
export const isStr = (str) => {
    return ( str && typeof str === 'string' )
}

export const isNum = (num) => {
    return ( num && typeof num === 'number' )
}

export const isBool = (bool) => {
    return ( bool && typeof bool === 'boolean' )
}

export const isObj = (obj) => {
    return ( obj && typeof obj === 'object' )
}

export const isArr = (arr) => {
    return ( arr && Array.isArray(arr) )
}

export const isMap  = (map) => {
    return ( map && map instanceof Map )
}

export const isSet = (set) => {
    return ( set && set instanceof Set )
}

export const isEnum = (enumObj) => {
    return ( enumObj && enumObj instanceof Enum )
}

export const isFunc = (func) => {
    return ( func && typeof func === 'function' )
}   
//
// A few string checking functions
//
export const quotes = (str) => {
    if ( typeof str !== 'string' ) return '__undef__'
    const pattern = XRegExp('"(\\\\"|[^"])+"', 'umg') 
    const res = pattern.exec(str)
    if  ( res !== null ) {
        return 'double'
    }
    else {
        const pattern = XRegExp("'(\\\\'|[^'])+'", 'umg') 
        const res = pattern.exec(str)
        if ( res !== null ) {
            return 'Single'
        }
        else {
            const pattern = XRegExp('`[^`]*`', 'umg') 
            const res = pattern.exec(str)
            if ( res !== null ) {
                return 'Template'
            }
            else {
                return '__undef__'
            }
        }
    }
}

export const strSize = (str) => {
    if ( typeof str !== 'string' ) return 0
    return str.length
}   

