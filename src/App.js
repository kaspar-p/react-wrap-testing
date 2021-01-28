import React, { useState, useEffect, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { Replacer } from "react-element-replace";
import "./App.css";

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

function Child(props) {
  return <p id="wrap-me">Hello, {props.name}!</p>;
}

function Viewer(props) {
  const [counter, s] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <Button
          style={{ backgroundColor: "white" }}
          onClick={() => props.setEditable(!props.editable)}
        >
          Make {props.editable ? "static" : "responsive"}
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
          <Child name="Charles" />
        </div>
      </header>
    </div>
  );
}

Viewer.propTypes = PropTypes.outerExact({
  editable: PropTypes.string.isRequired,
});

function App() {
  const [editable, setEditable] = useState(true);

  const view = <Viewer setEditable={setEditable} editable={editable} />;

  const allReplacers = composeReplacers(view);

  if (editable) {
    return allReplacers;
  } else {
    return view;
  }
}

const matchReplacePairs = [
  {
    match: (e) => {
      return e.props ? e.props.id === "wrap-me" : false;
    },
    replace: (child) => (
      <div
        id="new-child-id"
        style={{ color: col2 }}
        onMouseOver={toggleColor}
        onMouseOut={toggleColor}
      >
        {child}
      </div>
    ),
  },
];

const getComponentFromPair = (pair, children) => {
  return (
    <Replacer match={pair.match} replace={pair.replace}>
      {children}
    </Replacer>
  );
};

// Since each <Replacer /> can only execute one "rule" we need a composition of them for as many rules as we have
// This creates a nest of <Replacer /> components each executing one rule.
const composeReplacers = (view) => {
  return matchReplacePairs.reduce(
    (accumulation, currentPair) =>
      getComponentFromPair(currentPair, accumulation),
    view
  );
};

export default App;
