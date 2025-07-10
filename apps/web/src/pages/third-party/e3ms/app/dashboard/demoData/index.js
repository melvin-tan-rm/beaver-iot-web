export const Demodata = () => {
  return {
    Data: [
      {
        name: "greenroom1",
        points: [5, 420, 155, 420, 180, 270, 35, 270],
        fill: ["#00ff00aa", "#ff0000aa", "#aaffaa77"],
        data: ["350lx", "16ppl", "25.6°C"]
      },
      {
        name: "greenroom2",
        points: [165, 360, 265, 360, 275, 285, 175, 285],
        fill: ["#00ff00aa", "#ff0000aa", "#aaffaa77"],
        data: ["350lx", "16ppl", "25.6°C"]
      },
      {
        name: "greenroom3",
        points: [155, 420, 260, 420, 265, 365, 165, 365],
        fill: ["#00ff00aa", "#ff0000aa", "#aaffaa77"],
        data: ["350lx", "16ppl", "25.6°C"]
      },
      {
        name: "greenroom4",
        // prettier-ignore
        points: [420, 175, 555, 175, 555, 145, 590, 145, 595, 235, 430, 235, 415, 225],
        fill: ["#00ff00aa", "#ff0000aa", "#aaffaa77"],
        data: ["350lx", "16ppl", "25.6°C"]
      },
      {
        name: "greenroom5",
        points: [630, 380, 700, 445, 765, 385, 690, 325],
        fill: ["#00ff00aa", "#ff0000aa", "#aaffaa77"],
        data: ["350lx", "16ppl", "25.6°C"]
      },
      {
        name: "redroom1",
        points: [405, 400, 505, 400, 505, 235, 415, 235],
        fill: ["#ff0000aa", "#aaffaa77", "#00ff00aa"],
        data: ["620lx", "0ppl", "25.6°C"]
      },
      {
        name: "whiteroom1",
        points: [260, 440, 405, 440, 410, 275, 275, 275],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom2",
        points: [255, 225, 415, 225, 425, 30, 290, 30, 290, 80, 270, 80],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom3",
        points: [440, 80, 555, 80, 555, 175, 420, 175, 420, 125, 440, 125],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom4",
        points: [555, 80, 590, 80, 590, 145, 555, 145],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom5",
        points: [505, 335, 615, 335, 645, 365, 690, 320, 635, 275, 505, 275],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom6",
        points: [
          730, 530, 860, 650, 1060, 410, 935, 315, 850, 395, 810, 365, 780, 400,
          820, 435
        ],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom7",
        points: [
          595, 240, 655, 240, 710, 280, 805, 190, 745, 150, 645, 150, 645, 200,
          595, 200
        ],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom8",
        points: [591, 199, 644, 199, 644, 150, 591, 150],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom9",
        points: [710, 280, 815, 370, 905, 270, 825, 210, 765, 265, 745, 250],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      },
      {
        name: "whiteroom10",
        points: [745, 250, 765, 265, 825, 210, 805, 195],
        fill: ["#aaffaa77", "#00ff00aa", "#ff0000aa"],
        data: ["240lx", "3ppl", "28.4°C"]
      }
    ]
  }
}

