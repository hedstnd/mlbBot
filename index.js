"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@atproto/api");
const dotenv = __importStar(require("dotenv"));
const cron_1 = require("cron");
const process = __importStar(require("process"));
const fs = __importStar(require("fs"));
dotenv.config();
var retStr = "";
// Create a Bluesky Agent 
const agent = new api_1.BskyAgent({
    service: 'https://bsky.social',
});
async function main() {
    const postStringJSON = fs.readFileSync("./postList.json", { "encoding": "utf8" });
    const tmNameJSON = fs.readFileSync("./teamNames.json", { "encoding": "utf8" });
    const tmNickJSON = fs.readFileSync("./teamNicknames.json", { "encoding": "utf8" });
    const cityJSON = fs.readFileSync("./cityNames.json", { "encoding": "utf8" });
    const playerNameJSON = fs.readFileSync("./playerNames.json", { "encoding": "utf8" });
    const placeJSON = fs.readFileSync("./places.json", { "encoding": "utf8" });
    const milbJSON = fs.readFileSync("./milbLvls.json", { "encoding": "utf8" });
    const postList = JSON.parse(postStringJSON);
    const teamNames = JSON.parse(tmNameJSON);
    const nickNames = JSON.parse(tmNickJSON);
    const cityNames = JSON.parse(cityJSON);
    const playerNames = JSON.parse(playerNameJSON);
    const placeNames = JSON.parse(placeJSON);
    const milbLvls = JSON.parse(milbJSON);
    retStr = postList[Math.floor(Math.random() * postList.length)];
    while (retStr.includes("playerName")) {
        retStr = retStr.replace("playerName", playerNames[Math.floor(Math.random() * playerNames.length)]);
    }
    while (retStr.includes("teamName")) {
        retStr = retStr.replace("teamName", teamNames[Math.floor(Math.random() * teamNames.length)]);
    }
    while (retStr.includes("cityName")) {
        retStr = retStr.replace("cityName", cityNames[Math.floor(Math.random() * cityNames.length)]);
    }
    while (retStr.includes("teamNickSingular")) {
        retStr = retStr.replace("teamNickSingular", nickNames[Math.floor(Math.random() * nickNames.length)]);
    }
    while (retStr.includes("placeNum")) {
        retStr = retStr.replace("placeNum", placeNames[Math.floor(Math.random() * placeNames.length)]);
    }
    while (retStr.includes("milbLvl")) {
        retStr = retStr.replace("milbLvl", milbLvls[Math.floor(Math.random() * milbLvls.length)]);
    }
    while (retStr.includes("randNum")) {
        retStr = retStr.replace("randNum", "" + Math.floor(163 * Math.random()));
    }
    while (retStr.includes("yearNum")) {
        const d = new Date();
        d.setMonth(d.getMonth() + 2);
        retStr = retStr.replace("yearNum", "" + d.getFullYear());
    }
    await agent.login({ identifier: process.env.BLUESKY_USERNAME, password: process.env.BLUESKY_PASSWORD });
    await agent.post({
        text: retStr
    });
    console.log("Just posted!");
}
main();
// Run this on a cron job
const scheduleExpressionMinute = '* * * * *'; // Run once every minute for testing
const scheduleExpression = '*/30 * * * *'; // Run once every three hours in prod
const job = new cron_1.CronJob(scheduleExpression, main); // change to scheduleExpressionMinute for testing
job.start();
