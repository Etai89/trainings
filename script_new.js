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
    
    // Initialize section-specific functionality
    switch(sectionName) {
        case 'home':
            initializeHome();
            break;
        case 'basics':
            initializeConcepts();
            break;
        case 'types':
            initializeConcepts();
            break;
        case 'operators':
            initializeConcepts();
            break;
        case 'strings':
            initializeStrings();
            break;
        case 'statements':
            initializeConcepts();
            break;
        case 'practice':
            initializePractice();
            break;
        case 'test':
            initializeTest();
            break;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function startLearning() {
    showSection('basics');
}

// Initialize Functions
function initializeHome() {
    console.log('Initializing home section');
}

function initializeConcepts() {
    console.log('Initializing concepts section');
    // Add interactive features for concept cards
    $('.concept-card').hover(
        function() {
            $(this).find('.code-example').slideDown(200);
        },
        function() {
            // Keep code example visible
        }
    );
}

function initializeAnimations() {
    // Add scroll animations
    $(window).scroll(function() {
        $('.concept-card, .lesson-card').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-in');
            }
        });
    });
}

// String Functions Practice
function runStringCode() {
    const code = $('#string-code').val();
    try {
        // Simple string function simulator
        let output = '';
        
        // Replace Python functions with JavaScript equivalents for demo
        let jsCode = code
            .replace(/len\(/g, '(')
            .replace(/\.upper\(\)/g, '.toUpperCase()')
            .replace(/\.lower\(\)/g, '.toLowerCase()')
            .replace(/\.strip\(\)/g, '.trim()')
            .replace(/print\(/g, 'output += ');
        
        // Simple evaluation (in real app, use a proper Python interpreter)
        eval(jsCode);
        
        $('#string-output').html(`<pre>${output}</pre>`);
    } catch (error) {
        $('#string-output').html(`<div class="error">שגיאה: ${error.message}</div>`);
    }
}

function clearStringOutput() {
    $('#string-code').val('');
    $('#string-output').empty();
}

function initializeStrings() {
    console.log('Initializing strings section');
}

// Practice Functions
function initializePractice() {
    console.log('Initializing practice section');
}

function startPracticeQuiz(topic) {
    const quizzes = {
        'variables': {
            title: 'תרגול משתנים',
            questions: [
                {
                    question: 'איך יוצרים משתנה בשם age עם הערך 25?',
                    options: ['age = 25', '25 = age', 'var age = 25', 'int age = 25'],
                    correct: 0,
                    explanation: 'בפייתון יוצרים משתנה על ידי השמת ערך: age = 25'
                },
                {
                    question: 'מה יהיה הפלט של: print(type(3.14))?',
                    options: ['int', 'float', 'str', 'number'],
                    correct: 1,
                    explanation: '3.14 הוא מספר עשרוני, ולכן הטיפוס שלו הוא float'
                }
            ]
        },
        'strings': {
            title: 'תרגול מחרוזות',
            questions: [
                {
                    question: 'מה יהיה הפלט של: "Python"[0]?',
                    options: ['P', 'python', '0', 'שגיאה'],
                    correct: 0,
                    explanation: 'האיבר הראשון במחרוזת "Python" הוא התו "P"'
                },
                {
                    question: 'איך מחברים שתי מחרוזות?',
                    options: ['str1 & str2', 'str1 + str2', 'str1 * str2', 'concat(str1, str2)'],
                    correct: 1,
                    explanation: 'בפייתון מחברים מחרוזות עם האופרטור +'
                }
            ]
        }
    };
    
    currentQuizData = quizzes[topic]?.questions || [];
    if (currentQuizData.length === 0) return;
    
    currentQuestionIndex = 0;
    userAnswers = [];
    currentQuiz = topic;
    
    showQuizQuestion();
}

function showQuizQuestion() {
    if (currentQuestionIndex >= currentQuizData.length) {
        showQuizResults();
        return;
    }
    
    const question = currentQuizData[currentQuestionIndex];
    
    const quizHtml = `
        <div class="quiz-container">
            <div class="quiz-header">
                <h3>שאלה ${currentQuestionIndex + 1} מתוך ${currentQuizData.length}</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${((currentQuestionIndex + 1) / currentQuizData.length) * 100}%"></div>
                </div>
            </div>
            <div class="question">
                <h4>${question.question}</h4>
                <div class="options">
                    ${question.options.map((option, index) => 
                        `<button class="option-btn" onclick="selectAnswer(${index})">${option}</button>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Create or update quiz modal
    if ($('#quizModal').length === 0) {
        $('body').append(`
            <div id="quizModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="closeQuiz()">&times;</span>
                    <div id="quiz-content"></div>
                </div>
            </div>
        `);
    }
    
    $('#quiz-content').html(quizHtml);
    $('#quizModal').fadeIn();
}

function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    
    // Show correct/incorrect feedback
    const question = currentQuizData[currentQuestionIndex];
    const isCorrect = answerIndex === question.correct;
    
    $('.option-btn').removeClass('selected correct incorrect');
    $(`.option-btn:eq(${answerIndex})`).addClass('selected');
    $(`.option-btn:eq(${question.correct})`).addClass('correct');
    
    if (!isCorrect) {
        $(`.option-btn:eq(${answerIndex})`).addClass('incorrect');
    }
    
    // Show explanation
    const explanationHtml = `
        <div class="explanation ${isCorrect ? 'correct' : 'incorrect'}">
            <p><strong>${isCorrect ? 'נכון!' : 'לא נכון.'}</strong></p>
            <p>${question.explanation}</p>
            <button class="btn-primary" onclick="nextQuestion()" style="margin-top: 1rem;">
                ${currentQuestionIndex < currentQuizData.length - 1 ? 'שאלה הבאה' : 'סיום בחינה'}
            </button>
        </div>
    `;
    
    $('.question').append(explanationHtml);
    $('.option-btn').prop('disabled', true);
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuizQuestion();
}

function showQuizResults() {
    const correctAnswers = userAnswers.filter((answer, index) => 
        answer === currentQuizData[index].correct
    ).length;
    
    const percentage = Math.round((correctAnswers / currentQuizData.length) * 100);
    let message = '';
    let color = '';
    
    if (percentage >= 80) {
        message = 'מעולה! אתה מבין את החומר היטב!';
        color = 'success';
    } else if (percentage >= 60) {
        message = 'טוב! עדיין יש מקום לשיפור.';
        color = 'warning';
    } else {
        message = 'כדאי לחזור על החומר ולנסות שוב.';
        color = 'error';
    }
    
    const resultsHtml = `
        <div class="quiz-results ${color}">
            <h3>תוצאות הבחינה</h3>
            <div class="score">
                <span class="score-number">${correctAnswers}/${currentQuizData.length}</span>
                <span class="score-percentage">${percentage}%</span>
            </div>
            <p>${message}</p>
            <div class="results-actions">
                <button class="btn-secondary" onclick="closeQuiz()">סגור</button>
                <button class="btn-primary" onclick="retryQuiz()">נסה שוב</button>
            </div>
        </div>
    `;
    
    $('#quiz-content').html(resultsHtml);
}

function retryQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuizQuestion();
}

