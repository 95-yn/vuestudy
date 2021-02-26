const ncName = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //标签名
const qNameCapture = `((?:${ncName}\\:)?${ncName})`; // 用来获取标签名

const startTagOpen = new RegExp(`^<${qNameCapture}`);

const endTag = new RegExp(`<\\/${qNameCapture}[^>]*>`);

const attributes = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>]+)))?/;

const startTagClose = /^\s*(\/?)>/;


export function parserHTML(html) {
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: 1,
      children: [],
      attrs,
      parent: null,
    };
  }

  let root = null,
    currentParent,
    stack = [];

  function start(tagName, attributes) {
    let element = createASTElement(tagName, attributes);
    if (!root) {
      root = element;
    }
    currentParent = element;
    stack.push(element);
    // console.log("start", tagName, attributes);
  }

  function end(tagName) {
    let element = stack.pop();
    currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
    // console.log("end", tagName);
  }

  function chars(text) {
    text = text.replace(/\s/g, "");
    if (text) {
      currentParent.children.push({
        type: 3,
        text,
      });
    }
    // console.log("chars", text);
  }

  function advance(length) {
    html = html.substring(length);
  }
  function praseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);
      let end, attr;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attributes))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length);
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    return false;
  }
  function praseEndTag() {}
  while (html) {
    let textEnd = html.indexOf("<");
    if (textEnd == 0) {
      const startTagMatch = praseStartTag(html);
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
      }
    }
    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      chars(text);
      advance(text.length);
      //   break;
    }
  }
  return root;
}
