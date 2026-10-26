/* Run with: node search.test.js */

const assert = require("node:assert/strict");
const { SearchEngine, createSnippet } = require("./search.js");

const documents = [
  {
    id: "lab-1",
    title: "Complete Blood Count",
    content: "Haemoglobin is 13.4 g/dL. White blood cell count is normal.",
    tags: ["laboratory", "blood"]
  },
  {
    id: "med-1",
    title: "Medication List",
    content: "The patient currently takes metformin after meals.",
    tags: ["medication", "diabetes"]
  },
  {
    id: "discharge-1",
    title: "Discharge Summary",
    content: "The patient was discharged after treatment for hypertension.",
    tags: ["summary", "hospital"]
  }
];

const engine = new SearchEngine(documents);
const tests = [
  ["finds a document by title", () => assert.equal(engine.search("blood count")[0].document.id, "lab-1")],
  ["matches every query term", () => assert.deepEqual(engine.search("metformin diabetes").map((item) => item.document.id), ["med-1"])],
  ["ranks title matches above content matches", () => assert.equal(engine.search("medication")[0].document.id, "med-1")],
  ["returns an empty array for a blank query", () => assert.deepEqual(engine.search("   "), [])],
  ["honours the result limit", () => assert.equal(engine.search("patient", { limit: 1 }).length, 1)],
  ["creates a bounded contextual snippet", () => assert.ok(createSnippet("one two three four five six", "four", 12).length <= 20)],
  ["rejects an invalid document collection", () => assert.throws(() => new SearchEngine("not an array"), TypeError)],
  ["rejects documents without an id", () => assert.throws(() => new SearchEngine([{ title: "Invalid" }]), TypeError)],
  ["does not return partial multi-term matches", () => assert.deepEqual(engine.search("metformin unknown"), [])]
];

const startedAt = process.hrtime.bigint();
let passed = 0;
const failures = [];

for (const [name, test] of tests) {
  try {
    test();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push({ name, error });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

const total = tests.length;
const failed = total - passed;
const elapsedMilliseconds = Number(process.hrtime.bigint() - startedAt) / 1e6;
const errorRate = (failed / total) * 100;
const defectDensity = (failures.length / total) * 100;
const testsPerSecond = total / Math.max(elapsedMilliseconds / 1000, Number.EPSILON);

console.log("\nMetrics");
console.log(`Test cases: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Error rate: ${errorRate.toFixed(2)}%`);
console.log(`Defect density: ${defectDensity.toFixed(2)} defects per 100 test cases`);
console.log(`Efficiency: ${testsPerSecond.toFixed(2)} test cases/second`);
console.log(`Execution time: ${elapsedMilliseconds.toFixed(2)} ms`);

if (failed > 0) process.exitCode = 1;
