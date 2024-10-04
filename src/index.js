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

import React from "../react";
const container = document.getElementById("root");

const updateValue = (e) => {
  rerender(e.target.value);
};

const rerender = (value) => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hellow {value}</h2>
    </div>
  );
  React.render(element, container);
};

rerender("world");
