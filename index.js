/**
 * @file
 * Entry point in the scraper app.
 */

var express = require('express');
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
      this.scrape(conf, this.writeFile);
    }
  },

  writeFile: function(opts, result) {
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
    };
  },

  error: function(err) {
    if (err) {
      console.log(chalk.bold.red('[error]: ') + chalk.red(err));
      process.exit();
    }
  },

  scrape: function(opts, callback) {
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

      callback.apply(this, [opts, result]);

    }.bind(this));
  }
};

if (argv.browser) {
  var server = express();
  var glob = require('glob');
  var bodyParser = require('body-parser');

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.set('view engine', 'twig');
  server.use(express.static('public'));

  /*--
  @route: /
  @method: GET
  Default page request to display the available configuration.
  --*/
  server.get('/', function(req, res) {
    res.render('index', {
      conf: null,
      directories: glob.sync('./conf/*/**.js').map(function(val) { return val.replace('./conf/', '').replace('.js', ''); })
    });
  });

  /*--
  @route: /
  @method: POST
  Handle a post request to fetch scraper configurations and perfrom an initial
  scrape to display data.
  --*/
  server.post('/', function(req, res) {
    var conf = require('./conf/' + req.body.conf)(App);
    App.scrape(conf, function(opts, result) {
      res.render('index', {
        conf: req.body.conf,
        results: result,
        directories: glob.sync('./conf/*/**.js').map(function(val) { return val.replace('./conf/', '').replace('.js', ''); })
      });
    });
  });

  /*--
  @route: /download
  @method: POST
  Handle a CSV download request. This will generate a CSV and direct the output
  to the browser ready for download.
  --*/
  server.post('/download', function(req, res) {
    var data = JSON.parse(req.body.data);
    var conf = require('./conf/' + req.body.conf)(App);
    var fields = conf.fields ? conf.fields : (typeof data.length == 'undefined' ? Object.keys(data) : Object.keys(data[0]));

    json2csv({data: data, fields: fields}, function(err, csv) {
      res.setHeader('Content-disposition', 'attachment; filename=data.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    });
  });

  server.get('/test', function(req, res) {
    res.render('test');
  });

  server.listen(3333, function() {
    console.log('Server started on port 3333');
  });
} else {
  App.run(argv);
}
