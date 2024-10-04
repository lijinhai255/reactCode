/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./react/createElement.js":
/*!********************************!*\
  !*** ./react/createElement.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createElement: () => (/* binding */ createElement)\n/* harmony export */ });\nfunction createElement(type, props) {\n  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    children[_key - 2] = arguments[_key];\n  }\n  return {\n    type,\n    props: {\n      ...props,\n      children: children.map(child => {\n        return typeof child === \"object\" ? child : createTextElement(child);\n      })\n    }\n  };\n}\nfunction createTextElement(text) {\n  return {\n    type: \"TEXT_ELEMENT\",\n    props: {\n      nodeValue: text,\n      children: []\n    }\n  };\n}\n\n//# sourceURL=webpack://reack16_code/./react/createElement.js?");

/***/ }),

/***/ "./react/index.js":
/*!************************!*\
  !*** ./react/index.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createElement */ \"./react/createElement.js\");\n/* harmony import */ var _react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./react-dom */ \"./react/react-dom.js\");\n\n\nconst React = {\n  createElement: _createElement__WEBPACK_IMPORTED_MODULE_0__.createElement,\n  render: _react_dom__WEBPACK_IMPORTED_MODULE_1__.render\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (React);\n\n//# sourceURL=webpack://reack16_code/./react/index.js?");

/***/ }),

