'use strict';
const fs = require('fs');
const createInterface = require('readline').createInterface;
const createReadStream = fs.createReadStream;
// const EOL = require('os').EOL;

const files = [
  'a_example',
  'b_lovely_landscapes',
  'c_memorable_moments',
  'd_pet_pictures',
  'e_shiny_selfies'
];

class Photo {
  constructor(orientation, tags, taken, id) {
    this.orientation = orientation;
    this.tags = tags;
    this.taken = taken;
    this.id = id;
    this.totalTags = this.tags.length;
  }
}

const file = files[process.argv.length > 2 ? parseInt(process.argv[2]) : 0];

const lineReader = createInterface({
  input: createReadStream(`input/${file}.txt`)
});


const fileOutputName = 'output.txt';


const createFileStream = (arraySlides) => {
  const stream = fs.createWriteStream(fileOutputName);
  stream.once('open', () => {
    stream.write(`${arraySlides ? arraySlides.length : 0}\n`);
    arraySlides = arraySlides.map(slide => slide.join(' '));
    stream.write(arraySlides.join('\n'));
    stream.end();
  });
}


const mergeTags = (photos) => {
  let mergedTags = photos[0].tags;
  if (photos.length > 1) {
    photos[1].tags.forEach(tag => {
      if (mergedTags.indexOf(tag) === -1) {
        mergedTags.push(tag);
      }
    })
  }
  return mergedTags;
}


function getSlides(photos) { // lista de fotos devuelvo lista de slides

  const slides = [];

  photos.forEach((foto, index) => {
    if (foto.orientation === 'V') {
      for (let i = 0; i < photos.length; i++) {
        if (photos[i].id !== foto.id && !exitsSlide(slides, foto.id, photos[i].id)) {
          slides.push({
            photos: [foto, photos[i]],
            mergedTags: mergeTags([foto, photos[i]]),
            taken: false
          });
        }
      }
    } else {
      slides.push({
        photos: [foto],
        mergedTags: foto.tags,
        taken: false
      })
    }
  });
  return slides;

  function exitsSlide(slides, fotoIdOne, fotoIdTwo) {
    let found = false,
      i = 0;
    while (!found && i < slides.length) {
      found = slides[i].photos.length === 2 &&
        (slides[i].photos[0].id === fotoIdOne || slides[i].photos[1].id === fotoIdTwo) &&
        (slides[i].photos[0].id === fotoIdTwo || slides[i].photos[1].id === fotoIdOne);
      i++;
    }
    return found;
  }
}


function start() {
  var photoList = [],
    photo, split, counter = 0;

  lineReader.on('line', (line) => {
    split = line.split(' ')
    if (split.length > 1) {
      photo = new Photo(split[0], split.splice(2), false, counter);
      counter++;
      photoList.push(photo);
    }
  })

  lineReader.on('close', () => {
    console.log(photoList);
    let slides = getSlides(photoList);
    console.log(slides);
    let slidesCombinations = generateSlidesCombinations(slides);
    console.log(slidesCombinations);
    let slideShow = createSolution(slidesCombinations);
    console.log(slideShow);
  })
  //createFileStream(slideShow);
}








function getTagsSlideOne(SlideOne, SlideTwo) {
  let counter = 0;
  SlideOne.mergedTags.filter(function (e) {
    if (SlideTwo.mergedTags.indexOf(e) === -1) {
      counter++;
    }
  });

  return counter;
}

function getTagsSlideTwo(SlideOne, SlideTwo) {
  let counter = 0
  SlideTwo.mergedTags.filter(function (e) {
    if (SlideOne.mergedTags.indexOf(e) === -1) {
      counter++;
    }
  });
  return counter;
}

function getCommonTags(SlideOne, SlideTwo) {
  let counter = 0;
  SlideOne.mergedTags.filter(function (e) {
    if (SlideTwo.mergedTags.indexOf(e) !== -1) {
      counter++;
    }
  });
  return counter;
}

function generateSlidesCombinations(slideList) {
  let slideCombinations = [];
  for (let i = 0; i < slideList.length; i++) {
    slideCombinations.push({
      slide: slideList[i],
      combinations: []
    });
    for (let j = 0; slideList.length; j++) {
      if (i !== j) {
        slideCombinations[i].combinations = {
          slide: slideList[j],
          commonTags: getCommonTags(slideCombinations[i].slide, slideList[j]),
          exclusiveSlideOne: getTagsSlideOne(slideCombinations[i].slide, slideList[j]),
          exclusiveSlideTwo: getTagsSlideTwo(slideCombinations[i].slide, slideList[j])
        };
      }
    }
  }
  return slideCombinations;
}

function createSolution(slideCombinations) {
  let slideShow = [];
  for (let i = 0; i < slideCombinations.length; i++) {
    if (!slideCombinations[i].slide.taken) {
      slideShow.push(slideCombinations[i].slide);
      slideCombinations[i].slide.taken = true;
      for (let j = 0; j < slideCombinations[i].combinations.length; j++) {
        if (!slideCombinations[i].combinations[j].slide.taken) {
          slideShow.push(slideCombinations[i].combinations[j].slide);
          slideCombinations[i].combinations[j].slide.taken = true;
        }
      }
    }
  }

  return slideShow;
}

start()