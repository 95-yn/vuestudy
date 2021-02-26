import { isObject } from '../utils'
import { arrayMethods } from './array'


class Observer{
    constructor(data) { // 对对象中的所有属性进行劫持

        Object.defineProperty(data,'__ob__',{
            value:this,
            enumerable:false // 不可枚举的
        })
        if(Array.isArray(data)) {
            data.__proto__ = arrayMethods;
            this.observeArray(data);
        } else {
            this.walk(data)
        }
        

    }
    observeArray(data) {
        data.forEach(item => {
            observe(item);
        })
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data,key,data[key]);
        })
    }
}
// vue2对对象进行遍历，每个属性用defineProperty进行定义   性能差
function defineReactive(data,key,value) {
    observe(value);
    Object.defineProperty(data,key, {
        get() {
            console.log(value);
            return value;
        },
        set(newV) {
            observe(newV);
            value = newV;
        }
    })
}
// push pop shift unshift reserve sort splice

export function observe(data) {
    // 如果是对象才观测
    if(!isObject(data)) {
        return
    }
    if(data.__ob__) {
        return;
    }
    return new Observer(data);
}