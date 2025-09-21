// Global Variables
let currentSection = 'home';
let currentQuiz = null;
let currentQuizData = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizTimer = null;
let testTimer = null;
let testTimeLeft = 0;

// Navigation
$(document).ready(function() {
    // Initialize navigation
    $('.main-nav a').click(function(e) {
        e.preventDefault();
        const section = $(this).data('section');
        showSection(section);
    });
    
    // Show home section by default
    showSection('home');
    
    // Initialize tooltips and animations
    initializeAnimations();
});

function showSection(sectionName) {
    // Hide all sections
    $('.content-section').removeClass('active');
    
    // Show selected section
    $(`#${sectionName}`).addClass('active');
    
    // Update navigation
    $('.main-nav a').removeClass('active');
    $(`.main-nav a[data-section="${sectionName}"]`).addClass('active');
    
    currentSection = sectionName;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function startLearning() {
    showSection('lessons');
}

// Lesson Functions
function expandLesson(lessonNumber) {
    const lessons = {
        1: {
            title: "שיעור 1 - יסודות פייתון",
            content: `
<h3>משתנים וטיפוסי נתונים</h3>
<div class="lesson-content">
    <h4>הגדרת משתנים:</h4>
    <div class="code-example">
        <code>name = "דוד"
age = 25
height = 1.75
is_student = True</code>
    </div>
    
    <h4>טיפוסי נתונים בסיסיים:</h4>
    <ul>
        <li><strong>str</strong> - מחרוזת (טקסט)</li>
        <li><strong>int</strong> - מספר שלם</li>
        <li><strong>float</strong> - מספר עשרוני</li>
        <li><strong>bool</strong> - ערך בוליאני (True/False)</li>
    </ul>
    
    <h4>פעולות חשבון:</h4>
    <div class="code-example">
        <code>x = 10
y = 3
print(x + y)  # חיבור: 13
print(x - y)  # חיסור: 7
print(x * y)  # כפל: 30
print(x / y)  # חילוק: 3.333...
print(x // y) # חילוק שלם: 3
print(x % y)  # שארית: 1
print(x ** y) # חזקה: 1000</code>
    </div>
    
    <h4>תרגילים:</h4>
    <ol>
        <li>צור משתנה עם השם שלך והדפס אותו</li>
        <li>חשב את השטח של מלבן באורך 5 ורוחב 3</li>
        <li>המר טמפרטורה מצלזיוס לפרנהייט</li>
    </ol>
</div>`
        },
        2: {
            title: "שיעור 2 - קלט, פלט ותנאים",
            content: `
<h3>קלט ופלט</h3>
<div class="lesson-content">
    <h4>קבלת קלט מהמשתמש:</h4>
    <div class="code-example">
        <code>name = input("מה השם שלך? ")
age = int(input("כמה את/ה בן/בת? "))
print(f"שלום {name}, את/ה בן/בת {age}")</code>
    </div>
    
    <h4>משפטי תנאי:</h4>
    <div class="code-example">
        <code>age = int(input("מה הגיל שלך? "))

if age >= 18:
    print("את/ה מבוגר/ת")
elif age >= 13:
    print("את/ה נער/ה")
else:
    print("את/ה ילד/ה")
    
# אופרטורים לוגיים
if age >= 18 and age <= 65:
    print("יכול לעבוד")
    
if age < 12 or age > 65:
    print("כניסה חופשית")</code>
    </div>
    
    <h4>לולאות:</h4>
    <div class="code-example">
        <code># לולאת for
for i in range(5):
    print(f"מספר: {i}")

# לולאת while
count = 0
while count < 3:
    print(f"ספירה: {count}")
    count += 1
    
# לולאה על רשימה
fruits = ["תפוח", "בננה", "תפוז"]
for fruit in fruits:
    print(fruit)</code>
    </div>
</div>`
        },
        3: {
            title: "שיעור 3 - רשימות ופונקציות",
            content: `
<h3>עבודה עם רשימות</h3>
<div class="lesson-content">
    <h4>יצירת רשימות:</h4>
    <div class="code-example">
        <code>numbers = [1, 2, 3, 4, 5]
names = ["אלי", "דנה", "רון"]
mixed = [1, "שלום", 3.14, True]
empty_list = []</code>
    </div>
    
    <h4>פעולות על רשימות:</h4>
    <div class="code-example">
        <code>fruits = ["תפוח", "בננה"]

# הוספת איברים
fruits.append("תפוז")        # הוספה בסוף
fruits.insert(1, "אבטיח")    # הוספה במקום מסוים

# הסרת איברים
fruits.remove("בננה")        # הסרה לפי ערך
last_fruit = fruits.pop()    # הסרה והחזרת האיבר האחרון

# גישה לאיברים
print(fruits[0])             # האיבר הראשון
print(fruits[-1])            # האיבר האחרון
print(len(fruits))           # מספר האיברים</code>
    </div>
    
    <h4>הגדרת פונקציות:</h4>
    <div class="code-example">
        <code>def greet(name):
    return f"שלום {name}!"

def calculate_area(length, width):
    area = length * width
    return area

def print_numbers(n):
    for i in range(1, n + 1):
        print(i)

# קריאה לפונקציות
message = greet("משה")
print(message)

area = calculate_area(5, 3)
print(f"השטח הוא: {area}")

print_numbers(5)</code>
    </div>
</div>`
        },
        4: {
            title: "שיעור 4 - מבני נתונים מתקדמים",
            content: `
<h3>טיופלים, מילונים וקבוצות</h3>
<div class="lesson-content">
    <h4>טיופלים (Tuples):</h4>
    <div class="code-example">
        <code># טיופל - מבנה נתונים שאינו ניתן לשינוי
coordinates = (10, 20)
colors = ("אדום", "כחול", "ירוק")

# גישה לאיברים
x, y = coordinates
print(f"X: {x}, Y: {y}")
print(colors[0])  # "אדום"</code>
    </div>
    
    <h4>מילונים (Dictionaries):</h4>
    <div class="code-example">
        <code># מילון - זוגות מפתח-ערך
student = {
    "name": "יוסי",
    "age": 20,
    "grades": [85, 90, 88]
}

# גישה ושינוי ערכים
print(student["name"])
student["age"] = 21
student["city"] = "תל אביב"

# מעבר על המילון
for key, value in student.items():
    print(f"{key}: {value}")

# בדיקת קיום מפתח
if "name" in student:
    print("המפתח 'name' קיים")</code>
    </div>
    
    <h4>קבוצות (Sets):</h4>
    <div class="code-example">
        <code># קבוצה - איברים ייחודיים ללא סדר
fruits = {"תפוח", "בננה", "תפוז"}
numbers = {1, 2, 3, 2, 1}  # יהיה {1, 2, 3}

# פעולות על קבוצות
fruits.add("אבטיח")
fruits.remove("בננה")

# פעולות מתמטיות
set1 = {1, 2, 3}
set2 = {3, 4, 5}

print(set1.union(set2))        # איחוד: {1, 2, 3, 4, 5}
print(set1.intersection(set2)) # חיתוך: {3}</code>
    </div>
</div>`
        },
        5: {
            title: "שיעור 5 - סיכום ביניים ועבודת כיתה",
            content: `
<h3>חזרה כללית ותרגילים מתקדמים</h3>
<div class="lesson-content">
    <h4>דוגמאות למשימות מתקדמות:</h4>
    
    <h5>1. מערכת ניהול ציונים:</h5>
    <div class="code-example">
        <code>def calculate_average(grades):
    return sum(grades) / len(grades)

def get_letter_grade(average):
    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"

students = {
    "אלי": [85, 90, 88],
    "דנה": [92, 87, 95],
    "רון": [78, 82, 75]
}

for name, grades in students.items():
    avg = calculate_average(grades)
    letter = get_letter_grade(avg)
    print(f"{name}: ממוצע {avg:.1f}, ציון {letter}")</code>
    </div>
    
    <h5>2. משחק ניחוש מספר:</h5>
    <div class="code-example">
        <code>import random

def guessing_game():
    number = random.randint(1, 100)
    attempts = 0
    max_attempts = 7
    
    print("נחש מספר בין 1 ל-100!")
    
    while attempts < max_attempts:
        guess = int(input("הזן ניחוש: "))
        attempts += 1
        
        if guess == number:
            print(f"כל הכבוד! ניחשת ב-{attempts} ניסיונות")
            return
        elif guess < number:
            print("המספר גדול יותר")
        else:
            print("המספר קטן יותר")
    
    print(f"נגמרו הניסיונות. המספר היה: {number}")

guessing_game()</code>
    </div>
    
    <h5>3. מנתח טקסט:</h5>
    <div class="code-example">
        <code>def analyze_text(text):
    words = text.split()
    
    analysis = {
        "word_count": len(words),
        "char_count": len(text),
        "char_count_no_spaces": len(text.replace(" ", "")),
        "sentence_count": text.count(".") + text.count("!") + text.count("?")
    }
    
    return analysis

text = input("הזן טקסט לניתוח: ")
result = analyze_text(text)

for key, value in result.items():
    print(f"{key}: {value}")</code>
    </div>
</div>`
        },
        6: {
            title: "שיעור 6 - נושאים מתקדמים",
            content: `
<h3>קבצים, שגיאות ומודולים</h3>
<div class="lesson-content">
    <h4>עבודה עם קבצים:</h4>
    <div class="code-example">
        <code># כתיבה לקובץ
with open("students.txt", "w", encoding="utf-8") as file:
    file.write("רשימת תלמידים:\n")
    file.write("אלי\n")
    file.write("דנה\n")
    file.write("רון\n")

# קריאה מקובץ
with open("students.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content)

# קריאה שורה אחר שורה
with open("students.txt", "r", encoding="utf-8") as file:
    for line in file:
        print(line.strip())</code>
    </div>
    
    <h4>טיפול בשגיאות:</h4>
    <div class="code-example">
        <code>try:
    age = int(input("הזן גיל: "))
    result = 100 / age
    print(f"התוצאה: {result}")
except ValueError:
    print("שגיאה: יש להזין מספר שלם")
except ZeroDivisionError:
    print("שגיאה: לא ניתן לחלק באפס")
except Exception as e:
    print(f"שגיאה כללית: {e}")
finally:
    print("בלוק זה תמיד מתבצע")</code>
    </div>
    
    <h4>שימוש במודולים:</h4>
    <div class="code-example">
        <code>import math
import random
from datetime import datetime

# שימוש במודול math
print(math.pi)
print(math.sqrt(16))
print(math.factorial(5))

# שימוש במודול random
print(random.randint(1, 10))
print(random.choice(["אדום", "כחול", "ירוק"]))

# שימוש במודול datetime
now = datetime.now()
print(f"התאריך הנוכחי: {now.strftime('%Y-%m-%d %H:%M:%S')}")</code>
    </div>
    
    <h4>יצירת מודול משלך:</h4>
    <div class="code-example">
        <code># קובץ: my_functions.py
def add_numbers(a, b):
    return a + b

def multiply_numbers(a, b):
    return a * b

PI = 3.14159

# קובץ: main.py
import my_functions

result1 = my_functions.add_numbers(5, 3)
result2 = my_functions.multiply_numbers(4, 7)
print(f"PI = {my_functions.PI}")</code>
    </div>
</div>`
        }
    };
    
    const lesson = lessons[lessonNumber];
    if (lesson) {
        // Create modal or expand content
        showLessonModal(lesson.title, lesson.content);
    }
}

function showLessonModal(title, content) {
    const modal = $(`
        <div class="lesson-modal" id="lessonModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <span class="close-modal" onclick="closeLessonModal()">&times;</span>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button onclick="closeLessonModal()">סגור</button>
                </div>
            </div>
        </div>
    `);
    
    $('body').append(modal);
    $('#lessonModal').fadeIn();
}

function closeLessonModal() {
    $('#lessonModal').fadeOut(function() {
        $(this).remove();
    });
}

// String Functions Practice
function runStringCode() {
    const code = $('#string-code').val();
    try {
        // Simple string function simulator
        let output = '';
        const lines = code.split('\n');
        
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('print(')) {
                const content = line.slice(6, -1);
                output += evaluateStringExpression(content) + '\n';
            }
        }
        
        $('#string-output').text(output);
    } catch (error) {
        $('#string-output').text('שגיאה בקוד: ' + error.message);
    }
}

