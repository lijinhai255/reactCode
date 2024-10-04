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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createDome: () => (/* binding */ createDome),\n/* harmony export */   render: () => (/* binding */ render)\n/* harmony export */ });\nlet nextUnitOfWork = null; // 保存下一个工作单元（Fiber）\nlet wipRoot = null; // 当前正在工作的 Fiber 树根节点\nlet currentRoot = null; // 上一次提交给 DOM 的 Fiber 树根节点\nlet deletions = []; // 保存需要删除的 Fiber 节点\n\nfunction isNew(prevProps, nextProps) {\n  return key => prevProps[key] !== nextProps[key];\n}\nfunction isGone(prevProps, nextProps) {\n  return key => !(key in nextProps);\n}\nfunction isEvent(key) {\n  return key.startsWith(\"on\");\n}\nconst isProperty = key => key !== \"children\" && !isEvent(key); // 过滤掉 children 属性\n\n// render 函数初始化 Fiber 树并开始工作循环\nfunction render(element, container) {\n  wipRoot = {\n    dom: container,\n    // 保存容器 DOM 节点\n    props: {\n      children: [element] // 将要渲染的 element 放在 props.children 中\n    },\n    alternate: currentRoot // 保存上一次渲染的 Fiber 树以便复用\n  };\n  deletions = []; // 清空删除列表\n  nextUnitOfWork = wipRoot; // 将根节点设为下一个工作单元\n}\n\n// 创建 DOM 节点的方法\nfunction createDome(fiber) {\n  // 创建 DOM 节点\n  const dom = fiber.type === \"TEXT_ELEMENT\" // 如果 Fiber 类型是文本\n  ? document.createTextNode(\"\") // 创建文本节点\n  : document.createElement(fiber.type); // 否则创建普通的 DOM 元素\n\n  //   Object.keys(fiber.props) // 遍历 fiber 的 props\n  //     .filter(isProperty) // 过滤掉 children\n  //     .forEach((name) => {\n  //       dom[name] = fiber.props[name]; // 设置 DOM 属性\n  //     });\n  updateDom(dom, {}, fiber.props);\n  return dom; // 返回创建好的 DOM 节点\n}\n\n// 更新 DOM 属性的函数，用于处理 Fiber 树的变化\nfunction updateDom(dom, prevProps, nextProps) {\n  console.log(\"updateDom\", dom, prevProps, nextProps);\n  // 删除移除的事件\n  Object.keys(prevProps).filter(isEvent).filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key)).forEach(name => {\n    const eventType = name.toLowerCase().substring(2);\n    console.log(`Removing event listener: ${eventType}`);\n    dom.removeEventListener(eventType, prevProps[name]);\n  });\n\n  // 移除旧的属性\n  Object.keys(prevProps).filter(isProperty).filter(isGone(prevProps, nextProps)).forEach(name => {\n    console.log(\"移除旧的属性\", name);\n    dom[name] = \"\";\n  });\n\n  // 设置新的属性\n  Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach(name => {\n    console.log(\"设置新的属性\", name);\n    dom[name] = nextProps[name];\n  });\n\n  // 添加新的事件处理\n  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(name => {\n    const eventType = name.toLowerCase().substring(2);\n    console.log(`Adding event listener: ${eventType}`);\n    dom.addEventListener(eventType, nextProps[name]);\n  });\n}\n\n/**\n * 提交节点，将 Fiber 树提交到真实 DOM\n **/\nfunction commitWork(fiber) {\n  if (!fiber) {\n    return;\n  }\n  const domParent = fiber.parent.dom;\n  if (fiber.effectTag === \"PLACEMENT\" && fiber.dom != null) {\n    domParent.appendChild(fiber.dom);\n  } else if (fiber.effectTag === \"UPDATE\" && fiber.dom != null) {\n    console.log(\"Updating DOM for:\", fiber);\n    updateDom(fiber.dom, fiber.alternate.props, fiber.props); // 更新 DOM 属性\n  } else if (fiber.effectTag === \"DELETION\") {\n    commitDeletion(fiber, domParent);\n    return;\n  }\n  commitWork(fiber.child);\n  commitWork(fiber.sibling);\n}\n\n// 删除 Fiber 节点\nfunction commitDeletion(fiber, domParent) {\n  if (fiber.dom) {\n    domParent.removeChild(fiber.dom); // 从父节点 DOM 中移除\n  } else {\n    commitDeletion(fiber.child, domParent); // 递归删除子节点\n  }\n}\n\n/**\n * 提交整个 Fiber 树\n **/\nfunction commitRoot() {\n  deletions.forEach(commitWork); // 先处理需要删除的 Fiber 节点\n  commitWork(wipRoot.child); // 提交根节点的子节点\n  currentRoot = wipRoot; // 将当前的根节点设置为已经提交的 Fiber 树\n  wipRoot = null; // 清空 wipRoot，表示工作完成\n}\n\n/***\n * 工作循环，持续调度工作单元\n **/\nfunction workloop(deadline) {\n  let shouldYield = false; // 停止标识，表示是否需要让出控制权\n  while (nextUnitOfWork && !shouldYield) {\n    // 如果有下一个工作单元并且不需要停止\n    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); // 执行下一个工作单元\n    shouldYield = deadline.timeRemaining() < 1; // 判断是否需要停止以让出控制权\n  }\n  if (!nextUnitOfWork && wipRoot) {\n    commitRoot(); // 如果没有工作单元并且有需要提交的 Fiber 树，提交 Fiber 树\n  }\n  requestIdleCallback(workloop); // 在空闲时间再次调用工作循环\n}\nrequestIdleCallback(workloop); // 初始化工作循环\n\n/**\n * 协调阶段，处理子元素\n **/\nfunction reconcileChildren(wipFiber, elements) {\n  let index = 0;\n  let prevSibling = null;\n  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 获取旧的 Fiber 节点\n\n  while (index < elements.length || oldFiber != null) {\n    const element = elements[index];\n    let newFiber = null;\n    const sameType = oldFiber && element && element.type === oldFiber.type; // 判断新旧节点类型是否相同\n\n    if (sameType) {\n      // 类型相同，需要更新\n      newFiber = {\n        type: oldFiber.type,\n        props: element.props,\n        dom: oldFiber.dom,\n        // 复用旧的 DOM\n        parent: wipFiber,\n        alternate: oldFiber,\n        // 保留旧的 Fiber 以便比较\n        effectTag: \"UPDATE\" // 设置为 UPDATE 标记\n      };\n      console.log(\"Set UPDATE effectTag for:\", newFiber); // 调试输出\n    } else if (element && !sameType) {\n      // 如果类型不同，创建新的节点\n      newFiber = {\n        type: element.type,\n        props: element.props,\n        dom: null,\n        // 创建新的 DOM\n        parent: wipFiber,\n        alternate: null,\n        effectTag: \"PLACEMENT\" // 新的节点标记为插入\n      };\n      console.log(\"Set PLACEMENT effectTag for:\", newFiber); // 调试输出\n    }\n    if (oldFiber && !sameType) {\n      // 如果旧的节点存在，但类型不同，标记为删除\n      oldFiber.effectTag = \"DELETION\";\n      deletions.push(oldFiber);\n      console.log(\"Set DELETION effectTag for:\", oldFiber); // 调试输出\n    }\n    if (oldFiber) {\n      oldFiber = oldFiber.sibling; // 继续处理下一个旧的节点\n    }\n    if (index === 0) {\n      wipFiber.child = newFiber; // 第一个子节点设置为 fiber 的子节点\n    } else if (prevSibling) {\n      prevSibling.sibling = newFiber; // 兄弟节点连接\n    }\n    prevSibling = newFiber;\n    index++;\n  }\n}\n\n/**\n * 执行工作单元的主要逻辑\n **/\nfunction performUnitOfWork(fiber) {\n  if (!fiber.dom) {\n    // 如果没有创建 DOM 节点，则创建\n    fiber.dom = createDome(fiber);\n    console.log(\"Created DOM for:\", fiber); // 调试输出\n  }\n  const elements = fiber.props.children;\n  reconcileChildren(fiber, elements); // 协调子节点\n\n  if (fiber.child) {\n    return fiber.child; // 如果有子节点，继续处理子节点\n  }\n  let nextFiber = fiber;\n  while (nextFiber) {\n    if (nextFiber.sibling) {\n      return nextFiber.sibling; // 返回兄弟节点\n    }\n    nextFiber = nextFiber.parent; // 否则返回父节点\n  }\n}\n\n//# sourceURL=webpack://reack16_code/./react/react-dom.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../react */ \"./react/index.js\");\n// import React from \"react\";\n// import React from \"../react\";\n\n// const element = (\n//   <div>\n//     <h1 title=\"foo\">Hello</h1>\n//     <a>测试</a>\n//   </div>\n// );\n\n// const node = document.createElement(element.type);\n// node[\"title\"] = element.props.title;\n\n// const text = document.createTextNode(\"\");\n// text[\"nodeValue\"] = element.props.children;\n\n// node.appendChild(text);\n\n// const container = document.getElementById(\"root\");\n// container.appendChild(node);\n// 使用 ReactDOM.render 来渲染元素\n// ReactDOM.render(element, container);\n\n// const container = document.getElementById(\"root\");\n// React.render(element, container);\n // 假设你有一个自定义 React 实现\n\nconst container = document.getElementById(\"root\");\nconst updateValue = e => {\n  console.log(e.target.value, \"e.target.value\");\n  rerender(e.target.value);\n};\nconst rerender = value => {\n  const element = /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"div\", null, /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"input\", {\n    onInput: updateValue,\n    value: value\n  }), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"h2\", null, \"Hello \", value));\n  _react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].render(element, container); // 重新渲染整个树\n};\nrerender(\"world\");\n\n//# sourceURL=webpack://reack16_code/./src/index.js?");

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