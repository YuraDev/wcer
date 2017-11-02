const chalk = require('chalk');

exports.log = message => console.log(message);
exports.info = message => console.info(chalk.green(message));
exports.warn = message => console.warn(chalk.yellow(message));
exports.error = message => console.error(chalk.red(message));
exports.debug = message => console.debug(chalk.white(message));