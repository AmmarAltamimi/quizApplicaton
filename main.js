let category = document.querySelectorAll(".CategoryType");
let categoryName = document.querySelectorAll(".category span")
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let countQ = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let spans = document.querySelector(".spans");
let minSpan = document.querySelector(".min");
let secSpan = document.querySelector(".sec");
let submit = document.querySelector(".submit-button");
let results = document.querySelector(".results");


let api="https://opentdb.com/api.php?amount=10&category=9&difficulty=easy";
let currentIndex = 0;
let randomIndexArray = [];
let setIntervalTime;
let rightAnsCounter = 0; 




//choose category
category[1].style.display="none";
category[2].style.display="none";

categoryName.forEach((span,index)=>{
span.addEventListener("click",()=>{
    //remove class active from all and put it at clicked element
    categoryName.forEach((ele)=>{
        ele.classList.remove("active")
    })
    span.classList.add("active");



    //hide all div and display clicked div
    category.forEach((div)=>{
        div.style.display="none";
    })
    category[index].style.display="block"


    //get api from clicked element
    api=span.getAttribute("api");
    console.log(api);
})

})


let Reqest = new XMLHttpRequest();
    Reqest.open("GET",api);
    Reqest.send();

Reqest.onload = function (){
    if(this.readyState == 4 && this.status == 200 ){
        let jsonRe = JSON.parse(this.responseText);
        let QArray = jsonRe["results"];
       //create bullets
        createBullets(QArray.length);
        //createCountDown
        countDown(11);        
        //make array with random index and use it as index in QArray
        chooseRandomIndex(QArray);
        //add question and answer to page
        let object = QArray[randomIndexArray[currentIndex]]
        addQuestionAndAnswer(object);
        //make question count 
        countQ.innerHTML= QArray.length;
        //submit answer click
        let correctAns = object["correct_answer"];
        submit.addEventListener("click",()=>{
            clickSubmit(QArray,correctAns);
        });

        



    }

}





//make array with randow index and use it as index in QArray
function chooseRandomIndex(array){
    //make array with randow index and use it as index in QArray
    while(array.length > randomIndexArray.length) {
        let randomIndex = Math.round(Math.random() * array.length);
        if(!randomIndexArray.includes(randomIndex)){
            randomIndexArray.push(randomIndex);
        }
    }
}





 //add question and answer to page
function addQuestionAndAnswer(object){

    quizArea.innerHTML="";
    answersArea.innerHTML="";
    //add Question to page
    let h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode(object["question"]));
    quizArea.appendChild(h2);

    
    //collect answer from json and add wrong answer with correct in one array to ranndow them then display them
    let answers =object["incorrect_answers"].concat(object["correct_answer"]);
   // choose random(use another way and we can use first way above) and display it  && count for id to be different for each answer 
   let count = 1;
    while(answers.length > 0){
        let random = Math.floor(Math.random() * answers.length);

        //add answer to page 
        let answerDiv = document.createElement("div");
        answerDiv.className = "answer";
        //create radio
        let radioAnwser = document.createElement("input");
        radioAnwser.type="radio";
        radioAnwser.name = "questions";
        radioAnwser.id = `answer${count}`;
        radioAnwser.setAttribute("itsAnswer",answers[random])
        // create lable
        let labelAnswer = document.createElement("label");
        labelAnswer.htmlFor = `answer${count}`;
        labelAnswer.appendChild(document.createTextNode(answers[random]));
        if(count ==1 ){
            //add checked on first answer of each question 
            radioAnwser.checked=true;
        }
        //add to page
        answersArea.appendChild(answerDiv);
        answerDiv.appendChild(radioAnwser);
        answerDiv.appendChild(labelAnswer);

        //delete ele from array means delete answer from array 
        answers.splice(random,1);
        // for id to be different for each answer and same in label and input for same anwser
        count++;
    }



}






   //submit answer click
function  clickSubmit(QArray,correctAns){
// four things will do

//1 get current answer and compare it with correct answer
let radio = document.querySelectorAll('[type="radio"]');
let yourAnswer;
radio.forEach((ele)=>{
    if(ele.checked){
        yourAnswer = ele.getAttribute("itsAnswer");
    }
})
if(yourAnswer == correctAns){
    rightAnsCounter++;
}





currentIndex++;
//if there still question
if(QArray.length-1 >= currentIndex){

//2 move to next question 
let object = QArray[randomIndexArray[currentIndex]];
addQuestionAndAnswer(object);

//3 bold bullets
let currentBullets = document.querySelectorAll(".spans span ")[currentIndex];
currentBullets.className="on";

//4 rest countDown
clearInterval(setIntervalTime);
countDown(11);


}

else{

//finish and delete question and answer  and put result
    quizArea.remove();
    answersArea.remove();

    let  rate;
    if(rightAnsCounter >(QArray.length /2) && rightAnsCounter !=QArray.length ){
        rate = "Good";

    }
    else if (rightAnsCounter == QArray.length){
        rate = "Perfect";
    }
    else{
        rate = "Bad";
    }

    results.innerHTML=`${rate} , ${rightAnsCounter} of ${QArray.length} is correct`;
    //add style
    results.style.padding = "10px";
    results.style.backgroundColor = "white";
    results.style.marginTop = "10px";
    bullets.style.padding="none";


//remove bullets countTime & submit
bullets.remove();
submit.remove();




}




}








//create bullets
function createBullets(questionNo){

    for(let i=0 ; i < questionNo ; i++){
        let span = document.createElement("span");
        spans.appendChild(span);
        if(i==0){
            span.className='on';
        }
    }
}








  //createCountDown
function countDown(duration){


    setIntervalTime = setInterval(()=>{
        
        let min = Math.floor(duration / (60));
        let sec = Math.floor(duration % (60));
        minSpan.innerHTML = min >= 10 ? min : `0${min}:` ;
        secSpan.innerHTML = sec >= 10 ? sec : `0${sec}` ;

        duration--;

        if(duration < 0){
            clearInterval(setIntervalTime);
            submit.click();
        }


    },1000)



}