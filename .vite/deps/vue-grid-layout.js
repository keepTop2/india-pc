import {
  EMPTY_OBJ,
  NO,
  NOOP,
  PatchFlagNames,
  camelize,
  capitalize,
  extend,
  generateCodeFrame,
  init_runtime_dom_esm_bundler,
  init_shared_esm_bundler,
  isArray,
  isBuiltInDirective,
  isHTMLTag,
  isMathMLTag,
  isObject,
  isOn,
  isReservedProp,
  isSVGTag,
  isString,
  isSymbol,
  isVoidTag,
  makeMap,
  parseStringStyle,
  runtime_dom_esm_bundler_exports,
  shared_esm_bundler_exports,
  slotFlagsText,
  toHandlerKey
} from "./chunk-63GWLB4N.js";
import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS
} from "./chunk-ROME4SDB.js";

// node_modules/@vue/compiler-core/dist/compiler-core.esm-bundler.js
function registerRuntimeHelpers(helpers) {
  Object.getOwnPropertySymbols(helpers).forEach((s) => {
    helperNameMap[s] = helpers[s];
  });
}
function createRoot(children, source = "") {
  return {
    type: 0,
    source,
    children,
    helpers: /* @__PURE__ */ new Set(),
    components: [],
    directives: [],
    hoists: [],
    imports: [],
    cached: 0,
    temps: 0,
    codegenNode: void 0,
    loc: locStub
  };
}
function createVNodeCall(context, tag, props, children, patchFlag, dynamicProps, directives, isBlock = false, disableTracking = false, isComponent2 = false, loc = locStub) {
  if (context) {
    if (isBlock) {
      context.helper(OPEN_BLOCK);
      context.helper(getVNodeBlockHelper(context.inSSR, isComponent2));
    } else {
      context.helper(getVNodeHelper(context.inSSR, isComponent2));
    }
    if (directives) {
      context.helper(WITH_DIRECTIVES);
    }
  }
  return {
    type: 13,
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock,
    disableTracking,
    isComponent: isComponent2,
    loc
  };
}
function createArrayExpression(elements, loc = locStub) {
  return {
    type: 17,
    loc,
    elements
  };
}
function createObjectExpression(properties, loc = locStub) {
  return {
    type: 15,
    loc,
    properties
  };
}
function createObjectProperty(key, value) {
  return {
    type: 16,
    loc: locStub,
    key: isString(key) ? createSimpleExpression(key, true) : key,
    value
  };
}
function createSimpleExpression(content, isStatic = false, loc = locStub, constType = 0) {
  return {
    type: 4,
    loc,
    content,
    isStatic,
    constType: isStatic ? 3 : constType
  };
}
function createInterpolation(content, loc) {
  return {
    type: 5,
    loc,
    content: isString(content) ? createSimpleExpression(content, false, loc) : content
  };
}
function createCompoundExpression(children, loc = locStub) {
  return {
    type: 8,
    loc,
    children
  };
}
function createCallExpression(callee, args = [], loc = locStub) {
  return {
    type: 14,
    loc,
    callee,
    arguments: args
  };
}
function createFunctionExpression(params, returns = void 0, newline = false, isSlot = false, loc = locStub) {
  return {
    type: 18,
    params,
    returns,
    newline,
    isSlot,
    loc
  };
}
function createConditionalExpression(test, consequent, alternate, newline = true) {
  return {
    type: 19,
    test,
    consequent,
    alternate,
    newline,
    loc: locStub
  };
}
function createCacheExpression(index, value, isVNode = false) {
  return {
    type: 20,
    index,
    value,
    isVNode,
    loc: locStub
  };
}
function createBlockStatement(body) {
  return {
    type: 21,
    body,
    loc: locStub
  };
}
function createTemplateLiteral(elements) {
  return {
    type: 22,
    elements,
    loc: locStub
  };
}
function createIfStatement(test, consequent, alternate) {
  return {
    type: 23,
    test,
    consequent,
    alternate,
    loc: locStub
  };
}
function createAssignmentExpression(left, right) {
  return {
    type: 24,
    left,
    right,
    loc: locStub
  };
}
function createSequenceExpression(expressions) {
  return {
    type: 25,
    expressions,
    loc: locStub
  };
}
function createReturnStatement(returns) {
  return {
    type: 26,
    returns,
    loc: locStub
  };
}
function getVNodeHelper(ssr, isComponent2) {
  return ssr || isComponent2 ? CREATE_VNODE : CREATE_ELEMENT_VNODE;
}
function getVNodeBlockHelper(ssr, isComponent2) {
  return ssr || isComponent2 ? CREATE_BLOCK : CREATE_ELEMENT_BLOCK;
}
function convertToBlock(node, { helper, removeHelper, inSSR }) {
  if (!node.isBlock) {
    node.isBlock = true;
    removeHelper(getVNodeHelper(inSSR, node.isComponent));
    helper(OPEN_BLOCK);
    helper(getVNodeBlockHelper(inSSR, node.isComponent));
  }
}
function isTagStartChar(c) {
  return c >= 97 && c <= 122 || c >= 65 && c <= 90;
}
function isWhitespace(c) {
  return c === 32 || c === 10 || c === 9 || c === 12 || c === 13;
}
function isEndOfTagSection(c) {
  return c === 47 || c === 62 || isWhitespace(c);
}
function toCharCodes(str) {
  const ret = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i);
  }
  return ret;
}
function getCompatValue(key, { compatConfig }) {
  const value = compatConfig && compatConfig[key];
  if (key === "MODE") {
    return value || 3;
  } else {
    return value;
  }
}
function isCompatEnabled(key, context) {
  const mode = getCompatValue("MODE", context);
  const value = getCompatValue(key, context);
  return mode === 3 ? value === true : value !== false;
}
function checkCompatEnabled(key, context, loc, ...args) {
  const enabled = isCompatEnabled(key, context);
  if (enabled) {
    warnDeprecation(key, context, loc, ...args);
  }
  return enabled;
}
function warnDeprecation(key, context, loc, ...args) {
  const val = getCompatValue(key, context);
  if (val === "suppress-warning") {
    return;
  }
  const { message, link } = deprecationData[key];
  const msg = `(deprecation ${key}) ${typeof message === "function" ? message(...args) : message}${link ? `
  Details: ${link}` : ``}`;
  const err = new SyntaxError(msg);
  err.code = key;
  if (loc)
    err.loc = loc;
  context.onWarn(err);
}
function defaultOnError(error) {
  throw error;
}
function defaultOnWarn(msg) {
  console.warn(`[Vue warn] ${msg.message}`);
}
function createCompilerError(code, loc, messages, additionalMessage) {
  const msg = true ? (messages || errorMessages)[code] + (additionalMessage || ``) : `https://vuejs.org/error-reference/#compiler-${code}`;
  const error = new SyntaxError(String(msg));
  error.code = code;
  error.loc = loc;
  return error;
}
function walkIdentifiers(root, onIdentifier, includeAll = false, parentStack = [], knownIds = /* @__PURE__ */ Object.create(null)) {
  {
    return;
  }
}
function isReferencedIdentifier(id, parent, parentStack) {
  {
    return false;
  }
}
function isInDestructureAssignment(parent, parentStack) {
  if (parent && (parent.type === "ObjectProperty" || parent.type === "ArrayPattern")) {
    let i = parentStack.length;
    while (i--) {
      const p = parentStack[i];
      if (p.type === "AssignmentExpression") {
        return true;
      } else if (p.type !== "ObjectProperty" && !p.type.endsWith("Pattern")) {
        break;
      }
    }
  }
  return false;
}
function isInNewExpression(parentStack) {
  let i = parentStack.length;
  while (i--) {
    const p = parentStack[i];
    if (p.type === "NewExpression") {
      return true;
    } else if (p.type !== "MemberExpression") {
      break;
    }
  }
  return false;
}
function walkFunctionParams(node, onIdent) {
  for (const p of node.params) {
    for (const id of extractIdentifiers(p)) {
      onIdent(id);
    }
  }
}
function walkBlockDeclarations(block, onIdent) {
  for (const stmt of block.body) {
    if (stmt.type === "VariableDeclaration") {
      if (stmt.declare)
        continue;
      for (const decl of stmt.declarations) {
        for (const id of extractIdentifiers(decl.id)) {
          onIdent(id);
        }
      }
    } else if (stmt.type === "FunctionDeclaration" || stmt.type === "ClassDeclaration") {
      if (stmt.declare || !stmt.id)
        continue;
      onIdent(stmt.id);
    } else if (stmt.type === "ForOfStatement" || stmt.type === "ForInStatement" || stmt.type === "ForStatement") {
      const variable = stmt.type === "ForStatement" ? stmt.init : stmt.left;
      if (variable && variable.type === "VariableDeclaration") {
        for (const decl of variable.declarations) {
          for (const id of extractIdentifiers(decl.id)) {
            onIdent(id);
          }
        }
      }
    }
  }
}
function extractIdentifiers(param, nodes = []) {
  switch (param.type) {
    case "Identifier":
      nodes.push(param);
      break;
    case "MemberExpression":
      let object = param;
      while (object.type === "MemberExpression") {
        object = object.object;
      }
      nodes.push(object);
      break;
    case "ObjectPattern":
      for (const prop of param.properties) {
        if (prop.type === "RestElement") {
          extractIdentifiers(prop.argument, nodes);
        } else {
          extractIdentifiers(prop.value, nodes);
        }
      }
      break;
    case "ArrayPattern":
      param.elements.forEach((element) => {
        if (element)
          extractIdentifiers(element, nodes);
      });
      break;
    case "RestElement":
      extractIdentifiers(param.argument, nodes);
      break;
    case "AssignmentPattern":
      extractIdentifiers(param.left, nodes);
      break;
  }
  return nodes;
}
function unwrapTSNode(node) {
  if (TS_NODE_TYPES.includes(node.type)) {
    return unwrapTSNode(node.expression);
  } else {
    return node;
  }
}
function isCoreComponent(tag) {
  switch (tag) {
    case "Teleport":
    case "teleport":
      return TELEPORT;
    case "Suspense":
    case "suspense":
      return SUSPENSE;
    case "KeepAlive":
    case "keep-alive":
      return KEEP_ALIVE;
    case "BaseTransition":
    case "base-transition":
      return BASE_TRANSITION;
  }
}
function advancePositionWithClone(pos, source, numberOfCharacters = source.length) {
  return advancePositionWithMutation(
    {
      offset: pos.offset,
      line: pos.line,
      column: pos.column
    },
    source,
    numberOfCharacters
  );
}
function advancePositionWithMutation(pos, source, numberOfCharacters = source.length) {
  let linesCount = 0;
  let lastNewLinePos = -1;
  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10) {
      linesCount++;
      lastNewLinePos = i;
    }
  }
  pos.offset += numberOfCharacters;
  pos.line += linesCount;
  pos.column = lastNewLinePos === -1 ? pos.column + numberOfCharacters : numberOfCharacters - lastNewLinePos;
  return pos;
}
function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg || `unexpected compiler condition`);
  }
}
function findDir(node, name, allowEmpty = false) {
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i];
    if (p.type === 7 && (allowEmpty || p.exp) && (isString(name) ? p.name === name : name.test(p.name))) {
      return p;
    }
  }
}
function findProp(node, name, dynamicOnly = false, allowEmpty = false) {
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i];
    if (p.type === 6) {
      if (dynamicOnly)
        continue;
      if (p.name === name && (p.value || allowEmpty)) {
        return p;
      }
    } else if (p.name === "bind" && (p.exp || allowEmpty) && isStaticArgOf(p.arg, name)) {
      return p;
    }
  }
}
function isStaticArgOf(arg, name) {
  return !!(arg && isStaticExp(arg) && arg.content === name);
}
function hasDynamicKeyVBind(node) {
  return node.props.some(
    (p) => p.type === 7 && p.name === "bind" && (!p.arg || // v-bind="obj"
    p.arg.type !== 4 || // v-bind:[_ctx.foo]
    !p.arg.isStatic)
    // v-bind:[foo]
  );
}
function isText$1(node) {
  return node.type === 5 || node.type === 2;
}
function isVSlot(p) {
  return p.type === 7 && p.name === "slot";
}
function isTemplateNode(node) {
  return node.type === 1 && node.tagType === 3;
}
function isSlotOutlet(node) {
  return node.type === 1 && node.tagType === 2;
}
function getUnnormalizedProps(props, callPath = []) {
  if (props && !isString(props) && props.type === 14) {
    const callee = props.callee;
    if (!isString(callee) && propsHelperSet.has(callee)) {
      return getUnnormalizedProps(
        props.arguments[0],
        callPath.concat(props)
      );
    }
  }
  return [props, callPath];
}
function injectProp(node, prop, context) {
  let propsWithInjection;
  let props = node.type === 13 ? node.props : node.arguments[2];
  let callPath = [];
  let parentCall;
  if (props && !isString(props) && props.type === 14) {
    const ret = getUnnormalizedProps(props);
    props = ret[0];
    callPath = ret[1];
    parentCall = callPath[callPath.length - 1];
  }
  if (props == null || isString(props)) {
    propsWithInjection = createObjectExpression([prop]);
  } else if (props.type === 14) {
    const first = props.arguments[0];
    if (!isString(first) && first.type === 15) {
      if (!hasProp(prop, first)) {
        first.properties.unshift(prop);
      }
    } else {
      if (props.callee === TO_HANDLERS) {
        propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
          createObjectExpression([prop]),
          props
        ]);
      } else {
        props.arguments.unshift(createObjectExpression([prop]));
      }
    }
    !propsWithInjection && (propsWithInjection = props);
  } else if (props.type === 15) {
    if (!hasProp(prop, props)) {
      props.properties.unshift(prop);
    }
    propsWithInjection = props;
  } else {
    propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
      createObjectExpression([prop]),
      props
    ]);
    if (parentCall && parentCall.callee === GUARD_REACTIVE_PROPS) {
      parentCall = callPath[callPath.length - 2];
    }
  }
  if (node.type === 13) {
    if (parentCall) {
      parentCall.arguments[0] = propsWithInjection;
    } else {
      node.props = propsWithInjection;
    }
  } else {
    if (parentCall) {
      parentCall.arguments[0] = propsWithInjection;
    } else {
      node.arguments[2] = propsWithInjection;
    }
  }
}
function hasProp(prop, props) {
  let result = false;
  if (prop.key.type === 4) {
    const propKeyName = prop.key.content;
    result = props.properties.some(
      (p) => p.key.type === 4 && p.key.content === propKeyName
    );
  }
  return result;
}
function toValidAssetId(name, type) {
  return `_${type}_${name.replace(/[^\w]/g, (searchValue, replaceValue) => {
    return searchValue === "-" ? "_" : name.charCodeAt(replaceValue).toString();
  })}`;
}
function hasScopeRef(node, ids) {
  if (!node || Object.keys(ids).length === 0) {
    return false;
  }
  switch (node.type) {
    case 1:
      for (let i = 0; i < node.props.length; i++) {
        const p = node.props[i];
        if (p.type === 7 && (hasScopeRef(p.arg, ids) || hasScopeRef(p.exp, ids))) {
          return true;
        }
      }
      return node.children.some((c) => hasScopeRef(c, ids));
    case 11:
      if (hasScopeRef(node.source, ids)) {
        return true;
      }
      return node.children.some((c) => hasScopeRef(c, ids));
    case 9:
      return node.branches.some((b) => hasScopeRef(b, ids));
    case 10:
      if (hasScopeRef(node.condition, ids)) {
        return true;
      }
      return node.children.some((c) => hasScopeRef(c, ids));
    case 4:
      return !node.isStatic && isSimpleIdentifier(node.content) && !!ids[node.content];
    case 8:
      return node.children.some((c) => isObject(c) && hasScopeRef(c, ids));
    case 5:
    case 12:
      return hasScopeRef(node.content, ids);
    case 2:
    case 3:
      return false;
    default:
      if (true)
        ;
      return false;
  }
}
function getMemoedVNodeCall(node) {
  if (node.type === 14 && node.callee === WITH_MEMO) {
    return node.arguments[1].returns;
  } else {
    return node;
  }
}
function parseForExpression(input) {
  const loc = input.loc;
  const exp = input.content;
  const inMatch = exp.match(forAliasRE);
  if (!inMatch)
    return;
  const [, LHS, RHS] = inMatch;
  const createAliasExpression = (content, offset, asParam = false) => {
    const start = loc.start.offset + offset;
    const end = start + content.length;
    return createExp(
      content,
      false,
      getLoc(start, end),
      0,
      asParam ? 1 : 0
      /* Normal */
    );
  };
  const result = {
    source: createAliasExpression(RHS.trim(), exp.indexOf(RHS, LHS.length)),
    value: void 0,
    key: void 0,
    index: void 0,
    finalized: false
  };
  let valueContent = LHS.trim().replace(stripParensRE, "").trim();
  const trimmedOffset = LHS.indexOf(valueContent);
  const iteratorMatch = valueContent.match(forIteratorRE);
  if (iteratorMatch) {
    valueContent = valueContent.replace(forIteratorRE, "").trim();
    const keyContent = iteratorMatch[1].trim();
    let keyOffset;
    if (keyContent) {
      keyOffset = exp.indexOf(keyContent, trimmedOffset + valueContent.length);
      result.key = createAliasExpression(keyContent, keyOffset, true);
    }
    if (iteratorMatch[2]) {
      const indexContent = iteratorMatch[2].trim();
      if (indexContent) {
        result.index = createAliasExpression(
          indexContent,
          exp.indexOf(
            indexContent,
            result.key ? keyOffset + keyContent.length : trimmedOffset + valueContent.length
          ),
          true
        );
      }
    }
  }
  if (valueContent) {
    result.value = createAliasExpression(valueContent, trimmedOffset, true);
  }
  return result;
}
function getSlice(start, end) {
  return currentInput.slice(start, end);
}
function endOpenTag(end) {
  if (tokenizer.inSFCRoot) {
    currentOpenTag.innerLoc = getLoc(end + 1, end + 1);
  }
  addNode(currentOpenTag);
  const { tag, ns } = currentOpenTag;
  if (ns === 0 && currentOptions.isPreTag(tag)) {
    inPre++;
  }
  if (currentOptions.isVoidTag(tag)) {
    onCloseTag(currentOpenTag, end);
  } else {
    stack.unshift(currentOpenTag);
    if (ns === 1 || ns === 2) {
      tokenizer.inXML = true;
    }
  }
  currentOpenTag = null;
}
function onText(content, start, end) {
  {
    const tag = stack[0] && stack[0].tag;
    if (tag !== "script" && tag !== "style" && content.includes("&")) {
      content = currentOptions.decodeEntities(content, false);
    }
  }
  const parent = stack[0] || currentRoot;
  const lastNode = parent.children[parent.children.length - 1];
  if (lastNode && lastNode.type === 2) {
    lastNode.content += content;
    setLocEnd(lastNode.loc, end);
  } else {
    parent.children.push({
      type: 2,
      content,
      loc: getLoc(start, end)
    });
  }
}
function onCloseTag(el, end, isImplied = false) {
  if (isImplied) {
    setLocEnd(el.loc, backTrack(end, 60));
  } else {
    setLocEnd(el.loc, lookAhead(end, 62) + 1);
  }
  if (tokenizer.inSFCRoot) {
    if (el.children.length) {
      el.innerLoc.end = extend({}, el.children[el.children.length - 1].loc.end);
    } else {
      el.innerLoc.end = extend({}, el.innerLoc.start);
    }
    el.innerLoc.source = getSlice(
      el.innerLoc.start.offset,
      el.innerLoc.end.offset
    );
  }
  const { tag, ns } = el;
  if (!inVPre) {
    if (tag === "slot") {
      el.tagType = 2;
    } else if (isFragmentTemplate(el)) {
      el.tagType = 3;
    } else if (isComponent(el)) {
      el.tagType = 1;
    }
  }
  if (!tokenizer.inRCDATA) {
    el.children = condenseWhitespace(el.children, el.tag);
  }
  if (ns === 0 && currentOptions.isPreTag(tag)) {
    inPre--;
  }
  if (currentVPreBoundary === el) {
    inVPre = tokenizer.inVPre = false;
    currentVPreBoundary = null;
  }
  if (tokenizer.inXML && (stack[0] ? stack[0].ns : currentOptions.ns) === 0) {
    tokenizer.inXML = false;
  }
  {
    const props = el.props;
    if (isCompatEnabled(
      "COMPILER_V_IF_V_FOR_PRECEDENCE",
      currentOptions
    )) {
      let hasIf = false;
      let hasFor = false;
      for (let i = 0; i < props.length; i++) {
        const p = props[i];
        if (p.type === 7) {
          if (p.name === "if") {
            hasIf = true;
          } else if (p.name === "for") {
            hasFor = true;
          }
        }
        if (hasIf && hasFor) {
          warnDeprecation(
            "COMPILER_V_IF_V_FOR_PRECEDENCE",
            currentOptions,
            el.loc
          );
          break;
        }
      }
    }
    if (!tokenizer.inSFCRoot && isCompatEnabled(
      "COMPILER_NATIVE_TEMPLATE",
      currentOptions
    ) && el.tag === "template" && !isFragmentTemplate(el)) {
      warnDeprecation(
        "COMPILER_NATIVE_TEMPLATE",
        currentOptions,
        el.loc
      );
      const parent = stack[0] || currentRoot;
      const index = parent.children.indexOf(el);
      parent.children.splice(index, 1, ...el.children);
    }
    const inlineTemplateProp = props.find(
      (p) => p.type === 6 && p.name === "inline-template"
    );
    if (inlineTemplateProp && checkCompatEnabled(
      "COMPILER_INLINE_TEMPLATE",
      currentOptions,
      inlineTemplateProp.loc
    ) && el.children.length) {
      inlineTemplateProp.value = {
        type: 2,
        content: getSlice(
          el.children[0].loc.start.offset,
          el.children[el.children.length - 1].loc.end.offset
        ),
        loc: inlineTemplateProp.loc
      };
    }
  }
}
function lookAhead(index, c) {
  let i = index;
  while (currentInput.charCodeAt(i) !== c && i < currentInput.length - 1)
    i++;
  return i;
}
function backTrack(index, c) {
  let i = index;
  while (currentInput.charCodeAt(i) !== c && i >= 0)
    i--;
  return i;
}
function isFragmentTemplate({ tag, props }) {
  if (tag === "template") {
    for (let i = 0; i < props.length; i++) {
      if (props[i].type === 7 && specialTemplateDir.has(props[i].name)) {
        return true;
      }
    }
  }
  return false;
}
function isComponent({ tag, props }) {
  if (currentOptions.isCustomElement(tag)) {
    return false;
  }
  if (tag === "component" || isUpperCase(tag.charCodeAt(0)) || isCoreComponent(tag) || currentOptions.isBuiltInComponent && currentOptions.isBuiltInComponent(tag) || currentOptions.isNativeTag && !currentOptions.isNativeTag(tag)) {
    return true;
  }
  for (let i = 0; i < props.length; i++) {
    const p = props[i];
    if (p.type === 6) {
      if (p.name === "is" && p.value) {
        if (p.value.content.startsWith("vue:")) {
          return true;
        } else if (checkCompatEnabled(
          "COMPILER_IS_ON_ELEMENT",
          currentOptions,
          p.loc
        )) {
          return true;
        }
      }
    } else if (
      // :is on plain element - only treat as component in compat mode
      p.name === "bind" && isStaticArgOf(p.arg, "is") && checkCompatEnabled(
        "COMPILER_IS_ON_ELEMENT",
        currentOptions,
        p.loc
      )
    ) {
      return true;
    }
  }
  return false;
}
function isUpperCase(c) {
  return c > 64 && c < 91;
}
function condenseWhitespace(nodes, tag) {
  const shouldCondense = currentOptions.whitespace !== "preserve";
  let removedWhitespace = false;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 2) {
      if (!inPre) {
        if (isAllWhitespace(node.content)) {
          const prev = nodes[i - 1] && nodes[i - 1].type;
          const next = nodes[i + 1] && nodes[i + 1].type;
          if (!prev || !next || shouldCondense && (prev === 3 && (next === 3 || next === 1) || prev === 1 && (next === 3 || next === 1 && hasNewlineChar(node.content)))) {
            removedWhitespace = true;
            nodes[i] = null;
          } else {
            node.content = " ";
          }
        } else if (shouldCondense) {
          node.content = condense(node.content);
        }
      } else {
        node.content = node.content.replace(windowsNewlineRE, "\n");
      }
    }
  }
  if (inPre && tag && currentOptions.isPreTag(tag)) {
    const first = nodes[0];
    if (first && first.type === 2) {
      first.content = first.content.replace(/^\r?\n/, "");
    }
  }
  return removedWhitespace ? nodes.filter(Boolean) : nodes;
}
function isAllWhitespace(str) {
  for (let i = 0; i < str.length; i++) {
    if (!isWhitespace(str.charCodeAt(i))) {
      return false;
    }
  }
  return true;
}
function hasNewlineChar(str) {
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c === 10 || c === 13) {
      return true;
    }
  }
  return false;
}
function condense(str) {
  let ret = "";
  let prevCharIsWhitespace = false;
  for (let i = 0; i < str.length; i++) {
    if (isWhitespace(str.charCodeAt(i))) {
      if (!prevCharIsWhitespace) {
        ret += " ";
        prevCharIsWhitespace = true;
      }
    } else {
      ret += str[i];
      prevCharIsWhitespace = false;
    }
  }
  return ret;
}
function addNode(node) {
  (stack[0] || currentRoot).children.push(node);
}
function getLoc(start, end) {
  return {
    start: tokenizer.getPos(start),
    // @ts-expect-error allow late attachment
    end: end == null ? end : tokenizer.getPos(end),
    // @ts-expect-error allow late attachment
    source: end == null ? end : getSlice(start, end)
  };
}
function setLocEnd(loc, end) {
  loc.end = tokenizer.getPos(end);
  loc.source = getSlice(loc.start.offset, end);
}
function dirToAttr(dir) {
  const attr = {
    type: 6,
    name: dir.rawName,
    nameLoc: getLoc(
      dir.loc.start.offset,
      dir.loc.start.offset + dir.rawName.length
    ),
    value: void 0,
    loc: dir.loc
  };
  if (dir.exp) {
    const loc = dir.exp.loc;
    if (loc.end.offset < dir.loc.end.offset) {
      loc.start.offset--;
      loc.start.column--;
      loc.end.offset++;
      loc.end.column++;
    }
    attr.value = {
      type: 2,
      content: dir.exp.content,
      loc
    };
  }
  return attr;
}
function createExp(content, isStatic = false, loc, constType = 0, parseMode = 0) {
  const exp = createSimpleExpression(content, isStatic, loc, constType);
  return exp;
}
function emitError(code, index, message) {
  currentOptions.onError(
    createCompilerError(code, getLoc(index, index), void 0, message)
  );
}
function reset() {
  tokenizer.reset();
  currentOpenTag = null;
  currentProp = null;
  currentAttrValue = "";
  currentAttrStartIndex = -1;
  currentAttrEndIndex = -1;
  stack.length = 0;
}
function baseParse(input, options) {
  reset();
  currentInput = input;
  currentOptions = extend({}, defaultParserOptions);
  if (options) {
    let key;
    for (key in options) {
      if (options[key] != null) {
        currentOptions[key] = options[key];
      }
    }
  }
  if (true) {
    if (!currentOptions.decodeEntities) {
      throw new Error(
        `[@vue/compiler-core] decodeEntities option is required in browser builds.`
      );
    }
  }
  tokenizer.mode = currentOptions.parseMode === "html" ? 1 : currentOptions.parseMode === "sfc" ? 2 : 0;
  tokenizer.inXML = currentOptions.ns === 1 || currentOptions.ns === 2;
  const delimiters = options && options.delimiters;
  if (delimiters) {
    tokenizer.delimiterOpen = toCharCodes(delimiters[0]);
    tokenizer.delimiterClose = toCharCodes(delimiters[1]);
  }
  const root = currentRoot = createRoot([], input);
  tokenizer.parse(currentInput);
  root.loc = getLoc(0, input.length);
  root.children = condenseWhitespace(root.children);
  currentRoot = null;
  return root;
}
function hoistStatic(root, context) {
  walk(
    root,
    context,
    // Root node is unfortunately non-hoistable due to potential parent
    // fallthrough attributes.
    isSingleElementRoot(root, root.children[0])
  );
}
function isSingleElementRoot(root, child) {
  const { children } = root;
  return children.length === 1 && child.type === 1 && !isSlotOutlet(child);
}
function walk(node, context, doNotHoistNode = false) {
  const { children } = node;
  const originalCount = children.length;
  let hoistedCount = 0;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === 1 && child.tagType === 0) {
      const constantType = doNotHoistNode ? 0 : getConstantType(child, context);
      if (constantType > 0) {
        if (constantType >= 2) {
          child.codegenNode.patchFlag = -1 + (true ? ` /* HOISTED */` : ``);
          child.codegenNode = context.hoist(child.codegenNode);
          hoistedCount++;
          continue;
        }
      } else {
        const codegenNode = child.codegenNode;
        if (codegenNode.type === 13) {
          const flag = getPatchFlag(codegenNode);
          if ((!flag || flag === 512 || flag === 1) && getGeneratedPropsConstantType(child, context) >= 2) {
            const props = getNodeProps(child);
            if (props) {
              codegenNode.props = context.hoist(props);
            }
          }
          if (codegenNode.dynamicProps) {
            codegenNode.dynamicProps = context.hoist(codegenNode.dynamicProps);
          }
        }
      }
    }
    if (child.type === 1) {
      const isComponent2 = child.tagType === 1;
      if (isComponent2) {
        context.scopes.vSlot++;
      }
      walk(child, context);
      if (isComponent2) {
        context.scopes.vSlot--;
      }
    } else if (child.type === 11) {
      walk(child, context, child.children.length === 1);
    } else if (child.type === 9) {
      for (let i2 = 0; i2 < child.branches.length; i2++) {
        walk(
          child.branches[i2],
          context,
          child.branches[i2].children.length === 1
        );
      }
    }
  }
  if (hoistedCount && context.transformHoist) {
    context.transformHoist(children, context, node);
  }
  if (hoistedCount && hoistedCount === originalCount && node.type === 1 && node.tagType === 0 && node.codegenNode && node.codegenNode.type === 13 && isArray(node.codegenNode.children)) {
    const hoisted = context.hoist(
      createArrayExpression(node.codegenNode.children)
    );
    if (context.hmr) {
      hoisted.content = `[...${hoisted.content}]`;
    }
    node.codegenNode.children = hoisted;
  }
}
function getConstantType(node, context) {
  const { constantCache } = context;
  switch (node.type) {
    case 1:
      if (node.tagType !== 0) {
        return 0;
      }
      const cached = constantCache.get(node);
      if (cached !== void 0) {
        return cached;
      }
      const codegenNode = node.codegenNode;
      if (codegenNode.type !== 13) {
        return 0;
      }
      if (codegenNode.isBlock && node.tag !== "svg" && node.tag !== "foreignObject") {
        return 0;
      }
      const flag = getPatchFlag(codegenNode);
      if (!flag) {
        let returnType2 = 3;
        const generatedPropsType = getGeneratedPropsConstantType(node, context);
        if (generatedPropsType === 0) {
          constantCache.set(node, 0);
          return 0;
        }
        if (generatedPropsType < returnType2) {
          returnType2 = generatedPropsType;
        }
        for (let i = 0; i < node.children.length; i++) {
          const childType = getConstantType(node.children[i], context);
          if (childType === 0) {
            constantCache.set(node, 0);
            return 0;
          }
          if (childType < returnType2) {
            returnType2 = childType;
          }
        }
        if (returnType2 > 1) {
          for (let i = 0; i < node.props.length; i++) {
            const p = node.props[i];
            if (p.type === 7 && p.name === "bind" && p.exp) {
              const expType = getConstantType(p.exp, context);
              if (expType === 0) {
                constantCache.set(node, 0);
                return 0;
              }
              if (expType < returnType2) {
                returnType2 = expType;
              }
            }
          }
        }
        if (codegenNode.isBlock) {
          for (let i = 0; i < node.props.length; i++) {
            const p = node.props[i];
            if (p.type === 7) {
              constantCache.set(node, 0);
              return 0;
            }
          }
          context.removeHelper(OPEN_BLOCK);
          context.removeHelper(
            getVNodeBlockHelper(context.inSSR, codegenNode.isComponent)
          );
          codegenNode.isBlock = false;
          context.helper(getVNodeHelper(context.inSSR, codegenNode.isComponent));
        }
        constantCache.set(node, returnType2);
        return returnType2;
      } else {
        constantCache.set(node, 0);
        return 0;
      }
    case 2:
    case 3:
      return 3;
    case 9:
    case 11:
    case 10:
      return 0;
    case 5:
    case 12:
      return getConstantType(node.content, context);
    case 4:
      return node.constType;
    case 8:
      let returnType = 3;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (isString(child) || isSymbol(child)) {
          continue;
        }
        const childType = getConstantType(child, context);
        if (childType === 0) {
          return 0;
        } else if (childType < returnType) {
          returnType = childType;
        }
      }
      return returnType;
    default:
      if (true)
        ;
      return 0;
  }
}
function getConstantTypeOfHelperCall(value, context) {
  if (value.type === 14 && !isString(value.callee) && allowHoistedHelperSet.has(value.callee)) {
    const arg = value.arguments[0];
    if (arg.type === 4) {
      return getConstantType(arg, context);
    } else if (arg.type === 14) {
      return getConstantTypeOfHelperCall(arg, context);
    }
  }
  return 0;
}
function getGeneratedPropsConstantType(node, context) {
  let returnType = 3;
  const props = getNodeProps(node);
  if (props && props.type === 15) {
    const { properties } = props;
    for (let i = 0; i < properties.length; i++) {
      const { key, value } = properties[i];
      const keyType = getConstantType(key, context);
      if (keyType === 0) {
        return keyType;
      }
      if (keyType < returnType) {
        returnType = keyType;
      }
      let valueType;
      if (value.type === 4) {
        valueType = getConstantType(value, context);
      } else if (value.type === 14) {
        valueType = getConstantTypeOfHelperCall(value, context);
      } else {
        valueType = 0;
      }
      if (valueType === 0) {
        return valueType;
      }
      if (valueType < returnType) {
        returnType = valueType;
      }
    }
  }
  return returnType;
}
function getNodeProps(node) {
  const codegenNode = node.codegenNode;
  if (codegenNode.type === 13) {
    return codegenNode.props;
  }
}
function getPatchFlag(node) {
  const flag = node.patchFlag;
  return flag ? parseInt(flag, 10) : void 0;
}
function createTransformContext(root, {
  filename = "",
  prefixIdentifiers = false,
  hoistStatic: hoistStatic2 = false,
  hmr = false,
  cacheHandlers = false,
  nodeTransforms = [],
  directiveTransforms = {},
  transformHoist = null,
  isBuiltInComponent = NOOP,
  isCustomElement = NOOP,
  expressionPlugins = [],
  scopeId = null,
  slotted = true,
  ssr = false,
  inSSR = false,
  ssrCssVars = ``,
  bindingMetadata = EMPTY_OBJ,
  inline = false,
  isTS = false,
  onError = defaultOnError,
  onWarn = defaultOnWarn,
  compatConfig
}) {
  const nameMatch = filename.replace(/\?.*$/, "").match(/([^/\\]+)\.\w+$/);
  const context = {
    // options
    filename,
    selfName: nameMatch && capitalize(camelize(nameMatch[1])),
    prefixIdentifiers,
    hoistStatic: hoistStatic2,
    hmr,
    cacheHandlers,
    nodeTransforms,
    directiveTransforms,
    transformHoist,
    isBuiltInComponent,
    isCustomElement,
    expressionPlugins,
    scopeId,
    slotted,
    ssr,
    inSSR,
    ssrCssVars,
    bindingMetadata,
    inline,
    isTS,
    onError,
    onWarn,
    compatConfig,
    // state
    root,
    helpers: /* @__PURE__ */ new Map(),
    components: /* @__PURE__ */ new Set(),
    directives: /* @__PURE__ */ new Set(),
    hoists: [],
    imports: [],
    constantCache: /* @__PURE__ */ new WeakMap(),
    temps: 0,
    cached: 0,
    identifiers: /* @__PURE__ */ Object.create(null),
    scopes: {
      vFor: 0,
      vSlot: 0,
      vPre: 0,
      vOnce: 0
    },
    parent: null,
    grandParent: null,
    currentNode: root,
    childIndex: 0,
    inVOnce: false,
    // methods
    helper(name) {
      const count = context.helpers.get(name) || 0;
      context.helpers.set(name, count + 1);
      return name;
    },
    removeHelper(name) {
      const count = context.helpers.get(name);
      if (count) {
        const currentCount = count - 1;
        if (!currentCount) {
          context.helpers.delete(name);
        } else {
          context.helpers.set(name, currentCount);
        }
      }
    },
    helperString(name) {
      return `_${helperNameMap[context.helper(name)]}`;
    },
    replaceNode(node) {
      if (true) {
        if (!context.currentNode) {
          throw new Error(`Node being replaced is already removed.`);
        }
        if (!context.parent) {
          throw new Error(`Cannot replace root node.`);
        }
      }
      context.parent.children[context.childIndex] = context.currentNode = node;
    },
    removeNode(node) {
      if (!context.parent) {
        throw new Error(`Cannot remove root node.`);
      }
      const list = context.parent.children;
      const removalIndex = node ? list.indexOf(node) : context.currentNode ? context.childIndex : -1;
      if (removalIndex < 0) {
        throw new Error(`node being removed is not a child of current parent`);
      }
      if (!node || node === context.currentNode) {
        context.currentNode = null;
        context.onNodeRemoved();
      } else {
        if (context.childIndex > removalIndex) {
          context.childIndex--;
          context.onNodeRemoved();
        }
      }
      context.parent.children.splice(removalIndex, 1);
    },
    onNodeRemoved: NOOP,
    addIdentifiers(exp) {
    },
    removeIdentifiers(exp) {
    },
    hoist(exp) {
      if (isString(exp))
        exp = createSimpleExpression(exp);
      context.hoists.push(exp);
      const identifier = createSimpleExpression(
        `_hoisted_${context.hoists.length}`,
        false,
        exp.loc,
        2
      );
      identifier.hoisted = exp;
      return identifier;
    },
    cache(exp, isVNode = false) {
      return createCacheExpression(context.cached++, exp, isVNode);
    }
  };
  {
    context.filters = /* @__PURE__ */ new Set();
  }
  return context;
}
function transform(root, options) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
  if (options.hoistStatic) {
    hoistStatic(root, context);
  }
  if (!options.ssr) {
    createRootCodegen(root, context);
  }
  root.helpers = /* @__PURE__ */ new Set([...context.helpers.keys()]);
  root.components = [...context.components];
  root.directives = [...context.directives];
  root.imports = context.imports;
  root.hoists = context.hoists;
  root.temps = context.temps;
  root.cached = context.cached;
  root.transformed = true;
  {
    root.filters = [...context.filters];
  }
}
function createRootCodegen(root, context) {
  const { helper } = context;
  const { children } = root;
  if (children.length === 1) {
    const child = children[0];
    if (isSingleElementRoot(root, child) && child.codegenNode) {
      const codegenNode = child.codegenNode;
      if (codegenNode.type === 13) {
        convertToBlock(codegenNode, context);
      }
      root.codegenNode = codegenNode;
    } else {
      root.codegenNode = child;
    }
  } else if (children.length > 1) {
    let patchFlag = 64;
    let patchFlagText = PatchFlagNames[64];
    if (children.filter((c) => c.type !== 3).length === 1) {
      patchFlag |= 2048;
      patchFlagText += `, ${PatchFlagNames[2048]}`;
    }
    root.codegenNode = createVNodeCall(
      context,
      helper(FRAGMENT),
      void 0,
      root.children,
      patchFlag + (true ? ` /* ${patchFlagText} */` : ``),
      void 0,
      void 0,
      true,
      void 0,
      false
    );
  } else
    ;
}
function traverseChildren(parent, context) {
  let i = 0;
  const nodeRemoved = () => {
    i--;
  };
  for (; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (isString(child))
      continue;
    context.grandParent = context.parent;
    context.parent = parent;
    context.childIndex = i;
    context.onNodeRemoved = nodeRemoved;
    traverseNode(child, context);
  }
}
function traverseNode(node, context) {
  context.currentNode = node;
  const { nodeTransforms } = context;
  const exitFns = [];
  for (let i2 = 0; i2 < nodeTransforms.length; i2++) {
    const onExit = nodeTransforms[i2](node, context);
    if (onExit) {
      if (isArray(onExit)) {
        exitFns.push(...onExit);
      } else {
        exitFns.push(onExit);
      }
    }
    if (!context.currentNode) {
      return;
    } else {
      node = context.currentNode;
    }
  }
  switch (node.type) {
    case 3:
      if (!context.ssr) {
        context.helper(CREATE_COMMENT);
      }
      break;
    case 5:
      if (!context.ssr) {
        context.helper(TO_DISPLAY_STRING);
      }
      break;
    case 9:
      for (let i2 = 0; i2 < node.branches.length; i2++) {
        traverseNode(node.branches[i2], context);
      }
      break;
    case 10:
    case 11:
    case 1:
    case 0:
      traverseChildren(node, context);
      break;
  }
  context.currentNode = node;
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}
function createStructuralDirectiveTransform(name, fn) {
  const matches = isString(name) ? (n) => n === name : (n) => name.test(n);
  return (node, context) => {
    if (node.type === 1) {
      const { props } = node;
      if (node.tagType === 3 && props.some(isVSlot)) {
        return;
      }
      const exitFns = [];
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        if (prop.type === 7 && matches(prop.name)) {
          props.splice(i, 1);
          i--;
          const onExit = fn(node, prop, context);
          if (onExit)
            exitFns.push(onExit);
        }
      }
      return exitFns;
    }
  };
}
function createCodegenContext(ast, {
  mode = "function",
  prefixIdentifiers = mode === "module",
  sourceMap = false,
  filename = `template.vue.html`,
  scopeId = null,
  optimizeImports = false,
  runtimeGlobalName = `Vue`,
  runtimeModuleName = `vue`,
  ssrRuntimeModuleName = "vue/server-renderer",
  ssr = false,
  isTS = false,
  inSSR = false
}) {
  const context = {
    mode,
    prefixIdentifiers,
    sourceMap,
    filename,
    scopeId,
    optimizeImports,
    runtimeGlobalName,
    runtimeModuleName,
    ssrRuntimeModuleName,
    ssr,
    isTS,
    inSSR,
    source: ast.source,
    code: ``,
    column: 1,
    line: 1,
    offset: 0,
    indentLevel: 0,
    pure: false,
    map: void 0,
    helper(key) {
      return `_${helperNameMap[key]}`;
    },
    push(code, newlineIndex = -2, node) {
      context.code += code;
    },
    indent() {
      newline(++context.indentLevel);
    },
    deindent(withoutNewLine = false) {
      if (withoutNewLine) {
        --context.indentLevel;
      } else {
        newline(--context.indentLevel);
      }
    },
    newline() {
      newline(context.indentLevel);
    }
  };
  function newline(n) {
    context.push(
      "\n" + `  `.repeat(n),
      0
      /* Start */
    );
  }
  return context;
}
function generate(ast, options = {}) {
  const context = createCodegenContext(ast, options);
  if (options.onContextCreated)
    options.onContextCreated(context);
  const {
    mode,
    push,
    prefixIdentifiers,
    indent,
    deindent,
    newline,
    scopeId,
    ssr
  } = context;
  const helpers = Array.from(ast.helpers);
  const hasHelpers = helpers.length > 0;
  const useWithBlock = !prefixIdentifiers && mode !== "module";
  const preambleContext = context;
  {
    genFunctionPreamble(ast, preambleContext);
  }
  const functionName = ssr ? `ssrRender` : `render`;
  const args = ssr ? ["_ctx", "_push", "_parent", "_attrs"] : ["_ctx", "_cache"];
  const signature = args.join(", ");
  {
    push(`function ${functionName}(${signature}) {`);
  }
  indent();
  if (useWithBlock) {
    push(`with (_ctx) {`);
    indent();
    if (hasHelpers) {
      push(
        `const { ${helpers.map(aliasHelper).join(", ")} } = _Vue
`,
        -1
        /* End */
      );
      newline();
    }
  }
  if (ast.components.length) {
    genAssets(ast.components, "component", context);
    if (ast.directives.length || ast.temps > 0) {
      newline();
    }
  }
  if (ast.directives.length) {
    genAssets(ast.directives, "directive", context);
    if (ast.temps > 0) {
      newline();
    }
  }
  if (ast.filters && ast.filters.length) {
    newline();
    genAssets(ast.filters, "filter", context);
    newline();
  }
  if (ast.temps > 0) {
    push(`let `);
    for (let i = 0; i < ast.temps; i++) {
      push(`${i > 0 ? `, ` : ``}_temp${i}`);
    }
  }
  if (ast.components.length || ast.directives.length || ast.temps) {
    push(
      `
`,
      0
      /* Start */
    );
    newline();
  }
  if (!ssr) {
    push(`return `);
  }
  if (ast.codegenNode) {
    genNode(ast.codegenNode, context);
  } else {
    push(`null`);
  }
  if (useWithBlock) {
    deindent();
    push(`}`);
  }
  deindent();
  push(`}`);
  return {
    ast,
    code: context.code,
    preamble: ``,
    map: context.map ? context.map.toJSON() : void 0
  };
}
function genFunctionPreamble(ast, context) {
  const {
    ssr,
    prefixIdentifiers,
    push,
    newline,
    runtimeModuleName,
    runtimeGlobalName,
    ssrRuntimeModuleName
  } = context;
  const VueBinding = runtimeGlobalName;
  const helpers = Array.from(ast.helpers);
  if (helpers.length > 0) {
    {
      push(
        `const _Vue = ${VueBinding}
`,
        -1
        /* End */
      );
      if (ast.hoists.length) {
        const staticHelpers = [
          CREATE_VNODE,
          CREATE_ELEMENT_VNODE,
          CREATE_COMMENT,
          CREATE_TEXT,
          CREATE_STATIC
        ].filter((helper) => helpers.includes(helper)).map(aliasHelper).join(", ");
        push(
          `const { ${staticHelpers} } = _Vue
`,
          -1
          /* End */
        );
      }
    }
  }
  genHoists(ast.hoists, context);
  newline();
  push(`return `);
}
function genAssets(assets, type, { helper, push, newline, isTS }) {
  const resolver = helper(
    type === "filter" ? RESOLVE_FILTER : type === "component" ? RESOLVE_COMPONENT : RESOLVE_DIRECTIVE
  );
  for (let i = 0; i < assets.length; i++) {
    let id = assets[i];
    const maybeSelfReference = id.endsWith("__self");
    if (maybeSelfReference) {
      id = id.slice(0, -6);
    }
    push(
      `const ${toValidAssetId(id, type)} = ${resolver}(${JSON.stringify(id)}${maybeSelfReference ? `, true` : ``})${isTS ? `!` : ``}`
    );
    if (i < assets.length - 1) {
      newline();
    }
  }
}
function genHoists(hoists, context) {
  if (!hoists.length) {
    return;
  }
  context.pure = true;
  const { push, newline, helper, scopeId, mode } = context;
  newline();
  for (let i = 0; i < hoists.length; i++) {
    const exp = hoists[i];
    if (exp) {
      push(
        `const _hoisted_${i + 1} = ${``}`
      );
      genNode(exp, context);
      newline();
    }
  }
  context.pure = false;
}
function isText(n) {
  return isString(n) || n.type === 4 || n.type === 2 || n.type === 5 || n.type === 8;
}
function genNodeListAsArray(nodes, context) {
  const multilines = nodes.length > 3 || nodes.some((n) => isArray(n) || !isText(n));
  context.push(`[`);
  multilines && context.indent();
  genNodeList(nodes, context, multilines);
  multilines && context.deindent();
  context.push(`]`);
}
function genNodeList(nodes, context, multilines = false, comma = true) {
  const { push, newline } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isString(node)) {
      push(
        node,
        -3
        /* Unknown */
      );
    } else if (isArray(node)) {
      genNodeListAsArray(node, context);
    } else {
      genNode(node, context);
    }
    if (i < nodes.length - 1) {
      if (multilines) {
        comma && push(",");
        newline();
      } else {
        comma && push(", ");
      }
    }
  }
}
function genNode(node, context) {
  if (isString(node)) {
    context.push(
      node,
      -3
      /* Unknown */
    );
    return;
  }
  if (isSymbol(node)) {
    context.push(context.helper(node));
    return;
  }
  switch (node.type) {
    case 1:
    case 9:
    case 11:
      assert(
        node.codegenNode != null,
        `Codegen node is missing for element/if/for node. Apply appropriate transforms first.`
      );
      genNode(node.codegenNode, context);
      break;
    case 2:
      genText(node, context);
      break;
    case 4:
      genExpression(node, context);
      break;
    case 5:
      genInterpolation(node, context);
      break;
    case 12:
      genNode(node.codegenNode, context);
      break;
    case 8:
      genCompoundExpression(node, context);
      break;
    case 3:
      genComment(node, context);
      break;
    case 13:
      genVNodeCall(node, context);
      break;
    case 14:
      genCallExpression(node, context);
      break;
    case 15:
      genObjectExpression(node, context);
      break;
    case 17:
      genArrayExpression(node, context);
      break;
    case 18:
      genFunctionExpression(node, context);
      break;
    case 19:
      genConditionalExpression(node, context);
      break;
    case 20:
      genCacheExpression(node, context);
      break;
    case 21:
      genNodeList(node.body, context, true, false);
      break;
    case 22:
      break;
    case 23:
      break;
    case 24:
      break;
    case 25:
      break;
    case 26:
      break;
    case 10:
      break;
    default:
      if (true) {
        assert(false, `unhandled codegen node type: ${node.type}`);
        const exhaustiveCheck = node;
        return exhaustiveCheck;
      }
  }
}
function genText(node, context) {
  context.push(JSON.stringify(node.content), -3, node);
}
function genExpression(node, context) {
  const { content, isStatic } = node;
  context.push(
    isStatic ? JSON.stringify(content) : content,
    -3,
    node
  );
}
function genInterpolation(node, context) {
  const { push, helper, pure } = context;
  if (pure)
    push(PURE_ANNOTATION);
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}
function genCompoundExpression(node, context) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (isString(child)) {
      context.push(
        child,
        -3
        /* Unknown */
      );
    } else {
      genNode(child, context);
    }
  }
}
function genExpressionAsPropertyKey(node, context) {
  const { push } = context;
  if (node.type === 8) {
    push(`[`);
    genCompoundExpression(node, context);
    push(`]`);
  } else if (node.isStatic) {
    const text = isSimpleIdentifier(node.content) ? node.content : JSON.stringify(node.content);
    push(text, -2, node);
  } else {
    push(`[${node.content}]`, -3, node);
  }
}
function genComment(node, context) {
  const { push, helper, pure } = context;
  if (pure) {
    push(PURE_ANNOTATION);
  }
  push(
    `${helper(CREATE_COMMENT)}(${JSON.stringify(node.content)})`,
    -3,
    node
  );
}
function genVNodeCall(node, context) {
  const { push, helper, pure } = context;
  const {
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock,
    disableTracking,
    isComponent: isComponent2
  } = node;
  if (directives) {
    push(helper(WITH_DIRECTIVES) + `(`);
  }
  if (isBlock) {
    push(`(${helper(OPEN_BLOCK)}(${disableTracking ? `true` : ``}), `);
  }
  if (pure) {
    push(PURE_ANNOTATION);
  }
  const callHelper = isBlock ? getVNodeBlockHelper(context.inSSR, isComponent2) : getVNodeHelper(context.inSSR, isComponent2);
  push(helper(callHelper) + `(`, -2, node);
  genNodeList(
    genNullableArgs([tag, props, children, patchFlag, dynamicProps]),
    context
  );
  push(`)`);
  if (isBlock) {
    push(`)`);
  }
  if (directives) {
    push(`, `);
    genNode(directives, context);
    push(`)`);
  }
}
function genNullableArgs(args) {
  let i = args.length;
  while (i--) {
    if (args[i] != null)
      break;
  }
  return args.slice(0, i + 1).map((arg) => arg || `null`);
}
function genCallExpression(node, context) {
  const { push, helper, pure } = context;
  const callee = isString(node.callee) ? node.callee : helper(node.callee);
  if (pure) {
    push(PURE_ANNOTATION);
  }
  push(callee + `(`, -2, node);
  genNodeList(node.arguments, context);
  push(`)`);
}
function genObjectExpression(node, context) {
  const { push, indent, deindent, newline } = context;
  const { properties } = node;
  if (!properties.length) {
    push(`{}`, -2, node);
    return;
  }
  const multilines = properties.length > 1 || properties.some((p) => p.value.type !== 4);
  push(multilines ? `{` : `{ `);
  multilines && indent();
  for (let i = 0; i < properties.length; i++) {
    const { key, value } = properties[i];
    genExpressionAsPropertyKey(key, context);
    push(`: `);
    genNode(value, context);
    if (i < properties.length - 1) {
      push(`,`);
      newline();
    }
  }
  multilines && deindent();
  push(multilines ? `}` : ` }`);
}
function genArrayExpression(node, context) {
  genNodeListAsArray(node.elements, context);
}
function genFunctionExpression(node, context) {
  const { push, indent, deindent } = context;
  const { params, returns, body, newline, isSlot } = node;
  if (isSlot) {
    push(`_${helperNameMap[WITH_CTX]}(`);
  }
  push(`(`, -2, node);
  if (isArray(params)) {
    genNodeList(params, context);
  } else if (params) {
    genNode(params, context);
  }
  push(`) => `);
  if (newline || body) {
    push(`{`);
    indent();
  }
  if (returns) {
    if (newline) {
      push(`return `);
    }
    if (isArray(returns)) {
      genNodeListAsArray(returns, context);
    } else {
      genNode(returns, context);
    }
  } else if (body) {
    genNode(body, context);
  }
  if (newline || body) {
    deindent();
    push(`}`);
  }
  if (isSlot) {
    if (node.isNonScopedSlot) {
      push(`, undefined, true`);
    }
    push(`)`);
  }
}
function genConditionalExpression(node, context) {
  const { test, consequent, alternate, newline: needNewline } = node;
  const { push, indent, deindent, newline } = context;
  if (test.type === 4) {
    const needsParens = !isSimpleIdentifier(test.content);
    needsParens && push(`(`);
    genExpression(test, context);
    needsParens && push(`)`);
  } else {
    push(`(`);
    genNode(test, context);
    push(`)`);
  }
  needNewline && indent();
  context.indentLevel++;
  needNewline || push(` `);
  push(`? `);
  genNode(consequent, context);
  context.indentLevel--;
  needNewline && newline();
  needNewline || push(` `);
  push(`: `);
  const isNested = alternate.type === 19;
  if (!isNested) {
    context.indentLevel++;
  }
  genNode(alternate, context);
  if (!isNested) {
    context.indentLevel--;
  }
  needNewline && deindent(
    true
    /* without newline */
  );
}
function genCacheExpression(node, context) {
  const { push, helper, indent, deindent, newline } = context;
  push(`_cache[${node.index}] || (`);
  if (node.isVNode) {
    indent();
    push(`${helper(SET_BLOCK_TRACKING)}(-1),`);
    newline();
  }
  push(`_cache[${node.index}] = `);
  genNode(node.value, context);
  if (node.isVNode) {
    push(`,`);
    newline();
    push(`${helper(SET_BLOCK_TRACKING)}(1),`);
    newline();
    push(`_cache[${node.index}]`);
    deindent();
  }
  push(`)`);
}
function validateBrowserExpression(node, context, asParams = false, asRawStatements = false) {
  const exp = node.content;
  if (!exp.trim()) {
    return;
  }
  try {
    new Function(
      asRawStatements ? ` ${exp} ` : `return ${asParams ? `(${exp}) => {}` : `(${exp})`}`
    );
  } catch (e) {
    let message = e.message;
    const keywordMatch = exp.replace(stripStringRE, "").match(prohibitedKeywordRE);
    if (keywordMatch) {
      message = `avoid using JavaScript keyword as property name: "${keywordMatch[0]}"`;
    }
    context.onError(
      createCompilerError(
        45,
        node.loc,
        void 0,
        message
      )
    );
  }
}
function processExpression(node, context, asParams = false, asRawStatements = false, localVars = Object.create(context.identifiers)) {
  {
    if (true) {
      validateBrowserExpression(node, context, asParams, asRawStatements);
    }
    return node;
  }
}
function stringifyExpression(exp) {
  if (isString(exp)) {
    return exp;
  } else if (exp.type === 4) {
    return exp.content;
  } else {
    return exp.children.map(stringifyExpression).join("");
  }
}
function processIf(node, dir, context, processCodegen) {
  if (dir.name !== "else" && (!dir.exp || !dir.exp.content.trim())) {
    const loc = dir.exp ? dir.exp.loc : node.loc;
    context.onError(
      createCompilerError(28, dir.loc)
    );
    dir.exp = createSimpleExpression(`true`, false, loc);
  }
  if (dir.exp) {
    validateBrowserExpression(dir.exp, context);
  }
  if (dir.name === "if") {
    const branch = createIfBranch(node, dir);
    const ifNode = {
      type: 9,
      loc: node.loc,
      branches: [branch]
    };
    context.replaceNode(ifNode);
    if (processCodegen) {
      return processCodegen(ifNode, branch, true);
    }
  } else {
    const siblings = context.parent.children;
    const comments = [];
    let i = siblings.indexOf(node);
    while (i-- >= -1) {
      const sibling = siblings[i];
      if (sibling && sibling.type === 3) {
        context.removeNode(sibling);
        comments.unshift(sibling);
        continue;
      }
      if (sibling && sibling.type === 2 && !sibling.content.trim().length) {
        context.removeNode(sibling);
        continue;
      }
      if (sibling && sibling.type === 9) {
        if (dir.name === "else-if" && sibling.branches[sibling.branches.length - 1].condition === void 0) {
          context.onError(
            createCompilerError(30, node.loc)
          );
        }
        context.removeNode();
        const branch = createIfBranch(node, dir);
        if (comments.length && // #3619 ignore comments if the v-if is direct child of <transition>
        !(context.parent && context.parent.type === 1 && (context.parent.tag === "transition" || context.parent.tag === "Transition"))) {
          branch.children = [...comments, ...branch.children];
        }
        if (true) {
          const key = branch.userKey;
          if (key) {
            sibling.branches.forEach(({ userKey }) => {
              if (isSameKey(userKey, key)) {
                context.onError(
                  createCompilerError(
                    29,
                    branch.userKey.loc
                  )
                );
              }
            });
          }
        }
        sibling.branches.push(branch);
        const onExit = processCodegen && processCodegen(sibling, branch, false);
        traverseNode(branch, context);
        if (onExit)
          onExit();
        context.currentNode = null;
      } else {
        context.onError(
          createCompilerError(30, node.loc)
        );
      }
      break;
    }
  }
}
function createIfBranch(node, dir) {
  const isTemplateIf = node.tagType === 3;
  return {
    type: 10,
    loc: node.loc,
    condition: dir.name === "else" ? void 0 : dir.exp,
    children: isTemplateIf && !findDir(node, "for") ? node.children : [node],
    userKey: findProp(node, `key`),
    isTemplateIf
  };
}
function createCodegenNodeForBranch(branch, keyIndex, context) {
  if (branch.condition) {
    return createConditionalExpression(
      branch.condition,
      createChildrenCodegenNode(branch, keyIndex, context),
      // make sure to pass in asBlock: true so that the comment node call
      // closes the current block.
      createCallExpression(context.helper(CREATE_COMMENT), [
        true ? '"v-if"' : '""',
        "true"
      ])
    );
  } else {
    return createChildrenCodegenNode(branch, keyIndex, context);
  }
}
function createChildrenCodegenNode(branch, keyIndex, context) {
  const { helper } = context;
  const keyProperty = createObjectProperty(
    `key`,
    createSimpleExpression(
      `${keyIndex}`,
      false,
      locStub,
      2
    )
  );
  const { children } = branch;
  const firstChild = children[0];
  const needFragmentWrapper = children.length !== 1 || firstChild.type !== 1;
  if (needFragmentWrapper) {
    if (children.length === 1 && firstChild.type === 11) {
      const vnodeCall = firstChild.codegenNode;
      injectProp(vnodeCall, keyProperty, context);
      return vnodeCall;
    } else {
      let patchFlag = 64;
      let patchFlagText = PatchFlagNames[64];
      if (!branch.isTemplateIf && children.filter((c) => c.type !== 3).length === 1) {
        patchFlag |= 2048;
        patchFlagText += `, ${PatchFlagNames[2048]}`;
      }
      return createVNodeCall(
        context,
        helper(FRAGMENT),
        createObjectExpression([keyProperty]),
        children,
        patchFlag + (true ? ` /* ${patchFlagText} */` : ``),
        void 0,
        void 0,
        true,
        false,
        false,
        branch.loc
      );
    }
  } else {
    const ret = firstChild.codegenNode;
    const vnodeCall = getMemoedVNodeCall(ret);
    if (vnodeCall.type === 13) {
      convertToBlock(vnodeCall, context);
    }
    injectProp(vnodeCall, keyProperty, context);
    return ret;
  }
}
function isSameKey(a, b) {
  if (!a || a.type !== b.type) {
    return false;
  }
  if (a.type === 6) {
    if (a.value.content !== b.value.content) {
      return false;
    }
  } else {
    const exp = a.exp;
    const branchExp = b.exp;
    if (exp.type !== branchExp.type) {
      return false;
    }
    if (exp.type !== 4 || exp.isStatic !== branchExp.isStatic || exp.content !== branchExp.content) {
      return false;
    }
  }
  return true;
}
function getParentCondition(node) {
  while (true) {
    if (node.type === 19) {
      if (node.alternate.type === 19) {
        node = node.alternate;
      } else {
        return node;
      }
    } else if (node.type === 20) {
      node = node.value;
    }
  }
}
function processFor(node, dir, context, processCodegen) {
  if (!dir.exp) {
    context.onError(
      createCompilerError(31, dir.loc)
    );
    return;
  }
  const parseResult = dir.forParseResult;
  if (!parseResult) {
    context.onError(
      createCompilerError(32, dir.loc)
    );
    return;
  }
  finalizeForParseResult(parseResult, context);
  const { addIdentifiers, removeIdentifiers, scopes } = context;
  const { source, value, key, index } = parseResult;
  const forNode = {
    type: 11,
    loc: dir.loc,
    source,
    valueAlias: value,
    keyAlias: key,
    objectIndexAlias: index,
    parseResult,
    children: isTemplateNode(node) ? node.children : [node]
  };
  context.replaceNode(forNode);
  scopes.vFor++;
  const onExit = processCodegen && processCodegen(forNode);
  return () => {
    scopes.vFor--;
    if (onExit)
      onExit();
  };
}
function finalizeForParseResult(result, context) {
  if (result.finalized)
    return;
  if (true) {
    validateBrowserExpression(result.source, context);
    if (result.key) {
      validateBrowserExpression(
        result.key,
        context,
        true
      );
    }
    if (result.index) {
      validateBrowserExpression(
        result.index,
        context,
        true
      );
    }
    if (result.value) {
      validateBrowserExpression(
        result.value,
        context,
        true
      );
    }
  }
  result.finalized = true;
}
function createForLoopParams({ value, key, index }, memoArgs = []) {
  return createParamsList([value, key, index, ...memoArgs]);
}
function createParamsList(args) {
  let i = args.length;
  while (i--) {
    if (args[i])
      break;
  }
  return args.slice(0, i + 1).map((arg, i2) => arg || createSimpleExpression(`_`.repeat(i2 + 1), false));
}
function buildSlots(node, context, buildSlotFn = buildClientSlotFn) {
  context.helper(WITH_CTX);
  const { children, loc } = node;
  const slotsProperties = [];
  const dynamicSlots = [];
  let hasDynamicSlots = context.scopes.vSlot > 0 || context.scopes.vFor > 0;
  const onComponentSlot = findDir(node, "slot", true);
  if (onComponentSlot) {
    const { arg, exp } = onComponentSlot;
    if (arg && !isStaticExp(arg)) {
      hasDynamicSlots = true;
    }
    slotsProperties.push(
      createObjectProperty(
        arg || createSimpleExpression("default", true),
        buildSlotFn(exp, void 0, children, loc)
      )
    );
  }
  let hasTemplateSlots = false;
  let hasNamedDefaultSlot = false;
  const implicitDefaultChildren = [];
  const seenSlotNames = /* @__PURE__ */ new Set();
  let conditionalBranchIndex = 0;
  for (let i = 0; i < children.length; i++) {
    const slotElement = children[i];
    let slotDir;
    if (!isTemplateNode(slotElement) || !(slotDir = findDir(slotElement, "slot", true))) {
      if (slotElement.type !== 3) {
        implicitDefaultChildren.push(slotElement);
      }
      continue;
    }
    if (onComponentSlot) {
      context.onError(
        createCompilerError(37, slotDir.loc)
      );
      break;
    }
    hasTemplateSlots = true;
    const { children: slotChildren, loc: slotLoc } = slotElement;
    const {
      arg: slotName = createSimpleExpression(`default`, true),
      exp: slotProps,
      loc: dirLoc
    } = slotDir;
    let staticSlotName;
    if (isStaticExp(slotName)) {
      staticSlotName = slotName ? slotName.content : `default`;
    } else {
      hasDynamicSlots = true;
    }
    const vFor = findDir(slotElement, "for");
    const slotFunction = buildSlotFn(slotProps, vFor, slotChildren, slotLoc);
    let vIf;
    let vElse;
    if (vIf = findDir(slotElement, "if")) {
      hasDynamicSlots = true;
      dynamicSlots.push(
        createConditionalExpression(
          vIf.exp,
          buildDynamicSlot(slotName, slotFunction, conditionalBranchIndex++),
          defaultFallback
        )
      );
    } else if (vElse = findDir(
      slotElement,
      /^else(-if)?$/,
      true
      /* allowEmpty */
    )) {
      let j = i;
      let prev;
      while (j--) {
        prev = children[j];
        if (prev.type !== 3) {
          break;
        }
      }
      if (prev && isTemplateNode(prev) && findDir(prev, "if")) {
        children.splice(i, 1);
        i--;
        let conditional = dynamicSlots[dynamicSlots.length - 1];
        while (conditional.alternate.type === 19) {
          conditional = conditional.alternate;
        }
        conditional.alternate = vElse.exp ? createConditionalExpression(
          vElse.exp,
          buildDynamicSlot(
            slotName,
            slotFunction,
            conditionalBranchIndex++
          ),
          defaultFallback
        ) : buildDynamicSlot(slotName, slotFunction, conditionalBranchIndex++);
      } else {
        context.onError(
          createCompilerError(30, vElse.loc)
        );
      }
    } else if (vFor) {
      hasDynamicSlots = true;
      const parseResult = vFor.forParseResult;
      if (parseResult) {
        finalizeForParseResult(parseResult, context);
        dynamicSlots.push(
          createCallExpression(context.helper(RENDER_LIST), [
            parseResult.source,
            createFunctionExpression(
              createForLoopParams(parseResult),
              buildDynamicSlot(slotName, slotFunction),
              true
            )
          ])
        );
      } else {
        context.onError(
          createCompilerError(
            32,
            vFor.loc
          )
        );
      }
    } else {
      if (staticSlotName) {
        if (seenSlotNames.has(staticSlotName)) {
          context.onError(
            createCompilerError(
              38,
              dirLoc
            )
          );
          continue;
        }
        seenSlotNames.add(staticSlotName);
        if (staticSlotName === "default") {
          hasNamedDefaultSlot = true;
        }
      }
      slotsProperties.push(createObjectProperty(slotName, slotFunction));
    }
  }
  if (!onComponentSlot) {
    const buildDefaultSlotProperty = (props, children2) => {
      const fn = buildSlotFn(props, void 0, children2, loc);
      if (context.compatConfig) {
        fn.isNonScopedSlot = true;
      }
      return createObjectProperty(`default`, fn);
    };
    if (!hasTemplateSlots) {
      slotsProperties.push(buildDefaultSlotProperty(void 0, children));
    } else if (implicitDefaultChildren.length && // #3766
    // with whitespace: 'preserve', whitespaces between slots will end up in
    // implicitDefaultChildren. Ignore if all implicit children are whitespaces.
    implicitDefaultChildren.some((node2) => isNonWhitespaceContent(node2))) {
      if (hasNamedDefaultSlot) {
        context.onError(
          createCompilerError(
            39,
            implicitDefaultChildren[0].loc
          )
        );
      } else {
        slotsProperties.push(
          buildDefaultSlotProperty(void 0, implicitDefaultChildren)
        );
      }
    }
  }
  const slotFlag = hasDynamicSlots ? 2 : hasForwardedSlots(node.children) ? 3 : 1;
  let slots = createObjectExpression(
    slotsProperties.concat(
      createObjectProperty(
        `_`,
        // 2 = compiled but dynamic = can skip normalization, but must run diff
        // 1 = compiled and static = can skip normalization AND diff as optimized
        createSimpleExpression(
          slotFlag + (true ? ` /* ${slotFlagsText[slotFlag]} */` : ``),
          false
        )
      )
    ),
    loc
  );
  if (dynamicSlots.length) {
    slots = createCallExpression(context.helper(CREATE_SLOTS), [
      slots,
      createArrayExpression(dynamicSlots)
    ]);
  }
  return {
    slots,
    hasDynamicSlots
  };
}
function buildDynamicSlot(name, fn, index) {
  const props = [
    createObjectProperty(`name`, name),
    createObjectProperty(`fn`, fn)
  ];
  if (index != null) {
    props.push(
      createObjectProperty(`key`, createSimpleExpression(String(index), true))
    );
  }
  return createObjectExpression(props);
}
function hasForwardedSlots(children) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    switch (child.type) {
      case 1:
        if (child.tagType === 2 || hasForwardedSlots(child.children)) {
          return true;
        }
        break;
      case 9:
        if (hasForwardedSlots(child.branches))
          return true;
        break;
      case 10:
      case 11:
        if (hasForwardedSlots(child.children))
          return true;
        break;
    }
  }
  return false;
}
function isNonWhitespaceContent(node) {
  if (node.type !== 2 && node.type !== 12)
    return true;
  return node.type === 2 ? !!node.content.trim() : isNonWhitespaceContent(node.content);
}
function resolveComponentType(node, context, ssr = false) {
  let { tag } = node;
  const isExplicitDynamic = isComponentTag(tag);
  const isProp = findProp(
    node,
    "is",
    false,
    true
    /* allow empty */
  );
  if (isProp) {
    if (isExplicitDynamic || isCompatEnabled(
      "COMPILER_IS_ON_ELEMENT",
      context
    )) {
      let exp;
      if (isProp.type === 6) {
        exp = isProp.value && createSimpleExpression(isProp.value.content, true);
      } else {
        exp = isProp.exp;
        if (!exp) {
          exp = createSimpleExpression(`is`, false, isProp.loc);
        }
      }
      if (exp) {
        return createCallExpression(context.helper(RESOLVE_DYNAMIC_COMPONENT), [
          exp
        ]);
      }
    } else if (isProp.type === 6 && isProp.value.content.startsWith("vue:")) {
      tag = isProp.value.content.slice(4);
    }
  }
  const builtIn = isCoreComponent(tag) || context.isBuiltInComponent(tag);
  if (builtIn) {
    if (!ssr)
      context.helper(builtIn);
    return builtIn;
  }
  context.helper(RESOLVE_COMPONENT);
  context.components.add(tag);
  return toValidAssetId(tag, `component`);
}
function buildProps(node, context, props = node.props, isComponent2, isDynamicComponent, ssr = false) {
  const { tag, loc: elementLoc, children } = node;
  let properties = [];
  const mergeArgs = [];
  const runtimeDirectives = [];
  const hasChildren = children.length > 0;
  let shouldUseBlock = false;
  let patchFlag = 0;
  let hasRef = false;
  let hasClassBinding = false;
  let hasStyleBinding = false;
  let hasHydrationEventBinding = false;
  let hasDynamicKeys = false;
  let hasVnodeHook = false;
  const dynamicPropNames = [];
  const pushMergeArg = (arg) => {
    if (properties.length) {
      mergeArgs.push(
        createObjectExpression(dedupeProperties(properties), elementLoc)
      );
      properties = [];
    }
    if (arg)
      mergeArgs.push(arg);
  };
  const pushRefVForMarker = () => {
    if (context.scopes.vFor > 0) {
      properties.push(
        createObjectProperty(
          createSimpleExpression("ref_for", true),
          createSimpleExpression("true")
        )
      );
    }
  };
  const analyzePatchFlag = ({ key, value }) => {
    if (isStaticExp(key)) {
      const name = key.content;
      const isEventHandler = isOn(name);
      if (isEventHandler && (!isComponent2 || isDynamicComponent) && // omit the flag for click handlers because hydration gives click
      // dedicated fast path.
      name.toLowerCase() !== "onclick" && // omit v-model handlers
      name !== "onUpdate:modelValue" && // omit onVnodeXXX hooks
      !isReservedProp(name)) {
        hasHydrationEventBinding = true;
      }
      if (isEventHandler && isReservedProp(name)) {
        hasVnodeHook = true;
      }
      if (isEventHandler && value.type === 14) {
        value = value.arguments[0];
      }
      if (value.type === 20 || (value.type === 4 || value.type === 8) && getConstantType(value, context) > 0) {
        return;
      }
      if (name === "ref") {
        hasRef = true;
      } else if (name === "class") {
        hasClassBinding = true;
      } else if (name === "style") {
        hasStyleBinding = true;
      } else if (name !== "key" && !dynamicPropNames.includes(name)) {
        dynamicPropNames.push(name);
      }
      if (isComponent2 && (name === "class" || name === "style") && !dynamicPropNames.includes(name)) {
        dynamicPropNames.push(name);
      }
    } else {
      hasDynamicKeys = true;
    }
  };
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (prop.type === 6) {
      const { loc, name, nameLoc, value } = prop;
      let isStatic = true;
      if (name === "ref") {
        hasRef = true;
        pushRefVForMarker();
      }
      if (name === "is" && (isComponentTag(tag) || value && value.content.startsWith("vue:") || isCompatEnabled(
        "COMPILER_IS_ON_ELEMENT",
        context
      ))) {
        continue;
      }
      properties.push(
        createObjectProperty(
          createSimpleExpression(name, true, nameLoc),
          createSimpleExpression(
            value ? value.content : "",
            isStatic,
            value ? value.loc : loc
          )
        )
      );
    } else {
      const { name, arg, exp, loc, modifiers } = prop;
      const isVBind = name === "bind";
      const isVOn = name === "on";
      if (name === "slot") {
        if (!isComponent2) {
          context.onError(
            createCompilerError(40, loc)
          );
        }
        continue;
      }
      if (name === "once" || name === "memo") {
        continue;
      }
      if (name === "is" || isVBind && isStaticArgOf(arg, "is") && (isComponentTag(tag) || isCompatEnabled(
        "COMPILER_IS_ON_ELEMENT",
        context
      ))) {
        continue;
      }
      if (isVOn && ssr) {
        continue;
      }
      if (
        // #938: elements with dynamic keys should be forced into blocks
        isVBind && isStaticArgOf(arg, "key") || // inline before-update hooks need to force block so that it is invoked
        // before children
        isVOn && hasChildren && isStaticArgOf(arg, "vue:before-update")
      ) {
        shouldUseBlock = true;
      }
      if (isVBind && isStaticArgOf(arg, "ref")) {
        pushRefVForMarker();
      }
      if (!arg && (isVBind || isVOn)) {
        hasDynamicKeys = true;
        if (exp) {
          if (isVBind) {
            pushRefVForMarker();
            pushMergeArg();
            {
              if (true) {
                const hasOverridableKeys = mergeArgs.some((arg2) => {
                  if (arg2.type === 15) {
                    return arg2.properties.some(({ key }) => {
                      if (key.type !== 4 || !key.isStatic) {
                        return true;
                      }
                      return key.content !== "class" && key.content !== "style" && !isOn(key.content);
                    });
                  } else {
                    return true;
                  }
                });
                if (hasOverridableKeys) {
                  checkCompatEnabled(
                    "COMPILER_V_BIND_OBJECT_ORDER",
                    context,
                    loc
                  );
                }
              }
              if (isCompatEnabled(
                "COMPILER_V_BIND_OBJECT_ORDER",
                context
              )) {
                mergeArgs.unshift(exp);
                continue;
              }
            }
            mergeArgs.push(exp);
          } else {
            pushMergeArg({
              type: 14,
              loc,
              callee: context.helper(TO_HANDLERS),
              arguments: isComponent2 ? [exp] : [exp, `true`]
            });
          }
        } else {
          context.onError(
            createCompilerError(
              isVBind ? 34 : 35,
              loc
            )
          );
        }
        continue;
      }
      if (isVBind && modifiers.includes("prop")) {
        patchFlag |= 32;
      }
      const directiveTransform = context.directiveTransforms[name];
      if (directiveTransform) {
        const { props: props2, needRuntime } = directiveTransform(prop, node, context);
        !ssr && props2.forEach(analyzePatchFlag);
        if (isVOn && arg && !isStaticExp(arg)) {
          pushMergeArg(createObjectExpression(props2, elementLoc));
        } else {
          properties.push(...props2);
        }
        if (needRuntime) {
          runtimeDirectives.push(prop);
          if (isSymbol(needRuntime)) {
            directiveImportMap.set(prop, needRuntime);
          }
        }
      } else if (!isBuiltInDirective(name)) {
        runtimeDirectives.push(prop);
        if (hasChildren) {
          shouldUseBlock = true;
        }
      }
    }
  }
  let propsExpression = void 0;
  if (mergeArgs.length) {
    pushMergeArg();
    if (mergeArgs.length > 1) {
      propsExpression = createCallExpression(
        context.helper(MERGE_PROPS),
        mergeArgs,
        elementLoc
      );
    } else {
      propsExpression = mergeArgs[0];
    }
  } else if (properties.length) {
    propsExpression = createObjectExpression(
      dedupeProperties(properties),
      elementLoc
    );
  }
  if (hasDynamicKeys) {
    patchFlag |= 16;
  } else {
    if (hasClassBinding && !isComponent2) {
      patchFlag |= 2;
    }
    if (hasStyleBinding && !isComponent2) {
      patchFlag |= 4;
    }
    if (dynamicPropNames.length) {
      patchFlag |= 8;
    }
    if (hasHydrationEventBinding) {
      patchFlag |= 32;
    }
  }
  if (!shouldUseBlock && (patchFlag === 0 || patchFlag === 32) && (hasRef || hasVnodeHook || runtimeDirectives.length > 0)) {
    patchFlag |= 512;
  }
  if (!context.inSSR && propsExpression) {
    switch (propsExpression.type) {
      case 15:
        let classKeyIndex = -1;
        let styleKeyIndex = -1;
        let hasDynamicKey = false;
        for (let i = 0; i < propsExpression.properties.length; i++) {
          const key = propsExpression.properties[i].key;
          if (isStaticExp(key)) {
            if (key.content === "class") {
              classKeyIndex = i;
            } else if (key.content === "style") {
              styleKeyIndex = i;
            }
          } else if (!key.isHandlerKey) {
            hasDynamicKey = true;
          }
        }
        const classProp = propsExpression.properties[classKeyIndex];
        const styleProp = propsExpression.properties[styleKeyIndex];
        if (!hasDynamicKey) {
          if (classProp && !isStaticExp(classProp.value)) {
            classProp.value = createCallExpression(
              context.helper(NORMALIZE_CLASS),
              [classProp.value]
            );
          }
          if (styleProp && // the static style is compiled into an object,
          // so use `hasStyleBinding` to ensure that it is a dynamic style binding
          (hasStyleBinding || styleProp.value.type === 4 && styleProp.value.content.trim()[0] === `[` || // v-bind:style and style both exist,
          // v-bind:style with static literal object
          styleProp.value.type === 17)) {
            styleProp.value = createCallExpression(
              context.helper(NORMALIZE_STYLE),
              [styleProp.value]
            );
          }
        } else {
          propsExpression = createCallExpression(
            context.helper(NORMALIZE_PROPS),
            [propsExpression]
          );
        }
        break;
      case 14:
        break;
      default:
        propsExpression = createCallExpression(
          context.helper(NORMALIZE_PROPS),
          [
            createCallExpression(context.helper(GUARD_REACTIVE_PROPS), [
              propsExpression
            ])
          ]
        );
        break;
    }
  }
  return {
    props: propsExpression,
    directives: runtimeDirectives,
    patchFlag,
    dynamicPropNames,
    shouldUseBlock
  };
}
function dedupeProperties(properties) {
  const knownProps = /* @__PURE__ */ new Map();
  const deduped = [];
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    if (prop.key.type === 8 || !prop.key.isStatic) {
      deduped.push(prop);
      continue;
    }
    const name = prop.key.content;
    const existing = knownProps.get(name);
    if (existing) {
      if (name === "style" || name === "class" || isOn(name)) {
        mergeAsArray(existing, prop);
      }
    } else {
      knownProps.set(name, prop);
      deduped.push(prop);
    }
  }
  return deduped;
}
function mergeAsArray(existing, incoming) {
  if (existing.value.type === 17) {
    existing.value.elements.push(incoming.value);
  } else {
    existing.value = createArrayExpression(
      [existing.value, incoming.value],
      existing.loc
    );
  }
}
function buildDirectiveArgs(dir, context) {
  const dirArgs = [];
  const runtime = directiveImportMap.get(dir);
  if (runtime) {
    dirArgs.push(context.helperString(runtime));
  } else {
    {
      context.helper(RESOLVE_DIRECTIVE);
      context.directives.add(dir.name);
      dirArgs.push(toValidAssetId(dir.name, `directive`));
    }
  }
  const { loc } = dir;
  if (dir.exp)
    dirArgs.push(dir.exp);
  if (dir.arg) {
    if (!dir.exp) {
      dirArgs.push(`void 0`);
    }
    dirArgs.push(dir.arg);
  }
  if (Object.keys(dir.modifiers).length) {
    if (!dir.arg) {
      if (!dir.exp) {
        dirArgs.push(`void 0`);
      }
      dirArgs.push(`void 0`);
    }
    const trueExpression = createSimpleExpression(`true`, false, loc);
    dirArgs.push(
      createObjectExpression(
        dir.modifiers.map(
          (modifier) => createObjectProperty(modifier, trueExpression)
        ),
        loc
      )
    );
  }
  return createArrayExpression(dirArgs, dir.loc);
}
function stringifyDynamicPropNames(props) {
  let propsNamesString = `[`;
  for (let i = 0, l = props.length; i < l; i++) {
    propsNamesString += JSON.stringify(props[i]);
    if (i < l - 1)
      propsNamesString += ", ";
  }
  return propsNamesString + `]`;
}
function isComponentTag(tag) {
  return tag === "component" || tag === "Component";
}
function processSlotOutlet(node, context) {
  let slotName = `"default"`;
  let slotProps = void 0;
  const nonNameProps = [];
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i];
    if (p.type === 6) {
      if (p.value) {
        if (p.name === "name") {
          slotName = JSON.stringify(p.value.content);
        } else {
          p.name = camelize(p.name);
          nonNameProps.push(p);
        }
      }
    } else {
      if (p.name === "bind" && isStaticArgOf(p.arg, "name")) {
        if (p.exp) {
          slotName = p.exp;
        } else if (p.arg && p.arg.type === 4) {
          const name = camelize(p.arg.content);
          slotName = p.exp = createSimpleExpression(name, false, p.arg.loc);
        }
      } else {
        if (p.name === "bind" && p.arg && isStaticExp(p.arg)) {
          p.arg.content = camelize(p.arg.content);
        }
        nonNameProps.push(p);
      }
    }
  }
  if (nonNameProps.length > 0) {
    const { props, directives } = buildProps(
      node,
      context,
      nonNameProps,
      false,
      false
    );
    slotProps = props;
    if (directives.length) {
      context.onError(
        createCompilerError(
          36,
          directives[0].loc
        )
      );
    }
  }
  return {
    slotName,
    slotProps
  };
}
function createTransformProps(props = []) {
  return { props };
}
function rewriteFilter(node, context) {
  if (node.type === 4) {
    parseFilter(node, context);
  } else {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (typeof child !== "object")
        continue;
      if (child.type === 4) {
        parseFilter(child, context);
      } else if (child.type === 8) {
        rewriteFilter(node, context);
      } else if (child.type === 5) {
        rewriteFilter(child.content, context);
      }
    }
  }
}
function parseFilter(node, context) {
  const exp = node.content;
  let inSingle = false;
  let inDouble = false;
  let inTemplateString = false;
  let inRegex = false;
  let curly = 0;
  let square = 0;
  let paren = 0;
  let lastFilterIndex = 0;
  let c, prev, i, expression, filters = [];
  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 39 && prev !== 92)
        inSingle = false;
    } else if (inDouble) {
      if (c === 34 && prev !== 92)
        inDouble = false;
    } else if (inTemplateString) {
      if (c === 96 && prev !== 92)
        inTemplateString = false;
    } else if (inRegex) {
      if (c === 47 && prev !== 92)
        inRegex = false;
    } else if (c === 124 && // pipe
    exp.charCodeAt(i + 1) !== 124 && exp.charCodeAt(i - 1) !== 124 && !curly && !square && !paren) {
      if (expression === void 0) {
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 34:
          inDouble = true;
          break;
        case 39:
          inSingle = true;
          break;
        case 96:
          inTemplateString = true;
          break;
        case 40:
          paren++;
          break;
        case 41:
          paren--;
          break;
        case 91:
          square++;
          break;
        case 93:
          square--;
          break;
        case 123:
          curly++;
          break;
        case 125:
          curly--;
          break;
      }
      if (c === 47) {
        let j = i - 1;
        let p;
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== " ")
            break;
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }
  if (expression === void 0) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }
  function pushFilter() {
    filters.push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }
  if (filters.length) {
    warnDeprecation(
      "COMPILER_FILTERS",
      context,
      node.loc
    );
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i], context);
    }
    node.content = expression;
  }
}
function wrapFilter(exp, filter, context) {
  context.helper(RESOLVE_FILTER);
  const i = filter.indexOf("(");
  if (i < 0) {
    context.filters.add(filter);
    return `${toValidAssetId(filter, "filter")}(${exp})`;
  } else {
    const name = filter.slice(0, i);
    const args = filter.slice(i + 1);
    context.filters.add(name);
    return `${toValidAssetId(name, "filter")}(${exp}${args !== ")" ? "," + args : args}`;
  }
}
function getBaseTransformPreset(prefixIdentifiers) {
  return [
    [
      transformOnce,
      transformIf,
      transformMemo,
      transformFor,
      ...[transformFilter],
      ...true ? [transformExpression] : [],
      transformSlotOutlet,
      transformElement,
      trackSlotScopes,
      transformText
    ],
    {
      on: transformOn,
      bind: transformBind,
      model: transformModel
    }
  ];
}
function baseCompile(source, options = {}) {
  const onError = options.onError || defaultOnError;
  const isModuleMode = options.mode === "module";
  {
    if (options.prefixIdentifiers === true) {
      onError(createCompilerError(47));
    } else if (isModuleMode) {
      onError(createCompilerError(48));
    }
  }
  const prefixIdentifiers = false;
  if (options.cacheHandlers) {
    onError(createCompilerError(49));
  }
  if (options.scopeId && !isModuleMode) {
    onError(createCompilerError(50));
  }
  const resolvedOptions = extend({}, options, {
    prefixIdentifiers
  });
  const ast = isString(source) ? baseParse(source, resolvedOptions) : source;
  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset();
  transform(
    ast,
    extend({}, resolvedOptions, {
      nodeTransforms: [
        ...nodeTransforms,
        ...options.nodeTransforms || []
        // user transforms
      ],
      directiveTransforms: extend(
        {},
        directiveTransforms,
        options.directiveTransforms || {}
        // user transforms
      )
    })
  );
  return generate(ast, resolvedOptions);
}
var FRAGMENT, TELEPORT, SUSPENSE, KEEP_ALIVE, BASE_TRANSITION, OPEN_BLOCK, CREATE_BLOCK, CREATE_ELEMENT_BLOCK, CREATE_VNODE, CREATE_ELEMENT_VNODE, CREATE_COMMENT, CREATE_TEXT, CREATE_STATIC, RESOLVE_COMPONENT, RESOLVE_DYNAMIC_COMPONENT, RESOLVE_DIRECTIVE, RESOLVE_FILTER, WITH_DIRECTIVES, RENDER_LIST, RENDER_SLOT, CREATE_SLOTS, TO_DISPLAY_STRING, MERGE_PROPS, NORMALIZE_CLASS, NORMALIZE_STYLE, NORMALIZE_PROPS, GUARD_REACTIVE_PROPS, TO_HANDLERS, CAMELIZE, CAPITALIZE, TO_HANDLER_KEY, SET_BLOCK_TRACKING, PUSH_SCOPE_ID, POP_SCOPE_ID, WITH_CTX, UNREF, IS_REF, WITH_MEMO, IS_MEMO_SAME, helperNameMap, Namespaces, NodeTypes, ElementTypes, ConstantTypes, locStub, defaultDelimitersOpen, defaultDelimitersClose, Sequences, Tokenizer, CompilerDeprecationTypes, deprecationData, ErrorCodes, errorMessages, isFunctionType, isStaticProperty, isStaticPropertyKey, TS_NODE_TYPES, isStaticExp, nonIdentifierRE, isSimpleIdentifier, validFirstIdentCharRE, validIdentCharRE, whitespaceRE, isMemberExpressionBrowser, isMemberExpressionNode, isMemberExpression, propsHelperSet, forAliasRE, defaultParserOptions, currentOptions, currentRoot, currentInput, currentOpenTag, currentProp, currentAttrValue, currentAttrStartIndex, currentAttrEndIndex, inPre, inVPre, currentVPreBoundary, stack, tokenizer, forIteratorRE, stripParensRE, specialTemplateDir, windowsNewlineRE, allowHoistedHelperSet, PURE_ANNOTATION, aliasHelper, prohibitedKeywordRE, stripStringRE, transformExpression, transformIf, transformFor, defaultFallback, trackSlotScopes, trackVForSlotScopes, buildClientSlotFn, directiveImportMap, transformElement, transformSlotOutlet, fnExpRE, transformOn, transformBind, injectPrefix, transformText, seen$1, transformOnce, transformModel, validDivisionCharRE, transformFilter, seen, transformMemo, BindingTypes, noopDirectiveTransform;
var init_compiler_core_esm_bundler = __esm({
  "node_modules/@vue/compiler-core/dist/compiler-core.esm-bundler.js"() {
    init_shared_esm_bundler();
    init_shared_esm_bundler();
    FRAGMENT = Symbol(true ? `Fragment` : ``);
    TELEPORT = Symbol(true ? `Teleport` : ``);
    SUSPENSE = Symbol(true ? `Suspense` : ``);
    KEEP_ALIVE = Symbol(true ? `KeepAlive` : ``);
    BASE_TRANSITION = Symbol(true ? `BaseTransition` : ``);
    OPEN_BLOCK = Symbol(true ? `openBlock` : ``);
    CREATE_BLOCK = Symbol(true ? `createBlock` : ``);
    CREATE_ELEMENT_BLOCK = Symbol(true ? `createElementBlock` : ``);
    CREATE_VNODE = Symbol(true ? `createVNode` : ``);
    CREATE_ELEMENT_VNODE = Symbol(true ? `createElementVNode` : ``);
    CREATE_COMMENT = Symbol(true ? `createCommentVNode` : ``);
    CREATE_TEXT = Symbol(true ? `createTextVNode` : ``);
    CREATE_STATIC = Symbol(true ? `createStaticVNode` : ``);
    RESOLVE_COMPONENT = Symbol(true ? `resolveComponent` : ``);
    RESOLVE_DYNAMIC_COMPONENT = Symbol(
      true ? `resolveDynamicComponent` : ``
    );
    RESOLVE_DIRECTIVE = Symbol(true ? `resolveDirective` : ``);
    RESOLVE_FILTER = Symbol(true ? `resolveFilter` : ``);
    WITH_DIRECTIVES = Symbol(true ? `withDirectives` : ``);
    RENDER_LIST = Symbol(true ? `renderList` : ``);
    RENDER_SLOT = Symbol(true ? `renderSlot` : ``);
    CREATE_SLOTS = Symbol(true ? `createSlots` : ``);
    TO_DISPLAY_STRING = Symbol(true ? `toDisplayString` : ``);
    MERGE_PROPS = Symbol(true ? `mergeProps` : ``);
    NORMALIZE_CLASS = Symbol(true ? `normalizeClass` : ``);
    NORMALIZE_STYLE = Symbol(true ? `normalizeStyle` : ``);
    NORMALIZE_PROPS = Symbol(true ? `normalizeProps` : ``);
    GUARD_REACTIVE_PROPS = Symbol(true ? `guardReactiveProps` : ``);
    TO_HANDLERS = Symbol(true ? `toHandlers` : ``);
    CAMELIZE = Symbol(true ? `camelize` : ``);
    CAPITALIZE = Symbol(true ? `capitalize` : ``);
    TO_HANDLER_KEY = Symbol(true ? `toHandlerKey` : ``);
    SET_BLOCK_TRACKING = Symbol(true ? `setBlockTracking` : ``);
    PUSH_SCOPE_ID = Symbol(true ? `pushScopeId` : ``);
    POP_SCOPE_ID = Symbol(true ? `popScopeId` : ``);
    WITH_CTX = Symbol(true ? `withCtx` : ``);
    UNREF = Symbol(true ? `unref` : ``);
    IS_REF = Symbol(true ? `isRef` : ``);
    WITH_MEMO = Symbol(true ? `withMemo` : ``);
    IS_MEMO_SAME = Symbol(true ? `isMemoSame` : ``);
    helperNameMap = {
      [FRAGMENT]: `Fragment`,
      [TELEPORT]: `Teleport`,
      [SUSPENSE]: `Suspense`,
      [KEEP_ALIVE]: `KeepAlive`,
      [BASE_TRANSITION]: `BaseTransition`,
      [OPEN_BLOCK]: `openBlock`,
      [CREATE_BLOCK]: `createBlock`,
      [CREATE_ELEMENT_BLOCK]: `createElementBlock`,
      [CREATE_VNODE]: `createVNode`,
      [CREATE_ELEMENT_VNODE]: `createElementVNode`,
      [CREATE_COMMENT]: `createCommentVNode`,
      [CREATE_TEXT]: `createTextVNode`,
      [CREATE_STATIC]: `createStaticVNode`,
      [RESOLVE_COMPONENT]: `resolveComponent`,
      [RESOLVE_DYNAMIC_COMPONENT]: `resolveDynamicComponent`,
      [RESOLVE_DIRECTIVE]: `resolveDirective`,
      [RESOLVE_FILTER]: `resolveFilter`,
      [WITH_DIRECTIVES]: `withDirectives`,
      [RENDER_LIST]: `renderList`,
      [RENDER_SLOT]: `renderSlot`,
      [CREATE_SLOTS]: `createSlots`,
      [TO_DISPLAY_STRING]: `toDisplayString`,
      [MERGE_PROPS]: `mergeProps`,
      [NORMALIZE_CLASS]: `normalizeClass`,
      [NORMALIZE_STYLE]: `normalizeStyle`,
      [NORMALIZE_PROPS]: `normalizeProps`,
      [GUARD_REACTIVE_PROPS]: `guardReactiveProps`,
      [TO_HANDLERS]: `toHandlers`,
      [CAMELIZE]: `camelize`,
      [CAPITALIZE]: `capitalize`,
      [TO_HANDLER_KEY]: `toHandlerKey`,
      [SET_BLOCK_TRACKING]: `setBlockTracking`,
      [PUSH_SCOPE_ID]: `pushScopeId`,
      [POP_SCOPE_ID]: `popScopeId`,
      [WITH_CTX]: `withCtx`,
      [UNREF]: `unref`,
      [IS_REF]: `isRef`,
      [WITH_MEMO]: `withMemo`,
      [IS_MEMO_SAME]: `isMemoSame`
    };
    Namespaces = {
      "HTML": 0,
      "0": "HTML",
      "SVG": 1,
      "1": "SVG",
      "MATH_ML": 2,
      "2": "MATH_ML"
    };
    NodeTypes = {
      "ROOT": 0,
      "0": "ROOT",
      "ELEMENT": 1,
      "1": "ELEMENT",
      "TEXT": 2,
      "2": "TEXT",
      "COMMENT": 3,
      "3": "COMMENT",
      "SIMPLE_EXPRESSION": 4,
      "4": "SIMPLE_EXPRESSION",
      "INTERPOLATION": 5,
      "5": "INTERPOLATION",
      "ATTRIBUTE": 6,
      "6": "ATTRIBUTE",
      "DIRECTIVE": 7,
      "7": "DIRECTIVE",
      "COMPOUND_EXPRESSION": 8,
      "8": "COMPOUND_EXPRESSION",
      "IF": 9,
      "9": "IF",
      "IF_BRANCH": 10,
      "10": "IF_BRANCH",
      "FOR": 11,
      "11": "FOR",
      "TEXT_CALL": 12,
      "12": "TEXT_CALL",
      "VNODE_CALL": 13,
      "13": "VNODE_CALL",
      "JS_CALL_EXPRESSION": 14,
      "14": "JS_CALL_EXPRESSION",
      "JS_OBJECT_EXPRESSION": 15,
      "15": "JS_OBJECT_EXPRESSION",
      "JS_PROPERTY": 16,
      "16": "JS_PROPERTY",
      "JS_ARRAY_EXPRESSION": 17,
      "17": "JS_ARRAY_EXPRESSION",
      "JS_FUNCTION_EXPRESSION": 18,
      "18": "JS_FUNCTION_EXPRESSION",
      "JS_CONDITIONAL_EXPRESSION": 19,
      "19": "JS_CONDITIONAL_EXPRESSION",
      "JS_CACHE_EXPRESSION": 20,
      "20": "JS_CACHE_EXPRESSION",
      "JS_BLOCK_STATEMENT": 21,
      "21": "JS_BLOCK_STATEMENT",
      "JS_TEMPLATE_LITERAL": 22,
      "22": "JS_TEMPLATE_LITERAL",
      "JS_IF_STATEMENT": 23,
      "23": "JS_IF_STATEMENT",
      "JS_ASSIGNMENT_EXPRESSION": 24,
      "24": "JS_ASSIGNMENT_EXPRESSION",
      "JS_SEQUENCE_EXPRESSION": 25,
      "25": "JS_SEQUENCE_EXPRESSION",
      "JS_RETURN_STATEMENT": 26,
      "26": "JS_RETURN_STATEMENT"
    };
    ElementTypes = {
      "ELEMENT": 0,
      "0": "ELEMENT",
      "COMPONENT": 1,
      "1": "COMPONENT",
      "SLOT": 2,
      "2": "SLOT",
      "TEMPLATE": 3,
      "3": "TEMPLATE"
    };
    ConstantTypes = {
      "NOT_CONSTANT": 0,
      "0": "NOT_CONSTANT",
      "CAN_SKIP_PATCH": 1,
      "1": "CAN_SKIP_PATCH",
      "CAN_HOIST": 2,
      "2": "CAN_HOIST",
      "CAN_STRINGIFY": 3,
      "3": "CAN_STRINGIFY"
    };
    locStub = {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 1, offset: 0 },
      source: ""
    };
    defaultDelimitersOpen = new Uint8Array([123, 123]);
    defaultDelimitersClose = new Uint8Array([125, 125]);
    Sequences = {
      Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
      // CDATA[
      CdataEnd: new Uint8Array([93, 93, 62]),
      // ]]>
      CommentEnd: new Uint8Array([45, 45, 62]),
      // `-->`
      ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
      // `<\/script`
      StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
      // `</style`
      TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
      // `</title`
      TextareaEnd: new Uint8Array([
        60,
        47,
        116,
        101,
        120,
        116,
        97,
        114,
        101,
        97
      ])
      // `</textarea
    };
    Tokenizer = class {
      constructor(stack2, cbs) {
        this.stack = stack2;
        this.cbs = cbs;
        this.state = 1;
        this.buffer = "";
        this.sectionStart = 0;
        this.index = 0;
        this.entityStart = 0;
        this.baseState = 1;
        this.inRCDATA = false;
        this.inXML = false;
        this.inVPre = false;
        this.newlines = [];
        this.mode = 0;
        this.delimiterOpen = defaultDelimitersOpen;
        this.delimiterClose = defaultDelimitersClose;
        this.delimiterIndex = -1;
        this.currentSequence = void 0;
        this.sequenceIndex = 0;
      }
      get inSFCRoot() {
        return this.mode === 2 && this.stack.length === 0;
      }
      reset() {
        this.state = 1;
        this.mode = 0;
        this.buffer = "";
        this.sectionStart = 0;
        this.index = 0;
        this.baseState = 1;
        this.inRCDATA = false;
        this.currentSequence = void 0;
        this.newlines.length = 0;
        this.delimiterOpen = defaultDelimitersOpen;
        this.delimiterClose = defaultDelimitersClose;
      }
      /**
       * Generate Position object with line / column information using recorded
       * newline positions. We know the index is always going to be an already
       * processed index, so all the newlines up to this index should have been
       * recorded.
       */
      getPos(index) {
        let line = 1;
        let column = index + 1;
        for (let i = this.newlines.length - 1; i >= 0; i--) {
          const newlineIndex = this.newlines[i];
          if (index > newlineIndex) {
            line = i + 2;
            column = index - newlineIndex;
            break;
          }
        }
        return {
          column,
          line,
          offset: index
        };
      }
      peek() {
        return this.buffer.charCodeAt(this.index + 1);
      }
      stateText(c) {
        if (c === 60) {
          if (this.index > this.sectionStart) {
            this.cbs.ontext(this.sectionStart, this.index);
          }
          this.state = 5;
          this.sectionStart = this.index;
        } else if (!this.inVPre && c === this.delimiterOpen[0]) {
          this.state = 2;
          this.delimiterIndex = 0;
          this.stateInterpolationOpen(c);
        }
      }
      stateInterpolationOpen(c) {
        if (c === this.delimiterOpen[this.delimiterIndex]) {
          if (this.delimiterIndex === this.delimiterOpen.length - 1) {
            const start = this.index + 1 - this.delimiterOpen.length;
            if (start > this.sectionStart) {
              this.cbs.ontext(this.sectionStart, start);
            }
            this.state = 3;
            this.sectionStart = start;
          } else {
            this.delimiterIndex++;
          }
        } else if (this.inRCDATA) {
          this.state = 32;
          this.stateInRCDATA(c);
        } else {
          this.state = 1;
          this.stateText(c);
        }
      }
      stateInterpolation(c) {
        if (c === this.delimiterClose[0]) {
          this.state = 4;
          this.delimiterIndex = 0;
          this.stateInterpolationClose(c);
        }
      }
      stateInterpolationClose(c) {
        if (c === this.delimiterClose[this.delimiterIndex]) {
          if (this.delimiterIndex === this.delimiterClose.length - 1) {
            this.cbs.oninterpolation(this.sectionStart, this.index + 1);
            if (this.inRCDATA) {
              this.state = 32;
            } else {
              this.state = 1;
            }
            this.sectionStart = this.index + 1;
          } else {
            this.delimiterIndex++;
          }
        } else {
          this.state = 3;
          this.stateInterpolation(c);
        }
      }
      stateSpecialStartSequence(c) {
        const isEnd = this.sequenceIndex === this.currentSequence.length;
        const isMatch = isEnd ? (
          // If we are at the end of the sequence, make sure the tag name has ended
          isEndOfTagSection(c)
        ) : (
          // Otherwise, do a case-insensitive comparison
          (c | 32) === this.currentSequence[this.sequenceIndex]
        );
        if (!isMatch) {
          this.inRCDATA = false;
        } else if (!isEnd) {
          this.sequenceIndex++;
          return;
        }
        this.sequenceIndex = 0;
        this.state = 6;
        this.stateInTagName(c);
      }
      /** Look for an end tag. For <title> and <textarea>, also decode entities. */
      stateInRCDATA(c) {
        if (this.sequenceIndex === this.currentSequence.length) {
          if (c === 62 || isWhitespace(c)) {
            const endOfText = this.index - this.currentSequence.length;
            if (this.sectionStart < endOfText) {
              const actualIndex = this.index;
              this.index = endOfText;
              this.cbs.ontext(this.sectionStart, endOfText);
              this.index = actualIndex;
            }
            this.sectionStart = endOfText + 2;
            this.stateInClosingTagName(c);
            this.inRCDATA = false;
            return;
          }
          this.sequenceIndex = 0;
        }
        if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
          this.sequenceIndex += 1;
        } else if (this.sequenceIndex === 0) {
          if (this.currentSequence === Sequences.TitleEnd || this.currentSequence === Sequences.TextareaEnd && !this.inSFCRoot) {
            if (c === this.delimiterOpen[0]) {
              this.state = 2;
              this.delimiterIndex = 0;
              this.stateInterpolationOpen(c);
            }
          } else if (this.fastForwardTo(60)) {
            this.sequenceIndex = 1;
          }
        } else {
          this.sequenceIndex = Number(c === 60);
        }
      }
      stateCDATASequence(c) {
        if (c === Sequences.Cdata[this.sequenceIndex]) {
          if (++this.sequenceIndex === Sequences.Cdata.length) {
            this.state = 28;
            this.currentSequence = Sequences.CdataEnd;
            this.sequenceIndex = 0;
            this.sectionStart = this.index + 1;
          }
        } else {
          this.sequenceIndex = 0;
          this.state = 23;
          this.stateInDeclaration(c);
        }
      }
      /**
       * When we wait for one specific character, we can speed things up
       * by skipping through the buffer until we find it.
       *
       * @returns Whether the character was found.
       */
      fastForwardTo(c) {
        while (++this.index < this.buffer.length) {
          const cc = this.buffer.charCodeAt(this.index);
          if (cc === 10) {
            this.newlines.push(this.index);
          }
          if (cc === c) {
            return true;
          }
        }
        this.index = this.buffer.length - 1;
        return false;
      }
      /**
       * Comments and CDATA end with `-->` and `]]>`.
       *
       * Their common qualities are:
       * - Their end sequences have a distinct character they start with.
       * - That character is then repeated, so we have to check multiple repeats.
       * - All characters but the start character of the sequence can be skipped.
       */
      stateInCommentLike(c) {
        if (c === this.currentSequence[this.sequenceIndex]) {
          if (++this.sequenceIndex === this.currentSequence.length) {
            if (this.currentSequence === Sequences.CdataEnd) {
              this.cbs.oncdata(this.sectionStart, this.index - 2);
            } else {
              this.cbs.oncomment(this.sectionStart, this.index - 2);
            }
            this.sequenceIndex = 0;
            this.sectionStart = this.index + 1;
            this.state = 1;
          }
        } else if (this.sequenceIndex === 0) {
          if (this.fastForwardTo(this.currentSequence[0])) {
            this.sequenceIndex = 1;
          }
        } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
          this.sequenceIndex = 0;
        }
      }
      startSpecial(sequence, offset) {
        this.enterRCDATA(sequence, offset);
        this.state = 31;
      }
      enterRCDATA(sequence, offset) {
        this.inRCDATA = true;
        this.currentSequence = sequence;
        this.sequenceIndex = offset;
      }
      stateBeforeTagName(c) {
        if (c === 33) {
          this.state = 22;
          this.sectionStart = this.index + 1;
        } else if (c === 63) {
          this.state = 24;
          this.sectionStart = this.index + 1;
        } else if (isTagStartChar(c)) {
          this.sectionStart = this.index;
          if (this.mode === 0) {
            this.state = 6;
          } else if (this.inSFCRoot) {
            this.state = 34;
          } else if (!this.inXML) {
            if (c === 116) {
              this.state = 30;
            } else {
              this.state = c === 115 ? 29 : 6;
            }
          } else {
            this.state = 6;
          }
        } else if (c === 47) {
          this.state = 8;
        } else {
          this.state = 1;
          this.stateText(c);
        }
      }
      stateInTagName(c) {
        if (isEndOfTagSection(c)) {
          this.handleTagName(c);
        }
      }
      stateInSFCRootTagName(c) {
        if (isEndOfTagSection(c)) {
          const tag = this.buffer.slice(this.sectionStart, this.index);
          if (tag !== "template") {
            this.enterRCDATA(toCharCodes(`</` + tag), 0);
          }
          this.handleTagName(c);
        }
      }
      handleTagName(c) {
        this.cbs.onopentagname(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.state = 11;
        this.stateBeforeAttrName(c);
      }
      stateBeforeClosingTagName(c) {
        if (isWhitespace(c))
          ;
        else if (c === 62) {
          if (true) {
            this.cbs.onerr(14, this.index);
          }
          this.state = 1;
          this.sectionStart = this.index + 1;
        } else {
          this.state = isTagStartChar(c) ? 9 : 27;
          this.sectionStart = this.index;
        }
      }
      stateInClosingTagName(c) {
        if (c === 62 || isWhitespace(c)) {
          this.cbs.onclosetag(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.state = 10;
          this.stateAfterClosingTagName(c);
        }
      }
      stateAfterClosingTagName(c) {
        if (c === 62) {
          this.state = 1;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeAttrName(c) {
        if (c === 62) {
          this.cbs.onopentagend(this.index);
          if (this.inRCDATA) {
            this.state = 32;
          } else {
            this.state = 1;
          }
          this.sectionStart = this.index + 1;
        } else if (c === 47) {
          this.state = 7;
          if (this.peek() !== 62) {
            this.cbs.onerr(22, this.index);
          }
        } else if (c === 60 && this.peek() === 47) {
          this.cbs.onopentagend(this.index);
          this.state = 5;
          this.sectionStart = this.index;
        } else if (!isWhitespace(c)) {
          if (c === 61) {
            this.cbs.onerr(
              19,
              this.index
            );
          }
          this.handleAttrStart(c);
        }
      }
      handleAttrStart(c) {
        if (c === 118 && this.peek() === 45) {
          this.state = 13;
          this.sectionStart = this.index;
        } else if (c === 46 || c === 58 || c === 64 || c === 35) {
          this.cbs.ondirname(this.index, this.index + 1);
          this.state = 14;
          this.sectionStart = this.index + 1;
        } else {
          this.state = 12;
          this.sectionStart = this.index;
        }
      }
      stateInSelfClosingTag(c) {
        if (c === 62) {
          this.cbs.onselfclosingtag(this.index);
          this.state = 1;
          this.sectionStart = this.index + 1;
          this.inRCDATA = false;
        } else if (!isWhitespace(c)) {
          this.state = 11;
          this.stateBeforeAttrName(c);
        }
      }
      stateInAttrName(c) {
        if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.onattribname(this.sectionStart, this.index);
          this.handleAttrNameEnd(c);
        } else if (c === 34 || c === 39 || c === 60) {
          this.cbs.onerr(
            17,
            this.index
          );
        }
      }
      stateInDirName(c) {
        if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.ondirname(this.sectionStart, this.index);
          this.handleAttrNameEnd(c);
        } else if (c === 58) {
          this.cbs.ondirname(this.sectionStart, this.index);
          this.state = 14;
          this.sectionStart = this.index + 1;
        } else if (c === 46) {
          this.cbs.ondirname(this.sectionStart, this.index);
          this.state = 16;
          this.sectionStart = this.index + 1;
        }
      }
      stateInDirArg(c) {
        if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.ondirarg(this.sectionStart, this.index);
          this.handleAttrNameEnd(c);
        } else if (c === 91) {
          this.state = 15;
        } else if (c === 46) {
          this.cbs.ondirarg(this.sectionStart, this.index);
          this.state = 16;
          this.sectionStart = this.index + 1;
        }
      }
      stateInDynamicDirArg(c) {
        if (c === 93) {
          this.state = 14;
        } else if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.ondirarg(this.sectionStart, this.index + 1);
          this.handleAttrNameEnd(c);
          if (true) {
            this.cbs.onerr(
              27,
              this.index
            );
          }
        }
      }
      stateInDirModifier(c) {
        if (c === 61 || isEndOfTagSection(c)) {
          this.cbs.ondirmodifier(this.sectionStart, this.index);
          this.handleAttrNameEnd(c);
        } else if (c === 46) {
          this.cbs.ondirmodifier(this.sectionStart, this.index);
          this.sectionStart = this.index + 1;
        }
      }
      handleAttrNameEnd(c) {
        this.sectionStart = this.index;
        this.state = 17;
        this.cbs.onattribnameend(this.index);
        this.stateAfterAttrName(c);
      }
      stateAfterAttrName(c) {
        if (c === 61) {
          this.state = 18;
        } else if (c === 47 || c === 62) {
          this.cbs.onattribend(0, this.sectionStart);
          this.sectionStart = -1;
          this.state = 11;
          this.stateBeforeAttrName(c);
        } else if (!isWhitespace(c)) {
          this.cbs.onattribend(0, this.sectionStart);
          this.handleAttrStart(c);
        }
      }
      stateBeforeAttrValue(c) {
        if (c === 34) {
          this.state = 19;
          this.sectionStart = this.index + 1;
        } else if (c === 39) {
          this.state = 20;
          this.sectionStart = this.index + 1;
        } else if (!isWhitespace(c)) {
          this.sectionStart = this.index;
          this.state = 21;
          this.stateInAttrValueNoQuotes(c);
        }
      }
      handleInAttrValue(c, quote) {
        if (c === quote || this.fastForwardTo(quote)) {
          this.cbs.onattribdata(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.cbs.onattribend(
            quote === 34 ? 3 : 2,
            this.index + 1
          );
          this.state = 11;
        }
      }
      stateInAttrValueDoubleQuotes(c) {
        this.handleInAttrValue(c, 34);
      }
      stateInAttrValueSingleQuotes(c) {
        this.handleInAttrValue(c, 39);
      }
      stateInAttrValueNoQuotes(c) {
        if (isWhitespace(c) || c === 62) {
          this.cbs.onattribdata(this.sectionStart, this.index);
          this.sectionStart = -1;
          this.cbs.onattribend(1, this.index);
          this.state = 11;
          this.stateBeforeAttrName(c);
        } else if (c === 34 || c === 39 || c === 60 || c === 61 || c === 96) {
          this.cbs.onerr(
            18,
            this.index
          );
        } else
          ;
      }
      stateBeforeDeclaration(c) {
        if (c === 91) {
          this.state = 26;
          this.sequenceIndex = 0;
        } else {
          this.state = c === 45 ? 25 : 23;
        }
      }
      stateInDeclaration(c) {
        if (c === 62 || this.fastForwardTo(62)) {
          this.state = 1;
          this.sectionStart = this.index + 1;
        }
      }
      stateInProcessingInstruction(c) {
        if (c === 62 || this.fastForwardTo(62)) {
          this.cbs.onprocessinginstruction(this.sectionStart, this.index);
          this.state = 1;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeComment(c) {
        if (c === 45) {
          this.state = 28;
          this.currentSequence = Sequences.CommentEnd;
          this.sequenceIndex = 2;
          this.sectionStart = this.index + 1;
        } else {
          this.state = 23;
        }
      }
      stateInSpecialComment(c) {
        if (c === 62 || this.fastForwardTo(62)) {
          this.cbs.oncomment(this.sectionStart, this.index);
          this.state = 1;
          this.sectionStart = this.index + 1;
        }
      }
      stateBeforeSpecialS(c) {
        if (c === Sequences.ScriptEnd[3]) {
          this.startSpecial(Sequences.ScriptEnd, 4);
        } else if (c === Sequences.StyleEnd[3]) {
          this.startSpecial(Sequences.StyleEnd, 4);
        } else {
          this.state = 6;
          this.stateInTagName(c);
        }
      }
      stateBeforeSpecialT(c) {
        if (c === Sequences.TitleEnd[3]) {
          this.startSpecial(Sequences.TitleEnd, 4);
        } else if (c === Sequences.TextareaEnd[3]) {
          this.startSpecial(Sequences.TextareaEnd, 4);
        } else {
          this.state = 6;
          this.stateInTagName(c);
        }
      }
      startEntity() {
      }
      stateInEntity() {
      }
      /**
       * Iterates through the buffer, calling the function corresponding to the current state.
       *
       * States that are more likely to be hit are higher up, as a performance improvement.
       */
      parse(input) {
        this.buffer = input;
        while (this.index < this.buffer.length) {
          const c = this.buffer.charCodeAt(this.index);
          if (c === 10) {
            this.newlines.push(this.index);
          }
          switch (this.state) {
            case 1: {
              this.stateText(c);
              break;
            }
            case 2: {
              this.stateInterpolationOpen(c);
              break;
            }
            case 3: {
              this.stateInterpolation(c);
              break;
            }
            case 4: {
              this.stateInterpolationClose(c);
              break;
            }
            case 31: {
              this.stateSpecialStartSequence(c);
              break;
            }
            case 32: {
              this.stateInRCDATA(c);
              break;
            }
            case 26: {
              this.stateCDATASequence(c);
              break;
            }
            case 19: {
              this.stateInAttrValueDoubleQuotes(c);
              break;
            }
            case 12: {
              this.stateInAttrName(c);
              break;
            }
            case 13: {
              this.stateInDirName(c);
              break;
            }
            case 14: {
              this.stateInDirArg(c);
              break;
            }
            case 15: {
              this.stateInDynamicDirArg(c);
              break;
            }
            case 16: {
              this.stateInDirModifier(c);
              break;
            }
            case 28: {
              this.stateInCommentLike(c);
              break;
            }
            case 27: {
              this.stateInSpecialComment(c);
              break;
            }
            case 11: {
              this.stateBeforeAttrName(c);
              break;
            }
            case 6: {
              this.stateInTagName(c);
              break;
            }
            case 34: {
              this.stateInSFCRootTagName(c);
              break;
            }
            case 9: {
              this.stateInClosingTagName(c);
              break;
            }
            case 5: {
              this.stateBeforeTagName(c);
              break;
            }
            case 17: {
              this.stateAfterAttrName(c);
              break;
            }
            case 20: {
              this.stateInAttrValueSingleQuotes(c);
              break;
            }
            case 18: {
              this.stateBeforeAttrValue(c);
              break;
            }
            case 8: {
              this.stateBeforeClosingTagName(c);
              break;
            }
            case 10: {
              this.stateAfterClosingTagName(c);
              break;
            }
            case 29: {
              this.stateBeforeSpecialS(c);
              break;
            }
            case 30: {
              this.stateBeforeSpecialT(c);
              break;
            }
            case 21: {
              this.stateInAttrValueNoQuotes(c);
              break;
            }
            case 7: {
              this.stateInSelfClosingTag(c);
              break;
            }
            case 23: {
              this.stateInDeclaration(c);
              break;
            }
            case 22: {
              this.stateBeforeDeclaration(c);
              break;
            }
            case 25: {
              this.stateBeforeComment(c);
              break;
            }
            case 24: {
              this.stateInProcessingInstruction(c);
              break;
            }
            case 33: {
              this.stateInEntity();
              break;
            }
          }
          this.index++;
        }
        this.cleanup();
        this.finish();
      }
      /**
       * Remove data that has already been consumed from the buffer.
       */
      cleanup() {
        if (this.sectionStart !== this.index) {
          if (this.state === 1 || this.state === 32 && this.sequenceIndex === 0) {
            this.cbs.ontext(this.sectionStart, this.index);
            this.sectionStart = this.index;
          } else if (this.state === 19 || this.state === 20 || this.state === 21) {
            this.cbs.onattribdata(this.sectionStart, this.index);
            this.sectionStart = this.index;
          }
        }
      }
      finish() {
        this.handleTrailingData();
        this.cbs.onend();
      }
      /** Handle any trailing data. */
      handleTrailingData() {
        const endIndex = this.buffer.length;
        if (this.sectionStart >= endIndex) {
          return;
        }
        if (this.state === 28) {
          if (this.currentSequence === Sequences.CdataEnd) {
            this.cbs.oncdata(this.sectionStart, endIndex);
          } else {
            this.cbs.oncomment(this.sectionStart, endIndex);
          }
        } else if (this.state === 6 || this.state === 11 || this.state === 18 || this.state === 17 || this.state === 12 || this.state === 13 || this.state === 14 || this.state === 15 || this.state === 16 || this.state === 20 || this.state === 19 || this.state === 21 || this.state === 9)
          ;
        else {
          this.cbs.ontext(this.sectionStart, endIndex);
        }
      }
      emitCodePoint(cp, consumed) {
      }
    };
    CompilerDeprecationTypes = {
      "COMPILER_IS_ON_ELEMENT": "COMPILER_IS_ON_ELEMENT",
      "COMPILER_V_BIND_SYNC": "COMPILER_V_BIND_SYNC",
      "COMPILER_V_BIND_OBJECT_ORDER": "COMPILER_V_BIND_OBJECT_ORDER",
      "COMPILER_V_ON_NATIVE": "COMPILER_V_ON_NATIVE",
      "COMPILER_V_IF_V_FOR_PRECEDENCE": "COMPILER_V_IF_V_FOR_PRECEDENCE",
      "COMPILER_NATIVE_TEMPLATE": "COMPILER_NATIVE_TEMPLATE",
      "COMPILER_INLINE_TEMPLATE": "COMPILER_INLINE_TEMPLATE",
      "COMPILER_FILTERS": "COMPILER_FILTERS"
    };
    deprecationData = {
      ["COMPILER_IS_ON_ELEMENT"]: {
        message: `Platform-native elements with "is" prop will no longer be treated as components in Vue 3 unless the "is" value is explicitly prefixed with "vue:".`,
        link: `https://v3-migration.vuejs.org/breaking-changes/custom-elements-interop.html`
      },
      ["COMPILER_V_BIND_SYNC"]: {
        message: (key) => `.sync modifier for v-bind has been removed. Use v-model with argument instead. \`v-bind:${key}.sync\` should be changed to \`v-model:${key}\`.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/v-model.html`
      },
      ["COMPILER_V_BIND_OBJECT_ORDER"]: {
        message: `v-bind="obj" usage is now order sensitive and behaves like JavaScript object spread: it will now overwrite an existing non-mergeable attribute that appears before v-bind in the case of conflict. To retain 2.x behavior, move v-bind to make it the first attribute. You can also suppress this warning if the usage is intended.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/v-bind.html`
      },
      ["COMPILER_V_ON_NATIVE"]: {
        message: `.native modifier for v-on has been removed as is no longer necessary.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/v-on-native-modifier-removed.html`
      },
      ["COMPILER_V_IF_V_FOR_PRECEDENCE"]: {
        message: `v-if / v-for precedence when used on the same element has changed in Vue 3: v-if now takes higher precedence and will no longer have access to v-for scope variables. It is best to avoid the ambiguity with <template> tags or use a computed property that filters v-for data source.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/v-if-v-for.html`
      },
      ["COMPILER_NATIVE_TEMPLATE"]: {
        message: `<template> with no special directives will render as a native template element instead of its inner content in Vue 3.`
      },
      ["COMPILER_INLINE_TEMPLATE"]: {
        message: `"inline-template" has been removed in Vue 3.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/inline-template-attribute.html`
      },
      ["COMPILER_FILTERS"]: {
        message: `filters have been removed in Vue 3. The "|" symbol will be treated as native JavaScript bitwise OR operator. Use method calls or computed properties instead.`,
        link: `https://v3-migration.vuejs.org/breaking-changes/filters.html`
      }
    };
    ErrorCodes = {
      "ABRUPT_CLOSING_OF_EMPTY_COMMENT": 0,
      "0": "ABRUPT_CLOSING_OF_EMPTY_COMMENT",
      "CDATA_IN_HTML_CONTENT": 1,
      "1": "CDATA_IN_HTML_CONTENT",
      "DUPLICATE_ATTRIBUTE": 2,
      "2": "DUPLICATE_ATTRIBUTE",
      "END_TAG_WITH_ATTRIBUTES": 3,
      "3": "END_TAG_WITH_ATTRIBUTES",
      "END_TAG_WITH_TRAILING_SOLIDUS": 4,
      "4": "END_TAG_WITH_TRAILING_SOLIDUS",
      "EOF_BEFORE_TAG_NAME": 5,
      "5": "EOF_BEFORE_TAG_NAME",
      "EOF_IN_CDATA": 6,
      "6": "EOF_IN_CDATA",
      "EOF_IN_COMMENT": 7,
      "7": "EOF_IN_COMMENT",
      "EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT": 8,
      "8": "EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT",
      "EOF_IN_TAG": 9,
      "9": "EOF_IN_TAG",
      "INCORRECTLY_CLOSED_COMMENT": 10,
      "10": "INCORRECTLY_CLOSED_COMMENT",
      "INCORRECTLY_OPENED_COMMENT": 11,
      "11": "INCORRECTLY_OPENED_COMMENT",
      "INVALID_FIRST_CHARACTER_OF_TAG_NAME": 12,
      "12": "INVALID_FIRST_CHARACTER_OF_TAG_NAME",
      "MISSING_ATTRIBUTE_VALUE": 13,
      "13": "MISSING_ATTRIBUTE_VALUE",
      "MISSING_END_TAG_NAME": 14,
      "14": "MISSING_END_TAG_NAME",
      "MISSING_WHITESPACE_BETWEEN_ATTRIBUTES": 15,
      "15": "MISSING_WHITESPACE_BETWEEN_ATTRIBUTES",
      "NESTED_COMMENT": 16,
      "16": "NESTED_COMMENT",
      "UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME": 17,
      "17": "UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME",
      "UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE": 18,
      "18": "UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE",
      "UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME": 19,
      "19": "UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME",
      "UNEXPECTED_NULL_CHARACTER": 20,
      "20": "UNEXPECTED_NULL_CHARACTER",
      "UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME": 21,
      "21": "UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME",
      "UNEXPECTED_SOLIDUS_IN_TAG": 22,
      "22": "UNEXPECTED_SOLIDUS_IN_TAG",
      "X_INVALID_END_TAG": 23,
      "23": "X_INVALID_END_TAG",
      "X_MISSING_END_TAG": 24,
      "24": "X_MISSING_END_TAG",
      "X_MISSING_INTERPOLATION_END": 25,
      "25": "X_MISSING_INTERPOLATION_END",
      "X_MISSING_DIRECTIVE_NAME": 26,
      "26": "X_MISSING_DIRECTIVE_NAME",
      "X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END": 27,
      "27": "X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END",
      "X_V_IF_NO_EXPRESSION": 28,
      "28": "X_V_IF_NO_EXPRESSION",
      "X_V_IF_SAME_KEY": 29,
      "29": "X_V_IF_SAME_KEY",
      "X_V_ELSE_NO_ADJACENT_IF": 30,
      "30": "X_V_ELSE_NO_ADJACENT_IF",
      "X_V_FOR_NO_EXPRESSION": 31,
      "31": "X_V_FOR_NO_EXPRESSION",
      "X_V_FOR_MALFORMED_EXPRESSION": 32,
      "32": "X_V_FOR_MALFORMED_EXPRESSION",
      "X_V_FOR_TEMPLATE_KEY_PLACEMENT": 33,
      "33": "X_V_FOR_TEMPLATE_KEY_PLACEMENT",
      "X_V_BIND_NO_EXPRESSION": 34,
      "34": "X_V_BIND_NO_EXPRESSION",
      "X_V_ON_NO_EXPRESSION": 35,
      "35": "X_V_ON_NO_EXPRESSION",
      "X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET": 36,
      "36": "X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET",
      "X_V_SLOT_MIXED_SLOT_USAGE": 37,
      "37": "X_V_SLOT_MIXED_SLOT_USAGE",
      "X_V_SLOT_DUPLICATE_SLOT_NAMES": 38,
      "38": "X_V_SLOT_DUPLICATE_SLOT_NAMES",
      "X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN": 39,
      "39": "X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN",
      "X_V_SLOT_MISPLACED": 40,
      "40": "X_V_SLOT_MISPLACED",
      "X_V_MODEL_NO_EXPRESSION": 41,
      "41": "X_V_MODEL_NO_EXPRESSION",
      "X_V_MODEL_MALFORMED_EXPRESSION": 42,
      "42": "X_V_MODEL_MALFORMED_EXPRESSION",
      "X_V_MODEL_ON_SCOPE_VARIABLE": 43,
      "43": "X_V_MODEL_ON_SCOPE_VARIABLE",
      "X_V_MODEL_ON_PROPS": 44,
      "44": "X_V_MODEL_ON_PROPS",
      "X_INVALID_EXPRESSION": 45,
      "45": "X_INVALID_EXPRESSION",
      "X_KEEP_ALIVE_INVALID_CHILDREN": 46,
      "46": "X_KEEP_ALIVE_INVALID_CHILDREN",
      "X_PREFIX_ID_NOT_SUPPORTED": 47,
      "47": "X_PREFIX_ID_NOT_SUPPORTED",
      "X_MODULE_MODE_NOT_SUPPORTED": 48,
      "48": "X_MODULE_MODE_NOT_SUPPORTED",
      "X_CACHE_HANDLER_NOT_SUPPORTED": 49,
      "49": "X_CACHE_HANDLER_NOT_SUPPORTED",
      "X_SCOPE_ID_NOT_SUPPORTED": 50,
      "50": "X_SCOPE_ID_NOT_SUPPORTED",
      "X_VNODE_HOOKS": 51,
      "51": "X_VNODE_HOOKS",
      "X_V_BIND_INVALID_SAME_NAME_ARGUMENT": 52,
      "52": "X_V_BIND_INVALID_SAME_NAME_ARGUMENT",
      "__EXTEND_POINT__": 53,
      "53": "__EXTEND_POINT__"
    };
    errorMessages = {
      // parse errors
      [0]: "Illegal comment.",
      [1]: "CDATA section is allowed only in XML context.",
      [2]: "Duplicate attribute.",
      [3]: "End tag cannot have attributes.",
      [4]: "Illegal '/' in tags.",
      [5]: "Unexpected EOF in tag.",
      [6]: "Unexpected EOF in CDATA section.",
      [7]: "Unexpected EOF in comment.",
      [8]: "Unexpected EOF in script.",
      [9]: "Unexpected EOF in tag.",
      [10]: "Incorrectly closed comment.",
      [11]: "Incorrectly opened comment.",
      [12]: "Illegal tag name. Use '&lt;' to print '<'.",
      [13]: "Attribute value was expected.",
      [14]: "End tag name was expected.",
      [15]: "Whitespace was expected.",
      [16]: "Unexpected '<!--' in comment.",
      [17]: `Attribute name cannot contain U+0022 ("), U+0027 ('), and U+003C (<).`,
      [18]: "Unquoted attribute value cannot contain U+0022 (\"), U+0027 ('), U+003C (<), U+003D (=), and U+0060 (`).",
      [19]: "Attribute name cannot start with '='.",
      [21]: "'<?' is allowed only in XML context.",
      [20]: `Unexpected null character.`,
      [22]: "Illegal '/' in tags.",
      // Vue-specific parse errors
      [23]: "Invalid end tag.",
      [24]: "Element is missing end tag.",
      [25]: "Interpolation end sign was not found.",
      [27]: "End bracket for dynamic directive argument was not found. Note that dynamic directive argument cannot contain spaces.",
      [26]: "Legal directive name was expected.",
      // transform errors
      [28]: `v-if/v-else-if is missing expression.`,
      [29]: `v-if/else branches must use unique keys.`,
      [30]: `v-else/v-else-if has no adjacent v-if or v-else-if.`,
      [31]: `v-for is missing expression.`,
      [32]: `v-for has invalid expression.`,
      [33]: `<template v-for> key should be placed on the <template> tag.`,
      [34]: `v-bind is missing expression.`,
      [52]: `v-bind with same-name shorthand only allows static argument.`,
      [35]: `v-on is missing expression.`,
      [36]: `Unexpected custom directive on <slot> outlet.`,
      [37]: `Mixed v-slot usage on both the component and nested <template>. When there are multiple named slots, all slots should use <template> syntax to avoid scope ambiguity.`,
      [38]: `Duplicate slot names found. `,
      [39]: `Extraneous children found when component already has explicitly named default slot. These children will be ignored.`,
      [40]: `v-slot can only be used on components or <template> tags.`,
      [41]: `v-model is missing expression.`,
      [42]: `v-model value must be a valid JavaScript member expression.`,
      [43]: `v-model cannot be used on v-for or v-slot scope variables because they are not writable.`,
      [44]: `v-model cannot be used on a prop, because local prop bindings are not writable.
Use a v-bind binding combined with a v-on listener that emits update:x event instead.`,
      [45]: `Error parsing JavaScript expression: `,
      [46]: `<KeepAlive> expects exactly one child component.`,
      [51]: `@vnode-* hooks in templates are no longer supported. Use the vue: prefix instead. For example, @vnode-mounted should be changed to @vue:mounted. @vnode-* hooks support has been removed in 3.4.`,
      // generic errors
      [47]: `"prefixIdentifiers" option is not supported in this build of compiler.`,
      [48]: `ES module mode is not supported in this build of compiler.`,
      [49]: `"cacheHandlers" option is only supported when the "prefixIdentifiers" option is enabled.`,
      [50]: `"scopeId" option is only supported in module mode.`,
      // just to fulfill types
      [53]: ``
    };
    isFunctionType = (node) => {
      return /Function(?:Expression|Declaration)$|Method$/.test(node.type);
    };
    isStaticProperty = (node) => node && (node.type === "ObjectProperty" || node.type === "ObjectMethod") && !node.computed;
    isStaticPropertyKey = (node, parent) => isStaticProperty(parent) && parent.key === node;
    TS_NODE_TYPES = [
      "TSAsExpression",
      // foo as number
      "TSTypeAssertion",
      // (<number>foo)
      "TSNonNullExpression",
      // foo!
      "TSInstantiationExpression",
      // foo<string>
      "TSSatisfiesExpression"
      // foo satisfies T
    ];
    isStaticExp = (p) => p.type === 4 && p.isStatic;
    nonIdentifierRE = /^\d|[^\$\w]/;
    isSimpleIdentifier = (name) => !nonIdentifierRE.test(name);
    validFirstIdentCharRE = /[A-Za-z_$\xA0-\uFFFF]/;
    validIdentCharRE = /[\.\?\w$\xA0-\uFFFF]/;
    whitespaceRE = /\s+[.[]\s*|\s*[.[]\s+/g;
    isMemberExpressionBrowser = (path) => {
      path = path.trim().replace(whitespaceRE, (s) => s.trim());
      let state = 0;
      let stateStack = [];
      let currentOpenBracketCount = 0;
      let currentOpenParensCount = 0;
      let currentStringType = null;
      for (let i = 0; i < path.length; i++) {
        const char = path.charAt(i);
        switch (state) {
          case 0:
            if (char === "[") {
              stateStack.push(state);
              state = 1;
              currentOpenBracketCount++;
            } else if (char === "(") {
              stateStack.push(state);
              state = 2;
              currentOpenParensCount++;
            } else if (!(i === 0 ? validFirstIdentCharRE : validIdentCharRE).test(char)) {
              return false;
            }
            break;
          case 1:
            if (char === `'` || char === `"` || char === "`") {
              stateStack.push(state);
              state = 3;
              currentStringType = char;
            } else if (char === `[`) {
              currentOpenBracketCount++;
            } else if (char === `]`) {
              if (!--currentOpenBracketCount) {
                state = stateStack.pop();
              }
            }
            break;
          case 2:
            if (char === `'` || char === `"` || char === "`") {
              stateStack.push(state);
              state = 3;
              currentStringType = char;
            } else if (char === `(`) {
              currentOpenParensCount++;
            } else if (char === `)`) {
              if (i === path.length - 1) {
                return false;
              }
              if (!--currentOpenParensCount) {
                state = stateStack.pop();
              }
            }
            break;
          case 3:
            if (char === currentStringType) {
              state = stateStack.pop();
              currentStringType = null;
            }
            break;
        }
      }
      return !currentOpenBracketCount && !currentOpenParensCount;
    };
    isMemberExpressionNode = NOOP;
    isMemberExpression = isMemberExpressionBrowser;
    propsHelperSet = /* @__PURE__ */ new Set([NORMALIZE_PROPS, GUARD_REACTIVE_PROPS]);
    forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    defaultParserOptions = {
      parseMode: "base",
      ns: 0,
      delimiters: [`{{`, `}}`],
      getNamespace: () => 0,
      isVoidTag: NO,
      isPreTag: NO,
      isCustomElement: NO,
      onError: defaultOnError,
      onWarn: defaultOnWarn,
      comments: true,
      prefixIdentifiers: false
    };
    currentOptions = defaultParserOptions;
    currentRoot = null;
    currentInput = "";
    currentOpenTag = null;
    currentProp = null;
    currentAttrValue = "";
    currentAttrStartIndex = -1;
    currentAttrEndIndex = -1;
    inPre = 0;
    inVPre = false;
    currentVPreBoundary = null;
    stack = [];
    tokenizer = new Tokenizer(stack, {
      onerr: emitError,
      ontext(start, end) {
        onText(getSlice(start, end), start, end);
      },
      ontextentity(char, start, end) {
        onText(char, start, end);
      },
      oninterpolation(start, end) {
        if (inVPre) {
          return onText(getSlice(start, end), start, end);
        }
        let innerStart = start + tokenizer.delimiterOpen.length;
        let innerEnd = end - tokenizer.delimiterClose.length;
        while (isWhitespace(currentInput.charCodeAt(innerStart))) {
          innerStart++;
        }
        while (isWhitespace(currentInput.charCodeAt(innerEnd - 1))) {
          innerEnd--;
        }
        let exp = getSlice(innerStart, innerEnd);
        if (exp.includes("&")) {
          {
            exp = currentOptions.decodeEntities(exp, false);
          }
        }
        addNode({
          type: 5,
          content: createExp(exp, false, getLoc(innerStart, innerEnd)),
          loc: getLoc(start, end)
        });
      },
      onopentagname(start, end) {
        const name = getSlice(start, end);
        currentOpenTag = {
          type: 1,
          tag: name,
          ns: currentOptions.getNamespace(name, stack[0], currentOptions.ns),
          tagType: 0,
          // will be refined on tag close
          props: [],
          children: [],
          loc: getLoc(start - 1, end),
          codegenNode: void 0
        };
      },
      onopentagend(end) {
        endOpenTag(end);
      },
      onclosetag(start, end) {
        const name = getSlice(start, end);
        if (!currentOptions.isVoidTag(name)) {
          let found = false;
          for (let i = 0; i < stack.length; i++) {
            const e = stack[i];
            if (e.tag.toLowerCase() === name.toLowerCase()) {
              found = true;
              if (i > 0) {
                emitError(24, stack[0].loc.start.offset);
              }
              for (let j = 0; j <= i; j++) {
                const el = stack.shift();
                onCloseTag(el, end, j < i);
              }
              break;
            }
          }
          if (!found) {
            emitError(23, backTrack(start, 60));
          }
        }
      },
      onselfclosingtag(end) {
        const name = currentOpenTag.tag;
        currentOpenTag.isSelfClosing = true;
        endOpenTag(end);
        if (stack[0] && stack[0].tag === name) {
          onCloseTag(stack.shift(), end);
        }
      },
      onattribname(start, end) {
        currentProp = {
          type: 6,
          name: getSlice(start, end),
          nameLoc: getLoc(start, end),
          value: void 0,
          loc: getLoc(start)
        };
      },
      ondirname(start, end) {
        const raw = getSlice(start, end);
        const name = raw === "." || raw === ":" ? "bind" : raw === "@" ? "on" : raw === "#" ? "slot" : raw.slice(2);
        if (!inVPre && name === "") {
          emitError(26, start);
        }
        if (inVPre || name === "") {
          currentProp = {
            type: 6,
            name: raw,
            nameLoc: getLoc(start, end),
            value: void 0,
            loc: getLoc(start)
          };
        } else {
          currentProp = {
            type: 7,
            name,
            rawName: raw,
            exp: void 0,
            arg: void 0,
            modifiers: raw === "." ? ["prop"] : [],
            loc: getLoc(start)
          };
          if (name === "pre") {
            inVPre = tokenizer.inVPre = true;
            currentVPreBoundary = currentOpenTag;
            const props = currentOpenTag.props;
            for (let i = 0; i < props.length; i++) {
              if (props[i].type === 7) {
                props[i] = dirToAttr(props[i]);
              }
            }
          }
        }
      },
      ondirarg(start, end) {
        if (start === end)
          return;
        const arg = getSlice(start, end);
        if (inVPre) {
          currentProp.name += arg;
          setLocEnd(currentProp.nameLoc, end);
        } else {
          const isStatic = arg[0] !== `[`;
          currentProp.arg = createExp(
            isStatic ? arg : arg.slice(1, -1),
            isStatic,
            getLoc(start, end),
            isStatic ? 3 : 0
          );
        }
      },
      ondirmodifier(start, end) {
        const mod = getSlice(start, end);
        if (inVPre) {
          currentProp.name += "." + mod;
          setLocEnd(currentProp.nameLoc, end);
        } else if (currentProp.name === "slot") {
          const arg = currentProp.arg;
          if (arg) {
            arg.content += "." + mod;
            setLocEnd(arg.loc, end);
          }
        } else {
          currentProp.modifiers.push(mod);
        }
      },
      onattribdata(start, end) {
        currentAttrValue += getSlice(start, end);
        if (currentAttrStartIndex < 0)
          currentAttrStartIndex = start;
        currentAttrEndIndex = end;
      },
      onattribentity(char, start, end) {
        currentAttrValue += char;
        if (currentAttrStartIndex < 0)
          currentAttrStartIndex = start;
        currentAttrEndIndex = end;
      },
      onattribnameend(end) {
        const start = currentProp.loc.start.offset;
        const name = getSlice(start, end);
        if (currentProp.type === 7) {
          currentProp.rawName = name;
        }
        if (currentOpenTag.props.some(
          (p) => (p.type === 7 ? p.rawName : p.name) === name
        )) {
          emitError(2, start);
        }
      },
      onattribend(quote, end) {
        if (currentOpenTag && currentProp) {
          setLocEnd(currentProp.loc, end);
          if (quote !== 0) {
            if (currentAttrValue.includes("&")) {
              currentAttrValue = currentOptions.decodeEntities(
                currentAttrValue,
                true
              );
            }
            if (currentProp.type === 6) {
              if (currentProp.name === "class") {
                currentAttrValue = condense(currentAttrValue).trim();
              }
              if (quote === 1 && !currentAttrValue) {
                emitError(13, end);
              }
              currentProp.value = {
                type: 2,
                content: currentAttrValue,
                loc: quote === 1 ? getLoc(currentAttrStartIndex, currentAttrEndIndex) : getLoc(currentAttrStartIndex - 1, currentAttrEndIndex + 1)
              };
              if (tokenizer.inSFCRoot && currentOpenTag.tag === "template" && currentProp.name === "lang" && currentAttrValue && currentAttrValue !== "html") {
                tokenizer.enterRCDATA(toCharCodes(`</template`), 0);
              }
            } else {
              let expParseMode = 0;
              currentProp.exp = createExp(
                currentAttrValue,
                false,
                getLoc(currentAttrStartIndex, currentAttrEndIndex),
                0,
                expParseMode
              );
              if (currentProp.name === "for") {
                currentProp.forParseResult = parseForExpression(currentProp.exp);
              }
              let syncIndex = -1;
              if (currentProp.name === "bind" && (syncIndex = currentProp.modifiers.indexOf("sync")) > -1 && checkCompatEnabled(
                "COMPILER_V_BIND_SYNC",
                currentOptions,
                currentProp.loc,
                currentProp.rawName
              )) {
                currentProp.name = "model";
                currentProp.modifiers.splice(syncIndex, 1);
              }
            }
          }
          if (currentProp.type !== 7 || currentProp.name !== "pre") {
            currentOpenTag.props.push(currentProp);
          }
        }
        currentAttrValue = "";
        currentAttrStartIndex = currentAttrEndIndex = -1;
      },
      oncomment(start, end) {
        if (currentOptions.comments) {
          addNode({
            type: 3,
            content: getSlice(start, end),
            loc: getLoc(start - 4, end + 3)
          });
        }
      },
      onend() {
        const end = currentInput.length;
        if (tokenizer.state !== 1) {
          switch (tokenizer.state) {
            case 5:
            case 8:
              emitError(5, end);
              break;
            case 3:
            case 4:
              emitError(
                25,
                tokenizer.sectionStart
              );
              break;
            case 28:
              if (tokenizer.currentSequence === Sequences.CdataEnd) {
                emitError(6, end);
              } else {
                emitError(7, end);
              }
              break;
            case 6:
            case 7:
            case 9:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
              emitError(9, end);
              break;
          }
        }
        for (let index = 0; index < stack.length; index++) {
          onCloseTag(stack[index], end - 1);
          emitError(24, stack[index].loc.start.offset);
        }
      },
      oncdata(start, end) {
        if (stack[0].ns !== 0) {
          onText(getSlice(start, end), start, end);
        } else {
          emitError(1, start - 9);
        }
      },
      onprocessinginstruction(start) {
        if ((stack[0] ? stack[0].ns : currentOptions.ns) === 0) {
          emitError(
            21,
            start - 1
          );
        }
      }
    });
    forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    stripParensRE = /^\(|\)$/g;
    specialTemplateDir = /* @__PURE__ */ new Set(["if", "else", "else-if", "for", "slot"]);
    windowsNewlineRE = /\r\n/g;
    allowHoistedHelperSet = /* @__PURE__ */ new Set([
      NORMALIZE_CLASS,
      NORMALIZE_STYLE,
      NORMALIZE_PROPS,
      GUARD_REACTIVE_PROPS
    ]);
    PURE_ANNOTATION = `/*#__PURE__*/`;
    aliasHelper = (s) => `${helperNameMap[s]}: _${helperNameMap[s]}`;
    prohibitedKeywordRE = new RegExp(
      "\\b" + "arguments,await,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,let,new,return,super,switch,throw,try,var,void,while,with,yield".split(",").join("\\b|\\b") + "\\b"
    );
    stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
    transformExpression = (node, context) => {
      if (node.type === 5) {
        node.content = processExpression(
          node.content,
          context
        );
      } else if (node.type === 1) {
        for (let i = 0; i < node.props.length; i++) {
          const dir = node.props[i];
          if (dir.type === 7 && dir.name !== "for") {
            const exp = dir.exp;
            const arg = dir.arg;
            if (exp && exp.type === 4 && !(dir.name === "on" && arg)) {
              dir.exp = processExpression(
                exp,
                context,
                // slot args must be processed as function params
                dir.name === "slot"
              );
            }
            if (arg && arg.type === 4 && !arg.isStatic) {
              dir.arg = processExpression(arg, context);
            }
          }
        }
      }
    };
    transformIf = createStructuralDirectiveTransform(
      /^(if|else|else-if)$/,
      (node, dir, context) => {
        return processIf(node, dir, context, (ifNode, branch, isRoot) => {
          const siblings = context.parent.children;
          let i = siblings.indexOf(ifNode);
          let key = 0;
          while (i-- >= 0) {
            const sibling = siblings[i];
            if (sibling && sibling.type === 9) {
              key += sibling.branches.length;
            }
          }
          return () => {
            if (isRoot) {
              ifNode.codegenNode = createCodegenNodeForBranch(
                branch,
                key,
                context
              );
            } else {
              const parentCondition = getParentCondition(ifNode.codegenNode);
              parentCondition.alternate = createCodegenNodeForBranch(
                branch,
                key + ifNode.branches.length - 1,
                context
              );
            }
          };
        });
      }
    );
    transformFor = createStructuralDirectiveTransform(
      "for",
      (node, dir, context) => {
        const { helper, removeHelper } = context;
        return processFor(node, dir, context, (forNode) => {
          const renderExp = createCallExpression(helper(RENDER_LIST), [
            forNode.source
          ]);
          const isTemplate = isTemplateNode(node);
          const memo = findDir(node, "memo");
          const keyProp = findProp(node, `key`);
          const keyExp = keyProp && (keyProp.type === 6 ? createSimpleExpression(keyProp.value.content, true) : keyProp.exp);
          const keyProperty = keyProp ? createObjectProperty(`key`, keyExp) : null;
          const isStableFragment = forNode.source.type === 4 && forNode.source.constType > 0;
          const fragmentFlag = isStableFragment ? 64 : keyProp ? 128 : 256;
          forNode.codegenNode = createVNodeCall(
            context,
            helper(FRAGMENT),
            void 0,
            renderExp,
            fragmentFlag + (true ? ` /* ${PatchFlagNames[fragmentFlag]} */` : ``),
            void 0,
            void 0,
            true,
            !isStableFragment,
            false,
            node.loc
          );
          return () => {
            let childBlock;
            const { children } = forNode;
            if (isTemplate) {
              node.children.some((c) => {
                if (c.type === 1) {
                  const key = findProp(c, "key");
                  if (key) {
                    context.onError(
                      createCompilerError(
                        33,
                        key.loc
                      )
                    );
                    return true;
                  }
                }
              });
            }
            const needFragmentWrapper = children.length !== 1 || children[0].type !== 1;
            const slotOutlet = isSlotOutlet(node) ? node : isTemplate && node.children.length === 1 && isSlotOutlet(node.children[0]) ? node.children[0] : null;
            if (slotOutlet) {
              childBlock = slotOutlet.codegenNode;
              if (isTemplate && keyProperty) {
                injectProp(childBlock, keyProperty, context);
              }
            } else if (needFragmentWrapper) {
              childBlock = createVNodeCall(
                context,
                helper(FRAGMENT),
                keyProperty ? createObjectExpression([keyProperty]) : void 0,
                node.children,
                64 + (true ? ` /* ${PatchFlagNames[64]} */` : ``),
                void 0,
                void 0,
                true,
                void 0,
                false
              );
            } else {
              childBlock = children[0].codegenNode;
              if (isTemplate && keyProperty) {
                injectProp(childBlock, keyProperty, context);
              }
              if (childBlock.isBlock !== !isStableFragment) {
                if (childBlock.isBlock) {
                  removeHelper(OPEN_BLOCK);
                  removeHelper(
                    getVNodeBlockHelper(context.inSSR, childBlock.isComponent)
                  );
                } else {
                  removeHelper(
                    getVNodeHelper(context.inSSR, childBlock.isComponent)
                  );
                }
              }
              childBlock.isBlock = !isStableFragment;
              if (childBlock.isBlock) {
                helper(OPEN_BLOCK);
                helper(getVNodeBlockHelper(context.inSSR, childBlock.isComponent));
              } else {
                helper(getVNodeHelper(context.inSSR, childBlock.isComponent));
              }
            }
            if (memo) {
              const loop = createFunctionExpression(
                createForLoopParams(forNode.parseResult, [
                  createSimpleExpression(`_cached`)
                ])
              );
              loop.body = createBlockStatement([
                createCompoundExpression([`const _memo = (`, memo.exp, `)`]),
                createCompoundExpression([
                  `if (_cached`,
                  ...keyExp ? [` && _cached.key === `, keyExp] : [],
                  ` && ${context.helperString(
                    IS_MEMO_SAME
                  )}(_cached, _memo)) return _cached`
                ]),
                createCompoundExpression([`const _item = `, childBlock]),
                createSimpleExpression(`_item.memo = _memo`),
                createSimpleExpression(`return _item`)
              ]);
              renderExp.arguments.push(
                loop,
                createSimpleExpression(`_cache`),
                createSimpleExpression(String(context.cached++))
              );
            } else {
              renderExp.arguments.push(
                createFunctionExpression(
                  createForLoopParams(forNode.parseResult),
                  childBlock,
                  true
                )
              );
            }
          };
        });
      }
    );
    defaultFallback = createSimpleExpression(`undefined`, false);
    trackSlotScopes = (node, context) => {
      if (node.type === 1 && (node.tagType === 1 || node.tagType === 3)) {
        const vSlot = findDir(node, "slot");
        if (vSlot) {
          vSlot.exp;
          context.scopes.vSlot++;
          return () => {
            context.scopes.vSlot--;
          };
        }
      }
    };
    trackVForSlotScopes = (node, context) => {
      let vFor;
      if (isTemplateNode(node) && node.props.some(isVSlot) && (vFor = findDir(node, "for"))) {
        const result = vFor.forParseResult;
        if (result) {
          finalizeForParseResult(result, context);
          const { value, key, index } = result;
          const { addIdentifiers, removeIdentifiers } = context;
          value && addIdentifiers(value);
          key && addIdentifiers(key);
          index && addIdentifiers(index);
          return () => {
            value && removeIdentifiers(value);
            key && removeIdentifiers(key);
            index && removeIdentifiers(index);
          };
        }
      }
    };
    buildClientSlotFn = (props, _vForExp, children, loc) => createFunctionExpression(
      props,
      children,
      false,
      true,
      children.length ? children[0].loc : loc
    );
    directiveImportMap = /* @__PURE__ */ new WeakMap();
    transformElement = (node, context) => {
      return function postTransformElement() {
        node = context.currentNode;
        if (!(node.type === 1 && (node.tagType === 0 || node.tagType === 1))) {
          return;
        }
        const { tag, props } = node;
        const isComponent2 = node.tagType === 1;
        let vnodeTag = isComponent2 ? resolveComponentType(node, context) : `"${tag}"`;
        const isDynamicComponent = isObject(vnodeTag) && vnodeTag.callee === RESOLVE_DYNAMIC_COMPONENT;
        let vnodeProps;
        let vnodeChildren;
        let vnodePatchFlag;
        let patchFlag = 0;
        let vnodeDynamicProps;
        let dynamicPropNames;
        let vnodeDirectives;
        let shouldUseBlock = (
          // dynamic component may resolve to plain elements
          isDynamicComponent || vnodeTag === TELEPORT || vnodeTag === SUSPENSE || !isComponent2 && // <svg> and <foreignObject> must be forced into blocks so that block
          // updates inside get proper isSVG flag at runtime. (#639, #643)
          // This is technically web-specific, but splitting the logic out of core
          // leads to too much unnecessary complexity.
          (tag === "svg" || tag === "foreignObject")
        );
        if (props.length > 0) {
          const propsBuildResult = buildProps(
            node,
            context,
            void 0,
            isComponent2,
            isDynamicComponent
          );
          vnodeProps = propsBuildResult.props;
          patchFlag = propsBuildResult.patchFlag;
          dynamicPropNames = propsBuildResult.dynamicPropNames;
          const directives = propsBuildResult.directives;
          vnodeDirectives = directives && directives.length ? createArrayExpression(
            directives.map((dir) => buildDirectiveArgs(dir, context))
          ) : void 0;
          if (propsBuildResult.shouldUseBlock) {
            shouldUseBlock = true;
          }
        }
        if (node.children.length > 0) {
          if (vnodeTag === KEEP_ALIVE) {
            shouldUseBlock = true;
            patchFlag |= 1024;
            if (node.children.length > 1) {
              context.onError(
                createCompilerError(46, {
                  start: node.children[0].loc.start,
                  end: node.children[node.children.length - 1].loc.end,
                  source: ""
                })
              );
            }
          }
          const shouldBuildAsSlots = isComponent2 && // Teleport is not a real component and has dedicated runtime handling
          vnodeTag !== TELEPORT && // explained above.
          vnodeTag !== KEEP_ALIVE;
          if (shouldBuildAsSlots) {
            const { slots, hasDynamicSlots } = buildSlots(node, context);
            vnodeChildren = slots;
            if (hasDynamicSlots) {
              patchFlag |= 1024;
            }
          } else if (node.children.length === 1 && vnodeTag !== TELEPORT) {
            const child = node.children[0];
            const type = child.type;
            const hasDynamicTextChild = type === 5 || type === 8;
            if (hasDynamicTextChild && getConstantType(child, context) === 0) {
              patchFlag |= 1;
            }
            if (hasDynamicTextChild || type === 2) {
              vnodeChildren = child;
            } else {
              vnodeChildren = node.children;
            }
          } else {
            vnodeChildren = node.children;
          }
        }
        if (patchFlag !== 0) {
          if (true) {
            if (patchFlag < 0) {
              vnodePatchFlag = patchFlag + ` /* ${PatchFlagNames[patchFlag]} */`;
            } else {
              const flagNames = Object.keys(PatchFlagNames).map(Number).filter((n) => n > 0 && patchFlag & n).map((n) => PatchFlagNames[n]).join(`, `);
              vnodePatchFlag = patchFlag + ` /* ${flagNames} */`;
            }
          } else {
            vnodePatchFlag = String(patchFlag);
          }
          if (dynamicPropNames && dynamicPropNames.length) {
            vnodeDynamicProps = stringifyDynamicPropNames(dynamicPropNames);
          }
        }
        node.codegenNode = createVNodeCall(
          context,
          vnodeTag,
          vnodeProps,
          vnodeChildren,
          vnodePatchFlag,
          vnodeDynamicProps,
          vnodeDirectives,
          !!shouldUseBlock,
          false,
          isComponent2,
          node.loc
        );
      };
    };
    transformSlotOutlet = (node, context) => {
      if (isSlotOutlet(node)) {
        const { children, loc } = node;
        const { slotName, slotProps } = processSlotOutlet(node, context);
        const slotArgs = [
          context.prefixIdentifiers ? `_ctx.$slots` : `$slots`,
          slotName,
          "{}",
          "undefined",
          "true"
        ];
        let expectedLen = 2;
        if (slotProps) {
          slotArgs[2] = slotProps;
          expectedLen = 3;
        }
        if (children.length) {
          slotArgs[3] = createFunctionExpression([], children, false, false, loc);
          expectedLen = 4;
        }
        if (context.scopeId && !context.slotted) {
          expectedLen = 5;
        }
        slotArgs.splice(expectedLen);
        node.codegenNode = createCallExpression(
          context.helper(RENDER_SLOT),
          slotArgs,
          loc
        );
      }
    };
    fnExpRE = /^\s*([\w$_]+|(async\s*)?\([^)]*?\))\s*(:[^=]+)?=>|^\s*(async\s+)?function(?:\s+[\w$]+)?\s*\(/;
    transformOn = (dir, node, context, augmentor) => {
      const { loc, modifiers, arg } = dir;
      if (!dir.exp && !modifiers.length) {
        context.onError(createCompilerError(35, loc));
      }
      let eventName;
      if (arg.type === 4) {
        if (arg.isStatic) {
          let rawName = arg.content;
          if (rawName.startsWith("vnode")) {
            context.onError(createCompilerError(51, arg.loc));
          }
          if (rawName.startsWith("vue:")) {
            rawName = `vnode-${rawName.slice(4)}`;
          }
          const eventString = node.tagType !== 0 || rawName.startsWith("vnode") || !/[A-Z]/.test(rawName) ? (
            // for non-element and vnode lifecycle event listeners, auto convert
            // it to camelCase. See issue #2249
            toHandlerKey(camelize(rawName))
          ) : (
            // preserve case for plain element listeners that have uppercase
            // letters, as these may be custom elements' custom events
            `on:${rawName}`
          );
          eventName = createSimpleExpression(eventString, true, arg.loc);
        } else {
          eventName = createCompoundExpression([
            `${context.helperString(TO_HANDLER_KEY)}(`,
            arg,
            `)`
          ]);
        }
      } else {
        eventName = arg;
        eventName.children.unshift(`${context.helperString(TO_HANDLER_KEY)}(`);
        eventName.children.push(`)`);
      }
      let exp = dir.exp;
      if (exp && !exp.content.trim()) {
        exp = void 0;
      }
      let shouldCache = context.cacheHandlers && !exp && !context.inVOnce;
      if (exp) {
        const isMemberExp = isMemberExpression(exp.content);
        const isInlineStatement = !(isMemberExp || fnExpRE.test(exp.content));
        const hasMultipleStatements = exp.content.includes(`;`);
        if (true) {
          validateBrowserExpression(
            exp,
            context,
            false,
            hasMultipleStatements
          );
        }
        if (isInlineStatement || shouldCache && isMemberExp) {
          exp = createCompoundExpression([
            `${isInlineStatement ? `$event` : `${``}(...args)`} => ${hasMultipleStatements ? `{` : `(`}`,
            exp,
            hasMultipleStatements ? `}` : `)`
          ]);
        }
      }
      let ret = {
        props: [
          createObjectProperty(
            eventName,
            exp || createSimpleExpression(`() => {}`, false, loc)
          )
        ]
      };
      if (augmentor) {
        ret = augmentor(ret);
      }
      if (shouldCache) {
        ret.props[0].value = context.cache(ret.props[0].value);
      }
      ret.props.forEach((p) => p.key.isHandlerKey = true);
      return ret;
    };
    transformBind = (dir, _node, context) => {
      const { modifiers, loc } = dir;
      const arg = dir.arg;
      let { exp } = dir;
      if (exp && exp.type === 4 && !exp.content.trim()) {
        {
          exp = void 0;
        }
      }
      if (!exp) {
        if (arg.type !== 4 || !arg.isStatic) {
          context.onError(
            createCompilerError(
              52,
              arg.loc
            )
          );
          return {
            props: [
              createObjectProperty(arg, createSimpleExpression("", true, loc))
            ]
          };
        }
        const propName = camelize(arg.content);
        exp = dir.exp = createSimpleExpression(propName, false, arg.loc);
      }
      if (arg.type !== 4) {
        arg.children.unshift(`(`);
        arg.children.push(`) || ""`);
      } else if (!arg.isStatic) {
        arg.content = `${arg.content} || ""`;
      }
      if (modifiers.includes("camel")) {
        if (arg.type === 4) {
          if (arg.isStatic) {
            arg.content = camelize(arg.content);
          } else {
            arg.content = `${context.helperString(CAMELIZE)}(${arg.content})`;
          }
        } else {
          arg.children.unshift(`${context.helperString(CAMELIZE)}(`);
          arg.children.push(`)`);
        }
      }
      if (!context.inSSR) {
        if (modifiers.includes("prop")) {
          injectPrefix(arg, ".");
        }
        if (modifiers.includes("attr")) {
          injectPrefix(arg, "^");
        }
      }
      return {
        props: [createObjectProperty(arg, exp)]
      };
    };
    injectPrefix = (arg, prefix) => {
      if (arg.type === 4) {
        if (arg.isStatic) {
          arg.content = prefix + arg.content;
        } else {
          arg.content = `\`${prefix}\${${arg.content}}\``;
        }
      } else {
        arg.children.unshift(`'${prefix}' + (`);
        arg.children.push(`)`);
      }
    };
    transformText = (node, context) => {
      if (node.type === 0 || node.type === 1 || node.type === 11 || node.type === 10) {
        return () => {
          const children = node.children;
          let currentContainer = void 0;
          let hasText = false;
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (isText$1(child)) {
              hasText = true;
              for (let j = i + 1; j < children.length; j++) {
                const next = children[j];
                if (isText$1(next)) {
                  if (!currentContainer) {
                    currentContainer = children[i] = createCompoundExpression(
                      [child],
                      child.loc
                    );
                  }
                  currentContainer.children.push(` + `, next);
                  children.splice(j, 1);
                  j--;
                } else {
                  currentContainer = void 0;
                  break;
                }
              }
            }
          }
          if (!hasText || // if this is a plain element with a single text child, leave it
          // as-is since the runtime has dedicated fast path for this by directly
          // setting textContent of the element.
          // for component root it's always normalized anyway.
          children.length === 1 && (node.type === 0 || node.type === 1 && node.tagType === 0 && // #3756
          // custom directives can potentially add DOM elements arbitrarily,
          // we need to avoid setting textContent of the element at runtime
          // to avoid accidentally overwriting the DOM elements added
          // by the user through custom directives.
          !node.props.find(
            (p) => p.type === 7 && !context.directiveTransforms[p.name]
          ) && // in compat mode, <template> tags with no special directives
          // will be rendered as a fragment so its children must be
          // converted into vnodes.
          !(node.tag === "template"))) {
            return;
          }
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (isText$1(child) || child.type === 8) {
              const callArgs = [];
              if (child.type !== 2 || child.content !== " ") {
                callArgs.push(child);
              }
              if (!context.ssr && getConstantType(child, context) === 0) {
                callArgs.push(
                  1 + (true ? ` /* ${PatchFlagNames[1]} */` : ``)
                );
              }
              children[i] = {
                type: 12,
                content: child,
                loc: child.loc,
                codegenNode: createCallExpression(
                  context.helper(CREATE_TEXT),
                  callArgs
                )
              };
            }
          }
        };
      }
    };
    seen$1 = /* @__PURE__ */ new WeakSet();
    transformOnce = (node, context) => {
      if (node.type === 1 && findDir(node, "once", true)) {
        if (seen$1.has(node) || context.inVOnce || context.inSSR) {
          return;
        }
        seen$1.add(node);
        context.inVOnce = true;
        context.helper(SET_BLOCK_TRACKING);
        return () => {
          context.inVOnce = false;
          const cur = context.currentNode;
          if (cur.codegenNode) {
            cur.codegenNode = context.cache(
              cur.codegenNode,
              true
              /* isVNode */
            );
          }
        };
      }
    };
    transformModel = (dir, node, context) => {
      const { exp, arg } = dir;
      if (!exp) {
        context.onError(
          createCompilerError(41, dir.loc)
        );
        return createTransformProps();
      }
      const rawExp = exp.loc.source;
      const expString = exp.type === 4 ? exp.content : rawExp;
      const bindingType = context.bindingMetadata[rawExp];
      if (bindingType === "props" || bindingType === "props-aliased") {
        context.onError(createCompilerError(44, exp.loc));
        return createTransformProps();
      }
      const maybeRef = false;
      if (!expString.trim() || !isMemberExpression(expString) && !maybeRef) {
        context.onError(
          createCompilerError(42, exp.loc)
        );
        return createTransformProps();
      }
      const propName = arg ? arg : createSimpleExpression("modelValue", true);
      const eventName = arg ? isStaticExp(arg) ? `onUpdate:${camelize(arg.content)}` : createCompoundExpression(['"onUpdate:" + ', arg]) : `onUpdate:modelValue`;
      let assignmentExp;
      const eventArg = context.isTS ? `($event: any)` : `$event`;
      {
        assignmentExp = createCompoundExpression([
          `${eventArg} => ((`,
          exp,
          `) = $event)`
        ]);
      }
      const props = [
        // modelValue: foo
        createObjectProperty(propName, dir.exp),
        // "onUpdate:modelValue": $event => (foo = $event)
        createObjectProperty(eventName, assignmentExp)
      ];
      if (dir.modifiers.length && node.tagType === 1) {
        const modifiers = dir.modifiers.map((m) => (isSimpleIdentifier(m) ? m : JSON.stringify(m)) + `: true`).join(`, `);
        const modifiersKey = arg ? isStaticExp(arg) ? `${arg.content}Modifiers` : createCompoundExpression([arg, ' + "Modifiers"']) : `modelModifiers`;
        props.push(
          createObjectProperty(
            modifiersKey,
            createSimpleExpression(
              `{ ${modifiers} }`,
              false,
              dir.loc,
              2
            )
          )
        );
      }
      return createTransformProps(props);
    };
    validDivisionCharRE = /[\w).+\-_$\]]/;
    transformFilter = (node, context) => {
      if (!isCompatEnabled("COMPILER_FILTERS", context)) {
        return;
      }
      if (node.type === 5) {
        rewriteFilter(node.content, context);
      }
      if (node.type === 1) {
        node.props.forEach((prop) => {
          if (prop.type === 7 && prop.name !== "for" && prop.exp) {
            rewriteFilter(prop.exp, context);
          }
        });
      }
    };
    seen = /* @__PURE__ */ new WeakSet();
    transformMemo = (node, context) => {
      if (node.type === 1) {
        const dir = findDir(node, "memo");
        if (!dir || seen.has(node)) {
          return;
        }
        seen.add(node);
        return () => {
          const codegenNode = node.codegenNode || context.currentNode.codegenNode;
          if (codegenNode && codegenNode.type === 13) {
            if (node.tagType !== 1) {
              convertToBlock(codegenNode, context);
            }
            node.codegenNode = createCallExpression(context.helper(WITH_MEMO), [
              dir.exp,
              createFunctionExpression(void 0, codegenNode),
              `_cache`,
              String(context.cached++)
            ]);
          }
        };
      }
    };
    BindingTypes = {
      "DATA": "data",
      "PROPS": "props",
      "PROPS_ALIASED": "props-aliased",
      "SETUP_LET": "setup-let",
      "SETUP_CONST": "setup-const",
      "SETUP_REACTIVE_CONST": "setup-reactive-const",
      "SETUP_MAYBE_REF": "setup-maybe-ref",
      "SETUP_REF": "setup-ref",
      "OPTIONS": "options",
      "LITERAL_CONST": "literal-const"
    };
    noopDirectiveTransform = () => ({ props: [] });
  }
});

// node_modules/@vue/compiler-dom/dist/compiler-dom.esm-bundler.js
var compiler_dom_esm_bundler_exports = {};
__export(compiler_dom_esm_bundler_exports, {
  BASE_TRANSITION: () => BASE_TRANSITION,
  BindingTypes: () => BindingTypes,
  CAMELIZE: () => CAMELIZE,
  CAPITALIZE: () => CAPITALIZE,
  CREATE_BLOCK: () => CREATE_BLOCK,
  CREATE_COMMENT: () => CREATE_COMMENT,
  CREATE_ELEMENT_BLOCK: () => CREATE_ELEMENT_BLOCK,
  CREATE_ELEMENT_VNODE: () => CREATE_ELEMENT_VNODE,
  CREATE_SLOTS: () => CREATE_SLOTS,
  CREATE_STATIC: () => CREATE_STATIC,
  CREATE_TEXT: () => CREATE_TEXT,
  CREATE_VNODE: () => CREATE_VNODE,
  CompilerDeprecationTypes: () => CompilerDeprecationTypes,
  ConstantTypes: () => ConstantTypes,
  DOMDirectiveTransforms: () => DOMDirectiveTransforms,
  DOMErrorCodes: () => DOMErrorCodes,
  DOMErrorMessages: () => DOMErrorMessages,
  DOMNodeTransforms: () => DOMNodeTransforms,
  ElementTypes: () => ElementTypes,
  ErrorCodes: () => ErrorCodes,
  FRAGMENT: () => FRAGMENT,
  GUARD_REACTIVE_PROPS: () => GUARD_REACTIVE_PROPS,
  IS_MEMO_SAME: () => IS_MEMO_SAME,
  IS_REF: () => IS_REF,
  KEEP_ALIVE: () => KEEP_ALIVE,
  MERGE_PROPS: () => MERGE_PROPS,
  NORMALIZE_CLASS: () => NORMALIZE_CLASS,
  NORMALIZE_PROPS: () => NORMALIZE_PROPS,
  NORMALIZE_STYLE: () => NORMALIZE_STYLE,
  Namespaces: () => Namespaces,
  NodeTypes: () => NodeTypes,
  OPEN_BLOCK: () => OPEN_BLOCK,
  POP_SCOPE_ID: () => POP_SCOPE_ID,
  PUSH_SCOPE_ID: () => PUSH_SCOPE_ID,
  RENDER_LIST: () => RENDER_LIST,
  RENDER_SLOT: () => RENDER_SLOT,
  RESOLVE_COMPONENT: () => RESOLVE_COMPONENT,
  RESOLVE_DIRECTIVE: () => RESOLVE_DIRECTIVE,
  RESOLVE_DYNAMIC_COMPONENT: () => RESOLVE_DYNAMIC_COMPONENT,
  RESOLVE_FILTER: () => RESOLVE_FILTER,
  SET_BLOCK_TRACKING: () => SET_BLOCK_TRACKING,
  SUSPENSE: () => SUSPENSE,
  TELEPORT: () => TELEPORT,
  TO_DISPLAY_STRING: () => TO_DISPLAY_STRING,
  TO_HANDLERS: () => TO_HANDLERS,
  TO_HANDLER_KEY: () => TO_HANDLER_KEY,
  TRANSITION: () => TRANSITION,
  TRANSITION_GROUP: () => TRANSITION_GROUP,
  TS_NODE_TYPES: () => TS_NODE_TYPES,
  UNREF: () => UNREF,
  V_MODEL_CHECKBOX: () => V_MODEL_CHECKBOX,
  V_MODEL_DYNAMIC: () => V_MODEL_DYNAMIC,
  V_MODEL_RADIO: () => V_MODEL_RADIO,
  V_MODEL_SELECT: () => V_MODEL_SELECT,
  V_MODEL_TEXT: () => V_MODEL_TEXT,
  V_ON_WITH_KEYS: () => V_ON_WITH_KEYS,
  V_ON_WITH_MODIFIERS: () => V_ON_WITH_MODIFIERS,
  V_SHOW: () => V_SHOW,
  WITH_CTX: () => WITH_CTX,
  WITH_DIRECTIVES: () => WITH_DIRECTIVES,
  WITH_MEMO: () => WITH_MEMO,
  advancePositionWithClone: () => advancePositionWithClone,
  advancePositionWithMutation: () => advancePositionWithMutation,
  assert: () => assert,
  baseCompile: () => baseCompile,
  baseParse: () => baseParse,
  buildDirectiveArgs: () => buildDirectiveArgs,
  buildProps: () => buildProps,
  buildSlots: () => buildSlots,
  checkCompatEnabled: () => checkCompatEnabled,
  compile: () => compile,
  convertToBlock: () => convertToBlock,
  createArrayExpression: () => createArrayExpression,
  createAssignmentExpression: () => createAssignmentExpression,
  createBlockStatement: () => createBlockStatement,
  createCacheExpression: () => createCacheExpression,
  createCallExpression: () => createCallExpression,
  createCompilerError: () => createCompilerError,
  createCompoundExpression: () => createCompoundExpression,
  createConditionalExpression: () => createConditionalExpression,
  createDOMCompilerError: () => createDOMCompilerError,
  createForLoopParams: () => createForLoopParams,
  createFunctionExpression: () => createFunctionExpression,
  createIfStatement: () => createIfStatement,
  createInterpolation: () => createInterpolation,
  createObjectExpression: () => createObjectExpression,
  createObjectProperty: () => createObjectProperty,
  createReturnStatement: () => createReturnStatement,
  createRoot: () => createRoot,
  createSequenceExpression: () => createSequenceExpression,
  createSimpleExpression: () => createSimpleExpression,
  createStructuralDirectiveTransform: () => createStructuralDirectiveTransform,
  createTemplateLiteral: () => createTemplateLiteral,
  createTransformContext: () => createTransformContext,
  createVNodeCall: () => createVNodeCall,
  errorMessages: () => errorMessages,
  extractIdentifiers: () => extractIdentifiers,
  findDir: () => findDir,
  findProp: () => findProp,
  forAliasRE: () => forAliasRE,
  generate: () => generate,
  generateCodeFrame: () => generateCodeFrame,
  getBaseTransformPreset: () => getBaseTransformPreset,
  getConstantType: () => getConstantType,
  getMemoedVNodeCall: () => getMemoedVNodeCall,
  getVNodeBlockHelper: () => getVNodeBlockHelper,
  getVNodeHelper: () => getVNodeHelper,
  hasDynamicKeyVBind: () => hasDynamicKeyVBind,
  hasScopeRef: () => hasScopeRef,
  helperNameMap: () => helperNameMap,
  injectProp: () => injectProp,
  isCoreComponent: () => isCoreComponent,
  isFunctionType: () => isFunctionType,
  isInDestructureAssignment: () => isInDestructureAssignment,
  isInNewExpression: () => isInNewExpression,
  isMemberExpression: () => isMemberExpression,
  isMemberExpressionBrowser: () => isMemberExpressionBrowser,
  isMemberExpressionNode: () => isMemberExpressionNode,
  isReferencedIdentifier: () => isReferencedIdentifier,
  isSimpleIdentifier: () => isSimpleIdentifier,
  isSlotOutlet: () => isSlotOutlet,
  isStaticArgOf: () => isStaticArgOf,
  isStaticExp: () => isStaticExp,
  isStaticProperty: () => isStaticProperty,
  isStaticPropertyKey: () => isStaticPropertyKey,
  isTemplateNode: () => isTemplateNode,
  isText: () => isText$1,
  isVSlot: () => isVSlot,
  locStub: () => locStub,
  noopDirectiveTransform: () => noopDirectiveTransform,
  parse: () => parse,
  parserOptions: () => parserOptions,
  processExpression: () => processExpression,
  processFor: () => processFor,
  processIf: () => processIf,
  processSlotOutlet: () => processSlotOutlet,
  registerRuntimeHelpers: () => registerRuntimeHelpers,
  resolveComponentType: () => resolveComponentType,
  stringifyExpression: () => stringifyExpression,
  toValidAssetId: () => toValidAssetId,
  trackSlotScopes: () => trackSlotScopes,
  trackVForSlotScopes: () => trackVForSlotScopes,
  transform: () => transform,
  transformBind: () => transformBind,
  transformElement: () => transformElement,
  transformExpression: () => transformExpression,
  transformModel: () => transformModel,
  transformOn: () => transformOn,
  transformStyle: () => transformStyle,
  traverseNode: () => traverseNode,
  unwrapTSNode: () => unwrapTSNode,
  walkBlockDeclarations: () => walkBlockDeclarations,
  walkFunctionParams: () => walkFunctionParams,
  walkIdentifiers: () => walkIdentifiers,
  warnDeprecation: () => warnDeprecation
});
function decodeHtmlBrowser(raw, asAttr = false) {
  if (!decoder) {
    decoder = document.createElement("div");
  }
  if (asAttr) {
    decoder.innerHTML = `<div foo="${raw.replace(/"/g, "&quot;")}">`;
    return decoder.children[0].getAttribute("foo");
  } else {
    decoder.innerHTML = raw;
    return decoder.textContent;
  }
}
function createDOMCompilerError(code, loc) {
  return createCompilerError(
    code,
    loc,
    true ? DOMErrorMessages : void 0
  );
}
function hasMultipleChildren(node) {
  const children = node.children = node.children.filter(
    (c) => c.type !== 3 && !(c.type === 2 && !c.content.trim())
  );
  const child = children[0];
  return children.length !== 1 || child.type === 11 || child.type === 9 && child.branches.some(hasMultipleChildren);
}
function compile(src, options = {}) {
  return baseCompile(
    src,
    extend({}, parserOptions, options, {
      nodeTransforms: [
        // ignore <script> and <tag>
        // this is not put inside DOMNodeTransforms because that list is used
        // by compiler-ssr to generate vnode fallback branches
        ignoreSideEffectTags,
        ...DOMNodeTransforms,
        ...options.nodeTransforms || []
      ],
      directiveTransforms: extend(
        {},
        DOMDirectiveTransforms,
        options.directiveTransforms || {}
      ),
      transformHoist: null
    })
  );
}
function parse(template, options = {}) {
  return baseParse(template, extend({}, parserOptions, options));
}
var V_MODEL_RADIO, V_MODEL_CHECKBOX, V_MODEL_TEXT, V_MODEL_SELECT, V_MODEL_DYNAMIC, V_ON_WITH_MODIFIERS, V_ON_WITH_KEYS, V_SHOW, TRANSITION, TRANSITION_GROUP, decoder, parserOptions, transformStyle, parseInlineCSS, DOMErrorCodes, DOMErrorMessages, transformVHtml, transformVText, transformModel2, isEventOptionModifier, isNonKeyModifier, maybeKeyModifier, isKeyboardEvent, resolveModifiers, transformClick, transformOn2, transformShow, transformTransition, ignoreSideEffectTags, DOMNodeTransforms, DOMDirectiveTransforms;
var init_compiler_dom_esm_bundler = __esm({
  "node_modules/@vue/compiler-dom/dist/compiler-dom.esm-bundler.js"() {
    init_compiler_core_esm_bundler();
    init_compiler_core_esm_bundler();
    init_shared_esm_bundler();
    V_MODEL_RADIO = Symbol(true ? `vModelRadio` : ``);
    V_MODEL_CHECKBOX = Symbol(true ? `vModelCheckbox` : ``);
    V_MODEL_TEXT = Symbol(true ? `vModelText` : ``);
    V_MODEL_SELECT = Symbol(true ? `vModelSelect` : ``);
    V_MODEL_DYNAMIC = Symbol(true ? `vModelDynamic` : ``);
    V_ON_WITH_MODIFIERS = Symbol(true ? `vOnModifiersGuard` : ``);
    V_ON_WITH_KEYS = Symbol(true ? `vOnKeysGuard` : ``);
    V_SHOW = Symbol(true ? `vShow` : ``);
    TRANSITION = Symbol(true ? `Transition` : ``);
    TRANSITION_GROUP = Symbol(true ? `TransitionGroup` : ``);
    registerRuntimeHelpers({
      [V_MODEL_RADIO]: `vModelRadio`,
      [V_MODEL_CHECKBOX]: `vModelCheckbox`,
      [V_MODEL_TEXT]: `vModelText`,
      [V_MODEL_SELECT]: `vModelSelect`,
      [V_MODEL_DYNAMIC]: `vModelDynamic`,
      [V_ON_WITH_MODIFIERS]: `withModifiers`,
      [V_ON_WITH_KEYS]: `withKeys`,
      [V_SHOW]: `vShow`,
      [TRANSITION]: `Transition`,
      [TRANSITION_GROUP]: `TransitionGroup`
    });
    parserOptions = {
      parseMode: "html",
      isVoidTag,
      isNativeTag: (tag) => isHTMLTag(tag) || isSVGTag(tag) || isMathMLTag(tag),
      isPreTag: (tag) => tag === "pre",
      decodeEntities: decodeHtmlBrowser,
      isBuiltInComponent: (tag) => {
        if (tag === "Transition" || tag === "transition") {
          return TRANSITION;
        } else if (tag === "TransitionGroup" || tag === "transition-group") {
          return TRANSITION_GROUP;
        }
      },
      // https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
      getNamespace(tag, parent, rootNamespace) {
        let ns = parent ? parent.ns : rootNamespace;
        if (parent && ns === 2) {
          if (parent.tag === "annotation-xml") {
            if (tag === "svg") {
              return 1;
            }
            if (parent.props.some(
              (a) => a.type === 6 && a.name === "encoding" && a.value != null && (a.value.content === "text/html" || a.value.content === "application/xhtml+xml")
            )) {
              ns = 0;
            }
          } else if (/^m(?:[ions]|text)$/.test(parent.tag) && tag !== "mglyph" && tag !== "malignmark") {
            ns = 0;
          }
        } else if (parent && ns === 1) {
          if (parent.tag === "foreignObject" || parent.tag === "desc" || parent.tag === "title") {
            ns = 0;
          }
        }
        if (ns === 0) {
          if (tag === "svg") {
            return 1;
          }
          if (tag === "math") {
            return 2;
          }
        }
        return ns;
      }
    };
    transformStyle = (node) => {
      if (node.type === 1) {
        node.props.forEach((p, i) => {
          if (p.type === 6 && p.name === "style" && p.value) {
            node.props[i] = {
              type: 7,
              name: `bind`,
              arg: createSimpleExpression(`style`, true, p.loc),
              exp: parseInlineCSS(p.value.content, p.loc),
              modifiers: [],
              loc: p.loc
            };
          }
        });
      }
    };
    parseInlineCSS = (cssText, loc) => {
      const normalized = parseStringStyle(cssText);
      return createSimpleExpression(
        JSON.stringify(normalized),
        false,
        loc,
        3
      );
    };
    DOMErrorCodes = {
      "X_V_HTML_NO_EXPRESSION": 53,
      "53": "X_V_HTML_NO_EXPRESSION",
      "X_V_HTML_WITH_CHILDREN": 54,
      "54": "X_V_HTML_WITH_CHILDREN",
      "X_V_TEXT_NO_EXPRESSION": 55,
      "55": "X_V_TEXT_NO_EXPRESSION",
      "X_V_TEXT_WITH_CHILDREN": 56,
      "56": "X_V_TEXT_WITH_CHILDREN",
      "X_V_MODEL_ON_INVALID_ELEMENT": 57,
      "57": "X_V_MODEL_ON_INVALID_ELEMENT",
      "X_V_MODEL_ARG_ON_ELEMENT": 58,
      "58": "X_V_MODEL_ARG_ON_ELEMENT",
      "X_V_MODEL_ON_FILE_INPUT_ELEMENT": 59,
      "59": "X_V_MODEL_ON_FILE_INPUT_ELEMENT",
      "X_V_MODEL_UNNECESSARY_VALUE": 60,
      "60": "X_V_MODEL_UNNECESSARY_VALUE",
      "X_V_SHOW_NO_EXPRESSION": 61,
      "61": "X_V_SHOW_NO_EXPRESSION",
      "X_TRANSITION_INVALID_CHILDREN": 62,
      "62": "X_TRANSITION_INVALID_CHILDREN",
      "X_IGNORED_SIDE_EFFECT_TAG": 63,
      "63": "X_IGNORED_SIDE_EFFECT_TAG",
      "__EXTEND_POINT__": 64,
      "64": "__EXTEND_POINT__"
    };
    DOMErrorMessages = {
      [53]: `v-html is missing expression.`,
      [54]: `v-html will override element children.`,
      [55]: `v-text is missing expression.`,
      [56]: `v-text will override element children.`,
      [57]: `v-model can only be used on <input>, <textarea> and <select> elements.`,
      [58]: `v-model argument is not supported on plain elements.`,
      [59]: `v-model cannot be used on file inputs since they are read-only. Use a v-on:change listener instead.`,
      [60]: `Unnecessary value binding used alongside v-model. It will interfere with v-model's behavior.`,
      [61]: `v-show is missing expression.`,
      [62]: `<Transition> expects exactly one child element or component.`,
      [63]: `Tags with side effect (<script> and <style>) are ignored in client component templates.`
    };
    transformVHtml = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(53, loc)
        );
      }
      if (node.children.length) {
        context.onError(
          createDOMCompilerError(54, loc)
        );
        node.children.length = 0;
      }
      return {
        props: [
          createObjectProperty(
            createSimpleExpression(`innerHTML`, true, loc),
            exp || createSimpleExpression("", true)
          )
        ]
      };
    };
    transformVText = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(55, loc)
        );
      }
      if (node.children.length) {
        context.onError(
          createDOMCompilerError(56, loc)
        );
        node.children.length = 0;
      }
      return {
        props: [
          createObjectProperty(
            createSimpleExpression(`textContent`, true),
            exp ? getConstantType(exp, context) > 0 ? exp : createCallExpression(
              context.helperString(TO_DISPLAY_STRING),
              [exp],
              loc
            ) : createSimpleExpression("", true)
          )
        ]
      };
    };
    transformModel2 = (dir, node, context) => {
      const baseResult = transformModel(dir, node, context);
      if (!baseResult.props.length || node.tagType === 1) {
        return baseResult;
      }
      if (dir.arg) {
        context.onError(
          createDOMCompilerError(
            58,
            dir.arg.loc
          )
        );
      }
      function checkDuplicatedValue() {
        const value = findDir(node, "bind");
        if (value && isStaticArgOf(value.arg, "value")) {
          context.onError(
            createDOMCompilerError(
              60,
              value.loc
            )
          );
        }
      }
      const { tag } = node;
      const isCustomElement = context.isCustomElement(tag);
      if (tag === "input" || tag === "textarea" || tag === "select" || isCustomElement) {
        let directiveToUse = V_MODEL_TEXT;
        let isInvalidType = false;
        if (tag === "input" || isCustomElement) {
          const type = findProp(node, `type`);
          if (type) {
            if (type.type === 7) {
              directiveToUse = V_MODEL_DYNAMIC;
            } else if (type.value) {
              switch (type.value.content) {
                case "radio":
                  directiveToUse = V_MODEL_RADIO;
                  break;
                case "checkbox":
                  directiveToUse = V_MODEL_CHECKBOX;
                  break;
                case "file":
                  isInvalidType = true;
                  context.onError(
                    createDOMCompilerError(
                      59,
                      dir.loc
                    )
                  );
                  break;
                default:
                  checkDuplicatedValue();
                  break;
              }
            }
          } else if (hasDynamicKeyVBind(node)) {
            directiveToUse = V_MODEL_DYNAMIC;
          } else {
            checkDuplicatedValue();
          }
        } else if (tag === "select") {
          directiveToUse = V_MODEL_SELECT;
        } else {
          checkDuplicatedValue();
        }
        if (!isInvalidType) {
          baseResult.needRuntime = context.helper(directiveToUse);
        }
      } else {
        context.onError(
          createDOMCompilerError(
            57,
            dir.loc
          )
        );
      }
      baseResult.props = baseResult.props.filter(
        (p) => !(p.key.type === 4 && p.key.content === "modelValue")
      );
      return baseResult;
    };
    isEventOptionModifier = makeMap(`passive,once,capture`);
    isNonKeyModifier = makeMap(
      // event propagation management
      `stop,prevent,self,ctrl,shift,alt,meta,exact,middle`
    );
    maybeKeyModifier = makeMap("left,right");
    isKeyboardEvent = makeMap(
      `onkeyup,onkeydown,onkeypress`,
      true
    );
    resolveModifiers = (key, modifiers, context, loc) => {
      const keyModifiers = [];
      const nonKeyModifiers = [];
      const eventOptionModifiers = [];
      for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i];
        if (modifier === "native" && checkCompatEnabled(
          "COMPILER_V_ON_NATIVE",
          context,
          loc
        )) {
          eventOptionModifiers.push(modifier);
        } else if (isEventOptionModifier(modifier)) {
          eventOptionModifiers.push(modifier);
        } else {
          if (maybeKeyModifier(modifier)) {
            if (isStaticExp(key)) {
              if (isKeyboardEvent(key.content)) {
                keyModifiers.push(modifier);
              } else {
                nonKeyModifiers.push(modifier);
              }
            } else {
              keyModifiers.push(modifier);
              nonKeyModifiers.push(modifier);
            }
          } else {
            if (isNonKeyModifier(modifier)) {
              nonKeyModifiers.push(modifier);
            } else {
              keyModifiers.push(modifier);
            }
          }
        }
      }
      return {
        keyModifiers,
        nonKeyModifiers,
        eventOptionModifiers
      };
    };
    transformClick = (key, event) => {
      const isStaticClick = isStaticExp(key) && key.content.toLowerCase() === "onclick";
      return isStaticClick ? createSimpleExpression(event, true) : key.type !== 4 ? createCompoundExpression([
        `(`,
        key,
        `) === "onClick" ? "${event}" : (`,
        key,
        `)`
      ]) : key;
    };
    transformOn2 = (dir, node, context) => {
      return transformOn(dir, node, context, (baseResult) => {
        const { modifiers } = dir;
        if (!modifiers.length)
          return baseResult;
        let { key, value: handlerExp } = baseResult.props[0];
        const { keyModifiers, nonKeyModifiers, eventOptionModifiers } = resolveModifiers(key, modifiers, context, dir.loc);
        if (nonKeyModifiers.includes("right")) {
          key = transformClick(key, `onContextmenu`);
        }
        if (nonKeyModifiers.includes("middle")) {
          key = transformClick(key, `onMouseup`);
        }
        if (nonKeyModifiers.length) {
          handlerExp = createCallExpression(context.helper(V_ON_WITH_MODIFIERS), [
            handlerExp,
            JSON.stringify(nonKeyModifiers)
          ]);
        }
        if (keyModifiers.length && // if event name is dynamic, always wrap with keys guard
        (!isStaticExp(key) || isKeyboardEvent(key.content))) {
          handlerExp = createCallExpression(context.helper(V_ON_WITH_KEYS), [
            handlerExp,
            JSON.stringify(keyModifiers)
          ]);
        }
        if (eventOptionModifiers.length) {
          const modifierPostfix = eventOptionModifiers.map(capitalize).join("");
          key = isStaticExp(key) ? createSimpleExpression(`${key.content}${modifierPostfix}`, true) : createCompoundExpression([`(`, key, `) + "${modifierPostfix}"`]);
        }
        return {
          props: [createObjectProperty(key, handlerExp)]
        };
      });
    };
    transformShow = (dir, node, context) => {
      const { exp, loc } = dir;
      if (!exp) {
        context.onError(
          createDOMCompilerError(61, loc)
        );
      }
      return {
        props: [],
        needRuntime: context.helper(V_SHOW)
      };
    };
    transformTransition = (node, context) => {
      if (node.type === 1 && node.tagType === 1) {
        const component = context.isBuiltInComponent(node.tag);
        if (component === TRANSITION) {
          return () => {
            if (!node.children.length) {
              return;
            }
            if (hasMultipleChildren(node)) {
              context.onError(
                createDOMCompilerError(
                  62,
                  {
                    start: node.children[0].loc.start,
                    end: node.children[node.children.length - 1].loc.end,
                    source: ""
                  }
                )
              );
            }
            const child = node.children[0];
            if (child.type === 1) {
              for (const p of child.props) {
                if (p.type === 7 && p.name === "show") {
                  node.props.push({
                    type: 6,
                    name: "persisted",
                    nameLoc: node.loc,
                    value: void 0,
                    loc: node.loc
                  });
                }
              }
            }
          };
        }
      }
    };
    ignoreSideEffectTags = (node, context) => {
      if (node.type === 1 && node.tagType === 0 && (node.tag === "script" || node.tag === "style")) {
        context.onError(
          createDOMCompilerError(
            63,
            node.loc
          )
        );
        context.removeNode();
      }
    };
    DOMNodeTransforms = [
      transformStyle,
      ...true ? [transformTransition] : []
    ];
    DOMDirectiveTransforms = {
      cloak: noopDirectiveTransform,
      html: transformVHtml,
      text: transformVText,
      model: transformModel2,
      // override compiler-core
      on: transformOn2,
      // override compiler-core
      show: transformShow
    };
  }
});

// node_modules/vue/dist/vue.cjs.js
var require_vue_cjs = __commonJS({
  "node_modules/vue/dist/vue.cjs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var compilerDom = (init_compiler_dom_esm_bundler(), __toCommonJS(compiler_dom_esm_bundler_exports));
    var runtimeDom = (init_runtime_dom_esm_bundler(), __toCommonJS(runtime_dom_esm_bundler_exports));
    var shared = (init_shared_esm_bundler(), __toCommonJS(shared_esm_bundler_exports));
    function _interopNamespaceDefault(e) {
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        for (var k in e) {
          n[k] = e[k];
        }
      }
      n.default = e;
      return Object.freeze(n);
    }
    var runtimeDom__namespace = _interopNamespaceDefault(runtimeDom);
    var compileCache = /* @__PURE__ */ new WeakMap();
    function getCache(options) {
      let c = compileCache.get(options != null ? options : shared.EMPTY_OBJ);
      if (!c) {
        c = /* @__PURE__ */ Object.create(null);
        compileCache.set(options != null ? options : shared.EMPTY_OBJ, c);
      }
      return c;
    }
    function compileToFunction(template, options) {
      if (!shared.isString(template)) {
        if (template.nodeType) {
          template = template.innerHTML;
        } else {
          runtimeDom.warn(`invalid template option: `, template);
          return shared.NOOP;
        }
      }
      const key = template;
      const cache = getCache(options);
      const cached = cache[key];
      if (cached) {
        return cached;
      }
      if (template[0] === "#") {
        const el = document.querySelector(template);
        if (!el) {
          runtimeDom.warn(`Template element not found or is empty: ${template}`);
        }
        template = el ? el.innerHTML : ``;
      }
      const opts = shared.extend(
        {
          hoistStatic: true,
          onError,
          onWarn: (e) => onError(e, true)
        },
        options
      );
      if (!opts.isCustomElement && typeof customElements !== "undefined") {
        opts.isCustomElement = (tag) => !!customElements.get(tag);
      }
      const { code } = compilerDom.compile(template, opts);
      function onError(err, asWarning = false) {
        const message = asWarning ? err.message : `Template compilation error: ${err.message}`;
        const codeFrame = err.loc && shared.generateCodeFrame(
          template,
          err.loc.start.offset,
          err.loc.end.offset
        );
        runtimeDom.warn(codeFrame ? `${message}
${codeFrame}` : message);
      }
      const render = new Function("Vue", code)(runtimeDom__namespace);
      render._rc = true;
      return cache[key] = render;
    }
    runtimeDom.registerRuntimeCompiler(compileToFunction);
    exports.compile = compileToFunction;
    Object.keys(runtimeDom).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
        exports[k] = runtimeDom[k];
    });
  }
});

// node_modules/vue/index.js
var require_vue = __commonJS({
  "node_modules/vue/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_vue_cjs();
    }
  }
});

// node_modules/vue-grid-layout/dist/vue-grid-layout.common.js
var require_vue_grid_layout_common = __commonJS({
  "node_modules/vue-grid-layout/dist/vue-grid-layout.common.js"(exports, module) {
    module.exports = /******/
    function(modules) {
      var installedModules = {};
      function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
          return installedModules[moduleId].exports;
        }
        var module2 = installedModules[moduleId] = {
          /******/
          i: moduleId,
          /******/
          l: false,
          /******/
          exports: {}
          /******/
        };
        modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
        module2.l = true;
        return module2.exports;
      }
      __webpack_require__.m = modules;
      __webpack_require__.c = installedModules;
      __webpack_require__.d = function(exports2, name, getter) {
        if (!__webpack_require__.o(exports2, name)) {
          Object.defineProperty(exports2, name, { enumerable: true, get: getter });
        }
      };
      __webpack_require__.r = function(exports2) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
          Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
        }
        Object.defineProperty(exports2, "__esModule", { value: true });
      };
      __webpack_require__.t = function(value, mode) {
        if (mode & 1)
          value = __webpack_require__(value);
        if (mode & 8)
          return value;
        if (mode & 4 && typeof value === "object" && value && value.__esModule)
          return value;
        var ns = /* @__PURE__ */ Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, "default", { enumerable: true, value });
        if (mode & 2 && typeof value != "string")
          for (var key in value)
            __webpack_require__.d(ns, key, (function(key2) {
              return value[key2];
            }).bind(null, key));
        return ns;
      };
      __webpack_require__.n = function(module2) {
        var getter = module2 && module2.__esModule ? (
          /******/
          function getDefault() {
            return module2["default"];
          }
        ) : (
          /******/
          function getModuleExports() {
            return module2;
          }
        );
        __webpack_require__.d(getter, "a", getter);
        return getter;
      };
      __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      __webpack_require__.p = "";
      return __webpack_require__(__webpack_require__.s = "fb15");
    }({
      /***/
      "01f9": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var LIBRARY = __webpack_require__("2d00");
          var $export = __webpack_require__("5ca1");
          var redefine = __webpack_require__("2aba");
          var hide = __webpack_require__("32e9");
          var Iterators = __webpack_require__("84f2");
          var $iterCreate = __webpack_require__("41a0");
          var setToStringTag = __webpack_require__("7f20");
          var getPrototypeOf = __webpack_require__("38fd");
          var ITERATOR = __webpack_require__("2b4c")("iterator");
          var BUGGY = !([].keys && "next" in [].keys());
          var FF_ITERATOR = "@@iterator";
          var KEYS = "keys";
          var VALUES = "values";
          var returnThis = function() {
            return this;
          };
          module2.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
            $iterCreate(Constructor, NAME, next);
            var getMethod = function(kind) {
              if (!BUGGY && kind in proto)
                return proto[kind];
              switch (kind) {
                case KEYS:
                  return function keys() {
                    return new Constructor(this, kind);
                  };
                case VALUES:
                  return function values() {
                    return new Constructor(this, kind);
                  };
              }
              return function entries() {
                return new Constructor(this, kind);
              };
            };
            var TAG = NAME + " Iterator";
            var DEF_VALUES = DEFAULT == VALUES;
            var VALUES_BUG = false;
            var proto = Base.prototype;
            var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
            var $default = $native || getMethod(DEFAULT);
            var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod("entries") : void 0;
            var $anyNative = NAME == "Array" ? proto.entries || $native : $native;
            var methods, key, IteratorPrototype;
            if ($anyNative) {
              IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
              if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
                setToStringTag(IteratorPrototype, TAG, true);
                if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != "function")
                  hide(IteratorPrototype, ITERATOR, returnThis);
              }
            }
            if (DEF_VALUES && $native && $native.name !== VALUES) {
              VALUES_BUG = true;
              $default = function values() {
                return $native.call(this);
              };
            }
            if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
              hide(proto, ITERATOR, $default);
            }
            Iterators[NAME] = $default;
            Iterators[TAG] = returnThis;
            if (DEFAULT) {
              methods = {
                values: DEF_VALUES ? $default : getMethod(VALUES),
                keys: IS_SET ? $default : getMethod(KEYS),
                entries: $entries
              };
              if (FORCED)
                for (key in methods) {
                  if (!(key in proto))
                    redefine(proto, key, methods[key]);
                }
              else
                $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
            }
            return methods;
          };
        }
      ),
      /***/
      "02f4": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("4588");
          var defined = __webpack_require__("be13");
          module2.exports = function(TO_STRING) {
            return function(that, pos) {
              var s = String(defined(that));
              var i = toInteger(pos);
              var l = s.length;
              var a, b;
              if (i < 0 || i >= l)
                return TO_STRING ? "" : void 0;
              a = s.charCodeAt(i);
              return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
            };
          };
        }
      ),
      /***/
      "0390": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var at = __webpack_require__("02f4")(true);
          module2.exports = function(S, index, unicode) {
            return index + (unicode ? at(S, index).length : 1);
          };
        }
      ),
      /***/
      "083e": (
        /***/
        function(module2, __webpack_exports__, __webpack_require__) {
          "use strict";
          var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_GridItem_vue_vue_type_style_index_0_id_46ff2fc8_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c541");
          var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_GridItem_vue_vue_type_style_index_0_id_46ff2fc8_lang_css__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_GridItem_vue_vue_type_style_index_0_id_46ff2fc8_lang_css__WEBPACK_IMPORTED_MODULE_0__);
        }
      ),
      /***/
      "0bfb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var anObject = __webpack_require__("cb7c");
          module2.exports = function() {
            var that = anObject(this);
            var result = "";
            if (that.global)
              result += "g";
            if (that.ignoreCase)
              result += "i";
            if (that.multiline)
              result += "m";
            if (that.unicode)
              result += "u";
            if (that.sticky)
              result += "y";
            return result;
          };
        }
      ),
      /***/
      "0d58": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $keys = __webpack_require__("ce10");
          var enumBugKeys = __webpack_require__("e11e");
          module2.exports = Object.keys || function keys(O) {
            return $keys(O, enumBugKeys);
          };
        }
      ),
      /***/
      "11e9": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var pIE = __webpack_require__("52a7");
          var createDesc = __webpack_require__("4630");
          var toIObject = __webpack_require__("6821");
          var toPrimitive = __webpack_require__("6a99");
          var has = __webpack_require__("69a8");
          var IE8_DOM_DEFINE = __webpack_require__("c69a");
          var gOPD = Object.getOwnPropertyDescriptor;
          exports2.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
            O = toIObject(O);
            P = toPrimitive(P, true);
            if (IE8_DOM_DEFINE)
              try {
                return gOPD(O, P);
              } catch (e) {
              }
            if (has(O, P))
              return createDesc(!pIE.f.call(O, P), O[P]);
          };
        }
      ),
      /***/
      "1495": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var dP = __webpack_require__("86cc");
          var anObject = __webpack_require__("cb7c");
          var getKeys = __webpack_require__("0d58");
          module2.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
            anObject(O);
            var keys = getKeys(Properties);
            var length = keys.length;
            var i = 0;
            var P;
            while (length > i)
              dP.f(O, P = keys[i++], Properties[P]);
            return O;
          };
        }
      ),
      /***/
      "18d2": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var browserDetector = __webpack_require__("18e9");
          module2.exports = function(options) {
            options = options || {};
            var reporter = options.reporter;
            var batchProcessor = options.batchProcessor;
            var getState = options.stateHandler.getState;
            if (!reporter) {
              throw new Error("Missing required dependency: reporter.");
            }
            function addListener(element, listener) {
              function listenerProxy() {
                listener(element);
              }
              if (browserDetector.isIE(8)) {
                getState(element).object = {
                  proxy: listenerProxy
                };
                element.attachEvent("onresize", listenerProxy);
              } else {
                var object = getObject(element);
                if (!object) {
                  throw new Error("Element is not detectable by this strategy.");
                }
                object.contentDocument.defaultView.addEventListener("resize", listenerProxy);
              }
            }
            function buildCssTextString(rules) {
              var seperator = options.important ? " !important; " : "; ";
              return (rules.join(seperator) + seperator).trim();
            }
            function makeDetectable(options2, element, callback) {
              if (!callback) {
                callback = element;
                element = options2;
                options2 = null;
              }
              options2 = options2 || {};
              var debug = options2.debug;
              function injectObject(element2, callback2) {
                var OBJECT_STYLE = buildCssTextString(["display: block", "position: absolute", "top: 0", "left: 0", "width: 100%", "height: 100%", "border: none", "padding: 0", "margin: 0", "opacity: 0", "z-index: -1000", "pointer-events: none"]);
                var positionCheckPerformed = false;
                var style = window.getComputedStyle(element2);
                var width = element2.offsetWidth;
                var height = element2.offsetHeight;
                getState(element2).startSize = {
                  width,
                  height
                };
                function mutateDom() {
                  function alterPositionStyles() {
                    if (style.position === "static") {
                      element2.style.setProperty("position", "relative", options2.important ? "important" : "");
                      var removeRelativeStyles = function(reporter2, element3, style2, property) {
                        function getNumericalValue(value2) {
                          return value2.replace(/[^-\d\.]/g, "");
                        }
                        var value = style2[property];
                        if (value !== "auto" && getNumericalValue(value) !== "0") {
                          reporter2.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element3);
                          element3.style.setProperty(property, "0", options2.important ? "important" : "");
                        }
                      };
                      removeRelativeStyles(reporter, element2, style, "top");
                      removeRelativeStyles(reporter, element2, style, "right");
                      removeRelativeStyles(reporter, element2, style, "bottom");
                      removeRelativeStyles(reporter, element2, style, "left");
                    }
                  }
                  function onObjectLoad() {
                    if (!positionCheckPerformed) {
                      alterPositionStyles();
                    }
                    function getDocument(element3, callback3) {
                      if (!element3.contentDocument) {
                        var state = getState(element3);
                        if (state.checkForObjectDocumentTimeoutId) {
                          window.clearTimeout(state.checkForObjectDocumentTimeoutId);
                        }
                        state.checkForObjectDocumentTimeoutId = setTimeout(function checkForObjectDocument() {
                          state.checkForObjectDocumentTimeoutId = 0;
                          getDocument(element3, callback3);
                        }, 100);
                        return;
                      }
                      callback3(element3.contentDocument);
                    }
                    var objectElement = this;
                    getDocument(objectElement, function onObjectDocumentReady(objectDocument) {
                      callback2(element2);
                    });
                  }
                  if (style.position !== "") {
                    alterPositionStyles(style);
                    positionCheckPerformed = true;
                  }
                  var object = document.createElement("object");
                  object.style.cssText = OBJECT_STYLE;
                  object.tabIndex = -1;
                  object.type = "text/html";
                  object.setAttribute("aria-hidden", "true");
                  object.onload = onObjectLoad;
                  if (!browserDetector.isIE()) {
                    object.data = "about:blank";
                  }
                  if (!getState(element2)) {
                    return;
                  }
                  element2.appendChild(object);
                  getState(element2).object = object;
                  if (browserDetector.isIE()) {
                    object.data = "about:blank";
                  }
                }
                if (batchProcessor) {
                  batchProcessor.add(mutateDom);
                } else {
                  mutateDom();
                }
              }
              if (browserDetector.isIE(8)) {
                callback(element);
              } else {
                injectObject(element, callback);
              }
            }
            function getObject(element) {
              return getState(element).object;
            }
            function uninstall(element) {
              if (!getState(element)) {
                return;
              }
              var object = getObject(element);
              if (!object) {
                return;
              }
              if (browserDetector.isIE(8)) {
                element.detachEvent("onresize", object.proxy);
              } else {
                element.removeChild(object);
              }
              if (getState(element).checkForObjectDocumentTimeoutId) {
                window.clearTimeout(getState(element).checkForObjectDocumentTimeoutId);
              }
              delete getState(element).object;
            }
            return {
              makeDetectable,
              addListener,
              uninstall
            };
          };
        }
      ),
      /***/
      "18e9": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var detector = module2.exports = {};
          detector.isIE = function(version) {
            function isAnyIeVersion() {
              var agent = navigator.userAgent.toLowerCase();
              return agent.indexOf("msie") !== -1 || agent.indexOf("trident") !== -1 || agent.indexOf(" edge/") !== -1;
            }
            if (!isAnyIeVersion()) {
              return false;
            }
            if (!version) {
              return true;
            }
            var ieVersion = function() {
              var undef, v = 3, div = document.createElement("div"), all = div.getElementsByTagName("i");
              do {
                div.innerHTML = "<!--[if gt IE " + ++v + "]><i></i><![endif]-->";
              } while (all[0]);
              return v > 4 ? v : undef;
            }();
            return version === ieVersion;
          };
          detector.isLegacyOpera = function() {
            return !!window.opera;
          };
        }
      ),
      /***/
      "214f": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          __webpack_require__("b0c5");
          var redefine = __webpack_require__("2aba");
          var hide = __webpack_require__("32e9");
          var fails = __webpack_require__("79e5");
          var defined = __webpack_require__("be13");
          var wks = __webpack_require__("2b4c");
          var regexpExec = __webpack_require__("520a");
          var SPECIES = wks("species");
          var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
            var re = /./;
            re.exec = function() {
              var result = [];
              result.groups = { a: "7" };
              return result;
            };
            return "".replace(re, "$<a>") !== "7";
          });
          var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = function() {
            var re = /(?:)/;
            var originalExec = re.exec;
            re.exec = function() {
              return originalExec.apply(this, arguments);
            };
            var result = "ab".split(re);
            return result.length === 2 && result[0] === "a" && result[1] === "b";
          }();
          module2.exports = function(KEY, length, exec) {
            var SYMBOL = wks(KEY);
            var DELEGATES_TO_SYMBOL = !fails(function() {
              var O = {};
              O[SYMBOL] = function() {
                return 7;
              };
              return ""[KEY](O) != 7;
            });
            var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function() {
              var execCalled = false;
              var re = /a/;
              re.exec = function() {
                execCalled = true;
                return null;
              };
              if (KEY === "split") {
                re.constructor = {};
                re.constructor[SPECIES] = function() {
                  return re;
                };
              }
              re[SYMBOL]("");
              return !execCalled;
            }) : void 0;
            if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === "replace" && !REPLACE_SUPPORTS_NAMED_GROUPS || KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
              var nativeRegExpMethod = /./[SYMBOL];
              var fns = exec(
                defined,
                SYMBOL,
                ""[KEY],
                function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
                  if (regexp.exec === regexpExec) {
                    if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                      return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
                    }
                    return { done: true, value: nativeMethod.call(str, regexp, arg2) };
                  }
                  return { done: false };
                }
              );
              var strfn = fns[0];
              var rxfn = fns[1];
              redefine(String.prototype, KEY, strfn);
              hide(
                RegExp.prototype,
                SYMBOL,
                length == 2 ? function(string, arg) {
                  return rxfn.call(string, this, arg);
                } : function(string) {
                  return rxfn.call(string, this);
                }
              );
            }
          };
        }
      ),
      /***/
      "230e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("d3f4");
          var document2 = __webpack_require__("7726").document;
          var is = isObject2(document2) && isObject2(document2.createElement);
          module2.exports = function(it) {
            return is ? document2.createElement(it) : {};
          };
        }
      ),
      /***/
      "23c6": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var cof = __webpack_require__("2d95");
          var TAG = __webpack_require__("2b4c")("toStringTag");
          var ARG = cof(function() {
            return arguments;
          }()) == "Arguments";
          var tryGet = function(it, key) {
            try {
              return it[key];
            } catch (e) {
            }
          };
          module2.exports = function(it) {
            var O, T, B;
            return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (T = tryGet(O = Object(it), TAG)) == "string" ? T : ARG ? cof(O) : (B = cof(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : B;
          };
        }
      ),
      /***/
      "24fb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          module2.exports = function(useSourceMap) {
            var list = [];
            list.toString = function toString() {
              return this.map(function(item) {
                var content = cssWithMappingToString(item, useSourceMap);
                if (item[2]) {
                  return "@media ".concat(item[2], " {").concat(content, "}");
                }
                return content;
              }).join("");
            };
            list.i = function(modules, mediaQuery, dedupe) {
              if (typeof modules === "string") {
                modules = [[null, modules, ""]];
              }
              var alreadyImportedModules = {};
              if (dedupe) {
                for (var i = 0; i < this.length; i++) {
                  var id = this[i][0];
                  if (id != null) {
                    alreadyImportedModules[id] = true;
                  }
                }
              }
              for (var _i = 0; _i < modules.length; _i++) {
                var item = [].concat(modules[_i]);
                if (dedupe && alreadyImportedModules[item[0]]) {
                  continue;
                }
                if (mediaQuery) {
                  if (!item[2]) {
                    item[2] = mediaQuery;
                  } else {
                    item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
                  }
                }
                list.push(item);
              }
            };
            return list;
          };
          function cssWithMappingToString(item, useSourceMap) {
            var content = item[1] || "";
            var cssMapping = item[3];
            if (!cssMapping) {
              return content;
            }
            if (useSourceMap && typeof btoa === "function") {
              var sourceMapping = toComment(cssMapping);
              var sourceURLs = cssMapping.sources.map(function(source) {
                return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
              });
              return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
            }
            return [content].join("\n");
          }
          function toComment(sourceMap) {
            var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
            var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
            return "/*# ".concat(data, " */");
          }
        }
      ),
      /***/
      "2621": (
        /***/
        function(module2, exports2) {
          exports2.f = Object.getOwnPropertySymbols;
        }
      ),
      /***/
      "2aba": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("7726");
          var hide = __webpack_require__("32e9");
          var has = __webpack_require__("69a8");
          var SRC = __webpack_require__("ca5a")("src");
          var $toString = __webpack_require__("fa5b");
          var TO_STRING = "toString";
          var TPL = ("" + $toString).split(TO_STRING);
          __webpack_require__("8378").inspectSource = function(it) {
            return $toString.call(it);
          };
          (module2.exports = function(O, key, val, safe) {
            var isFunction = typeof val == "function";
            if (isFunction)
              has(val, "name") || hide(val, "name", key);
            if (O[key] === val)
              return;
            if (isFunction)
              has(val, SRC) || hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)));
            if (O === global) {
              O[key] = val;
            } else if (!safe) {
              delete O[key];
              hide(O, key, val);
            } else if (O[key]) {
              O[key] = val;
            } else {
              hide(O, key, val);
            }
          })(Function.prototype, TO_STRING, function toString() {
            return typeof this == "function" && this[SRC] || $toString.call(this);
          });
        }
      ),
      /***/
      "2aeb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var anObject = __webpack_require__("cb7c");
          var dPs = __webpack_require__("1495");
          var enumBugKeys = __webpack_require__("e11e");
          var IE_PROTO = __webpack_require__("613b")("IE_PROTO");
          var Empty = function() {
          };
          var PROTOTYPE = "prototype";
          var createDict = function() {
            var iframe = __webpack_require__("230e")("iframe");
            var i = enumBugKeys.length;
            var lt = "<";
            var gt = ">";
            var iframeDocument;
            iframe.style.display = "none";
            __webpack_require__("fab2").appendChild(iframe);
            iframe.src = "javascript:";
            iframeDocument = iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write(lt + "script" + gt + "document.F=Object" + lt + "/script" + gt);
            iframeDocument.close();
            createDict = iframeDocument.F;
            while (i--)
              delete createDict[PROTOTYPE][enumBugKeys[i]];
            return createDict();
          };
          module2.exports = Object.create || function create(O, Properties) {
            var result;
            if (O !== null) {
              Empty[PROTOTYPE] = anObject(O);
              result = new Empty();
              Empty[PROTOTYPE] = null;
              result[IE_PROTO] = O;
            } else
              result = createDict();
            return Properties === void 0 ? result : dPs(result, Properties);
          };
        }
      ),
      /***/
      "2b4c": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var store = __webpack_require__("5537")("wks");
          var uid = __webpack_require__("ca5a");
          var Symbol2 = __webpack_require__("7726").Symbol;
          var USE_SYMBOL = typeof Symbol2 == "function";
          var $exports = module2.exports = function(name) {
            return store[name] || (store[name] = USE_SYMBOL && Symbol2[name] || (USE_SYMBOL ? Symbol2 : uid)("Symbol." + name));
          };
          $exports.store = store;
        }
      ),
      /***/
      "2cef": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          module2.exports = function() {
            var idCount = 1;
            function generate2() {
              return idCount++;
            }
            return {
              generate: generate2
            };
          };
        }
      ),
      /***/
      "2d00": (
        /***/
        function(module2, exports2) {
          module2.exports = false;
        }
      ),
      /***/
      "2d95": (
        /***/
        function(module2, exports2) {
          var toString = {}.toString;
          module2.exports = function(it) {
            return toString.call(it).slice(8, -1);
          };
        }
      ),
      /***/
      "2f21": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var fails = __webpack_require__("79e5");
          module2.exports = function(method, arg) {
            return !!method && fails(function() {
              arg ? method.call(null, function() {
              }, 1) : method.call(null);
            });
          };
        }
      ),
      /***/
      "32e9": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var dP = __webpack_require__("86cc");
          var createDesc = __webpack_require__("4630");
          module2.exports = __webpack_require__("9e1e") ? function(object, key, value) {
            return dP.f(object, key, createDesc(1, value));
          } : function(object, key, value) {
            object[key] = value;
            return object;
          };
        }
      ),
      /***/
      "38fd": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var has = __webpack_require__("69a8");
          var toObject = __webpack_require__("4bf8");
          var IE_PROTO = __webpack_require__("613b")("IE_PROTO");
          var ObjectProto = Object.prototype;
          module2.exports = Object.getPrototypeOf || function(O) {
            O = toObject(O);
            if (has(O, IE_PROTO))
              return O[IE_PROTO];
            if (typeof O.constructor == "function" && O instanceof O.constructor) {
              return O.constructor.prototype;
            }
            return O instanceof Object ? ObjectProto : null;
          };
        }
      ),
      /***/
      "41a0": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var create = __webpack_require__("2aeb");
          var descriptor = __webpack_require__("4630");
          var setToStringTag = __webpack_require__("7f20");
          var IteratorPrototype = {};
          __webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")("iterator"), function() {
            return this;
          });
          module2.exports = function(Constructor, NAME, next) {
            Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
            setToStringTag(Constructor, NAME + " Iterator");
          };
        }
      ),
      /***/
      "456d": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toObject = __webpack_require__("4bf8");
          var $keys = __webpack_require__("0d58");
          __webpack_require__("5eda")("keys", function() {
            return function keys(it) {
              return $keys(toObject(it));
            };
          });
        }
      ),
      /***/
      "4588": (
        /***/
        function(module2, exports2) {
          var ceil = Math.ceil;
          var floor = Math.floor;
          module2.exports = function(it) {
            return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
          };
        }
      ),
      /***/
      "4630": (
        /***/
        function(module2, exports2) {
          module2.exports = function(bitmap, value) {
            return {
              enumerable: !(bitmap & 1),
              configurable: !(bitmap & 2),
              writable: !(bitmap & 4),
              value
            };
          };
        }
      ),
      /***/
      "4917": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var anObject = __webpack_require__("cb7c");
          var toLength = __webpack_require__("9def");
          var advanceStringIndex = __webpack_require__("0390");
          var regExpExec = __webpack_require__("5f1b");
          __webpack_require__("214f")("match", 1, function(defined, MATCH, $match, maybeCallNative) {
            return [
              // `String.prototype.match` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.match
              function match(regexp) {
                var O = defined(this);
                var fn = regexp == void 0 ? void 0 : regexp[MATCH];
                return fn !== void 0 ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
              },
              // `RegExp.prototype[@@match]` method
              // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
              function(regexp) {
                var res = maybeCallNative($match, regexp, this);
                if (res.done)
                  return res.value;
                var rx = anObject(regexp);
                var S = String(this);
                if (!rx.global)
                  return regExpExec(rx, S);
                var fullUnicode = rx.unicode;
                rx.lastIndex = 0;
                var A = [];
                var n = 0;
                var result;
                while ((result = regExpExec(rx, S)) !== null) {
                  var matchStr = String(result[0]);
                  A[n] = matchStr;
                  if (matchStr === "")
                    rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                  n++;
                }
                return n === 0 ? null : A;
              }
            ];
          });
        }
      ),
      /***/
      "493e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
          exports2 = ___CSS_LOADER_API_IMPORT___(false);
          exports2.push([module2.i, '.vue-grid-item{-webkit-transition:all .2s ease;transition:all .2s ease;-webkit-transition-property:left,top,right;transition-property:left,top,right}.vue-grid-item,.vue-grid-item.no-touch{-ms-touch-action:none;touch-action:none}.vue-grid-item.cssTransforms{-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;transition-property:transform;transition-property:transform,-webkit-transform;left:0;right:auto}.vue-grid-item.cssTransforms.render-rtl{left:auto;right:0}.vue-grid-item.resizing{opacity:.6;z-index:3}.vue-grid-item.vue-draggable-dragging{-webkit-transition:none;transition:none;z-index:3}.vue-grid-item.vue-grid-placeholder{background:red;opacity:.2;-webkit-transition-duration:.1s;transition-duration:.1s;z-index:2;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.vue-grid-item>.vue-resizable-handle{position:absolute;width:20px;height:20px;bottom:0;right:0;background:url("data:image/svg+xml;base64,PHN2ZyBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjYiIGhlaWdodD0iNiI+PHBhdGggZD0iTTYgNkgwVjQuMmg0LjJWMEg2djZ6IiBvcGFjaXR5PSIuMzAyIi8+PC9zdmc+");background-position:100% 100%;padding:0 3px 3px 0;background-repeat:no-repeat;background-origin:content-box;-webkit-box-sizing:border-box;box-sizing:border-box;cursor:se-resize}.vue-grid-item>.vue-rtl-resizable-handle{bottom:0;left:0;background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTS0xLTFoMTJ2MTJILTF6Ii8+PGc+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InVuZGVmaW5lZCIgc3Ryb2tlLWxpbmVqb2luPSJ1bmRlZmluZWQiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2U9IiMwMDAiIGZpbGw9Im5vbmUiIGQ9Ik0xNDQuODIxLTM4LjM5M2wtMjAuMzU3LTMxLjc4NSIvPjxwYXRoIHN0cm9rZT0iIzY2NiIgc3Ryb2tlLWxpbmVjYXA9InVuZGVmaW5lZCIgc3Ryb2tlLWxpbmVqb2luPSJ1bmRlZmluZWQiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgZD0iTS45NDctLjAxOHY5LjEyNU0tLjY1NiA5aDEwLjczIi8+PC9nPjwvc3ZnPg==);background-position:0 100%;padding-left:3px;background-repeat:no-repeat;background-origin:content-box;cursor:sw-resize;right:auto}.vue-grid-item.disable-userselect{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}', ""]);
          module2.exports = exports2;
        }
      ),
      /***/
      "499e": (
        /***/
        function(module2, __webpack_exports__, __webpack_require__) {
          "use strict";
          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, "default", function() {
            return (
              /* binding */
              addStylesClient
            );
          });
          function listToStyles(parentId, list) {
            var styles = [];
            var newStyles = {};
            for (var i = 0; i < list.length; i++) {
              var item = list[i];
              var id = item[0];
              var css = item[1];
              var media = item[2];
              var sourceMap = item[3];
              var part = {
                id: parentId + ":" + i,
                css,
                media,
                sourceMap
              };
              if (!newStyles[id]) {
                styles.push(newStyles[id] = { id, parts: [part] });
              } else {
                newStyles[id].parts.push(part);
              }
            }
            return styles;
          }
          var hasDocument = typeof document !== "undefined";
          if (typeof DEBUG !== "undefined" && DEBUG) {
            if (!hasDocument) {
              throw new Error(
                "vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
              );
            }
          }
          var stylesInDom = {
            /*
              [id: number]: {
                id: number,
                refs: number,
                parts: Array<(obj?: StyleObjectPart) => void>
              }
            */
          };
          var head = hasDocument && (document.head || document.getElementsByTagName("head")[0]);
          var singletonElement = null;
          var singletonCounter = 0;
          var isProduction = false;
          var noop = function() {
          };
          var options = null;
          var ssrIdKey = "data-vue-ssr-id";
          var isOldIE = typeof navigator !== "undefined" && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
          function addStylesClient(parentId, list, _isProduction, _options) {
            isProduction = _isProduction;
            options = _options || {};
            var styles = listToStyles(parentId, list);
            addStylesToDom(styles);
            return function update(newList) {
              var mayRemove = [];
              for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                var domStyle = stylesInDom[item.id];
                domStyle.refs--;
                mayRemove.push(domStyle);
              }
              if (newList) {
                styles = listToStyles(parentId, newList);
                addStylesToDom(styles);
              } else {
                styles = [];
              }
              for (var i = 0; i < mayRemove.length; i++) {
                var domStyle = mayRemove[i];
                if (domStyle.refs === 0) {
                  for (var j = 0; j < domStyle.parts.length; j++) {
                    domStyle.parts[j]();
                  }
                  delete stylesInDom[domStyle.id];
                }
              }
            };
          }
          function addStylesToDom(styles) {
            for (var i = 0; i < styles.length; i++) {
              var item = styles[i];
              var domStyle = stylesInDom[item.id];
              if (domStyle) {
                domStyle.refs++;
                for (var j = 0; j < domStyle.parts.length; j++) {
                  domStyle.parts[j](item.parts[j]);
                }
                for (; j < item.parts.length; j++) {
                  domStyle.parts.push(addStyle(item.parts[j]));
                }
                if (domStyle.parts.length > item.parts.length) {
                  domStyle.parts.length = item.parts.length;
                }
              } else {
                var parts = [];
                for (var j = 0; j < item.parts.length; j++) {
                  parts.push(addStyle(item.parts[j]));
                }
                stylesInDom[item.id] = { id: item.id, refs: 1, parts };
              }
            }
          }
          function createStyleElement() {
            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            head.appendChild(styleElement);
            return styleElement;
          }
          function addStyle(obj) {
            var update, remove;
            var styleElement = document.querySelector("style[" + ssrIdKey + '~="' + obj.id + '"]');
            if (styleElement) {
              if (isProduction) {
                return noop;
              } else {
                styleElement.parentNode.removeChild(styleElement);
              }
            }
            if (isOldIE) {
              var styleIndex = singletonCounter++;
              styleElement = singletonElement || (singletonElement = createStyleElement());
              update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
              remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
            } else {
              styleElement = createStyleElement();
              update = applyToTag.bind(null, styleElement);
              remove = function() {
                styleElement.parentNode.removeChild(styleElement);
              };
            }
            update(obj);
            return function updateStyle(newObj) {
              if (newObj) {
                if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
                  return;
                }
                update(obj = newObj);
              } else {
                remove();
              }
            };
          }
          var replaceText = function() {
            var textStore = [];
            return function(index, replacement) {
              textStore[index] = replacement;
              return textStore.filter(Boolean).join("\n");
            };
          }();
          function applyToSingletonTag(styleElement, index, remove, obj) {
            var css = remove ? "" : obj.css;
            if (styleElement.styleSheet) {
              styleElement.styleSheet.cssText = replaceText(index, css);
            } else {
              var cssNode = document.createTextNode(css);
              var childNodes = styleElement.childNodes;
              if (childNodes[index])
                styleElement.removeChild(childNodes[index]);
              if (childNodes.length) {
                styleElement.insertBefore(cssNode, childNodes[index]);
              } else {
                styleElement.appendChild(cssNode);
              }
            }
          }
          function applyToTag(styleElement, obj) {
            var css = obj.css;
            var media = obj.media;
            var sourceMap = obj.sourceMap;
            if (media) {
              styleElement.setAttribute("media", media);
            }
            if (options.ssrId) {
              styleElement.setAttribute(ssrIdKey, obj.id);
            }
            if (sourceMap) {
              css += "\n/*# sourceURL=" + sourceMap.sources[0] + " */";
              css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
            }
            if (styleElement.styleSheet) {
              styleElement.styleSheet.cssText = css;
            } else {
              while (styleElement.firstChild) {
                styleElement.removeChild(styleElement.firstChild);
              }
              styleElement.appendChild(document.createTextNode(css));
            }
          }
        }
      ),
      /***/
      "49ad": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          module2.exports = function(idHandler) {
            var eventListeners = {};
            function getListeners(element) {
              var id = idHandler.get(element);
              if (id === void 0) {
                return [];
              }
              return eventListeners[id] || [];
            }
            function addListener(element, listener) {
              var id = idHandler.get(element);
              if (!eventListeners[id]) {
                eventListeners[id] = [];
              }
              eventListeners[id].push(listener);
            }
            function removeListener(element, listener) {
              var listeners = getListeners(element);
              for (var i = 0, len = listeners.length; i < len; ++i) {
                if (listeners[i] === listener) {
                  listeners.splice(i, 1);
                  break;
                }
              }
            }
            function removeAllListeners(element) {
              var listeners = getListeners(element);
              if (!listeners) {
                return;
              }
              listeners.length = 0;
            }
            return {
              get: getListeners,
              add: addListener,
              removeListener,
              removeAllListeners
            };
          };
        }
      ),
      /***/
      "4bf8": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var defined = __webpack_require__("be13");
          module2.exports = function(it) {
            return Object(defined(it));
          };
        }
      ),
      /***/
      "5058": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          module2.exports = function(options) {
            var idGenerator = options.idGenerator;
            var getState = options.stateHandler.getState;
            function getId(element) {
              var state = getState(element);
              if (state && state.id !== void 0) {
                return state.id;
              }
              return null;
            }
            function setId(element) {
              var state = getState(element);
              if (!state) {
                throw new Error("setId required the element to have a resize detection state.");
              }
              var id = idGenerator.generate();
              state.id = id;
              return id;
            }
            return {
              get: getId,
              set: setId
            };
          };
        }
      ),
      /***/
      "50bf": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var utils = module2.exports = {};
          utils.getOption = getOption;
          function getOption(options, name, defaultValue) {
            var value = options[name];
            if ((value === void 0 || value === null) && defaultValue !== void 0) {
              return defaultValue;
            }
            return value;
          }
        }
      ),
      /***/
      "520a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var regexpFlags = __webpack_require__("0bfb");
          var nativeExec = RegExp.prototype.exec;
          var nativeReplace = String.prototype.replace;
          var patchedExec = nativeExec;
          var LAST_INDEX = "lastIndex";
          var UPDATES_LAST_INDEX_WRONG = function() {
            var re1 = /a/, re2 = /b*/g;
            nativeExec.call(re1, "a");
            nativeExec.call(re2, "a");
            return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
          }();
          var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
          var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;
          if (PATCH) {
            patchedExec = function exec(str) {
              var re = this;
              var lastIndex, reCopy, match, i;
              if (NPCG_INCLUDED) {
                reCopy = new RegExp("^" + re.source + "$(?!\\s)", regexpFlags.call(re));
              }
              if (UPDATES_LAST_INDEX_WRONG)
                lastIndex = re[LAST_INDEX];
              match = nativeExec.call(re, str);
              if (UPDATES_LAST_INDEX_WRONG && match) {
                re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
              }
              if (NPCG_INCLUDED && match && match.length > 1) {
                nativeReplace.call(match[0], reCopy, function() {
                  for (i = 1; i < arguments.length - 2; i++) {
                    if (arguments[i] === void 0)
                      match[i] = void 0;
                  }
                });
              }
              return match;
            };
          }
          module2.exports = patchedExec;
        }
      ),
      /***/
      "52a7": (
        /***/
        function(module2, exports2) {
          exports2.f = {}.propertyIsEnumerable;
        }
      ),
      /***/
      "5537": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var core = __webpack_require__("8378");
          var global = __webpack_require__("7726");
          var SHARED = "__core-js_shared__";
          var store = global[SHARED] || (global[SHARED] = {});
          (module2.exports = function(key, value) {
            return store[key] || (store[key] = value !== void 0 ? value : {});
          })("versions", []).push({
            version: core.version,
            mode: __webpack_require__("2d00") ? "pure" : "global",
            copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
          });
        }
      ),
      /***/
      "55dd": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $export = __webpack_require__("5ca1");
          var aFunction = __webpack_require__("d8e8");
          var toObject = __webpack_require__("4bf8");
          var fails = __webpack_require__("79e5");
          var $sort = [].sort;
          var test = [1, 2, 3];
          $export($export.P + $export.F * (fails(function() {
            test.sort(void 0);
          }) || !fails(function() {
            test.sort(null);
          }) || !__webpack_require__("2f21")($sort)), "Array", {
            // 22.1.3.25 Array.prototype.sort(comparefn)
            sort: function sort(comparefn) {
              return comparefn === void 0 ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
            }
          });
        }
      ),
      /***/
      "5be5": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          module2.exports = function(options) {
            var getState = options.stateHandler.getState;
            function isDetectable(element) {
              var state = getState(element);
              return state && !!state.isDetectable;
            }
            function markAsDetectable(element) {
              getState(element).isDetectable = true;
            }
            function isBusy(element) {
              return !!getState(element).busy;
            }
            function markBusy(element, busy) {
              getState(element).busy = !!busy;
            }
            return {
              isDetectable,
              markAsDetectable,
              isBusy,
              markBusy
            };
          };
        }
      ),
      /***/
      "5ca1": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var global = __webpack_require__("7726");
          var core = __webpack_require__("8378");
          var hide = __webpack_require__("32e9");
          var redefine = __webpack_require__("2aba");
          var ctx = __webpack_require__("9b43");
          var PROTOTYPE = "prototype";
          var $export = function(type, name, source) {
            var IS_FORCED = type & $export.F;
            var IS_GLOBAL = type & $export.G;
            var IS_STATIC = type & $export.S;
            var IS_PROTO = type & $export.P;
            var IS_BIND = type & $export.B;
            var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
            var exports3 = IS_GLOBAL ? core : core[name] || (core[name] = {});
            var expProto = exports3[PROTOTYPE] || (exports3[PROTOTYPE] = {});
            var key, own, out, exp;
            if (IS_GLOBAL)
              source = name;
            for (key in source) {
              own = !IS_FORCED && target && target[key] !== void 0;
              out = (own ? target : source)[key];
              exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == "function" ? ctx(Function.call, out) : out;
              if (target)
                redefine(target, key, out, type & $export.U);
              if (exports3[key] != out)
                hide(exports3, key, exp);
              if (IS_PROTO && expProto[key] != out)
                expProto[key] = out;
            }
          };
          global.core = core;
          $export.F = 1;
          $export.G = 2;
          $export.S = 4;
          $export.P = 8;
          $export.B = 16;
          $export.W = 32;
          $export.U = 64;
          $export.R = 128;
          module2.exports = $export;
        }
      ),
      /***/
      "5dbc": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("d3f4");
          var setPrototypeOf = __webpack_require__("8b97").set;
          module2.exports = function(that, target, C) {
            var S = target.constructor;
            var P;
            if (S !== C && typeof S == "function" && (P = S.prototype) !== C.prototype && isObject2(P) && setPrototypeOf) {
              setPrototypeOf(that, P);
            }
            return that;
          };
        }
      ),
      /***/
      "5eda": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $export = __webpack_require__("5ca1");
          var core = __webpack_require__("8378");
          var fails = __webpack_require__("79e5");
          module2.exports = function(KEY, exec) {
            var fn = (core.Object || {})[KEY] || Object[KEY];
            var exp = {};
            exp[KEY] = exec(fn);
            $export($export.S + $export.F * fails(function() {
              fn(1);
            }), "Object", exp);
          };
        }
      ),
      /***/
      "5f1b": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var classof = __webpack_require__("23c6");
          var builtinExec = RegExp.prototype.exec;
          module2.exports = function(R, S) {
            var exec = R.exec;
            if (typeof exec === "function") {
              var result = exec.call(R, S);
              if (typeof result !== "object") {
                throw new TypeError("RegExp exec method returned something other than an Object or null");
              }
              return result;
            }
            if (classof(R) !== "RegExp") {
              throw new TypeError("RegExp#exec called on incompatible receiver");
            }
            return builtinExec.call(R, S);
          };
        }
      ),
      /***/
      "613b": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var shared = __webpack_require__("5537")("keys");
          var uid = __webpack_require__("ca5a");
          module2.exports = function(key) {
            return shared[key] || (shared[key] = uid(key));
          };
        }
      ),
      /***/
      "626a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var cof = __webpack_require__("2d95");
          module2.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
            return cof(it) == "String" ? it.split("") : Object(it);
          };
        }
      ),
      /***/
      "6521": (
        /***/
        function(module2, __webpack_exports__, __webpack_require__) {
          "use strict";
          var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_GridLayout_vue_vue_type_style_index_0_id_fc5948f6_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("92bf");
          var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_GridLayout_vue_vue_type_style_index_0_id_fc5948f6_lang_css__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_GridLayout_vue_vue_type_style_index_0_id_fc5948f6_lang_css__WEBPACK_IMPORTED_MODULE_0__);
        }
      ),
      /***/
      "6821": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var IObject = __webpack_require__("626a");
          var defined = __webpack_require__("be13");
          module2.exports = function(it) {
            return IObject(defined(it));
          };
        }
      ),
      /***/
      "69a8": (
        /***/
        function(module2, exports2) {
          var hasOwnProperty = {}.hasOwnProperty;
          module2.exports = function(it, key) {
            return hasOwnProperty.call(it, key);
          };
        }
      ),
      /***/
      "6a99": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("d3f4");
          module2.exports = function(it, S) {
            if (!isObject2(it))
              return it;
            var fn, val;
            if (S && typeof (fn = it.toString) == "function" && !isObject2(val = fn.call(it)))
              return val;
            if (typeof (fn = it.valueOf) == "function" && !isObject2(val = fn.call(it)))
              return val;
            if (!S && typeof (fn = it.toString) == "function" && !isObject2(val = fn.call(it)))
              return val;
            throw TypeError("Can't convert object to primitive value");
          };
        }
      ),
      /***/
      "7333": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var DESCRIPTORS = __webpack_require__("9e1e");
          var getKeys = __webpack_require__("0d58");
          var gOPS = __webpack_require__("2621");
          var pIE = __webpack_require__("52a7");
          var toObject = __webpack_require__("4bf8");
          var IObject = __webpack_require__("626a");
          var $assign = Object.assign;
          module2.exports = !$assign || __webpack_require__("79e5")(function() {
            var A = {};
            var B = {};
            var S = Symbol();
            var K = "abcdefghijklmnopqrst";
            A[S] = 7;
            K.split("").forEach(function(k) {
              B[k] = k;
            });
            return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join("") != K;
          }) ? function assign(target, source) {
            var T = toObject(target);
            var aLen = arguments.length;
            var index = 1;
            var getSymbols = gOPS.f;
            var isEnum = pIE.f;
            while (aLen > index) {
              var S = IObject(arguments[index++]);
              var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
              var length = keys.length;
              var j = 0;
              var key;
              while (length > j) {
                key = keys[j++];
                if (!DESCRIPTORS || isEnum.call(S, key))
                  T[key] = S[key];
              }
            }
            return T;
          } : $assign;
        }
      ),
      /***/
      "7726": (
        /***/
        function(module2, exports2) {
          var global = module2.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
          if (typeof __g == "number")
            __g = global;
        }
      ),
      /***/
      "77f1": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("4588");
          var max = Math.max;
          var min = Math.min;
          module2.exports = function(index, length) {
            index = toInteger(index);
            return index < 0 ? max(index + length, 0) : min(index, length);
          };
        }
      ),
      /***/
      "79e5": (
        /***/
        function(module2, exports2) {
          module2.exports = function(exec) {
            try {
              return !!exec();
            } catch (e) {
              return true;
            }
          };
        }
      ),
      /***/
      "7f20": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var def = __webpack_require__("86cc").f;
          var has = __webpack_require__("69a8");
          var TAG = __webpack_require__("2b4c")("toStringTag");
          module2.exports = function(it, tag, stat) {
            if (it && !has(it = stat ? it : it.prototype, TAG))
              def(it, TAG, { configurable: true, value: tag });
          };
        }
      ),
      /***/
      "8378": (
        /***/
        function(module2, exports2) {
          var core = module2.exports = { version: "2.6.12" };
          if (typeof __e == "number")
            __e = core;
        }
      ),
      /***/
      "848e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
          exports2 = ___CSS_LOADER_API_IMPORT___(false);
          exports2.push([module2.i, ".vue-grid-layout{position:relative;-webkit-transition:height .2s ease;transition:height .2s ease}", ""]);
          module2.exports = exports2;
        }
      ),
      /***/
      "84f2": (
        /***/
        function(module2, exports2) {
          module2.exports = {};
        }
      ),
      /***/
      "86cc": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var anObject = __webpack_require__("cb7c");
          var IE8_DOM_DEFINE = __webpack_require__("c69a");
          var toPrimitive = __webpack_require__("6a99");
          var dP = Object.defineProperty;
          exports2.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE)
              try {
                return dP(O, P, Attributes);
              } catch (e) {
              }
            if ("get" in Attributes || "set" in Attributes)
              throw TypeError("Accessors not supported!");
            if ("value" in Attributes)
              O[P] = Attributes.value;
            return O;
          };
        }
      ),
      /***/
      "8875": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
          (function(root, factory) {
            if (true) {
              !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports2, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            } else {
            }
          })(typeof self !== "undefined" ? self : this, function() {
            function getCurrentScript() {
              var descriptor = Object.getOwnPropertyDescriptor(document, "currentScript");
              if (!descriptor && "currentScript" in document && document.currentScript) {
                return document.currentScript;
              }
              if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
                return document.currentScript;
              }
              try {
                throw new Error();
              } catch (err) {
                var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig, ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig, stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack), scriptLocation = stackDetails && stackDetails[1] || false, line = stackDetails && stackDetails[2] || false, currentLocation = document.location.href.replace(document.location.hash, ""), pageSource, inlineScriptSourceRegExp, inlineScriptSource, scripts = document.getElementsByTagName("script");
                if (scriptLocation === currentLocation) {
                  pageSource = document.documentElement.outerHTML;
                  inlineScriptSourceRegExp = new RegExp("(?:[^\\n]+?\\n){0," + (line - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i");
                  inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, "$1").trim();
                }
                for (var i = 0; i < scripts.length; i++) {
                  if (scripts[i].readyState === "interactive") {
                    return scripts[i];
                  }
                  if (scripts[i].src === scriptLocation) {
                    return scripts[i];
                  }
                  if (scriptLocation === currentLocation && scripts[i].innerHTML && scripts[i].innerHTML.trim() === inlineScriptSource) {
                    return scripts[i];
                  }
                }
                return null;
              }
            }
            ;
            return getCurrentScript;
          });
        }
      ),
      /***/
      "8b97": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("d3f4");
          var anObject = __webpack_require__("cb7c");
          var check = function(O, proto) {
            anObject(O);
            if (!isObject2(proto) && proto !== null)
              throw TypeError(proto + ": can't set as prototype!");
          };
          module2.exports = {
            set: Object.setPrototypeOf || ("__proto__" in {} ? (
              // eslint-disable-line
              function(test, buggy, set) {
                try {
                  set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, "__proto__").set, 2);
                  set(test, []);
                  buggy = !(test instanceof Array);
                } catch (e) {
                  buggy = true;
                }
                return function setPrototypeOf(O, proto) {
                  check(O, proto);
                  if (buggy)
                    O.__proto__ = proto;
                  else
                    set(O, proto);
                  return O;
                };
              }({}, false)
            ) : void 0),
            check
          };
        }
      ),
      /***/
      "8bbf": (
        /***/
        function(module2, exports2) {
          module2.exports = require_vue();
        }
      ),
      /***/
      "8e6e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $export = __webpack_require__("5ca1");
          var ownKeys = __webpack_require__("990b");
          var toIObject = __webpack_require__("6821");
          var gOPD = __webpack_require__("11e9");
          var createProperty = __webpack_require__("f1ae");
          $export($export.S, "Object", {
            getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
              var O = toIObject(object);
              var getDesc = gOPD.f;
              var keys = ownKeys(O);
              var result = {};
              var i = 0;
              var key, desc;
              while (keys.length > i) {
                desc = getDesc(O, key = keys[i++]);
                if (desc !== void 0)
                  createProperty(result, key, desc);
              }
              return result;
            }
          });
        }
      ),
      /***/
      "9093": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $keys = __webpack_require__("ce10");
          var hiddenKeys = __webpack_require__("e11e").concat("length", "prototype");
          exports2.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
            return $keys(O, hiddenKeys);
          };
        }
      ),
      /***/
      "92bf": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var content = __webpack_require__("848e");
          if (typeof content === "string")
            content = [[module2.i, content, ""]];
          if (content.locals)
            module2.exports = content.locals;
          var add = __webpack_require__("499e").default;
          var update = add("ff1827d0", content, true, { "sourceMap": false, "shadowMode": false });
        }
      ),
      /***/
      "990b": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var gOPN = __webpack_require__("9093");
          var gOPS = __webpack_require__("2621");
          var anObject = __webpack_require__("cb7c");
          var Reflect = __webpack_require__("7726").Reflect;
          module2.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
            var keys = gOPN.f(anObject(it));
            var getSymbols = gOPS.f;
            return getSymbols ? keys.concat(getSymbols(it)) : keys;
          };
        }
      ),
      /***/
      "9b43": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var aFunction = __webpack_require__("d8e8");
          module2.exports = function(fn, that, length) {
            aFunction(fn);
            if (that === void 0)
              return fn;
            switch (length) {
              case 1:
                return function(a) {
                  return fn.call(that, a);
                };
              case 2:
                return function(a, b) {
                  return fn.call(that, a, b);
                };
              case 3:
                return function(a, b, c) {
                  return fn.call(that, a, b, c);
                };
            }
            return function() {
              return fn.apply(that, arguments);
            };
          };
        }
      ),
      /***/
      "9c6c": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var UNSCOPABLES = __webpack_require__("2b4c")("unscopables");
          var ArrayProto = Array.prototype;
          if (ArrayProto[UNSCOPABLES] == void 0)
            __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
          module2.exports = function(key) {
            ArrayProto[UNSCOPABLES][key] = true;
          };
        }
      ),
      /***/
      "9def": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("4588");
          var min = Math.min;
          module2.exports = function(it) {
            return it > 0 ? min(toInteger(it), 9007199254740991) : 0;
          };
        }
      ),
      /***/
      "9e1e": (
        /***/
        function(module2, exports2, __webpack_require__) {
          module2.exports = !__webpack_require__("79e5")(function() {
            return Object.defineProperty({}, "a", { get: function() {
              return 7;
            } }).a != 7;
          });
        }
      ),
      /***/
      "a481": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var anObject = __webpack_require__("cb7c");
          var toObject = __webpack_require__("4bf8");
          var toLength = __webpack_require__("9def");
          var toInteger = __webpack_require__("4588");
          var advanceStringIndex = __webpack_require__("0390");
          var regExpExec = __webpack_require__("5f1b");
          var max = Math.max;
          var min = Math.min;
          var floor = Math.floor;
          var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
          var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;
          var maybeToString = function(it) {
            return it === void 0 ? it : String(it);
          };
          __webpack_require__("214f")("replace", 2, function(defined, REPLACE, $replace, maybeCallNative) {
            return [
              // `String.prototype.replace` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.replace
              function replace(searchValue, replaceValue) {
                var O = defined(this);
                var fn = searchValue == void 0 ? void 0 : searchValue[REPLACE];
                return fn !== void 0 ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
              },
              // `RegExp.prototype[@@replace]` method
              // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
              function(regexp, replaceValue) {
                var res = maybeCallNative($replace, regexp, this, replaceValue);
                if (res.done)
                  return res.value;
                var rx = anObject(regexp);
                var S = String(this);
                var functionalReplace = typeof replaceValue === "function";
                if (!functionalReplace)
                  replaceValue = String(replaceValue);
                var global = rx.global;
                if (global) {
                  var fullUnicode = rx.unicode;
                  rx.lastIndex = 0;
                }
                var results = [];
                while (true) {
                  var result = regExpExec(rx, S);
                  if (result === null)
                    break;
                  results.push(result);
                  if (!global)
                    break;
                  var matchStr = String(result[0]);
                  if (matchStr === "")
                    rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                }
                var accumulatedResult = "";
                var nextSourcePosition = 0;
                for (var i = 0; i < results.length; i++) {
                  result = results[i];
                  var matched = String(result[0]);
                  var position = max(min(toInteger(result.index), S.length), 0);
                  var captures = [];
                  for (var j = 1; j < result.length; j++)
                    captures.push(maybeToString(result[j]));
                  var namedCaptures = result.groups;
                  if (functionalReplace) {
                    var replacerArgs = [matched].concat(captures, position, S);
                    if (namedCaptures !== void 0)
                      replacerArgs.push(namedCaptures);
                    var replacement = String(replaceValue.apply(void 0, replacerArgs));
                  } else {
                    replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
                  }
                  if (position >= nextSourcePosition) {
                    accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
                    nextSourcePosition = position + matched.length;
                  }
                }
                return accumulatedResult + S.slice(nextSourcePosition);
              }
            ];
            function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
              var tailPos = position + matched.length;
              var m = captures.length;
              var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
              if (namedCaptures !== void 0) {
                namedCaptures = toObject(namedCaptures);
                symbols = SUBSTITUTION_SYMBOLS;
              }
              return $replace.call(replacement, symbols, function(match, ch) {
                var capture;
                switch (ch.charAt(0)) {
                  case "$":
                    return "$";
                  case "&":
                    return matched;
                  case "`":
                    return str.slice(0, position);
                  case "'":
                    return str.slice(tailPos);
                  case "<":
                    capture = namedCaptures[ch.slice(1, -1)];
                    break;
                  default:
                    var n = +ch;
                    if (n === 0)
                      return match;
                    if (n > m) {
                      var f = floor(n / 10);
                      if (f === 0)
                        return match;
                      if (f <= m)
                        return captures[f - 1] === void 0 ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                      return match;
                    }
                    capture = captures[n - 1];
                }
                return capture === void 0 ? "" : capture;
              });
            }
          });
        }
      ),
      /***/
      "aa77": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $export = __webpack_require__("5ca1");
          var defined = __webpack_require__("be13");
          var fails = __webpack_require__("79e5");
          var spaces = __webpack_require__("fdef");
          var space = "[" + spaces + "]";
          var non = "​";
          var ltrim = RegExp("^" + space + space + "*");
          var rtrim = RegExp(space + space + "*$");
          var exporter = function(KEY, exec, ALIAS) {
            var exp = {};
            var FORCE = fails(function() {
              return !!spaces[KEY]() || non[KEY]() != non;
            });
            var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
            if (ALIAS)
              exp[ALIAS] = fn;
            $export($export.P + $export.F * FORCE, "String", exp);
          };
          var trim = exporter.trim = function(string, TYPE) {
            string = String(defined(string));
            if (TYPE & 1)
              string = string.replace(ltrim, "");
            if (TYPE & 2)
              string = string.replace(rtrim, "");
            return string;
          };
          module2.exports = exporter;
        }
      ),
      /***/
      "abb4": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          module2.exports = function(quiet) {
            function noop() {
            }
            var reporter = {
              log: noop,
              warn: noop,
              error: noop
            };
            if (!quiet && window.console) {
              var attachFunction = function(reporter2, name) {
                reporter2[name] = function reporterProxy() {
                  var f = console[name];
                  if (f.apply) {
                    f.apply(console, arguments);
                  } else {
                    for (var i = 0; i < arguments.length; i++) {
                      f(arguments[i]);
                    }
                  }
                };
              };
              attachFunction(reporter, "log");
              attachFunction(reporter, "warn");
              attachFunction(reporter, "error");
            }
            return reporter;
          };
        }
      ),
      /***/
      "ac6a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $iterators = __webpack_require__("cadf");
          var getKeys = __webpack_require__("0d58");
          var redefine = __webpack_require__("2aba");
          var global = __webpack_require__("7726");
          var hide = __webpack_require__("32e9");
          var Iterators = __webpack_require__("84f2");
          var wks = __webpack_require__("2b4c");
          var ITERATOR = wks("iterator");
          var TO_STRING_TAG = wks("toStringTag");
          var ArrayValues = Iterators.Array;
          var DOMIterables = {
            CSSRuleList: true,
            // TODO: Not spec compliant, should be false.
            CSSStyleDeclaration: false,
            CSSValueList: false,
            ClientRectList: false,
            DOMRectList: false,
            DOMStringList: false,
            DOMTokenList: true,
            DataTransferItemList: false,
            FileList: false,
            HTMLAllCollection: false,
            HTMLCollection: false,
            HTMLFormElement: false,
            HTMLSelectElement: false,
            MediaList: true,
            // TODO: Not spec compliant, should be false.
            MimeTypeArray: false,
            NamedNodeMap: false,
            NodeList: true,
            PaintRequestList: false,
            Plugin: false,
            PluginArray: false,
            SVGLengthList: false,
            SVGNumberList: false,
            SVGPathSegList: false,
            SVGPointList: false,
            SVGStringList: false,
            SVGTransformList: false,
            SourceBufferList: false,
            StyleSheetList: true,
            // TODO: Not spec compliant, should be false.
            TextTrackCueList: false,
            TextTrackList: false,
            TouchList: false
          };
          for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
            var NAME = collections[i];
            var explicit = DOMIterables[NAME];
            var Collection = global[NAME];
            var proto = Collection && Collection.prototype;
            var key;
            if (proto) {
              if (!proto[ITERATOR])
                hide(proto, ITERATOR, ArrayValues);
              if (!proto[TO_STRING_TAG])
                hide(proto, TO_STRING_TAG, NAME);
              Iterators[NAME] = ArrayValues;
              if (explicit) {
                for (key in $iterators)
                  if (!proto[key])
                    redefine(proto, key, $iterators[key], true);
              }
            }
          }
        }
      ),
      /***/
      "b0c5": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var regexpExec = __webpack_require__("520a");
          __webpack_require__("5ca1")({
            target: "RegExp",
            proto: true,
            forced: regexpExec !== /./.exec
          }, {
            exec: regexpExec
          });
        }
      ),
      /***/
      "b770": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var utils = module2.exports = {};
          utils.forEach = function(collection, callback) {
            for (var i = 0; i < collection.length; i++) {
              var result = callback(collection[i]);
              if (result) {
                return result;
              }
            }
          };
        }
      ),
      /***/
      "be13": (
        /***/
        function(module2, exports2) {
          module2.exports = function(it) {
            if (it == void 0)
              throw TypeError("Can't call method on  " + it);
            return it;
          };
        }
      ),
      /***/
      "c274": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var utils = __webpack_require__("50bf");
          module2.exports = function batchProcessorMaker(options) {
            options = options || {};
            var reporter = options.reporter;
            var asyncProcess = utils.getOption(options, "async", true);
            var autoProcess = utils.getOption(options, "auto", true);
            if (autoProcess && !asyncProcess) {
              reporter && reporter.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true.");
              asyncProcess = true;
            }
            var batch = Batch();
            var asyncFrameHandler;
            var isProcessing = false;
            function addFunction(level, fn) {
              if (!isProcessing && autoProcess && asyncProcess && batch.size() === 0) {
                processBatchAsync();
              }
              batch.add(level, fn);
            }
            function processBatch() {
              isProcessing = true;
              while (batch.size()) {
                var processingBatch = batch;
                batch = Batch();
                processingBatch.process();
              }
              isProcessing = false;
            }
            function forceProcessBatch(localAsyncProcess) {
              if (isProcessing) {
                return;
              }
              if (localAsyncProcess === void 0) {
                localAsyncProcess = asyncProcess;
              }
              if (asyncFrameHandler) {
                cancelFrame(asyncFrameHandler);
                asyncFrameHandler = null;
              }
              if (localAsyncProcess) {
                processBatchAsync();
              } else {
                processBatch();
              }
            }
            function processBatchAsync() {
              asyncFrameHandler = requestFrame(processBatch);
            }
            function clearBatch() {
              batch = {};
              batchSize = 0;
              topLevel = 0;
              bottomLevel = 0;
            }
            function cancelFrame(listener) {
              var cancel = clearTimeout;
              return cancel(listener);
            }
            function requestFrame(callback) {
              var raf = function(fn) {
                return setTimeout(fn, 0);
              };
              return raf(callback);
            }
            return {
              add: addFunction,
              force: forceProcessBatch
            };
          };
          function Batch() {
            var batch = {};
            var size = 0;
            var topLevel2 = 0;
            var bottomLevel2 = 0;
            function add(level, fn) {
              if (!fn) {
                fn = level;
                level = 0;
              }
              if (level > topLevel2) {
                topLevel2 = level;
              } else if (level < bottomLevel2) {
                bottomLevel2 = level;
              }
              if (!batch[level]) {
                batch[level] = [];
              }
              batch[level].push(fn);
              size++;
            }
            function process2() {
              for (var level = bottomLevel2; level <= topLevel2; level++) {
                var fns = batch[level];
                for (var i = 0; i < fns.length; i++) {
                  var fn = fns[i];
                  fn();
                }
              }
            }
            function getSize() {
              return size;
            }
            return {
              add,
              process: process2,
              size: getSize
            };
          }
        }
      ),
      /***/
      "c366": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var toIObject = __webpack_require__("6821");
          var toLength = __webpack_require__("9def");
          var toAbsoluteIndex = __webpack_require__("77f1");
          module2.exports = function(IS_INCLUDES) {
            return function($this, el, fromIndex) {
              var O = toIObject($this);
              var length = toLength(O.length);
              var index = toAbsoluteIndex(fromIndex, length);
              var value;
              if (IS_INCLUDES && el != el)
                while (length > index) {
                  value = O[index++];
                  if (value != value)
                    return true;
                }
              else
                for (; length > index; index++)
                  if (IS_INCLUDES || index in O) {
                    if (O[index] === el)
                      return IS_INCLUDES || index || 0;
                  }
              return !IS_INCLUDES && -1;
            };
          };
        }
      ),
      /***/
      "c541": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var content = __webpack_require__("493e");
          if (typeof content === "string")
            content = [[module2.i, content, ""]];
          if (content.locals)
            module2.exports = content.locals;
          var add = __webpack_require__("499e").default;
          var update = add("40158674", content, true, { "sourceMap": false, "shadowMode": false });
        }
      ),
      /***/
      "c5f6": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var global = __webpack_require__("7726");
          var has = __webpack_require__("69a8");
          var cof = __webpack_require__("2d95");
          var inheritIfRequired = __webpack_require__("5dbc");
          var toPrimitive = __webpack_require__("6a99");
          var fails = __webpack_require__("79e5");
          var gOPN = __webpack_require__("9093").f;
          var gOPD = __webpack_require__("11e9").f;
          var dP = __webpack_require__("86cc").f;
          var $trim = __webpack_require__("aa77").trim;
          var NUMBER = "Number";
          var $Number = global[NUMBER];
          var Base = $Number;
          var proto = $Number.prototype;
          var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
          var TRIM = "trim" in String.prototype;
          var toNumber = function(argument) {
            var it = toPrimitive(argument, false);
            if (typeof it == "string" && it.length > 2) {
              it = TRIM ? it.trim() : $trim(it, 3);
              var first = it.charCodeAt(0);
              var third, radix, maxCode;
              if (first === 43 || first === 45) {
                third = it.charCodeAt(2);
                if (third === 88 || third === 120)
                  return NaN;
              } else if (first === 48) {
                switch (it.charCodeAt(1)) {
                  case 66:
                  case 98:
                    radix = 2;
                    maxCode = 49;
                    break;
                  case 79:
                  case 111:
                    radix = 8;
                    maxCode = 55;
                    break;
                  default:
                    return +it;
                }
                for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
                  code = digits.charCodeAt(i);
                  if (code < 48 || code > maxCode)
                    return NaN;
                }
                return parseInt(digits, radix);
              }
            }
            return +it;
          };
          if (!$Number(" 0o1") || !$Number("0b1") || $Number("+0x1")) {
            $Number = function Number2(value) {
              var it = arguments.length < 1 ? 0 : value;
              var that = this;
              return that instanceof $Number && (BROKEN_COF ? fails(function() {
                proto.valueOf.call(that);
              }) : cof(that) != NUMBER) ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
            };
            for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
              // ES3:
              "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(",")
            ), j = 0, key; keys.length > j; j++) {
              if (has(Base, key = keys[j]) && !has($Number, key)) {
                dP($Number, key, gOPD(Base, key));
              }
            }
            $Number.prototype = proto;
            proto.constructor = $Number;
            __webpack_require__("2aba")(global, NUMBER, $Number);
          }
        }
      ),
      /***/
      "c69a": (
        /***/
        function(module2, exports2, __webpack_require__) {
          module2.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function() {
            return Object.defineProperty(__webpack_require__("230e")("div"), "a", { get: function() {
              return 7;
            } }).a != 7;
          });
        }
      ),
      /***/
      "c946": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var forEach = __webpack_require__("b770").forEach;
          module2.exports = function(options) {
            options = options || {};
            var reporter = options.reporter;
            var batchProcessor = options.batchProcessor;
            var getState = options.stateHandler.getState;
            var hasState = options.stateHandler.hasState;
            var idHandler = options.idHandler;
            if (!batchProcessor) {
              throw new Error("Missing required dependency: batchProcessor");
            }
            if (!reporter) {
              throw new Error("Missing required dependency: reporter.");
            }
            var scrollbarSizes = getScrollbarSizes();
            var styleId = "erd_scroll_detection_scrollbar_style";
            var detectionContainerClass = "erd_scroll_detection_container";
            function initDocument(targetDocument) {
              injectScrollStyle(targetDocument, styleId, detectionContainerClass);
            }
            initDocument(window.document);
            function buildCssTextString(rules) {
              var seperator = options.important ? " !important; " : "; ";
              return (rules.join(seperator) + seperator).trim();
            }
            function getScrollbarSizes() {
              var width = 500;
              var height = 500;
              var child = document.createElement("div");
              child.style.cssText = buildCssTextString(["position: absolute", "width: " + width * 2 + "px", "height: " + height * 2 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);
              var container = document.createElement("div");
              container.style.cssText = buildCssTextString(["position: absolute", "width: " + width + "px", "height: " + height + "px", "overflow: scroll", "visibility: none", "top: " + -width * 3 + "px", "left: " + -height * 3 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);
              container.appendChild(child);
              document.body.insertBefore(container, document.body.firstChild);
              var widthSize = width - container.clientWidth;
              var heightSize = height - container.clientHeight;
              document.body.removeChild(container);
              return {
                width: widthSize,
                height: heightSize
              };
            }
            function injectScrollStyle(targetDocument, styleId2, containerClass) {
              function injectStyle(style2, method) {
                method = method || function(element) {
                  targetDocument.head.appendChild(element);
                };
                var styleElement = targetDocument.createElement("style");
                styleElement.innerHTML = style2;
                styleElement.id = styleId2;
                method(styleElement);
                return styleElement;
              }
              if (!targetDocument.getElementById(styleId2)) {
                var containerAnimationClass = containerClass + "_animation";
                var containerAnimationActiveClass = containerClass + "_animation_active";
                var style = "/* Created by the element-resize-detector library. */\n";
                style += "." + containerClass + " > div::-webkit-scrollbar { " + buildCssTextString(["display: none"]) + " }\n\n";
                style += "." + containerAnimationActiveClass + " { " + buildCssTextString(["-webkit-animation-duration: 0.1s", "animation-duration: 0.1s", "-webkit-animation-name: " + containerAnimationClass, "animation-name: " + containerAnimationClass]) + " }\n";
                style += "@-webkit-keyframes " + containerAnimationClass + " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n";
                style += "@keyframes " + containerAnimationClass + " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }";
                injectStyle(style);
              }
            }
            function addAnimationClass(element) {
              element.className += " " + detectionContainerClass + "_animation_active";
            }
            function addEvent(el, name, cb) {
              if (el.addEventListener) {
                el.addEventListener(name, cb);
              } else if (el.attachEvent) {
                el.attachEvent("on" + name, cb);
              } else {
                return reporter.error("[scroll] Don't know how to add event listeners.");
              }
            }
            function removeEvent(el, name, cb) {
              if (el.removeEventListener) {
                el.removeEventListener(name, cb);
              } else if (el.detachEvent) {
                el.detachEvent("on" + name, cb);
              } else {
                return reporter.error("[scroll] Don't know how to remove event listeners.");
              }
            }
            function getExpandElement(element) {
              return getState(element).container.childNodes[0].childNodes[0].childNodes[0];
            }
            function getShrinkElement(element) {
              return getState(element).container.childNodes[0].childNodes[0].childNodes[1];
            }
            function addListener(element, listener) {
              var listeners = getState(element).listeners;
              if (!listeners.push) {
                throw new Error("Cannot add listener to an element that is not detectable.");
              }
              getState(element).listeners.push(listener);
            }
            function makeDetectable(options2, element, callback) {
              if (!callback) {
                callback = element;
                element = options2;
                options2 = null;
              }
              options2 = options2 || {};
              function debug() {
                if (options2.debug) {
                  var args = Array.prototype.slice.call(arguments);
                  args.unshift(idHandler.get(element), "Scroll: ");
                  if (reporter.log.apply) {
                    reporter.log.apply(null, args);
                  } else {
                    for (var i = 0; i < args.length; i++) {
                      reporter.log(args[i]);
                    }
                  }
                }
              }
              function isDetached(element2) {
                function isInDocument(element3) {
                  return element3 === element3.ownerDocument.body || element3.ownerDocument.body.contains(element3);
                }
                if (!isInDocument(element2)) {
                  return true;
                }
                if (window.getComputedStyle(element2) === null) {
                  return true;
                }
                return false;
              }
              function isUnrendered(element2) {
                var container = getState(element2).container.childNodes[0];
                var style = window.getComputedStyle(container);
                return !style.width || style.width.indexOf("px") === -1;
              }
              function getStyle() {
                var elementStyle = window.getComputedStyle(element);
                var style = {};
                style.position = elementStyle.position;
                style.width = element.offsetWidth;
                style.height = element.offsetHeight;
                style.top = elementStyle.top;
                style.right = elementStyle.right;
                style.bottom = elementStyle.bottom;
                style.left = elementStyle.left;
                style.widthCSS = elementStyle.width;
                style.heightCSS = elementStyle.height;
                return style;
              }
              function storeStartSize() {
                var style = getStyle();
                getState(element).startSize = {
                  width: style.width,
                  height: style.height
                };
                debug("Element start size", getState(element).startSize);
              }
              function initListeners() {
                getState(element).listeners = [];
              }
              function storeStyle() {
                debug("storeStyle invoked.");
                if (!getState(element)) {
                  debug("Aborting because element has been uninstalled");
                  return;
                }
                var style = getStyle();
                getState(element).style = style;
              }
              function storeCurrentSize(element2, width, height) {
                getState(element2).lastWidth = width;
                getState(element2).lastHeight = height;
              }
              function getExpandChildElement(element2) {
                return getExpandElement(element2).childNodes[0];
              }
              function getWidthOffset() {
                return 2 * scrollbarSizes.width + 1;
              }
              function getHeightOffset() {
                return 2 * scrollbarSizes.height + 1;
              }
              function getExpandWidth(width) {
                return width + 10 + getWidthOffset();
              }
              function getExpandHeight(height) {
                return height + 10 + getHeightOffset();
              }
              function getShrinkWidth(width) {
                return width * 2 + getWidthOffset();
              }
              function getShrinkHeight(height) {
                return height * 2 + getHeightOffset();
              }
              function positionScrollbars(element2, width, height) {
                var expand = getExpandElement(element2);
                var shrink = getShrinkElement(element2);
                var expandWidth = getExpandWidth(width);
                var expandHeight = getExpandHeight(height);
                var shrinkWidth = getShrinkWidth(width);
                var shrinkHeight = getShrinkHeight(height);
                expand.scrollLeft = expandWidth;
                expand.scrollTop = expandHeight;
                shrink.scrollLeft = shrinkWidth;
                shrink.scrollTop = shrinkHeight;
              }
              function injectContainerElement() {
                var container = getState(element).container;
                if (!container) {
                  container = document.createElement("div");
                  container.className = detectionContainerClass;
                  container.style.cssText = buildCssTextString(["visibility: hidden", "display: inline", "width: 0px", "height: 0px", "z-index: -1", "overflow: hidden", "margin: 0", "padding: 0"]);
                  getState(element).container = container;
                  addAnimationClass(container);
                  element.appendChild(container);
                  var onAnimationStart = function() {
                    getState(element).onRendered && getState(element).onRendered();
                  };
                  addEvent(container, "animationstart", onAnimationStart);
                  getState(element).onAnimationStart = onAnimationStart;
                }
                return container;
              }
              function injectScrollElements() {
                function alterPositionStyles() {
                  var style = getState(element).style;
                  if (style.position === "static") {
                    element.style.setProperty("position", "relative", options2.important ? "important" : "");
                    var removeRelativeStyles = function(reporter2, element2, style2, property) {
                      function getNumericalValue(value2) {
                        return value2.replace(/[^-\d\.]/g, "");
                      }
                      var value = style2[property];
                      if (value !== "auto" && getNumericalValue(value) !== "0") {
                        reporter2.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element2);
                        element2.style[property] = 0;
                      }
                    };
                    removeRelativeStyles(reporter, element, style, "top");
                    removeRelativeStyles(reporter, element, style, "right");
                    removeRelativeStyles(reporter, element, style, "bottom");
                    removeRelativeStyles(reporter, element, style, "left");
                  }
                }
                function getLeftTopBottomRightCssText(left, top, bottom, right) {
                  left = !left ? "0" : left + "px";
                  top = !top ? "0" : top + "px";
                  bottom = !bottom ? "0" : bottom + "px";
                  right = !right ? "0" : right + "px";
                  return ["left: " + left, "top: " + top, "right: " + right, "bottom: " + bottom];
                }
                debug("Injecting elements");
                if (!getState(element)) {
                  debug("Aborting because element has been uninstalled");
                  return;
                }
                alterPositionStyles();
                var rootContainer = getState(element).container;
                if (!rootContainer) {
                  rootContainer = injectContainerElement();
                }
                var scrollbarWidth = scrollbarSizes.width;
                var scrollbarHeight = scrollbarSizes.height;
                var containerContainerStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%", "left: 0px", "top: 0px"]);
                var containerStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden"].concat(getLeftTopBottomRightCssText(-(1 + scrollbarWidth), -(1 + scrollbarHeight), -scrollbarHeight, -scrollbarWidth)));
                var expandStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
                var shrinkStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
                var expandChildStyle = buildCssTextString(["position: absolute", "left: 0", "top: 0"]);
                var shrinkChildStyle = buildCssTextString(["position: absolute", "width: 200%", "height: 200%"]);
                var containerContainer = document.createElement("div");
                var container = document.createElement("div");
                var expand = document.createElement("div");
                var expandChild = document.createElement("div");
                var shrink = document.createElement("div");
                var shrinkChild = document.createElement("div");
                containerContainer.dir = "ltr";
                containerContainer.style.cssText = containerContainerStyle;
                containerContainer.className = detectionContainerClass;
                container.className = detectionContainerClass;
                container.style.cssText = containerStyle;
                expand.style.cssText = expandStyle;
                expandChild.style.cssText = expandChildStyle;
                shrink.style.cssText = shrinkStyle;
                shrinkChild.style.cssText = shrinkChildStyle;
                expand.appendChild(expandChild);
                shrink.appendChild(shrinkChild);
                container.appendChild(expand);
                container.appendChild(shrink);
                containerContainer.appendChild(container);
                rootContainer.appendChild(containerContainer);
                function onExpandScroll() {
                  getState(element).onExpand && getState(element).onExpand();
                }
                function onShrinkScroll() {
                  getState(element).onShrink && getState(element).onShrink();
                }
                addEvent(expand, "scroll", onExpandScroll);
                addEvent(shrink, "scroll", onShrinkScroll);
                getState(element).onExpandScroll = onExpandScroll;
                getState(element).onShrinkScroll = onShrinkScroll;
              }
              function registerListenersAndPositionElements() {
                function updateChildSizes(element2, width, height) {
                  var expandChild = getExpandChildElement(element2);
                  var expandWidth = getExpandWidth(width);
                  var expandHeight = getExpandHeight(height);
                  expandChild.style.setProperty("width", expandWidth + "px", options2.important ? "important" : "");
                  expandChild.style.setProperty("height", expandHeight + "px", options2.important ? "important" : "");
                }
                function updateDetectorElements(done) {
                  var width = element.offsetWidth;
                  var height = element.offsetHeight;
                  var sizeChanged = width !== getState(element).lastWidth || height !== getState(element).lastHeight;
                  debug("Storing current size", width, height);
                  storeCurrentSize(element, width, height);
                  batchProcessor.add(0, function performUpdateChildSizes() {
                    if (!sizeChanged) {
                      return;
                    }
                    if (!getState(element)) {
                      debug("Aborting because element has been uninstalled");
                      return;
                    }
                    if (!areElementsInjected()) {
                      debug("Aborting because element container has not been initialized");
                      return;
                    }
                    if (options2.debug) {
                      var w = element.offsetWidth;
                      var h = element.offsetHeight;
                      if (w !== width || h !== height) {
                        reporter.warn(idHandler.get(element), "Scroll: Size changed before updating detector elements.");
                      }
                    }
                    updateChildSizes(element, width, height);
                  });
                  batchProcessor.add(1, function updateScrollbars() {
                    if (!getState(element)) {
                      debug("Aborting because element has been uninstalled");
                      return;
                    }
                    if (!areElementsInjected()) {
                      debug("Aborting because element container has not been initialized");
                      return;
                    }
                    positionScrollbars(element, width, height);
                  });
                  if (sizeChanged && done) {
                    batchProcessor.add(2, function() {
                      if (!getState(element)) {
                        debug("Aborting because element has been uninstalled");
                        return;
                      }
                      if (!areElementsInjected()) {
                        debug("Aborting because element container has not been initialized");
                        return;
                      }
                      done();
                    });
                  }
                }
                function areElementsInjected() {
                  return !!getState(element).container;
                }
                function notifyListenersIfNeeded() {
                  function isFirstNotify() {
                    return getState(element).lastNotifiedWidth === void 0;
                  }
                  debug("notifyListenersIfNeeded invoked");
                  var state = getState(element);
                  if (isFirstNotify() && state.lastWidth === state.startSize.width && state.lastHeight === state.startSize.height) {
                    return debug("Not notifying: Size is the same as the start size, and there has been no notification yet.");
                  }
                  if (state.lastWidth === state.lastNotifiedWidth && state.lastHeight === state.lastNotifiedHeight) {
                    return debug("Not notifying: Size already notified");
                  }
                  debug("Current size not notified, notifying...");
                  state.lastNotifiedWidth = state.lastWidth;
                  state.lastNotifiedHeight = state.lastHeight;
                  forEach(getState(element).listeners, function(listener) {
                    listener(element);
                  });
                }
                function handleRender() {
                  debug("startanimation triggered.");
                  if (isUnrendered(element)) {
                    debug("Ignoring since element is still unrendered...");
                    return;
                  }
                  debug("Element rendered.");
                  var expand = getExpandElement(element);
                  var shrink = getShrinkElement(element);
                  if (expand.scrollLeft === 0 || expand.scrollTop === 0 || shrink.scrollLeft === 0 || shrink.scrollTop === 0) {
                    debug("Scrollbars out of sync. Updating detector elements...");
                    updateDetectorElements(notifyListenersIfNeeded);
                  }
                }
                function handleScroll() {
                  debug("Scroll detected.");
                  if (isUnrendered(element)) {
                    debug("Scroll event fired while unrendered. Ignoring...");
                    return;
                  }
                  updateDetectorElements(notifyListenersIfNeeded);
                }
                debug("registerListenersAndPositionElements invoked.");
                if (!getState(element)) {
                  debug("Aborting because element has been uninstalled");
                  return;
                }
                getState(element).onRendered = handleRender;
                getState(element).onExpand = handleScroll;
                getState(element).onShrink = handleScroll;
                var style = getState(element).style;
                updateChildSizes(element, style.width, style.height);
              }
              function finalizeDomMutation() {
                debug("finalizeDomMutation invoked.");
                if (!getState(element)) {
                  debug("Aborting because element has been uninstalled");
                  return;
                }
                var style = getState(element).style;
                storeCurrentSize(element, style.width, style.height);
                positionScrollbars(element, style.width, style.height);
              }
              function ready() {
                callback(element);
              }
              function install() {
                debug("Installing...");
                initListeners();
                storeStartSize();
                batchProcessor.add(0, storeStyle);
                batchProcessor.add(1, injectScrollElements);
                batchProcessor.add(2, registerListenersAndPositionElements);
                batchProcessor.add(3, finalizeDomMutation);
                batchProcessor.add(4, ready);
              }
              debug("Making detectable...");
              if (isDetached(element)) {
                debug("Element is detached");
                injectContainerElement();
                debug("Waiting until element is attached...");
                getState(element).onRendered = function() {
                  debug("Element is now attached");
                  install();
                };
              } else {
                install();
              }
            }
            function uninstall(element) {
              var state = getState(element);
              if (!state) {
                return;
              }
              state.onExpandScroll && removeEvent(getExpandElement(element), "scroll", state.onExpandScroll);
              state.onShrinkScroll && removeEvent(getShrinkElement(element), "scroll", state.onShrinkScroll);
              state.onAnimationStart && removeEvent(state.container, "animationstart", state.onAnimationStart);
              state.container && element.removeChild(state.container);
            }
            return {
              makeDetectable,
              addListener,
              uninstall,
              initDocument
            };
          };
        }
      ),
      /***/
      "ca5a": (
        /***/
        function(module2, exports2) {
          var id = 0;
          var px = Math.random();
          module2.exports = function(key) {
            return "Symbol(".concat(key === void 0 ? "" : key, ")_", (++id + px).toString(36));
          };
        }
      ),
      /***/
      "cadf": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var addToUnscopables = __webpack_require__("9c6c");
          var step = __webpack_require__("d53b");
          var Iterators = __webpack_require__("84f2");
          var toIObject = __webpack_require__("6821");
          module2.exports = __webpack_require__("01f9")(Array, "Array", function(iterated, kind) {
            this._t = toIObject(iterated);
            this._i = 0;
            this._k = kind;
          }, function() {
            var O = this._t;
            var kind = this._k;
            var index = this._i++;
            if (!O || index >= O.length) {
              this._t = void 0;
              return step(1);
            }
            if (kind == "keys")
              return step(0, index);
            if (kind == "values")
              return step(0, O[index]);
            return step(0, [index, O[index]]);
          }, "values");
          Iterators.Arguments = Iterators.Array;
          addToUnscopables("keys");
          addToUnscopables("values");
          addToUnscopables("entries");
        }
      ),
      /***/
      "cb7c": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var isObject2 = __webpack_require__("d3f4");
          module2.exports = function(it) {
            if (!isObject2(it))
              throw TypeError(it + " is not an object!");
            return it;
          };
        }
      ),
      /***/
      "ce10": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var has = __webpack_require__("69a8");
          var toIObject = __webpack_require__("6821");
          var arrayIndexOf = __webpack_require__("c366")(false);
          var IE_PROTO = __webpack_require__("613b")("IE_PROTO");
          module2.exports = function(object, names) {
            var O = toIObject(object);
            var i = 0;
            var result = [];
            var key;
            for (key in O)
              if (key != IE_PROTO)
                has(O, key) && result.push(key);
            while (names.length > i)
              if (has(O, key = names[i++])) {
                ~arrayIndexOf(result, key) || result.push(key);
              }
            return result;
          };
        }
      ),
      /***/
      "d3f4": (
        /***/
        function(module2, exports2) {
          module2.exports = function(it) {
            return typeof it === "object" ? it !== null : typeof it === "function";
          };
        }
      ),
      /***/
      "d53b": (
        /***/
        function(module2, exports2) {
          module2.exports = function(done, value) {
            return { value, done: !!done };
          };
        }
      ),
      /***/
      "d6eb": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var prop = "_erd";
          function initState(element) {
            element[prop] = {};
            return getState(element);
          }
          function getState(element) {
            return element[prop];
          }
          function cleanState(element) {
            delete element[prop];
          }
          module2.exports = {
            initState,
            getState,
            cleanState
          };
        }
      ),
      /***/
      "d8e8": (
        /***/
        function(module2, exports2) {
          module2.exports = function(it) {
            if (typeof it != "function")
              throw TypeError(it + " is not a function!");
            return it;
          };
        }
      ),
      /***/
      "e11e": (
        /***/
        function(module2, exports2) {
          module2.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
        }
      ),
      /***/
      "eec4": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var forEach = __webpack_require__("b770").forEach;
          var elementUtilsMaker = __webpack_require__("5be5");
          var listenerHandlerMaker = __webpack_require__("49ad");
          var idGeneratorMaker = __webpack_require__("2cef");
          var idHandlerMaker = __webpack_require__("5058");
          var reporterMaker = __webpack_require__("abb4");
          var browserDetector = __webpack_require__("18e9");
          var batchProcessorMaker = __webpack_require__("c274");
          var stateHandler = __webpack_require__("d6eb");
          var objectStrategyMaker = __webpack_require__("18d2");
          var scrollStrategyMaker = __webpack_require__("c946");
          function isCollection(obj) {
            return Array.isArray(obj) || obj.length !== void 0;
          }
          function toArray(collection) {
            if (!Array.isArray(collection)) {
              var array = [];
              forEach(collection, function(obj) {
                array.push(obj);
              });
              return array;
            } else {
              return collection;
            }
          }
          function isElement(obj) {
            return obj && obj.nodeType === 1;
          }
          module2.exports = function(options) {
            options = options || {};
            var idHandler;
            if (options.idHandler) {
              idHandler = {
                get: function(element) {
                  return options.idHandler.get(element, true);
                },
                set: options.idHandler.set
              };
            } else {
              var idGenerator = idGeneratorMaker();
              var defaultIdHandler = idHandlerMaker({
                idGenerator,
                stateHandler
              });
              idHandler = defaultIdHandler;
            }
            var reporter = options.reporter;
            if (!reporter) {
              var quiet = reporter === false;
              reporter = reporterMaker(quiet);
            }
            var batchProcessor = getOption(options, "batchProcessor", batchProcessorMaker({ reporter }));
            var globalOptions = {};
            globalOptions.callOnAdd = !!getOption(options, "callOnAdd", true);
            globalOptions.debug = !!getOption(options, "debug", false);
            var eventListenerHandler = listenerHandlerMaker(idHandler);
            var elementUtils = elementUtilsMaker({
              stateHandler
            });
            var detectionStrategy;
            var desiredStrategy = getOption(options, "strategy", "object");
            var importantCssRules = getOption(options, "important", false);
            var strategyOptions = {
              reporter,
              batchProcessor,
              stateHandler,
              idHandler,
              important: importantCssRules
            };
            if (desiredStrategy === "scroll") {
              if (browserDetector.isLegacyOpera()) {
                reporter.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy.");
                desiredStrategy = "object";
              } else if (browserDetector.isIE(9)) {
                reporter.warn("Scroll strategy is not supported on IE9. Changing to object strategy.");
                desiredStrategy = "object";
              }
            }
            if (desiredStrategy === "scroll") {
              detectionStrategy = scrollStrategyMaker(strategyOptions);
            } else if (desiredStrategy === "object") {
              detectionStrategy = objectStrategyMaker(strategyOptions);
            } else {
              throw new Error("Invalid strategy name: " + desiredStrategy);
            }
            var onReadyCallbacks = {};
            function listenTo(options2, elements, listener) {
              function onResizeCallback(element) {
                var listeners = eventListenerHandler.get(element);
                forEach(listeners, function callListenerProxy(listener2) {
                  listener2(element);
                });
              }
              function addListener(callOnAdd2, element, listener2) {
                eventListenerHandler.add(element, listener2);
                if (callOnAdd2) {
                  listener2(element);
                }
              }
              if (!listener) {
                listener = elements;
                elements = options2;
                options2 = {};
              }
              if (!elements) {
                throw new Error("At least one element required.");
              }
              if (!listener) {
                throw new Error("Listener required.");
              }
              if (isElement(elements)) {
                elements = [elements];
              } else if (isCollection(elements)) {
                elements = toArray(elements);
              } else {
                return reporter.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
              }
              var elementsReady = 0;
              var callOnAdd = getOption(options2, "callOnAdd", globalOptions.callOnAdd);
              var onReadyCallback = getOption(options2, "onReady", function noop() {
              });
              var debug = getOption(options2, "debug", globalOptions.debug);
              forEach(elements, function attachListenerToElement(element) {
                if (!stateHandler.getState(element)) {
                  stateHandler.initState(element);
                  idHandler.set(element);
                }
                var id = idHandler.get(element);
                debug && reporter.log("Attaching listener to element", id, element);
                if (!elementUtils.isDetectable(element)) {
                  debug && reporter.log(id, "Not detectable.");
                  if (elementUtils.isBusy(element)) {
                    debug && reporter.log(id, "System busy making it detectable");
                    addListener(callOnAdd, element, listener);
                    onReadyCallbacks[id] = onReadyCallbacks[id] || [];
                    onReadyCallbacks[id].push(function onReady() {
                      elementsReady++;
                      if (elementsReady === elements.length) {
                        onReadyCallback();
                      }
                    });
                    return;
                  }
                  debug && reporter.log(id, "Making detectable...");
                  elementUtils.markBusy(element, true);
                  return detectionStrategy.makeDetectable({ debug, important: importantCssRules }, element, function onElementDetectable(element2) {
                    debug && reporter.log(id, "onElementDetectable");
                    if (stateHandler.getState(element2)) {
                      elementUtils.markAsDetectable(element2);
                      elementUtils.markBusy(element2, false);
                      detectionStrategy.addListener(element2, onResizeCallback);
                      addListener(callOnAdd, element2, listener);
                      var state = stateHandler.getState(element2);
                      if (state && state.startSize) {
                        var width = element2.offsetWidth;
                        var height = element2.offsetHeight;
                        if (state.startSize.width !== width || state.startSize.height !== height) {
                          onResizeCallback(element2);
                        }
                      }
                      if (onReadyCallbacks[id]) {
                        forEach(onReadyCallbacks[id], function(callback) {
                          callback();
                        });
                      }
                    } else {
                      debug && reporter.log(id, "Element uninstalled before being detectable.");
                    }
                    delete onReadyCallbacks[id];
                    elementsReady++;
                    if (elementsReady === elements.length) {
                      onReadyCallback();
                    }
                  });
                }
                debug && reporter.log(id, "Already detecable, adding listener.");
                addListener(callOnAdd, element, listener);
                elementsReady++;
              });
              if (elementsReady === elements.length) {
                onReadyCallback();
              }
            }
            function uninstall(elements) {
              if (!elements) {
                return reporter.error("At least one element is required.");
              }
              if (isElement(elements)) {
                elements = [elements];
              } else if (isCollection(elements)) {
                elements = toArray(elements);
              } else {
                return reporter.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
              }
              forEach(elements, function(element) {
                eventListenerHandler.removeAllListeners(element);
                detectionStrategy.uninstall(element);
                stateHandler.cleanState(element);
              });
            }
            function initDocument(targetDocument) {
              detectionStrategy.initDocument && detectionStrategy.initDocument(targetDocument);
            }
            return {
              listenTo,
              removeListener: eventListenerHandler.removeListener,
              removeAllListeners: eventListenerHandler.removeAllListeners,
              uninstall,
              initDocument
            };
          };
          function getOption(options, name, defaultValue) {
            var value = options[name];
            if ((value === void 0 || value === null) && defaultValue !== void 0) {
              return defaultValue;
            }
            return value;
          }
        }
      ),
      /***/
      "f1ae": (
        /***/
        function(module2, exports2, __webpack_require__) {
          "use strict";
          var $defineProperty = __webpack_require__("86cc");
          var createDesc = __webpack_require__("4630");
          module2.exports = function(object, index, value) {
            if (index in object)
              $defineProperty.f(object, index, createDesc(0, value));
            else
              object[index] = value;
          };
        }
      ),
      /***/
      "f751": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $export = __webpack_require__("5ca1");
          $export($export.S + $export.F, "Object", { assign: __webpack_require__("7333") });
        }
      ),
      /***/
      "fa5b": (
        /***/
        function(module2, exports2, __webpack_require__) {
          module2.exports = __webpack_require__("5537")("native-function-to-string", Function.toString);
        }
      ),
      /***/
      "fab2": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var document2 = __webpack_require__("7726").document;
          module2.exports = document2 && document2.documentElement;
        }
      ),
      /***/
      "fb15": (
        /***/
        function(module2, __webpack_exports__, __webpack_require__) {
          "use strict";
          __webpack_require__.r(__webpack_exports__);
          __webpack_require__.d(__webpack_exports__, "GridLayout", function() {
            return (
              /* reexport */
              GridLayout
            );
          });
          __webpack_require__.d(__webpack_exports__, "GridItem", function() {
            return (
              /* reexport */
              GridItem
            );
          });
          var all_namespaceObject = {};
          __webpack_require__.r(all_namespaceObject);
          __webpack_require__.d(all_namespaceObject, "edgeTarget", function() {
            return edgeTarget;
          });
          __webpack_require__.d(all_namespaceObject, "elements", function() {
            return snappers_elements;
          });
          __webpack_require__.d(all_namespaceObject, "grid", function() {
            return grid;
          });
          if (typeof window !== "undefined") {
            var currentScript = window.document.currentScript;
            if (true) {
              var getCurrentScript = __webpack_require__("8875");
              currentScript = getCurrentScript();
              if (!("currentScript" in document)) {
                Object.defineProperty(document, "currentScript", { get: getCurrentScript });
              }
            }
            var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
            if (src) {
              __webpack_require__.p = src[1];
            }
          }
          var setPublicPath = null;
          var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
          function render(_ctx, _cache, $props, $setup, $data, $options) {
            return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("div", {
              ref: "item",
              class: ["vue-grid-item", $options.classObj],
              style: _ctx.style
            }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "default"), $options.resizableAndNotStatic ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("span", {
              key: 0,
              ref: "handle",
              class: $options.resizableHandleClass
            }, null, 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 6);
          }
          var es6_regexp_replace = __webpack_require__("a481");
          var es6_regexp_match = __webpack_require__("4917");
          var es6_number_constructor = __webpack_require__("c5f6");
          var es6_array_iterator = __webpack_require__("cadf");
          var es6_object_keys = __webpack_require__("456d");
          var web_dom_iterable = __webpack_require__("ac6a");
          var es6_array_sort = __webpack_require__("55dd");
          function bottom(layout) {
            var max = 0, bottomY;
            for (var i = 0, len = layout.length; i < len; i++) {
              bottomY = layout[i].y + layout[i].h;
              if (bottomY > max)
                max = bottomY;
            }
            return max;
          }
          function cloneLayout(layout) {
            var newLayout = Array(layout.length);
            for (var i = 0, len = layout.length; i < len; i++) {
              newLayout[i] = cloneLayoutItem(layout[i]);
            }
            return newLayout;
          }
          function cloneLayoutItem(layoutItem) {
            return JSON.parse(JSON.stringify(layoutItem));
          }
          function collides(l1, l2) {
            if (l1 === l2)
              return false;
            if (l1.x + l1.w <= l2.x)
              return false;
            if (l1.x >= l2.x + l2.w)
              return false;
            if (l1.y + l1.h <= l2.y)
              return false;
            if (l1.y >= l2.y + l2.h)
              return false;
            return true;
          }
          function compact(layout, verticalCompact) {
            var compareWith = getStatics(layout);
            var sorted = sortLayoutItemsByRowCol(layout);
            var out = Array(layout.length);
            for (var i = 0, len = sorted.length; i < len; i++) {
              var l = sorted[i];
              if (!l.static) {
                l = compactItem(compareWith, l, verticalCompact);
                compareWith.push(l);
              }
              out[layout.indexOf(l)] = l;
              l.moved = false;
            }
            return out;
          }
          function compactItem(compareWith, l, verticalCompact) {
            if (verticalCompact) {
              while (l.y > 0 && !getFirstCollision(compareWith, l)) {
                l.y--;
              }
            }
            var collides2;
            while (collides2 = getFirstCollision(compareWith, l)) {
              l.y = collides2.y + collides2.h;
            }
            return l;
          }
          function correctBounds(layout, bounds) {
            var collidesWith = getStatics(layout);
            for (var i = 0, len = layout.length; i < len; i++) {
              var l = layout[i];
              if (l.x + l.w > bounds.cols)
                l.x = bounds.cols - l.w;
              if (l.x < 0) {
                l.x = 0;
                l.w = bounds.cols;
              }
              if (!l.static)
                collidesWith.push(l);
              else {
                while (getFirstCollision(collidesWith, l)) {
                  l.y++;
                }
              }
            }
            return layout;
          }
          function getLayoutItem(layout, id) {
            for (var i = 0, len = layout.length; i < len; i++) {
              if (layout[i].i === id)
                return layout[i];
            }
          }
          function getFirstCollision(layout, layoutItem) {
            for (var i = 0, len = layout.length; i < len; i++) {
              if (collides(layout[i], layoutItem))
                return layout[i];
            }
          }
          function getAllCollisions(layout, layoutItem) {
            return layout.filter(function(l) {
              return collides(l, layoutItem);
            });
          }
          function getStatics(layout) {
            return layout.filter(function(l) {
              return l.static;
            });
          }
          function moveElement(layout, l, x, y, isUserAction, preventCollision) {
            if (l.static)
              return layout;
            var oldX = l.x;
            var oldY = l.y;
            var movingUp = y && l.y > y;
            if (typeof x === "number")
              l.x = x;
            if (typeof y === "number")
              l.y = y;
            l.moved = true;
            var sorted = sortLayoutItemsByRowCol(layout);
            if (movingUp)
              sorted = sorted.reverse();
            var collisions = getAllCollisions(sorted, l);
            if (preventCollision && collisions.length) {
              l.x = oldX;
              l.y = oldY;
              l.moved = false;
              return layout;
            }
            for (var i = 0, len = collisions.length; i < len; i++) {
              var collision = collisions[i];
              if (collision.moved)
                continue;
              if (l.y > collision.y && l.y - collision.y > collision.h / 4)
                continue;
              if (collision.static) {
                layout = moveElementAwayFromCollision(layout, collision, l, isUserAction);
              } else {
                layout = moveElementAwayFromCollision(layout, l, collision, isUserAction);
              }
            }
            return layout;
          }
          function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction) {
            var preventCollision = false;
            if (isUserAction) {
              var fakeItem = {
                x: itemToMove.x,
                y: itemToMove.y,
                w: itemToMove.w,
                h: itemToMove.h,
                i: "-1"
              };
              fakeItem.y = Math.max(collidesWith.y - itemToMove.h, 0);
              if (!getFirstCollision(layout, fakeItem)) {
                return moveElement(layout, itemToMove, void 0, fakeItem.y, preventCollision);
              }
            }
            return moveElement(layout, itemToMove, void 0, itemToMove.y + 1, preventCollision);
          }
          function perc(num) {
            return num * 100 + "%";
          }
          function setTransform(top, left, width, height) {
            var translate = "translate3d(" + left + "px," + top + "px, 0)";
            return {
              transform: translate,
              WebkitTransform: translate,
              MozTransform: translate,
              msTransform: translate,
              OTransform: translate,
              width: width + "px",
              height: height + "px",
              position: "absolute"
            };
          }
          function setTransformRtl(top, right, width, height) {
            var translate = "translate3d(" + right * -1 + "px," + top + "px, 0)";
            return {
              transform: translate,
              WebkitTransform: translate,
              MozTransform: translate,
              msTransform: translate,
              OTransform: translate,
              width: width + "px",
              height: height + "px",
              position: "absolute"
            };
          }
          function setTopLeft(top, left, width, height) {
            return {
              top: top + "px",
              left: left + "px",
              width: width + "px",
              height: height + "px",
              position: "absolute"
            };
          }
          function setTopRight(top, right, width, height) {
            return {
              top: top + "px",
              right: right + "px",
              width: width + "px",
              height: height + "px",
              position: "absolute"
            };
          }
          function sortLayoutItemsByRowCol(layout) {
            return [].concat(layout).sort(function(a, b) {
              if (a.y === b.y && a.x === b.x) {
                return 0;
              }
              if (a.y > b.y || a.y === b.y && a.x > b.x) {
                return 1;
              }
              return -1;
            });
          }
          function validateLayout(layout, contextName) {
            contextName = contextName || "Layout";
            var subProps = ["x", "y", "w", "h"];
            var keyArr = [];
            if (!Array.isArray(layout))
              throw new Error(contextName + " must be an array!");
            for (var i = 0, len = layout.length; i < len; i++) {
              var item = layout[i];
              for (var j = 0; j < subProps.length; j++) {
                if (typeof item[subProps[j]] !== "number") {
                  throw new Error("VueGridLayout: " + contextName + "[" + i + "]." + subProps[j] + " must be a number!");
                }
              }
              if (item.i === void 0 || item.i === null) {
                throw new Error("VueGridLayout: " + contextName + "[" + i + "].i cannot be null!");
              }
              if (typeof item.i !== "number" && typeof item.i !== "string") {
                throw new Error("VueGridLayout: " + contextName + "[" + i + "].i must be a string or number!");
              }
              if (keyArr.indexOf(item.i) >= 0) {
                throw new Error("VueGridLayout: " + contextName + "[" + i + "].i must be unique!");
              }
              keyArr.push(item.i);
              if (item.static !== void 0 && typeof item.static !== "boolean") {
                throw new Error("VueGridLayout: " + contextName + "[" + i + "].static must be a boolean!");
              }
            }
          }
          function autoBindHandlers(el, fns) {
            fns.forEach(function(key) {
              return el[key] = el[key].bind(el);
            });
          }
          function createMarkup(obj) {
            var keys = Object.keys(obj);
            if (!keys.length)
              return "";
            var i, len = keys.length;
            var result = "";
            for (i = 0; i < len; i++) {
              var key = keys[i];
              var val = obj[key];
              result += hyphenate(key) + ":" + addPx(key, val) + ";";
            }
            return result;
          }
          var IS_UNITLESS = {
            animationIterationCount: true,
            boxFlex: true,
            boxFlexGroup: true,
            boxOrdinalGroup: true,
            columnCount: true,
            flex: true,
            flexGrow: true,
            flexPositive: true,
            flexShrink: true,
            flexNegative: true,
            flexOrder: true,
            gridRow: true,
            gridColumn: true,
            fontWeight: true,
            lineClamp: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            tabSize: true,
            widows: true,
            zIndex: true,
            zoom: true,
            // SVG-related properties
            fillOpacity: true,
            stopOpacity: true,
            strokeDashoffset: true,
            strokeOpacity: true,
            strokeWidth: true
          };
          function addPx(name, value) {
            if (typeof value === "number" && !IS_UNITLESS[name]) {
              return value + "px";
            } else {
              return value;
            }
          }
          var hyphenateRE = /([a-z\d])([A-Z])/g;
          function hyphenate(str) {
            return str.replace(hyphenateRE, "$1-$2").toLowerCase();
          }
          function findItemInArray(array2, property, value) {
            for (var i = 0; i < array2.length; i++) {
              if (array2[i][property] == value)
                return true;
            }
            return false;
          }
          function findAndRemove(array2, property, value) {
            array2.forEach(function(result, index) {
              if (result[property] === value) {
                array2.splice(index, 1);
              }
            });
          }
          function getControlPosition(e) {
            return offsetXYFromParentOf(e);
          }
          function offsetXYFromParentOf(evt) {
            var offsetParent = evt.target.offsetParent || document.body;
            var offsetParentRect = evt.offsetParent === document.body ? {
              left: 0,
              top: 0
            } : offsetParent.getBoundingClientRect();
            var x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
            var y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;
            return {
              x,
              y
            };
          }
          function createCoreData(lastX, lastY, x, y) {
            var isStart = !isNum(lastX);
            if (isStart) {
              return {
                deltaX: 0,
                deltaY: 0,
                lastX: x,
                lastY: y,
                x,
                y
              };
            } else {
              return {
                deltaX: x - lastX,
                deltaY: y - lastY,
                lastX,
                lastY,
                x,
                y
              };
            }
          }
          function isNum(num) {
            return typeof num === "number" && !isNaN(num);
          }
          function getBreakpointFromWidth(breakpoints, width) {
            var sorted = sortBreakpoints(breakpoints);
            var matching = sorted[0];
            for (var i = 1, len = sorted.length; i < len; i++) {
              var breakpointName = sorted[i];
              if (width > breakpoints[breakpointName])
                matching = breakpointName;
            }
            return matching;
          }
          function getColsFromBreakpoint(breakpoint, cols) {
            if (!cols[breakpoint]) {
              throw new Error("ResponsiveGridLayout: `cols` entry for breakpoint " + breakpoint + " is missing!");
            }
            return cols[breakpoint];
          }
          function findOrGenerateResponsiveLayout(orgLayout, layouts, breakpoints, breakpoint, lastBreakpoint, cols, verticalCompact) {
            if (layouts[breakpoint])
              return cloneLayout(layouts[breakpoint]);
            var layout = orgLayout;
            var breakpointsSorted = sortBreakpoints(breakpoints);
            var breakpointsAbove = breakpointsSorted.slice(breakpointsSorted.indexOf(breakpoint));
            for (var i = 0, len = breakpointsAbove.length; i < len; i++) {
              var b = breakpointsAbove[i];
              if (layouts[b]) {
                layout = layouts[b];
                break;
              }
            }
            layout = cloneLayout(layout || []);
            return compact(correctBounds(layout, {
              cols
            }), verticalCompact);
          }
          function generateResponsiveLayout(layout, breakpoints, breakpoint, lastBreakpoint, cols, verticalCompact) {
            layout = cloneLayout(layout || []);
            return compact(correctBounds(layout, {
              cols
            }), verticalCompact);
          }
          function sortBreakpoints(breakpoints) {
            var keys = Object.keys(breakpoints);
            return keys.sort(function(a, b) {
              return breakpoints[a] - breakpoints[b];
            });
          }
          var currentDir = "auto";
          function hasDocument() {
            return typeof document !== "undefined";
          }
          function hasWindow() {
            return typeof window !== "undefined";
          }
          function getDocumentDir() {
            if (!hasDocument()) {
              return currentDir;
            }
            var direction = typeof document.dir !== "undefined" ? document.dir : document.getElementsByTagName("html")[0].getAttribute("dir");
            return direction;
          }
          function setDocumentDir(dir) {
            if (!hasDocument) {
              currentDir = dir;
              return;
            }
            var html = document.getElementsByTagName("html")[0];
            html.setAttribute("dir", dir);
          }
          function addWindowEventListener(event, callback) {
            if (!hasWindow) {
              callback();
              return;
            }
            window.addEventListener(event, callback);
          }
          function removeWindowEventListener(event, callback) {
            if (!hasWindow) {
              return;
            }
            window.removeEventListener(event, callback);
          }
          const domObjects = {
            init,
            document: null,
            DocumentFragment: null,
            SVGElement: null,
            SVGSVGElement: null,
            SVGElementInstance: null,
            Element: null,
            HTMLElement: null,
            Event: null,
            Touch: null,
            PointerEvent: null
          };
          function blank() {
          }
          var utils_domObjects = domObjects;
          function init(window2) {
            const win2 = window2;
            domObjects.document = win2.document;
            domObjects.DocumentFragment = win2.DocumentFragment || blank;
            domObjects.SVGElement = win2.SVGElement || blank;
            domObjects.SVGSVGElement = win2.SVGSVGElement || blank;
            domObjects.SVGElementInstance = win2.SVGElementInstance || blank;
            domObjects.Element = win2.Element || blank;
            domObjects.HTMLElement = win2.HTMLElement || domObjects.Element;
            domObjects.Event = win2.Event;
            domObjects.Touch = win2.Touch || blank;
            domObjects.PointerEvent = win2.PointerEvent || win2.MSPointerEvent;
          }
          var isWindow = (thing) => !!(thing && thing.Window) && thing instanceof thing.Window;
          let realWindow = void 0;
          let win = void 0;
          function window_init(window2) {
            realWindow = window2;
            const el = window2.document.createTextNode("");
            if (el.ownerDocument !== window2.document && typeof window2.wrap === "function" && window2.wrap(el) === el) {
              window2 = window2.wrap(window2);
            }
            win = window2;
          }
          if (typeof window !== "undefined" && !!window) {
            window_init(window);
          }
          function getWindow(node) {
            if (isWindow(node)) {
              return node;
            }
            const rootNode = node.ownerDocument || node;
            return rootNode.defaultView || win.window;
          }
          const is_window = (thing) => thing === win || isWindow(thing);
          const docFrag = (thing) => object(thing) && thing.nodeType === 11;
          const object = (thing) => !!thing && typeof thing === "object";
          const func = (thing) => typeof thing === "function";
          const number = (thing) => typeof thing === "number";
          const bool = (thing) => typeof thing === "boolean";
          const string = (thing) => typeof thing === "string";
          const is_element = (thing) => {
            if (!thing || typeof thing !== "object") {
              return false;
            }
            const _window = getWindow(thing) || win;
            return /object|function/.test(typeof _window.Element) ? thing instanceof _window.Element : thing.nodeType === 1 && typeof thing.nodeName === "string";
          };
          const plainObject = (thing) => object(thing) && !!thing.constructor && /function Object\b/.test(thing.constructor.toString());
          const array = (thing) => object(thing) && typeof thing.length !== "undefined" && func(thing.splice);
          var is = {
            window: is_window,
            docFrag,
            object,
            func,
            number,
            bool,
            string,
            element: is_element,
            plainObject,
            array
          };
          const browser = {
            init: browser_init,
            supportsTouch: null,
            supportsPointerEvent: null,
            isIOS7: null,
            isIOS: null,
            isIe9: null,
            isOperaMobile: null,
            prefixedMatchesSelector: null,
            pEventTypes: null,
            wheelEvent: null
          };
          function browser_init(window2) {
            const Element = utils_domObjects.Element;
            const navigator2 = win.navigator;
            browser.supportsTouch = "ontouchstart" in window2 || is.func(window2.DocumentTouch) && utils_domObjects.document instanceof window2.DocumentTouch;
            browser.supportsPointerEvent = navigator2.pointerEnabled !== false && !!utils_domObjects.PointerEvent;
            browser.isIOS = /iP(hone|od|ad)/.test(navigator2.platform);
            browser.isIOS7 = /iP(hone|od|ad)/.test(navigator2.platform) && /OS 7[^\d]/.test(navigator2.appVersion);
            browser.isIe9 = /MSIE 9/.test(navigator2.userAgent);
            browser.isOperaMobile = navigator2.appName === "Opera" && browser.supportsTouch && /Presto/.test(navigator2.userAgent);
            browser.prefixedMatchesSelector = "matches" in Element.prototype ? "matches" : "webkitMatchesSelector" in Element.prototype ? "webkitMatchesSelector" : "mozMatchesSelector" in Element.prototype ? "mozMatchesSelector" : "oMatchesSelector" in Element.prototype ? "oMatchesSelector" : "msMatchesSelector";
            browser.pEventTypes = browser.supportsPointerEvent ? utils_domObjects.PointerEvent === window2.MSPointerEvent ? {
              up: "MSPointerUp",
              down: "MSPointerDown",
              over: "mouseover",
              out: "mouseout",
              move: "MSPointerMove",
              cancel: "MSPointerCancel"
            } : {
              up: "pointerup",
              down: "pointerdown",
              over: "pointerover",
              out: "pointerout",
              move: "pointermove",
              cancel: "pointercancel"
            } : null;
            browser.wheelEvent = "onmousewheel" in utils_domObjects.document ? "mousewheel" : "wheel";
          }
          var utils_browser = browser;
          const contains = (array2, target) => array2.indexOf(target) !== -1;
          const arr_remove = (array2, target) => array2.splice(array2.indexOf(target), 1);
          const merge = (target, source) => {
            for (const item of source) {
              target.push(item);
            }
            return target;
          };
          const from = (source) => merge([], source);
          const findIndex = (array2, func2) => {
            for (let i = 0; i < array2.length; i++) {
              if (func2(array2[i], i, array2)) {
                return i;
              }
            }
            return -1;
          };
          const find = (array2, func2) => array2[findIndex(array2, func2)];
          function clone(source) {
            const dest = {};
            for (const prop in source) {
              const value = source[prop];
              if (is.plainObject(value)) {
                dest[prop] = clone(value);
              } else if (is.array(value)) {
                dest[prop] = from(value);
              } else {
                dest[prop] = value;
              }
            }
            return dest;
          }
          function extend2(dest, source) {
            for (const prop in source) {
              dest[prop] = source[prop];
            }
            const ret = dest;
            return ret;
          }
          let lastTime = 0;
          let request;
          let cancel;
          function raf_init(window2) {
            request = window2.requestAnimationFrame;
            cancel = window2.cancelAnimationFrame;
            if (!request) {
              const vendors = ["ms", "moz", "webkit", "o"];
              for (const vendor of vendors) {
                request = window2[`${vendor}RequestAnimationFrame`];
                cancel = window2[`${vendor}CancelAnimationFrame`] || window2[`${vendor}CancelRequestAnimationFrame`];
              }
            }
            request = request && request.bind(window2);
            cancel = cancel && cancel.bind(window2);
            if (!request) {
              request = (callback) => {
                const currTime = Date.now();
                const timeToCall = Math.max(0, 16 - (currTime - lastTime));
                const token = window2.setTimeout(() => {
                  callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return token;
              };
              cancel = (token) => clearTimeout(token);
            }
          }
          var raf = {
            request: (callback) => request(callback),
            cancel: (token) => cancel(token),
            init: raf_init
          };
          function normalize(type, listeners, result) {
            result = result || {};
            if (is.string(type) && type.search(" ") !== -1) {
              type = split(type);
            }
            if (is.array(type)) {
              return type.reduce((acc, t) => extend2(acc, normalize(t, listeners, result)), result);
            }
            if (is.object(type)) {
              listeners = type;
              type = "";
            }
            if (is.func(listeners)) {
              result[type] = result[type] || [];
              result[type].push(listeners);
            } else if (is.array(listeners)) {
              for (const l of listeners) {
                normalize(type, l, result);
              }
            } else if (is.object(listeners)) {
              for (const prefix2 in listeners) {
                const combinedTypes = split(prefix2).map((p) => `${type}${p}`);
                normalize(combinedTypes, listeners[prefix2], result);
              }
            }
            return result;
          }
          function split(type) {
            return type.trim().split(/ +/);
          }
          function fireUntilImmediateStopped(event, listeners) {
            for (const listener of listeners) {
              if (event.immediatePropagationStopped) {
                break;
              }
              listener(event);
            }
          }
          class Eventable_Eventable {
            constructor(options) {
              this.options = void 0;
              this.types = {};
              this.propagationStopped = false;
              this.immediatePropagationStopped = false;
              this.global = void 0;
              this.options = extend2({}, options || {});
            }
            fire(event) {
              let listeners;
              const global = this.global;
              if (listeners = this.types[event.type]) {
                fireUntilImmediateStopped(event, listeners);
              }
              if (!event.propagationStopped && global && (listeners = global[event.type])) {
                fireUntilImmediateStopped(event, listeners);
              }
            }
            on(type, listener) {
              const listeners = normalize(type, listener);
              for (type in listeners) {
                this.types[type] = merge(this.types[type] || [], listeners[type]);
              }
            }
            off(type, listener) {
              const listeners = normalize(type, listener);
              for (type in listeners) {
                const eventList = this.types[type];
                if (!eventList || !eventList.length) {
                  continue;
                }
                for (const subListener of listeners[type]) {
                  const index = eventList.indexOf(subListener);
                  if (index !== -1) {
                    eventList.splice(index, 1);
                  }
                }
              }
            }
            getRect(_element) {
              return null;
            }
          }
          function nodeContains(parent, child) {
            if (parent.contains) {
              return parent.contains(child);
            }
            while (child) {
              if (child === parent) {
                return true;
              }
              child = child.parentNode;
            }
            return false;
          }
          function domUtils_closest(element, selector) {
            while (is.element(element)) {
              if (matchesSelector(element, selector)) {
                return element;
              }
              element = parentNode(element);
            }
            return null;
          }
          function parentNode(node) {
            let parent = node.parentNode;
            if (is.docFrag(parent)) {
              while ((parent = parent.host) && is.docFrag(parent)) {
                continue;
              }
              return parent;
            }
            return parent;
          }
          function matchesSelector(element, selector) {
            if (win !== realWindow) {
              selector = selector.replace(/\/deep\//g, " ");
            }
            return element[utils_browser.prefixedMatchesSelector](selector);
          }
          const getParent = (el) => el.parentNode || el.host;
          function indexOfDeepestElement(elements) {
            let deepestNodeParents = [];
            let deepestNodeIndex;
            for (let i = 0; i < elements.length; i++) {
              const currentNode = elements[i];
              const deepestNode = elements[deepestNodeIndex];
              if (!currentNode || i === deepestNodeIndex) {
                continue;
              }
              if (!deepestNode) {
                deepestNodeIndex = i;
                continue;
              }
              const currentNodeParent = getParent(currentNode);
              const deepestNodeParent = getParent(deepestNode);
              if (currentNodeParent === currentNode.ownerDocument) {
                continue;
              } else if (deepestNodeParent === currentNode.ownerDocument) {
                deepestNodeIndex = i;
                continue;
              }
              if (currentNodeParent === deepestNodeParent) {
                if (zIndexIsHigherThan(currentNode, deepestNode)) {
                  deepestNodeIndex = i;
                }
                continue;
              }
              deepestNodeParents = deepestNodeParents.length ? deepestNodeParents : getNodeParents(deepestNode);
              let ancestryStart;
              if (deepestNode instanceof utils_domObjects.HTMLElement && currentNode instanceof utils_domObjects.SVGElement && !(currentNode instanceof utils_domObjects.SVGSVGElement)) {
                if (currentNode === deepestNodeParent) {
                  continue;
                }
                ancestryStart = currentNode.ownerSVGElement;
              } else {
                ancestryStart = currentNode;
              }
              const currentNodeParents = getNodeParents(ancestryStart, deepestNode.ownerDocument);
              let commonIndex = 0;
              while (currentNodeParents[commonIndex] && currentNodeParents[commonIndex] === deepestNodeParents[commonIndex]) {
                commonIndex++;
              }
              const parents = [currentNodeParents[commonIndex - 1], currentNodeParents[commonIndex], deepestNodeParents[commonIndex]];
              let child = parents[0].lastChild;
              while (child) {
                if (child === parents[1]) {
                  deepestNodeIndex = i;
                  deepestNodeParents = currentNodeParents;
                  break;
                } else if (child === parents[2]) {
                  break;
                }
                child = child.previousSibling;
              }
            }
            return deepestNodeIndex;
          }
          function getNodeParents(node, limit) {
            const parents = [];
            let parent = node;
            let parentParent;
            while ((parentParent = getParent(parent)) && parent !== limit && parentParent !== parent.ownerDocument) {
              parents.unshift(parent);
              parent = parentParent;
            }
            return parents;
          }
          function zIndexIsHigherThan(higherNode, lowerNode) {
            const higherIndex = parseInt(getWindow(higherNode).getComputedStyle(higherNode).zIndex, 10) || 0;
            const lowerIndex = parseInt(getWindow(lowerNode).getComputedStyle(lowerNode).zIndex, 10) || 0;
            return higherIndex >= lowerIndex;
          }
          function matchesUpTo(element, selector, limit) {
            while (is.element(element)) {
              if (matchesSelector(element, selector)) {
                return true;
              }
              element = parentNode(element);
              if (element === limit) {
                return matchesSelector(element, selector);
              }
            }
            return false;
          }
          function getActualElement(element) {
            return element.correspondingUseElement || element;
          }
          function getScrollXY(relevantWindow) {
            relevantWindow = relevantWindow || win;
            return {
              x: relevantWindow.scrollX || relevantWindow.document.documentElement.scrollLeft,
              y: relevantWindow.scrollY || relevantWindow.document.documentElement.scrollTop
            };
          }
          function getElementClientRect(element) {
            const clientRect = element instanceof utils_domObjects.SVGElement ? element.getBoundingClientRect() : element.getClientRects()[0];
            return clientRect && {
              left: clientRect.left,
              right: clientRect.right,
              top: clientRect.top,
              bottom: clientRect.bottom,
              width: clientRect.width || clientRect.right - clientRect.left,
              height: clientRect.height || clientRect.bottom - clientRect.top
            };
          }
          function getElementRect(element) {
            const clientRect = getElementClientRect(element);
            if (!utils_browser.isIOS7 && clientRect) {
              const scroll = getScrollXY(getWindow(element));
              clientRect.left += scroll.x;
              clientRect.right += scroll.x;
              clientRect.top += scroll.y;
              clientRect.bottom += scroll.y;
            }
            return clientRect;
          }
          function getPath(node) {
            const path = [];
            while (node) {
              path.push(node);
              node = parentNode(node);
            }
            return path;
          }
          function trySelector(value) {
            if (!is.string(value)) {
              return false;
            }
            utils_domObjects.document.querySelector(value);
            return true;
          }
          function getStringOptionResult(value, target, element) {
            if (value === "parent") {
              return parentNode(element);
            }
            if (value === "self") {
              return target.getRect(element);
            }
            return domUtils_closest(element, value);
          }
          function resolveRectLike(value, target, element, functionArgs) {
            let returnValue = value;
            if (is.string(returnValue)) {
              returnValue = getStringOptionResult(returnValue, target, element);
            } else if (is.func(returnValue)) {
              returnValue = returnValue(...functionArgs);
            }
            if (is.element(returnValue)) {
              returnValue = getElementRect(returnValue);
            }
            return returnValue;
          }
          function rectToXY(rect) {
            return rect && {
              x: "x" in rect ? rect.x : rect.left,
              y: "y" in rect ? rect.y : rect.top
            };
          }
          function xywhToTlbr(rect) {
            if (rect && !("left" in rect && "top" in rect)) {
              rect = extend2({}, rect);
              rect.left = rect.x || 0;
              rect.top = rect.y || 0;
              rect.right = rect.right || rect.left + rect.width;
              rect.bottom = rect.bottom || rect.top + rect.height;
            }
            return rect;
          }
          function tlbrToXywh(rect) {
            if (rect && !("x" in rect && "y" in rect)) {
              rect = extend2({}, rect);
              rect.x = rect.left || 0;
              rect.y = rect.top || 0;
              rect.width = rect.width || (rect.right || 0) - rect.x;
              rect.height = rect.height || (rect.bottom || 0) - rect.y;
            }
            return rect;
          }
          function addEdges(edges, rect, delta) {
            if (edges.left) {
              rect.left += delta.x;
            }
            if (edges.right) {
              rect.right += delta.x;
            }
            if (edges.top) {
              rect.top += delta.y;
            }
            if (edges.bottom) {
              rect.bottom += delta.y;
            }
            rect.width = rect.right - rect.left;
            rect.height = rect.bottom - rect.top;
          }
          var getOriginXY = function(target, element, actionName) {
            const actionOptions = target.options[actionName];
            const actionOrigin = actionOptions && actionOptions.origin;
            const origin = actionOrigin || target.options.origin;
            const originRect = resolveRectLike(origin, target, element, [target && element]);
            return rectToXY(originRect) || {
              x: 0,
              y: 0
            };
          };
          var hypot = (x, y) => Math.sqrt(x * x + y * y);
          class BaseEvent {
            constructor(interaction) {
              this.type = void 0;
              this.target = void 0;
              this.currentTarget = void 0;
              this.interactable = void 0;
              this._interaction = void 0;
              this.timeStamp = void 0;
              this.immediatePropagationStopped = false;
              this.propagationStopped = false;
              this._interaction = interaction;
            }
            preventDefault() {
            }
            /**
             * Don't call any other listeners (even on the current target)
             */
            stopPropagation() {
              this.propagationStopped = true;
            }
            /**
             * Don't call listeners on the remaining targets
             */
            stopImmediatePropagation() {
              this.immediatePropagationStopped = this.propagationStopped = true;
            }
          }
          Object.defineProperty(BaseEvent.prototype, "interaction", {
            get() {
              return this._interaction._proxy;
            },
            set() {
            }
          });
          const defaultOptions_defaults = {
            base: {
              preventDefault: "auto",
              deltaSource: "page"
            },
            perAction: {
              enabled: false,
              origin: {
                x: 0,
                y: 0
              }
            },
            actions: {}
          };
          class InteractEvent_InteractEvent extends BaseEvent {
            // resize
            /** */
            constructor(interaction, event, actionName, phase, element, preEnd, type) {
              super(interaction);
              this.target = void 0;
              this.currentTarget = void 0;
              this.relatedTarget = null;
              this.screenX = void 0;
              this.screenY = void 0;
              this.button = void 0;
              this.buttons = void 0;
              this.ctrlKey = void 0;
              this.shiftKey = void 0;
              this.altKey = void 0;
              this.metaKey = void 0;
              this.page = void 0;
              this.client = void 0;
              this.delta = void 0;
              this.rect = void 0;
              this.x0 = void 0;
              this.y0 = void 0;
              this.t0 = void 0;
              this.dt = void 0;
              this.duration = void 0;
              this.clientX0 = void 0;
              this.clientY0 = void 0;
              this.velocity = void 0;
              this.speed = void 0;
              this.swipe = void 0;
              this.timeStamp = void 0;
              this.axes = void 0;
              this.preEnd = void 0;
              element = element || interaction.element;
              const target = interaction.interactable;
              const deltaSource = (target && target.options || defaultOptions_defaults).deltaSource;
              const origin = getOriginXY(target, element, actionName);
              const starting = phase === "start";
              const ending = phase === "end";
              const prevEvent = starting ? this : interaction.prevEvent;
              const coords = starting ? interaction.coords.start : ending ? {
                page: prevEvent.page,
                client: prevEvent.client,
                timeStamp: interaction.coords.cur.timeStamp
              } : interaction.coords.cur;
              this.page = extend2({}, coords.page);
              this.client = extend2({}, coords.client);
              this.rect = extend2({}, interaction.rect);
              this.timeStamp = coords.timeStamp;
              if (!ending) {
                this.page.x -= origin.x;
                this.page.y -= origin.y;
                this.client.x -= origin.x;
                this.client.y -= origin.y;
              }
              this.ctrlKey = event.ctrlKey;
              this.altKey = event.altKey;
              this.shiftKey = event.shiftKey;
              this.metaKey = event.metaKey;
              this.button = event.button;
              this.buttons = event.buttons;
              this.target = element;
              this.currentTarget = element;
              this.preEnd = preEnd;
              this.type = type || actionName + (phase || "");
              this.interactable = target;
              this.t0 = starting ? interaction.pointers[interaction.pointers.length - 1].downTime : prevEvent.t0;
              this.x0 = interaction.coords.start.page.x - origin.x;
              this.y0 = interaction.coords.start.page.y - origin.y;
              this.clientX0 = interaction.coords.start.client.x - origin.x;
              this.clientY0 = interaction.coords.start.client.y - origin.y;
              if (starting || ending) {
                this.delta = {
                  x: 0,
                  y: 0
                };
              } else {
                this.delta = {
                  x: this[deltaSource].x - prevEvent[deltaSource].x,
                  y: this[deltaSource].y - prevEvent[deltaSource].y
                };
              }
              this.dt = interaction.coords.delta.timeStamp;
              this.duration = this.timeStamp - this.t0;
              this.velocity = extend2({}, interaction.coords.velocity[deltaSource]);
              this.speed = hypot(this.velocity.x, this.velocity.y);
              this.swipe = ending || phase === "inertiastart" ? this.getSwipe() : null;
            }
            getSwipe() {
              const interaction = this._interaction;
              if (interaction.prevEvent.speed < 600 || this.timeStamp - interaction.prevEvent.timeStamp > 150) {
                return null;
              }
              let angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI;
              const overlap = 22.5;
              if (angle < 0) {
                angle += 360;
              }
              const left = 135 - overlap <= angle && angle < 225 + overlap;
              const up = 225 - overlap <= angle && angle < 315 + overlap;
              const right = !left && (315 - overlap <= angle || angle < 45 + overlap);
              const down = !up && 45 - overlap <= angle && angle < 135 + overlap;
              return {
                up,
                down,
                left,
                right,
                angle,
                speed: interaction.prevEvent.speed,
                velocity: {
                  x: interaction.prevEvent.velocityX,
                  y: interaction.prevEvent.velocityY
                }
              };
            }
            preventDefault() {
            }
            /**
             * Don't call listeners on the remaining targets
             */
            stopImmediatePropagation() {
              this.immediatePropagationStopped = this.propagationStopped = true;
            }
            /**
             * Don't call any other listeners (even on the current target)
             */
            stopPropagation() {
              this.propagationStopped = true;
            }
          }
          Object.defineProperties(InteractEvent_InteractEvent.prototype, {
            pageX: {
              get() {
                return this.page.x;
              },
              set(value) {
                this.page.x = value;
              }
            },
            pageY: {
              get() {
                return this.page.y;
              },
              set(value) {
                this.page.y = value;
              }
            },
            clientX: {
              get() {
                return this.client.x;
              },
              set(value) {
                this.client.x = value;
              }
            },
            clientY: {
              get() {
                return this.client.y;
              },
              set(value) {
                this.client.y = value;
              }
            },
            dx: {
              get() {
                return this.delta.x;
              },
              set(value) {
                this.delta.x = value;
              }
            },
            dy: {
              get() {
                return this.delta.y;
              },
              set(value) {
                this.delta.y = value;
              }
            },
            velocityX: {
              get() {
                return this.velocity.x;
              },
              set(value) {
                this.velocity.x = value;
              }
            },
            velocityY: {
              get() {
                return this.velocity.y;
              },
              set(value) {
                this.velocity.y = value;
              }
            }
          });
          function isNonNativeEvent(type, actions) {
            if (actions.phaselessTypes[type]) {
              return true;
            }
            for (const name in actions.map) {
              if (type.indexOf(name) === 0 && type.substr(name.length) in actions.phases) {
                return true;
              }
            }
            return false;
          }
          class Interactable_Interactable {
            /** @internal */
            get _defaults() {
              return {
                base: {},
                perAction: {},
                actions: {}
              };
            }
            /** */
            constructor(target, options, defaultContext, scopeEvents) {
              this.options = void 0;
              this._actions = void 0;
              this.target = void 0;
              this.events = new Eventable_Eventable();
              this._context = void 0;
              this._win = void 0;
              this._doc = void 0;
              this._scopeEvents = void 0;
              this._rectChecker = void 0;
              this._actions = options.actions;
              this.target = target;
              this._context = options.context || defaultContext;
              this._win = getWindow(trySelector(target) ? this._context : target);
              this._doc = this._win.document;
              this._scopeEvents = scopeEvents;
              this.set(options);
            }
            setOnEvents(actionName, phases) {
              if (is.func(phases.onstart)) {
                this.on(`${actionName}start`, phases.onstart);
              }
              if (is.func(phases.onmove)) {
                this.on(`${actionName}move`, phases.onmove);
              }
              if (is.func(phases.onend)) {
                this.on(`${actionName}end`, phases.onend);
              }
              if (is.func(phases.oninertiastart)) {
                this.on(`${actionName}inertiastart`, phases.oninertiastart);
              }
              return this;
            }
            updatePerActionListeners(actionName, prev, cur) {
              if (is.array(prev) || is.object(prev)) {
                this.off(actionName, prev);
              }
              if (is.array(cur) || is.object(cur)) {
                this.on(actionName, cur);
              }
            }
            setPerAction(actionName, options) {
              const defaults = this._defaults;
              for (const optionName_ in options) {
                const optionName = optionName_;
                const actionOptions = this.options[actionName];
                const optionValue = options[optionName];
                if (optionName === "listeners") {
                  this.updatePerActionListeners(actionName, actionOptions.listeners, optionValue);
                }
                if (is.array(optionValue)) {
                  actionOptions[optionName] = from(optionValue);
                } else if (is.plainObject(optionValue)) {
                  actionOptions[optionName] = extend2(actionOptions[optionName] || {}, clone(optionValue));
                  if (is.object(defaults.perAction[optionName]) && "enabled" in defaults.perAction[optionName]) {
                    actionOptions[optionName].enabled = optionValue.enabled !== false;
                  }
                } else if (is.bool(optionValue) && is.object(defaults.perAction[optionName])) {
                  actionOptions[optionName].enabled = optionValue;
                } else {
                  actionOptions[optionName] = optionValue;
                }
              }
            }
            /**
             * The default function to get an Interactables bounding rect. Can be
             * overridden using {@link Interactable.rectChecker}.
             *
             * @param {Element} [element] The element to measure.
             * @return {Rect} The object's bounding rectangle.
             */
            getRect(element) {
              element = element || (is.element(this.target) ? this.target : null);
              if (is.string(this.target)) {
                element = element || this._context.querySelector(this.target);
              }
              return getElementRect(element);
            }
            /**
             * Returns or sets the function used to calculate the interactable's
             * element's rectangle
             *
             * @param {function} [checker] A function which returns this Interactable's
             * bounding rectangle. See {@link Interactable.getRect}
             * @return {function | object} The checker function or this Interactable
             */
            rectChecker(checker) {
              if (is.func(checker)) {
                this._rectChecker = checker;
                this.getRect = (element) => {
                  const rect = extend2({}, this._rectChecker(element));
                  if (!("width" in rect)) {
                    rect.width = rect.right - rect.left;
                    rect.height = rect.bottom - rect.top;
                  }
                  return rect;
                };
                return this;
              }
              if (checker === null) {
                delete this.getRect;
                delete this._rectChecker;
                return this;
              }
              return this.getRect;
            }
            _backCompatOption(optionName, newValue) {
              if (trySelector(newValue) || is.object(newValue)) {
                this.options[optionName] = newValue;
                for (const action in this._actions.map) {
                  this.options[action][optionName] = newValue;
                }
                return this;
              }
              return this.options[optionName];
            }
            /**
             * Gets or sets the origin of the Interactable's element.  The x and y
             * of the origin will be subtracted from action event coordinates.
             *
             * @param {Element | object | string} [origin] An HTML or SVG Element whose
             * rect will be used, an object eg. { x: 0, y: 0 } or string 'parent', 'self'
             * or any CSS selector
             *
             * @return {object} The current origin or this Interactable
             */
            origin(newValue) {
              return this._backCompatOption("origin", newValue);
            }
            /**
             * Returns or sets the mouse coordinate types used to calculate the
             * movement of the pointer.
             *
             * @param {string} [newValue] Use 'client' if you will be scrolling while
             * interacting; Use 'page' if you want autoScroll to work
             * @return {string | object} The current deltaSource or this Interactable
             */
            deltaSource(newValue) {
              if (newValue === "page" || newValue === "client") {
                this.options.deltaSource = newValue;
                return this;
              }
              return this.options.deltaSource;
            }
            /**
             * Gets the selector context Node of the Interactable. The default is
             * `window.document`.
             *
             * @return {Node} The context Node of this Interactable
             */
            context() {
              return this._context;
            }
            inContext(element) {
              return this._context === element.ownerDocument || nodeContains(this._context, element);
            }
            testIgnoreAllow(options, targetNode, eventTarget) {
              return !this.testIgnore(options.ignoreFrom, targetNode, eventTarget) && this.testAllow(options.allowFrom, targetNode, eventTarget);
            }
            testAllow(allowFrom, targetNode, element) {
              if (!allowFrom) {
                return true;
              }
              if (!is.element(element)) {
                return false;
              }
              if (is.string(allowFrom)) {
                return matchesUpTo(element, allowFrom, targetNode);
              } else if (is.element(allowFrom)) {
                return nodeContains(allowFrom, element);
              }
              return false;
            }
            testIgnore(ignoreFrom, targetNode, element) {
              if (!ignoreFrom || !is.element(element)) {
                return false;
              }
              if (is.string(ignoreFrom)) {
                return matchesUpTo(element, ignoreFrom, targetNode);
              } else if (is.element(ignoreFrom)) {
                return nodeContains(ignoreFrom, element);
              }
              return false;
            }
            /**
             * Calls listeners for the given InteractEvent type bound globally
             * and directly to this Interactable
             *
             * @param {InteractEvent} iEvent The InteractEvent object to be fired on this
             * Interactable
             * @return {Interactable} this Interactable
             */
            fire(iEvent) {
              this.events.fire(iEvent);
              return this;
            }
            _onOff(method, typeArg, listenerArg, options) {
              if (is.object(typeArg) && !is.array(typeArg)) {
                options = listenerArg;
                listenerArg = null;
              }
              const addRemove = method === "on" ? "add" : "remove";
              const listeners = normalize(typeArg, listenerArg);
              for (let type in listeners) {
                if (type === "wheel") {
                  type = utils_browser.wheelEvent;
                }
                for (const listener of listeners[type]) {
                  if (isNonNativeEvent(type, this._actions)) {
                    this.events[method](type, listener);
                  } else if (is.string(this.target)) {
                    this._scopeEvents[`${addRemove}Delegate`](this.target, this._context, type, listener, options);
                  } else {
                    this._scopeEvents[addRemove](this.target, type, listener, options);
                  }
                }
              }
              return this;
            }
            /**
             * Binds a listener for an InteractEvent, pointerEvent or DOM event.
             *
             * @param {string | array | object} types The types of events to listen
             * for
             * @param {function | array | object} [listener] The event listener function(s)
             * @param {object | boolean} [options] options object or useCapture flag for
             * addEventListener
             * @return {Interactable} This Interactable
             */
            on(types, listener, options) {
              return this._onOff("on", types, listener, options);
            }
            /**
             * Removes an InteractEvent, pointerEvent or DOM event listener.
             *
             * @param {string | array | object} types The types of events that were
             * listened for
             * @param {function | array | object} [listener] The event listener function(s)
             * @param {object | boolean} [options] options object or useCapture flag for
             * removeEventListener
             * @return {Interactable} This Interactable
             */
            off(types, listener, options) {
              return this._onOff("off", types, listener, options);
            }
            /**
             * Reset the options of this Interactable
             *
             * @param {object} options The new settings to apply
             * @return {object} This Interactable
             */
            set(options) {
              const defaults = this._defaults;
              if (!is.object(options)) {
                options = {};
              }
              this.options = clone(defaults.base);
              for (const actionName_ in this._actions.methodDict) {
                const actionName = actionName_;
                const methodName = this._actions.methodDict[actionName];
                this.options[actionName] = {};
                this.setPerAction(actionName, extend2(extend2({}, defaults.perAction), defaults.actions[actionName]));
                this[methodName](options[actionName]);
              }
              for (const setting in options) {
                if (is.func(this[setting])) {
                  this[setting](options[setting]);
                }
              }
              return this;
            }
            /**
             * Remove this interactable from the list of interactables and remove it's
             * action capabilities and event listeners
             */
            unset() {
              if (is.string(this.target)) {
                for (const type in this._scopeEvents.delegatedEvents) {
                  const delegated = this._scopeEvents.delegatedEvents[type];
                  for (let i = delegated.length - 1; i >= 0; i--) {
                    const {
                      selector,
                      context,
                      listeners
                    } = delegated[i];
                    if (selector === this.target && context === this._context) {
                      delegated.splice(i, 1);
                    }
                    for (let l = listeners.length - 1; l >= 0; l--) {
                      this._scopeEvents.removeDelegate(this.target, this._context, type, listeners[l][0], listeners[l][1]);
                    }
                  }
                }
              } else {
                this._scopeEvents.remove(this.target, "all");
              }
            }
          }
          class InteractableSet_InteractableSet {
            // all set interactables
            constructor(scope) {
              this.list = [];
              this.selectorMap = {};
              this.scope = void 0;
              this.scope = scope;
              scope.addListeners({
                "interactable:unset": ({
                  interactable
                }) => {
                  const {
                    target,
                    _context: context
                  } = interactable;
                  const targetMappings = is.string(target) ? this.selectorMap[target] : target[this.scope.id];
                  const targetIndex = findIndex(targetMappings, (m) => m.context === context);
                  if (targetMappings[targetIndex]) {
                    targetMappings[targetIndex].context = null;
                    targetMappings[targetIndex].interactable = null;
                  }
                  targetMappings.splice(targetIndex, 1);
                }
              });
            }
            new(target, options) {
              options = extend2(options || {}, {
                actions: this.scope.actions
              });
              const interactable = new this.scope.Interactable(target, options, this.scope.document, this.scope.events);
              const mappingInfo = {
                context: interactable._context,
                interactable
              };
              this.scope.addDocument(interactable._doc);
              this.list.push(interactable);
              if (is.string(target)) {
                if (!this.selectorMap[target]) {
                  this.selectorMap[target] = [];
                }
                this.selectorMap[target].push(mappingInfo);
              } else {
                if (!interactable.target[this.scope.id]) {
                  Object.defineProperty(target, this.scope.id, {
                    value: [],
                    configurable: true
                  });
                }
                target[this.scope.id].push(mappingInfo);
              }
              this.scope.fire("interactable:new", {
                target,
                options,
                interactable,
                win: this.scope._win
              });
              return interactable;
            }
            get(target, options) {
              const context = options && options.context || this.scope.document;
              const isSelector = is.string(target);
              const targetMappings = isSelector ? this.selectorMap[target] : target[this.scope.id];
              if (!targetMappings) {
                return null;
              }
              const found = find(targetMappings, (m) => m.context === context && (isSelector || m.interactable.inContext(target)));
              return found && found.interactable;
            }
            forEachMatch(node, callback) {
              for (const interactable of this.list) {
                let ret;
                if ((is.string(interactable.target) ? is.element(node) && matchesSelector(node, interactable.target) : (
                  // target is the element
                  node === interactable.target
                )) && // the element is in context
                interactable.inContext(node)) {
                  ret = callback(interactable);
                }
                if (ret !== void 0) {
                  return ret;
                }
              }
            }
          }
          function pointerExtend(dest, source) {
            for (const prop in source) {
              const prefixedPropREs = pointerExtend.prefixedPropREs;
              let deprecated = false;
              for (const vendor in prefixedPropREs) {
                if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
                  deprecated = true;
                  break;
                }
              }
              if (!deprecated && typeof source[prop] !== "function") {
                dest[prop] = source[prop];
              }
            }
            return dest;
          }
          pointerExtend.prefixedPropREs = {
            webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/,
            moz: /(Pressure)$/
          };
          var utils_pointerExtend = pointerExtend;
          function copyCoords(dest, src2) {
            dest.page = dest.page || {};
            dest.page.x = src2.page.x;
            dest.page.y = src2.page.y;
            dest.client = dest.client || {};
            dest.client.x = src2.client.x;
            dest.client.y = src2.client.y;
            dest.timeStamp = src2.timeStamp;
          }
          function setCoordDeltas(targetObj, prev, cur) {
            targetObj.page.x = cur.page.x - prev.page.x;
            targetObj.page.y = cur.page.y - prev.page.y;
            targetObj.client.x = cur.client.x - prev.client.x;
            targetObj.client.y = cur.client.y - prev.client.y;
            targetObj.timeStamp = cur.timeStamp - prev.timeStamp;
          }
          function setCoordVelocity(targetObj, delta) {
            const dt = Math.max(delta.timeStamp / 1e3, 1e-3);
            targetObj.page.x = delta.page.x / dt;
            targetObj.page.y = delta.page.y / dt;
            targetObj.client.x = delta.client.x / dt;
            targetObj.client.y = delta.client.y / dt;
            targetObj.timeStamp = dt;
          }
          function setZeroCoords(targetObj) {
            targetObj.page.x = 0;
            targetObj.page.y = 0;
            targetObj.client.x = 0;
            targetObj.client.y = 0;
          }
          function isNativePointer(pointer) {
            return pointer instanceof utils_domObjects.Event || pointer instanceof utils_domObjects.Touch;
          }
          function getXY(type, pointer, xy) {
            xy = xy || {};
            type = type || "page";
            xy.x = pointer[type + "X"];
            xy.y = pointer[type + "Y"];
            return xy;
          }
          function getPageXY(pointer, page) {
            page = page || {
              x: 0,
              y: 0
            };
            if (utils_browser.isOperaMobile && isNativePointer(pointer)) {
              getXY("screen", pointer, page);
              page.x += window.scrollX;
              page.y += window.scrollY;
            } else {
              getXY("page", pointer, page);
            }
            return page;
          }
          function getClientXY(pointer, client) {
            client = client || {};
            if (utils_browser.isOperaMobile && isNativePointer(pointer)) {
              getXY("screen", pointer, client);
            } else {
              getXY("client", pointer, client);
            }
            return client;
          }
          function getPointerId(pointer) {
            return is.number(pointer.pointerId) ? pointer.pointerId : pointer.identifier;
          }
          function setCoords(dest, pointers, timeStamp) {
            const pointer = pointers.length > 1 ? pointerAverage(pointers) : pointers[0];
            getPageXY(pointer, dest.page);
            getClientXY(pointer, dest.client);
            dest.timeStamp = timeStamp;
          }
          function getTouchPair(event) {
            const touches = [];
            if (is.array(event)) {
              touches[0] = event[0];
              touches[1] = event[1];
            } else {
              if (event.type === "touchend") {
                if (event.touches.length === 1) {
                  touches[0] = event.touches[0];
                  touches[1] = event.changedTouches[0];
                } else if (event.touches.length === 0) {
                  touches[0] = event.changedTouches[0];
                  touches[1] = event.changedTouches[1];
                }
              } else {
                touches[0] = event.touches[0];
                touches[1] = event.touches[1];
              }
            }
            return touches;
          }
          function pointerAverage(pointers) {
            const average = {
              pageX: 0,
              pageY: 0,
              clientX: 0,
              clientY: 0,
              screenX: 0,
              screenY: 0
            };
            for (const pointer of pointers) {
              for (const prop in average) {
                average[prop] += pointer[prop];
              }
            }
            for (const prop in average) {
              average[prop] /= pointers.length;
            }
            return average;
          }
          function touchBBox(event) {
            if (!event.length) {
              return null;
            }
            const touches = getTouchPair(event);
            const minX = Math.min(touches[0].pageX, touches[1].pageX);
            const minY = Math.min(touches[0].pageY, touches[1].pageY);
            const maxX = Math.max(touches[0].pageX, touches[1].pageX);
            const maxY = Math.max(touches[0].pageY, touches[1].pageY);
            return {
              x: minX,
              y: minY,
              left: minX,
              top: minY,
              right: maxX,
              bottom: maxY,
              width: maxX - minX,
              height: maxY - minY
            };
          }
          function touchDistance(event, deltaSource) {
            const sourceX = deltaSource + "X";
            const sourceY = deltaSource + "Y";
            const touches = getTouchPair(event);
            const dx = touches[0][sourceX] - touches[1][sourceX];
            const dy = touches[0][sourceY] - touches[1][sourceY];
            return hypot(dx, dy);
          }
          function touchAngle(event, deltaSource) {
            const sourceX = deltaSource + "X";
            const sourceY = deltaSource + "Y";
            const touches = getTouchPair(event);
            const dx = touches[1][sourceX] - touches[0][sourceX];
            const dy = touches[1][sourceY] - touches[0][sourceY];
            const angle = 180 * Math.atan2(dy, dx) / Math.PI;
            return angle;
          }
          function getPointerType(pointer) {
            return is.string(pointer.pointerType) ? pointer.pointerType : is.number(pointer.pointerType) ? [void 0, void 0, "touch", "pen", "mouse"][pointer.pointerType] : /touch/.test(pointer.type) || pointer instanceof utils_domObjects.Touch ? "touch" : "mouse";
          }
          function getEventTargets(event) {
            const path = is.func(event.composedPath) ? event.composedPath() : event.path;
            return [getActualElement(path ? path[0] : event.target), getActualElement(event.currentTarget)];
          }
          function newCoords() {
            return {
              page: {
                x: 0,
                y: 0
              },
              client: {
                x: 0,
                y: 0
              },
              timeStamp: 0
            };
          }
          function coordsToEvent(coords) {
            const event = {
              coords,
              get page() {
                return this.coords.page;
              },
              get client() {
                return this.coords.client;
              },
              get timeStamp() {
                return this.coords.timeStamp;
              },
              get pageX() {
                return this.coords.page.x;
              },
              get pageY() {
                return this.coords.page.y;
              },
              get clientX() {
                return this.coords.client.x;
              },
              get clientY() {
                return this.coords.client.y;
              },
              get pointerId() {
                return this.coords.pointerId;
              },
              get target() {
                return this.coords.target;
              },
              get type() {
                return this.coords.type;
              },
              get pointerType() {
                return this.coords.pointerType;
              },
              get buttons() {
                return this.coords.buttons;
              },
              preventDefault() {
              }
            };
            return event;
          }
          function events_install(scope) {
            const targets = [];
            const delegatedEvents = {};
            const documents = [];
            const eventsMethods = {
              add,
              remove,
              addDelegate,
              removeDelegate,
              delegateListener,
              delegateUseCapture,
              delegatedEvents,
              documents,
              targets,
              supportsOptions: false,
              supportsPassive: false
            };
            scope.document.createElement("div").addEventListener("test", null, {
              get capture() {
                return eventsMethods.supportsOptions = true;
              },
              get passive() {
                return eventsMethods.supportsPassive = true;
              }
            });
            scope.events = eventsMethods;
            function add(eventTarget, type, listener, optionalArg) {
              const options = getOptions(optionalArg);
              let target = find(targets, (t) => t.eventTarget === eventTarget);
              if (!target) {
                target = {
                  eventTarget,
                  events: {}
                };
                targets.push(target);
              }
              if (!target.events[type]) {
                target.events[type] = [];
              }
              if (eventTarget.addEventListener && !contains(target.events[type], listener)) {
                eventTarget.addEventListener(type, listener, eventsMethods.supportsOptions ? options : options.capture);
                target.events[type].push(listener);
              }
            }
            function remove(eventTarget, type, listener, optionalArg) {
              const options = getOptions(optionalArg);
              const targetIndex = findIndex(targets, (t) => t.eventTarget === eventTarget);
              const target = targets[targetIndex];
              if (!target || !target.events) {
                return;
              }
              if (type === "all") {
                for (type in target.events) {
                  if (target.events.hasOwnProperty(type)) {
                    remove(eventTarget, type, "all");
                  }
                }
                return;
              }
              let typeIsEmpty = false;
              const typeListeners = target.events[type];
              if (typeListeners) {
                if (listener === "all") {
                  for (let i = typeListeners.length - 1; i >= 0; i--) {
                    remove(eventTarget, type, typeListeners[i], options);
                  }
                  return;
                } else {
                  for (let i = 0; i < typeListeners.length; i++) {
                    if (typeListeners[i] === listener) {
                      eventTarget.removeEventListener(type, listener, eventsMethods.supportsOptions ? options : options.capture);
                      typeListeners.splice(i, 1);
                      if (typeListeners.length === 0) {
                        delete target.events[type];
                        typeIsEmpty = true;
                      }
                      break;
                    }
                  }
                }
              }
              if (typeIsEmpty && !Object.keys(target.events).length) {
                targets.splice(targetIndex, 1);
              }
            }
            function addDelegate(selector, context, type, listener, optionalArg) {
              const options = getOptions(optionalArg);
              if (!delegatedEvents[type]) {
                delegatedEvents[type] = [];
                for (const doc of documents) {
                  add(doc, type, delegateListener);
                  add(doc, type, delegateUseCapture, true);
                }
              }
              const delegates = delegatedEvents[type];
              let delegate = find(delegates, (d) => d.selector === selector && d.context === context);
              if (!delegate) {
                delegate = {
                  selector,
                  context,
                  listeners: []
                };
                delegates.push(delegate);
              }
              delegate.listeners.push([listener, options]);
            }
            function removeDelegate(selector, context, type, listener, optionalArg) {
              const options = getOptions(optionalArg);
              const delegates = delegatedEvents[type];
              let matchFound = false;
              let index;
              if (!delegates) {
                return;
              }
              for (index = delegates.length - 1; index >= 0; index--) {
                const cur = delegates[index];
                if (cur.selector === selector && cur.context === context) {
                  const {
                    listeners
                  } = cur;
                  for (let i = listeners.length - 1; i >= 0; i--) {
                    const [fn, {
                      capture,
                      passive
                    }] = listeners[i];
                    if (fn === listener && capture === options.capture && passive === options.passive) {
                      listeners.splice(i, 1);
                      if (!listeners.length) {
                        delegates.splice(index, 1);
                        remove(context, type, delegateListener);
                        remove(context, type, delegateUseCapture, true);
                      }
                      matchFound = true;
                      break;
                    }
                  }
                  if (matchFound) {
                    break;
                  }
                }
              }
            }
            function delegateListener(event, optionalArg) {
              const options = getOptions(optionalArg);
              const fakeEvent = new events_FakeEvent(event);
              const delegates = delegatedEvents[event.type];
              const [eventTarget] = getEventTargets(event);
              let element = eventTarget;
              while (is.element(element)) {
                for (let i = 0; i < delegates.length; i++) {
                  const cur = delegates[i];
                  const {
                    selector,
                    context
                  } = cur;
                  if (matchesSelector(element, selector) && nodeContains(context, eventTarget) && nodeContains(context, element)) {
                    const {
                      listeners
                    } = cur;
                    fakeEvent.currentTarget = element;
                    for (const [fn, {
                      capture,
                      passive
                    }] of listeners) {
                      if (capture === options.capture && passive === options.passive) {
                        fn(fakeEvent);
                      }
                    }
                  }
                }
                element = parentNode(element);
              }
            }
            function delegateUseCapture(event) {
              return delegateListener.call(this, event, true);
            }
            return eventsMethods;
          }
          class events_FakeEvent {
            constructor(originalEvent) {
              this.currentTarget = void 0;
              this.originalEvent = void 0;
              this.type = void 0;
              this.originalEvent = originalEvent;
              utils_pointerExtend(this, originalEvent);
            }
            preventOriginalDefault() {
              this.originalEvent.preventDefault();
            }
            stopPropagation() {
              this.originalEvent.stopPropagation();
            }
            stopImmediatePropagation() {
              this.originalEvent.stopImmediatePropagation();
            }
          }
          function getOptions(param) {
            if (!is.object(param)) {
              return {
                capture: !!param,
                passive: false
              };
            }
            const options = extend2({}, param);
            options.capture = !!param.capture;
            options.passive = !!param.passive;
            return options;
          }
          var events = {
            id: "events",
            install: events_install
          };
          function warnOnce(method, message) {
            let warned = false;
            return function() {
              if (!warned) {
                win.console.warn(message);
                warned = true;
              }
              return method.apply(this, arguments);
            };
          }
          function copyAction(dest, src2) {
            dest.name = src2.name;
            dest.axis = src2.axis;
            dest.edges = src2.edges;
            return dest;
          }
          function createInteractStatic(scope) {
            const interact = (target, options) => {
              let interactable = scope.interactables.get(target, options);
              if (!interactable) {
                interactable = scope.interactables.new(target, options);
                interactable.events.global = interact.globalEvents;
              }
              return interactable;
            };
            interact.getPointerAverage = pointerAverage;
            interact.getTouchBBox = touchBBox;
            interact.getTouchDistance = touchDistance;
            interact.getTouchAngle = touchAngle;
            interact.getElementRect = getElementRect;
            interact.getElementClientRect = getElementClientRect;
            interact.matchesSelector = matchesSelector;
            interact.closest = domUtils_closest;
            interact.globalEvents = {};
            interact.version = "1.10.2";
            interact.scope = scope;
            interact.use = function(plugin, options) {
              this.scope.usePlugin(plugin, options);
              return this;
            };
            interact.isSet = function(target, options) {
              return !!this.scope.interactables.get(target, options && options.context);
            };
            interact.on = warnOnce(function on(type, listener, options) {
              if (is.string(type) && type.search(" ") !== -1) {
                type = type.trim().split(/ +/);
              }
              if (is.array(type)) {
                for (const eventType of type) {
                  this.on(eventType, listener, options);
                }
                return this;
              }
              if (is.object(type)) {
                for (const prop in type) {
                  this.on(prop, type[prop], listener);
                }
                return this;
              }
              if (isNonNativeEvent(type, this.scope.actions)) {
                if (!this.globalEvents[type]) {
                  this.globalEvents[type] = [listener];
                } else {
                  this.globalEvents[type].push(listener);
                }
              } else {
                this.scope.events.add(this.scope.document, type, listener, {
                  options
                });
              }
              return this;
            }, "The interact.on() method is being deprecated");
            interact.off = warnOnce(function off(type, listener, options) {
              if (is.string(type) && type.search(" ") !== -1) {
                type = type.trim().split(/ +/);
              }
              if (is.array(type)) {
                for (const eventType of type) {
                  this.off(eventType, listener, options);
                }
                return this;
              }
              if (is.object(type)) {
                for (const prop in type) {
                  this.off(prop, type[prop], listener);
                }
                return this;
              }
              if (isNonNativeEvent(type, this.scope.actions)) {
                let index;
                if (type in this.globalEvents && (index = this.globalEvents[type].indexOf(listener)) !== -1) {
                  this.globalEvents[type].splice(index, 1);
                }
              } else {
                this.scope.events.remove(this.scope.document, type, listener, options);
              }
              return this;
            }, "The interact.off() method is being deprecated");
            interact.debug = function() {
              return this.scope;
            };
            interact.supportsTouch = function() {
              return utils_browser.supportsTouch;
            };
            interact.supportsPointerEvent = function() {
              return utils_browser.supportsPointerEvent;
            };
            interact.stop = function() {
              for (const interaction of this.scope.interactions.list) {
                interaction.stop();
              }
              return this;
            };
            interact.pointerMoveTolerance = function(newValue) {
              if (is.number(newValue)) {
                this.scope.interactions.pointerMoveTolerance = newValue;
                return this;
              }
              return this.scope.interactions.pointerMoveTolerance;
            };
            interact.addDocument = function(doc, options) {
              this.scope.addDocument(doc, options);
            };
            interact.removeDocument = function(doc) {
              this.scope.removeDocument(doc);
            };
            return interact;
          }
          class PointerInfo {
            constructor(id, pointer, event, downTime, downTarget) {
              this.id = void 0;
              this.pointer = void 0;
              this.event = void 0;
              this.downTime = void 0;
              this.downTarget = void 0;
              this.id = id;
              this.pointer = pointer;
              this.event = event;
              this.downTime = downTime;
              this.downTarget = downTarget;
            }
          }
          let _ProxyValues;
          (function(_ProxyValues2) {
            _ProxyValues2["interactable"] = "";
            _ProxyValues2["element"] = "";
            _ProxyValues2["prepared"] = "";
            _ProxyValues2["pointerIsDown"] = "";
            _ProxyValues2["pointerWasMoved"] = "";
            _ProxyValues2["_proxy"] = "";
          })(_ProxyValues || (_ProxyValues = {}));
          let _ProxyMethods;
          (function(_ProxyMethods2) {
            _ProxyMethods2["start"] = "";
            _ProxyMethods2["move"] = "";
            _ProxyMethods2["end"] = "";
            _ProxyMethods2["stop"] = "";
            _ProxyMethods2["interacting"] = "";
          })(_ProxyMethods || (_ProxyMethods = {}));
          let idCounter = 0;
          class Interaction_Interaction {
            // current interactable being interacted with
            // the target element of the interactable
            // action that's ready to be fired on next move event
            // keep track of added pointers
            // pointerdown/mousedown/touchstart event
            // previous action event
            /** @internal */
            get pointerMoveTolerance() {
              return 1;
            }
            /**
             * @alias Interaction.prototype.move
             */
            /** */
            constructor({
              pointerType,
              scopeFire
            }) {
              this.interactable = null;
              this.element = null;
              this.rect = void 0;
              this._rects = void 0;
              this.edges = void 0;
              this._scopeFire = void 0;
              this.prepared = {
                name: null,
                axis: null,
                edges: null
              };
              this.pointerType = void 0;
              this.pointers = [];
              this.downEvent = null;
              this.downPointer = {};
              this._latestPointer = {
                pointer: null,
                event: null,
                eventTarget: null
              };
              this.prevEvent = null;
              this.pointerIsDown = false;
              this.pointerWasMoved = false;
              this._interacting = false;
              this._ending = false;
              this._stopped = true;
              this._proxy = null;
              this.simulation = null;
              this.doMove = warnOnce(function(signalArg) {
                this.move(signalArg);
              }, "The interaction.doMove() method has been renamed to interaction.move()");
              this.coords = {
                // Starting InteractEvent pointer coordinates
                start: newCoords(),
                // Previous native pointer move event coordinates
                prev: newCoords(),
                // current native pointer move event coordinates
                cur: newCoords(),
                // Change in coordinates and time of the pointer
                delta: newCoords(),
                // pointer velocity
                velocity: newCoords()
              };
              this._id = idCounter++;
              this._scopeFire = scopeFire;
              this.pointerType = pointerType;
              const that = this;
              this._proxy = {};
              for (const key in _ProxyValues) {
                Object.defineProperty(this._proxy, key, {
                  get() {
                    return that[key];
                  }
                });
              }
              for (const key in _ProxyMethods) {
                Object.defineProperty(this._proxy, key, {
                  value: (...args) => that[key](...args)
                });
              }
              this._scopeFire("interactions:new", {
                interaction: this
              });
            }
            pointerDown(pointer, event, eventTarget) {
              const pointerIndex = this.updatePointer(pointer, event, eventTarget, true);
              const pointerInfo = this.pointers[pointerIndex];
              this._scopeFire("interactions:down", {
                pointer,
                event,
                eventTarget,
                pointerIndex,
                pointerInfo,
                type: "down",
                interaction: this
              });
            }
            /**
             * ```js
             * interact(target)
             *   .draggable({
             *     // disable the default drag start by down->move
             *     manualStart: true
             *   })
             *   // start dragging after the user holds the pointer down
             *   .on('hold', function (event) {
             *     var interaction = event.interaction
             *
             *     if (!interaction.interacting()) {
             *       interaction.start({ name: 'drag' },
             *                         event.interactable,
             *                         event.currentTarget)
             *     }
             * })
             * ```
             *
             * Start an action with the given Interactable and Element as tartgets. The
             * action must be enabled for the target Interactable and an appropriate
             * number of pointers must be held down - 1 for drag/resize, 2 for gesture.
             *
             * Use it with `interactable.<action>able({ manualStart: false })` to always
             * [start actions manually](https://github.com/taye/interact.js/issues/114)
             *
             * @param {object} action   The action to be performed - drag, resize, etc.
             * @param {Interactable} target  The Interactable to target
             * @param {Element} element The DOM Element to target
             * @return {Boolean} Whether the interaction was successfully started
             */
            start(action, interactable, element) {
              if (this.interacting() || !this.pointerIsDown || this.pointers.length < (action.name === "gesture" ? 2 : 1) || !interactable.options[action.name].enabled) {
                return false;
              }
              copyAction(this.prepared, action);
              this.interactable = interactable;
              this.element = element;
              this.rect = interactable.getRect(element);
              this.edges = this.prepared.edges ? extend2({}, this.prepared.edges) : {
                left: true,
                right: true,
                top: true,
                bottom: true
              };
              this._stopped = false;
              this._interacting = this._doPhase({
                interaction: this,
                event: this.downEvent,
                phase: "start"
              }) && !this._stopped;
              return this._interacting;
            }
            pointerMove(pointer, event, eventTarget) {
              if (!this.simulation && !(this.modification && this.modification.endResult)) {
                this.updatePointer(pointer, event, eventTarget, false);
              }
              const duplicateMove = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
              let dx;
              let dy;
              if (this.pointerIsDown && !this.pointerWasMoved) {
                dx = this.coords.cur.client.x - this.coords.start.client.x;
                dy = this.coords.cur.client.y - this.coords.start.client.y;
                this.pointerWasMoved = hypot(dx, dy) > this.pointerMoveTolerance;
              }
              const pointerIndex = this.getPointerIndex(pointer);
              const signalArg = {
                pointer,
                pointerIndex,
                pointerInfo: this.pointers[pointerIndex],
                event,
                type: "move",
                eventTarget,
                dx,
                dy,
                duplicate: duplicateMove,
                interaction: this
              };
              if (!duplicateMove) {
                setCoordVelocity(this.coords.velocity, this.coords.delta);
              }
              this._scopeFire("interactions:move", signalArg);
              if (!duplicateMove && !this.simulation) {
                if (this.interacting()) {
                  signalArg.type = null;
                  this.move(signalArg);
                }
                if (this.pointerWasMoved) {
                  copyCoords(this.coords.prev, this.coords.cur);
                }
              }
            }
            /**
             * ```js
             * interact(target)
             *   .draggable(true)
             *   .on('dragmove', function (event) {
             *     if (someCondition) {
             *       // change the snap settings
             *       event.interactable.draggable({ snap: { targets: [] }})
             *       // fire another move event with re-calculated snap
             *       event.interaction.move()
             *     }
             *   })
             * ```
             *
             * Force a move of the current action at the same coordinates. Useful if
             * snap/restrict has been changed and you want a movement with the new
             * settings.
             */
            move(signalArg) {
              if (!signalArg || !signalArg.event) {
                setZeroCoords(this.coords.delta);
              }
              signalArg = extend2({
                pointer: this._latestPointer.pointer,
                event: this._latestPointer.event,
                eventTarget: this._latestPointer.eventTarget,
                interaction: this
              }, signalArg || {});
              signalArg.phase = "move";
              this._doPhase(signalArg);
            }
            // End interact move events and stop auto-scroll unless simulation is running
            pointerUp(pointer, event, eventTarget, curEventTarget) {
              let pointerIndex = this.getPointerIndex(pointer);
              if (pointerIndex === -1) {
                pointerIndex = this.updatePointer(pointer, event, eventTarget, false);
              }
              const type = /cancel$/i.test(event.type) ? "cancel" : "up";
              this._scopeFire(`interactions:${type}`, {
                pointer,
                pointerIndex,
                pointerInfo: this.pointers[pointerIndex],
                event,
                eventTarget,
                type,
                curEventTarget,
                interaction: this
              });
              if (!this.simulation) {
                this.end(event);
              }
              this.removePointer(pointer, event);
            }
            documentBlur(event) {
              this.end(event);
              this._scopeFire("interactions:blur", {
                event,
                type: "blur",
                interaction: this
              });
            }
            /**
             * ```js
             * interact(target)
             *   .draggable(true)
             *   .on('move', function (event) {
             *     if (event.pageX > 1000) {
             *       // end the current action
             *       event.interaction.end()
             *       // stop all further listeners from being called
             *       event.stopImmediatePropagation()
             *     }
             *   })
             * ```
             *
             * @param {PointerEvent} [event]
             */
            end(event) {
              this._ending = true;
              event = event || this._latestPointer.event;
              let endPhaseResult;
              if (this.interacting()) {
                endPhaseResult = this._doPhase({
                  event,
                  interaction: this,
                  phase: "end"
                });
              }
              this._ending = false;
              if (endPhaseResult === true) {
                this.stop();
              }
            }
            currentAction() {
              return this._interacting ? this.prepared.name : null;
            }
            interacting() {
              return this._interacting;
            }
            /** */
            stop() {
              this._scopeFire("interactions:stop", {
                interaction: this
              });
              this.interactable = this.element = null;
              this._interacting = false;
              this._stopped = true;
              this.prepared.name = this.prevEvent = null;
            }
            getPointerIndex(pointer) {
              const pointerId = getPointerId(pointer);
              return this.pointerType === "mouse" || this.pointerType === "pen" ? this.pointers.length - 1 : findIndex(this.pointers, (curPointer) => curPointer.id === pointerId);
            }
            getPointerInfo(pointer) {
              return this.pointers[this.getPointerIndex(pointer)];
            }
            updatePointer(pointer, event, eventTarget, down) {
              const id = getPointerId(pointer);
              let pointerIndex = this.getPointerIndex(pointer);
              let pointerInfo = this.pointers[pointerIndex];
              down = down === false ? false : down || /(down|start)$/i.test(event.type);
              if (!pointerInfo) {
                pointerInfo = new PointerInfo(id, pointer, event, null, null);
                pointerIndex = this.pointers.length;
                this.pointers.push(pointerInfo);
              } else {
                pointerInfo.pointer = pointer;
              }
              setCoords(this.coords.cur, this.pointers.map((p) => p.pointer), this._now());
              setCoordDeltas(this.coords.delta, this.coords.prev, this.coords.cur);
              if (down) {
                this.pointerIsDown = true;
                pointerInfo.downTime = this.coords.cur.timeStamp;
                pointerInfo.downTarget = eventTarget;
                utils_pointerExtend(this.downPointer, pointer);
                if (!this.interacting()) {
                  copyCoords(this.coords.start, this.coords.cur);
                  copyCoords(this.coords.prev, this.coords.cur);
                  this.downEvent = event;
                  this.pointerWasMoved = false;
                }
              }
              this._updateLatestPointer(pointer, event, eventTarget);
              this._scopeFire("interactions:update-pointer", {
                pointer,
                event,
                eventTarget,
                down,
                pointerInfo,
                pointerIndex,
                interaction: this
              });
              return pointerIndex;
            }
            removePointer(pointer, event) {
              const pointerIndex = this.getPointerIndex(pointer);
              if (pointerIndex === -1) {
                return;
              }
              const pointerInfo = this.pointers[pointerIndex];
              this._scopeFire("interactions:remove-pointer", {
                pointer,
                event,
                eventTarget: null,
                pointerIndex,
                pointerInfo,
                interaction: this
              });
              this.pointers.splice(pointerIndex, 1);
              this.pointerIsDown = false;
            }
            _updateLatestPointer(pointer, event, eventTarget) {
              this._latestPointer.pointer = pointer;
              this._latestPointer.event = event;
              this._latestPointer.eventTarget = eventTarget;
            }
            destroy() {
              this._latestPointer.pointer = null;
              this._latestPointer.event = null;
              this._latestPointer.eventTarget = null;
            }
            _createPreparedEvent(event, phase, preEnd, type) {
              return new InteractEvent_InteractEvent(this, event, this.prepared.name, phase, this.element, preEnd, type);
            }
            _fireEvent(iEvent) {
              this.interactable.fire(iEvent);
              if (!this.prevEvent || iEvent.timeStamp >= this.prevEvent.timeStamp) {
                this.prevEvent = iEvent;
              }
            }
            _doPhase(signalArg) {
              const {
                event,
                phase,
                preEnd,
                type
              } = signalArg;
              const {
                rect
              } = this;
              if (rect && phase === "move") {
                addEdges(this.edges, rect, this.coords.delta[this.interactable.options.deltaSource]);
                rect.width = rect.right - rect.left;
                rect.height = rect.bottom - rect.top;
              }
              const beforeResult = this._scopeFire(`interactions:before-action-${phase}`, signalArg);
              if (beforeResult === false) {
                return false;
              }
              const iEvent = signalArg.iEvent = this._createPreparedEvent(event, phase, preEnd, type);
              this._scopeFire(`interactions:action-${phase}`, signalArg);
              if (phase === "start") {
                this.prevEvent = iEvent;
              }
              this._fireEvent(iEvent);
              this._scopeFire(`interactions:after-action-${phase}`, signalArg);
              return true;
            }
            _now() {
              return Date.now();
            }
          }
          var core_Interaction = Interaction_Interaction;
          function preventDefault(newValue) {
            if (/^(always|never|auto)$/.test(newValue)) {
              this.options.preventDefault = newValue;
              return this;
            }
            if (is.bool(newValue)) {
              this.options.preventDefault = newValue ? "always" : "never";
              return this;
            }
            return this.options.preventDefault;
          }
          function checkAndPreventDefault(interactable, scope, event) {
            const setting = interactable.options.preventDefault;
            if (setting === "never") {
              return;
            }
            if (setting === "always") {
              event.preventDefault();
              return;
            }
            if (scope.events.supportsPassive && /^touch(start|move)$/.test(event.type)) {
              const doc = getWindow(event.target).document;
              const docOptions = scope.getDocOptions(doc);
              if (!(docOptions && docOptions.events) || docOptions.events.passive !== false) {
                return;
              }
            }
            if (/^(mouse|pointer|touch)*(down|start)/i.test(event.type)) {
              return;
            }
            if (is.element(event.target) && matchesSelector(event.target, "input,select,textarea,[contenteditable=true],[contenteditable=true] *")) {
              return;
            }
            event.preventDefault();
          }
          function onInteractionEvent({
            interaction,
            event
          }) {
            if (interaction.interactable) {
              interaction.interactable.checkAndPreventDefault(event);
            }
          }
          function interactablePreventDefault_install(scope) {
            const {
              Interactable
            } = scope;
            Interactable.prototype.preventDefault = preventDefault;
            Interactable.prototype.checkAndPreventDefault = function(event) {
              return checkAndPreventDefault(this, scope, event);
            };
            scope.interactions.docEvents.push({
              type: "dragstart",
              listener(event) {
                for (const interaction of scope.interactions.list) {
                  if (interaction.element && (interaction.element === event.target || nodeContains(interaction.element, event.target))) {
                    interaction.interactable.checkAndPreventDefault(event);
                    return;
                  }
                }
              }
            });
          }
          var interactablePreventDefault = {
            id: "core/interactablePreventDefault",
            install: interactablePreventDefault_install,
            listeners: ["down", "move", "up", "cancel"].reduce((acc, eventType) => {
              acc[`interactions:${eventType}`] = onInteractionEvent;
              return acc;
            }, {})
          };
          const finder = {
            methodOrder: ["simulationResume", "mouseOrPen", "hasPointer", "idle"],
            search(details) {
              for (const method of finder.methodOrder) {
                const interaction = finder[method](details);
                if (interaction) {
                  return interaction;
                }
              }
              return null;
            },
            // try to resume simulation with a new pointer
            simulationResume({
              pointerType,
              eventType,
              eventTarget,
              scope
            }) {
              if (!/down|start/i.test(eventType)) {
                return null;
              }
              for (const interaction of scope.interactions.list) {
                let element = eventTarget;
                if (interaction.simulation && interaction.simulation.allowResume && interaction.pointerType === pointerType) {
                  while (element) {
                    if (element === interaction.element) {
                      return interaction;
                    }
                    element = parentNode(element);
                  }
                }
              }
              return null;
            },
            // if it's a mouse or pen interaction
            mouseOrPen({
              pointerId,
              pointerType,
              eventType,
              scope
            }) {
              if (pointerType !== "mouse" && pointerType !== "pen") {
                return null;
              }
              let firstNonActive;
              for (const interaction of scope.interactions.list) {
                if (interaction.pointerType === pointerType) {
                  if (interaction.simulation && !hasPointerId(interaction, pointerId)) {
                    continue;
                  }
                  if (interaction.interacting()) {
                    return interaction;
                  } else if (!firstNonActive) {
                    firstNonActive = interaction;
                  }
                }
              }
              if (firstNonActive) {
                return firstNonActive;
              }
              for (const interaction of scope.interactions.list) {
                if (interaction.pointerType === pointerType && !(/down/i.test(eventType) && interaction.simulation)) {
                  return interaction;
                }
              }
              return null;
            },
            // get interaction that has this pointer
            hasPointer({
              pointerId,
              scope
            }) {
              for (const interaction of scope.interactions.list) {
                if (hasPointerId(interaction, pointerId)) {
                  return interaction;
                }
              }
              return null;
            },
            // get first idle interaction with a matching pointerType
            idle({
              pointerType,
              scope
            }) {
              for (const interaction of scope.interactions.list) {
                if (interaction.pointers.length === 1) {
                  const target = interaction.interactable;
                  if (target && !(target.options.gesture && target.options.gesture.enabled)) {
                    continue;
                  }
                } else if (interaction.pointers.length >= 2) {
                  continue;
                }
                if (!interaction.interacting() && pointerType === interaction.pointerType) {
                  return interaction;
                }
              }
              return null;
            }
          };
          function hasPointerId(interaction, pointerId) {
            return interaction.pointers.some(({
              id
            }) => id === pointerId);
          }
          var interactionFinder = finder;
          const methodNames = ["pointerDown", "pointerMove", "pointerUp", "updatePointer", "removePointer", "windowBlur"];
          function interactions_install(scope) {
            const listeners = {};
            for (const method of methodNames) {
              listeners[method] = doOnInteractions(method, scope);
            }
            const pEventTypes = utils_browser.pEventTypes;
            let docEvents;
            if (utils_domObjects.PointerEvent) {
              docEvents = [{
                type: pEventTypes.down,
                listener: releasePointersOnRemovedEls
              }, {
                type: pEventTypes.down,
                listener: listeners.pointerDown
              }, {
                type: pEventTypes.move,
                listener: listeners.pointerMove
              }, {
                type: pEventTypes.up,
                listener: listeners.pointerUp
              }, {
                type: pEventTypes.cancel,
                listener: listeners.pointerUp
              }];
            } else {
              docEvents = [{
                type: "mousedown",
                listener: listeners.pointerDown
              }, {
                type: "mousemove",
                listener: listeners.pointerMove
              }, {
                type: "mouseup",
                listener: listeners.pointerUp
              }, {
                type: "touchstart",
                listener: releasePointersOnRemovedEls
              }, {
                type: "touchstart",
                listener: listeners.pointerDown
              }, {
                type: "touchmove",
                listener: listeners.pointerMove
              }, {
                type: "touchend",
                listener: listeners.pointerUp
              }, {
                type: "touchcancel",
                listener: listeners.pointerUp
              }];
            }
            docEvents.push({
              type: "blur",
              listener(event) {
                for (const interaction of scope.interactions.list) {
                  interaction.documentBlur(event);
                }
              }
            });
            scope.prevTouchTime = 0;
            scope.Interaction = class extends core_Interaction {
              get pointerMoveTolerance() {
                return scope.interactions.pointerMoveTolerance;
              }
              set pointerMoveTolerance(value) {
                scope.interactions.pointerMoveTolerance = value;
              }
              _now() {
                return scope.now();
              }
            };
            scope.interactions = {
              // all active and idle interactions
              list: [],
              new(options) {
                options.scopeFire = (name, arg) => scope.fire(name, arg);
                const interaction = new scope.Interaction(options);
                scope.interactions.list.push(interaction);
                return interaction;
              },
              listeners,
              docEvents,
              pointerMoveTolerance: 1
            };
            function releasePointersOnRemovedEls() {
              for (const interaction of scope.interactions.list) {
                if (!interaction.pointerIsDown || interaction.pointerType !== "touch" || interaction._interacting) {
                  continue;
                }
                for (const pointer of interaction.pointers) {
                  if (!scope.documents.some(({
                    doc
                  }) => nodeContains(doc, pointer.downTarget))) {
                    interaction.removePointer(pointer.pointer, pointer.event);
                  }
                }
              }
            }
            scope.usePlugin(interactablePreventDefault);
          }
          function doOnInteractions(method, scope) {
            return function(event) {
              const interactions = scope.interactions.list;
              const pointerType = getPointerType(event);
              const [eventTarget, curEventTarget] = getEventTargets(event);
              const matches = [];
              if (/^touch/.test(event.type)) {
                scope.prevTouchTime = scope.now();
                for (const changedTouch of event.changedTouches) {
                  const pointer = changedTouch;
                  const pointerId = getPointerId(pointer);
                  const searchDetails = {
                    pointer,
                    pointerId,
                    pointerType,
                    eventType: event.type,
                    eventTarget,
                    curEventTarget,
                    scope
                  };
                  const interaction = getInteraction(searchDetails);
                  matches.push([searchDetails.pointer, searchDetails.eventTarget, searchDetails.curEventTarget, interaction]);
                }
              } else {
                let invalidPointer = false;
                if (!utils_browser.supportsPointerEvent && /mouse/.test(event.type)) {
                  for (let i = 0; i < interactions.length && !invalidPointer; i++) {
                    invalidPointer = interactions[i].pointerType !== "mouse" && interactions[i].pointerIsDown;
                  }
                  invalidPointer = invalidPointer || scope.now() - scope.prevTouchTime < 500 || // on iOS and Firefox Mobile, MouseEvent.timeStamp is zero if simulated
                  event.timeStamp === 0;
                }
                if (!invalidPointer) {
                  const searchDetails = {
                    pointer: event,
                    pointerId: getPointerId(event),
                    pointerType,
                    eventType: event.type,
                    curEventTarget,
                    eventTarget,
                    scope
                  };
                  const interaction = getInteraction(searchDetails);
                  matches.push([searchDetails.pointer, searchDetails.eventTarget, searchDetails.curEventTarget, interaction]);
                }
              }
              for (const [pointer, eventTarget2, curEventTarget2, interaction] of matches) {
                interaction[method](pointer, event, eventTarget2, curEventTarget2);
              }
            };
          }
          function getInteraction(searchDetails) {
            const {
              pointerType,
              scope
            } = searchDetails;
            const foundInteraction = interactionFinder.search(searchDetails);
            const signalArg = {
              interaction: foundInteraction,
              searchDetails
            };
            scope.fire("interactions:find", signalArg);
            return signalArg.interaction || scope.interactions.new({
              pointerType
            });
          }
          function onDocSignal({
            doc,
            scope,
            options
          }, eventMethodName) {
            const {
              interactions: {
                docEvents
              },
              events: events2
            } = scope;
            const eventMethod = events2[eventMethodName];
            if (scope.browser.isIOS && !options.events) {
              options.events = {
                passive: false
              };
            }
            for (const eventType in events2.delegatedEvents) {
              eventMethod(doc, eventType, events2.delegateListener);
              eventMethod(doc, eventType, events2.delegateUseCapture, true);
            }
            const eventOptions = options && options.events;
            for (const {
              type,
              listener
            } of docEvents) {
              eventMethod(doc, type, listener, eventOptions);
            }
          }
          const interactions_interactions = {
            id: "core/interactions",
            install: interactions_install,
            listeners: {
              "scope:add-document": (arg) => onDocSignal(arg, "add"),
              "scope:remove-document": (arg) => onDocSignal(arg, "remove"),
              "interactable:unset": ({
                interactable
              }, scope) => {
                for (let i = scope.interactions.list.length - 1; i >= 0; i--) {
                  const interaction = scope.interactions.list[i];
                  if (interaction.interactable !== interactable) {
                    continue;
                  }
                  interaction.stop();
                  scope.fire("interactions:destroy", {
                    interaction
                  });
                  interaction.destroy();
                  if (scope.interactions.list.length > 2) {
                    scope.interactions.list.splice(i, 1);
                  }
                }
              }
            },
            onDocSignal,
            doOnInteractions,
            methodNames
          };
          var core_interactions = interactions_interactions;
          class scope_Scope {
            // main window
            // main document
            // main window
            // all documents being listened to
            constructor() {
              this.id = `__interact_scope_${Math.floor(Math.random() * 100)}`;
              this.isInitialized = false;
              this.listenerMaps = [];
              this.browser = utils_browser;
              this.defaults = clone(defaultOptions_defaults);
              this.Eventable = Eventable_Eventable;
              this.actions = {
                map: {},
                phases: {
                  start: true,
                  move: true,
                  end: true
                },
                methodDict: {},
                phaselessTypes: {}
              };
              this.interactStatic = createInteractStatic(this);
              this.InteractEvent = InteractEvent_InteractEvent;
              this.Interactable = void 0;
              this.interactables = new InteractableSet_InteractableSet(this);
              this._win = void 0;
              this.document = void 0;
              this.window = void 0;
              this.documents = [];
              this._plugins = {
                list: [],
                map: {}
              };
              this.onWindowUnload = (event) => this.removeDocument(event.target);
              const scope = this;
              this.Interactable = class extends Interactable_Interactable {
                get _defaults() {
                  return scope.defaults;
                }
                set(options) {
                  super.set(options);
                  scope.fire("interactable:set", {
                    options,
                    interactable: this
                  });
                  return this;
                }
                unset() {
                  super.unset();
                  scope.interactables.list.splice(scope.interactables.list.indexOf(this), 1);
                  scope.fire("interactable:unset", {
                    interactable: this
                  });
                }
              };
            }
            addListeners(map, id) {
              this.listenerMaps.push({
                id,
                map
              });
            }
            fire(name, arg) {
              for (const {
                map: {
                  [name]: listener
                }
              } of this.listenerMaps) {
                if (!!listener && listener(arg, this, name) === false) {
                  return false;
                }
              }
            }
            init(window2) {
              return this.isInitialized ? this : initScope(this, window2);
            }
            pluginIsInstalled(plugin) {
              return this._plugins.map[plugin.id] || this._plugins.list.indexOf(plugin) !== -1;
            }
            usePlugin(plugin, options) {
              if (!this.isInitialized) {
                return this;
              }
              if (this.pluginIsInstalled(plugin)) {
                return this;
              }
              if (plugin.id) {
                this._plugins.map[plugin.id] = plugin;
              }
              this._plugins.list.push(plugin);
              if (plugin.install) {
                plugin.install(this, options);
              }
              if (plugin.listeners && plugin.before) {
                let index = 0;
                const len = this.listenerMaps.length;
                const before = plugin.before.reduce((acc, id) => {
                  acc[id] = true;
                  acc[pluginIdRoot(id)] = true;
                  return acc;
                }, {});
                for (; index < len; index++) {
                  const otherId = this.listenerMaps[index].id;
                  if (before[otherId] || before[pluginIdRoot(otherId)]) {
                    break;
                  }
                }
                this.listenerMaps.splice(index, 0, {
                  id: plugin.id,
                  map: plugin.listeners
                });
              } else if (plugin.listeners) {
                this.listenerMaps.push({
                  id: plugin.id,
                  map: plugin.listeners
                });
              }
              return this;
            }
            addDocument(doc, options) {
              if (this.getDocIndex(doc) !== -1) {
                return false;
              }
              const window2 = getWindow(doc);
              options = options ? extend2({}, options) : {};
              this.documents.push({
                doc,
                options
              });
              this.events.documents.push(doc);
              if (doc !== this.document) {
                this.events.add(window2, "unload", this.onWindowUnload);
              }
              this.fire("scope:add-document", {
                doc,
                window: window2,
                scope: this,
                options
              });
            }
            removeDocument(doc) {
              const index = this.getDocIndex(doc);
              const window2 = getWindow(doc);
              const options = this.documents[index].options;
              this.events.remove(window2, "unload", this.onWindowUnload);
              this.documents.splice(index, 1);
              this.events.documents.splice(index, 1);
              this.fire("scope:remove-document", {
                doc,
                window: window2,
                scope: this,
                options
              });
            }
            getDocIndex(doc) {
              for (let i = 0; i < this.documents.length; i++) {
                if (this.documents[i].doc === doc) {
                  return i;
                }
              }
              return -1;
            }
            getDocOptions(doc) {
              const docIndex = this.getDocIndex(doc);
              return docIndex === -1 ? null : this.documents[docIndex].options;
            }
            now() {
              return (this.window.Date || Date).now();
            }
          }
          function initScope(scope, window2) {
            scope.isInitialized = true;
            window_init(window2);
            utils_domObjects.init(window2);
            utils_browser.init(window2);
            raf.init(window2);
            scope.window = window2;
            scope.document = window2.document;
            scope.usePlugin(core_interactions);
            scope.usePlugin(events);
            return scope;
          }
          function pluginIdRoot(id) {
            return id && id.replace(/\/.*$/, "");
          }
          const interact_scope = new scope_Scope();
          const interact_interact = interact_scope.interactStatic;
          var _interactjs_interact = interact_interact;
          const interact_init = (win2) => interact_scope.init(win2);
          if (typeof window === "object" && !!window) {
            interact_init(window);
          }
          function InteractableMethods_install(scope) {
            const {
              /** @lends Interactable */
              Interactable
              // tslint:disable-line no-shadowed-variable
            } = scope;
            Interactable.prototype.getAction = function getAction(pointer, event, interaction, element) {
              const action = defaultActionChecker(this, event, interaction, element, scope);
              if (this.options.actionChecker) {
                return this.options.actionChecker(pointer, event, action, this, element, interaction);
              }
              return action;
            };
            Interactable.prototype.ignoreFrom = warnOnce(function(newValue) {
              return this._backCompatOption("ignoreFrom", newValue);
            }, "Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue}).");
            Interactable.prototype.allowFrom = warnOnce(function(newValue) {
              return this._backCompatOption("allowFrom", newValue);
            }, "Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue}).");
            Interactable.prototype.actionChecker = actionChecker;
            Interactable.prototype.styleCursor = styleCursor;
          }
          function defaultActionChecker(interactable, event, interaction, element, scope) {
            const rect = interactable.getRect(element);
            const buttons = event.buttons || {
              0: 1,
              1: 4,
              3: 8,
              4: 16
            }[event.button];
            const arg = {
              action: null,
              interactable,
              interaction,
              element,
              rect,
              buttons
            };
            scope.fire("auto-start:check", arg);
            return arg.action;
          }
          function styleCursor(newValue) {
            if (is.bool(newValue)) {
              this.options.styleCursor = newValue;
              return this;
            }
            if (newValue === null) {
              delete this.options.styleCursor;
              return this;
            }
            return this.options.styleCursor;
          }
          function actionChecker(checker) {
            if (is.func(checker)) {
              this.options.actionChecker = checker;
              return this;
            }
            if (checker === null) {
              delete this.options.actionChecker;
              return this;
            }
            return this.options.actionChecker;
          }
          var InteractableMethods = {
            id: "auto-start/interactableMethods",
            install: InteractableMethods_install
          };
          function base_install(scope) {
            const {
              interactStatic: interact,
              defaults
            } = scope;
            scope.usePlugin(InteractableMethods);
            defaults.base.actionChecker = null;
            defaults.base.styleCursor = true;
            extend2(defaults.perAction, {
              manualStart: false,
              max: Infinity,
              maxPerElement: 1,
              allowFrom: null,
              ignoreFrom: null,
              // only allow left button by default
              // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons#Return_value
              mouseButtons: 1
            });
            interact.maxInteractions = (newValue) => maxInteractions(newValue, scope);
            scope.autoStart = {
              // Allow this many interactions to happen simultaneously
              maxInteractions: Infinity,
              withinInteractionLimit,
              cursorElement: null
            };
          }
          function prepareOnDown({
            interaction,
            pointer,
            event,
            eventTarget
          }, scope) {
            if (interaction.interacting()) {
              return;
            }
            const actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
            prepare(interaction, actionInfo, scope);
          }
          function prepareOnMove({
            interaction,
            pointer,
            event,
            eventTarget
          }, scope) {
            if (interaction.pointerType !== "mouse" || interaction.pointerIsDown || interaction.interacting()) {
              return;
            }
            const actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
            prepare(interaction, actionInfo, scope);
          }
          function startOnMove(arg, scope) {
            const {
              interaction
            } = arg;
            if (!interaction.pointerIsDown || interaction.interacting() || !interaction.pointerWasMoved || !interaction.prepared.name) {
              return;
            }
            scope.fire("autoStart:before-start", arg);
            const {
              interactable
            } = interaction;
            const actionName = interaction.prepared.name;
            if (actionName && interactable) {
              if (interactable.options[actionName].manualStart || !withinInteractionLimit(interactable, interaction.element, interaction.prepared, scope)) {
                interaction.stop();
              } else {
                interaction.start(interaction.prepared, interactable, interaction.element);
                setInteractionCursor(interaction, scope);
              }
            }
          }
          function clearCursorOnStop({
            interaction
          }, scope) {
            const {
              interactable
            } = interaction;
            if (interactable && interactable.options.styleCursor) {
              setCursor(interaction.element, "", scope);
            }
          }
          function validateAction(action, interactable, element, eventTarget, scope) {
            if (interactable.testIgnoreAllow(interactable.options[action.name], element, eventTarget) && interactable.options[action.name].enabled && withinInteractionLimit(interactable, element, action, scope)) {
              return action;
            }
            return null;
          }
          function validateMatches(interaction, pointer, event, matches, matchElements, eventTarget, scope) {
            for (let i = 0, len = matches.length; i < len; i++) {
              const match = matches[i];
              const matchElement = matchElements[i];
              const matchAction = match.getAction(pointer, event, interaction, matchElement);
              if (!matchAction) {
                continue;
              }
              const action = validateAction(matchAction, match, matchElement, eventTarget, scope);
              if (action) {
                return {
                  action,
                  interactable: match,
                  element: matchElement
                };
              }
            }
            return {
              action: null,
              interactable: null,
              element: null
            };
          }
          function getActionInfo(interaction, pointer, event, eventTarget, scope) {
            let matches = [];
            let matchElements = [];
            let element = eventTarget;
            function pushMatches(interactable) {
              matches.push(interactable);
              matchElements.push(element);
            }
            while (is.element(element)) {
              matches = [];
              matchElements = [];
              scope.interactables.forEachMatch(element, pushMatches);
              const actionInfo = validateMatches(interaction, pointer, event, matches, matchElements, eventTarget, scope);
              if (actionInfo.action && !actionInfo.interactable.options[actionInfo.action.name].manualStart) {
                return actionInfo;
              }
              element = parentNode(element);
            }
            return {
              action: null,
              interactable: null,
              element: null
            };
          }
          function prepare(interaction, {
            action,
            interactable,
            element
          }, scope) {
            action = action || {
              name: null
            };
            interaction.interactable = interactable;
            interaction.element = element;
            copyAction(interaction.prepared, action);
            interaction.rect = interactable && action.name ? interactable.getRect(element) : null;
            setInteractionCursor(interaction, scope);
            scope.fire("autoStart:prepared", {
              interaction
            });
          }
          function withinInteractionLimit(interactable, element, action, scope) {
            const options = interactable.options;
            const maxActions = options[action.name].max;
            const maxPerElement = options[action.name].maxPerElement;
            const autoStartMax = scope.autoStart.maxInteractions;
            let activeInteractions = 0;
            let interactableCount = 0;
            let elementCount = 0;
            if (!(maxActions && maxPerElement && autoStartMax)) {
              return false;
            }
            for (const interaction of scope.interactions.list) {
              const otherAction = interaction.prepared.name;
              if (!interaction.interacting()) {
                continue;
              }
              activeInteractions++;
              if (activeInteractions >= autoStartMax) {
                return false;
              }
              if (interaction.interactable !== interactable) {
                continue;
              }
              interactableCount += otherAction === action.name ? 1 : 0;
              if (interactableCount >= maxActions) {
                return false;
              }
              if (interaction.element === element) {
                elementCount++;
                if (otherAction === action.name && elementCount >= maxPerElement) {
                  return false;
                }
              }
            }
            return autoStartMax > 0;
          }
          function maxInteractions(newValue, scope) {
            if (is.number(newValue)) {
              scope.autoStart.maxInteractions = newValue;
              return this;
            }
            return scope.autoStart.maxInteractions;
          }
          function setCursor(element, cursor, scope) {
            const {
              cursorElement: prevCursorElement
            } = scope.autoStart;
            if (prevCursorElement && prevCursorElement !== element) {
              prevCursorElement.style.cursor = "";
            }
            element.ownerDocument.documentElement.style.cursor = cursor;
            element.style.cursor = cursor;
            scope.autoStart.cursorElement = cursor ? element : null;
          }
          function setInteractionCursor(interaction, scope) {
            const {
              interactable,
              element,
              prepared
            } = interaction;
            if (!(interaction.pointerType === "mouse" && interactable && interactable.options.styleCursor)) {
              if (scope.autoStart.cursorElement) {
                setCursor(scope.autoStart.cursorElement, "", scope);
              }
              return;
            }
            let cursor = "";
            if (prepared.name) {
              const cursorChecker = interactable.options[prepared.name].cursorChecker;
              if (is.func(cursorChecker)) {
                cursor = cursorChecker(prepared, interactable, element, interaction._interacting);
              } else {
                cursor = scope.actions.map[prepared.name].getCursor(prepared);
              }
            }
            setCursor(interaction.element, cursor || "", scope);
          }
          const autoStart = {
            id: "auto-start/base",
            before: ["actions"],
            install: base_install,
            listeners: {
              "interactions:down": prepareOnDown,
              "interactions:move": (arg, scope) => {
                prepareOnMove(arg, scope);
                startOnMove(arg, scope);
              },
              "interactions:stop": clearCursorOnStop
            },
            maxInteractions,
            withinInteractionLimit,
            validateAction
          };
          var base = autoStart;
          function beforeStart({
            interaction,
            eventTarget,
            dx,
            dy
          }, scope) {
            if (interaction.prepared.name !== "drag") {
              return;
            }
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);
            const targetOptions = interaction.interactable.options.drag;
            const startAxis = targetOptions.startAxis;
            const currentAxis = absX > absY ? "x" : absX < absY ? "y" : "xy";
            interaction.prepared.axis = targetOptions.lockAxis === "start" ? currentAxis[0] : targetOptions.lockAxis;
            if (currentAxis !== "xy" && startAxis !== "xy" && startAxis !== currentAxis) {
              interaction.prepared.name = null;
              let element = eventTarget;
              const getDraggable = function(interactable) {
                if (interactable === interaction.interactable) {
                  return;
                }
                const options = interaction.interactable.options.drag;
                if (!options.manualStart && interactable.testIgnoreAllow(options, element, eventTarget)) {
                  const action = interactable.getAction(interaction.downPointer, interaction.downEvent, interaction, element);
                  if (action && action.name === "drag" && checkStartAxis(currentAxis, interactable) && base.validateAction(action, interactable, element, eventTarget, scope)) {
                    return interactable;
                  }
                }
              };
              while (is.element(element)) {
                const interactable = scope.interactables.forEachMatch(element, getDraggable);
                if (interactable) {
                  interaction.prepared.name = "drag";
                  interaction.interactable = interactable;
                  interaction.element = element;
                  break;
                }
                element = parentNode(element);
              }
            }
          }
          function checkStartAxis(startAxis, interactable) {
            if (!interactable) {
              return false;
            }
            const thisAxis = interactable.options.drag.startAxis;
            return startAxis === "xy" || thisAxis === "xy" || thisAxis === startAxis;
          }
          var dragAxis = {
            id: "auto-start/dragAxis",
            listeners: {
              "autoStart:before-start": beforeStart
            }
          };
          function hold_install(scope) {
            const {
              defaults
            } = scope;
            scope.usePlugin(base);
            defaults.perAction.hold = 0;
            defaults.perAction.delay = 0;
          }
          function getHoldDuration(interaction) {
            const actionName = interaction.prepared && interaction.prepared.name;
            if (!actionName) {
              return null;
            }
            const options = interaction.interactable.options;
            return options[actionName].hold || options[actionName].delay;
          }
          const hold = {
            id: "auto-start/hold",
            install: hold_install,
            listeners: {
              "interactions:new": ({
                interaction
              }) => {
                interaction.autoStartHoldTimer = null;
              },
              "autoStart:prepared": ({
                interaction
              }) => {
                const hold2 = getHoldDuration(interaction);
                if (hold2 > 0) {
                  interaction.autoStartHoldTimer = setTimeout(() => {
                    interaction.start(interaction.prepared, interaction.interactable, interaction.element);
                  }, hold2);
                }
              },
              "interactions:move": ({
                interaction,
                duplicate
              }) => {
                if (interaction.autoStartHoldTimer && interaction.pointerWasMoved && !duplicate) {
                  clearTimeout(interaction.autoStartHoldTimer);
                  interaction.autoStartHoldTimer = null;
                }
              },
              // prevent regular down->move autoStart
              "autoStart:before-start": ({
                interaction
              }) => {
                const holdDuration = getHoldDuration(interaction);
                if (holdDuration > 0) {
                  interaction.prepared.name = null;
                }
              }
            },
            getHoldDuration
          };
          var auto_start_hold = hold;
          var auto_start_plugin = {
            id: "auto-start",
            install(scope) {
              scope.usePlugin(base);
              scope.usePlugin(auto_start_hold);
              scope.usePlugin(dragAxis);
            }
          };
          if (typeof window === "object" && !!window) {
            interact_init(window);
          }
          _interactjs_interact.use(auto_start_plugin);
          function plugin_install(scope) {
            const {
              actions,
              Interactable,
              defaults
            } = scope;
            Interactable.prototype.draggable = drag.draggable;
            actions.map.drag = drag;
            actions.methodDict.drag = "draggable";
            defaults.actions.drag = drag.defaults;
          }
          function beforeMove({
            interaction
          }) {
            if (interaction.prepared.name !== "drag") {
              return;
            }
            const axis = interaction.prepared.axis;
            if (axis === "x") {
              interaction.coords.cur.page.y = interaction.coords.start.page.y;
              interaction.coords.cur.client.y = interaction.coords.start.client.y;
              interaction.coords.velocity.client.y = 0;
              interaction.coords.velocity.page.y = 0;
            } else if (axis === "y") {
              interaction.coords.cur.page.x = interaction.coords.start.page.x;
              interaction.coords.cur.client.x = interaction.coords.start.client.x;
              interaction.coords.velocity.client.x = 0;
              interaction.coords.velocity.page.x = 0;
            }
          }
          function move({
            iEvent,
            interaction
          }) {
            if (interaction.prepared.name !== "drag") {
              return;
            }
            const axis = interaction.prepared.axis;
            if (axis === "x" || axis === "y") {
              const opposite = axis === "x" ? "y" : "x";
              iEvent.page[opposite] = interaction.coords.start.page[opposite];
              iEvent.client[opposite] = interaction.coords.start.client[opposite];
              iEvent.delta[opposite] = 0;
            }
          }
          const plugin_draggable = function draggable(options) {
            if (is.object(options)) {
              this.options.drag.enabled = options.enabled !== false;
              this.setPerAction("drag", options);
              this.setOnEvents("drag", options);
              if (/^(xy|x|y|start)$/.test(options.lockAxis)) {
                this.options.drag.lockAxis = options.lockAxis;
              }
              if (/^(xy|x|y)$/.test(options.startAxis)) {
                this.options.drag.startAxis = options.startAxis;
              }
              return this;
            }
            if (is.bool(options)) {
              this.options.drag.enabled = options;
              return this;
            }
            return this.options.drag;
          };
          const drag = {
            id: "actions/drag",
            install: plugin_install,
            listeners: {
              "interactions:before-action-move": beforeMove,
              "interactions:action-resume": beforeMove,
              // dragmove
              "interactions:action-move": move,
              "auto-start:check": (arg) => {
                const {
                  interaction,
                  interactable,
                  buttons
                } = arg;
                const dragOptions = interactable.options.drag;
                if (!(dragOptions && dragOptions.enabled) || // check mouseButton setting if the pointer is down
                interaction.pointerIsDown && /mouse|pointer/.test(interaction.pointerType) && (buttons & interactable.options.drag.mouseButtons) === 0) {
                  return void 0;
                }
                arg.action = {
                  name: "drag",
                  axis: dragOptions.lockAxis === "start" ? dragOptions.startAxis : dragOptions.lockAxis
                };
                return false;
              }
            },
            draggable: plugin_draggable,
            beforeMove,
            move,
            defaults: {
              startAxis: "xy",
              lockAxis: "xy"
            },
            getCursor() {
              return "move";
            }
          };
          var drag_plugin = drag;
          if (typeof window === "object" && !!window) {
            interact_init(window);
          }
          _interactjs_interact.use(drag_plugin);
          function resize_plugin_install(scope) {
            const {
              actions,
              browser: browser2,
              /** @lends Interactable */
              Interactable,
              // tslint:disable-line no-shadowed-variable
              defaults
            } = scope;
            resize.cursors = initCursors(browser2);
            resize.defaultMargin = browser2.supportsTouch || browser2.supportsPointerEvent ? 20 : 10;
            Interactable.prototype.resizable = function(options) {
              return resizable(this, options, scope);
            };
            actions.map.resize = resize;
            actions.methodDict.resize = "resizable";
            defaults.actions.resize = resize.defaults;
          }
          function resizeChecker(arg) {
            const {
              interaction,
              interactable,
              element,
              rect,
              buttons
            } = arg;
            if (!rect) {
              return void 0;
            }
            const page = extend2({}, interaction.coords.cur.page);
            const resizeOptions = interactable.options.resize;
            if (!(resizeOptions && resizeOptions.enabled) || // check mouseButton setting if the pointer is down
            interaction.pointerIsDown && /mouse|pointer/.test(interaction.pointerType) && (buttons & resizeOptions.mouseButtons) === 0) {
              return void 0;
            }
            if (is.object(resizeOptions.edges)) {
              const resizeEdges = {
                left: false,
                right: false,
                top: false,
                bottom: false
              };
              for (const edge in resizeEdges) {
                resizeEdges[edge] = checkResizeEdge(edge, resizeOptions.edges[edge], page, interaction._latestPointer.eventTarget, element, rect, resizeOptions.margin || resize.defaultMargin);
              }
              resizeEdges.left = resizeEdges.left && !resizeEdges.right;
              resizeEdges.top = resizeEdges.top && !resizeEdges.bottom;
              if (resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom) {
                arg.action = {
                  name: "resize",
                  edges: resizeEdges
                };
              }
            } else {
              const right = resizeOptions.axis !== "y" && page.x > rect.right - resize.defaultMargin;
              const bottom2 = resizeOptions.axis !== "x" && page.y > rect.bottom - resize.defaultMargin;
              if (right || bottom2) {
                arg.action = {
                  name: "resize",
                  axes: (right ? "x" : "") + (bottom2 ? "y" : "")
                };
              }
            }
            return arg.action ? false : void 0;
          }
          function resizable(interactable, options, scope) {
            if (is.object(options)) {
              interactable.options.resize.enabled = options.enabled !== false;
              interactable.setPerAction("resize", options);
              interactable.setOnEvents("resize", options);
              if (is.string(options.axis) && /^x$|^y$|^xy$/.test(options.axis)) {
                interactable.options.resize.axis = options.axis;
              } else if (options.axis === null) {
                interactable.options.resize.axis = scope.defaults.actions.resize.axis;
              }
              if (is.bool(options.preserveAspectRatio)) {
                interactable.options.resize.preserveAspectRatio = options.preserveAspectRatio;
              } else if (is.bool(options.square)) {
                interactable.options.resize.square = options.square;
              }
              return interactable;
            }
            if (is.bool(options)) {
              interactable.options.resize.enabled = options;
              return interactable;
            }
            return interactable.options.resize;
          }
          function checkResizeEdge(name, value, page, element, interactableElement, rect, margin) {
            if (!value) {
              return false;
            }
            if (value === true) {
              const width = is.number(rect.width) ? rect.width : rect.right - rect.left;
              const height = is.number(rect.height) ? rect.height : rect.bottom - rect.top;
              margin = Math.min(margin, Math.abs((name === "left" || name === "right" ? width : height) / 2));
              if (width < 0) {
                if (name === "left") {
                  name = "right";
                } else if (name === "right") {
                  name = "left";
                }
              }
              if (height < 0) {
                if (name === "top") {
                  name = "bottom";
                } else if (name === "bottom") {
                  name = "top";
                }
              }
              if (name === "left") {
                return page.x < (width >= 0 ? rect.left : rect.right) + margin;
              }
              if (name === "top") {
                return page.y < (height >= 0 ? rect.top : rect.bottom) + margin;
              }
              if (name === "right") {
                return page.x > (width >= 0 ? rect.right : rect.left) - margin;
              }
              if (name === "bottom") {
                return page.y > (height >= 0 ? rect.bottom : rect.top) - margin;
              }
            }
            if (!is.element(element)) {
              return false;
            }
            return is.element(value) ? value === element : matchesUpTo(element, value, interactableElement);
          }
          function initCursors(browser2) {
            return browser2.isIe9 ? {
              x: "e-resize",
              y: "s-resize",
              xy: "se-resize",
              top: "n-resize",
              left: "w-resize",
              bottom: "s-resize",
              right: "e-resize",
              topleft: "se-resize",
              bottomright: "se-resize",
              topright: "ne-resize",
              bottomleft: "ne-resize"
            } : {
              x: "ew-resize",
              y: "ns-resize",
              xy: "nwse-resize",
              top: "ns-resize",
              left: "ew-resize",
              bottom: "ns-resize",
              right: "ew-resize",
              topleft: "nwse-resize",
              bottomright: "nwse-resize",
              topright: "nesw-resize",
              bottomleft: "nesw-resize"
            };
          }
          function start({
            iEvent,
            interaction
          }) {
            if (interaction.prepared.name !== "resize" || !interaction.prepared.edges) {
              return;
            }
            const resizeEvent = iEvent;
            const rect = interaction.rect;
            interaction._rects = {
              start: extend2({}, rect),
              corrected: extend2({}, rect),
              previous: extend2({}, rect),
              delta: {
                left: 0,
                right: 0,
                width: 0,
                top: 0,
                bottom: 0,
                height: 0
              }
            };
            resizeEvent.edges = interaction.prepared.edges;
            resizeEvent.rect = interaction._rects.corrected;
            resizeEvent.deltaRect = interaction._rects.delta;
          }
          function plugin_move({
            iEvent,
            interaction
          }) {
            if (interaction.prepared.name !== "resize" || !interaction.prepared.edges) {
              return;
            }
            const resizeEvent = iEvent;
            const resizeOptions = interaction.interactable.options.resize;
            const invert = resizeOptions.invert;
            const invertible = invert === "reposition" || invert === "negate";
            const current = interaction.rect;
            const {
              start: startRect,
              corrected,
              delta: deltaRect,
              previous
            } = interaction._rects;
            extend2(previous, corrected);
            if (invertible) {
              extend2(corrected, current);
              if (invert === "reposition") {
                if (corrected.top > corrected.bottom) {
                  const swap = corrected.top;
                  corrected.top = corrected.bottom;
                  corrected.bottom = swap;
                }
                if (corrected.left > corrected.right) {
                  const swap = corrected.left;
                  corrected.left = corrected.right;
                  corrected.right = swap;
                }
              }
            } else {
              corrected.top = Math.min(current.top, startRect.bottom);
              corrected.bottom = Math.max(current.bottom, startRect.top);
              corrected.left = Math.min(current.left, startRect.right);
              corrected.right = Math.max(current.right, startRect.left);
            }
            corrected.width = corrected.right - corrected.left;
            corrected.height = corrected.bottom - corrected.top;
            for (const edge in corrected) {
              deltaRect[edge] = corrected[edge] - previous[edge];
            }
            resizeEvent.edges = interaction.prepared.edges;
            resizeEvent.rect = corrected;
            resizeEvent.deltaRect = deltaRect;
          }
          function end({
            iEvent,
            interaction
          }) {
            if (interaction.prepared.name !== "resize" || !interaction.prepared.edges) {
              return;
            }
            const resizeEvent = iEvent;
            resizeEvent.edges = interaction.prepared.edges;
            resizeEvent.rect = interaction._rects.corrected;
            resizeEvent.deltaRect = interaction._rects.delta;
          }
          function updateEventAxes({
            iEvent,
            interaction
          }) {
            if (interaction.prepared.name !== "resize" || !interaction.resizeAxes) {
              return;
            }
            const options = interaction.interactable.options;
            const resizeEvent = iEvent;
            if (options.resize.square) {
              if (interaction.resizeAxes === "y") {
                resizeEvent.delta.x = resizeEvent.delta.y;
              } else {
                resizeEvent.delta.y = resizeEvent.delta.x;
              }
              resizeEvent.axes = "xy";
            } else {
              resizeEvent.axes = interaction.resizeAxes;
              if (interaction.resizeAxes === "x") {
                resizeEvent.delta.y = 0;
              } else if (interaction.resizeAxes === "y") {
                resizeEvent.delta.x = 0;
              }
            }
          }
          const resize = {
            id: "actions/resize",
            before: ["actions/drag"],
            install: resize_plugin_install,
            listeners: {
              "interactions:new": ({
                interaction
              }) => {
                interaction.resizeAxes = "xy";
              },
              "interactions:action-start": (arg) => {
                start(arg);
                updateEventAxes(arg);
              },
              "interactions:action-move": (arg) => {
                plugin_move(arg);
                updateEventAxes(arg);
              },
              "interactions:action-end": end,
              "auto-start:check": resizeChecker
            },
            defaults: {
              square: false,
              preserveAspectRatio: false,
              axis: "xy",
              // use default margin
              margin: NaN,
              // object with props left, right, top, bottom which are
              // true/false values to resize when the pointer is over that edge,
              // CSS selectors to match the handles for each direction
              // or the Elements for each handle
              edges: null,
              // a value of 'none' will limit the resize rect to a minimum of 0x0
              // 'negate' will alow the rect to have negative width/height
              // 'reposition' will keep the width/height positive by swapping
              // the top and bottom edges and/or swapping the left and right edges
              invert: "none"
            },
            cursors: null,
            getCursor({
              edges,
              axis,
              name
            }) {
              const cursors = resize.cursors;
              let result = null;
              if (axis) {
                result = cursors[name + axis];
              } else if (edges) {
                let cursorKey = "";
                for (const edge of ["top", "bottom", "left", "right"]) {
                  if (edges[edge]) {
                    cursorKey += edge;
                  }
                }
                result = cursors[cursorKey];
              }
              return result;
            },
            defaultMargin: null
          };
          var resize_plugin = resize;
          if (typeof window === "object" && !!window) {
            interact_init(window);
          }
          _interactjs_interact.use(resize_plugin);
          var edgeTarget = () => {
          };
          var snappers_elements = () => {
          };
          var grid = (grid2) => {
            const coordFields = [["x", "y"], ["left", "top"], ["right", "bottom"], ["width", "height"]].filter(([xField, yField]) => xField in grid2 || yField in grid2);
            const gridFunc = (x, y) => {
              const {
                range,
                limits = {
                  left: -Infinity,
                  right: Infinity,
                  top: -Infinity,
                  bottom: Infinity
                },
                offset = {
                  x: 0,
                  y: 0
                }
              } = grid2;
              const result = {
                range,
                grid: grid2,
                x: null,
                y: null
              };
              for (const [xField, yField] of coordFields) {
                const gridx = Math.round((x - offset.x) / grid2[xField]);
                const gridy = Math.round((y - offset.y) / grid2[yField]);
                result[xField] = Math.max(limits.left, Math.min(limits.right, gridx * grid2[xField] + offset.x));
                result[yField] = Math.max(limits.top, Math.min(limits.bottom, gridy * grid2[yField] + offset.y));
              }
              return result;
            };
            gridFunc.grid = grid2;
            gridFunc.coordFields = coordFields;
            return gridFunc;
          };
          const snappersPlugin = {
            id: "snappers",
            install(scope) {
              const {
                interactStatic: interact
              } = scope;
              interact.snappers = extend2(interact.snappers || {}, all_namespaceObject);
              interact.createSnapGrid = interact.snappers.grid;
            }
          };
          var snappers_plugin = snappersPlugin;
          class Modification_Modification {
            constructor(interaction) {
              this.states = [];
              this.startOffset = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              };
              this.startDelta = null;
              this.result = null;
              this.endResult = null;
              this.edges = void 0;
              this.interaction = void 0;
              this.interaction = interaction;
              this.result = createResult();
            }
            start({
              phase
            }, pageCoords) {
              const {
                interaction
              } = this;
              const modifierList = getModifierList(interaction);
              this.prepareStates(modifierList);
              this.edges = extend2({}, interaction.edges);
              this.startOffset = getRectOffset(interaction.rect, pageCoords);
              this.startDelta = {
                x: 0,
                y: 0
              };
              const arg = {
                phase,
                pageCoords,
                preEnd: false
              };
              this.result = createResult();
              this.startAll(arg);
              const result = this.result = this.setAll(arg);
              return result;
            }
            fillArg(arg) {
              const {
                interaction
              } = this;
              arg.interaction = interaction;
              arg.interactable = interaction.interactable;
              arg.element = interaction.element;
              arg.rect = arg.rect || interaction.rect;
              arg.edges = this.edges;
              arg.startOffset = this.startOffset;
            }
            startAll(arg) {
              this.fillArg(arg);
              for (const state of this.states) {
                if (state.methods.start) {
                  arg.state = state;
                  state.methods.start(arg);
                }
              }
            }
            setAll(arg) {
              this.fillArg(arg);
              const {
                phase,
                preEnd,
                skipModifiers,
                rect: unmodifiedRect
              } = arg;
              arg.coords = extend2({}, arg.pageCoords);
              arg.rect = extend2({}, unmodifiedRect);
              const states = skipModifiers ? this.states.slice(skipModifiers) : this.states;
              const newResult = createResult(arg.coords, arg.rect);
              for (const state of states) {
                const {
                  options
                } = state;
                const lastModifierCoords = extend2({}, arg.coords);
                let returnValue = null;
                if (state.methods.set && this.shouldDo(options, preEnd, phase)) {
                  arg.state = state;
                  returnValue = state.methods.set(arg);
                  addEdges(this.interaction.edges, arg.rect, {
                    x: arg.coords.x - lastModifierCoords.x,
                    y: arg.coords.y - lastModifierCoords.y
                  });
                }
                newResult.eventProps.push(returnValue);
              }
              newResult.delta.x = arg.coords.x - arg.pageCoords.x;
              newResult.delta.y = arg.coords.y - arg.pageCoords.y;
              newResult.rectDelta.left = arg.rect.left - unmodifiedRect.left;
              newResult.rectDelta.right = arg.rect.right - unmodifiedRect.right;
              newResult.rectDelta.top = arg.rect.top - unmodifiedRect.top;
              newResult.rectDelta.bottom = arg.rect.bottom - unmodifiedRect.bottom;
              const prevCoords = this.result.coords;
              const prevRect = this.result.rect;
              if (prevCoords && prevRect) {
                const rectChanged = newResult.rect.left !== prevRect.left || newResult.rect.right !== prevRect.right || newResult.rect.top !== prevRect.top || newResult.rect.bottom !== prevRect.bottom;
                newResult.changed = rectChanged || prevCoords.x !== newResult.coords.x || prevCoords.y !== newResult.coords.y;
              }
              return newResult;
            }
            applyToInteraction(arg) {
              const {
                interaction
              } = this;
              const {
                phase
              } = arg;
              const curCoords = interaction.coords.cur;
              const startCoords = interaction.coords.start;
              const {
                result,
                startDelta
              } = this;
              const curDelta = result.delta;
              if (phase === "start") {
                extend2(this.startDelta, result.delta);
              }
              for (const [coordsSet, delta] of [[startCoords, startDelta], [curCoords, curDelta]]) {
                coordsSet.page.x += delta.x;
                coordsSet.page.y += delta.y;
                coordsSet.client.x += delta.x;
                coordsSet.client.y += delta.y;
              }
              const {
                rectDelta
              } = this.result;
              const rect = arg.rect || interaction.rect;
              rect.left += rectDelta.left;
              rect.right += rectDelta.right;
              rect.top += rectDelta.top;
              rect.bottom += rectDelta.bottom;
              rect.width = rect.right - rect.left;
              rect.height = rect.bottom - rect.top;
            }
            setAndApply(arg) {
              const {
                interaction
              } = this;
              const {
                phase,
                preEnd,
                skipModifiers
              } = arg;
              const result = this.setAll({
                preEnd,
                phase,
                pageCoords: arg.modifiedCoords || interaction.coords.cur.page
              });
              this.result = result;
              if (!result.changed && (!skipModifiers || skipModifiers < this.states.length) && interaction.interacting()) {
                return false;
              }
              if (arg.modifiedCoords) {
                const {
                  page
                } = interaction.coords.cur;
                const adjustment = {
                  x: arg.modifiedCoords.x - page.x,
                  y: arg.modifiedCoords.y - page.y
                };
                result.coords.x += adjustment.x;
                result.coords.y += adjustment.y;
                result.delta.x += adjustment.x;
                result.delta.y += adjustment.y;
              }
              this.applyToInteraction(arg);
            }
            beforeEnd(arg) {
              const {
                interaction,
                event
              } = arg;
              const states = this.states;
              if (!states || !states.length) {
                return;
              }
              let doPreend = false;
              for (const state of states) {
                arg.state = state;
                const {
                  options,
                  methods
                } = state;
                const endPosition = methods.beforeEnd && methods.beforeEnd(arg);
                if (endPosition) {
                  this.endResult = endPosition;
                  return false;
                }
                doPreend = doPreend || !doPreend && this.shouldDo(options, true, arg.phase, true);
              }
              if (doPreend) {
                interaction.move({
                  event,
                  preEnd: true
                });
              }
            }
            stop(arg) {
              const {
                interaction
              } = arg;
              if (!this.states || !this.states.length) {
                return;
              }
              const modifierArg = extend2({
                states: this.states,
                interactable: interaction.interactable,
                element: interaction.element,
                rect: null
              }, arg);
              this.fillArg(modifierArg);
              for (const state of this.states) {
                modifierArg.state = state;
                if (state.methods.stop) {
                  state.methods.stop(modifierArg);
                }
              }
              this.states = null;
              this.endResult = null;
            }
            prepareStates(modifierList) {
              this.states = [];
              for (let index = 0; index < modifierList.length; index++) {
                const {
                  options,
                  methods,
                  name
                } = modifierList[index];
                this.states.push({
                  options,
                  methods,
                  index,
                  name
                });
              }
              return this.states;
            }
            restoreInteractionCoords({
              interaction: {
                coords,
                rect,
                modification
              }
            }) {
              if (!modification.result) {
                return;
              }
              const {
                startDelta
              } = modification;
              const {
                delta: curDelta,
                rectDelta
              } = modification.result;
              const coordsAndDeltas = [[coords.start, startDelta], [coords.cur, curDelta]];
              for (const [coordsSet, delta] of coordsAndDeltas) {
                coordsSet.page.x -= delta.x;
                coordsSet.page.y -= delta.y;
                coordsSet.client.x -= delta.x;
                coordsSet.client.y -= delta.y;
              }
              rect.left -= rectDelta.left;
              rect.right -= rectDelta.right;
              rect.top -= rectDelta.top;
              rect.bottom -= rectDelta.bottom;
            }
            shouldDo(options, preEnd, phase, requireEndOnly) {
              if (
                // ignore disabled modifiers
                !options || options.enabled === false || // check if we require endOnly option to fire move before end
                requireEndOnly && !options.endOnly || // don't apply endOnly modifiers when not ending
                options.endOnly && !preEnd || // check if modifier should run be applied on start
                phase === "start" && !options.setStart
              ) {
                return false;
              }
              return true;
            }
            copyFrom(other) {
              this.startOffset = other.startOffset;
              this.startDelta = other.startDelta;
              this.edges = other.edges;
              this.states = other.states.map((s) => clone(s));
              this.result = createResult(extend2({}, other.result.coords), extend2({}, other.result.rect));
            }
            destroy() {
              for (const prop in this) {
                this[prop] = null;
              }
            }
          }
          function createResult(coords, rect) {
            return {
              rect,
              coords,
              delta: {
                x: 0,
                y: 0
              },
              rectDelta: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              },
              eventProps: [],
              changed: true
            };
          }
          function getModifierList(interaction) {
            const actionOptions = interaction.interactable.options[interaction.prepared.name];
            const actionModifiers = actionOptions.modifiers;
            if (actionModifiers && actionModifiers.length) {
              return actionModifiers;
            }
            return ["snap", "snapSize", "snapEdges", "restrict", "restrictEdges", "restrictSize"].map((type) => {
              const options = actionOptions[type];
              return options && options.enabled && {
                options,
                methods: options._methods
              };
            }).filter((m) => !!m);
          }
          function getRectOffset(rect, coords) {
            return rect ? {
              left: coords.x - rect.left,
              top: coords.y - rect.top,
              right: rect.right - coords.x,
              bottom: rect.bottom - coords.y
            } : {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            };
          }
          function makeModifier(module3, name) {
            const {
              defaults
            } = module3;
            const methods = {
              start: module3.start,
              set: module3.set,
              beforeEnd: module3.beforeEnd,
              stop: module3.stop
            };
            const modifier = (_options) => {
              const options = _options || {};
              options.enabled = options.enabled !== false;
              for (const prop in defaults) {
                if (!(prop in options)) {
                  options[prop] = defaults[prop];
                }
              }
              const m = {
                options,
                methods,
                name,
                enable: () => {
                  options.enabled = true;
                  return m;
                },
                disable: () => {
                  options.enabled = false;
                  return m;
                }
              };
              return m;
            };
            if (name && typeof name === "string") {
              modifier._defaults = defaults;
              modifier._methods = methods;
            }
            return modifier;
          }
          function addEventModifiers({
            iEvent,
            interaction: {
              modification: {
                result
              }
            }
          }) {
            if (result) {
              iEvent.modifiers = result.eventProps;
            }
          }
          const modifiersBase = {
            id: "modifiers/base",
            before: ["actions"],
            install: (scope) => {
              scope.defaults.perAction.modifiers = [];
            },
            listeners: {
              "interactions:new": ({
                interaction
              }) => {
                interaction.modification = new Modification_Modification(interaction);
              },
              "interactions:before-action-start": (arg) => {
                const {
                  modification
                } = arg.interaction;
                modification.start(arg, arg.interaction.coords.start.page);
                arg.interaction.edges = modification.edges;
                modification.applyToInteraction(arg);
              },
              "interactions:before-action-move": (arg) => arg.interaction.modification.setAndApply(arg),
              "interactions:before-action-end": (arg) => arg.interaction.modification.beforeEnd(arg),
              "interactions:action-start": addEventModifiers,
              "interactions:action-move": addEventModifiers,
              "interactions:action-end": addEventModifiers,
              "interactions:after-action-start": (arg) => arg.interaction.modification.restoreInteractionCoords(arg),
              "interactions:after-action-move": (arg) => arg.interaction.modification.restoreInteractionCoords(arg),
              "interactions:stop": (arg) => arg.interaction.modification.stop(arg)
            }
          };
          var modifiers_base = modifiersBase;
          const aspectRatio = {
            start(arg) {
              const {
                state,
                rect,
                edges: originalEdges,
                pageCoords: coords
              } = arg;
              let {
                ratio
              } = state.options;
              const {
                equalDelta,
                modifiers
              } = state.options;
              if (ratio === "preserve") {
                ratio = rect.width / rect.height;
              }
              state.startCoords = extend2({}, coords);
              state.startRect = extend2({}, rect);
              state.ratio = ratio;
              state.equalDelta = equalDelta;
              const linkedEdges = state.linkedEdges = {
                top: originalEdges.top || originalEdges.left && !originalEdges.bottom,
                left: originalEdges.left || originalEdges.top && !originalEdges.right,
                bottom: originalEdges.bottom || originalEdges.right && !originalEdges.top,
                right: originalEdges.right || originalEdges.bottom && !originalEdges.left
              };
              state.xIsPrimaryAxis = !!(originalEdges.left || originalEdges.right);
              if (state.equalDelta) {
                state.edgeSign = (linkedEdges.left ? 1 : -1) * (linkedEdges.top ? 1 : -1);
              } else {
                const negativeSecondaryEdge = state.xIsPrimaryAxis ? linkedEdges.top : linkedEdges.left;
                state.edgeSign = negativeSecondaryEdge ? -1 : 1;
              }
              extend2(arg.edges, linkedEdges);
              if (!modifiers || !modifiers.length) {
                return;
              }
              const subModification = new Modification_Modification(arg.interaction);
              subModification.copyFrom(arg.interaction.modification);
              subModification.prepareStates(modifiers);
              state.subModification = subModification;
              subModification.startAll({
                ...arg
              });
            },
            set(arg) {
              const {
                state,
                rect,
                coords
              } = arg;
              const initialCoords = extend2({}, coords);
              const aspectMethod = state.equalDelta ? setEqualDelta : setRatio;
              aspectMethod(state, state.xIsPrimaryAxis, coords, rect);
              if (!state.subModification) {
                return null;
              }
              const correctedRect = extend2({}, rect);
              addEdges(state.linkedEdges, correctedRect, {
                x: coords.x - initialCoords.x,
                y: coords.y - initialCoords.y
              });
              const result = state.subModification.setAll({
                ...arg,
                rect: correctedRect,
                edges: state.linkedEdges,
                pageCoords: coords,
                prevCoords: coords,
                prevRect: correctedRect
              });
              const {
                delta
              } = result;
              if (result.changed) {
                const xIsCriticalAxis = Math.abs(delta.x) > Math.abs(delta.y);
                aspectMethod(state, xIsCriticalAxis, result.coords, result.rect);
                extend2(coords, result.coords);
              }
              return result.eventProps;
            },
            defaults: {
              ratio: "preserve",
              equalDelta: false,
              modifiers: [],
              enabled: false
            }
          };
          function setEqualDelta({
            startCoords,
            edgeSign
          }, xIsPrimaryAxis, coords) {
            if (xIsPrimaryAxis) {
              coords.y = startCoords.y + (coords.x - startCoords.x) * edgeSign;
            } else {
              coords.x = startCoords.x + (coords.y - startCoords.y) * edgeSign;
            }
          }
          function setRatio({
            startRect,
            startCoords,
            ratio,
            edgeSign
          }, xIsPrimaryAxis, coords, rect) {
            if (xIsPrimaryAxis) {
              const newHeight = rect.width / ratio;
              coords.y = startCoords.y + (newHeight - startRect.height) * edgeSign;
            } else {
              const newWidth = rect.height * ratio;
              coords.x = startCoords.x + (newWidth - startRect.width) * edgeSign;
            }
          }
          var modifiers_aspectRatio = makeModifier(aspectRatio, "aspectRatio");
          const noop = () => {
          };
          noop._defaults = {};
          var modifiers_noop = noop;
          function pointer_start({
            rect,
            startOffset,
            state,
            interaction,
            pageCoords
          }) {
            const {
              options
            } = state;
            const {
              elementRect
            } = options;
            const offset = extend2({
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            }, options.offset || {});
            if (rect && elementRect) {
              const restriction = getRestrictionRect(options.restriction, interaction, pageCoords);
              if (restriction) {
                const widthDiff = restriction.right - restriction.left - rect.width;
                const heightDiff = restriction.bottom - restriction.top - rect.height;
                if (widthDiff < 0) {
                  offset.left += widthDiff;
                  offset.right += widthDiff;
                }
                if (heightDiff < 0) {
                  offset.top += heightDiff;
                  offset.bottom += heightDiff;
                }
              }
              offset.left += startOffset.left - rect.width * elementRect.left;
              offset.top += startOffset.top - rect.height * elementRect.top;
              offset.right += startOffset.right - rect.width * (1 - elementRect.right);
              offset.bottom += startOffset.bottom - rect.height * (1 - elementRect.bottom);
            }
            state.offset = offset;
          }
          function set({
            coords,
            interaction,
            state
          }) {
            const {
              options,
              offset
            } = state;
            const restriction = getRestrictionRect(options.restriction, interaction, coords);
            if (!restriction) {
              return;
            }
            const rect = xywhToTlbr(restriction);
            coords.x = Math.max(Math.min(rect.right - offset.right, coords.x), rect.left + offset.left);
            coords.y = Math.max(Math.min(rect.bottom - offset.bottom, coords.y), rect.top + offset.top);
          }
          function getRestrictionRect(value, interaction, coords) {
            if (is.func(value)) {
              return resolveRectLike(value, interaction.interactable, interaction.element, [coords.x, coords.y, interaction]);
            } else {
              return resolveRectLike(value, interaction.interactable, interaction.element);
            }
          }
          const pointer_defaults = {
            restriction: null,
            elementRect: null,
            offset: null,
            endOnly: false,
            enabled: false
          };
          const restrict = {
            start: pointer_start,
            set,
            defaults: pointer_defaults
          };
          var restrict_pointer = makeModifier(restrict, "restrict");
          const noInner = {
            top: Infinity,
            left: Infinity,
            bottom: -Infinity,
            right: -Infinity
          };
          const noOuter = {
            top: -Infinity,
            left: -Infinity,
            bottom: Infinity,
            right: Infinity
          };
          function edges_start({
            interaction,
            startOffset,
            state
          }) {
            const {
              options
            } = state;
            let offset;
            if (options) {
              const offsetRect = getRestrictionRect(options.offset, interaction, interaction.coords.start.page);
              offset = rectToXY(offsetRect);
            }
            offset = offset || {
              x: 0,
              y: 0
            };
            state.offset = {
              top: offset.y + startOffset.top,
              left: offset.x + startOffset.left,
              bottom: offset.y - startOffset.bottom,
              right: offset.x - startOffset.right
            };
          }
          function edges_set({
            coords,
            edges,
            interaction,
            state
          }) {
            const {
              offset,
              options
            } = state;
            if (!edges) {
              return;
            }
            const page = extend2({}, coords);
            const inner = getRestrictionRect(options.inner, interaction, page) || {};
            const outer = getRestrictionRect(options.outer, interaction, page) || {};
            fixRect(inner, noInner);
            fixRect(outer, noOuter);
            if (edges.top) {
              coords.y = Math.min(Math.max(outer.top + offset.top, page.y), inner.top + offset.top);
            } else if (edges.bottom) {
              coords.y = Math.max(Math.min(outer.bottom + offset.bottom, page.y), inner.bottom + offset.bottom);
            }
            if (edges.left) {
              coords.x = Math.min(Math.max(outer.left + offset.left, page.x), inner.left + offset.left);
            } else if (edges.right) {
              coords.x = Math.max(Math.min(outer.right + offset.right, page.x), inner.right + offset.right);
            }
          }
          function fixRect(rect, defaults) {
            for (const edge of ["top", "left", "bottom", "right"]) {
              if (!(edge in rect)) {
                rect[edge] = defaults[edge];
              }
            }
            return rect;
          }
          const edges_defaults = {
            inner: null,
            outer: null,
            offset: null,
            endOnly: false,
            enabled: false
          };
          const restrictEdges = {
            noInner,
            noOuter,
            start: edges_start,
            set: edges_set,
            defaults: edges_defaults
          };
          var restrict_edges = makeModifier(restrictEdges, "restrictEdges");
          const rect_defaults = extend2({
            get elementRect() {
              return {
                top: 0,
                left: 0,
                bottom: 1,
                right: 1
              };
            },
            set elementRect(_) {
            }
          }, restrict.defaults);
          const restrictRect = {
            start: restrict.start,
            set: restrict.set,
            defaults: rect_defaults
          };
          var restrict_rect = makeModifier(restrictRect, "restrictRect");
          const noMin = {
            width: -Infinity,
            height: -Infinity
          };
          const noMax = {
            width: Infinity,
            height: Infinity
          };
          function size_start(arg) {
            return restrictEdges.start(arg);
          }
          function size_set(arg) {
            const {
              interaction,
              state,
              rect,
              edges
            } = arg;
            const {
              options
            } = state;
            if (!edges) {
              return;
            }
            const minSize = tlbrToXywh(getRestrictionRect(options.min, interaction, arg.coords)) || noMin;
            const maxSize = tlbrToXywh(getRestrictionRect(options.max, interaction, arg.coords)) || noMax;
            state.options = {
              endOnly: options.endOnly,
              inner: extend2({}, restrictEdges.noInner),
              outer: extend2({}, restrictEdges.noOuter)
            };
            if (edges.top) {
              state.options.inner.top = rect.bottom - minSize.height;
              state.options.outer.top = rect.bottom - maxSize.height;
            } else if (edges.bottom) {
              state.options.inner.bottom = rect.top + minSize.height;
              state.options.outer.bottom = rect.top + maxSize.height;
            }
            if (edges.left) {
              state.options.inner.left = rect.right - minSize.width;
              state.options.outer.left = rect.right - maxSize.width;
            } else if (edges.right) {
              state.options.inner.right = rect.left + minSize.width;
              state.options.outer.right = rect.left + maxSize.width;
            }
            restrictEdges.set(arg);
            state.options = options;
          }
          const size_defaults = {
            min: null,
            max: null,
            endOnly: false,
            enabled: false
          };
          const restrictSize = {
            start: size_start,
            set: size_set,
            defaults: size_defaults
          };
          var size = makeModifier(restrictSize, "restrictSize");
          function snap_pointer_start(arg) {
            const {
              interaction,
              interactable,
              element,
              rect,
              state,
              startOffset
            } = arg;
            const {
              options
            } = state;
            const origin = options.offsetWithOrigin ? getOrigin(arg) : {
              x: 0,
              y: 0
            };
            let snapOffset;
            if (options.offset === "startCoords") {
              snapOffset = {
                x: interaction.coords.start.page.x,
                y: interaction.coords.start.page.y
              };
            } else {
              const offsetRect = resolveRectLike(options.offset, interactable, element, [interaction]);
              snapOffset = rectToXY(offsetRect) || {
                x: 0,
                y: 0
              };
              snapOffset.x += origin.x;
              snapOffset.y += origin.y;
            }
            const {
              relativePoints
            } = options;
            state.offsets = rect && relativePoints && relativePoints.length ? relativePoints.map((relativePoint, index) => ({
              index,
              relativePoint,
              x: startOffset.left - rect.width * relativePoint.x + snapOffset.x,
              y: startOffset.top - rect.height * relativePoint.y + snapOffset.y
            })) : [extend2({
              index: 0,
              relativePoint: null
            }, snapOffset)];
          }
          function pointer_set(arg) {
            const {
              interaction,
              coords,
              state
            } = arg;
            const {
              options,
              offsets
            } = state;
            const origin = getOriginXY(interaction.interactable, interaction.element, interaction.prepared.name);
            const page = extend2({}, coords);
            const targets = [];
            if (!options.offsetWithOrigin) {
              page.x -= origin.x;
              page.y -= origin.y;
            }
            for (const offset of offsets) {
              const relativeX = page.x - offset.x;
              const relativeY = page.y - offset.y;
              for (let index = 0, len = options.targets.length; index < len; index++) {
                const snapTarget = options.targets[index];
                let target;
                if (is.func(snapTarget)) {
                  target = snapTarget(relativeX, relativeY, interaction._proxy, offset, index);
                } else {
                  target = snapTarget;
                }
                if (!target) {
                  continue;
                }
                targets.push({
                  x: (is.number(target.x) ? target.x : relativeX) + offset.x,
                  y: (is.number(target.y) ? target.y : relativeY) + offset.y,
                  range: is.number(target.range) ? target.range : options.range,
                  source: snapTarget,
                  index,
                  offset
                });
              }
            }
            const closest = {
              target: null,
              inRange: false,
              distance: 0,
              range: 0,
              delta: {
                x: 0,
                y: 0
              }
            };
            for (const target of targets) {
              const range = target.range;
              const dx = target.x - page.x;
              const dy = target.y - page.y;
              const distance = hypot(dx, dy);
              let inRange = distance <= range;
              if (range === Infinity && closest.inRange && closest.range !== Infinity) {
                inRange = false;
              }
              if (!closest.target || (inRange ? closest.inRange && range !== Infinity ? distance / range < closest.distance / closest.range : range === Infinity && closest.range !== Infinity || // OR this target is closer that the previous closest
              distance < closest.distance : (
                // The other is not in range and the pointer is closer to this target
                !closest.inRange && distance < closest.distance
              ))) {
                closest.target = target;
                closest.distance = distance;
                closest.range = range;
                closest.inRange = inRange;
                closest.delta.x = dx;
                closest.delta.y = dy;
              }
            }
            if (closest.inRange) {
              coords.x = closest.target.x;
              coords.y = closest.target.y;
            }
            state.closest = closest;
            return closest;
          }
          function getOrigin(arg) {
            const {
              element
            } = arg.interaction;
            const optionsOrigin = rectToXY(resolveRectLike(arg.state.options.origin, null, null, [element]));
            const origin = optionsOrigin || getOriginXY(arg.interactable, element, arg.interaction.prepared.name);
            return origin;
          }
          const snap_pointer_defaults = {
            range: Infinity,
            targets: null,
            offset: null,
            offsetWithOrigin: true,
            origin: null,
            relativePoints: null,
            endOnly: false,
            enabled: false
          };
          const snap = {
            start: snap_pointer_start,
            set: pointer_set,
            defaults: snap_pointer_defaults
          };
          var snap_pointer = makeModifier(snap, "snap");
          function snap_size_start(arg) {
            const {
              state,
              edges
            } = arg;
            const {
              options
            } = state;
            if (!edges) {
              return null;
            }
            arg.state = {
              options: {
                targets: null,
                relativePoints: [{
                  x: edges.left ? 0 : 1,
                  y: edges.top ? 0 : 1
                }],
                offset: options.offset || "self",
                origin: {
                  x: 0,
                  y: 0
                },
                range: options.range
              }
            };
            state.targetFields = state.targetFields || [["width", "height"], ["x", "y"]];
            snap.start(arg);
            state.offsets = arg.state.offsets;
            arg.state = state;
          }
          function snap_size_set(arg) {
            const {
              interaction,
              state,
              coords
            } = arg;
            const {
              options,
              offsets
            } = state;
            const relative = {
              x: coords.x - offsets[0].x,
              y: coords.y - offsets[0].y
            };
            state.options = extend2({}, options);
            state.options.targets = [];
            for (const snapTarget of options.targets || []) {
              let target;
              if (is.func(snapTarget)) {
                target = snapTarget(relative.x, relative.y, interaction);
              } else {
                target = snapTarget;
              }
              if (!target) {
                continue;
              }
              for (const [xField, yField] of state.targetFields) {
                if (xField in target || yField in target) {
                  target.x = target[xField];
                  target.y = target[yField];
                  break;
                }
              }
              state.options.targets.push(target);
            }
            const returnValue = snap.set(arg);
            state.options = options;
            return returnValue;
          }
          const snap_size_defaults = {
            range: Infinity,
            targets: null,
            offset: null,
            endOnly: false,
            enabled: false
          };
          const snapSize = {
            start: snap_size_start,
            set: snap_size_set,
            defaults: snap_size_defaults
          };
          var snap_size = makeModifier(snapSize, "snapSize");
          function snap_edges_start(arg) {
            const {
              edges
            } = arg;
            if (!edges) {
              return null;
            }
            arg.state.targetFields = arg.state.targetFields || [[edges.left ? "left" : "right", edges.top ? "top" : "bottom"]];
            return snapSize.start(arg);
          }
          const snapEdges = {
            start: snap_edges_start,
            set: snapSize.set,
            defaults: extend2(clone(snapSize.defaults), {
              targets: null,
              range: null,
              offset: {
                x: 0,
                y: 0
              }
            })
          };
          var snap_edges = makeModifier(snapEdges, "snapEdges");
          var modifiers_all = {
            aspectRatio: modifiers_aspectRatio,
            restrictEdges: restrict_edges,
            restrict: restrict_pointer,
            restrictRect: restrict_rect,
            restrictSize: size,
            snapEdges: snap_edges,
            snap: snap_pointer,
            snapSize: snap_size,
            spring: modifiers_noop,
            avoid: modifiers_noop,
            transform: modifiers_noop,
            rubberband: modifiers_noop
          };
          const plugin_modifiers = {
            id: "modifiers",
            install(scope) {
              const {
                interactStatic: interact
              } = scope;
              scope.usePlugin(modifiers_base);
              scope.usePlugin(snappers_plugin);
              interact.modifiers = modifiers_all;
              for (const type in modifiers_all) {
                const {
                  _defaults,
                  _methods
                } = modifiers_all[type];
                _defaults._methods = _methods;
                scope.defaults.perAction[type] = _defaults;
              }
            }
          };
          var modifiers_plugin = plugin_modifiers;
          if (typeof window === "object" && !!window) {
            interact_init(window);
          }
          _interactjs_interact.use(modifiers_plugin);
          var CheckName;
          (function(CheckName2) {
            CheckName2["touchAction"] = "touchAction";
            CheckName2["boxSizing"] = "boxSizing";
            CheckName2["noListeners"] = "noListeners";
          })(CheckName || (CheckName = {}));
          const prefix = "[interact.js] ";
          const links = {
            touchAction: "https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action",
            boxSizing: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"
          };
          const isProduction = false;
          function dev_tools_plugin_install(scope, {
            logger
          } = {}) {
            const {
              Interactable,
              defaults
            } = scope;
            scope.logger = logger || console;
            defaults.base.devTools = {
              ignore: {}
            };
            Interactable.prototype.devTools = function(options) {
              if (options) {
                extend2(this.options.devTools, options);
                return this;
              }
              return this.options.devTools;
            };
          }
          const checks = [{
            name: CheckName.touchAction,
            perform({
              element
            }) {
              return !parentHasStyle(element, "touchAction", /pan-|pinch|none/);
            },
            getInfo({
              element
            }) {
              return [element, links.touchAction];
            },
            text: 'Consider adding CSS "touch-action: none" to this element\n'
          }, {
            name: CheckName.boxSizing,
            perform(interaction) {
              const {
                element
              } = interaction;
              return interaction.prepared.name === "resize" && element instanceof utils_domObjects.HTMLElement && !hasStyle(element, "boxSizing", /border-box/);
            },
            text: 'Consider adding CSS "box-sizing: border-box" to this resizable element',
            getInfo({
              element
            }) {
              return [element, links.boxSizing];
            }
          }, {
            name: CheckName.noListeners,
            perform(interaction) {
              const actionName = interaction.prepared.name;
              const moveListeners = interaction.interactable.events.types[`${actionName}move`] || [];
              return !moveListeners.length;
            },
            getInfo(interaction) {
              return [interaction.prepared.name, interaction.interactable];
            },
            text: "There are no listeners set for this action"
          }];
          function hasStyle(element, prop, styleRe) {
            const value = element.style[prop] || win.getComputedStyle(element)[prop];
            return styleRe.test((value || "").toString());
          }
          function parentHasStyle(element, prop, styleRe) {
            let parent = element;
            while (is.element(parent)) {
              if (hasStyle(parent, prop, styleRe)) {
                return true;
              }
              parent = parentNode(parent);
            }
            return false;
          }
          const plugin_id = "dev-tools";
          const defaultExport = isProduction ? {
            id: plugin_id,
            install: () => {
            }
          } : {
            id: plugin_id,
            install: dev_tools_plugin_install,
            listeners: {
              "interactions:action-start": ({
                interaction
              }, scope) => {
                for (const check of checks) {
                  const options = interaction.interactable && interaction.interactable.options;
                  if (!(options && options.devTools && options.devTools.ignore[check.name]) && check.perform(interaction)) {
                    scope.logger.warn(prefix + check.text, ...check.getInfo(interaction));
                  }
                }
              }
            },
            checks,
            CheckName,
            links,
            prefix
          };
          var dev_tools_plugin = defaultExport;
          if (typeof window === "object" && !!window) {
            interact_init(window);
          }
          _interactjs_interact.use(dev_tools_plugin);
          var GridItemvue_type_script_lang_js = {
            name: "GridItem",
            props: {
              /*cols: {
               type: Number,
               required: true
               },*/
              /*containerWidth: {
               type: Number,
               required: true
                 },
               rowHeight: {
               type: Number,
               required: true
               },
               margin: {
               type: Array,
               required: true
               },
               maxRows: {
               type: Number,
               required: true
               },*/
              isDraggable: {
                type: Boolean,
                required: false,
                default: null
              },
              isResizable: {
                type: Boolean,
                required: false,
                default: null
              },
              /*useCssTransforms: {
               type: Boolean,
               required: true
               },
               */
              static: {
                type: Boolean,
                required: false,
                default: false
              },
              minH: {
                type: Number,
                required: false,
                default: 1
              },
              minW: {
                type: Number,
                required: false,
                default: 1
              },
              maxH: {
                type: Number,
                required: false,
                default: Infinity
              },
              maxW: {
                type: Number,
                required: false,
                default: Infinity
              },
              x: {
                type: Number,
                required: true
              },
              y: {
                type: Number,
                required: true
              },
              w: {
                type: Number,
                required: true
              },
              h: {
                type: Number,
                required: true
              },
              i: {
                required: true
              },
              dragIgnoreFrom: {
                type: String,
                required: false,
                default: "a, button"
              },
              dragAllowFrom: {
                type: String,
                required: false,
                default: null
              },
              resizeIgnoreFrom: {
                type: String,
                required: false,
                default: "a, button"
              },
              preserveAspectRatio: {
                type: Boolean,
                required: false,
                default: false
              }
            },
            inject: ["eventBus", "layout"],
            data: function data() {
              return {
                cols: 1,
                containerWidth: 100,
                rowHeight: 30,
                margin: [10, 10],
                maxRows: Infinity,
                draggable: null,
                resizable: null,
                useCssTransforms: true,
                useStyleCursor: true,
                isDragging: false,
                dragging: null,
                isResizing: false,
                resizing: null,
                lastX: NaN,
                lastY: NaN,
                lastW: NaN,
                lastH: NaN,
                style: {},
                rtl: false,
                dragEventSet: false,
                resizeEventSet: false,
                previousW: null,
                previousH: null,
                previousX: null,
                previousY: null,
                innerX: this.x,
                innerY: this.y,
                innerW: this.w,
                innerH: this.h
              };
            },
            created: function created() {
              var _this = this;
              var self2 = this;
              self2.updateWidthHandler = function(width) {
                self2.updateWidth(width);
              };
              self2.compactHandler = function(layout) {
                self2.compact(layout);
              };
              self2.setDraggableHandler = function(isDraggable) {
                if (self2.isDraggable === null) {
                  self2.draggable = isDraggable;
                }
              };
              self2.setResizableHandler = function(isResizable) {
                if (self2.isResizable === null) {
                  self2.resizable = isResizable;
                }
              };
              self2.setRowHeightHandler = function(rowHeight) {
                self2.rowHeight = rowHeight;
              };
              self2.setMaxRowsHandler = function(maxRows) {
                self2.maxRows = maxRows;
              };
              self2.directionchangeHandler = function() {
                _this.rtl = getDocumentDir() === "rtl";
                _this.compact();
              };
              self2.setColNum = function(colNum) {
                self2.cols = parseInt(colNum);
              };
              this.eventBus.on("updateWidth", self2.updateWidthHandler);
              this.eventBus.on("compact", self2.compactHandler);
              this.eventBus.on("setDraggable", self2.setDraggableHandler);
              this.eventBus.on("setResizable", self2.setResizableHandler);
              this.eventBus.on("setRowHeight", self2.setRowHeightHandler);
              this.eventBus.on("setMaxRows", self2.setMaxRowsHandler);
              this.eventBus.on("directionchange", self2.directionchangeHandler);
              this.eventBus.on("setColNum", self2.setColNum);
              this.rtl = getDocumentDir() === "rtl";
            },
            beforeUnmount: function beforeUnmount() {
              var self2 = this;
              this.eventBus.off("updateWidth", self2.updateWidthHandler);
              this.eventBus.off("compact", self2.compactHandler);
              this.eventBus.off("setDraggable", self2.setDraggableHandler);
              this.eventBus.off("setResizable", self2.setResizableHandler);
              this.eventBus.off("setRowHeight", self2.setRowHeightHandler);
              this.eventBus.off("setMaxRows", self2.setMaxRowsHandler);
              this.eventBus.off("directionchange", self2.directionchangeHandler);
              this.eventBus.off("setColNum", self2.setColNum);
              if (this.interactObj) {
                this.interactObj.unset();
              }
            },
            mounted: function mounted() {
              if (this.layout.responsive && this.layout.lastBreakpoint) {
                this.cols = getColsFromBreakpoint(this.layout.lastBreakpoint, this.layout.cols);
              } else {
                this.cols = this.layout.colNum;
              }
              this.rowHeight = this.layout.rowHeight;
              this.containerWidth = this.layout.width !== null ? this.layout.width : 100;
              this.margin = this.layout.margin !== void 0 ? this.layout.margin : [10, 10];
              this.maxRows = this.layout.maxRows;
              if (this.isDraggable === null) {
                this.draggable = this.layout.isDraggable;
              } else {
                this.draggable = this.isDraggable;
              }
              if (this.isResizable === null) {
                this.resizable = this.layout.isResizable;
              } else {
                this.resizable = this.isResizable;
              }
              this.useCssTransforms = this.layout.useCssTransforms;
              this.useStyleCursor = this.layout.useStyleCursor;
              this.createStyle();
            },
            watch: {
              isDraggable: function isDraggable() {
                this.draggable = this.isDraggable;
              },
              static: function _static() {
                this.tryMakeDraggable();
                this.tryMakeResizable();
              },
              draggable: function draggable() {
                this.tryMakeDraggable();
              },
              isResizable: function isResizable() {
                this.resizable = this.isResizable;
              },
              resizable: function resizable2() {
                this.tryMakeResizable();
              },
              rowHeight: function rowHeight() {
                this.createStyle();
                this.emitContainerResized();
              },
              cols: function cols() {
                this.tryMakeResizable();
                this.createStyle();
                this.emitContainerResized();
              },
              containerWidth: function containerWidth() {
                this.tryMakeResizable();
                this.createStyle();
                this.emitContainerResized();
              },
              x: function x(newVal) {
                this.innerX = newVal;
                this.createStyle();
              },
              y: function y(newVal) {
                this.innerY = newVal;
                this.createStyle();
              },
              h: function h(newVal) {
                this.innerH = newVal;
                this.createStyle();
              },
              w: function w(newVal) {
                this.innerW = newVal;
                this.createStyle();
              },
              renderRtl: function renderRtl() {
                this.tryMakeResizable();
                this.createStyle();
              },
              minH: function minH() {
                this.tryMakeResizable();
              },
              maxH: function maxH() {
                this.tryMakeResizable();
              },
              minW: function minW() {
                this.tryMakeResizable();
              },
              maxW: function maxW() {
                this.tryMakeResizable();
              },
              "$parent.margin": function $parentMargin(margin) {
                if (!margin || margin[0] == this.margin[0] && margin[1] == this.margin[1]) {
                  return;
                }
                this.margin = margin.map(function(m) {
                  return Number(m);
                });
                this.createStyle();
                this.emitContainerResized();
              }
            },
            computed: {
              classObj: function classObj() {
                return {
                  "vue-resizable": this.resizableAndNotStatic,
                  "static": this.static,
                  "resizing": this.isResizing,
                  "vue-draggable-dragging": this.isDragging,
                  "cssTransforms": this.useCssTransforms,
                  "render-rtl": this.renderRtl,
                  "disable-userselect": this.isDragging,
                  "no-touch": this.isAndroid && this.draggableOrResizableAndNotStatic
                };
              },
              resizableAndNotStatic: function resizableAndNotStatic() {
                return this.resizable && !this.static;
              },
              draggableOrResizableAndNotStatic: function draggableOrResizableAndNotStatic() {
                return (this.draggable || this.resizable) && !this.static;
              },
              isAndroid: function isAndroid() {
                return navigator.userAgent.toLowerCase().indexOf("android") !== -1;
              },
              renderRtl: function renderRtl() {
                return this.layout.isMirrored ? !this.rtl : this.rtl;
              },
              resizableHandleClass: function resizableHandleClass() {
                if (this.renderRtl) {
                  return "vue-resizable-handle vue-rtl-resizable-handle";
                } else {
                  return "vue-resizable-handle";
                }
              }
            },
            methods: {
              createStyle: function createStyle() {
                if (this.x + this.w > this.cols) {
                  this.innerX = 0;
                  this.innerW = this.w > this.cols ? this.cols : this.w;
                } else {
                  this.innerX = this.x;
                  this.innerW = this.w;
                }
                var pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
                if (this.isDragging) {
                  pos.top = this.dragging.top;
                  if (this.renderRtl) {
                    pos.right = this.dragging.left;
                  } else {
                    pos.left = this.dragging.left;
                  }
                }
                if (this.isResizing) {
                  pos.width = this.resizing.width;
                  pos.height = this.resizing.height;
                }
                var style;
                if (this.useCssTransforms) {
                  if (this.renderRtl) {
                    style = setTransformRtl(pos.top, pos.right, pos.width, pos.height);
                  } else {
                    style = setTransform(pos.top, pos.left, pos.width, pos.height);
                  }
                } else {
                  if (this.renderRtl) {
                    style = setTopRight(pos.top, pos.right, pos.width, pos.height);
                  } else {
                    style = setTopLeft(pos.top, pos.left, pos.width, pos.height);
                  }
                }
                this.style = style;
              },
              emitContainerResized: function emitContainerResized() {
                var styleProps = {};
                for (var _i = 0, _arr = ["width", "height"]; _i < _arr.length; _i++) {
                  var prop = _arr[_i];
                  var val = this.style[prop];
                  var matches = val.match(/^(\d+)px$/);
                  if (!matches)
                    return;
                  styleProps[prop] = matches[1];
                }
                this.$emit("container-resized", this.i, this.h, this.w, styleProps.height, styleProps.width);
              },
              handleResize: function handleResize(event) {
                if (this.static)
                  return;
                var position = getControlPosition(event);
                if (position == null)
                  return;
                var x = position.x, y = position.y;
                var newSize = {
                  width: 0,
                  height: 0
                };
                var pos;
                switch (event.type) {
                  case "resizestart": {
                    this.previousW = this.innerW;
                    this.previousH = this.innerH;
                    pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
                    newSize.width = pos.width;
                    newSize.height = pos.height;
                    this.resizing = newSize;
                    this.isResizing = true;
                    break;
                  }
                  case "resizemove": {
                    var coreEvent = createCoreData(this.lastW, this.lastH, x, y);
                    if (this.renderRtl) {
                      newSize.width = this.resizing.width - coreEvent.deltaX;
                    } else {
                      newSize.width = this.resizing.width + coreEvent.deltaX;
                    }
                    newSize.height = this.resizing.height + coreEvent.deltaY;
                    this.resizing = newSize;
                    break;
                  }
                  case "resizeend": {
                    pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
                    newSize.width = pos.width;
                    newSize.height = pos.height;
                    this.resizing = null;
                    this.isResizing = false;
                    break;
                  }
                }
                pos = this.calcWH(newSize.height, newSize.width);
                if (pos.w < this.minW) {
                  pos.w = this.minW;
                }
                if (pos.w > this.maxW) {
                  pos.w = this.maxW;
                }
                if (pos.h < this.minH) {
                  pos.h = this.minH;
                }
                if (pos.h > this.maxH) {
                  pos.h = this.maxH;
                }
                if (pos.h < 1) {
                  pos.h = 1;
                }
                if (pos.w < 1) {
                  pos.w = 1;
                }
                this.lastW = x;
                this.lastH = y;
                if (this.innerW !== pos.w || this.innerH !== pos.h) {
                  this.$emit("resize", this.i, pos.h, pos.w, newSize.height, newSize.width);
                }
                if (event.type === "resizeend" && (this.previousW !== this.innerW || this.previousH !== this.innerH)) {
                  this.$emit("resized", this.i, pos.h, pos.w, newSize.height, newSize.width);
                }
                this.eventBus.emit("resizeEvent", {
                  eventType: event.type,
                  i: this.i,
                  x: this.innerX,
                  y: this.innerY,
                  h: pos.h,
                  w: pos.w
                });
              },
              handleDrag: function handleDrag(event) {
                if (this.static)
                  return;
                if (this.isResizing)
                  return;
                var position = getControlPosition(event);
                if (position === null)
                  return;
                var x = position.x, y = position.y;
                var newPosition = {
                  top: 0,
                  left: 0
                };
                switch (event.type) {
                  case "dragstart": {
                    this.previousX = this.innerX;
                    this.previousY = this.innerY;
                    var parentRect = event.target.offsetParent.getBoundingClientRect();
                    var clientRect = event.target.getBoundingClientRect();
                    if (this.renderRtl) {
                      newPosition.left = (clientRect.right - parentRect.right) * -1;
                    } else {
                      newPosition.left = clientRect.left - parentRect.left;
                    }
                    newPosition.top = clientRect.top - parentRect.top;
                    this.dragging = newPosition;
                    this.isDragging = true;
                    break;
                  }
                  case "dragend": {
                    if (!this.isDragging)
                      return;
                    var _parentRect = event.target.offsetParent.getBoundingClientRect();
                    var _clientRect = event.target.getBoundingClientRect();
                    if (this.renderRtl) {
                      newPosition.left = (_clientRect.right - _parentRect.right) * -1;
                    } else {
                      newPosition.left = _clientRect.left - _parentRect.left;
                    }
                    newPosition.top = _clientRect.top - _parentRect.top;
                    this.dragging = null;
                    this.isDragging = false;
                    break;
                  }
                  case "dragmove": {
                    var coreEvent = createCoreData(this.lastX, this.lastY, x, y);
                    if (this.renderRtl) {
                      newPosition.left = this.dragging.left - coreEvent.deltaX;
                    } else {
                      newPosition.left = this.dragging.left + coreEvent.deltaX;
                    }
                    newPosition.top = this.dragging.top + coreEvent.deltaY;
                    this.dragging = newPosition;
                    break;
                  }
                }
                var pos;
                if (this.renderRtl) {
                  pos = this.calcXY(newPosition.top, newPosition.left);
                } else {
                  pos = this.calcXY(newPosition.top, newPosition.left);
                }
                this.lastX = x;
                this.lastY = y;
                if (this.innerX !== pos.x || this.innerY !== pos.y) {
                  this.$emit("move", this.i, pos.x, pos.y);
                }
                if (event.type === "dragend" && (this.previousX !== this.innerX || this.previousY !== this.innerY)) {
                  this.$emit("moved", this.i, pos.x, pos.y);
                }
                this.eventBus.emit("dragEvent", {
                  eventType: event.type,
                  i: this.i,
                  x: pos.x,
                  y: pos.y,
                  h: this.innerH,
                  w: this.innerW
                });
              },
              calcPosition: function calcPosition(x, y, w, h) {
                var colWidth = this.calcColWidth();
                var out;
                if (this.renderRtl) {
                  out = {
                    right: Math.round(colWidth * x + (x + 1) * this.margin[0]),
                    top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
                    // 0 * Infinity === NaN, which causes problems with resize constriants;
                    // Fix this if it occurs.
                    // Note we do it here rather than later because Math.round(Infinity) causes deopt
                    width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
                    height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
                  };
                } else {
                  out = {
                    left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
                    top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
                    // 0 * Infinity === NaN, which causes problems with resize constriants;
                    // Fix this if it occurs.
                    // Note we do it here rather than later because Math.round(Infinity) causes deopt
                    width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
                    height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
                  };
                }
                return out;
              },
              /**
               * Translate x and y coordinates from pixels to grid units.
               * @param  {Number} top  Top position (relative to parent) in pixels.
               * @param  {Number} left Left position (relative to parent) in pixels.
               * @return {Object} x and y in grid units.
               */
              // TODO check if this function needs change in order to support rtl.
              calcXY: function calcXY(top, left) {
                var colWidth = this.calcColWidth();
                var x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
                var y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));
                x = Math.max(Math.min(x, this.cols - this.innerW), 0);
                y = Math.max(Math.min(y, this.maxRows - this.innerH), 0);
                return {
                  x,
                  y
                };
              },
              // Helper for generating column width
              calcColWidth: function calcColWidth() {
                var colWidth = (this.containerWidth - this.margin[0] * (this.cols + 1)) / this.cols;
                return colWidth;
              },
              /**
               * Given a height and width in pixel values, calculate grid units.
               * @param  {Number} height Height in pixels.
               * @param  {Number} width  Width in pixels.
               * @param  {Boolean} autoSizeFlag  function autoSize identifier.
               * @return {Object} w, h as grid units.
               */
              calcWH: function calcWH(height, width) {
                var autoSizeFlag = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                var colWidth = this.calcColWidth();
                var w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]));
                var h = 0;
                if (!autoSizeFlag) {
                  h = Math.round((height + this.margin[1]) / (this.rowHeight + this.margin[1]));
                } else {
                  h = Math.ceil((height + this.margin[1]) / (this.rowHeight + this.margin[1]));
                }
                w = Math.max(Math.min(w, this.cols - this.innerX), 0);
                h = Math.max(Math.min(h, this.maxRows - this.innerY), 0);
                return {
                  w,
                  h
                };
              },
              updateWidth: function updateWidth(width, colNum) {
                this.containerWidth = width;
                if (colNum !== void 0 && colNum !== null) {
                  this.cols = colNum;
                }
              },
              compact: function compact2() {
                this.createStyle();
              },
              tryMakeDraggable: function tryMakeDraggable() {
                var self2 = this;
                if (this.interactObj === null || this.interactObj === void 0) {
                  this.interactObj = _interactjs_interact(this.$refs.item);
                  if (!this.useStyleCursor) {
                    this.interactObj.styleCursor(false);
                  }
                }
                if (this.draggable && !this.static) {
                  var opts = {
                    ignoreFrom: this.dragIgnoreFrom,
                    allowFrom: this.dragAllowFrom
                  };
                  this.interactObj.draggable(opts);
                  if (!this.dragEventSet) {
                    this.dragEventSet = true;
                    this.interactObj.on("dragstart dragmove dragend", function(event) {
                      self2.handleDrag(event);
                    });
                  }
                } else {
                  this.interactObj.draggable({
                    enabled: false
                  });
                }
              },
              tryMakeResizable: function tryMakeResizable() {
                var self2 = this;
                if (this.interactObj === null || this.interactObj === void 0) {
                  this.interactObj = _interactjs_interact(this.$refs.item);
                  if (!this.useStyleCursor) {
                    this.interactObj.styleCursor(false);
                  }
                }
                if (this.resizable && !this.static) {
                  var maximum = this.calcPosition(0, 0, this.maxW, this.maxH);
                  var minimum = this.calcPosition(0, 0, this.minW, this.minH);
                  var opts = {
                    // allowFrom: "." + this.resizableHandleClass.trim().replace(" ", "."),
                    edges: {
                      left: false,
                      right: "." + this.resizableHandleClass.trim().replace(" ", "."),
                      bottom: "." + this.resizableHandleClass.trim().replace(" ", "."),
                      top: false
                    },
                    ignoreFrom: this.resizeIgnoreFrom,
                    restrictSize: {
                      min: {
                        height: minimum.height,
                        width: minimum.width
                      },
                      max: {
                        height: maximum.height,
                        width: maximum.width
                      }
                    }
                  };
                  if (this.preserveAspectRatio) {
                    opts.modifiers = [_interactjs_interact.modifiers.aspectRatio({
                      ratio: "preserve"
                    })];
                  }
                  this.interactObj.resizable(opts);
                  if (!this.resizeEventSet) {
                    this.resizeEventSet = true;
                    this.interactObj.on("resizestart resizemove resizeend", function(event) {
                      self2.handleResize(event);
                    });
                  }
                } else {
                  this.interactObj.resizable({
                    enabled: false
                  });
                }
              },
              autoSize: function autoSize() {
                this.previousW = this.innerW;
                this.previousH = this.innerH;
                var newSize = this.$slots().default[0].elm.getBoundingClientRect();
                var pos = this.calcWH(newSize.height, newSize.width, true);
                if (pos.w < this.minW) {
                  pos.w = this.minW;
                }
                if (pos.w > this.maxW) {
                  pos.w = this.maxW;
                }
                if (pos.h < this.minH) {
                  pos.h = this.minH;
                }
                if (pos.h > this.maxH) {
                  pos.h = this.maxH;
                }
                if (pos.h < 1) {
                  pos.h = 1;
                }
                if (pos.w < 1) {
                  pos.w = 1;
                }
                if (this.innerW !== pos.w || this.innerH !== pos.h) {
                  this.$emit("resize", this.i, pos.h, pos.w, newSize.height, newSize.width);
                }
                if (this.previousW !== pos.w || this.previousH !== pos.h) {
                  this.$emit("resized", this.i, pos.h, pos.w, newSize.height, newSize.width);
                  this.eventBus.emit("resizeEvent", {
                    eventType: "resizeend",
                    i: this.i,
                    x: this.innerX,
                    y: this.innerY,
                    h: pos.h,
                    w: pos.w
                  });
                }
              }
            }
          };
          var GridItemvue_type_style_index_0_id_46ff2fc8_lang_css = __webpack_require__("083e");
          GridItemvue_type_script_lang_js.render = render;
          var GridItem = GridItemvue_type_script_lang_js;
          function GridLayoutvue_type_template_id_fc5948f6_render(_ctx, _cache, $props, $setup, $data, $options) {
            var _component_grid_item = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("grid-item");
            return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("div", {
              ref: "item",
              class: "vue-grid-layout",
              style: _ctx.mergedStyle
            }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "default"), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_grid_item, {
              class: "vue-grid-placeholder",
              x: _ctx.placeholder.x,
              y: _ctx.placeholder.y,
              w: _ctx.placeholder.w,
              h: _ctx.placeholder.h,
              i: _ctx.placeholder.i
            }, null, 8, ["x", "y", "w", "h", "i"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isDragging]])], 4);
          }
          var es7_object_get_own_property_descriptors = __webpack_require__("8e6e");
          var es6_object_assign = __webpack_require__("f751");
          var es6_number_is_finite = __webpack_require__("fca0");
          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, {
                value,
                enumerable: true,
                configurable: true,
                writable: true
              });
            } else {
              obj[key] = value;
            }
            return obj;
          }
          var mitt_es = function(n) {
            return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
              var i = n.get(t);
              i && i.push(e) || n.set(t, [e]);
            }, off: function(t, e) {
              var i = n.get(t);
              i && i.splice(i.indexOf(e) >>> 0, 1);
            }, emit: function(t, e) {
              (n.get(t) || []).slice().map(function(n2) {
                n2(e);
              }), (n.get("*") || []).slice().map(function(n2) {
                n2(t, e);
              });
            } };
          };
          function ownKeys(object2, enumerableOnly) {
            var keys = Object.keys(object2);
            if (Object.getOwnPropertySymbols) {
              var symbols = Object.getOwnPropertySymbols(object2);
              if (enumerableOnly)
                symbols = symbols.filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(object2, sym).enumerable;
                });
              keys.push.apply(keys, symbols);
            }
            return keys;
          }
          function _objectSpread(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i] != null ? arguments[i] : {};
              if (i % 2) {
                ownKeys(Object(source), true).forEach(function(key) {
                  _defineProperty(target, key, source[key]);
                });
              } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
              } else {
                ownKeys(Object(source)).forEach(function(key) {
                  Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                });
              }
            }
            return target;
          }
          var elementResizeDetectorMaker = __webpack_require__("eec4");
          var GridLayoutvue_type_script_lang_js = {
            name: "GridLayout",
            provide: function provide() {
              return {
                eventBus: this.eventBus,
                layout: this
              };
            },
            components: {
              GridItem
            },
            props: {
              // If true, the container height swells and contracts to fit contents
              autoSize: {
                type: Boolean,
                default: true
              },
              colNum: {
                type: Number,
                default: 12
              },
              rowHeight: {
                type: Number,
                default: 150
              },
              maxRows: {
                type: Number,
                default: Infinity
              },
              margin: {
                type: Array,
                default: function _default() {
                  return [10, 10];
                }
              },
              isDraggable: {
                type: Boolean,
                default: true
              },
              isResizable: {
                type: Boolean,
                default: true
              },
              isMirrored: {
                type: Boolean,
                default: false
              },
              useCssTransforms: {
                type: Boolean,
                default: true
              },
              verticalCompact: {
                type: Boolean,
                default: true
              },
              layout: {
                type: Array,
                required: true
              },
              responsive: {
                type: Boolean,
                default: false
              },
              responsiveLayouts: {
                type: Object,
                default: function _default() {
                  return {};
                }
              },
              breakpoints: {
                type: Object,
                default: function _default() {
                  return {
                    lg: 1200,
                    md: 996,
                    sm: 768,
                    xs: 480,
                    xxs: 0
                  };
                }
              },
              cols: {
                type: Object,
                default: function _default() {
                  return {
                    lg: 12,
                    md: 10,
                    sm: 6,
                    xs: 4,
                    xxs: 2
                  };
                }
              },
              preventCollision: {
                type: Boolean,
                default: false
              },
              useStyleCursor: {
                type: Boolean,
                default: true
              }
            },
            data: function data() {
              return {
                eventBus: mitt_es(),
                width: null,
                mergedStyle: {},
                lastLayoutLength: 0,
                isDragging: false,
                placeholder: {
                  x: 0,
                  y: 0,
                  w: 0,
                  h: 0,
                  i: -1
                },
                layouts: {},
                // array to store all layouts from different breakpoints
                lastBreakpoint: null,
                // store last active breakpoint
                originalLayout: null
                // store original Layout
                // layout: JSON.parse(JSON.stringify(this.value)),
              };
            },
            created: function created() {
              var self2 = this;
              self2.resizeEventHandler = function(_ref) {
                var eventType = _ref.eventType, i = _ref.i, x = _ref.x, y = _ref.y, h = _ref.h, w = _ref.w;
                self2.resizeEvent(eventType, i, x, y, h, w);
              };
              self2.dragEventHandler = function(_ref2) {
                var eventType = _ref2.eventType, i = _ref2.i, x = _ref2.x, y = _ref2.y, h = _ref2.h, w = _ref2.w;
                self2.dragEvent(eventType, i, x, y, h, w);
              };
              self2.eventBus.on("resizeEvent", self2.resizeEventHandler);
              self2.eventBus.on("dragEvent", self2.dragEventHandler);
              self2.$emit("layout-created", self2.layout);
            },
            beforeUnmount: function beforeUnmount() {
              this.eventBus.off("resizeEvent", this.resizeEventHandler);
              this.eventBus.off("dragEvent", this.dragEventHandler);
              removeWindowEventListener("resize", this.onWindowResize);
              if (this.erd) {
                this.erd.uninstall(this.$refs.item);
              }
            },
            beforeMount: function beforeMount() {
              this.$emit("layout-before-mount", this.layout);
            },
            mounted: function mounted() {
              this.$emit("layout-mounted", this.layout);
              this.$nextTick(function() {
                validateLayout(this.layout);
                this.originalLayout = this.layout;
                var self2 = this;
                this.$nextTick(function() {
                  self2.onWindowResize();
                  self2.initResponsiveFeatures();
                  addWindowEventListener("resize", self2.onWindowResize);
                  compact(self2.layout, self2.verticalCompact);
                  self2.$emit("layout-updated", self2.layout);
                  self2.updateHeight();
                  self2.$nextTick(function() {
                    this.erd = elementResizeDetectorMaker({
                      strategy: "scroll",
                      //<- For ultra performance.
                      // See https://github.com/wnr/element-resize-detector/issues/110 about callOnAdd.
                      callOnAdd: false
                    });
                    this.erd.listenTo(self2.$refs.item, function() {
                      self2.onWindowResize();
                    });
                  });
                });
              });
            },
            watch: {
              width: function width(newval, oldval) {
                var self2 = this;
                this.$nextTick(function() {
                  var _this = this;
                  this.eventBus.emit("updateWidth", this.width);
                  if (oldval === null) {
                    this.$nextTick(function() {
                      _this.$emit("layout-ready", self2.layout);
                    });
                  }
                  this.updateHeight();
                });
              },
              layout: function layout() {
                this.layoutUpdate();
              },
              colNum: function colNum(val) {
                this.eventBus.emit("setColNum", val);
              },
              rowHeight: function rowHeight() {
                this.eventBus.emit("setRowHeight", this.rowHeight);
              },
              isDraggable: function isDraggable() {
                this.eventBus.emit("setDraggable", this.isDraggable);
              },
              isResizable: function isResizable() {
                this.eventBus.emit("setResizable", this.isResizable);
              },
              responsive: function responsive() {
                if (!this.responsive) {
                  this.$emit("update:layout", this.originalLayout);
                  this.eventBus.emit("setColNum", this.colNum);
                }
                this.onWindowResize();
              },
              maxRows: function maxRows() {
                this.eventBus.emit("setMaxRows", this.maxRows);
              },
              margin: function margin() {
                this.updateHeight();
              }
            },
            methods: {
              layoutUpdate: function layoutUpdate() {
                if (this.layout !== void 0 && this.originalLayout !== null) {
                  if (this.layout.length !== this.originalLayout.length) {
                    var diff = this.findDifference(this.layout, this.originalLayout);
                    if (diff.length > 0) {
                      if (this.layout.length > this.originalLayout.length) {
                        this.originalLayout = this.originalLayout.concat(diff);
                      } else {
                        this.originalLayout = this.originalLayout.filter(function(obj) {
                          return !diff.some(function(obj2) {
                            return obj.i === obj2.i;
                          });
                        });
                      }
                    }
                    this.lastLayoutLength = this.layout.length;
                    this.initResponsiveFeatures();
                  }
                  compact(this.layout, this.verticalCompact);
                  this.eventBus.emit("updateWidth", this.width);
                  this.updateHeight();
                  this.$emit("layout-updated", this.layout);
                }
              },
              updateHeight: function updateHeight() {
                this.mergedStyle = {
                  height: this.containerHeight()
                };
              },
              onWindowResize: function onWindowResize() {
                if (this.$refs !== null && this.$refs.item !== null && this.$refs.item !== void 0) {
                  this.width = this.$refs.item.offsetWidth;
                }
                this.eventBus.emit("resizeEvent", {});
              },
              containerHeight: function containerHeight() {
                if (!this.autoSize)
                  return;
                var containerHeight2 = bottom(this.layout) * (this.rowHeight + this.margin[1]) + this.margin[1] + "px";
                return containerHeight2;
              },
              dragEvent: function dragEvent(eventName, id, x, y, h, w) {
                var l = getLayoutItem(this.layout, id);
                if (l === void 0 || l === null) {
                  l = {
                    x: 0,
                    y: 0
                  };
                }
                if (eventName === "dragmove" || eventName === "dragstart") {
                  this.placeholder.i = id;
                  this.placeholder.x = l.x;
                  this.placeholder.y = l.y;
                  this.placeholder.w = w;
                  this.placeholder.h = h;
                  this.$nextTick(function() {
                    this.isDragging = true;
                  });
                  this.eventBus.emit("updateWidth", this.width);
                } else {
                  this.$nextTick(function() {
                    this.isDragging = false;
                  });
                }
                this.$emit("update:layout", moveElement(this.layout, l, x, y, true, this.preventCollision));
                compact(this.layout, this.verticalCompact);
                this.eventBus.emit("compact");
                this.updateHeight();
                if (eventName === "dragend")
                  this.$emit("layout-updated", this.layout);
              },
              resizeEvent: function resizeEvent(eventName, id, x, y, h, w) {
                var l = getLayoutItem(this.layout, id);
                if (l === void 0 || l === null) {
                  l = {
                    h: 0,
                    w: 0
                  };
                }
                var hasCollisions;
                if (this.preventCollision) {
                  var collisions = getAllCollisions(this.layout, _objectSpread(_objectSpread({}, l), {}, {
                    w,
                    h
                  })).filter(function(layoutItem) {
                    return layoutItem.i !== l.i;
                  });
                  hasCollisions = collisions.length > 0;
                  if (hasCollisions) {
                    var leastX = Infinity, leastY = Infinity;
                    collisions.forEach(function(layoutItem) {
                      if (layoutItem.x > l.x)
                        leastX = Math.min(leastX, layoutItem.x);
                      if (layoutItem.y > l.y)
                        leastY = Math.min(leastY, layoutItem.y);
                    });
                    if (Number.isFinite(leastX))
                      l.w = leastX - l.x;
                    if (Number.isFinite(leastY))
                      l.h = leastY - l.y;
                  }
                }
                if (!hasCollisions) {
                  l.w = w;
                  l.h = h;
                }
                if (eventName === "resizestart" || eventName === "resizemove") {
                  this.placeholder.i = id;
                  this.placeholder.x = x;
                  this.placeholder.y = y;
                  this.placeholder.w = l.w;
                  this.placeholder.h = l.h;
                  this.$nextTick(function() {
                    this.isDragging = true;
                  });
                  this.eventBus.emit("updateWidth", this.width);
                } else {
                  this.$nextTick(function() {
                    this.isDragging = false;
                  });
                }
                if (this.responsive)
                  this.responsiveGridLayout();
                compact(this.layout, this.verticalCompact);
                this.eventBus.emit("compact");
                this.updateHeight();
                if (eventName === "resizeend")
                  this.$emit("layout-updated", this.layout);
              },
              // finds or generates new layouts for set breakpoints
              responsiveGridLayout: function responsiveGridLayout() {
                var newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.width);
                var newCols = getColsFromBreakpoint(newBreakpoint, this.cols);
                if (this.lastBreakpoint != null && !this.layouts[this.lastBreakpoint])
                  this.layouts[this.lastBreakpoint] = cloneLayout(this.layout);
                var layout = findOrGenerateResponsiveLayout(this.originalLayout, this.layouts, this.breakpoints, newBreakpoint, this.lastBreakpoint, newCols, this.verticalCompact);
                this.layouts[newBreakpoint] = layout;
                if (this.lastBreakpoint !== newBreakpoint) {
                  this.$emit("breakpoint-changed", newBreakpoint, layout);
                }
                this.$emit("update:layout", layout);
                this.lastBreakpoint = newBreakpoint;
                this.eventBus.emit("setColNum", getColsFromBreakpoint(newBreakpoint, this.cols));
              },
              // clear all responsive layouts
              initResponsiveFeatures: function initResponsiveFeatures() {
                this.layouts = Object.assign({}, this.responsiveLayouts);
              },
              // find difference in layouts
              findDifference: function findDifference(layout, originalLayout) {
                var uniqueResultOne = layout.filter(function(obj) {
                  return !originalLayout.some(function(obj2) {
                    return obj.i === obj2.i;
                  });
                });
                var uniqueResultTwo = originalLayout.filter(function(obj) {
                  return !layout.some(function(obj2) {
                    return obj.i === obj2.i;
                  });
                });
                return uniqueResultOne.concat(uniqueResultTwo);
              }
            }
          };
          var GridLayoutvue_type_style_index_0_id_fc5948f6_lang_css = __webpack_require__("6521");
          GridLayoutvue_type_script_lang_js.render = GridLayoutvue_type_template_id_fc5948f6_render;
          var GridLayout = GridLayoutvue_type_script_lang_js;
          var components_install = function install(app) {
            app.component("grid-layout", GridLayout);
            app.component("grid-item", GridItem);
          };
          var components = components_install;
          var entry_lib = __webpack_exports__["default"] = components;
        }
      ),
      /***/
      "fca0": (
        /***/
        function(module2, exports2, __webpack_require__) {
          var $export = __webpack_require__("5ca1");
          var _isFinite = __webpack_require__("7726").isFinite;
          $export($export.S, "Number", {
            isFinite: function isFinite(it) {
              return typeof it == "number" && _isFinite(it);
            }
          });
        }
      ),
      /***/
      "fdef": (
        /***/
        function(module2, exports2) {
          module2.exports = "	\n\v\f\r   ᠎             　\u2028\u2029\uFEFF";
        }
      )
      /******/
    })["default"];
  }
});
export default require_vue_grid_layout_common();
/*! Bundled license information:

@vue/compiler-core/dist/compiler-core.esm-bundler.js:
  (**
  * @vue/compiler-core v3.4.26
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/compiler-dom/dist/compiler-dom.esm-bundler.js:
  (**
  * @vue/compiler-dom v3.4.26
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

vue/dist/vue.cjs.js:
  (**
  * vue v3.4.26
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

vue-grid-layout/dist/vue-grid-layout.common.js:
  (*! vue-grid-layout - 3.0.0-beta1 | (c) 2015, 2021  Gustavo Santos (JBay Solutions) <gustavo.santos@jbaysolutions.com> (http://www.jbaysolutions.com) | https://github.com/jbaysolutions/vue-grid-layout *)
*/
//# sourceMappingURL=vue-grid-layout.js.map
