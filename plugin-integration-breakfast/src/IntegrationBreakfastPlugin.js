import React from "react";
import { VERSION } from "@twilio/flex-ui";
import { FlexPlugin } from "flex-plugin";
import API from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import reducers, { namespace } from "./states";

const PLUGIN_NAME = "IntegrationBreakfastPlugin";

export default class IntegrationBreakfastPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    //creates custom channel for follow up task
    const followUpChannel = {
      name: "Follow Up Channel",
      isApplicable: task => {
        return task.attributes.type === "return-follow-up";
      },
      icons: {
        list: <FontAwesomeIcon icon={faTruck} />,
        main: <FontAwesomeIcon icon={faTruck} />,
        active: <FontAwesomeIcon icon={faTruck} />
      },
      colors: {
        main: "rgb(66, 135, 81)"
      },
      templates: {
        IncomingTaskCanvas: {
          firstLine: task => "Follow Up after Return"
        },
        TaskCard: {
          firstLine: "Follow Up after Return",
          secondLine: task => `Customer:${task.attributes.userName}`
        },
        TaskCanvasHeader: {
          title: "Return Follow Up"
        },
        TaskListItem: {
          firstLine: "Follow Up after Return",
          secondLine: task => `Customer: ${task.attributes.userName}`
        }
      }
    };

    flex.TaskChannels.register(followUpChannel);

    // This makes sure that when making the outbound call during the demo,
    // Zendesk doesn't create a new ticket but associates the new outbound call with the existing ticket
    flex.Actions.addListener(
      "beforeAcceptTask",
      async (payload, abortFunction) => {
        if (payload.task.attributes.direction === "outbound") {
          const task = await API.checkForTicket(
            payload.task.attributes.outbound_to
          );
          payload.task.attributes.zd_ticket_id = task.ticket;
        }
      }
    );

    // this sends the follow up email after the task is complete
    flex.Actions.addListener("afterCompleteTask", async payload => {
      if (payload.task.attributes.channelType === "sms") {
        await API.sendFollowUp(
          payload.task.attributes.user,
          payload.task.attributes.userEmail
        );
      }
    });
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