function evaluateStringExpression(expr) {
    // Simple evaluator for demonstration
    try {
        if (expr.includes('len(')) {
            const match = expr.match(/len\("(.+)"\)/);
            if (match) return match[1].length;
        }
        
        if (expr.includes('.upper()')) {
            const match = expr.match(/"(.+)"\.upper\(\)/);
            if (match) return match[1].toUpperCase();
        }
        
        if (expr.includes('.lower()')) {
            const match = expr.match(/"(.+)"\.lower\(\)/);
            if (match) return match[1].toLowerCase();
        }
        
        if (expr.includes('.split()')) {
            const match = expr.match(/"(.+)"\.split\(\)/);
            if (match) return JSON.stringify(match[1].split(' '));
        }
        
        // Simple string literal
        const stringMatch = expr.match(/"(.+)"/);
        if (stringMatch) return stringMatch[1];
        
        return expr;
    } catch {
        return 'שגיאה בביטוי';
    }
}

// Practice Quiz Functions
function startPractice(category) {
    const quizData = getQuizData(category);
    currentQuiz = category;
    currentQuizData = quizData;
    currentQuestionIndex = 0;
    userAnswers = [];
    
    $('.practice-categories').hide();
    $('#practice-area').removeClass('hidden').show();
    
    setupQuiz();
    showQuestion();
}

