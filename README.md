# Feeds Scraper

Generate a CSV file from web content that can be used to import into Drupal via a Feeds CSV import.

## Requirements

- Node

## Installation

Make sure that you have [Node.js](http://nodejs.org/) installed.

``` sh
git clone git@github.com:steveworley/feeds-scraper.git # or clone your own fork
cd feeds-scraper
npm install
```

## Running

Make sure that you have defined a [configuration file](https://github.com/steveworley/feeds-scraper/tree/master/conf).

Run single:

``` sh
node index.js --conf=example_conf
```

Run multiple:

``` sh
node index.js -c example_1 -c example_2 -c example_3
```
