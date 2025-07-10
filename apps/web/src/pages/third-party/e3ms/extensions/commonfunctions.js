export const FormatIntBelow10With0Infront = (_intToCheck) => {
  if (_intToCheck < 10) {
    return `0${_intToCheck}`
  } else {
    return `${_intToCheck}`
  }
}
export const Return0IfUndefinedNullNAOrEmpty = (_intToCheck) => {
  if (
    _intToCheck === undefined ||
    _intToCheck === null ||
    isNaN(_intToCheck) ||
    _intToCheck === ""
  )
    return 0
  else return _intToCheck
}

export const MonthIndexToText = () => {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]
}

export const FormatDateToYYYYMMDDTHHmmSS = (_dateToFormat) => {
  return _dateToFormat.toISOString().replace("T", " ").replace("Z", "")
}
