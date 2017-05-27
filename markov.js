var chain = {};

function addToChain(firstWord, secondWord) {
    //if we havent seen the first word before, add a new object to hold it
    if (chain[firstWord] === undefined) {
        chain[firstWord] = {};
    } 
    //if we havent seemn the second word before, add a new object within the first object to hold it
    if (chain[firstWord][secondWord] === undefined) {
        chain[firstWord][secondWord] = 0;
    }
    //mark that we've seen the first-second chain again
    chain[firstWord][secondWord] ++;
}

function sanitize(word) {
    return word.toLowerCase().replace(/[^a-z@:/']/g, '');
}

function train(text) {
    var words = text.split(/[ \n]+/);
    words.push("eot"); //at end of each string, pushing on that its the end of the tweet
    words.unshift("sot");
    for (var i = 0; i < words.length - 1; i++) {
        addToChain(
            sanitize(words[i]), 
            sanitize(words[i + 1])
        );
    }
}


function pickRandomNext(firstWord) {
    var temp = [];
    //for each potential next word
    for (secondWord in chain[firstWord]) {
        //push copies of that word into temp, equal to probability
        for (var i = 0; i < chain[firstWord][secondWord]; i++) {
            temp.push(secondWord);
        }
    }
    //return a random number from temp
    return temp[Math.floor(Math.random() * temp.length)];
}

function generate() {
    var currentWord = "sot";
    var output = "";
    while (currentWord !== "eot") {
        output += currentWord + " ";
        currentWord = pickRandomNext(currentWord);
    }
    chain = {};
    return output.slice(3, output.length); // removes the "sot" start phrase
}

function resetChain() {
    chain = {};
}

module.exports = {
    train: train,
    generate: generate,
    reset: resetChain
};