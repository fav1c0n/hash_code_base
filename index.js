'use strict';
const fs = require('fs');
const createInterface = require('readline').createInterface;
const createReadStream = fs.createReadStream;
// const EOL = require('os').EOL;

const files = [
  'e_shiny_selfies',
  'b_lovely_landscapes',
  'c_memorable_moments',
  'd_pet_pictures',
  'e_shiny_selfies'
];

class Photos {
  constructor() {
    this.photos = []
  }

  /** Methods */
}

class Photo {
  constructor(orientation, tags, taked, id) {
    this.orientation = orientation;
    this.tags = tags;
    this.taked = taked;
    this.id = id;
    this.totalTags = this.tags.length;
  }
}

const file = files[process.argv.length > 2 ? parseInt(process.argv[2]) : 3];

const lineReader = createInterface({
  input: createReadStream(`input/${file}.txt`)
});




function start() {
  var photoList = new Photos(),
    photo, orientation, tags, taked, id, split, counter = 0;

  lineReader.on('line', (line) => {
    split = line.split(' ')
    photo = new Photo(split[0], split.splice(2), false, counter);
    counter++;
    photoList.photos.push(photo);

  });
}

start()