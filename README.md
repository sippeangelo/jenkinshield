# jenkinshield

Generate build status and test case badges from Jenkins builds with customizability.
Using [gh-badges](https://www.npmjs.com/package/gh-badges)

## Install

```
npm install -g jenkinshield
```

## Usage

```
  Usage: jenkinshield [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -u, --url <url>      Jekins URL (http://username:password@server:port)
    -p, --port [number]  Port [2323]
```

Use the same URL to your build as Jenkins does, just change the port (if you happen to be running jenkinsshield on the same server).

### Build Status

```
http://server:2323/job/<your job>/<build number>
http://server:2323/job/<your job>/lastBuild
http://server:2323/job/<your job>/lastStableBuild
http://server:2323/job/<your job>/lastSuccessfulBuild
```

![<your job> passing](https://img.shields.io/badge/%3Cyour%20job%3E-passing-brightgreen.svg) ![<your job> unstable](https://img.shields.io/badge/%3Cyour%20job%3E-unstable-yellow.svg) ![<your job> failing](https://img.shields.io/badge/%3Cyour%20job%3E-failing-red.svg)


### Test Results

```
http://server:2323/job/<your job>/<build number>/testReport?text=tests
http://server:2323/job/<your job>/lastBuild/testReport?text=tests
http://server:2323/job/<your job>/lastStableBuild/testReport?text=tests
http://server:2323/job/<your job>/lastSuccessfulBuild/testReport?text=tests
```

![tests 10 / 10](https://img.shields.io/badge/tests-10%20/%2010-brightgreen.svg) ![tests 9 / 10](https://img.shields.io/badge/tests-9%20/%2010-red.svg)

## Customize

The server accepts a few query strings that allow you to customize your badge.

| Parameter | Values                      | Description                                                             |
|-----------|-----------------------------|-------------------------------------------------------------------------|
| text      | any                         | Replaces the text on the badge. Default is the display name of the job. |
| template  | plastic, flat, flat-squared | Changes theme of the badge.                                             |

## Examples

```
http://server:2323/job/<your job>/lastBuild
```
![build passing](https://img.shields.io/badge/build-passing-brightgreen.svg)

```
http://server:2323/job/<your job>/lastBuild/testReport?text=tests&theme=plastic
```
![tests 10 / 10](https://img.shields.io/badge/tests-10%20%2F%2010-brightgreen.svg?style=plastic)


