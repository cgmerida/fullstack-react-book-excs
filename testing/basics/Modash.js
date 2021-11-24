// We write the Modash library in this file in the Unit Testing chapter
const truncate = (string, length) => {
  if (string.length > length) return string.slice(0, length) + "...";
  else return string

}

const capitalize = (string) => {
  // let lower = string.slice(1, string.length).toLowerCase();
  // let upper = string.slice(0, 1).toUpperCase();

  // return upper + lower;

  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const camelCase = (string) => {
  let words = string.split(/[\s_\-]/g);

  // words.map((w, i) => {
  //   return i === 0 ? w.trim().toLowerCase() : capitalize(w.trim());
  // }).join('');

  return [
    words[0].toLowerCase(),
    ...words.slice(1).map(w => capitalize(w))
  ].join('');
}


const Modash = {
  truncate,
  capitalize,
  camelCase
}

export default Modash;