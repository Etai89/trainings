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
    // Initialize burger menu
    initializeBurgerMenu();
    
    // Initialize navigation
    $('.main-nav a').click(function(e) {
        e.preventDefault();
        const section = $(this).data('section');
        showSection(section);
        
        // Close mobile menu after clicking
        closeMobileMenu();
    });
    
    // Show home section by default
    showSection('home');
    
    // Initialize tooltips and animations
    initializeAnimations();
    
    // Practice navigation
    $(document).on('click', '.category-card', function(e) {
        e.preventDefault();
        const onclickAttr = $(this).attr('onclick');
        if (onclickAttr) {
            const topic = onclickAttr.match(/'([^']+)'/)[1];
            startPractice(topic);
        }
    });
    
    // Test navigation  
    $(document).on('click', '.test-btn', function(e) {
        console.log('Test button clicked');
        const onclickAttr = $(this).attr('onclick');
        console.log('onclick attribute:', onclickAttr);
        if (onclickAttr) {
            // Don't prevent default since we want onclick to work
            // e.preventDefault();
            const match = onclickAttr.match(/'([^']+)'/);
            if (match) {
                const testId = match[1];
                console.log('Extracted testId:', testId);
                startTest(testId);
            } else {
                console.error('Could not extract testId from onclick:', onclickAttr);
            }
        } else {
            console.error('No onclick attribute found');
        }
    });
    
    // Also handle direct onclick calls
    window.startTest = startTest;
    window.startPractice = startPractice;
    window.selectAnswer = selectAnswer;
    window.nextQuestion = nextQuestion;
    window.closeQuiz = closeQuiz;
    window.retryQuiz = retryQuiz;
    
    // Back to home button
    $(document).on('click', '.back-btn', function() {
        showSection('home');
    });
    
    // Quiz answer handling
    $(document).on('click', '.answer-option', function() {
        $('.answer-option').removeClass('selected');
        $(this).addClass('selected');
    });
    
    // Next button handling
    $(document).on('click', '#next-btn', function() {
        if ($('.answer-option.selected').length === 0) {
            alert('אנא בחר תשובה');
            return;
        }
        
        const selectedAnswer = $('.answer-option.selected').data('answer');
        userAnswers[currentQuestionIndex] = selectedAnswer;
        
        currentQuestionIndex++;
        showQuizQuestion();
    });
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

function initializeStrings() {
    console.log('Initializing strings section');
    // Add interactive examples
    $('.example-section').each(function() {
        $(this).click(function() {
            $(this).toggleClass('expanded');
        });
    });
}


// Practice Functions
function initializePractice() {
    console.log('Initializing practice section');
}

function startPractice(topic) {
    const practiceData = {
        'basics': {
            title: 'יסודות פייתון',
            getQuestions: () => getRandomQuestions(questionBanks.basics, 15)
        },
        'control': {
            title: 'תנאים ולולאות',
            getQuestions: () => getRandomQuestions(questionBanks.control, 15)
        },
        'strings': {
            title: 'מחרוזות',
            getQuestions: () => getRandomQuestions(questionBanks.strings, 15)
        },
        'operators': {
            title: 'אופרטורים',
            getQuestions: () => getRandomQuestions(questionBanks.operators, 15)
        }
    };
    
    const practiceInfo = practiceData[topic];
    startPracticeQuiz(topic, practiceInfo);
}

function startPracticeQuiz(topic, practiceInfo) {
    if (!practiceInfo) {
        alert('נושא תרגול לא נמצא');
        return;
    }
    
    // Get random questions for this practice
    currentQuizData = practiceInfo.getQuestions();
    if (currentQuizData.length === 0) {
        alert('אין שאלות זמינות לנושא זה');
        return;
    }
    
    currentQuestionIndex = 0;
    userAnswers = [];
    currentQuiz = topic;
    
    // Hide practice section and show quiz
    $('.content-section').removeClass('active');
    if ($('#quiz-container').length === 0) {
        createQuizContainer();
    }
    $('#quiz-container').addClass('active');
    $('#quiz-title').text(practiceInfo.title);
    
    showQuizQuestion();
}

