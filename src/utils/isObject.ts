/* this inner function check if paramter is a js object 
 * this is used to handle values which are not objects */

const isObject = (objValue: any): boolean => {
    return ( objValue && 
        (typeof objValue === 'object') && 
        (objValue.constructor === Object) );
}

export default isObject;
