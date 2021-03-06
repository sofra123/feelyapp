var natural = require("natural");
var tokenizer = new natural.WordTokenizer();
var Analyzer = require("natural").SentimentAnalyzer;
var stemmer = require("natural").PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "senticon");

//returns the sentiment of a string on a scale from -1 to 1
function getStringSentiment(string) {
  const tokenizedString = tokenizer.tokenize(string);
  return analyzer.getSentiment(tokenizedString);
}

module.exports = {
  //returns the sentiment of a string on a scale from -1 to 1
  getSentimentRank: function(ans1, ans2, ans3) {
    // let emojiRank = Number(emoji);
    let ans1Rank = getStringSentiment(ans1);
    let ans2Rank = getStringSentiment(ans2);
    let ans3Rank = getStringSentiment(ans3);

    let sentimentRank =
      ((emojiRank * 3 + ans1Rank + ans2Rank + ans3Rank) / 6 + 1) * 5;

    console.log(sentimentRank);
    return sentimentRank;
  },
};

sentimentscore + (1 * 10) / 2;