function getQuizData(category) {
    const quizzes = {
        basics: {
            title: "יסודות פייתון",
            questions: [
                {
                    question: "איזה מהבאים הוא טיפוס נתונים נכון בפייתון?",
                    code: "",
                    options: ["str", "varchar", "string", "text"],
                    correct: 0,
                    explanation: "str הוא טיפוס הנתונים למחרוזות בפייתון"
                },
                {
                    question: "מה יהיה הפלט של הקוד הבא?",
                    code: "x = 10\ny = 3\nprint(x // y)",
                    options: ["3.333", "3", "4", "שגיאה"],
                    correct: 1,
                    explanation: "// מבצע חילוק שלם ומחזיר 3"
                },
                {
                    question: "איך מגדירים משתנה עם ערך בוליאני True?",
                    code: "",
                    options: ["is_true = true", "is_true = True", "is_true = TRUE", "is_true = 1"],
                    correct: 1,
                    explanation: "בפייתון ערכים בוליאנים מתחילים באות גדולה: True, False"
                },
                {
                    question: "מה התוצאה של 2 ** 3?",
                    code: "",
                    options: ["6", "8", "9", "23"],
                    correct: 1,
                    explanation: "** הוא אופרטור החזקה, 2³ = 8"
                },
                {
                    question: "איזה מהבאים ישמש להמרת מחרוזת למספר שלם?",
                    code: "",
                    options: ["string()", "int()", "number()", "integer()"],
                    correct: 1,
                    explanation: "int() מסב מחרוזת או מספר עשרוני למספר שלם"
                }
            ]
        },
        control: {
            title: "תנאים ולולאות",
            questions: [
                {
                    question: "מה יודפס אם x = 15?",
                    code: "x = 15\nif x > 10:\n    print('גדול')\nelse:\n    print('קטן')",
                    options: ["גדול", "קטן", "שגיאה", "כלום"],
                    correct: 0,
                    explanation: "15 > 10 הוא תנאי אמת, לכן יודפס 'גדול'"
                },
                {
                    question: "כמה פעמים תרוץ הלולאה?",
                    code: "for i in range(5):\n    print(i)",
                    options: ["4", "5", "6", "אינסוף"],
                    correct: 1,
                    explanation: "range(5) יוצר 5 מספרים: 0,1,2,3,4"
                },
                {
                    question: "מה הבעיה בקוד הבא?",
                    code: "x = 5\nwhile x > 0:\n    print(x)",
                    options: ["אין בעיה", "לולאה אינסופית", "שגיאת תחביר", "x לא מוגדר"],
                    correct: 1,
                    explanation: "x לא משתנה בלולאה, לכן התנאי תמיד אמת"
                },
                {
                    question: "מה יקרה אם age = 17?",
                    code: "age = 17\nif age >= 18:\n    print('מבוגר')\nelif age >= 13:\n    print('נער')\nelse:\n    print('ילד')",
                    options: ["מבוגר", "נער", "ילד", "שגיאה"],
                    correct: 1,
                    explanation: "17 >= 13 אמת, לכן יודפס 'נער'"
                },
                {
                    question: "איך יוצרים לולאה שרצה 3 פעמים?",
                    code: "",
                    options: ["for i in range(3):", "for i in 3:", "while i < 3:", "loop 3:"],
                    correct: 0,
                    explanation: "range(3) יוצר רצף 0,1,2 - 3 איברים"
                }
            ]
        },
        functions: {
            title: "פונקציות ורשימות",
            questions: [
                {
                    question: "איך מגדירים פונקציה שמחזירה ערך?",
                    code: "",
                    options: ["def func(): return 5", "function func() return 5", "def func() -> 5", "return func(): 5"],
                    correct: 0,
                    explanation: "def מגדיר פונקציה ו-return מחזיר ערך"
                },
                {
                    question: "מה יקרה בקוד הבא?",
                    code: "numbers = [1, 2, 3]\nnumbers.append(4)\nprint(numbers)",
                    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "שגיאה", "[4, 1, 2, 3]"],
                    correct: 1,
                    explanation: "append מוסיף איבר בסוף הרשימה"
                },
                {
                    question: "איך ניגש לאיבר השני ברשימה?",
                    code: "fruits = ['תפוח', 'בננה', 'תפוז']",
                    options: ["fruits[2]", "fruits[1]", "fruits[second]", "fruits.get(2)"],
                    correct: 1,
                    explanation: "אינדקס מתחיל מ-0, האיבר השני הוא באינדקס 1"
                },
                {
                    question: "מה יחזיר len([1, 2, 3, 4])?",
                    code: "",
                    options: ["3", "4", "5", "שגיאה"],
                    correct: 1,
                    explanation: "len מחזיר את מספר האיברים ברשימה"
                },
                {
                    question: "איך מסירים איבר מרשימה לפי ערכו?",
                    code: "",
                    options: ["list.delete()", "list.remove()", "list.pop()", "list.clear()"],
                    correct: 1,
                    explanation: "remove מסיר איבר לפי הערך שלו"
                }
            ]
        },
        strings: {
            title: "פונקציות מחרוזות",
            questions: [
                {
                    question: "מה יחזיר 'Hello'.upper()?",
                    code: "",
                    options: ["hello", "HELLO", "Hello", "שגיאה"],
                    correct: 1,
                    explanation: "upper() הופך את כל האותיות לגדולות"
                },
                {
                    question: "מה התוצאה של הקוד?",
                    code: "text = '  שלום עולם  '\nprint(text.strip())",
                    options: ["'  שלום עולם  '", "'שלום עולם'", "'שלוםעולם'", "שגיאה"],
                    correct: 1,
                    explanation: "strip() מסיר רווחים מההתחלה והסוף"
                },
                {
                    question: "איך מפצלים מחרוזת לרשימה?",
                    code: "text = 'א,ב,ג'",
                    options: ["text.split()", "text.split(',')", "text.divide(',')", "text.break(',')"],
                    correct: 1,
                    explanation: "split עם פרמטר מפצל לפי התו שצוין"
                },
                {
                    question: "מה יחזיר 'python'.find('th')?",
                    code: "",
                    options: ["2", "3", "4", "-1"],
                    correct: 1,
                    explanation: "find מחזיר את האינדקס הראשון של המחרוזת שנמצאה"
                },
                {
                    question: "איך מחליפים טקסט במחרוזת?",
                    code: "",
                    options: ["replace(old, new)", "change(old, new)", "swap(old, new)", "substitute(old, new)"],
                    correct: 0,
                    explanation: "replace מחליף את כל המופעים של הטקסט הישן בחדש"
                }
            ]
        }
    };
    
    return quizzes[category];
}

