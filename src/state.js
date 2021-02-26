import { isFunction} from './utils'
import { observe } from './observer/index.js';
export function initState(vm) {
    console.log(vm.$options);
    const opts = vm.$options;
    if(opts.data) {
        initData(vm);
    }
    if(opts.computed) {
        
    }
    if(opts.watch) {
        
    }
}

function proxy(vm,source,key) {
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key];
        },
        set(newValue) {
            vm[source][key] =newValue;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data;

    data= vm._data = isFunction(data) ? data.call(vm) : data;

    for(let key in data) {
        proxy(vm,'_data',key);
    }

    observe(data);
}