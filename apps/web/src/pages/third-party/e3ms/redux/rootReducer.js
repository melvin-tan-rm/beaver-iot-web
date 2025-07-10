// ** Reducers Imports
//import navbar from "./navbar"
//import layout from "./layout"
//import auth from "./authentication"
import coreApp from "@coremodules/store"
// import dataTables from "@src/views/tables/data-tables/store"
// import appMeter from "@src/views/modules/e3ms/meterreport/store"

// // IOT
// import power from "@src/views/modules/iot/modules/power/store"
// import iaq from "@src/views/modules/iot/modules/iaq/store"
// import water from "@src/views/modules/iot/modules/water/store"
// import temp from "@src/views/modules/iot/modules/temp/store"

// // CORE
// import navBreadcrumb from "@src/views/modules/core/store"
// import portfolio from "@src/views/modules/core/portfolio/store"
// import building from "@src/views/modules/core/building/store"
// import equipment from "@src/views/modules/core/equipment/store"
// import equipmentgroup from "@src/views/modules/core/equipmentgroup/store"
// import equipmenttype from "@src/views/modules/core/equipmenttype/store"
// import equipmentmaintype from "@src/views/modules/core/equipmentmaintype/store"
// import equipmentdocument from "@src/views/modules/core/equipmentdocument/store"
// import service from "@src/views/modules/core/service/store"
// import servicetype from "@src/views/modules/core/servicetype/store"
// import servicemaintype from "@src/views/modules/core/servicemaintype/store"
// import uom from "@src/views/modules/core/uom/store"
// import user from "@src/views/modules/core/user/store"
// import technician from "@src/views/modules/core/technician/store"
// import location from "@src/views/modules/core/location/store"
// import facility from "@src/views/modules/core/facility/store"
// import datasource from "@src/views/modules/core/datasource/store"
// import floor from "@src/views/modules/core/floor/store"
// import area from "@src/views/modules/core/area/store"
// import room from "@src/views/modules/core/room/store"
// import group from "@src/views/modules/core/group/store"
// import country from "@src/views/modules/core/country/store"
// import setting from "@src/views/modules/core/setting/WOsettings/store"
// import treehierachy from "@src/views/modules/core/treehierachy/store"
// import equipmenthistory from "@src/views/modules/core/equipmentreport/equipmenthistory/store"
// import equipmentdowntime from "@src/views/modules/core/equipmentreport/equipmentdowntime/store"
// import report from "@coremodules/report/store"
// import dashboardprofile from "@coremodules/dashboard/profile/setup/store"
// import dashboardtab from "@coremodules/dashboard/tab/setup/store"
// import dashboardchart from "@coremodules/dashboard/chart/setup/store"
// import dashboardpoint from "@coremodules/dashboard/point/setup/store"
// import invoiceelectricity from "@e3msmodules/invoice-electricity/config/store"
// import invoicepoint from "@e3msmodules/invoice-electricity/point-mapping/store"

// // RMMS
// import make from "@src/views/modules/rmms/make/store"
// import equipmenttaskandschedule from "@src/views/modules/rmms/equipmenttaskandschedule/store"
// import model from "@src/views/modules/rmms/model/store"
// import requestdescription from "@src/views/modules/rmms/requestdescription/store"
// import servicerequest from "@src/views/modules/rmms/servicerequest/store"
// import shift from "@src/views/modules/rmms/shift/store"
// import skill from "@src/views/modules/rmms/skill/store"
// import task from "@src/views/modules/rmms/task/store"
// import team from "@src/views/modules/rmms/team/store"
// import teamstosystemtype from "@src/views/modules/rmms/teamstosystemtype/store"
// import teamdetail from "@src/views/modules/rmms/teamdetail/store"
// import weekoff from "@src/views/modules/rmms/weekoff/store"
// import workorder from "@src/views/modules/rmms/workorder/store"
// import dashboardinfo from "@src/views/modules/rmms/dashboard/dashboardinfo/store"
// import servicerequestopenedfortheweek from "@src/views/modules/rmms/dashboard/graphs/servicerequestopenedfortheweek/store"
// import servicerequestopenedmonthly from "@src/views/modules/rmms/dashboard/graphs/servicerequestopenedmonthly/store"
// import overduepmsmonthly from "@src/views/modules/rmms/dashboard/graphs/overduepmsmonthly/store"
// import responsewithin10mins from "@src/views/modules/rmms/dashboard/graphs/responsewithin10mins/store"
// import responsewithinsameday from "@src/views/modules/rmms/dashboard/graphs/responsewithinsameday/store"
// import timetorespond from "@src/views/modules/rmms/dashboard/graphs/timetorespond/store"
// import workorderdocument from "@src/views/modules/rmms/workorderdocument/store"
// import ppmschedule from "@src/views/modules/rmms/ppmschedule/store"
// import severity from "@src/views/modules/rmms/severity/store"
// import priority from "@src/views/modules/rmms/priority/store"
// import scheduletask from "@src/views/modules/rmms/scheduletask/store"
// import equipmentschedule from "@src/views/modules/rmms/equipmentschedule/store"
// import workforce from "@src/views/modules/rmms/workforce/store"
// import basalarm from "@src/views/modules/rmms/basalarm/store"
// import servicereport from "@src/views/modules/rmms/servicereport/store"
// import basruntime from "@src/views/modules/rmms/basruntime/store"
// import vendor from "@src/views/modules/rmms/vendor/store"
// import knowledgebase from "@src/views/modules/rmms/knowledgebase/store"
// import documents from "@src/views/modules/rmms/documents/store"
// import workorderrepeated from "@src/views/modules/rmms/helpdeskreport/repeatedworkorders/store"
// import workorderdetails from "@src/views/modules/rmms/helpdeskreport/workorderdetails/store"
// import workforcelist from "@src/views/modules/rmms/workforcereport/workforcelist/store"
// import workforceattendance from "@src/views/modules/rmms/workforcereport/workforceattendance/store"
// import tenant from "@src/views/modules/tenant/tenantreport/store"

