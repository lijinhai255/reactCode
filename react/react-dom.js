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
  console.log(params, "parmas");
  // 停止标识
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 执行工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 判断是否需要停止
    // 模拟的情况是咱们自己还得判断下有没有16.67
    shouldYield = deadline.timeRemaining() < 1;
  }
}

requestIdleCallback(workloop);

function performUnitOfWork(fiber) {}
// 超级fiber  的事件
// render  ->  requestIdleCallback ->  workloop -> nextUnitOfWork -> performUnitOfWork
