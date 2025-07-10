// Template
// [
//   {
//     name: "series 1",
//     data: [{ name: "data ppoint  1", y: 2342, drilldown:"series1_1"},{ name: "data ppoint  1", y: 2342, drilldown:"series1_2"}]
//   },
//   {
//     name: "series 2",
//     data: [
//      { name: "data ppoint  1", y: 2342, drilldown:"series2_1"},
//      { name: "data ppoint  1", y: 2342, drilldown:"series2_2"}]
//   },
// ]

// Template
// [
//   {
//     name: "series 1",
//     data: [
//      { name: "data ppoint  1", y: 2342, drilldownData:"series1_1"},
//      { name: "data ppoint  1", y: 2342, drilldownData:"series1_2"}]
//   },
//   {
//     name: "series 2",
//     data: [
//      { name: "data ppoint  1", y: 2342, drilldownData:{//id//,name,data=[{name:,y:,drilldownData:{}}]}},
//      { name: "data ppoint  1", y: 2342, drilldownData:{}}]
//   },
// ]
//    // drilldown 1
//    {
//     id: "series1 1",
//     name: "series1 1",
//     data: [{ name: "data 1", y: 24354, drilldown: "series1 1 1"  },
// { name: "data 2", y: 5674, drilldown: "series1 1 2"  }],
//     // drilldown: true // if want multiple drilldowns
//   },
// store all drilldowndata to drilldownData variable
//
export default function DrilldownCreator(seriesDrilldown) {
  const drilldownData = []
  // has array of series
  // series has array of data
  const seriesNew = []
  // const drilldown = []
  // Loop through the series array
  seriesDrilldown.forEach((singleSeries, index) => {
    // let isDrilldown = false
    // // check if series has drilldownData
    // if (singleSeries.drilldownData !== undefined) {
    //   drilldownData.push(singleSeries.drilldownData)
    //   isDrilldown = true
    // }

    seriesNew.push({ ...singleSeries })

    function GetDrilldown(drillData, name, index) {
      drillData.data.forEach((data, dataIndex) => {
        if (data.drilldownData !== undefined) {
          drilldownData.push({
            id: `${data.name}_${dataIndex}`,
            drilldown: `${name}_${index}`, // need to assigned id so the point is link with the series
            name: data.name,
            y: data.y
          })

          GetDrilldown(data.drilldownData, data.name, data)
        }
      })
    }
    // loop through all data points
    singleSeries.data.forEach((dataPoint, indexPoint) => {
      // check if has drilldown
      if (
        dataPoint.drilldownData !== undefined &&
        dataPoint.drilldownData.data.length > 0
      ) {
        //set the point for drilldown
        seriesNew[index].data[indexPoint] = {
          name: dataPoint.name,
          y: dataPoint.y,
          drilldown: `${dataPoint.name}_${indexPoint}` // if has drilldown will create new series
        }
        // push drilldown data
        drilldownData.push({
          id: `${dataPoint.name}_${indexPoint}`, // need to assigned id so the point is link with the series
          name: dataPoint.name,
          ...dataPoint.drilldownData
        })
        GetDrilldown(dataPoint.drilldownData, dataPoint.name, indexPoint)

        // dataPoint.drilldownData.data.forEach((point, index) => {
        //   console.log(point, index)
        // })
      } else {
        seriesNew[index].data[indexPoint] = {
          name: dataPoint.name,
          y: dataPoint.y
        }
      }
    })
  })
  return { seriesNew, drilldownData }
}
