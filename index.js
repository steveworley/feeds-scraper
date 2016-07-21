/**
 * @file
 * Entry point in the scraper app.
 */

var Xray = require('x-ray');
var json2csv = require('json2csv');
var fs = require('fs-extra');
var encoding = require('encoding');
var argv = require('yargs').argv;
var chalk = require('chalk');

var App = {
  scraper: new Xray(),

  filters: {
    trim: require('./src/filters/trim'),
    date: require('./src/filters/date')
  },

  run: function(args) {
    var options = ['url', 'selector', 'output', 'file'];

    if (!args.conf && !args.c) {
      this.error('Missing configuration file');
    }

    var confs = args.conf ? [args.conf] : args.c.toString().split(',');

    for (var index = 0; index < confs.length; index++) {
      var conf = require('./conf/' + confs[index])(this);
      for(var i = 0; i < options.length; i++) {
        if (!conf[options[i]]) {
          this.error(confs[index] + ' missing required option: ' + options[i]);
        }
      }
      this.scrape(conf);
    }
  },

  error: function(err) {
    if (err) {
      console.log(chalk.bold.red('[error]: ') + chalk.red(err));
      process.exit();
    }
  },

  scrape: function(opts) {
    this.scraper(opts.url, opts.selector, opts.output)(function(err, result) {
      if (err) {
        this.error(err);
      }

      if (opts.format) {
        result = opts.format(result);
      }

      if (!result) {
        this.error('Aborted');
        return;
      }

      var fields = opts.fields ? opts.fields : (typeof opts.output.length == 'undefined' ? Object.keys(opts.output) : Object.keys(opts.output[0]));
      var exists = true;

      var csv = json2csv({
        data: result,
        fields: fields
      });

      try {
        fs.statSync(opts.file);
      } catch(e) {
        exists = false;
      }

      if (exists) {
        csv = csv.substring(csv.indexOf("\n") + 1);
        fs.appendFile(opts.file, "\n" + csv, this.error);
      } else {
        fs.ensureFile(opts.file, function(error) {
          this.error(error);
          fs.writeFile(opts.file, csv, this.error);
        }.bind(this))
      }
    }.bind(this));
  }
};

App.run(argv);