function setupQuiz() {
    $('#quiz-title').text(currentQuizData.title);
    $('#question-counter').text(`שאלה 1 מתוך ${currentQuizData.questions.length}`);
    updateProgressBar();
}

function showQuestion() {
    const question = currentQuizData.questions[currentQuestionIndex];
    
    $('#question-text').text(question.question);
    $('#question-code').text(question.code);
    if (!question.code) {
        $('#question-code').hide();
    } else {
        $('#question-code').show();
    }
    
    // Create answer options
    const optionsHtml = question.options.map((option, index) => 
        `<div class="answer-option" data-index="${index}">${option}</div>`
    ).join('');
    
    $('#answer-options').html(optionsHtml);
    
    // Add click handlers
    $('.answer-option').click(function() {
        $('.answer-option').removeClass('selected');
        $(this).addClass('selected');
        userAnswers[currentQuestionIndex] = parseInt($(this).data('index'));
    });
    
    // Restore previous answer if exists
    if (userAnswers[currentQuestionIndex] !== undefined) {
        $(`.answer-option[data-index="${userAnswers[currentQuestionIndex]}"]`).addClass('selected');
    }
    
    // Update buttons
    $('#prev-btn').prop('disabled', currentQuestionIndex === 0);
    $('#next-btn').prop('disabled', false);
    
    if (currentQuestionIndex === currentQuizData.questions.length - 1) {
        $('#next-btn').addClass('hidden');
        $('#submit-btn').removeClass('hidden');
    } else {
        $('#next-btn').removeClass('hidden');
        $('#submit-btn').addClass('hidden');
    }
    
    // Update counter and progress
    $('#question-counter').text(`שאלה ${currentQuestionIndex + 1} מתוך ${currentQuizData.questions.length}`);
    updateProgressBar();
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / currentQuizData.questions.length) * 100;
    $('#progress-fill').css('width', progress + '%');
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuizData.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function submitQuiz() {
    // Calculate score
    let score = 0;
    for (let i = 0; i < currentQuizData.questions.length; i++) {
        if (userAnswers[i] === currentQuizData.questions[i].correct) {
            score++;
        }
    }
    
    const percentage = Math.round((score / currentQuizData.questions.length) * 100);
    
    // Hide quiz and show results
    $('#practice-area').hide();
    $('#quiz-results').removeClass('hidden').show();
    
    // Display score
    $('#score-percentage').text(percentage + '%');
    
    let scoreText = '';
    if (percentage >= 90) {
        scoreText = 'מצוין! בהצלחה בבחינה!';
    } else if (percentage >= 80) {
        scoreText = 'טוב מאוד! עוד קצת תרגול ואתה מוכן';
    } else if (percentage >= 70) {
        scoreText = 'בסדר, כדאי לחזור על החומר';
    } else {
        scoreText = 'צריך לחזור על החומר ולתרגל עוד';
    }
    $('#score-text').text(scoreText);
    
    // Show detailed results
    showAnswersReview();
}

