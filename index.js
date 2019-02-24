'use strict';
const fs = require('fs');
const createInterface = require('readline').createInterface;
const createReadStream = fs.createReadStream;
// const EOL = require('os').EOL;

const files = [
  'a_example',
  'b_should_be_easy',
  'c_no_hurry',
  'd_metropolis',
  'e_high_bonus'
];

const file = files[process.argv.length > 2 ? parseInt(process.argv[2]) : 3];

const lineReader = createInterface({
  input: createReadStream(`input/${file}.in`)
});


lineReader.on('line', (line) => {
  // if (count === 0) readDescLine(line);
  // else readPizzaLine(line);
  // count++;
  // if (count === 1 + pizza.rows) start();
});