// // e3ms
// import e3msSetting from "@src/views/modules/e3ms/settings/store"
// import dashboardchartSetting from "@src/views/modules/core/dashboard/popout/setup/index"
// import userSetting from "@src/views/modules/core/setting/Usersetting/store"
// import meterreport from "@src/views/modules/e3ms/meterreport/store"

// // unfinished, not yet linked to backend data
// import inventory from "@src/views/modules/rmms/inventory/store"
// import storesetup from "@src/views/modules/rmms/storesetup/store"
// import INV_MaterialRequest from "@src/views/modules/rmms/INV_MaterialRequest/store"
// import INV_MaterialRequestTrans from "@src/views/modules/rmms/INV_MaterialRequestTrans/store"
// import returnmaterial from "@src/views/modules/rmms/returnmaterial/store"
// import storetostore from "@src/views/modules/rmms/storetostore/store"
// import storerack from "@src/views/modules/rmms/storerack/store"
// import parttype from "@src/views/modules/rmms/parttype/store"
// import purchaserequired from "@src/views/modules/rmms/purchaserequired/store"
// import defecttracking from "@src/views/modules/rmms/defecttracking/store"
// import stockdetails from "@src/views/modules/rmms/stockdetails/store"
// import customerfeedback from "@src/views/modules/rmms/customerfeedback/store"
// import part from "@src/views/modules/rmms/part/store"
// import bom from "@src/views/modules/rmms/bom/store"
// import INV_Material from "@src/views/modules/rmms/INV_Material/store"
// import store from "@src/views/modules/rmms/store/store"

const rootReducer = {
  coreApp,
  // auth,
  // navbar,
  // layout,
  // appMeter,
  // portfolio,
  // building,
  // equipment,
  // equipmentgroup,
  // equipmenttype,
  // equipmentmaintype,
  // equipmentdocument,
  // uom,
  // user,
  // technician,
  // location,
  // facility,
  // datasource,
  // service,
  // servicetype,
  // servicemaintype,
  // make,
  // equipmenttaskandschedule,
  // model,
  // requestdescription,
  // servicerequest,
  // shift,
  // skill,
  // task,
  // team,
  // teamstosystemtype,
  // teamdetail,
  // weekoff,
  // workorder,
  // dashboardinfo,
  // servicerequestopenedfortheweek,
  // servicerequestopenedmonthly,
  // overduepmsmonthly,
  // responsewithin10mins,
  // responsewithinsameday,
  // timetorespond,
  // workorderdocument,
  // ppmschedule,
  // severity,
  // priority,
  // floor,
  // area,
  // room,
  // scheduletask,
  // equipmentschedule,
  // dataTables,
  // workforce,
  // basalarm,
  // group,
  // country,
  // setting,
  // servicereport,
  // basruntime,
  // treehierachy,
  // navBreadcrumb,
  // vendor,
  // knowledgebase,
  // documents,
  // equipmenthistory,
  // equipmentdowntime,
  // workorderrepeated,
  // workorderdetails,
  // workforcelist,
  // workforceattendance,
  // report,
  // //E3MS
  // dashboardprofile,
  // dashboardtab,
  // dashboardchart,
  // dashboardpoint,
  // invoiceelectricity,
  // invoicepoint,
  // e3msSetting,
  // dashboardchartSetting,
  // userSetting,
  // meterreport,

  // // tenant
  // tenant,

  // // unfinished, not yet linked to backend data
  // inventory,
  // storesetup,
  // INV_MaterialRequest,
  // INV_MaterialRequestTrans,
  // returnmaterial,
  // storetostore,
  // storerack,
  // parttype,
  // purchaserequired,
  // defecttracking,
  // stockdetails,
  // customerfeedback,

  // part,
  // bom,
  // INV_Material,
  // store,

  // //IOT
  // power,
  // iaq,
  // water,
  // temp
}

export default rootReducer