function showAnswersReview() {
    let reviewHtml = '';
    
    for (let i = 0; i < currentQuizData.questions.length; i++) {
        const question = currentQuizData.questions[i];
        const userAnswer = userAnswers[i];
        const isCorrect = userAnswer === question.correct;
        
        reviewHtml += `
            <div class="answer-review-item ${isCorrect ? 'correct' : 'incorrect'}">
                <h5>שאלה ${i + 1}</h5>
                <p>${question.question}</p>
                <p><strong>התשובה שלך:</strong> ${question.options[userAnswer] || 'לא נענה'}</p>
                <p><strong>התשובה הנכונה:</strong> ${question.options[question.correct]}</p>
                <p><strong>הסבר:</strong> ${question.explanation}</p>
            </div>
        `;
    }
    
    $('#answers-review').html(reviewHtml);
}

function retryQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    
    $('#quiz-results').hide();
    $('#practice-area').show();
    
    showQuestion();
}

function backToPractice() {
    $('#quiz-results').hide();
    $('#practice-area').hide();
    $('.practice-categories').show();
}

// Test Functions
function startTest(testNumber) {
    const testData = getTestData(testNumber);
    currentQuiz = `test${testNumber}`;
    currentQuizData = testData;
    currentQuestionIndex = 0;
    userAnswers = [];
    testTimeLeft = testData.timeLimit * 60; // Convert to seconds
    
    $('.test-grid').hide();
    $('#test-area').removeClass('hidden').show();
    
    setupTest();
    showTestQuestion();
    startTestTimer();
}