export const DemoMapData = () => {
  return {
    Data: [
      {
        name: "MICE",
        formalName: "Ang Mo Kio Central Branch",
        position: [1.3711, 103.8469],
        icon: "red",
        type: "3D"
      },
      {
        name: "ASM",
        formalName: "Bishan Branch",
        position: [1.3505, 103.849],
        icon: "Green",
        type: "2D"
      },
      {
        name: "Theatre",
        formalName: "Bukit Timah Branch",
        position: [1.3388, 103.7782],
        icon: "Green",
        type: "3D"
      },
      {
        name: "Hotel",
        formalName: "Choa Chu Kang Branch",
        position: [1.3841, 103.7432],
        icon: "Green",
        type: "3D"
      },
      {
        name: "Casino",
        formalName: "Clementi Central Branch",
        position: [1.3141, 103.7645],
        icon: "Green",
        type: "3D"
      }
    ]
  }
}
export const DemoCostListData = () => {
  return {
    allData: [
      {
        id: "MICE",
        LocationName: "MICE",
        Cost: 37606075,
        hidden_costPercent: "-3%",
        EnergyUse: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        hidden_usePercent: "-2%",
        UnitCost: "$ 0.127 /kW"
      },
      {
        id: "ASM",
        LocationName: "ASM",
        Cost: 486869,
        hidden_costPercent: "-3%",
        EnergyUse: [5, 5, 4, 5, 5, 5, 4],
        hidden_usePercent: "-2%",
        UnitCost: "$ 0.127 /kW"
      },
      {
        id: "Hotel",
        LocationName: "Hotel",
        Cost: 486869,
        hidden_costPercent: "+3%",
        EnergyUse: [1, 2, 3, 4, 5, 5, 6],
        hidden_usePercent: "+2%",
        UnitCost: "$ 0.127 /kW"
      },
      {
        id: "Theatre",
        LocationName: "Theatre",
        Cost: 486869,
        hidden_costPercent: "+3%",
        EnergyUse: [11, 21, 31, 41, 51, 61, 71],
        hidden_usePercent: "+2%",
        UnitCost: "$ 0.127 /kW"
      },
      {
        id: "SkyPark",
        LocationName: "Sky Park",
        Cost: 486869,
        hidden_costPercent: "+3%",
        EnergyUse: [1, 2, 3, 4, 5, 6, 7],
        hidden_usePercent: "+2%",
        UnitCost: "$ 0.127 /kW"
      },
      {
        id: "Casino",
        LocationName: "Casino",
        Cost: 486869,
        hidden_costPercent: "-3%",
        EnergyUse: [5, 5, 4, 5, 5, 5, 4],
        hidden_usePercent: "-2%",
        UnitCost: "$ 0.127 /kW"
      }
    ]
  }
}
export const DemoListData = () => {
  return {
    allData: [
      {
        id: "DBSAMKCentral",
        Rank: -1,
        LocationName: "MICE",
        Type: "Retail",
        Area: (Math.random() * 2 * 500).toFixed(2),
        EUI: (Math.random() * 2 * 50).toFixed(2)
      },
      {
        id: "DBSBishan",
        Rank: -1,
        LocationName: "ASM",
        Type: "ASM",
        Area: (Math.random() * 2 * 500).toFixed(2),
        EUI: (Math.random() * 2 * 50).toFixed(2)
      },
      {
        id: "DBSBukitTimah",
        Rank: -1,
        LocationName: "Theatre",
        Type: "Theatre",
        Area: (Math.random() * 2 * 500).toFixed(2),
        EUI: (Math.random() * 2 * 50).toFixed(2)
      },
      {
        id: "DBSCCK",
        Rank: -1,
        LocationName: "Hotel",
        Type: "Hotel",
        Area: (Math.random() * 2 * 500).toFixed(2),
        EUI: (Math.random() * 2 * 50).toFixed(2)
      },
      {
        id: "DBSCLEMENTICENT",
        Rank: -1,
        LocationName: "Casino",
        Type: "Casino",
        Area: (Math.random() * 2 * 500).toFixed(2),
        EUI: (Math.random() * 2 * 50).toFixed(2)
      }
    ]
  }
}
export const DemoTreeData = () => {
  return {
    Data: [
      {
        label: "Main",
        key: "DBSAMKCentral2",
        floorPlansURL:
          "APHQ.png;L1_Production.png;L2_Production.png;L3_Production.png",
        deviceIds:
          "24e124707c406981;24e124710c140647;0000000000000001;0000000000000010",
        EnergyConsumptioniframeId: "145",
        EnergyUseBreakdowniframeId: "48",
        SpaceZoningBreakdowniframeId: "49",
        TargetVsYTDiframeId: "50",
        address: "Blk 712A Ang Mo Kio Avenue 6 #01-4066 Singapore 561712"
      },
      {
        label: "MICE",
        key: "DBSAMKCentral",
        floorPlansURL:
          "APHQ.png;L1_Production.png;L2_Production.png;L3_Production.png",
        deviceIds:
          "24e124707c406981;24e124710c140647;0000000000000001;0000000000000010",
        EnergyConsumptioniframeId: "145",
        EnergyUseBreakdowniframeId: "48",
        SpaceZoningBreakdowniframeId: "49",
        TargetVsYTDiframeId: "50",
        address: "Blk 712A Ang Mo Kio Avenue 6 #01-4066 Singapore 561712"
      },
      {
        label: "ASM",
        key: "DBSBishan",
        floorPlansURL:
          "APHQ.png;L1_Production.png;L2_Production.png;L3_Production.png",
        deviceIds:
          "24e124707c406981;24e124710c140647;0000000000000001;0000000000000010",
        EnergyConsumptioniframeId: "196",
        EnergyUseBreakdowniframeId: "162",
        SpaceZoningBreakdowniframeId: "165",
        TargetVsYTDiframeId: "168",
        address:
          "9 Bishan Place #01-14 Junction 8 Shopping Centre Singapore 579837"
      },
      {
        label: "Theatre",
        key: "DBSBukitTimah",
        floorPlansURL:
          "APHQ.png;L1_Production.png;L2_Production.png;L3_Production.png",
        deviceIds:
          "24e124707c406981;24e124710c140647;0000000000000001;0000000000000010",
        EnergyConsumptioniframeId: "205",
        EnergyUseBreakdowniframeId: "163",
        SpaceZoningBreakdowniframeId: "166",
        TargetVsYTDiframeId: "169",
        address:
          "1 Jalan Anak Bukit #01-19/20 Bukit Timah Plaza Singapore 588996"
      },
      {
        label: "Hotel",
        key: "DBSCCK",
        floorPlansURL:
          "APHQ.png;L1_Production.png;L2_Production.png;L3_Production.png",
        deviceIds:
          "24e124707c406981;24e124710c140647;0000000000000001;0000000000000010",
        iframeId: "",
        iframeLink: "http://10.211.9.120:7011/admin/dashboard/Ext/107"
      },
      {
        label: "Casino",
        key: "DBSCLEMENTICENT",
        floorPlansURL:
          "APHQ.png;L1_Production.png;L2_Production.png;L3_Production.png",
        deviceIds:
          "24e124707c406981;24e124710c140647;0000000000000001;0000000000000010",
        iframeId: "",
        iframeLink: ""
      }
    ]
  }
}
