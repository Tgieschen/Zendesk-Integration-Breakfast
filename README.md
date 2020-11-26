# Zendesk-Integration-Breakfast
This repo contains everything needed to replicate the Zendesk integration breakfast webinar(https://ahoy.twilio.com/emea-integration-breakfast-zendesk-1-ty).

The demo shows how our customer connects with our company "Amazing Mattress" to get information about and initialize the process of returning his mattress. 

The demo outline is: 

1. Customer connects via SMS with our NLU Chatbot (SMS/Autopilot)
2. Customer is escalated to a Flex agent (Conversation/SMS/Chat)
3. Agent makes outbound call to Customer to verify their identity (Voice)
4. Agent completes task which sends out an automated email with return information (Sendgrid)
5. A new custom task is created for the "Sales Team"  to reach out to our customer for a follow up

## 🛠 Setup

This section is about how to setup your Zendesk trial version and Twilio account.

### 1. Sign up for Twilio Flex

If you don't already have a Twilio account go ahead and create a free account [here](https://www.twilio.com/try-twilio). Once you've signed up for your Twilio account it's time to create a Flex project. Just follow the instructions found [here](https://www.twilio.com/docs/flex/tutorials/setup) to get a Flex project up and running. 

### 2.Sign up for a Zendesk account

Go ahead and register with Zendesk [here](https://www.zendesk.com/register/). Follow the instructions and make sure to remember your Zendesk `subdomain` which you need to enter in step 3.

### 3. Integrate Flex with Zendesk

We've put together a guide on how to connect Twilio Flex into your Zendesk instance which you can find [here](https://www.twilio.com/docs/flex/integrations/zendesk). Go ahead and follow the steps in this guide. 

When configuring the integration in Twilio Flex make sure to set the settings as follows:

<img src="https://assets-5080.twil.io/integration_settings.png"/>

(Hint: You will need the url of your `subdomain` which you specified in Step 2).

### 4. Creating our customer

We need to create a customer in Zendesk for our demo who needs some additional fields. 

The fields you need to add are:

| Field Name  | Field type |
| ------------- | ------------- |
| Birthday  | `Date`  |
| Identification Code  | `Numeric`  |

(Hint: How to add custom user fields can be found [here](https://support.zendesk.com/hc/en-us/articles/203662066-Adding-custom-fields-to-users))

Now we can create our end user. Create a new enduser (how to [here](https://support.zendesk.com/hc/en-us/articles/203690886-Adding-and-managing-end-users)). Once you've created the new user, you need to add 3 fields:



| Field Name  | Description |
| ------------- | ------------- |
|  Phone | needs to be the phone number you will use in the demo for your customer. Has to be in [E.164](https://www.twilio.com/docs/glossary/what-e164) format|
| Birthday  | any date is fine; used for identity verification in the demo  |
| Identification Code  | any number is fine; used for identity verification in the demo  |

Your end customer should look like this:

<img src='https://assets-5080.twil.io/user%2520settings.png'/>

### 5. Create Zendesk API credentials

In order for Twilio Functions to communicate with Zendesk it has to bee autorized to do so by Zendesk through an API token.You can follow along this [guide](https://support.zendesk.com/hc/en-us/articles/226022787-Generating-a-new-API-token-) in order to get an access token.  Make sure to write down your API token for now, as you cannot see this token again and will need to create a new token if lost.

### 6. Signup for Sendgrid and verify 

First signup for a free Sendgrid account [here](https://signup.sendgrid.com/). 

Once you've singed up we need to verify an email address you can use to send emails, follow the instructions [here](https://sendgrid.com/docs/ui/sending-email/sender-verification/) to add a verified email address.

Finally we need to get an API key in order to use sendgrid. Go ahead and create a `Full Access` api key, steps can he found [here](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key). Make sure to write down your API key for now, as you cannot see this code again and will need to create a new key if lost.

### 7. Upload Twilio Functions

We will be using the Twilio CLI to deploy our Twilio Functions to our account (as described [here](https://www.twilio.com/blog/the-new-way-to-create-develop-and-deploy-twilio-functions)). Before we do this we need to setup our enviornment variables in a new `ZendeskFunctions/.env` file in the the `/ZendeskFunctions` directory, similarly to the `ZendeskFunctions/.example.env` file. 

The variables are: 

| Env Name  | Description |
| ------------- | ------------- |
| ACCOUNT_SID | Your account SID, which you can find on the [dashboard](https://www.twilio.com/console) of your Twilio account  |
| AUTH_TOKEN |  Your Authentication Token, which you can find on the [dashboard](https://www.twilio.com/console) of your Twilio account  |
| ZENDESK_USERNAME |  The email address you use to log into your Zendesk instance |
| ZENDESK_TOKEN | the API token you created in Step 5  |
| ZENDESK_URI | The subdomain you created in Step 2, with an additional path. in the end it should look as follows: `https://<your subdomain name>.zendesk.com/api/v2`  |
| ORDER_TIME | The time the chatbot will say the customer made their last order. (In the studio flow this will be mentioned in the `GreetingMsg` widget)|
| COMPANY_NAME | The name of the company your chatbot will use for greeting the customer. (In the studio flow this will be mentioned in the `GreetingMsg` widget)|


With that we can now deploy our functions. First make sure you are logged into the right account. Either run `twilio login` if you haven't logged into the account before or run `twilio profiles:list` and make sure if your active account is the account you want to use. If you are not using the right account you can switch account by running `twilio profiles:use <your profile name>`.

Next make sure you're in the `/ZendeskFunctions` folder and run `twilio serverless:deploy`. Now you're Functions should be uploaded to your account!


### 8. Setup Studio Flow

We will be importing the JSON version of the Studio flow from the `StudioFlow.json` file as described [here](https://www.twilio.com/docs/studio/user-guide#importing-and-exporting-flows). Once you have imported the studio flow there are 3 widgets that need to be updated:


| Widget Name  | Description |
| ------------- | ------------- |
| getContextInfoFunc | The function to be used isn't set yet. make sure the widget is pointing at your `/fetchContextInfo` function of the `ZendeskFunctions` Service  |
| CreateTicketFunc | The function to be used isn't set yet. make sure the widget is pointing at your `/createTicket` function of the `ZendeskFunctions` Service  |
| SendCustomerToAgent |  The Workflow and channel aren't set. Set this to `Assign to Anyone` for the workflow and `SMS` for the channel|

It should be noted that the flow is hardcoded however this can be implemented using [Autopilot](https://www.twilio.com/autopilot) and is supposed to represent what a flow using Autopilot could look like. 

### 9. Connect a number to you Studio Flow

Similar to [here](https://www.twilio.com/docs/studio/tutorials/how-to-forward-calls#connect-the-flow-to-a-number) we will now connect a number in your account ( which you can find [here](https://www.twilio.com/console/phone-numbers/incoming)) with your Studio flow. Unlike in the documentation, make sure to not connect your number to the studio flow for incoming calls but for incoming messages.


At this point you should be all set. log into your Zendesk account, open the flex plugin in Zendesk and mark yourself as online. Next send an SMS to the phone number you linked with the studio flow from Step 9. You should be guided through a few messages asking about the issue you are facing and then be asked to connect to an agent. When you reply you will be connected to the agent in the Flex Plugin in Zendek and once the agent accepts the task you will see a screenpop. You sould also be able to make 

## Resources




