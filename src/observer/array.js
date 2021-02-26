const oldArrayPrototype = Array.prototype;
export const arrayMethods = Object.create(Array.prototype);

let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'reverse',
    'sort',
    'splice'
];

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log('数组发生变化');
        let inserted;
        let ob = this.__ob__;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if(inserted) {
            ob.observeArray(inserted)
        }
        oldArrayPrototype[method].call(this,...args);
    }
})