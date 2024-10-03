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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createDome: () => (/* binding */ createDome),\n/* harmony export */   render: () => (/* binding */ render)\n/* harmony export */ });\nlet nextUnitOfWork = null;\nfunction render(element, container) {\n  // memo 是不是整个fiber tree 进行优化\n\n  // 将我们的跟节点设置成为第一个工作单位\n  nextUnitOfWork = {\n    dom: container,\n    props: {\n      children: [element]\n    }\n  };\n}\nfunction createDome(fiber) {\n  const dom = fiber.type === \"TEXT_ELEMENT\" ? document.createTextNode(\"\") : document.createElement(fiber.type);\n  const isProperty = key => key !== \"children\";\n  Object.keys(fiber.props).filter(isProperty).forEach(name => {\n    dom[name] = fiber.props[name];\n  });\n  return dom;\n  // stack 同步的 不能被中断的\n  //   element.props.children.forEach((child) => render(child, dom));\n  //   container.appendChild(dom);\n  // 心智模型\n  // while(下一个工作单元){\n  //     下一个工作单元 = 执行工作单元(下一个工作单元丢进去)\n  // }\n}\n/***\n * 工作循环\n *\n */\nfunction workloop(deadline) {\n  // 停止标识\n  let shouldYield = false;\n  while (nextUnitOfWork && !shouldYield) {\n    // 执行工作单元\n    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);\n    console.log(nextUnitOfWork, \"nextUnitOfWork-nextUnitOfWork\");\n    // 判断是否需要停止\n    // 模拟的情况是咱们自己还得判断下有没有16.67\n    shouldYield = deadline.timeRemaining() < 1;\n  }\n}\nrequestIdleCallback(workloop);\nfunction performUnitOfWork(fiber) {\n  console.log(\"fiber\", fiber);\n  if (fiber.dom == null) {\n    fiber.dom = createDome(fiber);\n  }\n  if (fiber.parent) {\n    fiber.parent.dom.appendChild(fiber.dom);\n  }\n  const elements = fiber.props.children;\n\n  // 索引 index = 0\n  let index = 0;\n  // 上一个兄弟节点\n  let prevSibling = null;\n  while (index < elements.length) {\n    const element = elements[index];\n    const newFiber = {\n      type: element.type,\n      props: element.props,\n      parent: fiber,\n      dom: null\n    };\n    // 将第一个孩子节点设置为fiber的字节点\n    if (index === 0) {\n      fiber.child = newFiber;\n    } else if (element) {\n      prevSibling.sibling = newFiber;\n    }\n    prevSibling = newFiber;\n    index++;\n  }\n  if (fiber.child) {\n    return fiber.child;\n  }\n  let nextFiber = fiber;\n  while (nextFiber) {\n    if (nextFiber.sibling) {\n      return nextFiber.sibling;\n    }\n    nextFiber = nextFiber.parent;\n  }\n}\n// 超级fiber  的事件\n// render  ->  requestIdleCallback ->  workloop -> nextUnitOfWork -> performUnitOfWork\n\n//# sourceURL=webpack://reack16_code/./react/react-dom.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../react */ \"./react/index.js\");\n// import React from \"react\";\n\nconst element = /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"div\", null, /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"h1\", {\n  title: \"foo\"\n}, \"Hello\"), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createElement(\"a\", null, \"\\u6D4B\\u8BD5\"));\n\n// const node = document.createElement(element.type);\n// node[\"title\"] = element.props.title;\n\n// const text = document.createTextNode(\"\");\n// text[\"nodeValue\"] = element.props.children;\n\n// node.appendChild(text);\n\n// const container = document.getElementById(\"root\");\n// container.appendChild(node);\n// 使用 ReactDOM.render 来渲染元素\n// ReactDOM.render(element, container);\n\nconst container = document.getElementById(\"root\");\n_react__WEBPACK_IMPORTED_MODULE_0__[\"default\"].render(element, container);\n\n//# sourceURL=webpack://reack16_code/./src/index.js?");

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