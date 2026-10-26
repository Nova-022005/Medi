/* Lightweight, dependency-free search engine for MediSage documents. */

function normalise(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tokenize(value) {
  return normalise(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function documentText(document) {
  return [
    document.title,
    document.content,
    Array.isArray(document.tags) ? document.tags.join(" ") : document.tags
  ].join(" ");
}

function createSnippet(text, query, length) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  if (source.length <= length) return source;

  const terms = tokenize(query);
  const lowerSource = normalise(source);
  const matchPosition = terms.reduce((first, term) => {
    const position = lowerSource.indexOf(term);
    return position >= 0 && (first < 0 || position < first) ? position : first;
  }, -1);
  const start = Math.max(0, (matchPosition < 0 ? 0 : matchPosition) - Math.floor(length / 3));
  const end = Math.min(source.length, start + length);
  return `${start > 0 ? "... " : ""}${source.slice(start, end)}${end < source.length ? " ..." : ""}`;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

class SearchEngine {
  constructor(documents = []) {
    this.documents = [];
    this.setDocuments(documents);
  }

  setDocuments(documents) {
    if (!Array.isArray(documents)) {
      throw new TypeError("documents must be an array");
    }

    this.documents = documents.map((document, index) => {
      if (!document || document.id === undefined || document.id === null) {
        throw new TypeError(`document at index ${index} must have an id`);
      }

      const titleTokens = tokenize(document.title);
      const contentTokens = tokenize(document.content);
      const tagTokens = tokenize(Array.isArray(document.tags) ? document.tags.join(" ") : document.tags);
      return {
        original: document,
        titleTokens,
        contentTokens,
        tagTokens,
        allTokens: titleTokens.concat(contentTokens, tagTokens)
      };
    });
    return this;
  }

  search(query, options = {}) {
    const terms = tokenize(query);
    const limit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : 20;
    const snippetLength = Number.isInteger(options.snippetLength) && options.snippetLength > 0
      ? options.snippetLength
      : 160;

    if (terms.length === 0) return [];

    return this.documents
      .map((indexedDocument) => {
        const { original, titleTokens, contentTokens, tagTokens, allTokens } = indexedDocument;
        const score = terms.reduce((total, term) => {
          const titleMatches = titleTokens.filter((token) => token === term).length;
          const tagMatches = tagTokens.filter((token) => token === term).length;
          const contentMatches = contentTokens.filter((token) => token === term).length;
          return total + (titleMatches * 10) + (tagMatches * 5) + (contentMatches * 2);
        }, 0);
        const matchedTerms = terms.filter((term) => allTokens.includes(term)).length;

        return {
          document: original,
          score,
          matchedTerms,
          snippet: createSnippet(documentText(original), query, snippetLength)
        };
      })
      .filter((result) => result.score > 0 && result.matchedTerms === terms.length)
      .sort((left, right) => right.score - left.score || String(left.document.id).localeCompare(String(right.document.id)))
      .slice(0, limit);
  }
}

function attachSearchBar({ input, resultsContainer, engine, renderResult } = {}) {
  if (!input || !resultsContainer || !(engine instanceof SearchEngine)) {
    throw new TypeError("input, resultsContainer, and a SearchEngine instance are required");
  }

  const render = typeof renderResult === "function"
    ? renderResult
    : (result) => `<article><strong>${escapeHtml(result.document.title || result.document.id)}</strong><p>${escapeHtml(result.snippet)}</p></article>`;

  const update = () => {
    const results = engine.search(input.value);
    resultsContainer.innerHTML = results.length
      ? results.map(render).join("")
      : "<p>No matching documents found.</p>";
    return results;
  };

  input.addEventListener("input", update);
  return { update, destroy: () => input.removeEventListener("input", update) };
}

const exported = { SearchEngine, attachSearchBar, createSnippet, normalise, tokenize };

if (typeof module !== "undefined" && module.exports) {
  module.exports = exported;
}

if (typeof window !== "undefined") {
  window.MediSageSearch = exported;
}