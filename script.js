// Global Variables
let currentSection = 'home';
let currentQuiz = null;
let currentQuizData = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizTimer = null;
let testTimer = null;
let testTimeLeft = 0;

// UTF-8 Encoding Verification and Setup
function ensureUTF8Support() {
    // Set document attributes for Hebrew
    document.documentElement.setAttribute('lang', 'he');
    document.documentElement.setAttribute('dir', 'rtl');
    
    // Check and log charset
    if (document.characterSet) {
        if (document.characterSet !== 'UTF-8') {
            console.warn('Warning: Document charset is not UTF-8:', document.characterSet);
            console.log('Expected UTF-8 for proper Hebrew text display');
        } else {
            console.log('✓ UTF-8 encoding confirmed');
        }
    }
    
    // Test Hebrew character rendering
    const testDiv = document.createElement('div');
    testDiv.innerHTML = 'בדיקת תצוגת עברית';
    testDiv.style.cssText = 'position:absolute;left:-9999px;font-family:Heebo,Arial;';
    document.body.appendChild(testDiv);
    
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(testDiv);
        console.log('Hebrew test element font-family:', computedStyle.fontFamily);
        document.body.removeChild(testDiv);
    }, 100);
    
    // Set body font properties for Hebrew
    document.body.style.fontFamily = "'Heebo', 'Noto Sans Hebrew', Arial, sans-serif";
    document.body.style.fontFeatureSettings = '"kern" 1, "liga" 1, "calt" 1';
    document.body.style.textRendering = 'optimizeLegibility';
    document.body.style.webkitFontSmoothing = 'antialiased';
    document.body.style.mozOsxFontSmoothing = 'grayscale';
}

// Initialize UTF-8 support immediately
ensureUTF8Support();

// Ensure UTF-8 encoding support (legacy)
document.documentElement.setAttribute('lang', 'he');
document.documentElement.setAttribute('dir', 'rtl');

// Force UTF-8 encoding for content (legacy)
if (document.characterSet && document.characterSet !== 'UTF-8') {
    console.warn('Document charset is not UTF-8:', document.characterSet);
}

