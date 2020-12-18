import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import "./App.css";

const shouldWrapChild = (id) => {
  return id === "wrap-me";
};

const wrapType = (id) => {
  switch (id) {
    case "wrap-me":
      return "div";
    default:
      return "div";
  }
};

const col1 = "#eb4034";
const col2 = "#FFFFFF";

const toggleColor = (event) => {
  const to255 = (hex) => parseInt(hex, 16);
  const to255All = (hex) =>
    `rgb(${to255(hex.substring(1, 3))}, ${to255(hex.substring(3, 5))}, ${to255(
      hex.substring(5)
    )})`;

  if (event.target.style.color == to255All(col2) || !event.target.style.color) {
    event.target.style.color = col1;
  } else {
    event.target.style.color = col2;
  }
};

const wrapProps = (id) => {
  let props = {};
  switch (id) {
    case "wrap-me":
      props = {
        style: { color: col2 },
        onMouseOver: toggleColor,
        onMouseOut: toggleColor,
      };
      break;
    default:
      break;
  }

  return { ...props, id };
};

const RecursiveWrapper = (props) => {
  console.log(props.children);

  const wrappedChildren = React.Children.map(props.children, (child) => {
    console.log(child.props);
    if (child.props && child.props.children) {
      console.log(child.props);
      if (shouldWrapChild(child.props.id)) {
        return React.createElement(
          wrapType(child.props.id),
          wrapProps(child.props.id),
          React.cloneElement(
            child,
            {},
            <RecursiveWrapper>{child.props.children}</RecursiveWrapper>
          )
        );
      } else {
        return React.cloneElement(
          child,
          {},
          <RecursiveWrapper>{child.props.children}</RecursiveWrapper>
        );
      }
    }

    return child;
  });
  return <React.Fragment>{wrappedChildren}</React.Fragment>;
};

function Viewer() {
  return (
    <div className="App">
      <header className="App-header">
        <Button
          style={{ backgroundColor: "white" }}
          // onClick={(e) => setEditable(!editable)}
        >
          Make {true ? "static" : "responsive"}
        </Button>
        <div
          id="outer"
          style={{
            border: `solid white 2px`,
            borderRadius: "10px",
            margin: "30px",
            padding: "20px",
          }}
        >
          <p id="wrap-me">Hello, world!</p>
        </div>
      </header>
    </div>
  );
}

function App() {
  const [editable, setEditable] = useState(true);
  const [counter, setCounter] = useState(0);

  console.log("render");

  let toRender = (
    <div className="App">
      <header className="App-header">
        <Button
          style={{ backgroundColor: "white" }}
          // onClick={(e) => setEditable(!editable)}
        >
          Make {true ? "static" : "responsive"}
        </Button>
        <div
          id="outer"
          style={{
            border: `solid white 2px`,
            borderRadius: "10px",
            margin: "30px",
            padding: "20px",
          }}
        >
          <p id="wrap-me">Hello, world!</p>
        </div>
      </header>
    </div>
  );

  if (editable) {
    return <RecursiveWrapper>{toRender}</RecursiveWrapper>;
  } else {
    return toRender;
  }
}

export default App;
