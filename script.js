let questions = [];
let current = 0;
let score = 0;
let startTime = 0;
let currentSubject = "";
let currentGrade = "";
let playerName = "";

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.log("Shuffled");
}

async function chooseSubject(subject){
    let html = "<h2>Chọn lớp</h2>";

    try{
        const response = await fetch( "https://api.github.com/repos/duocpvload/GaVang-Quiz/contents",
            {
                cache: "no-store"
            }
        );
        const files = await response.json();
        const grades = [];
        files.forEach(file => {
            const regex =
                new RegExp(`^${subject}_lop_(\\d+)\\.json$`);
            const match = file.name.match(regex);
            if(match){
 grades.push(parseInt(match[1]));
            }
        });

        grades.sort((a,b)=>a-b);
        grades.forEach(grade => {
            html += `
            <button onclick="loadQuiz('${subject}',${grade})">
                Lớp ${grade}
            </button>
            `;
        });

        if(grades.length === 0){
            html += "<p>Chưa có bộ đề.</p>";
        }
    }catch(error){
        console.error(error);
        html += "<p>Lỗi đọc danh sách đề.</p>";
    }
    document.getElementById("gradeArea").innerHTML = html;
}

async function loadQuiz(subject, grade){
    currentSubject = subject;
    currentGrade = grade;
    document.getElementById("gradeArea").innerHTML = "";
document.getElementById("playerArea").style.display =
        "block"; document.getElementById("startQuizBtn").onclick =
        () => startQuiz();
}

async function startQuiz(){
    playerName =
        document.getElementById("playerName")
        .value
        .trim();

    if(!playerName){
        alert("Nhập tên trước nhé");
        return;
    }

    const file =
        `${currentSubject}_lop_${currentGrade}.json`;

    const response = await fetch(
        `${file}?v=${Date.now()}`,
        {
            cache:"no-store"
        }
    );

    questions = await response.json();
    shuffle(questions);
    questions = questions.slice(0,20);

    current = 0;
    score = 0;
    startTime = Date.now();
    document.getElementById("playerArea").style.display =
        "none";
    document.getElementById("menu").style.display = "none";   document.getElementById("quiz").style.display =        "block";
    showQuestion();
}

function showQuestion(){
    const q = questions[current];
    shuffle(q.options);
    document.getElementById("progress").innerHTML =
        `Câu ${current+1}/${questions.length}`;
    document.getElementById("question").innerHTML =
        q.question;
    document.getElementById("result").innerHTML = "";
    const buttons =        document.querySelectorAll(".answerBtn");
    buttons.forEach((btn,index)=>{
        btn.className="answerBtn";
        btn.disabled = false;
        btn.innerHTML=q.options[index];
        btn.onclick=()=>checkAnswer(
            q.options[index],
            q.answer
        );
    });
}

function checkAnswer(selected, answer){
    const buttons =        document.querySelectorAll(".answerBtn");
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
        const totalSeconds =
            Math.floor(
                (Date.now()-startTime)/1000
            );
        const minutes =
            Math.floor(totalSeconds/60);
        const seconds =
            totalSeconds%60;
        saveResult(
            score,
            totalSeconds
        );
        document.getElementById("quiz").innerHTML=`
        <h2>🎉 Hoàn thành!</h2>
        <p><b>👤 Người chơi:</b> ${playerName}</p>
        <p><b>📚 Môn học:</b> ${currentSubject}</p>
        <p><b>🏫 Lớp:</b> ${currentGrade}</p>
        <h1>🏆 ${score}/${questions.length}</h1>
        <p>
        ⏱️ Thời gian:
        ${minutes} phút ${seconds} giây
        </p>
        <button onclick="showRanking('${currentSubject}')">
            🏆 Bảng xếp hạng
        </button>
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

async function saveResult(score, totalSeconds){
    const formData = new FormData();
    formData.append("name", playerName);
    formData.append("subject", currentSubject);
    formData.append("grade",currentGrade);
    formData.append("score",`${score}`);
    formData.append("time",totalSeconds);

    console.log("Bắt đầu lưu!!");
    try{
        await fetch(
            "https://script.google.com/macros/s/AKfycbweGPipn842O_GlWeNF4NdA2JBIoY_Jd4X5k0FXR_jyW_Q8E9gCCyUA0jMUUBUlDCzjgA/exec",
            {
                method:"POST",
                body: formData
            }
        );
        console.log("Đã lưu");
    }
    catch(err){
        console.error(err);
    }
}

async function showRanking(subject){
    const response = await fetch("https://script.google.com/macros/s/AKfycbweGPipn842O_GlWeNF4NdA2JBIoY_Jd4X5k0FXR_jyW_Q8E9gCCyUA0jMUUBUlDCzjgA/exec");
    const rows = await response.json();
    rows.shift();
    const filtered = rows.filter(r => r[1] === subject);
    console.log("subject");
    console.log("subject ${subject}");
    console.log("${r[1]}");
    filtered.sort((a, b) => {
        const sa = Number(a[3]) || 0;
        const sb = Number(b[3]) || 0;

        if (sb !== sa) return sb - sa;
            const ta = Number(a[4]) || 0;
            const tb = Number(b[4]) || 0;
            return ta - tb;
    });

    let html = `<h2>🏆 ${subject}</h2>`;
    filtered.slice(0,10).forEach((r,i)=>{
        html += `<p>${i+1}.${r[0]}(${r[3]})</p>`;
    });

    document.getElementById("ranking").innerHTML = html;
}
