// Imports the Google Cloud client library.
const { Storage } = require("@google-cloud/storage");

// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlaatform/google-cloud-node/blob/master/docs/authentication.md
const projectId = "project-feely";
const keyFilename =
  "/Users/francesca/Desktop/final-project/project-feely-9f7b34e6dede.json";
const storage = new Storage({ projectId, keyFilename });

// Makes an authenticated API request.
try {
  const [buckets] = storage.getBuckets();

  console.log("Buckets:");
  buckets.forEach(bucket => {
    console.log(bucket.name);
  });
} catch (err) {
  console.error("ERROR:", err);
}

exports.quickstart = (req, res, next) => {
  // Imports the Google Cloud client library
  const language = require("@google-cloud/language");

  // Instantiates a client
  const client = new language.LanguageServiceClient({ projectId, keyFilename });

  // The text to analyze
  const text =
    "Hello, world!I am very happy because Sandeep is helping me to write amazing code!";

  const document = {
    content: text,
    type: "PLAIN_TEXT"
  };

  console.log("client", client);

  // Detects the sentiment of the text

  // client
  //   .analyzeSentiment({ document: document })
  //   .then(responses => {
  //     var response = responses[0];
  //     console.log(
  //       "response from google naturale SENTIMENT",
  //       response.documentSentiment.score
  //     );
  //     return response;
  //     // doThingsWith()
  //     // store the result in database
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });

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
    type: "PLAIN_TEXT"
  };

  return client.analyzeSentiment({ document: document });
};

// quickstart().catch(console.error);
