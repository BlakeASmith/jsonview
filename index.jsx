/* eslint-disable react/prop-types */
import "./jsonview.css"
import { useState } from 'react'

/**
 * @typedef {
 *   value: object
 *   depth: int
 * } JsonValueProps
 */

function useCollapse(depth) {
  const [curDepth, setDepth] = useState(depth)

  const show = () => {
    setDepth(1)
  }
  const hide = () => {
    setDepth(curDepth - 1)
  }

  return [curDepth > 0, show, hide]
}

function JsonKey({ keyName }) {
  return <span className="json-key">&quot;{keyName}&quot;</span>
}

function StringValue({ value }) {
  return <span className="json-value "> &quot;{value}&quot;</span>
}

function NumberValue({ value }) {
  return <span className="json-value-number "> {value}</span>
}

function BooleanValue({ value }) {
  return <span className="json-value-bool "> {value ? 'true' : 'false'}</span>
}

function UndefinedValue() {
  return <span className="json-value-number "> undefined</span>
}

function ObjectValue({ value, isRoot, depth }) {
  const upperIndentLevel = isRoot === true ? 'indent-slight' : 'indent-slight'
  const bodyIndentLevel = isRoot === true ? 'indented-1' : 'indented-2'
  const lowerIndentlevel = isRoot === true ? 'indent-slight' : 'indented-1'

  const [shouldShow, show, hide] = useCollapse(depth)

  return (
    <>
      {shouldShow ? (
        <>
          <span className={upperIndentLevel} onClick={hide}>
            &#123;<span className="indented-slight">-</span>
          </span>
          <div className={bodyIndentLevel}>
            {Object.entries(value).map(([k, v]) => (
              <JsonKV key={k} keyName={k} value={v} depth={depth - 1} />
            ))}
          </div>
          <span className={lowerIndentlevel}>&#125;</span>
        </>
      ) : (
        <span className="elipsis" onClick={show}>
          &#123; ... &#125;
        </span>
      )}
    </>
  )
}

function ArrayValue({ value, depth }) {
  const [shouldShow, show, hide] = useCollapse(depth)
  return (
    <>
      {shouldShow ? (
        <>
          <span className="indented-slight" onClick={hide}>
            &#91; <span className="indented-slight">-</span>
          </span>
          {[...value].map((v) => (
            // eslint-disable-next-line react/jsx-key
            <div className="indented-1">
              <span className="indented-1">
                <JsonValue key={v} value={v} depth={depth - 1} />
              </span>
              <span>,</span>
            </div>
          ))}
          <span className="indented-1">&#93;</span>
        </>
      ) : (
        <span className="indented-slight elipsis" onClick={show}>
          &#91; ... &#93;
        </span>
      )}
    </>
  )
}

function JsonValue({ value, isRoot, depth }) {
  if (value === null) {
    return <UndefinedValue></UndefinedValue>
  }

  switch (typeof value) {
    case 'string':
      return <StringValue value={value} />
    case 'number':
      return <NumberValue value={value} />
    case 'boolean':
      return <BooleanValue value={value} />
    case 'undefined':
      return <UndefinedValue />
    case 'object':
      if (value instanceof Array) return <ArrayValue value={value} isRoot={isRoot} depth={depth} />
      else return <ObjectValue value={value} isRoot={isRoot} depth={depth} />
    case 'function':
      return <p>Not Implemented</p>
  }
}

function JsonKV({ keyName, value, depth }) {
  return (
    <>
      <div className="json-kv">
        <JsonKey keyName={keyName} />:
        <JsonValue value={value} depth={depth} />
      </div>
    </>
  )
}

function JsonContainer({ children }) {
  return <div className="json-object">{children}</div>
}

export default function JsonView({ data, depth=0 }) {
  return (
    <JsonContainer>
      <JsonValue type={'source'} value={data} isRoot={true} depth={depth}></JsonValue>
    </JsonContainer>
  )
}
