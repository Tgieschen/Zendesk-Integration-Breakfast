// set to /plugins.json for local dev
// set to /plugins.local.build.json for testing your build
// set to "" for the default live plugin loader
var pluginServiceUrl = "/plugins.json";

var appConfig = {
  pluginService: {
    enabled: true,
    url: pluginServiceUrl
  },
  sso: {
    accountSid: process.env.REACT_APP_ACCOUNT_SID
  },
  ytica: false,
  logLevel: "info",
  showSupervisorDesktopView: true
};
