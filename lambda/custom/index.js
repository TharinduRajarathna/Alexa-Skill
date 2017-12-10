/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/TharinduRajarathna/Alexa-Skill.git
 **/

'use strict';

const Alexa = require('alexa-sdk');
const FB = require('fb');

const APP_ID = 'amzn1.ask.skill.8f85ba14-f361-4782-a049-790a7046cc04';
const SKILL_NAME = 'Athena';

const EMPTY_ACCESS_TOKEN_MESSAGE = "There was an issue connecting to facebook. Please check if you have given this skill permission to read facebook posts.";
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const TRY_AGAIN_MESSAGE = "Please try again later."
const STOP_MESSAGE = 'Goodbye!';

var accessToken = '';
const data = [
    'Athena or Athene, often given the epithet Pallas , is the ancient Greek goddess of wisdom, craft, and war.In later times, Athena was syncretized with the Roman goddess Minerva.',
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    // 'NewSession': function() {
        
    //     console.log('new session ; access token: '+ this.event.session.user.accessToken);
    //     accessToken = this.event.session.user.accessToken;
    
    //     if (accessToken) {
    //         FB.setAccessToken(accessToken);
    //         this.emit(':ask', HELP_MESSAGE, HELP_REPROMPT);
    //     }
    //     else {
    //         // If we dont have an access token, we close down the skill. 
    //         this.emit(':tellWithLinkAccountCard', "This skill requires you to link a Facebook account. Seems like you are not linked to a Facebook Account. Please link a valid Facebook account and try again.");
    //     }
    // },
    'LaunchRequest': function () {
        //this.emit('NewSession');
        this.emit('GetNewFactIntent');
    },
    'ReadFacebookPostsIntent': function () {

        accessToken = this.event.session.user.accessToken;
        FB.setAccessToken(accessToken);
        
        var alexa = this;
        FB.api("VirtusaCorp/posts", function (response) {
            if (response && !response.error) {
                if (response.data) {
                    var output = "Here are recent posts";
                    var max = 5;
                    for (var i = 0; i < response.data.length; i++) {
                        if (i < max) {
                            output += "Post " + (i + 1) + " " + response.data[i].message + ". ";
                        }
                    }
                    alexa.emit(':ask', output+ ", What would you like to do next?",HELP_MESSAGE);
                } else {
                    // REPORT PROBLEM WITH PARSING DATA
                }
            } else {
                // Handle errors here.
                console.log(response.error);
                this.emit(':tell', EMPTY_ACCESS_TOKEN_MESSAGE, TRY_AGAIN_MESSAGE);
            }
        });
    },
    'GetNewFactIntent': function () {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;
        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};
