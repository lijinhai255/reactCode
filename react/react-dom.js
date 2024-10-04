let nextUnitOfWork = null; // 保存下一个工作单元（Fiber）
let wipRoot = null; // 当前正在工作的 Fiber 树根节点
let currentRoot = null; // 上一次提交给 DOM 的 Fiber 树根节点
let deletions = []; // 保存需要删除的 Fiber 节点

function isNew(prevProps, nextProps) {
  return (key) => prevProps[key] !== nextProps[key];
}
function isGone(prevProps, nextProps) {
  return (key) => !(key in nextProps);
}

// render 函数初始化 Fiber 树并开始工作循环
export function render(element, container) {
  wipRoot = {
    dom: container, // 保存容器 DOM 节点
    props: {
      children: [element], // 将要渲染的 element 放在 props.children 中
    },
    alternate: currentRoot, // 保存上一次渲染的 Fiber 树以便复用
  };
  deletions = []; // 清空删除列表
  nextUnitOfWork = wipRoot; // 将根节点设为下一个工作单元
}

// 创建 DOM 节点的方法
export function createDome(fiber) {
  // 创建 DOM 节点
  const dom =
    fiber.type === "TEXT_ELEMENT" // 如果 Fiber 类型是文本
      ? document.createTextNode("") // 创建文本节点
      : document.createElement(fiber.type); // 否则创建普通的 DOM 元素

  const isProperty = (key) => key !== "children"; // 过滤掉 children 属性
  Object.keys(fiber.props) // 遍历 fiber 的 props
    .filter(isProperty) // 过滤掉 children
    .forEach((name) => {
      dom[name] = fiber.props[name]; // 设置 DOM 属性
    });

  return dom; // 返回创建好的 DOM 节点
}

// 更新 DOM 属性的函数，用于处理 Fiber 树的变化
function updateDom(dom, prevProps, nextProps) {
  // 删除移除的事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2); // 从属性名称中提取事件类型
      dom.removeEventListener(eventType, prevProps[name]); // 移除旧的事件监听
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty) // 过滤掉 children
    .filter(isGone(prevProps, nextProps)) // 检查属性是否已不存在
    .forEach((name) => {
      dom[name] = ""; // 移除属性
    });

  // 设置新的属性
  Object.keys(nextProps)
    .filter(isProperty) // 过滤掉 children
    .filter(isNew(prevProps, nextProps)) // 检查新属性
    .forEach((name) => {
      dom[name] = nextProps[name]; // 更新 DOM 的属性
    });

  // 添加新的事件处理
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps)) // 检查是否是新的事件
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2); // 获取事件类型
      dom.addEventListener(eventType, nextProps[name]); // 添加新的事件监听
    });
}

/**
 * 提交节点，将 Fiber 树提交到真实 DOM
 **/
function commitWork(fiber) {
  if (!fiber) {
    return; // 如果 Fiber 节点不存在，直接返回
  }

  const domParent = fiber.parent.dom; // 找到父节点的 DOM

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 如果是新建节点并且 DOM 不为空
    domParent.appendChild(fiber.dom); // 将新节点添加到父节点 DOM
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 如果是更新节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props); // 更新 DOM 属性
  } else if (fiber.effectTag === "DELETION") {
    // 如果是删除节点
    commitDeletion(fiber, domParent); // 执行删除操作
    return; // 删除节点后不再处理其子节点
  }

  commitWork(fiber.child); // 递归处理子节点
  commitWork(fiber.sibling); // 递归处理兄弟节点
}

// 删除 Fiber 节点
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom); // 从父节点 DOM 中移除
  } else {
    commitDeletion(fiber.child, domParent); // 递归删除子节点
  }
}

/**
 * 提交整个 Fiber 树
 **/
function commitRoot() {
  deletions.forEach(commitWork); // 先处理需要删除的 Fiber 节点
  commitWork(wipRoot.child); // 提交根节点的子节点
  currentRoot = wipRoot; // 将当前的根节点设置为已经提交的 Fiber 树
  wipRoot = null; // 清空 wipRoot，表示工作完成
}

/***
 * 工作循环，持续调度工作单元
 **/
function workloop(deadline) {
  let shouldYield = false; // 停止标识，表示是否需要让出控制权
  while (nextUnitOfWork && !shouldYield) {
    // 如果有下一个工作单元并且不需要停止
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); // 执行下一个工作单元
    shouldYield = deadline.timeRemaining() < 1; // 判断是否需要停止以让出控制权
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot(); // 如果没有工作单元并且有需要提交的 Fiber 树，提交 Fiber 树
  }

  requestIdleCallback(workloop); // 在空闲时间再次调用工作循环
}

requestIdleCallback(workloop); // 初始化工作循环

/**
 * 协调阶段，处理子元素
 **/
function reconcileChildren(wipFiber, elements) {
  let index = 0; // 子元素索引
  let prevSibling = null; // 记录上一个兄弟 Fiber 节点
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 获取旧的 Fiber 节点

  while (index < elements.length || oldFiber != null) {
    const element = elements[index]; // 获取当前要处理的元素
    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type; // 判断新旧节点类型是否相同
    // 类型相同，需要更新
    if (sameType) {
      newFiber = {
        type: oldFiber.type, // 类型保持不变
        props: element.props, // 更新新的属性
        dom: oldFiber.dom, // 复用旧的 DOM 节点
        parent: wipFiber, // 设置父节点为当前工作 Fiber
        alternate: oldFiber, // 指向旧的 Fiber 以便比较
        effectTag: "UPDATE", // 标记为更新操作
      };
    }
    // 如果新的元素存在并且类型不同，创建新的 Fiber 节点
    if (element && !sameType) {
      newFiber = {
        type: element.type, // 使用新的类型
        props: element.props, // 使用新的属性
        dom: null, // DOM 还没有被创建
        parent: wipFiber, // 设置父节点
        alternate: null, // 不指向旧 Fiber
        effectTag: "PLACEMENT", // 标记为新建操作
      };
    }
    // 如果旧的 Fiber 存在并且类型不同，标记为删除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"; // 标记为删除操作
      deletions.push(oldFiber); // 将旧的 Fiber 推入删除列表
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling; // 移动到下一个旧的兄弟节点
    }

    if (index === 0) {
      wipFiber.child = newFiber; // 第一个子节点作为当前 Fiber 的子节点
    } else if (prevSibling) {
      prevSibling.sibling = newFiber; // 其他子节点作为兄弟节点
    }

    prevSibling = newFiber; // 更新前一个兄弟节点为当前新创建的 Fiber
    index++; // 移动到下一个子元素
  }
}

/**
 * 执行工作单元的主要逻辑
 **/
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    // 如果没有创建 DOM
    fiber.dom = createDome(fiber); // 创建 DOM 节点
  }

  const elements = fiber.props.children; // 获取当前 Fiber 的子元素
  reconcileChildren(fiber, elements); // 协调子元素，构建 Fiber 树

  if (fiber.child) {
    // 如果有子节点
    return fiber.child; // 返回子节点作为下一个工作单元
  }

  let nextFiber = fiber; // 向上查找兄弟节点
  while (nextFiber) {
    if (nextFiber.sibling) {
      // 如果有兄弟节点
      return nextFiber.sibling; // 返回兄弟节点作为下一个工作单元
    }
    nextFiber = nextFiber.parent; // 没有兄弟节点则向上查找父节点
  }
}
