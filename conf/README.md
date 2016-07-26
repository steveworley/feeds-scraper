# Configuration

Configuration files are Node modules.

## Options

###### `url [string]`

The URL that is to be crawled.

###### `selector [string]`

A jQuery selector string that provides the starting point for the scape.

###### `output [array|object]`

An object will only select a single set of content matching the selector while an array will provide a collection that matches.

This maps directly to [Xray](https://github.com/lapwinglabs/x-ray) and can use another instance of the scraper to follow links and get content from another page.

``` js
output: [{
  title: 'a', // A selector, will return the text in the element
  body: '.body@html', // An option will return all html in the selector
  teaser: App.scraper('a@href', '#body') // Will follow the link and return content in #body element
}]
```

###### `file [string]`

A filename that will be created or appended to each time this configuration is ran.

###### `fields [array]`

An array that if is provided will create a header row for the CSV. If it is omitted it will be inferred from object keys of the `output` option.

###### `format [function]`

A callback that is called after the scraper has collected content that matches `output`. It will be given the result of the scraper (either array or object depending on how `output` was defined).

Formatting of data can be processed here.

## Filters

#### Trim

```
App.filters.trim(string);
```

Replaces new line characters and trims leading and trailing whitespace.

#### Date

```
App.filters.date(date, from_format, to_format);
```

Convert a date string from a format into another format. When converting for a date field in Drupal you should use 'c'.
