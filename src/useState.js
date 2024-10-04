let globalState = {};
let globalSubscribers = {};
let stateIndex = 0;

function useState(initialValue) {
  const currentIndex = stateIndex;
  stateIndex++;
  if (!(currentIndex in globalState)) {
    globalState[currentIndex] = initialValue;
    globalSubscribers[currentIndex] = new Set();
  }
  const setState = (newValue) => {
    let newState = newValue;
    if (typeof newValue === "function") {
      newState = newValue(globalState[currentIndex]);
    }
    globalState[currentIndex] = newState;
    //触发所有的订阅者 ，进行更新
    for (const subscriber of globalSubscribers[currentIndex]) {
      subscriber(newState);
    }
  };
  const subscribe = (subscriber) => {
    globalSubscribers[currentIndex].add(subscriber);
    return () => {
      globalSubscribers[currentIndex].delete(subscriber);
    };
  };
  return [globalState[currentIndex], setState, subscribe];
}

// 使用列子

const [count, setCount, subscribeCount] = useState(0);
subscribeCount((newValue) => {
  console.log("count changeed", newValue);
});

console.log("count", count);

setCount(1); // 更新状态，触发订阅函数
