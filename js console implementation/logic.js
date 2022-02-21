const fs = require("fs");
const readline = require('readline-sync');

var wordsChosenSoFar= new Set();
var wordSet=new Set();

function readAnswerFile() {
    return new Promise(resolve => {
        fs.readFile("answers.txt", (err, data) => {
            var chosenWord="";
            if (err) throw err;
            wordString=data.toString().split("\n");
            while(1){
             var wordId=Math.floor(Math.random()*wordString.length);
             if(wordsChosenSoFar.has(wordId)==false) {
                 wordsChosenSoFar.add(wordId)
                 break;
             }
            }
            chosenWord=wordString[wordId];
            //console.log(chosenWord)
            resolve(chosenWord);
         });
    });
  }



function readGuessesFile() {
return new Promise(resolve => {
    fs.readFile("allowed-guesses.txt", (err, data) => {
        if (err) throw err;
        wordString=data.toString().split("\n");
        var allowedGuess=new Set(wordString);
        resolve(allowedGuess);
        });
});
}

async function main(){
    const a = await readAnswerFile();
    const b = await readGuessesFile();
    return [a,b];
}

function makeAGuess(guessWord,answer){
    score=["B","B","B","B","B"];
    if(wordSet.has(guessWord)==false){
        return [];
    }
    guessWord=guessWord.split('');
    answer=answer.split('');
    for(var i=0;i<5;i++) {
        if(guessWord[i]==answer[i]){
            score[i]="G";
            answer[i]="0"
            guessWord[i]="0"
        }
    }
    for(i=0;i<5;i++){
        for(j=0;j<5;j++){
            if((i!=j)&&(guessWord[i]==answer[j])&&(guessWord[i]!="0")){
                score[i]="Y";
                guessWord[i]="0";
                answer[j]="0";
            }
        }
    }
    return score
}

main().then((data) => {
    answer=data[0];
    wordSet=data[1];
    var tries=0
    var score=[]
    var result=false;
    var guess;
    while(tries<6){
        guess = readline.question(`Make a guess?\n`);
        score=makeAGuess(guess,answer);
        if(score.length==0) {
            console.log("Invalid guess");
            continue;
        }
        tries+=1
        console.log(score)
        if((score.toString())==['G', 'G', 'G', 'G', 'G'].toString()){
            result=true
            break;
        }
     console.log(answer);   
    }
    if(result==true){
        console.log("Success! Score = ",tries);
    }
    else{
        console.log("Better luck next time!. The word was: ",answer)
    }

  });