import getRandomIntBetween from './getRandomIntBetween.js';

export default function getRandomArrayElement(array) {
  return array[getRandomIntBetween(0, array.length - 1)];
}