function getTestData(testNumber) {
    const tests = {
        1: {
            title: "בחינת אימון 1 - כללי",
            timeLimit: 45, // minutes
            questions: [
                {
                    question: "מה יודפס בקוד הבא?",
                    code: "x = 5\ny = 10\nprint(x + y * 2)",
                    options: ["30", "25", "20", "15"],
                    correct: 1,
                    topic: "יסודות",
                    explanation: "סדר פעולות: כפל לפני חיבור. 5 + (10 * 2) = 5 + 20 = 25"
                },
                {
                    question: "איזה מהבאים יסב מחרוזת למספר עשרוני?",
                    code: "",
                    options: ["int()", "float()", "str()", "decimal()"],
                    correct: 1,
                    topic: "טיפוסי נתונים",
                    explanation: "float() מסב למספר עשרוני"
                },
                {
                    question: "מה התוצאה של הקוד?",
                    code: "name = 'אליס'\nage = 25\nprint(f'שלום {name}, גיל {age}')",
                    options: ["שלום אליס, גיל 25", "שלום name, גיל age", "שגיאה", "f'שלום אליס, גיל 25'"],
                    correct: 0,
                    topic: "מחרוזות",
                    explanation: "f-string מחליף משתנים בערכים בזמן ריצה"
                }
                // Add more questions...
            ]
        },
        2: {
            title: "בחינת אימון 2 - מחרוזות ופונקציות",
            timeLimit: 40,
            questions: [
                {
                    question: "מה יחזיר הקוד הבא?",
                    code: "text = 'Hello World'\nprint(text.lower().count('l'))",
                    options: ["2", "3", "4", "1"],
                    correct: 1,
                    topic: "מחרוזות",
                    explanation: "אחרי lower(): 'hello world', יש 3 אותיות 'l'"
                },
                {
                    question: "איך מגדירים פונקציה עם פרמטר ברירת מחדל?",
                    code: "",
                    options: ["def func(x=5):", "def func(x:5):", "def func(x default 5):", "def func(x || 5):"],
                    correct: 0,
                    topic: "פונקציות",
                    explanation: "פרמטר ברירת מחדל מוגדר עם ="
                }
                // Add more questions...
            ]
        },
        3: {
            title: "בחינת אימון 3 - רמה מתקדמת",
            timeLimit: 50,
            questions: [
                {
                    question: "מה יודפס בקוד המורכב הבא?",
                    code: "def modify_list(lst):\n    lst.append(4)\n    return lst\n\noriginal = [1, 2, 3]\nresult = modify_list(original)\nprint(len(original))",
                    options: ["3", "4", "שגיאה", "None"],
                    correct: 1,
                    topic: "פונקציות מתקדמות",
                    explanation: "רשימות מועברות בהתייחסות, לכן השינוי משפיע על המקור"
                }
                // Add more questions...
            ]
        }
    };
    
    return tests[testNumber];
}

function setupTest() {
    $('#test-title').text(currentQuizData.title);
    updateTestTimer();
    generateQuestionOverview();
    $('#test-question-counter').text(`שאלה 1 מתוך ${currentQuizData.questions.length}`);
}

