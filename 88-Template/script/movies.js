const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

const API_KEY_OPTION = "OMDb API Key";
const API_URL = "http://www.omdbapi.com/";

module.exports = {
  entry: start,
  settings: {
    name: "Movie Script",
    author: "Christian B. B. Houmann",
    options: {
      [API_KEY_OPTION]: {
        type: "text",
        defaultValue: "",
        placeholder: "OMDb API Key",
      },
    },
  },
};

let QuickAdd;
let Settings;

async function start(params, settings) {
  QuickAdd = params;
  Settings = settings;

  const query = await QuickAdd.quickAddApi.inputPrompt(
    "Enter movie title or IMDB ID: "
  );
  if (!query) {
    notice("No query entered.");
    throw new Error("No query entered.");
  }

  let selectedShow;

  if (isImdbId(query)) {
    selectedShow = await getByImdbId(query);
  } else {
    const results = await getByQuery(query);

    const choice = await QuickAdd.quickAddApi.suggester(
      results.map(formatTitleForSuggestion),
      results
    );
    if (!choice) {
      notice("No choice selected.");
      throw new Error("No choice selected.");
    }

    selectedShow = await getByImdbId(choice.imdbID);
  }

  QuickAdd.variables = {
    ...selectedShow,
    actorLinks: linkifyList(selectedShow.Actors.split(",")),
    genreLinks: linkifyList(selectedShow.Genre.split(",")),
    directorLink:
      selectedShow.Director === "N/A" ? " " : `[[${selectedShow.Director}]]`,
    fileName: replaceIllegalFileNameCharactersInString(selectedShow.Title),
    typeLink: `[[${selectedShow.Type === "movie" ? "Movies" : "Series"}]]`,
  };
}

function isImdbId(str) {
  return /^tt\d+$/.test(str);
}

function formatTitleForSuggestion(resultItem) {
  return `(${resultItem.Type === "movie" ? "M" : "TV"}) ${resultItem.Title} (${
    resultItem.Year
  })`;
}

async function getByQuery(query) {
  const searchResults = await apiGet(API_URL, {
    s: query,
  });

  if (!searchResults.Search || !searchResults.Search.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }

  return searchResults.Search;
}

async function getByImdbId(id) {
  const res = await apiGet(API_URL, {
    i: id,
  });

  if (!res) {
    notice("No results found.");
    throw new Error("No results found.");
  }

  return res;
}

function linkifyList(list) {
  if (list.length === 0) return "";
  if (list.length === 1) return `[[${list[0]}]]`;

  return list.map((item) => `[[${item.trim()}]]`).join(", ");
}

function replaceIllegalFileNameCharactersInString(string) {
  return string.replace(/[\\,#%&\{\}\/*<>?$\'\":@]*/g, "");
}

async function apiGet(url, data) {
  let finalURL = new URL(url);
  if (data)
    Object.keys(data).forEach((key) =>
      finalURL.searchParams.append(key, data[key])
    );

  finalURL.searchParams.append("apikey", Settings[API_KEY_OPTION]);

  const res = await request({
    url: finalURL.href,
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return JSON.parse(res);
}