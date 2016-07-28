# Feeds Scraper

Generate a CSV file from web content that can be used to import into Drupal via a Feeds CSV import. The tool only supports generating single dimension CSV files and some functionality of the [x-ray](https://github.com/lapwinglabs/x-ray) library (namely filters) is not available as the latest version has a bug that prevents link crawling.

## Requirements

- Node

## Installation

Make sure that you have [Node.js](http://nodejs.org/) installed.

``` sh
git clone git@github.com:steveworley/feeds-scraper.git # or clone your own fork
cd feeds-scraper
npm install
```

## Running via CLI

Make sure that you have defined a [configuration file](https://github.com/steveworley/feeds-scraper/tree/master/conf).

Run single:

``` sh
node index.js --conf=example_conf
```

Run multiple:

``` sh
node index.js -c example_1 -c example_2 -c example_3
```

## Running via browser

Make sure that you have defined a [configuration file](https://github.com/steveworley/feeds-scraper/tree/master/conf).

Bring up the NodeJS server with

``` sh
node index.js --browser
```

Navigate to [http://localhost:3333](http://localhost:3333)

![Browser based editing](/screenshot.png)

The browser based version will allow you to edit fields prior to generating the CSV and it comes bundled with [QuillJS](http://quilljs.com) to enable rich text editing. All fields will be editable however only fields named **body** will be presented with the toolbar.

_Note: Some configurations may produce CSVs too large for the browser and CLI will have to be used._
