// import React from "react";
// import React from "../react";

// const element = (
//   <div>
//     <h1 title="foo">Hello</h1>
//     <a>测试</a>
//   </div>
// );

// const node = document.createElement(element.type);
// node["title"] = element.props.title;

// const text = document.createTextNode("");
// text["nodeValue"] = element.props.children;

// node.appendChild(text);

// const container = document.getElementById("root");
// container.appendChild(node);
// 使用 ReactDOM.render 来渲染元素
// ReactDOM.render(element, container);

// const container = document.getElementById("root");
// React.render(element, container);
import React from "../react"; // 假设你有一个自定义 React 实现

const container = document.getElementById("root");

const updateValue = (e) => {
  console.log(e.target.value, "e.target.value");
  rerender(e.target.value);
};

const rerender = (value) => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );
  React.render(element, container); // 重新渲染整个树
};

rerender("world");
