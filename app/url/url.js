const uuidv4 = require("uuid/v4");
const { domain } = require("../../environment");
const SERVER = `${domain.protocol}://${domain.host}`;

const UrlModel = require("./schema");
const CounterModel = require("../counter/schema");
const parseUrl = require("url").parse;
const validUrl = require("valid-url");
const { encode } = require("../lib/shortner");

function getNextSequence() {
  return CounterModel.findOneAndUpdate(
    { id: "urls" },
    { $inc: { seq: 1 }},
    { upsert: true, new: true }
  );
}

/**
 * Lookup for existant, active shortened URLs by hash.
 * 'null' will be returned when no matches were found.
 * @param {string} hash
 * @returns {object}
 */
async function getUrl(hash) {
  let source = await UrlModel.findOne({ active: true, hash });
  return source;
}

/**
 * Generate an unique hash-ish- for an URL.
 * @param {string} id
 * @returns {string} hash
 */
async function generateHash() {
  let sequence;

  try {
    sequence = await getNextSequence();
  } catch(e) {}
   
  if(!sequence || !sequence.seq) {
    throw new Error("Cannot generate sequence");
  }

  return encode(sequence.seq);
}

/**
 * Generate a random token that will allow URLs to be (logical) removed
 * @returns {string} uuid v4
 */
function generateRemoveToken() {
  return uuidv4();
}

/**
 * Create an instance of a shortened URL in the DB.
 * Parse the URL destructuring into base components (Protocol, Host, Path).
 * An Error will be thrown if the URL is not valid or saving fails.
 * @param {string} url
 * @param {string} hash
 * @returns {object}
 */
async function shorten(url, hash) {
  if (!isValid(url)) {
    throw new Error("Invalid URL");
  }

  // Get URL components for metrics sake
  const urlComponents = parseUrl(url);
  const protocol = urlComponents.protocol || "";
  const domain = `${urlComponents.host || ""}${urlComponents.auth || ""}`;
  const path = `${urlComponents.path || ""}${urlComponents.hash || ""}`;

  // Generate a token that will alow an URL to be removed (logical)
  const removeToken = generateRemoveToken();

  // Create a new model instance
  const shortUrl = new UrlModel({
    url,
    protocol,
    domain,
    path,
    hash,
    isCustom: false,
    removeToken,
    active: true
  });

  const saved = await shortUrl.save();
  // TODO: Handle save errors

  return {
    url,
    shorten: `${SERVER}/${hash}`,
    hash,
    removeUrl: `${SERVER}/${hash}/remove/${removeToken}`
  };
}

/**
 * Validate URI
 * @param {any} url
 * @returns {boolean}
 */
function isValid(url) {
  return validUrl.isUri(url);
}

module.exports = {
  shorten,
  getUrl,
  generateHash,
  generateRemoveToken,
  isValid
};