// Navigation
$(document).ready(function() {
    // Verify UTF-8 and Hebrew display immediately
    ensureUTF8Support();
    
    // Test Hebrew rendering in console
    console.log('Hebrew test: שלום עולם - מבדק תצוגת עברית');
    console.log('Quiz Hebrew test: שאלות ותשובות במבחן');
    
    // Ensure proper text rendering
    $('body').css({
        'font-feature-settings': '"kern" 1, "liga" 1',
        'text-rendering': 'optimizeLegibility',
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale'
    });
    
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
    // Ensure UTF-8 support for quiz Hebrew text
    ensureUTF8Support();
    console.log('Starting quiz with UTF-8 support for:', practiceInfo?.title || topic);
    
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
    
    // Debug: Check if questions have proper structure
    console.log('Loaded quiz data:', currentQuizData.length, 'questions');
    currentQuizData.forEach((q, index) => {
        if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
            console.error('Question', index + 1, 'has invalid options:', q);
        }
    });
    
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
    // Ensure UTF-8 encoding for Hebrew text in questions
    ensureUTF8Support();
    
    if (currentQuestionIndex >= currentQuizData.length) {
        showQuizResults();
        return;
    }
    
    const question = currentQuizData[currentQuestionIndex];
    
    // Debug: Check if question has options
    if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
        console.error('Question missing options:', question);
        return;
    }
    
    // Debug: Log question data
    console.log('Rendering question:', currentQuestionIndex + 1, 'Options:', question.options.length);
    
    const quizHtml = `
        <div class="quiz-container" dir="rtl" lang="he">
            <div class="quiz-header" dir="rtl">
                <h3 dir="rtl">שאלה ${currentQuestionIndex + 1} מתוך ${currentQuizData.length}</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${((currentQuestionIndex + 1) / currentQuizData.length) * 100}%"></div>
                </div>
            </div>
            <div class="question" dir="rtl">
                <h4 dir="rtl">${question.question}</h4>
                <div class="options" dir="rtl">
                    ${question.options.map((option, index) => {
                        // Ensure option is not undefined or null
                        const safeOption = option ? String(option).replace(/'/g, '&#39;').replace(/"/g, '&quot;') : `אפשרות ${index + 1}`;
                        
                        // Enhanced code detection - include Python literals and common programming terms
                        const isCode = /[=(){}\[\];]|print|def |if |for |while |class |import |from |True|False|None|\d+|\.py|__|\w+\(\)|return|else|elif/.test(safeOption) || 
                                      /^(True|False|None|0|1|2|3|4|5|6|7|8|9|\d+|\d+\.\d+)$/.test(safeOption.trim()) ||
                                      /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(safeOption.trim()) && safeOption.length < 20;
                        
                        const codeClass = isCode ? ' code-content' : '';
                        const direction = isCode ? 'ltr' : 'rtl';
                        const fontFamily = isCode ? 'Consolas, Monaco, monospace' : 'inherit';
                        
                        return `<button class="option-btn${codeClass}" dir="${direction}" onclick="selectAnswer(${index})" data-option-index="${index}" style="font-family: ${fontFamily}; text-align: ${isCode ? 'left' : 'right'};">${safeOption}</button>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Create or update quiz modal
    if ($('#quizModal').length === 0) {
        $('body').append(`
            <div id="quizModal" class="modal">
                <div class="modal-content" dir="rtl" lang="he">
                    <span class="close" onclick="closeQuiz()">&times;</span>
                    <div id="quiz-content" dir="rtl"></div>
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
    
    // Ensure buttons are properly rendered with a small delay
    setTimeout(() => {
        const buttons = $('.option-btn');
        console.log('Rendered option buttons:', buttons.length);
        
        // Check if all buttons have text
        buttons.each(function(index) {
            const buttonText = $(this).text().trim();
            if (!buttonText) {
                console.warn('Empty button found at index:', index);
                // Try to re-render this button
                const option = question.options[index];
                if (option) {
                    $(this).text(option);
                    console.log('Fixed button', index, 'with text:', option);
                }
            }
            
            // Fix RTL issues for specific values
            const isCodeValue = /^(True|False|None|0|1|2|3|4|5|6|7|8|9|\d+|\d+\.\d+)$/.test(buttonText) ||
                               /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(buttonText) && buttonText.length < 20 ||
                               /[=(){}\[\];]/.test(buttonText);
            
            if (isCodeValue) {
                $(this).attr('dir', 'ltr')
                       .css({
                           'direction': 'ltr',
                           'text-align': 'left',
                           'font-family': 'Consolas, Monaco, monospace',
                           'unicode-bidi': 'normal'
                       })
                       .addClass('code-content');
                console.log('Fixed RTL for code button:', buttonText);
            }
        });
        
        if (buttons.length !== question.options.length) {
            console.warn('Mismatch: Expected', question.options.length, 'buttons, found', buttons.length);
            
            // Fallback: Recreate buttons using jQuery
            const optionsContainer = $('.options');
            optionsContainer.empty();
            
            question.options.forEach((option, index) => {
                // Enhanced code detection for fallback
                const isCode = /[=(){}\[\];]|print|def |if |for |while |class |import |from |True|False|None|\d+|\.py|__|\w+\(\)|return|else|elif/.test(option) || 
                              /^(True|False|None|0|1|2|3|4|5|6|7|8|9|\d+|\d+\.\d+)$/.test(option.trim()) ||
                              /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(option.trim()) && option.length < 20;
                
                const button = $('<button>')
                    .addClass('option-btn')
                    .attr('dir', isCode ? 'ltr' : 'rtl')
                    .attr('data-option-index', index)
                    .text(option || `אפשרות ${index + 1}`)
                    .click(() => selectAnswer(index));
                
                if (isCode) {
                    button.addClass('code-content')
                           .css({
                               'font-family': 'Consolas, Monaco, monospace',
                               'text-align': 'left',
                               'direction': 'ltr',
                               'unicode-bidi': 'normal'
                           });
                } else {
                    button.css({
                        'text-align': 'right',
                        'direction': 'rtl'
                    });
                }
                
                optionsContainer.append(button);
            });
            
            console.log('Recreated', question.options.length, 'buttons using fallback method');
        }
    }, 100);
    
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
        <div class="explanation ${isCorrect ? 'correct' : 'incorrect'}" dir="rtl" lang="he">
            <p dir="rtl"><strong>${isCorrect ? 'נכון!' : 'לא נכון.'}</strong></p>
            <p dir="rtl">${question.explanation}</p>
            <button class="btn-primary" dir="rtl" onclick="nextQuestion()" style="margin-top: 1rem;">
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
    // Ensure UTF-8 encoding for Hebrew text in results
    ensureUTF8Support();
    
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
        <div class="quiz-results ${color}" dir="rtl" lang="he">
            <h3 dir="rtl">תוצאות הבחינה</h3>
            <div class="score" dir="rtl">
                <span class="score-number">${correctAnswers}/${currentQuizData.length}</span>
                <span class="score-percentage">${percentage}%</span>
            </div>
            <p dir="rtl">${message}</p>
            <div class="results-actions" dir="rtl">
                <button class="btn-secondary" dir="rtl" onclick="closeQuiz()">סגור</button>
                <button class="btn-primary" dir="rtl" onclick="retryQuiz()">נסה שוב</button>
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

// Concept Details Functions
function showConceptDetails(conceptId) {
    const conceptData = {
        'python-intro': {
            title: '🐍 הכרת שפת פייתון',
            content: `
                <div class="concept-detail">
                    <h3>מה זה פייתון?</h3>
                    <p>פייתון היא שפת תכנות פשוטה, חזקה ויעילה שפותחה על ידי גידו ואן רוסום ב-1991. השפה נועדה להיות קלה ללמידה וקריאה.</p>
                    
                    <h4>🌟 יתרונות השפה:</h4>
                    <ul>
                        <li><strong>קלה ללמידה:</strong> תחביר פשוט וברור</li>
                        <li><strong>רב-תכליתית:</strong> מתאימה לפיתוח אתרים, בינה מלאכותית, מדע נתונים ועוד</li>
                        <li><strong>קהילה גדולה:</strong> מיליוני מפתחים ברחבי העולם</li>
                        <li><strong>ספריות רבות:</strong> אלפי ספריות זמינות בחינם</li>
                    </ul>

                    <h4>💻 דוגמה ראשונה:</h4>
                    <div class="code-example">
                        <pre><code># זוהי התוכנית הראשונה שלנו
print("שלום עולם!")
print("אני לומד פייתון")

# מחשבת הכפלה פשוטה
a = 5
b = 3
result = a * b
print(f"{a} כפול {b} שווה {result}")</code></pre>
                    </div>

                    <h4>🎯 שימושים נפוצים:</h4>
                    <ul>
                        <li>פיתוח אתרים (Django, Flask)</li>
                        <li>בינה מלאכותית ולמידת מכונה</li>
                        <li>ניתוח נתונים ומדע נתונים</li>
                        <li>אוטומציה וסקריפטים</li>
                        <li>פיתוח משחקים</li>
                    </ul>
                </div>
            `
        },
        'variables': {
            title: '🔤 משתנים',
            content: `
                <div class="concept-detail">
                    <h3>מה זה משתנה?</h3>
                    <p>משתנה הוא "קופסה" שמאחסנת מידע במחשב. כל משתנה יש לו שם וערך, והערך יכול להשתנות במהלך הריצה של התוכנית.</p>
                    
                    <h4>📝 כללי מתן שמות:</h4>
                    <ul>
                        <li>שם המשתנה חייב להתחיל באות או ב-_</li>
                        <li>יכול להכיל אותיות, מספרים ו-_</li>
                        <li>לא יכול להכיל רווחים או תווים מיוחדים</li>
                        <li>רגיש לאותיות גדולות/קטנות</li>
                        <li>לא יכול להיות מילה שמורה (if, for, class, וכו')</li>
                    </ul>

                    <div class="code-example">
                        <pre><code># דוגמאות נכונות
name = "יוסי"
age = 25
student_grade = 95
_private_var = "חשוב"

# דוגמאות שגויות
# 2name = "שגוי"  # מתחיל במספר
# my-var = 5     # מכיל מקף
# if = 10        # מילה שמורה</code></pre>
                    </div>

                    <h4>🔄 שינוי ערכי משתנים:</h4>
                    <div class="code-example">
                        <pre><code># יצירת משתנה
score = 80

# שינוי הערך
score = 85
score = score + 10  # 95

# דרך קצרה
score += 5  # 100
score -= 20 # 80
score *= 2  # 160</code></pre>
                    </div>

                    <h4>💡 טיפים לשמות טובים:</h4>
                    <ul>
                        <li>השתמש בשמות ברורים ומתארים: <code>student_name</code> במקום <code>x</code></li>
                        <li>השתמש ב-snake_case: <code>my_variable</code></li>
                        <li>הימנע מקיצורים לא ברורים</li>
                        <li>השתמש בשמות באנגלית או עברית עקבית</li>
                    </ul>
                </div>
            `
        },
        'input-output': {
            title: '📥 קלט ופלט',
            content: `
                <div class="concept-detail">
                    <h3>תקשורת עם המשתמש</h3>
                    <p>כל תוכנית צריכה לתקשר עם המשתמש - לקבל מידע ולהציג תוצאות. זה נעשה באמצעות פונקציות קלט ופלט.</p>
                    
                    <h4>🖨️ פונקציית print() - הדפסה למסך:</h4>
                    <div class="code-example">
                        <pre><code># הדפסה בסיסית
print("שלום עולם!")

# הדפסת משתנים
name = "דני"
age = 20
print("השם שלי", name)
print("אני בן", age)

# הדפסה מעוצבת עם f-strings
print(f"שמי {name} ואני בן {age}")

# הדפסה ברצף
print("ראשון", "שני", "שלישי", sep=" | ")
# תוצאה: ראשון | שני | שלישי</code></pre>
                    </div>

                    <h4>⌨️ פונקציית input() - קלט מהמשתמש:</h4>
                    <div class="code-example">
                        <pre><code># קלט בסיסי
name = input("מה השם שלך? ")
print(f"שלום {name}")

# קלט מספרי
age_str = input("כמה אתה בן? ")
age = int(age_str)  # המרה למספר
print(f"בעוד 10 שנים תהיה בן {age + 10}")

# דרך קצרה
age = int(input("כמה אתה בן? "))

# קלט מספר עשרוני
height = float(input("מה הגובה שלך (במטר)? "))
print(f"הגובה שלך הוא {height} מטר")</code></pre>
                    </div>

                    <h4>⚠️ טיפול בשגיאות קלט:</h4>
                    <div class="code-example">
                        <pre><code># מה קורה אם המשתמש מכניס טקסט במקום מספר?
try:
    age = int(input("כמה אתה בן? "))
    print(f"אתה בן {age}")
except ValueError:
    print("אנא הכנס מספר תקין!")</code></pre>
                    </div>

                    <h4>🎨 עיצוב פלט מתקדם:</h4>
                    <div class="code-example">
                        <pre><code># f-strings עם עיצוב
price = 19.99
print(f"המחיר הוא: {price:.2f} שקל")  # 19.99

# יישור טקסט
print(f"{'שם':<10} | {'ציון':>5}")
print(f"{'יוסי':<10} | {95:>5}")
print(f"{'דני':<10} | {87:>5}")

# הדפסה ללא מעבר שורה
print("טוען", end="")
print("...", end="")
print("הושלם!")</code></pre>
                    </div>
                </div>
            `
        },
        'comments': {
            title: '💬 הערות וביאורים',
            content: `
                <div class="concept-detail">
                    <h3>למה צריך הערות?</h3>
                    <p>הערות הן טקסט שהמתכנת כותב כדי להסביר מה הקוד עושה. המחשב מתעלם מהן, אבל הן חשובות מאוד לאנשים שקוראים את הקוד.</p>
                    
                    <h4>📝 סוגי הערות:</h4>
                    <div class="code-example">
                        <pre><code># זוהי הערה בשורה אחת
print("שלום!")  # הערה בסוף השורה

# ניתן לכתוב הערות ארוכות
# על פני מספר שורות
# כמו זה

"""
זוהי הערה רב-שורתית
שיכולה להכיל הרבה טקסט
ולהסביר דברים מורכבים
"""</code></pre>
                    </div>

                    <h4>✅ מתי להשתמש בהערות:</h4>
                    <ul>
                        <li><strong>הסבר המטרה:</strong> מה התוכנית אמורה לעשות</li>
                        <li><strong>חלקים מורכבים:</strong> אלגוריתם מסובך או נוסחה</li>
                        <li><strong>מידע על הקוד:</strong> מי כתב, מתי, למה</li>
                        <li><strong>TODO:</strong> דברים שצריך לתקן או להוסיף</li>
                    </ul>

                    <div class="code-example">
                        <pre><code># תוכנית חישוב שטח עיגול
# מחבר: יוסי כהן, תאריך: 01/12/2023

import math  # ספרייה למקדמים מתמטיים

# קבלת הרדיוס מהמשתמש
radius = float(input("הכנס רדיוס העיגול: "))

# חישוב השטח לפי הנוסחה: π * r²
area = math.pi * radius ** 2

# הצגת התוצאה עם עיגול לשתי ספרות
print(f"שטח העיגול הוא: {area:.2f}")</code></pre>
                    </div>

                    <h4>❌ הערות רעות (להימנע):</h4>
                    <div class="code-example">
                        <pre><code># רע: הערה מיותרת
x = x + 1  # הוספת 1 ל-x

# רע: הערה לא מעודכנת
# מחשב את הסכום של 3 מספרים
result = a + b  # אבל בפועל רק 2!

# טוב: הערה שמסבירת למה
x = x + 1  # מעבר לפריט הבא ברשימה</code></pre>
                    </div>

                    <h4>💡 טיפים להערות טובות:</h4>
                    <ul>
                        <li>כתוב בשפה ברורה ופשוטה</li>
                        <li>הסבר "למה" ולא "מה"</li>
                        <li>עדכן הערות כשמשנים קוד</li>
                        <li>אל תגזים - קוד טוב מסביר את עצמו</li>
                    </ul>
                </div>
            `
        },
        'errors': {
            title: '🚫 טיפול בשגיאות',
            content: `
                <div class="concept-detail">
                    <h3>סוגי שגיאות בתכנות</h3>
                    <p>שגיאות הן חלק טבעי מהתכנות. חשוב ללמוד לזהות אותן ולתקן אותן.</p>
                    
                    <h4>🔴 שגיאות תחבירים (Syntax Errors):</h4>
                    <p>שגיאות בכתיבת הקוד שמונעות מהתוכנית לרוץ</p>
                    <div class="code-example">
                        <pre><code># שגוי - חסרות גרשיים
print(שלום עולם)

# נכון
print("שלום עולם")

# שגוי - חסר :
if age > 18
    print("בגיר")

# נכון
if age > 18:
    print("בגיר")</code></pre>
                    </div>

                    <h4>🟠 שגיאות זמן ריצה (Runtime Errors):</h4>
                    <p>שגיאות שקורות כשהתוכנית רצה</p>
                    <div class="code-example">
                        <pre><code># חלוקה באפס
result = 10 / 0  # ZeroDivisionError

# משתנה לא קיים
print(name)  # NameError: name is not defined

# המרת טקסט למספר
age = int("abc")  # ValueError</code></pre>
                    </div>

                    <h4>🛡️ טיפול בשגיאות עם try-except:</h4>
                    <div class="code-example">
                        <pre><code># טיפול בסיסי
try:
    age = int(input("כמה אתה בן? "))
    print(f"אתה בן {age}")
except ValueError:
    print("אנא הכנס מספר תקין!")

# טיפול במספר סוגי שגיאות
try:
    num1 = int(input("מספר ראשון: "))
    num2 = int(input("מספר שני: "))
    result = num1 / num2
    print(f"התוצאה: {result}")
except ValueError:
    print("אנא הכנס מספרים תקינים!")
except ZeroDivisionError:
    print("אי אפשר לחלק באפס!")</code></pre>
                    </div>

                    <h4>🔍 איתור ותיקון שגיאות:</h4>
                    <ul>
                        <li><strong>קרא את הודעת השגיאה:</strong> היא מספרת לך מה השגיאה ובאיזה שורה</li>
                        <li><strong>בדוק תחביר:</strong> סוגריים, גרשיים, נקודותיים</li>
                        <li><strong>בדוק כתיב:</strong> שמות משתנים ופונקציות</li>
                        <li><strong>השתמש ב-print():</strong> כדי לבדוק ערכי משתנים</li>
                    </ul>

                    <h4>💡 טיפים למניעת שגיאות:</h4>
                    <div class="code-example">
                        <pre><code># בדיקה לפני פעולה
if num2 != 0:
    result = num1 / num2
else:
    print("לא ניתן לחלק באפס")

# בדיקת קלט
user_input = input("הכנס מספר: ")
if user_input.isdigit():
    num = int(user_input)
else:
    print("זה לא מספר!")</code></pre>
                    </div>
                </div>
            `
        },
        'best-practices': {
            title: '⭐ עקרונות תכנות נכון',
            content: `
                <div class="concept-detail">
                    <h3>כיצד לכתוב קוד טוב</h3>
                    <p>קוד טוב הוא קוד שקל לקרוא, להבין ולתחזק. הנה העקרונות החשובים ביותר.</p>
                    
                    <h4>📖 קריאות (Readability):</h4>
                    <div class="code-example">
                        <pre><code># רע - קשה להבין
x=int(input())
if x>=18:print("ok")
else:print("no")

# טוב - ברור ומסודר
age = int(input("כמה אתה בן? "))
if age >= 18:
    print("בגיר")
else:
    print("קטין")</code></pre>
                    </div>

                    <h4>🏗️ מבנה נכון:</h4>
                    <ul>
                        <li><strong>הזחות עקביות:</strong> 4 רווחים לכל רמה</li>
                        <li><strong>שורות ריקות:</strong> הפרדה בין חלקי קוד</li>
                        <li><strong>אורך שורה:</strong> עד 80 תווים</li>
                        <li><strong>סדר לוגי:</strong> import, קבועים, פונקציות, קוד ראשי</li>
                    </ul>

                    <div class="code-example">
                        <pre><code># מבנה תוכנית טוב
import math

# קבועים
PI = 3.14159
TAX_RATE = 0.17

# פונקציות
def calculate_circle_area(radius):
    """מחשבת שטח עיגול"""
    return PI * radius ** 2

def calculate_tax(price):
    """מחשבת מס"""
    return price * TAX_RATE

# תוכנית ראשית
if __name__ == "__main__":
    r = float(input("הכנס רדיוס: "))
    area = calculate_circle_area(r)
    print(f"השטח: {area:.2f}")</code></pre>
                    </div>

                    <h4>🔧 DRY - Don't Repeat Yourself:</h4>
                    <div class="code-example">
                        <pre><code># רע - חזרה על קוד
print("ברוך הבא לתוכנית!")
name1 = input("שם תלמיד 1: ")
grade1 = int(input("ציון תלמיד 1: "))
print(f"{name1}: {grade1}")

name2 = input("שם תלמיד 2: ")
grade2 = int(input("ציון תלמיד 2: "))
print(f"{name2}: {grade2}")

# טוב - פונקציה
def get_student_info():
    name = input("שם התלמיד: ")
    grade = int(input("ציון התלמיד: "))
    print(f"{name}: {grade}")
    return name, grade

print("ברוך הבא לתוכנית!")
student1 = get_student_info()
student2 = get_student_info()</code></pre>
                    </div>

                    <h4>🎯 שמות משמעותיים:</h4>
                    <div class="code-example">
                        <pre><code># רע
a = int(input())
b = a * 0.17
c = a + b

# טוב
price = int(input("מחיר המוצר: "))
tax = price * 0.17
total_price = price + tax</code></pre>
                    </div>

                    <h4>✅ רשימת בדיקה לקוד טוב:</h4>
                    <ul>
                        <li>האם השמות ברורים ומתארים?</li>
                        <li>האם יש הערות במקומות המתאימים?</li>
                        <li>האם הקוד מחולק לפונקציות?</li>
                        <li>האם יש טיפול בשגיאות?</li>
                        <li>האם הקוד עובד עם קלטים שונים?</li>
                        <li>האם הקוד קל לשינוי ולהרחבה?</li>
                    </ul>

                    <h4>🌟 הטיפ הזהב:</h4>
                    <p><strong>"כתוב קוד כאילו האדם שיקרא אותו הוא רוצח פסיכופת שיודע איפה אתה גר"</strong> - זכור שאתה עצמך תקרא את הקוד הזה בעוד חודש ולא תזכור מה רצית לעשות!</p>
                </div>
            `
        },
        // Data Types Section
        'numbers': {
            title: '🔢 מספרים',
            content: `
                <div class="concept-detail">
                    <h3>סוגי מספרים בפייתון</h3>
                    <p>פייתון תומכת במספר סוגי מספרים לשימושים שונים.</p>
                    
                    <h4>🔢 מספרים שלמים (int):</h4>
                    <div class="code-example">
                        <pre><code># מספרים חיוביים ושליליים
age = 25
temperature = -5
big_number = 1000000

# פעולות בסיסיות
a = 10
b = 3
print(f"חיבור: {a + b}")      # 13
print(f"חיסור: {a - b}")      # 7
print(f"כפל: {a * b}")        # 30
print(f"חלוקה: {a / b}")      # 3.333...
print(f"חלוקה שלמה: {a // b}") # 3
print(f"שארית: {a % b}")      # 1
print(f"חזקה: {a ** b}")      # 1000</code></pre>
                    </div>

                    <h4>💰 מספרים עשרוניים (float):</h4>
                    <div class="code-example">
                        <pre><code># מספרים עם נקודה עשרונית
price = 19.99
height = 1.75
pi = 3.14159

# דיוק בחישובים
result = 0.1 + 0.2
print(result)  # 0.30000000000000004 (לא מדויק!)

# פתרון - עיגול
result = round(0.1 + 0.2, 2)
print(result)  # 0.3

# עיצוב הצגה
print(f"מחיר: {price:.2f} שקל")  # מחיר: 19.99 שקל</code></pre>
                    </div>

                    <h4>🧮 פונקציות שימושיות:</h4>
                    <div class="code-example">
                        <pre><code>import math

# פונקציות בסיסיות
print(abs(-5))        # 5 - ערך מוחלט
print(max(3, 7, 1))   # 7 - מקסימום
print(min(3, 7, 1))   # 1 - מינימום
print(round(3.7))     # 4 - עיגול
print(round(3.14159, 2))  # 3.14 - עיגול עם דיוק

# פונקציות math
print(math.sqrt(16))  # 4.0 - שורש ריבועי
print(math.ceil(3.2)) # 4 - עיגול למעלה
print(math.floor(3.8)) # 3 - עיגול למטה
print(math.pi)        # 3.141592653589793</code></pre>
                    </div>

                    <h4>🔄 המרות בין סוגים:</h4>
                    <div class="code-example">
                        <pre><code># המרת מחרוזת למספר
age_str = "25"
age = int(age_str)
print(type(age))  # <class 'int'>

height_str = "1.75"
height = float(height_str)
print(type(height))  # <class 'float'>

# המרת מספר למחרוזת
num = 42
num_str = str(num)
print(type(num_str))  # <class 'str'>

# בדיקת סוג
print(isinstance(25, int))     # True
print(isinstance(3.14, float)) # True</code></pre>
                    </div>
                </div>
            `
        },
        'strings': {
            title: '📝 מחרוזות (טקסט)',
            content: `
                <div class="concept-detail">
                    <h3>עבודה עם טקסט</h3>
                    <p>מחרוזת היא רצף של תווים - אותיות, מספרים, סימנים וכו'. זה אחד הסוגים החשובים ביותר בתכנות.</p>
                    
                    <h4>✍️ יצירת מחרוזות:</h4>
                    <div class="code-example">
                        <pre><code># דרכים שונות ליצירה
name = "יוסי"
message = 'שלום עולם!'
long_text = """זוהי מחרוזת
ארוכה על פני
מספר שורות"""

# מחרוזת ריקה
empty = ""
empty2 = str()

# הדפסת מחרוזות
print("שלום " + name + "!")
print(f"שלום {name}!")  # f-string - הדרך המומלצת</code></pre>
                    </div>

                    <h4>🔧 פעולות על מחרוזות:</h4>
                    <div class="code-example">
                        <pre><code>text = "שלום עולם"

# אורך המחרוזת
print(len(text))  # 10

# גישה לתווים (index מתחיל מ-0)
print(text[0])    # ש
print(text[-1])   # ם (אחרון)

# חיתוך (slicing)
print(text[0:4])  # שלום
print(text[5:])   # עולם
print(text[:4])   # שלום

# בדיקות
print("שלום" in text)      # True
print("היי" in text)       # False
print(text.startswith("שלום"))  # True
print(text.endswith("עולם"))    # True</code></pre>
                    </div>

                    <h4>🔤 מתודות שימושיות:</h4>
                    <div class="code-example">
                        <pre><code>name = "יוסי כהן"
sentence = "שלום עולם נפלא"

# שינוי רישיות (באנגלית)
english = "Hello World"
print(english.upper())    # HELLO WORLD
print(english.lower())    # hello world
print(english.title())    # Hello World

# ניקוי רווחים
text = "  שלום עולם  "
print(text.strip())       # "שלום עולם"

# החלפה
print(sentence.replace("עולם", "יקום"))  # שלום יקום נפלא

# פיצול למילים
words = sentence.split()
print(words)  # ['שלום', 'עולם', 'נפלא']

# חיבור מילים
new_sentence = " ".join(words)
print(new_sentence)  # שלום עולם נפלא</code></pre>
                    </div>

                    <h4>🎨 עיצוב מחרוזות:</h4>
                    <div class="code-example">
                        <pre><code># f-strings - הדרך המתקדמת
name = "דני"
age = 25
score = 87.5

print(f"שם: {name}")
print(f"גיל: {age} שנים")
print(f"ציון: {score:.1f}")  # עיגול לספרה אחת

# יישור טקסט
print(f"{'שם':<10} | {'ציון':>5}")  # יישור שמאל ו ימין
print(f"{name:<10} | {score:>5.1f}")

# format() - דרך ישנה יותר
template = "שלום {}, אתה בן {}"
print(template.format(name, age))

# % formatting - דרך עתיקה
print("שלום %s, אתה בן %d" % (name, age))</code></pre>
                    </div>

                    <h4>🔍 דוגמה מקיפה - עיבוד טקסט:</h4>
                    <div class="code-example">
                        <pre><code># קבלת טקסט מהמשתמש ועיבוד
user_input = input("הכנס משפט: ").strip()

# בדיקות בסיסיות
if not user_input:
    print("לא הכנסת כלום!")
else:
    # ניתוח המשפט
    word_count = len(user_input.split())
    char_count = len(user_input)
    
    print(f"המשפט שלך: '{user_input}'")
    print(f"מספר מילים: {word_count}")
    print(f"מספר תווים: {char_count}")
    
    # בדיקת תוכן
    if "שלום" in user_input.lower():
        print("נחמד לראות שאתה מנומס! 😊")</code></pre>
                    </div>
                </div>
            `
        },
        'booleans': {
            title: '✅ ערכי אמת (Boolean)',
            content: `
                <div class="concept-detail">
                    <h3>True ו-False</h3>
                    <p>ערכי בוליאן מייצגים אמת או שקר. הם בסיס לקבלת החלטות בתוכנית.</p>
                    
                    <h4>💡 ערכי בוליאן בסיסיים:</h4>
                    <div class="code-example">
                        <pre><code># שני הערכים היחידים
is_student = True
is_working = False

print(type(True))   # <class 'bool'>
print(type(False))  # <class 'bool'>

# בדיקות שמחזירות בוליאן
age = 20
print(age > 18)     # True
print(age < 10)     # False
print(age == 20)    # True
print(age != 25)    # True</code></pre>
                    </div>

                    <h4>🔗 אופרטורים לוגיים:</h4>
                    <div class="code-example">
                        <pre><code>age = 22
has_license = True
has_car = False

# AND - שניהם צריכים להיות אמת
can_drive = age >= 18 and has_license
print(f"יכול לנהוג: {can_drive}")  # True

# OR - אחד מהם צריך להיות אמת
can_travel = has_license or has_car
print(f"יכול לנסוע: {can_travel}")  # True

# NOT - הפיכת ערך
is_minor = not (age >= 18)
print(f"קטין: {is_minor}")  # False

# שילוב מורכב
can_buy_car = age >= 18 and has_license and not has_car
print(f"יכול לקנות רכב: {can_buy_car}")  # True</code></pre>
                    </div>

                    <h4>🎯 ערכים "חושבים" (Truthy/Falsy):</h4>
                    <div class="code-example">
                        <pre><code># ערכים שנחשבים False
print(bool(0))        # False - אפס
print(bool(""))       # False - מחרוזת ריקה
print(bool([]))       # False - רשימה ריקה
print(bool(None))     # False - None

# ערכים שנחשבים True
print(bool(1))        # True - מספר שונה מאפס
print(bool("היי"))    # True - מחרוזת לא ריקה
print(bool([1, 2]))   # True - רשימה לא ריקה
print(bool(-5))       # True - גם מספר שלילי

# שימוש בבדיקות
name = input("הכנס שם: ")
if name:  # אם השם לא ריק
    print(f"שלום {name}")
else:
    print("לא הכנסת שם")</code></pre>
                    </div>

                    <h4>🔄 אופרטורי השוואה:</h4>
                    <div class="code-example">
                        <pre><code>a = 10
b = 20
c = 10

# השוואות בסיסיות
print(a == c)   # True - שווה
print(a != b)   # True - לא שווה
print(a < b)    # True - קטן מ
print(b > a)    # True - גדול מ
print(a <= c)   # True - קטן או שווה
print(b >= a)   # True - גדול או שווה

# השוואת מחרוזות
name1 = "אלון"
name2 = "בני"
print(name1 < name2)  # True - לפי סדר אלפביתי

# זהירות עם סוגים שונים
print(5 == "5")    # False - מספר ומחרוזת
print(5 == 5.0)    # True - int ו-float</code></pre>
                    </div>

                    <h4>💼 דוגמה מעשית - מערכת הרשאות:</h4>
                    <div class="code-example">
                        <pre><code># מערכת בדיקת הרשאות
age = int(input("כמה אתה בן? "))
has_id = input("יש לך תעודת זהות? (כן/לא) ").lower() == "כן"
is_citizen = input("אתה אזרח? (כן/לא) ").lower() == "כן"

# בדיקת זכאות להצבעה
can_vote = age >= 18 and has_id and is_citizen

if can_vote:
    print("✅ אתה זכאי להצביע!")
else:
    print("❌ אינך זכאי להצביע")
    
    # הסבר למה לא
    if age < 18:
        print("- אתה מתחת לגיל 18")
    if not has_id:
        print("- אין לך תעודת זהות")
    if not is_citizen:
        print("- אינך אזרח")

# דוגמה למערכת ציונים
grade = float(input("הכנס ציון: "))
passed = grade >= 60
honors = grade >= 90

print(f"עבר: {passed}")
print(f"בהצטיינות: {honors}")

if passed and honors:
    print("🏆 מעולה!")
elif passed:
    print("👍 עבר בהצלחה")
else:
    print("😔 לא עבר")</code></pre>
                    </div>
                </div>
            `
        },
        'arithmetic-operators': {
            title: '➕ אופרטורים אריתמטיים',
            content: `
                <div class="concept-detail">
                    <h3>חישובים מתמטיים</h3>
                    <p>אופרטורים אריתמטיים מאפשרים לנו לבצע פעולות מתמטיות בסיסיות ומתקדמות.</p>
                    
                    <h4>🧮 פעולות בסיסיות:</h4>
                    <div class="code-example">
                        <pre><code># חיבור וחיסור
a = 10
b = 3
print(a + b)    # 13 - חיבור
print(a - b)    # 7 - חיסור

# כפל וחילוק
print(a * b)    # 30 - כפל
print(a / b)    # 3.333... - חילוק (תמיד מחזיר float)
print(a // b)   # 3 - חילוק שלם (רק החלק השלם)
print(a % b)    # 1 - שארית (מודולו)

# חזקה
print(a ** b)   # 1000 - 10 בחזקת 3
print(2 ** 8)   # 256 - 2 בחזקת 8</code></pre>
                    </div>

                    <h4>📋 סדר פעולות (עדיפות):</h4>
                    <div class="code-example">
                        <pre><code># סדר פעולות כמו במתמטיקה
result = 2 + 3 * 4     # 14 (לא 20!)
print(result)

# שימוש בסוגריים
result = (2 + 3) * 4   # 20
print(result)

# עדיפות מלאה:
# 1. סוגריים ()
# 2. חזקה **
# 3. כפל, חילוק *, /, //, %
# 4. חיבור, חיסור +, -

complex_calc = 2 + 3 * 4 ** 2 / 8 - 1
# = 2 + 3 * 16 / 8 - 1
# = 2 + 48 / 8 - 1  
# = 2 + 6 - 1
# = 7
print(complex_calc)</code></pre>
                    </div>

                    <h4>🔢 פעולות עם סוגי נתונים שונים:</h4>
                    <div class="code-example">
                        <pre><code># מספרים שלמים ועשרוניים
int_num = 10
float_num = 3.5
print(int_num + float_num)   # 13.5 (תוצאה עשרונית)

# כפל מחרוזת במספר
name = "היי "
print(name * 3)              # "היי היי היי "

# חיבור מחרוזות
greeting = "שלום " + "עולם"
print(greeting)              # "שלום עולם"

# אי אפשר לחבר מחרוזת למספר ישירות
# print("גיל: " + 25)        # שגיאה!
print("גיל: " + str(25))     # "גיל: 25" - נכון</code></pre>
                    </div>

                    <h4>💡 שימושים מעשיים:</h4>
                    <div class="code-example">
                        <pre><code># מחשבון טיפים במסעדה
bill = 120.50
tip_percent = 15
tip = bill * (tip_percent / 100)
total = bill + tip
print(f"חשבון: {bill:.2f} שקל")
print(f"טיפ ({tip_percent}%): {tip:.2f} שקל")
print(f"סה\"כ: {total:.2f} שקל")

# בדיקה אם מספר זוגי או אי זוגי
number = 17
if number % 2 == 0:
    print(f"{number} הוא זוגי")
else:
    print(f"{number} הוא אי-זוגי")

# חישוב שטח עיגול
import math
radius = 5
area = math.pi * radius ** 2
print(f"שטח עיגול ברדיוס {radius}: {area:.2f}")</code></pre>
                    </div>

                    <h4>⚠️ דברים לשים לב אליהם:</h4>
                    <ul>
                        <li><strong>חילוק באפס:</strong> גורם לשגיאה - תמיד בדקו!</li>
                        <li><strong>דיוק עשרוני:</strong> 0.1 + 0.2 לא בדיוק 0.3</li>
                        <li><strong>מספרים גדולים:</strong> Python יכול לעבוד עם מספרים ענקיים</li>
                        <li><strong>חילוק שלם שלילי:</strong> -7 // 3 = -3 (לא -2)</li>
                    </ul>
                </div>
            `
        },
        'comparison-operators': {
            title: '⚖️ אופרטורי השוואה',
            content: `
                <div class="concept-detail">
                    <h3>השוואת ערכים</h3>
                    <p>אופרטורי השוואה מאפשרים לנו להשוות ערכים ולקבל תשובה של True או False.</p>
                    
                    <h4>🔍 אופרטורי השוואה בסיסיים:</h4>
                    <div class="code-example">
                        <pre><code># שווה ולא שווה
a = 5
b = 3
c = 5

print(a == c)    # True - שווה
print(a == b)    # False - לא שווה
print(a != b)    # True - לא שווה
print(a != c)    # False - שווה (אז לא "לא שווה")

# גדול וקטן
print(a > b)     # True - 5 גדול מ-3
print(b < a)     # True - 3 קטן מ-5
print(a >= c)    # True - 5 גדול או שווה ל-5
print(b <= a)    # True - 3 קטן או שווה ל-5</code></pre>
                    </div>

                    <h4>📝 השוואת מחרוזות:</h4>
                    <div class="code-example">
                        <pre><code># השוואת מחרוזות - לפי סדר אלפביתי
name1 = "אברהם"
name2 = "יצחק"
name3 = "אברהם"

print(name1 == name3)    # True
print(name1 != name2)    # True
print(name1 < name2)     # True - אברהם לפני יצחק באלפבית

# השוואה רגישה לאותיות גדולות/קטנות (באנגלית)
english1 = "Hello"
english2 = "hello"
print(english1 == english2)    # False!
print(english1.lower() == english2.lower())  # True - אחרי המרה לקטנות</code></pre>
                    </div>

                    <h4>🔢 השוואת סוגי נתונים שונים:</h4>
                    <div class="code-example">
                        <pre><code># מספרים שלמים ועשרוניים
print(5 == 5.0)      # True - הערך זהה
print(5 == 5.1)      # False

# מחרוזת מול מספר
print(5 == "5")      # False - סוגים שונים
print(str(5) == "5") # True - לאחר המרה

# רשימות ו-tuples
list1 = [1, 2, 3]
list2 = [1, 2, 3]
list3 = [1, 2, 4]

print(list1 == list2)  # True - אותו תוכן
print(list1 == list3)  # False - תוכן שונה

# בדיקת אורך
print(len("שלום") == 4)      # True
print(len([1, 2, 3]) > 2)    # True</code></pre>
                    </div>

                    <h4>🎯 שימושים מעשיים:</h4>
                    <div class="code-example">
                        <pre><code># בדיקת גיל להרשאות
age = int(input("כמה אתה בן? "))

if age >= 18:
    print("אתה בגיר - יכול להצביע")
elif age >= 16:
    print("יכול לקבל רישיון נהיגה")
else:
    print("אתה קטין")

# מערכת ציונים
grade = float(input("הכנס ציון: "))

if grade >= 90:
    print("מעולה!")
elif grade >= 80:
    print("טוב מאוד")
elif grade >= 70:
    print("טוב")
elif grade >= 60:
    print("עבר")
else:
    print("נכשל")

# בדיקת סיסמה
password = input("הכנס סיסמה: ")
if len(password) >= 8:
    print("סיסמה חזקה")
else:
    print("סיסמה חלשה - צריך לפחות 8 תווים")</code></pre>
                    </div>

                    <h4>🔗 שילוב עם אופרטורים לוגיים:</h4>
                    <div class="code-example">
                        <pre><code># בדיקה מורכבת
age = 25
salary = 8000
has_experience = True

# בדיקת זכאות למשכנתא
eligible = age >= 21 and salary >= 6000 and has_experience
print(f"זכאי למשכנתא: {eligible}")

# בדיקת הנחה לסטודנטים או קשישים
student_age = 20
senior_age = 67

gets_discount = student_age <= 25 or senior_age >= 65
print(f"זכאי להנחה: {gets_discount}")

# בדיקת טווח
temperature = 22
comfortable = 18 <= temperature <= 26
print(f"טמפרטורה נוחה: {comfortable}")</code></pre>
                    </div>
                </div>
            `
        },
        'logical-operators': {
            title: '🧠 אופרטורים לוגיים',
            content: `
                <div class="concept-detail">
                    <h3>חיבור תנאים</h3>
                    <p>אופרטורים לוגיים מאפשרים לנו לשלב מספר תנאים ליצירת תנאים מורכבים.</p>
                    
                    <h4>🔗 האופרטור AND (וגם):</h4>
                    <div class="code-example">
                        <pre><code># AND - שני התנאים חייבים להיות אמת
age = 25
has_license = True
owns_car = False

# כדי לנהוג צריך גיל מתאים AND רישיון
can_drive = age >= 18 and has_license
print(f"יכול לנהוג: {can_drive}")  # True

# כדי להשכיר רכב צריך הכל
can_rent_car = age >= 21 and has_license and age <= 70
print(f"יכול לשכור רכב: {can_rent_car}")  # True

# טבלת אמת ל-AND
print("טבלת אמת ל-AND:")
print(f"True and True = {True and True}")     # True
print(f"True and False = {True and False}")   # False
print(f"False and True = {False and True}")   # False
print(f"False and False = {False and False}") # False</code></pre>
                    </div>

                    <h4>🔀 האופרטור OR (או):</h4>
                    <div class="code-example">
                        <pre><code># OR - לפחות אחד מהתנאים צריך להיות אמת
is_weekend = True
is_holiday = False
has_vacation = False

# יום חופשי אם זה סוף שבוע OR חג OR חופשה
free_day = is_weekend or is_holiday or has_vacation
print(f"יום חופשי: {free_day}")  # True

# הנחה לסטודנטים או לקשישים
age = 67
is_student = False
gets_discount = age <= 25 or age >= 65 or is_student
print(f"זכאי להנחה: {gets_discount}")  # True

# טבלת אמת ל-OR
print("טבלת אמת ל-OR:")
print(f"True or True = {True or True}")     # True
print(f"True or False = {True or False}")   # True
print(f"False or True = {False or True}")   # True
print(f"False or False = {False or False}") # False</code></pre>
                    </div>

                    <h4>🚫 האופרטור NOT (לא):</h4>
                    <div class="code-example">
                        <pre><code># NOT - הופך אמת לשקר ושקר לאמת
is_raining = False
is_sunny = not is_raining
print(f"שמשי: {is_sunny}")  # True

logged_in = True
needs_login = not logged_in
print(f"צריך להתחבר: {needs_login}")  # False

# שימוש עם תנאים
password = "1234"
is_secure = not (len(password) < 8)
print(f"סיסמה בטוחה: {is_secure}")  # False

# טבלת אמת ל-NOT
print("טבלת אמת ל-NOT:")
print(f"not True = {not True}")   # False
print(f"not False = {not False}") # True</code></pre>
                    </div>

                    <h4>🔄 שילוב אופרטורים:</h4>
                    <div class="code-example">
                        <pre><code># שילוב מורכב של אופרטורים
age = 30
salary = 12000
has_debt = False
credit_score = 750

# בדיקת זכאות להלוואה
eligible_for_loan = (age >= 21 and age <= 65) and \
                   (salary >= 8000) and \
                   (not has_debt) and \
                   (credit_score >= 700)

print(f"זכאי להלוואה: {eligible_for_loan}")  # True

# סדר פעולות עם סוגריים
# AND לפני OR (כמו כפל לפני חיבור)
condition = True or False and False  # True or (False and False) = True
condition_with_parentheses = (True or False) and False  # False

print(f"ללא סוגריים: {condition}")           # True
print(f"עם סוגריים: {condition_with_parentheses}")  # False</code></pre>
                    </div>

                    <h4>🎮 דוגמה מעשית - משחק:</h4>
                    <div class="code-example">
                        <pre><code># מערכת הרשאות במשחק
player_level = 15
has_key = True
completed_quest = True
is_premium = False

# כניסה לשטח מיוחד
can_enter_special_area = (player_level >= 10 and has_key) or \
                        (completed_quest and is_premium) or \
                        player_level >= 50

print(f"יכול להיכנס לשטח מיוחד: {can_enter_special_area}")

# מערכת התרעות
health = 25
mana = 80
enemies_nearby = True

# התרעה על סכנה
in_danger = (health <= 30 and enemies_nearby) or health <= 10
show_warning = in_danger and not (mana >= 50 and health > 20)

if show_warning:
    print("⚠️ אזהרה: אתה בסכנה!")
else:
    print("✅ אתה בטוח")

# חישוב נזק מותנה
base_damage = 100
is_critical = True
has_power_up = True
target_is_weak = False

final_damage = base_damage
if is_critical and (has_power_up or target_is_weak):
    final_damage *= 2

print(f"נזק סופי: {final_damage}")</code></pre>
                    </div>
                </div>
            `
        },
        'assignment-operators': {
            title: '📝 אופרטורי השמה',
            content: `
                <div class="concept-detail">
                    <h3>השמת ערכים למשתנים</h3>
                    <p>אופרטורי השמה מאפשרים לנו לשמור ערכים במשתנים ולעדכן אותם בדרכים שונות.</p>
                    
                    <h4>🎯 השמה בסיסית (=):</h4>
                    <div class="code-example">
                        <pre><code># השמה פשוטה
name = "יוסי"
age = 25
height = 1.75
is_student = True

print(f"שם: {name}, גיל: {age}")

# השמה מרובה
x = y = z = 0
print(f"x={x}, y={y}, z={z}")  # x=0, y=0, z=0

# השמה מרובה עם פירוק
name, age, city = "שרה", 22, "תל אביב"
print(f"{name} בת {age} מ{city}")

# החלפת ערכים
a = 10
b = 20
print(f"לפני: a={a}, b={b}")
a, b = b, a  # החלפה אלגנטית
print(f"אחרי: a={a}, b={b}")
</code></pre>
                    </div>

                    <h4>➕ אופרטורי השמה עם פעולה:</h4>
                    <div class="code-example">
                        <pre><code># במקום לכתוב: x = x + 5
x = 10
x += 5    # זהה ל: x = x + 5
print(x)  # 15

# כל האופרטורים האריתמטיים
score = 100
score += 20    # score = score + 20 → 120
score -= 5     # score = score - 5  → 115  
score *= 2     # score = score * 2  → 230
score /= 10    # score = score / 10 → 23.0
score //= 3    # score = score // 3 → 7.0
score %= 4     # score = score % 4  → 3.0
score **= 2    # score = score ** 2 → 9.0

print(f"ציון סופי: {score}")

# עם משתנים אחרים
bonus = 50
score += bonus  # הוספת בונוס
print(f"עם בונוס: {score}")
</code></pre>
                    </div>

                    <h4>📝 השמה עם מחרוזות:</h4>
                    <div class="code-example">
                        <pre><code># חיבור מחרוזות
message = "שלום"
message += " עולם"
message += "!"
print(message)  # "שלום עולם!"

# הכפלת מחרוזת
pattern = "-"
pattern *= 20
print(pattern)  # "--------------------"

# בניית מחרוזת מורכבת
greeting = "היי "
name = "דני"
greeting += name
greeting += ", איך אתה?"
print(greeting)  # "היי דני, איך אתה?"

# דרך יותר יעילה עם f-strings
name = "רונה"
greeting = f"היי {name}, איך את?"
print(greeting)
</code></pre>
                    </div>

                    <h4>📊 דוגמאות מעשיות:</h4>
                    <div class="code-example">
                        <pre><code># מונה פשוט
count = 0
for i in range(5):
    count += 1
    print(f"ספירה: {count}")

# חישוב עלות עם מע\"מ
price = 100
tax_rate = 0.17
price *= (1 + tax_rate)  # price = price * 1.17
print(f"מחיר עם מע\"מ: {price:.2f}")

# צבירת נקודות במשחק
points = 0
level = 1

# שלב 1
points += 100
print(f"שלב {level}: {points} נקודות")

# שלב 2 - בונוס כפול
level += 1
level_bonus = 50
points += level_bonus * level
print(f"שלב {level}: {points} נקודות")

# הכפלת נקודות בסוף המשחק
points *= 1.5
print(f"נקודות סופיות: {int(points)}")
</code></pre>
                    </div>

                    <h4>🔄 דוגמה לקאונטר:</h4>
                    <div class="code-example">
                        <pre><code># מערכת קאונטר עם פעולות שונות
counter = 0
print(f"התחלה: {counter}")

# הוספות
counter += 1    # +1
counter += 5    # +5
counter += 10   # +10
print(f"אחרי הוספות: {counter}")  # 16

# כפל
counter *= 2
print(f"אחרי כפל ב-2: {counter}")  # 32

# חיסור
counter -= 7
print(f"אחרי חיסור 7: {counter}")  # 25

# חילוק
counter //= 5   # חילוק שלם
print(f"אחרי חילוק ב-5: {counter}")  # 5

# איפוס
counter = 0
print(f"לאחר איפוס: {counter}")

# שימוש במשתנה עזר
increment = 3
counter += increment
print(f"לאחר הוספת {increment}: {counter}")
</code></pre>
                    </div>

                    <h4>💡 טיפים חשובים:</h4>
                    <ul>
                        <li><strong>קריאות:</strong> x += 1 יותר קריא מ-x = x + 1</li>
                        <li><strong>ביצועים:</strong> עם רשימות ומחרוזות ארוכות, += יעיל יותר</li>
                        <li><strong>זהירות:</strong> counter += "5" שונה מ-counter += 5</li>
                        <li><strong>השמה מרובה:</strong> השתמש בה בחכמה - לא תמיד ברורה</li>
                    </ul>
                </div>
            `
        },
        'if-statements': {
            title: '🔀 הוראות תנאי (if)',
            content: `
                <div class="concept-detail">
                    <h3>🔀 הוראות תנאי</h3>
                    <p>הוראות if מאפשרות להריץ קוד רק כשתנאי מסוים מתקיים.</p>
                    
                    <h4>📋 מבנה בסיסי:</h4>
                    <div class="code-example">
                        <pre><code># מבנה בסיסי של if
if condition:
    # קוד שירוץ אם התנאי נכון
    print("התנאי נכון!")

# דוגמה
age = 18
if age >= 18:
    print("אתה בגיר!")
</code></pre>
                    </div>

                    <h4>🔄 if-else:</h4>
                    <div class="code-example">
                        <pre><code># if עם else
age = 16
if age >= 18:
    print("אתה בגיר!")
else:
    print("אתה קטין")

# דוגמה נוספת
score = 85
if score >= 60:
    print("עברת את המבחן")
else:
    print("נכשלת במבחן")
</code></pre>
                    </div>

                    <h4>🎯 if-elif-else:</h4>
                    <div class="code-example">
                        <pre><code># מספר תנאים עם elif
grade = 85

if grade >= 90:
    print("ציון מעולה! A")
elif grade >= 80:
    print("ציון טוב מאוד! B")
elif grade >= 70:
    print("ציון טוב! C")
elif grade >= 60:
    print("ציון עובר! D")
else:
    print("ציון נכשל! F")

# דוגמה לבדיקת מזג אויר
weather = "גשום"
if weather == "שמש":
    print("יום נהדר לטיול!")
elif weather == "עננים":
    print("אולי כדאי לקחת מטריה")
elif weather == "גשום":
    print("הישארו בבית!")
else:
    print("מזג אוויר לא ידוע")
</code></pre>
                    </div>

                    <h4>🎪 תנאים מקוננים:</h4>
                    <div class="code-example">
                        <pre><code># תנאים אחד בתוך השני
age = 20
has_license = True

if age >= 18:
    print("אתה בגיר")
    if has_license:
        print("אתה יכול לנהוג!")
    else:
        print("אבל אין לך רישיון נהיגה")
else:
    print("אתה קטין, לא יכול לנהוג")
</code></pre>
                    </div>

                    <h4>🔗 תנאים מורכבים:</h4>
                    <div class="code-example">
                        <pre><code># שימוש באופרטורים לוגיים
age = 25
income = 5000

# שימוש ב-and
if age >= 18 and income >= 3000:
    print("זכאי להלוואה")

# שימוש ב-or
day = "שבת"
if day == "שבת" or day == "יום ראשון":
    print("סוף שבוע!")

# שימוש ב-not
is_raining = False
if not is_raining:
    print("אפשר לצאת החוצה")
</code></pre>
                    </div>

                    <h4>💡 טיפים חשובים:</h4>
                    <ul>
                        <li><strong>Colon:</strong> זיכרו את ה-colon (:) בסוף כל if/elif/else</li>
                        <li><strong>Indentation:</strong> השתמשו ב-indentation (רווחים) לסימון בלוק הקוד</li>
                        <li><strong>elif:</strong> elif = else + if (בדיקת תנאי נוסף)</li>
                        <li><strong>אופציונלי:</strong> else תמיד אחרון ואופציונלי</li>
                        <li><strong>גמישות:</strong> אפשר לכתוב if בלי else</li>
                        <li><strong>תנאים מורכבים:</strong> and, or, not</li>
                    </ul>
                </div>
            `
        },
        'for-loops': {
            title: '🔁 לולאת for',
            content: `
                <div class="concept-detail">
                    <h3>🔁 לולאת for</h3>
                    <p>לולאת for מאפשרת לחזור על פעולות מספר פעמים או על אלמנטים ברשימה.</p>
                    
                    <h4>📋 מעבר על רשימה:</h4>
                    <div class="code-example">
                        <pre><code># מעבר על רשימת מספרים
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(f"המספר הוא: {num}")

# מעבר על רשימת שמות
names = ["אחמד", "יוסף", "מרים", "דנה"]
for name in names:
    print(f"שלום {name}!")

# מעבר על מחרוזת
word = "פייתון"
for letter in word:
    print(f"האות: {letter}")
</code></pre>
                    </div>

                    <h4>🎯 שימוש ב-range():</h4>
                    <div class="code-example">
                        <pre><code># range(n) - מ-0 עד n-1
for i in range(5):
    print(f"ספירה: {i}")  # 0, 1, 2, 3, 4

# range(start, stop) - מ-start עד stop-1
for i in range(2, 8):
    print(f"מספר: {i}")  # 2, 3, 4, 5, 6, 7

# range(start, stop, step) - עם קפיצות
for i in range(0, 10, 2):
    print(f"זוגי: {i}")  # 0, 2, 4, 6, 8

# ספירה לאחור
for i in range(10, 0, -1):
    print(f"ספירה לאחור: {i}")  # 10, 9, 8...1
</code></pre>
                    </div>

                    <h4>📊 enumerate() - אינדקס וערך:</h4>
                    <div class="code-example">
                        <pre><code># קבלת אינדקס וערך יחד
fruits = ["תפוח", "בננה", "תפוז"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: תפוח
# 1: בננה  
# 2: תפוז

# התחלה מאינדקס אחר
for index, fruit in enumerate(fruits, 1):
    print(f"{index}. {fruit}")
# 1. תפוח
# 2. בננה
# 3. תפוז
</code></pre>
                    </div>

                    <h4>⏹️ break ו-continue:</h4>
                    <div class="code-example">
                        <pre><code># break - יציאה מהלולאה
for i in range(10):
    if i == 5:
        break  # עוצר את הלולאה כשi=5
    print(i)  # ידפיס: 0, 1, 2, 3, 4

# continue - דילוג על איטרציה נוכחית
for i in range(10):
    if i % 2 == 0:  # אם זוגי
        continue  # דלג על השאר
    print(i)  # ידפיס רק אי-זוגיים: 1, 3, 5, 7, 9
</code></pre>
                    </div>

                    <h4>💡 דוגמאות מעשיות:</h4>
                    <div class="code-example">
                        <pre><code># חישוב סכום
numbers = [10, 20, 30, 40, 50]
total = 0
for num in numbers:
    total += num
print(f"הסכום: {total}")  # 150

# יצירת רשימה חדשה
numbers = [1, 2, 3, 4, 5]
squares = []
for num in numbers:
    squares.append(num ** 2)
print(squares)  # [1, 4, 9, 16, 25]

# יצירת דפוס
for i in range(5):
    print("*" * (i + 1))
# *
# **
# ***
# ****
# *****
</code></pre>
                    </div>

                    <h4>💡 טיפים חשובים:</h4>
                    <ul>
                        <li><strong>for in:</strong> עובר על כל אלמנט ברשימה</li>
                        <li><strong>range():</strong> יוצר רצף מספרים</li>
                        <li><strong>enumerate():</strong> נותן אינדקס + ערך</li>
                        <li><strong>break:</strong> יוצא מהלולאה</li>
                        <li><strong>continue:</strong> דולג לאיטרציה הבאה</li>
                        <li><strong>else בלולאה:</strong> רק אם לא היה break</li>
                    </ul>
                </div>
            `
        },
        'while-loops': {
            title: '🔄 לולאת while',
            content: `
                <div class="concept-detail">
                    <h3>🔄 לולאת while</h3>
                    <p>לולאת while רצה כל עוד תנאי מסוים נכון. שימושית כשלא יודעים כמה איטרציות נצטרך.</p>
                    
                    <h4>📋 מבנה בסיסי:</h4>
                    <div class="code-example">
                        <pre><code># מבנה בסיסי
while condition:
    # קוד שירוץ כל עוד התנאי נכון
    # חשוב לעדכן את התנאי!

# דוגמה פשוטה
count = 0
while count < 5:
    print(f"ספירה: {count}")
    count += 1  # חשוב! עדכון התנאי

print("סיימנו!")  # ירוץ אחרי הלולאה
</code></pre>
                    </div>

                    <h4>🎯 דוגמאות בסיסיות:</h4>
                    <div class="code-example">
                        <pre><code># ספירה לאחור
countdown = 5
while countdown > 0:
    print(f"עוד {countdown} שניות...")
    countdown -= 1
print("זמן!")

# חיבור מספרים
total = 0
num = 1
while num <= 10:
    total += num
    num += 1
print(f"סכום 1-10: {total}")  # 55

# כפל ב-2 עד שמגיעים ל-100
value = 1
while value < 100:
    print(value)
    value *= 2
print(f"העבר את 100: {value}")  # 128
</code></pre>
                    </div>

                    <h4>🎮 אינטראקציה עם משתמש:</h4>
                    <div class="code-example">
                        <pre><code># משחק ניחוש
import random
target = random.randint(1, 10)
guess = 0

while guess != target:
    guess = int(input("נחש מספר בין 1-10: "))
    if guess < target:
        print("נמוך מדי!")
    elif guess > target:
        print("גבוה מדי!")
    else:
        print("כל הכבוד! ניחשת נכון!")

# תפריט
choice = ""
while choice != "יציאה":
    print("1. הוסף")
    print("2. הסר") 
    print("3. הצג")
    print("יציאה - לסיום")
    choice = input("בחר אפשרות: ")
    
    if choice == "1":
        print("הוספת פריט")
    elif choice == "2":
        print("הסרת פריט")
    elif choice == "3":
        print("הצגת רשימה")
    elif choice != "יציאה":
        print("אפשרות לא חוקית!")
</code></pre>
                    </div>

                    <h4>⚠️ הימנעות מלולאה אינסופית:</h4>
                    <div class="code-example">
                        <pre><code># שגוי - לולאה אינסופית!
# count = 0
# while count < 5:
#     print(count)
#     # שכחנו להגדיל את count!

# נכון - עם עדכון התנאי
count = 0
while count < 5:
    print(count)
    count += 1  # עדכון חשוב!

# עם מגבלת איטרציות (בטיחות)
tries = 0
max_tries = 3
password = ""

while password != "1234" and tries < max_tries:
    password = input("הכנס סיסמה: ")
    tries += 1
    if password != "1234":
        print(f"סיסמה שגויה! נותרו {max_tries - tries} ניסיונות")

if password == "1234":
    print("התחברת בהצלחה!")
else:
    print("חרגת ממספר הניסיונות המותר")
</code></pre>
                    </div>

                    <h4>⏹️ break ו-continue ב-while:</h4>
                    <div class="code-example">
                        <pre><code># break - יציאה מוקדמת
count = 0
while True:  # לולאה אינסופית
    count += 1
    if count == 5:
        break  # יוצא כש-count=5
    print(count)

# continue - דילוג
num = 0
while num < 10:
    num += 1
    if num % 2 == 0:  # זוגי
        continue  # דלג על הדפסה
    print(f"אי-זוגי: {num}")
</code></pre>
                    </div>

                    <h4>💡 טיפים חשובים:</h4>
                    <ul>
                        <li><strong>עדכון התנאי:</strong> תמיד וודאו שהתנאי יכול להשתנות!</li>
                        <li><strong>עדכון משתנים:</strong> עדכנו משתנים בתוך הלולאה</li>
                        <li><strong>בטיחות:</strong> השתמשו במגבלת איטרציות לבטיחות</li>
                        <li><strong>while True:</strong> while True + break = לולאה עד תנאי</li>
                        <li><strong>continue:</strong> דולג לבדיקת התנאי</li>
                        <li><strong>else ב-while:</strong> רק אם לא היה break</li>
                    </ul>
                </div>
            `
        },
        'functions': {
            title: '🔧 פונקציות',
            content: `
                <div class="concept-detail">
                    <h3>🔧 פונקציות</h3>
                    <p>פונקציות מאפשרות לארגן קוד לבלוקים הניתנים לשימוש חוזר, מה שהופך את הקוד לנקי ויעיל יותר.</p>
                    
                    <h4>📋 הגדרת פונקציה בסיסית:</h4>
                    <div class="code-example">
                        <pre><code># מבנה בסיסי של פונקציה
def function_name():
    # קוד הפונקציה
    print("זו פונקציה!")

# קריאה לפונקציה
function_name()

# דוגמה פשוטה
def greet():
    print("שלום!")
    print("איך הולך?")

greet()  # יפעיל את הפונקציה
</code></pre>
                    </div>

                    <h4>📝 פונקציות עם פרמטרים:</h4>
                    <div class="code-example">
                        <pre><code># פונקציה עם פרמטר אחד
def greet_person(name):
    print(f"שלום {name}!")

greet_person("יוסי")
greet_person("מרים")

# פונקציה עם מספר פרמטרים
def add_numbers(a, b):
    result = a + b
    print(f"{a} + {b} = {result}")

add_numbers(5, 3)
add_numbers(10, 20)

# פונקציה עם פרמטרי ברירת מחדל
def greet_with_time(name, time="בוקר"):
    print(f"{time} טוב, {name}!")

greet_with_time("דני")          # יחכה "בוקר טוב, דני!"
greet_with_time("שרה", "לילה")  # יחכה "לילה טוב, שרה!"
</code></pre>
                    </div>

                    <h4>↩️ החזרת ערכים עם return:</h4>
                    <div class="code-example">
                        <pre><code># פונקציה שמחזירה ערך
def add(a, b):
    return a + b

result = add(5, 3)
print(f"התוצאה: {result}")  # 8

# פונקציה שמחזירה מספר ערכים
def calculate(a, b):
    sum_result = a + b
    diff_result = a - b
    return sum_result, diff_result

sum_val, diff_val = calculate(10, 3)
print(f"חיבור: {sum_val}, חיסור: {diff_val}")

# פונקציה עם תנאי return
def divide(a, b):
    if b == 0:
        return "שגיאה: חלוקה באפס!"
    return a / b

print(divide(10, 2))  # 5.0
print(divide(10, 0))  # שגיאה: חלוקה באפס!
</code></pre>
                    </div>

                    <h4>📚 דוגמאות מעשיות:</h4>
                    <div class="code-example">
                        <pre><code># פונקציית חישוב שטח מעגל
import math

def circle_area(radius):
    return math.pi * radius ** 2

area = circle_area(5)
print(f"שטח המעגל: {area:.2f}")

# פונקציית בדיקת גיל
def check_age_category(age):
    if age < 13:
        return "ילד"
    elif age < 20:
        return "נוער"
    elif age < 65:
        return "מבוגר"
    else:
        return "גמלאי"

category = check_age_category(25)
print(f"קטגוריה: {category}")

# פונקציית חישוב ממוצע
def calculate_average(numbers):
    if len(numbers) == 0:
        return 0
    return sum(numbers) / len(numbers)

grades = [85, 92, 78, 88, 91]
avg = calculate_average(grades)
print(f"ממוצע: {avg:.1f}")
</code></pre>
                    </div>

                    <h4>🔧 סוגי פרמטרים מתקדמים:</h4>
                    <div class="code-example">
                        <pre><code># *args - מספר משתנה של ארגומנטים
def sum_all(*numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2, 3))        # 6
print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs - מילות מפתח משתנות
def create_profile(**info):
    print("פרופיל המשתמש:")
    for key, value in info.items():
        print(f"{key}: {value}")

create_profile(name="דני", age=28, job="מתכנת", city="ירושלים")

# פונקציות lambda (קצרות)
square = lambda x: x ** 2
print(square(4))  # 16

add = lambda a, b: a + b
print(add(3, 7))  # 10
</code></pre>
                    </div>

                    <h4>💡 טיפים חשובים:</h4>
                    <ul>
                        <li><strong>שמות ברורים:</strong> השתמשו בשמות ברורים לפונקציות</li>
                        <li><strong>משימה אחת:</strong> פונקציה צריכה לעשות דבר אחד טוב</li>
                        <li><strong>תיעוד:</strong> הוסיפו docstring לפונקציות מורכבות</li>
                        <li><strong>return:</strong> return מסיים את הפונקציה מיד</li>
                        <li><strong>משתנים מקומיים:</strong> משתנים בפונקציה הם מקומיים</li>
                        <li><strong>*args ו-**kwargs:</strong> לגמישות</li>
                </div>
            `
        },
        'lists': {
            title: '📋 רשימות (list)',
            content: `
                <div class="concept-detail">
                    <h3>📋 רשימות (list)</h3>
                    <p>רשימות הן אוספים מסודרים של אלמנטים שניתן לשנות. הן אחד מטיפוסי הנתונים השימושיים ביותר בפייתון.</p>
                    
                    <h4>🎯 יצירת רשימות:</h4>
                    <div class="code-example">
                        <pre><code># רשימה ריקה
empty_list = []
names = ["אחמד", "יוסף", "מרים", "דנה"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "שלום", 3.14, True]

# גישה לאלמנטים
print(names[0])     # "אחמד"
print(names[-1])    # "דנה" (האחרון)

# הוספת אלמנטים
names.append("שרה")
names.insert(1, "עלי")

# מחיקת אלמנטים
names.remove("יוסף")
last = names.pop()

print(f"רשימת שמות: {names}")
</code></pre>
                    </div>

                    <h4>💡 טיפים חשובים:</h4>
                    <ul>
                        <li><strong>אינדקס:</strong> רשימות מתחילות מאינדקס 0</li>
                        <li><strong>מותר לשנות:</strong> רשימות הן mutable</li>
                        <li><strong>סוגים מעורבים:</strong> יכולה להכיל טיפוסים שונים</li>
                        <li><strong>אינדקס שלילי:</strong> -1 זה האחרון</li>
                    </ul>
                </div>
            `
        },
        'dictionaries': {
            title: '🗂️ מילונים (dict)',
            content: `
                <div class="concept-detail">
                    <h3>🗂️ מילונים (dict)</h3>
                    <p>מילונים הם אוספים של זוגות מפתח-ערך, המאפשרים אחסון וגישה מהירה למידע.</p>
                    
                    <h4>🎯 יצירת מילונים:</h4>
                    <div class="code-example">
                        <pre><code># יצירת מילון
student = {
    "name": "יוסי",
    "age": 20,
    "grade": 85
}

# גישה לערכים
print(student["name"])        # "יוסי"
print(student.get("age"))     # 20

# הוספה ועדכון
student["city"] = "תל אביב"
student["age"] = 21

# מחיקה
del student["grade"]

# לולאה על מילון
for key, value in student.items():
    print(f"{key}: {value}")
</code></pre>
                    </div>

                    <h4>💡 טיפים חשובים:</h4>
                    <ul>
                        <li><strong>מפתחות ייחודיים:</strong> כל מפתח מופיע פעם אחת</li>
                        <li><strong>גישה בטוחה:</strong> השתמשו ב-get() למניעת שגיאות</li>
                        <li><strong>ביצועים:</strong> גישה למפתח מהירה מאוד</li>
                        <li><strong>סוגי מפתחות:</strong> מחרוזות, מספרים, tuples</li>
                    </ul>
                </div>
            `
        },
        'type-conversion': {
            title: '🔄 המרת טיפוסים',
            content: `
                <div class="concept-detail">
                    <h3>🔄 המרת טיפוסים</h3>
                    <p>המרת טיפוסים מאפשרת להמיר נתונים מסוג אחד לסוג אחר.</p>
                    
                    <h4>🎯 המרות בסיסיות:</h4>
                    <div class="code-example">
                        <pre><code># המרה למספר שלם
age_str = "25"
age_int = int(age_str)     # 25

# המרה למספר עשרוני
price_str = "19.99"
price_float = float(price_str)  # 19.99

# המרה למחרוזת
number = 42
number_str = str(number)   # "42"

# המרה לבוליאני
print(bool(1))      # True
print(bool(0))      # False
print(bool(""))     # False
print(bool("שלום")) # True

# בדיקת טיפוס
print(type(age_int))    # <class 'int'>
print(isinstance(age_int, int))  # True
</code></pre>
                    </div>

                    <h4>⚠️ טיפול בשגיאות:</h4>
                    <div class="code-example">
                        <pre><code># המרה בטוחה
def safe_int(text):
    try:
        return int(text)
    except ValueError:
        print(f"לא ניתן להמיר '{text}' למספר")
        return None

result = safe_int("42")    # 42
result = safe_int("abc")   # None + הודעה
</code></pre>
                    </div>

                    <h4>💡 טיפים חשובים:</h4>
                    <ul>
                        <li><strong>בדיקת תקינות:</strong> בדקו שההמרה אפשרית</li>
                        <li><strong>טיפול בשגיאות:</strong> השתמשו ב-try/except</li>
                        <li><strong>int() חותך:</strong> מ-float ל-int חותך עשרוניות</li>
                        <li><strong>bool():</strong> רק 0 ורשימה ריקה הם False</li>
                    </ul>
                </div>
            `
        }
    };

    if (conceptData[conceptId]) {
        showModal(conceptData[conceptId].title, conceptData[conceptId].content);
    }
}

// Hebrew Text Display Verification for Quizzes
function verifyHebrewDisplayInQuiz() {
    console.log('🔍 Verifying Hebrew text display in quiz system...');
    
    // Test Hebrew characters
    const hebrewTestText = 'בדיקת תצוגת עברית - שאלות ותשובות במבחן';
    const arabicTestText = 'اختبار النص العربي';
    
    console.log('Hebrew test:', hebrewTestText);
    console.log('Character encoding test:', hebrewTestText.charCodeAt(0)); // Should be > 1400 for Hebrew
    
    // Check if document has proper encoding
    const encoding = document.characterSet || document.charset;
    if (encoding === 'UTF-8') {
        console.log('✅ Document encoding is UTF-8');
    } else {
        console.warn('⚠️ Document encoding is not UTF-8:', encoding);
    }
    
    // Check if Hebrew fonts are loaded
    const testElement = document.createElement('div');
    testElement.innerHTML = hebrewTestText;
    testElement.style.cssText = `
        position: absolute;
        left: -9999px;
        font-family: 'Heebo', 'Noto Sans Hebrew', Arial, sans-serif;
        font-size: 16px;
        direction: rtl;
    `;
    document.body.appendChild(testElement);
    
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(testElement);
        const fontFamily = computedStyle.fontFamily;
        
        if (fontFamily.includes('Heebo') || fontFamily.includes('Noto Sans Hebrew')) {
            console.log('✅ Hebrew fonts are properly loaded:', fontFamily);
        } else {
            console.warn('⚠️ Hebrew fonts may not be loaded properly:', fontFamily);
        }
        
        document.body.removeChild(testElement);
    }, 500);
    
    // Test quiz-specific elements if they exist
    setTimeout(() => {
        const quizElements = document.querySelectorAll('.quiz-container, .option-btn, .question h4');
        if (quizElements.length > 0) {
            console.log('✅ Quiz elements found, checking Hebrew support...');
            quizElements.forEach((element, index) => {
                const style = window.getComputedStyle(element);
                if (style.direction === 'rtl' && style.fontFamily.includes('Heebo')) {
                    console.log(`✅ Quiz element ${index + 1} has proper Hebrew support`);
                } else {
                    console.warn(`⚠️ Quiz element ${index + 1} may have Hebrew display issues`);
                }
            });
        }
    }, 1000);
}

// Run Hebrew verification when page loads
$(document).ready(function() {
    setTimeout(verifyHebrewDisplayInQuiz, 2000);
});

// Export verification function for manual testing
window.verifyHebrewDisplayInQuiz = verifyHebrewDisplayInQuiz;
