import zendesk from "node-zendesk";
import * as _ from "lodash";
import axios from "axios";
import { Manager } from "@twilio/flex-ui";

const API = {
  baseUrl: process.env.REACT_APP_API_URI,

  async sendFollowUp(user, userEmail) {
    const Token = Manager.getInstance().store.getState().flex.session
      .ssoTokenPayload.token;

    var data = JSON.stringify({
      user,
      userEmail,
      Token
    });

    var config = {
      method: "post",
      url: `${this.baseUrl}/sendFollowUp`,
      headers: {
        "Content-Type": "application/json"
      },
      data: data
    };
    await axios(config);
  },

  async checkForTicket(From) {
    const Token = Manager.getInstance().store.getState().flex.session
      .ssoTokenPayload.token;

    var data = JSON.stringify({
      Token,
      From
    });

    var config = {
      method: "post",
      url: `${this.baseUrl}/checkForTicket`,
      headers: {
        "Content-Type": "application/json"
      },
      data: data
    };
    return axios(config);
  }
};
export default API;
