#!/usr/bin/env/ node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));
if (args.h) {
	console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE');
    console.log('	-h            Show this help message and exit.');	
    console.log('	-n, -s        Latitude: N positive; S negative.');
    console.log('	-e, -w        Longitude: E positive; W negative.');
    console.log('	-z            Time zone: uses tz.guess() from moment-timezone by default.');
    console.log('	-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.');
    console.log('	-j            Echo pretty JSON from open-meteo API and exit.');
	process.exit(0);
}

let latitude = args.n || -args.s;
let longitude = args.e || -args.w;

const timezone = moment.tz.guess();

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m,weathercode&daily=precipitation_hours&windspeed_unit=ms&timezone=' + timezone);
const data = await response.json();

if (args.j){
	console.log(data);
	process.exit(0);
}

let days = 1;
if (args.d != null) {
	days = args.d;
}

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}

let rain = data.daily.precipitation_hours[days];

if (rain != 0){
	console.log("You need your galoshes today!");
} else {
	console.log("You do not need yo galoshes!");
}

