import React, { useEffect, useState } from "react"

function NavigationButtons(props) {
  const [selectedNav, setSelectedNav] = useState(props.defaultNav || null)

  const styles = {
    nav: {
      display: "flex",
      flex: 1,
      flexDirection: props.direction,
      color: "white",
      backgroundColor: "#002F5D",
      alignItems: "center"
    },
    navItem: {
      backgroundColor: "#002F5D",
      fontSize: "24px",
      border: "0px",
      padding: "10px",
      color: "white",
      border: "none",
      background: "none",
      width: "100%"
    },
    navItemSelected: {
      backgroundColor: "white",
      color: "black"
    }
  }

  // Handler function to update selected value
  const handleSelectChange = (nav) => {
    setSelectedNav(nav)
    props.onClick(nav)
  }

  const navButtons = props.navs.map((nav) => (
    <button
      key={nav}
      value={nav}
      onClick={() => handleSelectChange(nav)}
      style={{
        ...styles.navItem,
        ...(props.customNavItemStyle !== undefined
          ? props.customNavItemStyle
          : {}),
        ...(selectedNav === nav
          ? props.customSelectItemStyle !== undefined
            ? props.customSelectItemStyle
            : styles.navItemSelected
          : {})
      }}
    >
      {nav}
    </button>
  ))

  useEffect(() => {}, [selectedNav])

  return (
    <div style={{ ...styles.nav, ...props.customNavStyle }}>{navButtons}</div>
  )
}

export default NavigationButtons
