let questions = [];
let current = 0;
let score = 0;

function chooseSubject(subject){

    let html = "<h2>Chọn lớp</h2>";

    for(let i=1;i<=5;i++){
        html += `
        <button onclick="loadQuiz('${subject}',${i})">
        Lớp ${i}
        </button>`;
    }

    document.getElementById("gradeArea").innerHTML = html;
}

async function loadQuiz(subject, grade){

    const file = `${subject}_lop_${grade}.json`;

    const response = await fetch(file);

    questions = await response.json();

    current = 0;
    score = 0;

    document.getElementById("menu").style.display="none";
    document.getElementById("quiz").style.display="block";

    showQuestion();
}

function showQuestion(){

    const q = questions[current];

    document.getElementById("progress").innerHTML =
        `Câu ${current+1}/${questions.length}`;

    document.getElementById("question").innerHTML =
        q.question;

    document.getElementById("result").innerHTML = "";

    const buttons =
        document.querySelectorAll(".answerBtn");

    buttons.forEach((btn,index)=>{

        btn.className="answerBtn";

        btn.innerHTML=q.options[index];

        btn.onclick=()=>checkAnswer(
            q.options[index],
            q.answer
        );
    });
}

function checkAnswer(selected, answer){

    const buttons =
        document.querySelectorAll(".answerBtn");

    buttons.forEach(btn=>btn.disabled=true);

    if(selected===answer){

        score++;

        buttons.forEach(btn=>{
            if(btn.innerHTML===answer){
                btn.classList.add("correct");
            }
        });

        document.getElementById("result").innerHTML="✅ Đúng";
    }
    else{

        buttons.forEach(btn=>{

            if(btn.innerHTML===selected){
                btn.classList.add("wrong");
            }

            if(btn.innerHTML===answer){
                btn.classList.add("correct");
            }
        });

        document.getElementById("result").innerHTML=
            `❌ Sai<br>Đáp án đúng: ${answer}`;
    }

    setTimeout(()=>{

        current++;

        if(current>=questions.length){

            document.getElementById("quiz").innerHTML=`
            <h2>Hoàn thành!</h2>
            <h1>${score}/${questions.length}</h1>
            <button onclick="location.reload()">
                Chơi lại
            </button>
            `;
        }
        else{
            showQuestion();
        }

    },1500);
}