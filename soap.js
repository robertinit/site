require("dotenv").config();
const soapRequest = require("easy-soap-request");
const xml2js = require("xml2js");
const parseString = require("xml2js").parseString;
const builder = new xml2js.Builder();
const options = {
  explicitArray: false,
  tagNameProcessors: [xml2js.processors.stripPrefix],
};

const url = process.env.URL;
const rawHeader = {
  // 'user-agent': 'sampleTest',
  "Content-Type": "text/xml;charset=UTF-8",
  soapAction: "",
};

// usage of module
const createToken = async (APIKey, formID) => {
  const createTokenXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:CreateToken><tem:APIKey>${APIKey}</tem:APIKey><tem:FormID>${formID}</tem:FormID></tem:CreateToken></soapenv:Body></soapenv:Envelope>`;
  const header = rawHeader;
  header.soapAction = "http://tempuri.org/CreateToken";
  let urlToken = "";
  const { response } = await soapRequest({
    url: url,
    headers: header,
    xml: createTokenXML,
  });
  const { body } = response;
  xml2js.parseString(body, options, (err, result) => {
    if (err) {
      console.log("An error has occurred: " + err);
      return;
    }
    const soapBody = result.Envelope.Body;
    if (soapBody.$) {
      delete soapBody.$;
    }
    const soapBodyXML = builder.buildObject(soapBody);
    parseString(soapBodyXML, function (err, final) {
      urlToken = final.CreateTokenResponse.CreateTokenResult[0];
    });
  });

  return urlToken;
};
const isActive = async (APIKey, token) => {
  const isActiveXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:IsActiveToken><tem:APIKey>${APIKey}</tem:APIKey><tem:token>${token}</tem:token></tem:IsActiveToken></soapenv:Body></soapenv:Envelope>`;
  const header = rawHeader;
  header.soapAction = "http://tempuri.org/IsActiveToken";
  let activeToken = false;
  const { response } = await soapRequest({
    url: url,
    headers: header,
    xml: isActiveXML,
  });
  const { body } = response;
  xml2js.parseString(body, options, (err, result) => {
    if (err) {
      console.log("An error has occurred: " + err);
      return;
    }
    const soapBody = result.Envelope.Body;
    if (soapBody.$) {
      delete soapBody.$;
    }
    const soapBodyXML = builder.buildObject(soapBody);
    parseString(soapBodyXML, function (err, final) {
      // console.log(final)
      activeToken = final.IsActiveTokenResponse.IsActiveTokenResult[0];
    });
  });
  return activeToken;
};
const getFormName = async (APIKey, formID) => {
  const getFormNameXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:GetFormName><tem:APIKey>${APIKey}</tem:APIKey><tem:FormID>${formID}</tem:FormID></tem:GetFormName></soapenv:Body></soapenv:Envelope>`;
  const header = rawHeader;
  header.soapAction = "http://tempuri.org/GetFormName";
  let formName = "";
  const { response } = await soapRequest({
    url: url,
    headers: header,
    xml: getFormNameXML,
  });
  const { body } = response;
  xml2js.parseString(body, options, (err, result) => {
    if (err) {
      console.log("An error has occurred: " + err);
      return;
    }

    const soapBody = result.Envelope.Body;
    if (soapBody.$) {
      delete soapBody.$;
    }
    const soapBodyXML = builder.buildObject(soapBody);
    parseString(soapBodyXML, function (err, final) {
      formName = final.GetFormNameResponse.GetFormNameResult[0];
    });
  });

  return formName;
};
const getFormList = async (APIKey) => {
  const getFormListXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:FormList><tem:APIKey>${APIKey}</tem:APIKey></tem:FormList></soapenv:Body></soapenv:Envelope>`;
  const header = rawHeader;
  header.soapAction = "http://tempuri.org/FormList";
  let formList = false;
  const { response } = await soapRequest({
    url: url,
    headers: header,
    xml: getFormListXML,
  });
  const { body } = response;
  xml2js.parseString(body, options, (err, result) => {
    if (err) {
      console.log("An error has occurred: " + err);
      return;
    }
    const soapBody = result.Envelope.Body;
    if (soapBody.$) {
      delete soapBody.$;
    }
    const soapBodyXML = builder.buildObject(soapBody);
    parseString(soapBodyXML, function (err, final) {
      console.log(final);
      formList = final.FormListResponse.FormListResult;
    });
  });
  return formList;
};
const saveResponse = async (APIKey, formID, token, data) => {
  const saveResponseXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:SaveResponse><tem:APIKey>${APIKey}</tem:APIKey><tem:token>${token}</tem:token><tem:FormID>${formID}</tem:FormID><tem:Value>${data}</tem:Value></tem:SaveResponse></soapenv:Body></soapenv:Envelope>`;
  const header = rawHeader;
  header.soapAction = "http://tempuri.org/SaveResponse";
  let sendResponse = "";
  const { response } = await soapRequest({
    url: url,
    headers: header,
    xml: saveResponseXML,
  });
  const { body } = response;
  xml2js.parseString(body, options, (err, result) => {
    if (err) {
      console.log("An error has occurred: " + err);
      return;
    }
    const soapBody = result.Envelope.Body;
    if (soapBody.$) {
      delete soapBody.$;
    }
    const soapBodyXML = builder.buildObject(soapBody);
    parseString(soapBodyXML, function (err, final) {
      sendResponse = final.SaveResponseResponse.SaveResponseResult[0];
    });
  });
  return sendResponse;
};
const getFormID = async (APIKey, token) => {
  const getFormIDXML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:GetFormID><tem:APIKey>${APIKey}</tem:APIKey><tem:token>${token}</tem:token></tem:GetFormID></soapenv:Body></soapenv:Envelope>`;
  const header = rawHeader;
  header.soapAction = "http://tempuri.org/GetFormID";
  let formID = "";
  const { response } = await soapRequest({
    url: url,
    headers: header,
    xml: getFormIDXML,
  });
  const { body } = response;
  xml2js.parseString(body, options, (err, result) => {
    if (err) {
      console.log("An error has occurred: " + err);
      return;
    }
    const soapBody = result.Envelope.Body;
    if (soapBody.$) {
      delete soapBody.$;
    }
    const soapBodyXML = builder.buildObject(soapBody);
    parseString(soapBodyXML, function (err, final) {
      formID = final.GetFormIDResponse.GetFormIDResult[0];
    });
  });
  return formID;
};
// create a token
// createToken(APIKey, formID).then(e => {
//     console.log(e)
// }).catch(err => console.log(err))

module.exports = {
  createToken,
  isActive,
  getFormName,
  getFormList,
  saveResponse,
  getFormID,
};