/***/ "./react/react-dom.js":
/*!****************************!*\
  !*** ./react/react-dom.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createDome: () => (/* binding */ createDome),\n/* harmony export */   render: () => (/* binding */ render)\n/* harmony export */ });\nlet nextUnitOfWork = null; // 保存下一个工作单元（Fiber）\nlet wipRoot = null; // 当前正在工作的 Fiber 树根节点\nlet currentRoot = null; // 上一次提交给 DOM 的 Fiber 树根节点\nlet deletions = []; // 保存需要删除的 Fiber 节点\n\nfunction isNew(prevProps, nextProps) {\n  return key => prevProps[key] !== nextProps[key];\n}\nfunction isGone(prevProps, nextProps) {\n  return key => !(key in nextProps);\n}\n\n// render 函数初始化 Fiber 树并开始工作循环\nfunction render(element, container) {\n  wipRoot = {\n    dom: container,\n    // 保存容器 DOM 节点\n    props: {\n      children: [element] // 将要渲染的 element 放在 props.children 中\n    },\n    alternate: currentRoot // 保存上一次渲染的 Fiber 树以便复用\n  };\n  deletions = []; // 清空删除列表\n  nextUnitOfWork = wipRoot; // 将根节点设为下一个工作单元\n}\n\n// 创建 DOM 节点的方法\nfunction createDome(fiber) {\n  // 创建 DOM 节点\n  const dom = fiber.type === \"TEXT_ELEMENT\" // 如果 Fiber 类型是文本\n  ? document.createTextNode(\"\") // 创建文本节点\n  : document.createElement(fiber.type); // 否则创建普通的 DOM 元素\n\n  const isProperty = key => key !== \"children\"; // 过滤掉 children 属性\n  Object.keys(fiber.props) // 遍历 fiber 的 props\n  .filter(isProperty) // 过滤掉 children\n  .forEach(name => {\n    dom[name] = fiber.props[name]; // 设置 DOM 属性\n  });\n  return dom; // 返回创建好的 DOM 节点\n}\n\n// 更新 DOM 属性的函数，用于处理 Fiber 树的变化\nfunction updateDom(dom, prevProps, nextProps) {\n  // 删除移除的事件\n  Object.keys(prevProps).filter(isEvent).filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key)).forEach(name => {\n    const eventType = name.toLowerCase().substring(2); // 从属性名称中提取事件类型\n    dom.removeEventListener(eventType, prevProps[name]); // 移除旧的事件监听\n  });\n\n  // 移除旧的属性\n  Object.keys(prevProps).filter(isProperty) // 过滤掉 children\n  .filter(isGone(prevProps, nextProps)) // 检查属性是否已不存在\n  .forEach(name => {\n    dom[name] = \"\"; // 移除属性\n  });\n\n  // 设置新的属性\n  Object.keys(nextProps).filter(isProperty) // 过滤掉 children\n  .filter(isNew(prevProps, nextProps)) // 检查新属性\n  .forEach(name => {\n    dom[name] = nextProps[name]; // 更新 DOM 的属性\n  });\n\n  // 添加新的事件处理\n  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)) // 检查是否是新的事件\n  .forEach(name => {\n    const eventType = name.toLowerCase().substring(2); // 获取事件类型\n    dom.addEventListener(eventType, nextProps[name]); // 添加新的事件监听\n  });\n}\n\n/**\n * 提交节点，将 Fiber 树提交到真实 DOM\n **/\nfunction commitWork(fiber) {\n  if (!fiber) {\n    return; // 如果 Fiber 节点不存在，直接返回\n  }\n  const domParent = fiber.parent.dom; // 找到父节点的 DOM\n\n  if (fiber.effectTag === \"PLACEMENT\" && fiber.dom != null) {\n    // 如果是新建节点并且 DOM 不为空\n    domParent.appendChild(fiber.dom); // 将新节点添加到父节点 DOM\n  } else if (fiber.effectTag === \"UPDATE\" && fiber.dom != null) {\n    // 如果是更新节点\n    updateDom(fiber.dom, fiber.alternate.props, fiber.props); // 更新 DOM 属性\n  } else if (fiber.effectTag === \"DELETION\") {\n    // 如果是删除节点\n    commitDeletion(fiber, domParent); // 执行删除操作\n    return; // 删除节点后不再处理其子节点\n  }\n  commitWork(fiber.child); // 递归处理子节点\n  commitWork(fiber.sibling); // 递归处理兄弟节点\n}\n\n// 删除 Fiber 节点\nfunction commitDeletion(fiber, domParent) {\n  if (fiber.dom) {\n    domParent.removeChild(fiber.dom); // 从父节点 DOM 中移除\n  } else {\n    commitDeletion(fiber.child, domParent); // 递归删除子节点\n  }\n}\n\n/**\n * 提交整个 Fiber 树\n **/\nfunction commitRoot() {\n  deletions.forEach(commitWork); // 先处理需要删除的 Fiber 节点\n  commitWork(wipRoot.child); // 提交根节点的子节点\n  currentRoot = wipRoot; // 将当前的根节点设置为已经提交的 Fiber 树\n  wipRoot = null; // 清空 wipRoot，表示工作完成\n}\n\n/***\n * 工作循环，持续调度工作单元\n **/\nfunction workloop(deadline) {\n  let shouldYield = false; // 停止标识，表示是否需要让出控制权\n  while (nextUnitOfWork && !shouldYield) {\n    // 如果有下一个工作单元并且不需要停止\n    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); // 执行下一个工作单元\n    shouldYield = deadline.timeRemaining() < 1; // 判断是否需要停止以让出控制权\n  }\n  if (!nextUnitOfWork && wipRoot) {\n    commitRoot(); // 如果没有工作单元并且有需要提交的 Fiber 树，提交 Fiber 树\n  }\n  requestIdleCallback(workloop); // 在空闲时间再次调用工作循环\n}\nrequestIdleCallback(workloop); // 初始化工作循环\n\n/**\n * 协调阶段，处理子元素\n **/\nfunction reconcileChildren(wipFiber, elements) {\n  let index = 0; // 子元素索引\n  let prevSibling = null; // 记录上一个兄弟 Fiber 节点\n  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 获取旧的 Fiber 节点\n\n  while (index < elements.length || oldFiber != null) {\n    const element = elements[index]; // 获取当前要处理的元素\n    let newFiber = null;\n    const sameType = oldFiber && element && element.type === oldFiber.type; // 判断新旧节点类型是否相同\n    // 类型相同，需要更新\n    if (sameType) {\n      newFiber = {\n        type: oldFiber.type,\n        // 类型保持不变\n        props: element.props,\n        // 更新新的属性\n        dom: oldFiber.dom,\n        // 复用旧的 DOM 节点\n        parent: wipFiber,\n        // 设置父节点为当前工作 Fiber\n        alternate: oldFiber,\n        // 指向旧的 Fiber 以便比较\n        effectTag: \"UPDATE\" // 标记为更新操作\n      };\n    }\n    // 如果新的元素存在并且类型不同，创建新的 Fiber 节点\n    if (element && !sameType) {\n      newFiber = {\n        type: element.type,\n        // 使用新的类型\n        props: element.props,\n        // 使用新的属性\n        dom: null,\n        // DOM 还没有被创建\n        parent: wipFiber,\n        // 设置父节点\n        alternate: null,\n        // 不指向旧 Fiber\n        effectTag: \"PLACEMENT\" // 标记为新建操作\n      };\n    }\n    // 如果旧的 Fiber 存在并且类型不同，标记为删除\n    if (oldFiber && !sameType) {\n      oldFiber.effectTag = \"DELETION\"; // 标记为删除操作\n      deletions.push(oldFiber); // 将旧的 Fiber 推入删除列表\n    }\n    if (oldFiber) {\n      oldFiber = oldFiber.sibling; // 移动到下一个旧的兄弟节点\n    }\n    if (index === 0) {\n      wipFiber.child = newFiber; // 第一个子节点作为当前 Fiber 的子节点\n    } else if (prevSibling) {\n      prevSibling.sibling = newFiber; // 其他子节点作为兄弟节点\n    }\n    prevSibling = newFiber; // 更新前一个兄弟节点为当前新创建的 Fiber\n    index++; // 移动到下一个子元素\n  }\n}\n\n/**\n * 执行工作单元的主要逻辑\n **/\nfunction performUnitOfWork(fiber) {\n  if (!fiber.dom) {\n    // 如果没有创建 DOM\n    fiber.dom = createDome(fiber); // 创建 DOM 节点\n  }\n  const elements = fiber.props.children; // 获取当前 Fiber 的子元素\n  reconcileChildren(fiber, elements); // 协调子元素，构建 Fiber 树\n\n  if (fiber.child) {\n    // 如果有子节点\n    return fiber.child; // 返回子节点作为下一个工作单元\n  }\n  let nextFiber = fiber; // 向上查找兄弟节点\n  while (nextFiber) {\n    if (nextFiber.sibling) {\n      // 如果有兄弟节点\n      return nextFiber.sibling; // 返回兄弟节点作为下一个工作单元\n    }\n    nextFiber = nextFiber.parent; // 没有兄弟节点则向上查找父节点\n  }\n}\n\n//# sourceURL=webpack://reack16_code/./react/react-dom.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../react */ \"./react/index.js\");\n// import React from \"react\";\n// import React from \"../react\";\n\n// const element = (\n//   <div>\n//     <h1 title=\"foo\">Hello</h1>\n//     <a>测试</a>\n//   </div>\n// );\n\n// const node = document.createElement(element.type);\n// node[\"title\"] = element.props.title;\n\n// const text = document.createTextNode(\"\");\n// text[\"nodeValue\"] = element.props.children;\n\n// node.appendChild(text);\n\n// const container = document.getElementById(\"root\");\n// container.appendChild(node);\n// 使用 ReactDOM.render 来渲染元素\n// ReactDOM.render(element, container);\n\n// const container = document.getElementById(\"root\");\n// React.render(element, container);\n\n\nconst container = document.getElementById(\"root\");\nconst updateValue = e => {\n  rerender(e.target.value);\n};\nconst rerender = value => {\n  const element = /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"div\", null, /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"input\", {\n    onInput: updateValue,\n    value: value\n  }), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"h2\", null, \"Hellow \", value));\n  _react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].render(element, container);\n};\nrerender(\"world\");\n\n//# sourceURL=webpack://reack16_code/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;