function createQuizContainer() {
    const quizHTML = `
        <div id="quiz-container" class="content-section">
            <div class="quiz-header">
                <h2 id="quiz-title"></h2>
                <button class="back-btn">חזרה לתרגול</button>
            </div>
            <div class="quiz-content">
                <div class="question-container">
                    <div class="question-progress">
                        <span id="question-counter"></span>
                        <div class="progress-bar">
                            <div class="progress" id="progress-fill"></div>
                        </div>
                    </div>
                    <div class="question-text" id="question-text"></div>
                    <div class="options-container" id="options-container"></div>
                    <div class="quiz-controls">
                        <button id="next-btn" class="btn-primary">שאלה הבאה</button>
                    </div>
                </div>
            </div>
            <div id="quiz-results" class="quiz-results hidden">
                <h3>תוצאות התרגול</h3>
                <div class="results-summary">
                    <div class="score-circle">
                        <span class="score-number"></span>
                    </div>
                    <div class="score-details">
                        <div class="correct-answers"></div>
                        <div class="score-percentage"></div>
                    </div>
                </div>
                <div class="results-actions">
                    <button onclick="showSection('practice')" class="btn-secondary">תרגול נוסף</button>
                    <button onclick="showSection('home')" class="btn-primary">דף הבית</button>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(quizHTML);
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
        
        // Add click outside to close modal
        $('#quizModal').click(function(e) {
            if (e.target === this) {
                closeQuiz();
            }
        });
        
        // Prevent modal content clicks from closing modal
        $('#quizModal .modal-content').click(function(e) {
            e.stopPropagation();
        });
    }
    
    $('#quiz-content').html(quizHtml);
    $('#quizModal').addClass('show').fadeIn();
    $('body').addClass('modal-open');
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
    $('#quizModal').removeClass('show').fadeOut();
    $('body').removeClass('modal-open');
    currentQuiz = null;
    currentQuizData = [];
    $('a[href="#practice"]').click();
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
    modal.addClass('show').fadeIn();
    $('body').addClass('modal-open');
    
    // Click outside to close
    modal.click(function(e) {
        if (e.target === this) {
            modal.removeClass('show').fadeOut(function() {
                modal.remove();
                $('body').removeClass('modal-open');
            });
        }
    });
    
    // Prevent modal content clicks from closing modal
    modal.find('.modal-content').click(function(e) {
        e.stopPropagation();
    });
    
    modal.find('.close').click(function() {
        modal.removeClass('show').fadeOut(function() {
            modal.remove();
            $('body').removeClass('modal-open');
        });
    });
}

// Error handling
window.onerror = function(msg, url, line) {
    console.error('JavaScript Error:', msg, 'at line:', line);
    return false;
};

// Question Banks - Large collection of questions for each topic
const questionBanks = {
    'basics': [
        {
            question: 'איך יוצרים משתנה בשם age עם הערך 20?',
            options: ['age = 20', '20 = age', 'var age = 20', 'int age = 20'],
            correct: 0,
            explanation: 'בפייתון יוצרים משתנה על ידי השמת ערך: age = 20'
        },
        {
            question: 'מה יהיה הפלט של: print(type(5))?',
            options: ['<class \'int\'>', '<class \'number\'>', '<class \'float\'>', '<class \'str\'>'],
            correct: 0,
            explanation: '5 הוא מספר שלם, ולכן הטיפוס שלו הוא int'
        },
        {
            question: 'איך מקבלים קלט מהמשתמש?',
            options: ['get()', 'input()', 'read()', 'scan()'],
            correct: 1,
            explanation: 'הפונקציה input() מקבלת קלט מהמשתמש'
        },
        {
            question: 'מה יהיה הפלט של: print(10 // 3)?',
            options: ['3.33', '3', '4', '10'],
            correct: 1,
            explanation: 'האופרטור // מבצע חילוק שלם, אז 10 // 3 = 3'
        },
        {
            question: 'איך מדפיסים הודעה למסך?',
            options: ['show()', 'display()', 'print()', 'output()'],
            correct: 2,
            explanation: 'הפונקציה print() מדפיסה הודעות למסך'
        },
        {
            question: 'מה יהיה הפלט של: print(type("שלום"))?',
            options: ['<class \'str\'>', '<class \'string\'>', '<class \'text\'>', '<class \'char\'>'],
            correct: 0,
            explanation: 'מחרוזות בפייתון הן מטיפוס str'
        },
        {
            question: 'איך יוצרים מספר עשרוני?',
            options: ['x = 3.14', 'x = float(3.14)', 'x = decimal(3.14)', 'x = number(3.14)'],
            correct: 0,
            explanation: 'מספר עשרוני נוצר פשוט עם נקודה: x = 3.14'
        },
        {
            question: 'מה יהיה הפלט של: print(5 + 3)?',
            options: ['8', '53', '5+3', 'שגיאה'],
            correct: 0,
            explanation: '5 + 3 = 8 (חיבור מתמטי)'
        },
        {
            question: 'איך יוצרים הערה בפייתון?',
            options: ['// הערה', '/* הערה */', '# הערה', '<!-- הערה -->'],
            correct: 2,
            explanation: 'הערות בפייתון מתחילות עם #'
        },
        {
            question: 'מה יהיה הפלט של: print(2 ** 4)?',
            options: ['8', '16', '24', '6'],
            correct: 1,
            explanation: '2 ** 4 = 2⁴ = 16 (2 בחזקת 4)'
        },
        {
            question: 'איך בודקים את טיפוס משתנה?',
            options: ['typeof(x)', 'type(x)', 'getType(x)', 'x.type()'],
            correct: 1,
            explanation: 'type(x) מחזיר את טיפוס המשתנה x'
        },
        {
            question: 'מה יהיה הפלט של: print(7 % 2)?',
            options: ['3', '1', '3.5', '0'],
            correct: 1,
            explanation: '7 % 2 = 1 (השארית מחילוק 7 ב-2)'
        },
        {
            question: 'איך הופכים מחרוזת למספר?',
            options: ['int("123")', 'number("123")', 'parse("123")', 'convert("123")'],
            correct: 0,
            explanation: 'int() הופך מחרוזת למספר שלם'
        },
        {
            question: 'מה יהיה הפלט של: print(10 / 3)?',
            options: ['3', '3.33333...', '10/3', 'שגיאה'],
            correct: 1,
            explanation: 'האופרטור / מבצע חילוק עשרוני'
        },
        {
            question: 'איך הופכים מספר למחרוזת?',
            options: ['str(123)', 'string(123)', 'text(123)', 'toString(123)'],
            correct: 0,
            explanation: 'str() הופך מספר למחרוזת'
        },
        {
            question: 'מה יהיה הפלט של: print(True and False)?',
            options: ['True', 'False', '1', '0'],
            correct: 1,
            explanation: 'and מחזיר True רק אם שני הצדדים True'
        },
        {
            question: 'איך יוצרים משתנה בוליאני?',
            options: ['x = True', 'x = true', 'x = boolean(1)', 'x = bool(1)'],
            correct: 0,
            explanation: 'ערכים בוליאניים הם True או False (עם אות גדולה)'
        },
        {
            question: 'מה יהיה הפלט של: print(not True)?',
            options: ['True', 'False', 'None', 'שגיאה'],
            correct: 1,
            explanation: 'not הופך True ל-False'
        },
        {
            question: 'איך בודקים שוויון בין שני ערכים?',
            options: ['x = y', 'x == y', 'x eq y', 'x equals y'],
            correct: 1,
            explanation: '== בודק שוויון, = משמש להשמה'
        },
        {
            question: 'מה יהיה הפלט של: print(5 != 3)?',
            options: ['True', 'False', '2', 'שגיאה'],
            correct: 0,
            explanation: '!= בודק אי-שוויון, 5 לא שווה ל-3'
        },
        {
            question: 'איך יוצרים קבוע (מוסכמה)?',
            options: ['PI = 3.14', 'const PI = 3.14', 'final PI = 3.14', '#define PI 3.14'],
            correct: 0,
            explanation: 'בפייתון אין קבועים אמיתיים, המוסכמה היא אותיות גדולות'
        },
        {
            question: 'מה יהיה הפלט של: print(10 > 5 > 3)?',
            options: ['True', 'False', 'שגיאה', 'None'],
            correct: 0,
            explanation: 'פייתון מאפשר השוואות משולשות: 10 > 5 > 3 הוא True'
        },
        {
            question: 'איך מחשבים חזקה?',
            options: ['pow(2, 3)', '2 ** 3', 'power(2, 3)', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'גם ** וגם pow() מחשבים חזקה'
        },
        {
            question: 'מה יהיה הפלט של: print(15 // 4)?',
            options: ['3', '3.75', '4', '15'],
            correct: 0,
            explanation: '// מבצע חילוק שלם: 15 // 4 = 3'
        },
        {
            question: 'איך בודקים אם מספר חיובי?',
            options: ['x > 0', 'x.positive()', 'isPositive(x)', 'x >= 1'],
            correct: 0,
            explanation: 'x > 0 בודק אם המספר גדול מאפס'
        },
        {
            question: 'מה יהיה הפלט של: print(bool(0))?',
            options: ['True', 'False', '0', 'None'],
            correct: 1,
            explanation: 'bool(0) מחזיר False כי 0 נחשב לערך שקרי'
        },
        {
            question: 'איך יוצרים משתנה עם ערך None?',
            options: ['x = None', 'x = null', 'x = empty', 'x = void'],
            correct: 0,
            explanation: 'None הוא הערך הריק בפייתון'
        },
        {
            question: 'מה יהיה הפלט של: print(3.14 * 2)?',
            options: ['6.28', '3.142', '6', 'שגיאה'],
            correct: 0,
            explanation: '3.14 * 2 = 6.28 (כפל של מספר עשרוני)'
        },
        {
            question: 'איך בודקים את הערך המקסימלי?',
            options: ['max(5, 3)', 'maximum(5, 3)', 'bigger(5, 3)', 'largest(5, 3)'],
            correct: 0,
            explanation: 'max() מחזיר את הערך הגדול ביותר'
        },
        {
            question: 'מה יהיה הפלט של: print(round(3.7))?',
            options: ['3', '4', '3.7', '3.0'],
            correct: 1,
            explanation: 'round() מעגל למספר השלם הקרוב ביותר'
        },
        {
            question: 'איך יוצרים רשימה?',
            options: ['[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '<1, 2, 3>'],
            correct: 0,
            explanation: 'סוגריים מרובעים [] יוצרים רשימה'
        },
        {
            question: 'מה יהיה הפלט של: print(abs(-5))?',
            options: ['-5', '5', '0', 'שגיאה'],
            correct: 1,
            explanation: 'abs() מחזיר את הערך המוחלט'
        },
        {
            question: 'איך בודקים אם משתנה קיים?',
            options: ['exists(x)', 'defined(x)', 'try: x', '"x" in locals()'],
            correct: 3,
            explanation: 'locals() מחזיר מילון של המשתנים המקומיים'
        },
        {
            question: 'מה יהיה הפלט של: print(len([]))?',
            options: ['0', '1', 'None', 'שגיאה'],
            correct: 0,
            explanation: 'רשימה ריקה [] יש לה אורך 0'
        },
        {
            question: 'איך הופכים רשימה למחרוזת?',
            options: ['str([1,2,3])', '"".join(map(str, [1,2,3]))', 'toString([1,2,3])', 'text([1,2,3])'],
            correct: 1,
            explanation: 'join() עם map() הופך רשימה למחרוזת'
        },
        {
            question: 'מה יהיה הפלט של: print(bool(""))?',
            options: ['True', 'False', '""', 'None'],
            correct: 1,
            explanation: 'מחרוזת ריקה נחשבת לערך שקרי'
        },
        {
            question: 'איך יוצרים tuple?',
            options: ['(1, 2, 3)', '[1, 2, 3]', '{1, 2, 3}', '<1, 2, 3>'],
            correct: 0,
            explanation: 'סוגריים עגולים () יוצרים tuple'
        },
        {
            question: 'מה יהיה הפלט של: print(min(5, 2, 8))?',
            options: ['5', '2', '8', 'שגיאה'],
            correct: 1,
            explanation: 'min() מחזיר את הערך הקטן ביותר'
        },
        {
            question: 'איך בודקים אם ערך הוא מספר?',
            options: ['isinstance(x, int)', 'isNumber(x)', 'type(x) == number', 'x.isNumber()'],
            correct: 0,
            explanation: 'isinstance() בודק אם ערך הוא מטיפוס מסוים'
        },
        {
            question: 'מה יהיה הפלט של: print(pow(3, 2))?',
            options: ['6', '9', '5', '32'],
            correct: 1,
            explanation: 'pow(3, 2) = 3² = 9'
        }
    ],
    'control': [
        {
            question: 'מה יקרה אם התנאי במשפט if הוא False?',
            options: ['התוכנית תיעצר', 'יתבצע הקוד בתוך if', 'יתבצע הקוד של else', 'שגיאה'],
            correct: 2,
            explanation: 'אם התנאי False, הקוד עובר לחלק else (אם קיים)'
        },
        {
            question: 'מה עושה הפקודה break בתוך לולאה?',
            options: ['עוצרת את התוכנית', 'יוצאת מהלולאה', 'עוצרת לשנייה', 'עוברת לשאלה הבאה'],
            correct: 1,
            explanation: 'break יוצאת מהלולאה הנוכחית לגמרי'
        },
        {
            question: 'איך כותבים לולאה שרצה 5 פעמים?',
            options: ['for i in 5:', 'for i in range(5):', 'for 5 times:', 'repeat 5:'],
            correct: 1,
            explanation: 'range(5) יוצר רצף מ-0 עד 4 (5 מספרים)'
        },
        {
            question: 'מתי לולאת while תיעצר?',
            options: ['אחרי 10 פעמים', 'כשהתנאי הופך False', 'אף פעם', 'כשרוצים'],
            correct: 1,
            explanation: 'לולאת while ממשיכה כל עוד התנאי הוא True'
        },
        {
            question: 'מה עושה continue בלולאה?',
            options: ['יוצאת מהלולאה', 'עוצרת את התוכנית', 'קופצת לאיטרציה הבאה', 'חוזרת לתחילת התוכנית'],
            correct: 2,
            explanation: 'continue מדלגת לאיטרציה הבאה של הלולאה'
        },
        {
            question: 'איך כותבים תנאי מורכב?',
            options: ['if x > 5 and x < 10:', 'if (x > 5) && (x < 10):', 'if x > 5 & x < 10:', 'if x between 5 and 10:'],
            correct: 0,
            explanation: 'and מחבר שני תנאים בפייתון'
        },
        {
            question: 'מה יהיה הפלט של:\nfor i in range(3):\n    print(i)',
            options: ['1 2 3', '0 1 2', '3', 'שגיאה'],
            correct: 1,
            explanation: 'range(3) מייצר 0, 1, 2'
        },
        {
            question: 'איך כותבים elif?',
            options: ['else if', 'elif', 'elseif', 'ei'],
            correct: 1,
            explanation: 'elif הוא הדרך לכתוב "else if" בפייתון'
        },
        {
            question: 'מה יקרה בקוד:\nwhile True:\n    print("שלום")',
            options: ['ידפיס שלום פעם אחת', 'ידפיס שלום 10 פעמים', 'לולאה אינסופית', 'שגיאה'],
            correct: 2,
            explanation: 'while True יוצר לולאה אינסופית'
        },
        {
            question: 'איך בודקים אם מספר בטווח מסוים?',
            options: ['5 <= x <= 10', 'x >= 5 and x <= 10', '5 <= x and x <= 10', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'כל הדרכים האלו נכונות לבדיקת טווח'
        },
        {
            question: 'מה יהיה הפלט של:\nfor i in range(1, 4):\n    print(i)',
            options: ['1 2 3', '1 2 3 4', '0 1 2 3', '2 3 4'],
            correct: 0,
            explanation: 'range(1, 4) מייצר 1, 2, 3 (לא כולל 4)'
        },
        {
            question: 'איך יוצאים מלולאת while?',
            options: ['exit', 'break', 'stop', 'end'],
            correct: 1,
            explanation: 'break יוצאת מכל סוג של לולאה'
        },
        {
            question: 'מה זה else בלולאה?',
            options: ['מתבצע אם הלולאה לא רצה', 'מתבצע אחרי הלולאה אם לא היה break', 'מתבצע במקרה של שגיאה', 'לא קיים'],
            correct: 1,
            explanation: 'else בלולאה מתבצע רק אם הלולאה הסתיימה ללא break'
        },
        {
            question: 'איך כותבים לולאה הפוכה?',
            options: ['for i in reverse(range(5)):', 'for i in range(5, 0, -1):', 'for i in range(4, -1, -1):', 'התשובה השנייה והשלישית נכונות'],
            correct: 3,
            explanation: 'גם range(5, 0, -1) וגם range(4, -1, -1) יוצרים לולאה הפוכה'
        },
        {
            question: 'מה יהיה הפלט של:\nfor i in range(0, 10, 2):\n    print(i)',
            options: ['0 2 4 6 8', '2 4 6 8 10', '0 1 2 3 4', '0 2 4 6 8 10'],
            correct: 0,
            explanation: 'range(0, 10, 2) מתחיל מ-0, עד 10 (לא כולל), בצעדים של 2'
        },
        {
            question: 'איך בודקים מספר זוגי?',
            options: ['x % 2 == 0', 'x / 2 == 0', 'x.isEven()', 'even(x)'],
            correct: 0,
            explanation: 'מספר זוגי אם השארית מחילוק ב-2 היא 0'
        },
        {
            question: 'מה זה nested loop?',
            options: ['לולאה שבורה', 'לולאה בתוך לולאה', 'לולאה מהירה', 'לולאה עם תנאי'],
            correct: 1,
            explanation: 'nested loop זה לולאה בתוך לולאה אחרת'
        },
        {
            question: 'איך עושים לולאה אינסופית מבוקרת?',
            options: ['while True: ... if condition: break', 'for ever: ...', 'loop: ...', 'infinite: ...'],
            correct: 0,
            explanation: 'while True עם break בתנאי מסוים יוצר לולאה מבוקרת'
        },
        {
            question: 'מה יקרה בקוד:\nfor i in range(5):\n    if i == 3:\n        continue\n    print(i)',
            options: ['0 1 2 3 4', '0 1 2 4', '1 2 3 4', '0 1 2'],
            correct: 1,
            explanation: 'continue מדלג על i=3, אז מדפיס 0 1 2 4'
        },
        {
            question: 'איך בודקים אם מספר אי-זוגי?',
            options: ['x % 2 == 1', 'x % 2 != 0', 'not (x % 2 == 0)', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'כל הדרכים האלו בודקות אם מספר אי-זוגי'
        },
        {
            question: 'מה ההבדל בין for ו-while?',
            options: ['אין הבדל', 'for למספר ידוע של איטרציות, while לתנאי', 'while מהיר יותר', 'for רק למספרים'],
            correct: 1,
            explanation: 'for טוב למספר ידוע של איטרציות, while לתנאי לא ידוע'
        },
        {
            question: 'איך עושים לולאה על מחרוזת?',
            options: ['for char in string:', 'for i in len(string):', 'for string[i] in string:', 'while string:'],
            correct: 0,
            explanation: 'for char in string עובר על כל תו במחרוזת'
        },
        {
            question: 'מה יהיה הפלט של:\nfor i in range(3):\n    for j in range(2):\n        print(i, j)',
            options: ['6 שורות', '5 שורות', '2 שורות', '3 שורות'],
            correct: 0,
            explanation: 'לולאה מקוננת: 3 × 2 = 6 איטרציות'
        },
        {
            question: 'איך בודקים תנאי מרובה?',
            options: ['if x == 1 or x == 2 or x == 3:', 'if x in [1, 2, 3]:', 'if x == 1 || x == 2 || x == 3:', 'התשובה הראשונה והשנייה נכונות'],
            correct: 3,
            explanation: 'גם or וגם in יכולים לבדוק תנאי מרובה'
        },
        {
            question: 'מה יהיה הפלט של:\nfor i in [1, 2, 3]:\n    if i == 2:\n        break\n    print(i)',
            options: ['1', '1 2', '1 2 3', '2 3'],
            correct: 0,
            explanation: 'break יוצאת מהלולאה כשi=2, אז מדפיס רק 1'
        },
        {
            question: 'איך עושים לולאה עם אינדקס?',
            options: ['for i, item in enumerate(list):', 'for i in range(len(list)):', 'for item in list:', 'התשובה הראשונה והשנייה נכונות'],
            correct: 3,
            explanation: 'גם enumerate וגם range(len()) נותנים אינדקס'
        },
        {
            question: 'מה יהיה הפלט של:\nwhile False:\n    print("שלום")',
            options: ['שלום', 'לולאה אינסופית', 'כלום', 'שגיאה'],
            correct: 2,
            explanation: 'התנאי False אז הלולאה לא רצה בכלל'
        },
        {
            question: 'איך בודקים אם מספר בטווח (לא כולל קצוות)?',
            options: ['5 < x < 10', 'x > 5 and x < 10', 'x in range(6, 10)', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'כל הדרכים בודקות טווח ללא קצוות'
        },
        {
            question: 'מה עושה pass?',
            options: ['מדלג על איטרציה', 'יוצא מלולאה', 'לא עושה כלום', 'עוצר תוכנית'],
            correct: 2,
            explanation: 'pass הוא placeholder שלא עושה כלום'
        },
        {
            question: 'איך עושים לולאה הפוכה על רשימה?',
            options: ['for item in reversed(list):', 'for item in list[::-1]:', 'for i in range(len(list)-1, -1, -1):', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'כל הדרכים האלו עוברות על רשימה הפוכה'
        },
        {
            question: 'מה יקרה בקוד:\nfor i in range(2):\n    for j in range(3):\n        if i == j:\n            continue\n        print(i, j)',
            options: ['4 שורות', '5 שורות', '6 שורות', '3 שורות'],
            correct: 1,
            explanation: 'נדפס כל צמד חוץ מ-(0,0) ו-(1,1): 5 שורות'
        },
        {
            question: 'איך בודקים אם רשימה ריקה?',
            options: ['if not list:', 'if len(list) == 0:', 'if list == []:', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'כל הדרכים בודקות אם רשימה ריקה'
        },
        {
            question: 'מה ההבדל בין break ו-continue?',
            options: ['אין הבדל', 'break יוצא, continue מדלג', 'break מדלג, continue יוצא', 'שניהם יוצאים'],
            correct: 1,
            explanation: 'break יוצא מהלולאה, continue מדלג לאיטרציה הבאה'
        },
        {
            question: 'איך עושים לולאה אינסופית עם תנאי יציאה?',
            options: ['while True:\n    if condition: break', 'for i in range(∞):', 'loop forever:', 'infinite while:'],
            correct: 0,
            explanation: 'while True עם break בתנאי הוא הדרך הנכונה'
        },
        {
            question: 'מה יהיה הפלט של:\nfor i in range(1, 6, 2):\n    print(i)',
            options: ['1 3 5', '2 4 6', '1 2 3 4 5', '1 3'],
            correct: 0,
            explanation: 'range(1, 6, 2) מתחיל מ-1, עד 6 (לא כולל), בצעדים של 2'
        },
        {
            question: 'איך בודקים תנאי מורכב עם סוגריים?',
            options: ['if (x > 5) and (y < 10):', 'if x > 5 and y < 10:', 'if (x > 5 and y < 10):', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'סוגריים אופציונליים ב-Python אבל עוזרים לקריאות'
        },
        {
            question: 'מה יקרה אם נשכח את ה-: אחרי if?',
            options: ['התוכנית תרוץ', 'אזהרה', 'שגיאת syntax', 'התוכנית תקפא'],
            correct: 2,
            explanation: ': חובה אחרי משפטי תנאי ולולאות'
        },
        {
            question: 'איך עושים לולאה על מילון?',
            options: ['for key in dict:', 'for key, value in dict.items():', 'for value in dict.values():', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'יש כמה דרכים לעבור על מילון לפי הצורך'
        },
        {
            question: 'מה זה list comprehension?',
            options: ['הבנת רשימות', '[x for x in range(10)]', 'דרך קצרה ליצור רשימות', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'list comprehension הוא תחביר קצר ליצירת רשימות'
        }
    ],
    'strings': [
        {
            question: 'מה יהיה הפלט של: len("שלום")?',
            options: ['4', '5', '3', 'שגיאה'],
            correct: 0,
            explanation: 'המחרוזת "שלום" מכילה 4 תווים'
        },
        {
            question: 'מה יעשה: "HELLO".lower()?',
            options: ['HELLO', 'hello', 'Hello', 'שגיאה'],
            correct: 1,
            explanation: '.lower() הופך את כל האותיות לקטנות'
        },
        {
            question: 'איך ניגש לתו הראשון במחרוזת?',
            options: ['text[1]', 'text[0]', 'text.first()', 'text[-1]'],
            correct: 1,
            explanation: 'האינדקס במחרוזות מתחיל מ-0, אז התו הראשון הוא [0]'
        },
        {
            question: 'מה יחזיר: "א ב ג".split()?',
            options: ['["א", "ב", "ג"]', '"א ב ג"', '["א ב ג"]', 'שגיאה'],
            correct: 0,
            explanation: 'split() חולק את המחרוזת לרשימה של מילים'
        },
        {
            question: 'איך בודקים אם מחרוזת מכילה טקסט מסוים?',
            options: ['text.has("word")', 'text.contains("word")', '"word" in text', 'text.find("word")'],
            correct: 2,
            explanation: 'המילה "in" בודקת אם טקסט נמצא במחרוזת'
        },
        {
            question: 'מה יעשה: "hello".upper()?',
            options: ['hello', 'HELLO', 'Hello', 'hELLO'],
            correct: 1,
            explanation: '.upper() הופך את כל האותיות לגדולות'
        },
        {
            question: 'איך ניגש לתו האחרון במחרוזת?',
            options: ['text[len(text)]', 'text[-1]', 'text[last]', 'text.last()'],
            correct: 1,
            explanation: 'text[-1] ניגש לתו האחרון (אינדקס שלילי)'
        },
        {
            question: 'מה יחזיר: "Python".replace("P", "J")?',
            options: ['Python', 'Jython', 'python', 'PyJhon'],
            correct: 1,
            explanation: 'replace() מחליף את התו הראשון בשני'
        },
        {
            question: 'איך חותכים מחרוזת?',
            options: ['text[1:3]', 'text.slice(1, 3)', 'text.cut(1, 3)', 'text.substring(1, 3)'],
            correct: 0,
            explanation: 'text[start:end] חותך מחרוזת מאינדקס start עד end-1'
        },
        {
            question: 'מה יהיה הפלט של: "123".isdigit()?',
            options: ['True', 'False', '123', 'שגיאה'],
            correct: 0,
            explanation: '.isdigit() בודק אם כל התווים הם ספרות'
        },
        {
            question: 'איך מחברים מחרוזות?',
            options: ['"hello" + "world"', '"hello".concat("world")', '"hello" & "world"', 'join("hello", "world")'],
            correct: 0,
            explanation: 'האופרטור + מחבר מחרוזות בפייתון'
        },
        {
            question: 'מה יחזיר: "  שלום  ".strip()?',
            options: ['"  שלום  "', '"שלום"', '"שלום  "', '"  שלום"'],
            correct: 1,
            explanation: '.strip() מסיר רווחים מתחילת וסוף המחרוזת'
        },
        {
            question: 'איך בודקים אם מחרוזת מתחילה במילה מסוימת?',
            options: ['text.starts("word")', 'text.startswith("word")', 'text.begin("word")', 'text[0] == "word"'],
            correct: 1,
            explanation: '.startswith() בודק אם מחרוזת מתחילה בטקסט מסוים'
        },
        {
            question: 'מה יהיה הפלט של: "ABC".lower().upper()?',
            options: ['abc', 'ABC', 'Abc', 'aBc'],
            correct: 1,
            explanation: 'lower() הופך לקטנות, upper() הופך לגדולות - התוצאה ABC'
        },
        {
            question: 'איך סופרים כמה פעמים תו מופיע במחרוזת?',
            options: ['text.count("a")', 'text.find("a")', 'text.search("a")', 'text.num("a")'],
            correct: 0,
            explanation: '.count() סופר כמה פעמים תו או מחרוזת מופיעים'
        },
        {
            question: 'מה יחזיר: "hello"[1:4]?',
            options: ['hell', 'ell', 'ello', 'hel'],
            correct: 1,
            explanation: '[1:4] לוקח תווים מאינדקס 1 עד 3 (לא כולל 4): "ell"'
        },
        {
            question: 'איך הופכים מחרוזת לרשימה של תווים?',
            options: ['list("hello")', '"hello".toList()', '"hello".split("")', 'chars("hello")'],
            correct: 0,
            explanation: 'list() הופך מחרוזת לרשימה של תווים'
        },
        {
            question: 'מה יחזיר: "".join(["a", "b", "c"])?',
            options: ['["a", "b", "c"]', '"a b c"', '"abc"', '"a,b,c"'],
            correct: 2,
            explanation: '""join() מחבר רשימה למחרוזת בלי מפריד'
        },
        {
            question: 'איך בודקים אם מחרוזת ריקה?',
            options: ['text == ""', 'len(text) == 0', 'not text', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'כל הדרכים האלו בודקות אם מחרוזת ריקה'
        },
        {
            question: 'מה יהיה הפלט של: "Python"[:3]?',
            options: ['Pyt', 'Pyth', 'Python', 'hon'],
            correct: 0,
            explanation: '[:3] לוקח תווים מההתחלה עד אינדקס 2: "Pyt"'
        },
        {
            question: 'איך הופכים מחרוזת?',
            options: ['text.reverse()', 'text[::-1]', 'reverse(text)', 'text.flip()'],
            correct: 1,
            explanation: 'text[::-1] הופך מחרוזת (צעד של -1)'
        },
        {
            question: 'מה יחזיר: "hello world".split(" ")?',
            options: ['["hello", "world"]', '"hello world"', '["hello", " ", "world"]', '"hello" "world"'],
            correct: 0,
            explanation: 'split(" ") חולק מחרוזת לפי רווח'
        },
        {
            question: 'איך בודקים אם מחרוזת מכילה רק אותיות?',
            options: ['text.isalpha()', 'text.isletters()', 'text.onlyletters()', 'text.alphabetic()'],
            correct: 0,
            explanation: '.isalpha() בודק אם כל התווים הם אותיות'
        },
        {
            question: 'מה יהיה הפלט של: "Python"[2:]?',
            options: ['Py', 'th', 'thon', 'Python'],
            correct: 2,
            explanation: '[2:] לוקח תווים מאינדקס 2 עד הסוף: "thon"'
        },
        {
            question: 'איך מחליפים כל המופעים של תו במחרוזת?',
            options: ['text.replace("a", "b")', 'text.replaceAll("a", "b")', 'text.change("a", "b")', 'text.substitute("a", "b")'],
            correct: 0,
            explanation: '.replace() מחליף את כל המופעים של המחרוזת הראשונה בשנייה'
        },
        {
            question: 'מה יחזיר: "Hello World".find("o")?',
            options: ['4', '7', '6', '-1'],
            correct: 0,
            explanation: '.find() מחזיר את האינדקס של המופע הראשון'
        },
        {
            question: 'איך בודקים אם מחרוזת מסתיימת במילה מסוימת?',
            options: ['text.endswith("word")', 'text.ends("word")', 'text[-4:] == "word"', 'התשובה הראשונה והשלישית נכונות'],
            correct: 3,
            explanation: 'גם endswith() וגם השוואת הסוף נכונים'
        },
        {
            question: 'מה יחזיר: "python".capitalize()?',
            options: ['python', 'PYTHON', 'Python', 'PyThOn'],
            correct: 2,
            explanation: '.capitalize() הופך את האות הראשונה לגדולה והשאר לקטנות'
        },
        {
            question: 'איך חותכים מחרוזת עד אינדקס מסוים?',
            options: ['text[:5]', 'text.slice(0, 5)', 'text.substring(0, 5)', 'text.cut(5)'],
            correct: 0,
            explanation: '[:n] חותך מההתחלה עד אינדקס n-1'
        },
        {
            question: 'מה יהיה הפלט של: "abc" * 3?',
            options: ['abcabcabc', 'abc3', 'aaa bbb ccc', 'שגיאה'],
            correct: 0,
            explanation: 'כפל מחרוזת חוזר עליה מספר פעמים'
        },
        {
            question: 'איך מוצאים את האינדקס של תת-מחרוזת?',
            options: ['text.index("sub")', 'text.find("sub")', 'text.search("sub")', 'התשובה הראשונה והשנייה נכונות'],
            correct: 3,
            explanation: 'גם index() וגם find() מוצאים אינדקס (index זורק שגיאה אם לא נמצא)'
        },
        {
            question: 'מה יחזיר: "123abc".isalnum()?',
            options: ['True', 'False', '123', 'abc'],
            correct: 0,
            explanation: '.isalnum() בודק אם כל התווים הם אותיות או ספרות'
        },
        {
            question: 'איך מסירים תווים מסוימים מהמחרוזת?',
            options: ['text.strip("abc")', 'text.remove("abc")', 'text.delete("abc")', 'text.cut("abc")'],
            correct: 0,
            explanation: '.strip() מסיר תווים מתחילת וסוף המחרוזת'
        },
        {
            question: 'מה יהיה הפלט של: "Hello"[1::2]?',
            options: ['el', 'ell', 'elo', 'Hlo'],
            correct: 2,
            explanation: '[1::2] מתחיל מאינדקס 1 ולוקח כל תו שני: "elo"'
        },
        {
            question: 'איך בודקים אם מחרוזת מכילה רק רווחים?',
            options: ['text.isspace()', 'text.iswhite()', 'text.isblank()', 'text.isEmpty()'],
            correct: 0,
            explanation: '.isspace() בודק אם כל התווים הם רווחים'
        },
        {
            question: 'מה יחזיר: "hello".title()?',
            options: ['hello', 'HELLO', 'Hello', 'HeLLo'],
            correct: 2,
            explanation: '.title() הופך את האות הראשונה של כל מילה לגדולה'
        },
        {
            question: 'איך מחליפים רק את המופע הראשון?',
            options: ['text.replace("a", "b", 1)', 'text.replaceFirst("a", "b")', 'text.sub("a", "b")', 'text.change("a", "b", 1)'],
            correct: 0,
            explanation: '.replace() עם פרמטר שלישי מגביל את מספר ההחלפות'
        },
        {
            question: 'מה יהיה הפלט של: "a,b,c".split(",")?',
            options: ['["a", "b", "c"]', '"a" "b" "c"', '["a,b,c"]', '"abc"'],
            correct: 0,
            explanation: '.split(",") חולק מחרוזת לפי פסיק'
        },
        {
            question: 'איך יוצרים מחרוזת עם ציטוטים?',
            options: ['"He said \\"Hello\\""', "'He said \"Hello\"'", '"""He said "Hello" """', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'יש כמה דרכים להכניס ציטוטים במחרוזת'
        },
        {
            question: 'מה יחזיר: "Python"*2?',
            options: ['Python2', 'PythonPython', 'Python Python', 'PP yy tt hh oo nn'],
            correct: 1,
            explanation: 'כפל מחרוזת משכפל אותה'
        }
    ],
    'operators': [
        {
            question: 'מה יהיה התוצאה של: 7 % 3?',
            options: ['2', '1', '3', '7'],
            correct: 1,
            explanation: '7 % 3 = 1 (השארית מחילוק 7 ב-3)'
        },
        {
            question: 'מה יהיה התוצאה של: 2 ** 3?',
            options: ['6', '8', '5', '9'],
            correct: 1,
            explanation: '2 ** 3 = 2³ = 8 (2 בחזקת 3)'
        },
        {
            question: 'מה זה True and False?',
            options: ['True', 'False', 'None', 'שגיאה'],
            correct: 1,
            explanation: 'אופרטור and מחזיר True רק אם שני הצדדים True'
        },
        {
            question: 'מה זה not True?',
            options: ['True', 'False', '1', '0'],
            correct: 1,
            explanation: 'not הופך True ל-False ו-False ל-True'
        },
        {
            question: 'מה יהיה התוצאה של: 10 // 3?',
            options: ['3.33', '3', '4', '1'],
            correct: 1,
            explanation: '// מבצע חילוק שלם: 10 // 3 = 3'
        },
        {
            question: 'מה זה True or False?',
            options: ['True', 'False', 'None', 'Both'],
            correct: 0,
            explanation: 'or מחזיר True אם לפחות אחד מהצדדים True'
        },
        {
            question: 'מה יהיה התוצאה של: 5 * 3?',
            options: ['15', '8', '53', '5*3'],
            correct: 0,
            explanation: '5 * 3 = 15 (כפל)'
        },
        {
            question: 'מה יהיה התוצאה של: 8 - 3?',
            options: ['5', '11', '83', '-3'],
            correct: 0,
            explanation: '8 - 3 = 5 (חיסור)'
        },
        {
            question: 'איך בודקים אם x גדול או שווה ל-5?',
            options: ['x >= 5', 'x => 5', 'x > 5 or x = 5', 'x ≥ 5'],
            correct: 0,
            explanation: '>= בודק גדול או שווה'
        },
        {
            question: 'מה יהיה התוצאה של: 15 / 4?',
            options: ['3', '3.75', '4', '15'],
            correct: 1,
            explanation: '/ מבצע חילוק עשרוני: 15 / 4 = 3.75'
        },
        {
            question: 'מה זה False or True?',
            options: ['False', 'True', 'None', 'Error'],
            correct: 1,
            explanation: 'or מחזיר True אם אחד הצדדים True'
        },
        {
            question: 'איך בודקים אי-שוויון?',
            options: ['x != y', 'x <> y', 'x not y', 'x neq y'],
            correct: 0,
            explanation: '!= בודק אי-שוויון'
        },
        {
            question: 'מה יהיה התוצאה של: 4 ** 2?',
            options: ['8', '16', '6', '42'],
            correct: 1,
            explanation: '4 ** 2 = 4² = 16'
        },
        {
            question: 'מה יהיה התוצאה של: 9 % 4?',
            options: ['2', '1', '2.25', '9'],
            correct: 1,
            explanation: '9 % 4 = 1 (השארית)'
        },
        {
            question: 'איך בודקים אם x קטן מ-10?',
            options: ['x < 10', 'x lt 10', '10 > x', 'התשובה הראשונה והשלישית נכונות'],
            correct: 3,
            explanation: 'גם x < 10 וגם 10 > x נכונים'
        },
        {
            question: 'מה זה not False?',
            options: ['False', 'True', 'None', '0'],
            correct: 1,
            explanation: 'not False = True'
        },
        {
            question: 'מה יהיה התוצאה של: 6 + 4?',
            options: ['10', '64', '24', '2'],
            correct: 0,
            explanation: '6 + 4 = 10 (חיבור)'
        },
        {
            question: 'איך בודקים אם שני תנאים נכונים?',
            options: ['condition1 and condition2', 'condition1 & condition2', 'condition1 && condition2', 'התשובה הראשונה נכונה'],
            correct: 3,
            explanation: 'and הוא האופרטור הנכון בפייתון'
        },
        {
            question: 'מה יהיה התוצאה של: 20 // 6?',
            options: ['3.33', '3', '4', '2'],
            correct: 1,
            explanation: '20 // 6 = 3 (חילוק שלם)'
        },
        {
            question: 'איך בודקים אם x בין 5 ל-10?',
            options: ['5 < x < 10', 'x > 5 and x < 10', '5 <= x <= 10', 'כל התשובות יכולות להיות נכונות'],
            correct: 3,
            explanation: 'תלוי אם רוצים לכלול את הקצוות או לא'
        },
        {
            question: 'מה יהיה התוצאה של: 3 ** 4?',
            options: ['12', '81', '7', '34'],
            correct: 1,
            explanation: '3 ** 4 = 3⁴ = 81'
        },
        {
            question: 'מה זה True and True?',
            options: ['True', 'False', '2', 'Both'],
            correct: 0,
            explanation: 'and מחזיר True כשהשניים True'
        },
        {
            question: 'איך מגדילים משתנה ב-1?',
            options: ['x++', 'x += 1', 'x = x + 1', 'התשובה השנייה והשלישית נכונות'],
            correct: 3,
            explanation: 'גם x += 1 וגם x = x + 1 מגדילים ב-1'
        },
        {
            question: 'מה יהיה התוצאה של: 12 % 5?',
            options: ['2', '2.4', '7', '12'],
            correct: 0,
            explanation: '12 % 5 = 2 (השארית מחילוק 12 ב-5)'
        },
        {
            question: 'איך בודקים אם x שווה ל-0?',
            options: ['x = 0', 'x == 0', 'x eq 0', 'x equals 0'],
            correct: 1,
            explanation: '== בודק שוויון, = משמש להשמה'
        },
        {
            question: 'מה יהיה התוצאה של: 100 // 7?',
            options: ['14', '14.28', '15', '7'],
            correct: 0,
            explanation: '100 // 7 = 14 (חילוק שלם)'
        },
        {
            question: 'איך בודקים אם שני תנאים שקריים?',
            options: ['not condition1 and not condition2', 'not (condition1 or condition2)', 'neither condition1 nor condition2', 'התשובה הראשונה והשנייה נכונות'],
            correct: 3,
            explanation: 'חוקי דה מורגן: not (A or B) = not A and not B'
        },
        {
            question: 'מה יהיה התוצאה של: 5 ** 0?',
            options: ['0', '1', '5', 'שגיאה'],
            correct: 1,
            explanation: 'כל מספר בחזקת 0 שווה ל-1'
        },
        {
            question: 'איך מחשבים שורש?',
            options: ['x ** 0.5', 'sqrt(x)', 'x ** (1/2)', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'שורש זה חזקה של 0.5 או 1/2, וגם יש פונקציית sqrt'
        },
        {
            question: 'מה זה 0 or 5?',
            options: ['0', '5', 'True', 'False'],
            correct: 1,
            explanation: 'or מחזיר את הערך הראשון שהוא "אמיתי"'
        },
        {
            question: 'איך בודקים אם מספר שלילי?',
            options: ['x < 0', 'x <= 0', 'negative(x)', 'x.isNegative()'],
            correct: 0,
            explanation: 'x < 0 בודק אם המספר קטן מאפס'
        },
        {
            question: 'מה יהיה התוצאה של: 25 % 7?',
            options: ['3', '4', '18', '25'],
            correct: 1,
            explanation: '25 % 7 = 4 (השארית מחילוק 25 ב-7)'
        },
        {
            question: 'איך מחשבים ערך מוחלט?',
            options: ['abs(x)', 'absolute(x)', 'math.abs(x)', '|x|'],
            correct: 0,
            explanation: 'abs() מחזיר את הערך המוחלט'
        },
        {
            question: 'מה זה True and 5?',
            options: ['True', '5', 'False', '6'],
            correct: 1,
            explanation: 'and מחזיר את הערך השני אם הראשון אמיתי'
        },
        {
            question: 'איך בודקים אם מספר בין 10 ל-20 (כולל)?',
            options: ['10 <= x <= 20', 'x >= 10 and x <= 20', 'x in range(10, 21)', 'כל התשובות נכונות'],
            correct: 3,
            explanation: 'כל הדרכים בודקות טווח כולל קצוות'
        },
        {
            question: 'מה יהיה התוצאה של: (-3) ** 2?',
            options: ['-9', '9', '-6', '6'],
            correct: 1,
            explanation: '(-3)² = 9 (מספר שלילי בחזקת זוגית הוא חיובי)'
        },
        {
            question: 'איך מכפילים משתנה בעצמו?',
            options: ['x *= x', 'x = x * x', 'x **= 2', 'התשובה הראשונה והשנייה נכונות'],
            correct: 3,
            explanation: 'גם x *= x וגם x = x * x מכפילים את x בעצמו'
        },
        {
            question: 'מה זה 10 and 0?',
            options: ['10', '0', 'True', 'False'],
            correct: 1,
            explanation: 'and מחזיר את הערך השני אם הראשון אמיתי, אבל 0 הוא שקרי'
        },
        {
            question: 'איך בודקים אם מספר זוגי בדרך קצרה?',
            options: ['not x % 2', 'x % 2 == 0', '~x & 1', 'התשובה הראשונה והשנייה נכונות'],
            correct: 3,
            explanation: 'גם not x % 2 וגם x % 2 == 0 בודקים זוגיות'
        },
        {
            question: 'מה יהיה התוצאה של: 2 ** 10?',
            options: ['20', '1024', '512', '100'],
            correct: 1,
            explanation: '2¹⁰ = 1024'
        }
    ]
};

// Complete Test Data
// Function to get random questions from a question bank
function getRandomQuestions(questionBank, count = 20) {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questionBank.length));
}

// Complete Test Data with randomized questions
const testData = {
    'test1': {
        title: 'מבחן 1 - יסודות פייתון',
        getQuestions: () => getRandomQuestions(questionBanks.basics, 20)
    },
    'test2': {
        title: 'מבחן 2 - תנאים והשוואות', 
        getQuestions: () => getRandomQuestions(questionBanks.control, 20)
    },
    'test3': {
        title: 'מבחן 3 - מחרוזות',
        getQuestions: () => getRandomQuestions(questionBanks.strings, 20)
    },
    'test4': {
        title: 'מבחן 4 - אופרטורים',
        getQuestions: () => getRandomQuestions(questionBanks.operators, 20)
    },
    'test5': {
        title: 'מבחן מקיף - חזרה על הכל',
        getQuestions: () => {
            const allQuestions = [
                ...questionBanks.basics,
                ...questionBanks.control, 
                ...questionBanks.strings,
                ...questionBanks.operators
            ];
            return getRandomQuestions(allQuestions, 20);
        }
    }
};

function startTest(testId) {
    console.log('startTest called with:', testId);
    
    if (!testData[testId]) {
        console.error('Test data not found for:', testId);
        alert('בחינה לא נמצאה');
        return;
    }
    
    console.log('Test data found:', testData[testId]);
    
    // Get random questions for this test
    currentQuizData = testData[testId].getQuestions();
    if (currentQuizData.length === 0) {
        console.error('No questions found for test:', testId);
        alert('אין שאלות זמינות לבחינה זו');
        return;
    }
    
    console.log('Starting test with', currentQuizData.length, 'random questions');
    
    currentQuestionIndex = 0;
    userAnswers = [];
    currentQuiz = testId;
    testTimeLeft = 15 * 60; // 15 minutes
    
    // Hide all sections and show quiz
    $('.content-section').removeClass('active');
    if ($('#quiz-container').length === 0) {
        console.log('Creating quiz container');
        createQuizContainer();
    }
    $('#quiz-container').addClass('active');
    $('#quiz-title').text(testData[testId].title);
    
    console.log('Starting timer and showing first question');
    startTestTimer();
    showQuizQuestion();
}

// Burger Menu Functions
function initializeBurgerMenu() {
    // Burger menu toggle
    $('#burger-menu').click(function() {
        toggleMobileMenu();
    });
    
    // Close menu when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.main-nav').length) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize if desktop
    $(window).resize(function() {
        if ($(window).width() > 768) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    $(document).keydown(function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const burgerMenu = $('#burger-menu');
    const navMenu = $('#nav-menu');
    
    burgerMenu.toggleClass('active');
    navMenu.toggleClass('show');
    
    // Toggle body scroll lock when menu is open
    if (navMenu.hasClass('show')) {
        $('body').addClass('menu-open');
    } else {
        $('body').removeClass('menu-open');
    }
}

function closeMobileMenu() {
    const burgerMenu = $('#burger-menu');
    const navMenu = $('#nav-menu');
    
    burgerMenu.removeClass('active');
    navMenu.removeClass('show');
    $('body').removeClass('menu-open');
}