function closeQuiz() {
    $('#quizModal').fadeOut();
    currentQuiz = null;
    currentQuizData = [];
}

// Test Functions
function initializeTest() {
    console.log('Initializing test section');
}

function startFullTest() {
    const testQuestions = [
        {
            question: 'מה יהיה הפלט של הקוד הבא?\n\nx = 5\ny = 2\nprint(x // y)',
            options: ['2.5', '2', '3', '10'],
            correct: 1,
            explanation: 'האופרטור // מבצע חילוק שלם, אז 5 // 2 = 2'
        },
        {
            question: 'איזה מהפקודות הבאות תיצור רשימה ריקה?',
            options: ['list = []', 'list = ()', 'list = {}', 'list = ""'],
            correct: 0,
            explanation: '[] יוצר רשימה ריקה בפייתון'
        },
        {
            question: 'מה יקרה אם נפעיל: "hello".upper()?',
            options: ['hello', 'HELLO', 'Hello', 'שגיאה'],
            correct: 1,
            explanation: 'המתודה upper() הופכת את כל האותיות לאותיות גדולות'
        },
        {
            question: 'איך בודקים אם מספר הוא זוגי?',
            options: ['x % 2 == 0', 'x / 2 == 0', 'x * 2 == 0', 'x + 2 == 0'],
            correct: 0,
            explanation: 'מספר זוגי אם השארית מחילוק ב-2 היא 0'
        },
        {
            question: 'מה יהיה הפלט של: len("Python")?',
            options: ['5', '6', '7', 'שגיאה'],
            correct: 1,
            explanation: 'המחרוזת "Python" מכילה 6 תווים'
        }
    ];
    
    currentQuizData = testQuestions;
    currentQuestionIndex = 0;
    userAnswers = [];
    testTimeLeft = 15 * 60; // 15 minutes
    
    startTestTimer();
    showQuizQuestion();
}

function startTestTimer() {
    if (testTimer) clearInterval(testTimer);
    
    testTimer = setInterval(() => {
        testTimeLeft--;
        updateTimerDisplay();
        
        if (testTimeLeft <= 0) {
            clearInterval(testTimer);
            showQuizResults();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(testTimeLeft / 60);
    const seconds = testTimeLeft % 60;
    const timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if ($('.timer').length === 0) {
        $('.quiz-header').append(`<div class="timer">זמן נותר: <span id="timer-display">${timerText}</span></div>`);
    } else {
        $('#timer-display').text(timerText);
    }
    
    // Change color when time is running out
    if (testTimeLeft <= 60) {
        $('.timer').addClass('warning');
    }
}

// Utility Functions
function showModal(title, content) {
    const modal = $(`
        <div class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${title}</h2>
                <div>${content}</div>
            </div>
        </div>
    `);
    
    $('body').append(modal);
    modal.fadeIn();
    
    modal.find('.close').click(function() {
        modal.fadeOut(function() {
            modal.remove();
        });
    });
}

// Error handling
window.onerror = function(msg, url, line) {
    console.error('JavaScript Error:', msg, 'at line:', line);
    return false;
};
