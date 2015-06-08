#!/usr/bin/node
var url = require('url');
var request = require('request');
var badge = require('gh-badges');
var morgan = require('morgan');
var app = require('express')();

var port = process.env.PORT || 2323;
if (process.env.LISTEN_PID > 0) {
	require('systemd');
	port = 'systemd';
}

var config = {
	jenkins: 'http://jenkins.daydreamengine.org',
	template: 'flat',
	statusText: {
		'SUCCESS': 'passing',
		'FAILURE': 'failing',
		'UNSTABLE:': 'unstable',
		undefined: 'unknown'
	},
	statusColor: {
		'SUCCESS': 'brightgreen',
		'FAILURE': 'red',
		'UNSTABLE': 'yellow',
		undefined: 'lightgrey'
	}
}

app.use(morgan('dev'))
app.get('/job/:job/:build/:mode?', serveBadge);
app.use(function(req, res) {
	var badgeOptions = { 
		text: [ 'unknown', 'unknown' ], 
		colorscheme: 'lightgrey',
		template: config.template
	}
	res.statusCode = 500;
	sendSVG(res, badgeOptions);
});

function serveBadge(req, res) {
	var altText = req.query.text;
	if (altText) {
		apiGetBuildInfo(req, res, altText);
	} else {
		apiGetDisplayName(req, res);
	}
}

function apiGetDisplayName(req, res) {
	var api = config.jenkins + '/job/' + req.params.job + '/api/json';
	request.get({ url: api, json: true }, function(err, apiRes, json) {
		if (err) {
			console.error(err.stack);
			apiGetBuildInfo(req, res, 'unknown');
		} else if (apiRes.statusCode != 200) {
			console.error('Failed to fetch display name. Server replied with code ' + apiRes.statusCode);
			res.statusCode = 500;
			apiGetBuildInfo(req, res, 'unknown');
		} else {
			var displayName = json.displayName;
			apiGetBuildInfo(req, res, displayName);
		}
	});
}

function apiGetBuildInfo(req, res, altText) {
	var query = url.parse(req.url);
	//var api = config.jenkins + '/job/' + req.params.job + '/lastBuild/api/json';
	var api = config.jenkins + req.path + '/api/json';
	request.get({ url: api, json: true }, function(err, apiRes, json) {
		if (err) {
			console.error(err.stack);
		} 
		if (apiRes.statusCode != 200) {
			console.error('Failed to fetch build info. Server replied with code ' + apiRes.statusCode);
			res.statusCode = 500;
		}
		
		if (req.params.mode == 'testReport') {
			badgePrepareTestResults(req, res, altText, json)
		} else {
			badgePrepareBuildResults(req, res, altText, json)
		}
	})
}

function badgePrepareBuildResults(req, res, altText, json) {
	var status = config.statusText[json.result] 
	var color = config.statusColor[json.result];
	var badgeOptions = { 
		text: [ altText, status ], 
		colorscheme: color,
		template: config.template
	}
	sendSVG(res, badgeOptions);
}

function badgePrepareTestResults(req, res, altText, json) {
	var totalCases = json.failCount + json.passCount + json.skipCount;
	var color = (json.passCount >= totalCases) ? 'brightgreen' : 'red';
	var badgeOptions = {
		text: [ altText || 'tests', json.passCount + ' / ' + totalCases ], 
		colorscheme: color,
		template: config.template
	}
	res.statusCode = 200;
	sendSVG(res, badgeOptions);
}

function sendSVG(res, badgeOptions) {
	badge(
		badgeOptions,
		function(svg, err) {
			if (err) {
				console.error('Failed to generate badge')
				console.error(err.stack)
				return res.statusCode = 500;
			}

			res.setHeader('Content-Type', 'image/svg+xml');
			res.send(svg);
		}
	);
}

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.statusCode = 500;
});

app.listen(port);
console.log('Listening on port ' + port)