function showTestQuestion() {
    const question = currentQuizData.questions[currentQuestionIndex];
    
    $('#test-question-text').text(question.question);
    $('#test-question-code').text(question.code);
    if (!question.code) {
        $('#test-question-code').hide();
    } else {
        $('#test-question-code').show();
    }
    
    // Create answer options
    const optionsHtml = question.options.map((option, index) => 
        `<div class="answer-option" data-index="${index}">${option}</div>`
    ).join('');
    
    $('#test-answer-options').html(optionsHtml);
    
    // Add click handlers
    $('.answer-option').click(function() {
        $('.answer-option').removeClass('selected');
        $(this).addClass('selected');
        userAnswers[currentQuestionIndex] = parseInt($(this).data('index'));
        updateQuestionOverview();
    });
    
    // Restore previous answer if exists
    if (userAnswers[currentQuestionIndex] !== undefined) {
        $(`.answer-option[data-index="${userAnswers[currentQuestionIndex]}"]`).addClass('selected');
    }
    
    // Update buttons and counter
    $('#test-prev-btn').prop('disabled', currentQuestionIndex === 0);
    $('#test-next-btn').prop('disabled', currentQuestionIndex === currentQuizData.questions.length - 1);
    
    if (currentQuestionIndex === currentQuizData.questions.length - 1) {
        $('#test-next-btn').addClass('hidden');
        $('#test-submit-btn').removeClass('hidden');
    } else {
        $('#test-next-btn').removeClass('hidden');
        $('#test-submit-btn').addClass('hidden');
    }
    
    $('#test-question-counter').text(`שאלה ${currentQuestionIndex + 1} מתוך ${currentQuizData.questions.length}`);
    updateQuestionOverview();
}

function generateQuestionOverview() {
    let overviewHtml = '';
    for (let i = 0; i < currentQuizData.questions.length; i++) {
        overviewHtml += `<div class="question-button" data-question="${i}" onclick="jumpToQuestion(${i})">${i + 1}</div>`;
    }
    $('#question-overview').html(overviewHtml);
}

function updateQuestionOverview() {
    $('.question-button').removeClass('current answered');
    $(`.question-button[data-question="${currentQuestionIndex}"]`).addClass('current');
    
    for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] !== undefined) {
            $(`.question-button[data-question="${i}"]`).addClass('answered');
        }
    }
}

function jumpToQuestion(questionIndex) {
    currentQuestionIndex = questionIndex;
    showTestQuestion();
}

function previousTestQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showTestQuestion();
    }
}

function nextTestQuestion() {
    if (currentQuestionIndex < currentQuizData.questions.length - 1) {
        currentQuestionIndex++;
        showTestQuestion();
    }
}

function startTestTimer() {
    testTimer = setInterval(() => {
        testTimeLeft--;
        updateTestTimer();
        
        if (testTimeLeft <= 0) {
            clearInterval(testTimer);
            alert('זמן הבחינה נגמר!');
            submitTest();
        }
    }, 1000);
}

function updateTestTimer() {
    const minutes = Math.floor(testTimeLeft / 60);
    const seconds = testTimeLeft % 60;
    $('#timer-display').text(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    
    // Change color when time is running out
    if (testTimeLeft < 300) { // Less than 5 minutes
        $('#timer-display').css('color', '#e53e3e');
    }
}

function submitTest() {
    if (testTimer) {
        clearInterval(testTimer);
    }
    
    // Calculate score and topic breakdown
    let score = 0;
    const topicScores = {};
    
    for (let i = 0; i < currentQuizData.questions.length; i++) {
        const question = currentQuizData.questions[i];
        const topic = question.topic;
        
        if (!topicScores[topic]) {
            topicScores[topic] = { correct: 0, total: 0 };
        }
        topicScores[topic].total++;
        
        if (userAnswers[i] === question.correct) {
            score++;
            topicScores[topic].correct++;
        }
    }
    
    const percentage = Math.round((score / currentQuizData.questions.length) * 100);
    
    // Hide test and show results
    $('#test-area').hide();
    $('#test-results').removeClass('hidden').show();
    
    // Display final score
    $('#final-score-percentage').text(percentage + '%');
    
    // Calculate grade
    let grade = '';
    if (percentage >= 95) grade = 'A+';
    else if (percentage >= 90) grade = 'A';
    else if (percentage >= 85) grade = 'B+';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 75) grade = 'C+';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';
    
    $('#final-grade').text(grade);
    
    // Set grade color
    const gradeElement = $('#final-grade');
    if (percentage >= 80) {
        gradeElement.css('background', '#48bb78').css('color', 'white');
    } else if (percentage >= 70) {
        gradeElement.css('background', '#ed8936').css('color', 'white');
    } else {
        gradeElement.css('background', '#e53e3e').css('color', 'white');
    }
    
    let scoreText = '';
    if (percentage >= 90) {
        scoreText = 'מצוין! אתה מוכן לבחינה!';
    } else if (percentage >= 80) {
        scoreText = 'טוב מאוד! עוד קצת תרגול ואתה מושלם';
    } else if (percentage >= 70) {
        scoreText = 'ביצועים סבירים, כדאי לחזור על החומר';
    } else {
        scoreText = 'יש לחזור על החומר ולתרגל הרבה יותר';
    }
    $('#final-score-text').text(scoreText);
    
    // Show topic breakdown
    showTopicBreakdown(topicScores);
    
    // Show detailed test review
    showTestAnswersReview();
}

