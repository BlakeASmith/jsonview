/* eslint-disable react/prop-types */
import { useState } from "react";

const THEME = {
	bgColor: "black",
	keyColor: "lightblue",
	stringValueColor: "lightpink",
	literalValueColor: "orange",
	slightIndent: "5px",
	indent: 10,
	indentUnit: "px"
}

function Block({ depth, openchar, closechar, indent, children }) {
  const [curDepth, setDepth] = useState(depth);
  const show = () => setDepth(1);
  const hide = () => setDepth(curDepth - 1);

  const indentAmount = `${THEME.indent * indent}${THEME.indentUnit}`

  return (
    <>
      {curDepth > 0 ?
        <>
          <span onClick={hide}>
            {openchar}
            <span style={{paddingLeft: THEME.slightIndent}}>-</span>
          </span>
		  <div style={{paddingLeft: indentAmount}}>
          	{children}
		  </div>
          <span>{closechar}</span>
        </>
       : 
        <span onClick={show}>
          {openchar} ... {closechar}
        </span>
      }
    </>
  );
}
function ObjectValue({ value, indent, depth }) {
  return (
    <Block depth={depth} openchar="{" closechar="}" indent={indent}>
      <div>
        {Object.entries(value).map(([k, v]) => (
          <JsonKV key={k} keyName={k} value={v} depth={depth - 1} indent={indent + 1} />
        ))}
      </div>
    </Block>
  );
}

function ArrayValue({ value, depth, indent}) {
  return (
    <Block depth={depth} openchar="[" closechar="]" indent={indent}>
      {[...value].map((v) => (
        <div>
          <JsonValue key={v} value={v} depth={depth - 1} indent={indent}/>
          <span>,</span>
        </div>
      ))}
    </Block>
  );
}

function JsonValue({ value, indent = 1, depth = 1 }) {
  if (value === null || value === undefined) {
    return <span style={{color: THEME.literalValueColor}}> undefined</span>;
  }

  switch (typeof value) {
    case "string":
      return <span style={{color: THEME.stringValueColor}}> &quot;{value}&quot;</span>;
    case "number":
      return <span style={{color: THEME.literalValueColor}}> {value}</span>;
    case "boolean":
      return (
        <span style={{color: THEME.literalValueColor}}> {value ? "true" : "false"}</span>
      );
    case "object":
      if (value instanceof Array) {
        return <ArrayValue value={value} indent={indent} depth={depth} />;
      } else {
        return <ObjectValue value={value} indent={indent} depth={depth} />;
      }
  }
}

function JsonKV({ keyName, value, depth = 1, indent = 1 }) {
  return (
    <div>
      <span style={{color: THEME.keyColor}}>&quot;{keyName}&quot;</span>
      <span style={{ paddingRight: "5px" }}>:</span>
      <JsonValue value={value} depth={depth} indent={indent} />
    </div>
  );
}

export default function JsonView({ data, depth = 0 }) {
  return (
	<div style={{background: THEME.bgColor, borderRadius: "9px", padding: "5px"}}>
      <JsonValue
        value={data}
      ></JsonValue>
	</div>
  )
}
