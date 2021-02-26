
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function getProps(attrs) {
    let str = '';
    for(let i = 0;i< attrs.length;i++) {
        let attr = attrs[i];
        if(attr.name === 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key,value] =  item.split(':');
                obj[key] = value;
            })
        } 
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    } 
    return `{${str.slice(0,-1)}}`;
}

function genChildren(el) {
    const children = el. children;
    if(children) {
        return children.map(child =>gen(child)).join(',');
    }
}

function gen(node) {
    if(node.type === 1) {
        return generate(node)
    } else {
        let text = node.text;
        if(defaultTagRE.test(text)) {
            let tokens = [];
            let match;
            let index = 0;
            let lastIndex = defaultTagRE.lastIndex = 0;
            console.log(defaultTagRE.exec(text))
            while((match = defaultTagRE.exec(text))) {
                index = match.index;
                console.log(index,defaultTagRE.lastIndex,match)
                // debugger
                if(index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex,index)));
                }
                tokens.push(`_s${match[1].trim()}`);
                lastIndex = index + match[0].length
            }
            if(lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex,text.length)));
            }
            return `_v(${tokens.join('+')})`;
        }else {
            console.log(text)
            return `_v(${JSON.stringify(text)})`
        }
    }
    console.log(node)
}

export function generate(el) {
    let children = genChildren(el);
    let code = `_c('${el.tag}',${
        el.attrs.length ? getProps(el.attrs): 'undefined'
    } ${
        children ? (',' + children): ''
    })`
    console.log(code)
    return code;
}