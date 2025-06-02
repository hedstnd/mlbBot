import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import fs from "node:fs";

dotenv.config();

var retStr = ""


// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
  })


async function main() {
	const postStringJSON = fs.readFileSync("./postList.json")
	const tmNameJSON = fs.readFileSync("./teamNames.json")
	const tmNickJSON = fs.readFileSync("./teamNicknames.json")
	const cityJSON = fs.readFileSync("./cityNames.json")
	const playerNameJSON = fs.readFileSync("./playerNames.json")
	const placeJSON = fs.readFileSync("./places.json")
	const milbJSON = fs.readFileSync("./milbLvls.json")
	const postList = JSON.parse(postStringJSON)
	const teamNames = JSON.parse(tmNameJSON)
	const nickNames = JSON.parse(tmNickJSON)
	const cityNames = JSON.parse(cityJSON)
	const playerNames = JSON.parse(playerNameJSON)
	const placeNames = JSON.parse(placeJSON)
	const milbLvls = JSON.parse(milbJSON)
	retStr = postList[Math.floor(Math.random() * postList.length)]
	while (retStr.includes("playerName")) {
        retStr = retStr.replace("playerName",playerNames[Math.floor(Math.random() * playerNames.length)])
    }
    while (retStr.includes("teamName")) {
        retStr = retStr.replace("teamName",teamNames[Math.floor(Math.random() * teamNames.length)])
    }
	while (retStr.includes("cityName")) {
        retStr = retStr.replace("cityName",cityNames[Math.floor(Math.random() * cityNames.length)])
    }
    while (retStr.includes("teamNickSingular")) {
        retStr = retStr.replace("teamNickSingular",nickNames[Math.floor(Math.random() * nickNames.length)])
    }
	while (retStr.includes("placeNum")) {
        retStr = retStr.replace("placeNum",placeNames[Math.floor(Math.random() * placeNames.length)])
    }
	while (retStr.includes("milbLvl")) {
        retStr = retStr.replace("milbLvl",milbLvls[Math.floor(Math.random() * milbLvls.length)])
    }
	while (retStr.includes("randNum")) {
        retStr = retStr.replace("randNum",""+Math.floor(163*Math.random()))
    }
	while (retStr.includes("yearNum")) {
		const d = new Date()
		d.setMonth(d.getMonth() + 2)
        retStr = retStr.replace("yearNum",""+d.getFullYear())
    }
    await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD!})
    await agent.post({
        text: retStr
    });
    console.log("Just posted!")
}

main();


// Run this on a cron job
const scheduleExpressionMinute = '* * * * *'; // Run once every minute for testing
const scheduleExpression = '*/30 * * * *'; // Run once every three hours in prod

const job = new CronJob(scheduleExpression, main); // change to scheduleExpressionMinute for testing

job.start();