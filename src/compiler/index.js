import { parserHTML} from './parse';
import {generate} from './generate'
export function compileToFunction(template) {
  let ast = parserHTML(template);
//   console.log(ast);
  generate(ast); // 生成代码
}
