// Imports the Google Cloud client library.
const { Storage } = require("@google-cloud/storage");

const projectId = "project-feely";
const keyFilename =
  "/Users/francesca/Desktop/final-project/project-feely-6500b04512ac.json";
const storage = new Storage({ projectId, keyFilename });

async function listBuckets() {
  // Lists all buckets in the current project
  const [buckets] = await storage.getBuckets();
  console.log("Buckets:");
  buckets.forEach((bucket) => {
    console.log(bucket.name);
  });
}

listBuckets().catch(console.error);

exports.quickstart = (req, res, next) => {
  // Imports the Google Cloud client library
  const language = require("@google-cloud/language");

  // Instantiates a client
  const client = new language.LanguageServiceClient({ projectId, keyFilename });

  // The text to analyze
  const text = "Hello, world!";
  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  console.log("client", client);
  return client.analyzeSentiment({ document: document });
};

exports.getSentimentScore = (answer1, answer2, answer3) => {
  // Imports the Google Cloud client library
  const language = require("@google-cloud/language");

  // Instantiates a client
  const client = new language.LanguageServiceClient({ projectId, keyFilename });

  // The text to analyze
  const text = answer1 + ". " + answer2 + ". " + answer3;

  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  return client.analyzeSentiment({ document: document });
};
