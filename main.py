
import tkinter as tk
from tkinter import ttk, messagebox
import json
from pathlib import Path

DATA_DIR = Path(__file__).parent

class QuizApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Học Tập Tiểu Học")
        self.root.geometry("1000x700")
        self.show_main()

    def clear(self):
        for w in self.root.winfo_children():
            w.destroy()

    def show_main(self):
        self.clear()
        frm = ttk.Frame(self.root, padding=20)
        frm.pack(fill="both", expand=True)

        ttk.Label(frm,text="CHƯƠNG TRÌNH HỌC TẬP",font=("Arial",24,"bold")).pack(pady=20)

        for subject in ["toan","tieng_viet"]:
            txt = "Toán" if subject=="toan" else "Tiếng Việt"
            ttk.Button(frm,text=txt,command=lambda s=subject:self.show_grades(s)).pack(fill="x",pady=5)

        ttk.Label(frm,text="Lịch sử và Địa lý sẽ bổ sung sau").pack(pady=20)

    def show_grades(self, subject):
        self.clear()
        frm = ttk.Frame(self.root,padding=20)
        frm.pack(fill="both", expand=True)

        ttk.Label(frm,text="Chọn lớp",font=("Arial",20)).pack(pady=10)

        for grade in range(1,6):
            ttk.Button(frm,text=f"Lớp {grade}",
                       command=lambda g=grade,s=subject:self.start_quiz(s,g)).pack(fill="x",pady=3)

        ttk.Button(frm,text="Back",command=self.show_main).pack(pady=20)

    def start_quiz(self, subject, grade):
        path = DATA_DIR/f"{subject}_lop_{grade}.json"
        questions = json.loads(path.read_text(encoding="utf-8"))
        QuizScreen(self.root, questions, lambda:self.show_grades(subject))

class QuizScreen:
    def __init__(self, root, questions, back):
        self.root=root; self.questions=questions; self.back=back
        self.idx=0; self.score=0

        for w in root.winfo_children():
            w.destroy()

        self.frm=ttk.Frame(root,padding=20)
        self.frm.pack(fill="both",expand=True)

        self.lbl=ttk.Label(self.frm,font=("Arial",18),wraplength=800)
        self.lbl.pack(pady=20)

        self.var=tk.StringVar()
        self.btns=[]
        for _ in range(4):
            rb=ttk.Radiobutton(self.frm,variable=self.var)
            rb.pack(anchor="w",pady=3)
            self.btns.append(rb)

        ttk.Button(self.frm,text="Trả lời",command=self.check).pack(pady=10)
        ttk.Button(self.frm,text="Back",command=self.back).pack()
        self.load()

    def load(self):
        q=self.questions[self.idx]
        self.lbl.config(text=q["question"])
        self.var.set("")
        for i,opt in enumerate(q["options"]):
            self.btns[i].config(text=opt,value=opt)

    def check(self):
        if self.var.get()==self.questions[self.idx]["answer"]:
            self.score+=1
        self.idx+=1
        if self.idx>=len(self.questions):
            messagebox.showinfo("Kết quả",f"Điểm: {self.score}/{len(self.questions)}")
            self.back()
        else:
            self.load()

root=tk.Tk()
style=ttk.Style()
try: style.theme_use("clam")
except: pass
QuizApp(root)
root.mainloop()
