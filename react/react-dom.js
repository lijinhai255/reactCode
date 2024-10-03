let nextUnitOfWork = null;

export function render(element, container) {
  // memo 是不是整个fiber tree 进行优化

  // 将我们的跟节点设置成为第一个工作单位
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
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
    console.log(nextUnitOfWork, "nextUnitOfWork-nextUnitOfWork");
    // 判断是否需要停止
    // 模拟的情况是咱们自己还得判断下有没有16.67
    shouldYield = deadline.timeRemaining() < 1;
  }
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
