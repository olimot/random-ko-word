import koWordsCSVURL from "./words.csv?url";

const locationURL = new URL(location.href);
const numWords = Number(locationURL.searchParams.get("numWords")) || 2;
const input = document.querySelector(
  'input[name="numWords"]',
) as HTMLInputElement;
input.value = `${numWords}`;

const response = await fetch(koWordsCSVURL);
const text = await response.text();
const entries: [string, number][] = [];
let total = 0;
for (const line of text.split(/[\r\n]+/).slice(1)) {
  if (!line) continue;
  const [word, countText] = line.split(",");
  if (!word || !countText) continue;
  const count = Math.log(Number(countText));
  total += count;
  entries.push([word, count]);
}

function createEntryElement([word, count]: [string, number]) {
  const entryElement = document.createElement("span");
  entryElement.classList.add("entry");

  const wordElement = document.createElement("strong");
  wordElement.appendChild(document.createTextNode(word));
  entryElement.appendChild(wordElement);

  const perc = Math.round((count / total) * 1000000) / 10000;
  entryElement.title = `${perc}%`;

  return entryElement;
}

const resultElement = document.querySelector(".result")!;
resultElement.innerHTML = "";

const answers = new Set<[string, number]>();
for (let i = 0; i < numWords; i++) {
  const theNumber = Math.trunc(total * Math.random());
  let found = entries[0];
  let acc = 0;
  for (let j = 0; j < entries.length; j++) {
    acc += entries[j][1];
    if (theNumber < acc) {
      found = entries[j];
      break;
    }
  }
  answers.add(found);
  resultElement.appendChild(createEntryElement(found));
  resultElement.appendChild(document.createTextNode(" "));
}
