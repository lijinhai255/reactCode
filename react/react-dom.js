let nextUnitOfWork = null;
let wipRoot = null;
export function render(element, container) {
  // memo 是不是整个fiber tree 进行优化

  // 将我们的跟节点设置成为第一个工作单位
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfWork = wipRoot;
}

export function createDome(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  return dom;
  // stack 同步的 不能被中断的
  //   element.props.children.forEach((child) => render(child, dom));
  //   container.appendChild(dom);
  // 心智模型
  // while(下一个工作单元){
  //     下一个工作单元 = 执行工作单元(下一个工作单元丢进去)
  // }
}
/**
 * 处理提交的fiber树
 * @param {*} fiber
 * @returns
 * **/
function commitWork(fiber) {
  //   wipRoot = null;
  if (!fiber) {
    return;
  }
  //   //找到最近的有dom的祖先节点
  //   let dowParentFiber = fiber.parent;
  //   while (!dowParentFiber.dom) {
  //     dowParentFiber = dowParentFiber.parent;
  //   }
  //   // 将fiber的dom添加到父节点上
  //   dowParentFiber.dom.appendChild(fiber.dom);
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  // 递归
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
/**
 * 提交任务，将Fiber tree 渲染为真实DOM
 * **/
function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

/***
 * 工作循环
 *
 */
function workloop(deadline) {
  // 停止标识
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 执行工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 判断是否需要停止
    // 模拟的情况是咱们自己还得判断下有没有16.67
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workloop);
}
requestIdleCallback(workloop);

function performUnitOfWork(fiber) {
  console.log("fiber", fiber);
  if (fiber.dom == null) {
    fiber.dom = createDome(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  const elements = fiber.props.children;

  // 索引 index = 0
  let index = 0;
  // 上一个兄弟节点
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };
    // 将第一个孩子节点设置为fiber的字节点
    if (index === 0) {
      fiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
// 超级fiber  的事件
// render  ->  requestIdleCallback ->  workloop -> nextUnitOfWork -> performUnitOfWork
