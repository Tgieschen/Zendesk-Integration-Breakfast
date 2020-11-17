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