function showTopicBreakdown(topicScores) {
    let breakdownHtml = '';
    
    for (const topic in topicScores) {
        const score = topicScores[topic];
        const percentage = Math.round((score.correct / score.total) * 100);
        
        breakdownHtml += `
            <div class="topic-item">
                <span>${topic}</span>
                <span>${score.correct}/${score.total} (${percentage}%)</span>
            </div>
        `;
    }
    
    $('#topic-breakdown').html(breakdownHtml);
}

function showTestAnswersReview() {
    let reviewHtml = '';
    
    for (let i = 0; i < currentQuizData.questions.length; i++) {
        const question = currentQuizData.questions[i];
        const userAnswer = userAnswers[i];
        const isCorrect = userAnswer === question.correct;
        
        reviewHtml += `
            <div class="answer-review-item ${isCorrect ? 'correct' : 'incorrect'}">
                <h5>שאלה ${i + 1} - ${question.topic}</h5>
                <p>${question.question}</p>
                ${question.code ? `<div class="code-block">${question.code}</div>` : ''}
                <p><strong>התשובה שלך:</strong> ${question.options[userAnswer] || 'לא נענה'}</p>
                <p><strong>התשובה הנכונה:</strong> ${question.options[question.correct]}</p>
                <p><strong>הסבר:</strong> ${question.explanation}</p>
            </div>
        `;
    }
    
    $('#test-answers-review').html(reviewHtml);
}

function retryTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    testTimeLeft = currentQuizData.timeLimit * 60;
    
    $('#test-results').hide();
    $('#test-area').show();
    
    showTestQuestion();
    startTestTimer();
}

function backToTests() {
    $('#test-results').hide();
    $('#test-area').hide();
    $('.test-grid').show();
}

// Animation and UI Functions
function initializeAnimations() {
    // Add smooth scrolling
    $('a[href^="#"]').on('click', function(event) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });
    
    // Add hover effects
    $('.lesson-card, .category-card, .test-card').hover(
        function() { $(this).addClass('hovered'); },
        function() { $(this).removeClass('hovered'); }
    );
}

// Add CSS for lesson modal
$('<style>').prop('type', 'text/css').html(`
.lesson-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 0;
    border-radius: 15px;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1.5rem 2rem;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-modal {
    font-size: 2em;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.close-modal:hover {
    transform: scale(1.2);
}

.modal-body {
    padding: 2rem;
}

.lesson-content h4 {
    color: #4a5568;
    margin: 1.5rem 0 1rem 0;
    font-size: 1.3em;
}

.lesson-content h5 {
    color: #667eea;
    margin: 1rem 0 0.5rem 0;
}

.code-example {
    background: #2d3748;
    color: #68d391;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    overflow-x: auto;
}

.lesson-content ul, .lesson-content ol {
    margin: 1rem 0;
    padding-right: 1.5rem;
}

.lesson-content li {
    margin: 0.5rem 0;
    line-height: 1.6;
}

.modal-footer {
    background: #f7fafc;
    padding: 1rem 2rem;
    border-radius: 0 0 15px 15px;
    text-align: center;
}

.modal-footer button {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1.1em;
    transition: all 0.3s ease;
}

.modal-footer button:hover {
    background: #5a67d8;
    transform: translateY(-2px);
}

.answer-review-item {
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    padding: 1rem;
    margin: 1rem 0;
}

.answer-review-item.correct {
    border-color: #48bb78;
    background: #f0fff4;
}

.answer-review-item.incorrect {
    border-color: #e53e3e;
    background: #fff5f5;
}

.answer-review-item h5 {
    margin: 0 0 0.5rem 0;
    color: #4a5568;
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 10% auto;
    }
    
    .modal-header {
        padding: 1rem;
    }
    
    .modal-body {
        padding: 1rem;
    }
}
`).appendTo('head');