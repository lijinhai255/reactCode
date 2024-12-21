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
function isEvent(key) {
  return key.startsWith("on");
}
const isProperty = (key) => key !== "children" && !isEvent(key); // 过滤掉 children 属性

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

  //   Object.keys(fiber.props) // 遍历 fiber 的 props
  //     .filter(isProperty) // 过滤掉 children
  //     .forEach((name) => {
  //       dom[name] = fiber.props[name]; // 设置 DOM 属性
  //     });
  updateDom(dom, {}, fiber.props);

  return dom; // 返回创建好的 DOM 节点
}

// 更新 DOM 属性的函数，用于处理 Fiber 树的变化
function updateDom(dom, prevProps, nextProps) {
  console.log("updateDom", dom, prevProps, nextProps);
  // 删除移除的事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      console.log(`Removing event listener: ${eventType}`);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      console.log("移除旧的属性", name);
      dom[name] = "";
    });

  // 设置新的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      console.log("设置新的属性", name);
      dom[name] = nextProps[name];
    });

  // 添加新的事件处理
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      console.log(`Adding event listener: ${eventType}`);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

/**
 * 提交节点，将 Fiber 树提交到真实 DOM
 **/
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    console.log("Updating DOM for:", fiber);
    updateDom(fiber.dom, fiber.alternate.props, fiber.props); // 更新 DOM 属性
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
    return;
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
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
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 获取旧的 Fiber 节点

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type; // 判断新旧节点类型是否相同

    if (sameType) {
      // 类型相同，需要更新
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom, // 复用旧的 DOM
        parent: wipFiber,
        alternate: oldFiber, // 保留旧的 Fiber 以便比较
        effectTag: "UPDATE", // 设置为 UPDATE 标记
      };
      console.log("Set UPDATE effectTag for:", newFiber); // 调试输出
    } else if (element && !sameType) {
      // 如果类型不同，创建新的节点
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null, // 创建新的 DOM
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT", // 新的节点标记为插入
      };
      console.log("Set PLACEMENT effectTag for:", newFiber); // 调试输出
    }

    if (oldFiber && !sameType) {
      // 如果旧的节点存在，但类型不同，标记为删除
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
      console.log("Set DELETION effectTag for:", oldFiber); // 调试输出
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling; // 继续处理下一个旧的节点
    }

    if (index === 0) {
      wipFiber.child = newFiber; // 第一个子节点设置为 fiber 的子节点
    } else if (prevSibling) {
      prevSibling.sibling = newFiber; // 兄弟节点连接
    }

    prevSibling = newFiber;
    index++;
  }
}
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  // 随着当前的函数组件
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 如果没有创建 DOM 节点，则创建
    fiber.dom = createDome(fiber);
    console.log("Created DOM for:", fiber); // 调试输出
  }

  const elements = fiber.props.children;
  reconcileChildren(fiber, elements); // 协调子节点
}
let wipFiber = null;
let hookIndex = null;
export function useState(initial) {
  // 检查是否有酒的hooks
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  console.log(oldHook, "oldHook");
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = typeof action === "function" ? action(hook.state) : action;
  });
  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };
  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
/**
 * 执行工作单元的主要逻辑
 **/
function performUnitOfWork(fiber) {
  // 判断是否是函数组件
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    // 更新函数组件
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child; // 如果有子节点，继续处理子节点
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling; // 返回兄弟节点
    }
    nextFiber = nextFiber.parent; // 否则返回父节点
  }
}
