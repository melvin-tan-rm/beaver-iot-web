import React from "react"

function Dropdown(props) {
  const styles = {
    container: {
      display: "inline-block",
      borderRadius: "6px",
      margin: "2px"
    },
    container_select: {
      padding: "5px",
      fontSize: "16px",
      border: "1px solid #000",
      borderRadius: "6px",
      cursor: "pointer",
      outline: "none",
      height: "50px",
      display: "inline-block",
      backgroundColor: "white",
      color: "black",
      fontFamily: "Arial, sans-serif", // Choose a futuristic-looking font
      fontWeight: "bold"
    },
    label: {
      color: "black",
      fontSize: "16px",
      fontWeight: "bold"
    },
    labelSpaces: {
      marginLeft: "4px",
      marginRight: "4px"
    },
    option: {
      borderRadius: "6px",
      display: "inline-block",
      border: "1px solid #000"
    }
  }

  // State to manage the selected value

  // Handler function to update selected value
  const handleSelectChange = (event) => {
    props.select(event.target.value)
  }
  const options = props.options.map((option, index) => (
    <option key={index} value={option} styles={styles.option}>
      {option}
    </option>
  ))

  return (
    <div style={styles.container}>
      <span
        style={{
          ...styles.label,
          ...(props.labelStyle !== undefined ? props.labelStyle : {}),
          ...(props.label !== undefined ? styles.labelSpaces : {})
        }}
      >
        {props.label}
      </span>
      <select
        // disabled={true}
        defaultValue={props.defaultValue}
        style={{
          ...styles.container_select,
          ...(props.selectStyle !== undefined ? props.selectStyle : {})
        }}
        onChange={handleSelectChange}
      >
        {options}
      </select>
    </div>
  )
}

export default Dropdown
