import koWordsCSVURL from "./ko-words.csv?url";

const locationURL = new URL(location.href);
const numWords = Number(locationURL.searchParams.get("numWords")) || 2;
const input = document.querySelector(
  'input[name="numWords"]',
) as HTMLInputElement;
input.value = `${numWords}`;

const response = await fetch(koWordsCSVURL);
const text = await response.text();
const entrySet = new Set<string>();
const acceptedTypeText =
  "명사 인명 수학 법률 전기 경제 컴퓨터 역사 생물 농업 음악 물리 건설 화학 공업 의학 교통 군사 수공 지명 문학 언어 철학 광업 식물 연영 수산 운동 예술 해양 항공 기독교 민속 정치 심리 지리 미술 사회 교육 논리 가톨릭 기계 천문 고적 동물 통신 종교 불교 출판 고유 약학 한의학 책명 언론";
const acceptedTypeSet = new Set(acceptedTypeText.split(" "));
for (const line of text.split(/[\r\n]+/)) {
  if (!line) continue;
  const [word, type] = line.split(",");
  if (!word || !type) continue;
  if (word.match(/[^-가-힣]/g)) continue;
  if (!acceptedTypeSet.has(type)) continue;

  const entry = `${word}\t${type}`;
  if (entrySet.has(entry)) continue;
  entrySet.add(entry);
}

function createEntryElement(word: string) {
  const entryElement = document.createElement("span");
  entryElement.classList.add("entry");

  const easyWord = word.replace(/-/g, "");
  const wordElement = document.createElement("strong");
  wordElement.appendChild(document.createTextNode(easyWord));
  entryElement.appendChild(wordElement);

  if (easyWord !== word) entryElement.title = word;
  return entryElement;
}

const resultElement = document.querySelector(".result")!;
resultElement.innerHTML = "";
const entries = [...entrySet];
for (let i = 0; i < numWords; i++) {
  const entryIndex = Math.trunc(entries.length * Math.random());
  const [entry] = entries.splice(entryIndex, 1);
  const [word] = entry.split("\t");
  resultElement.appendChild(createEntryElement(word));
  resultElement.appendChild(document.createTextNode(" "));
}
