// Bu kod, tüm sayfa yüklendikten sonra çalışmaya başlar.
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobil menü (hamburger) mantığı ---
    const hamburger = document.querySelector('.hamburger'); // CSS'teki .hamburger class'ını bul
    const navLinks = document.querySelector('.nav-links'); // .nav-links'i bul
    const userArea = document.querySelector('.user-area'); // .user-area'yı bul

    // Hamburger ikonuna tıklandığında ne olacağını belirle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Gerekli elemanlara 'active' class'ı ekleyip çıkararak menüyü görünür/gizli yap
            hamburger.classList.toggle('active');
            if (navLinks) navLinks.classList.toggle('active');
            if (userArea) userArea.classList.toggle('active');
        });
    }

    // --- Farkındalık Testi Mantığı ---
    const quizContainer = document.getElementById('quiz-container');
    // Sadece test sayfasındaysak bu kodları çalıştır
    if (quizContainer) {
        const questions = [
            {
                question: "Zor bir günün ardından rahatlamak için ilk aklına gelen şey nedir?",
                answers: [
                    { text: "Biriyle konuşmak veya yürüyüşe çıkmak.", score: 0 },
                    { text: "Müzik dinlemek veya bir şeyler izlemek.", score: 1 },
                    { text: "Saatlerce sosyal medyada gezinmek veya oyun oynamak.", score: 2 },
                    { text: "Canım sıkkın olduğunda ne yaptığımı pek düşünmem.", score: 3 }
                ]
            },
            {
                question: "Bir arkadaşın mesajına hemen cevap vermediğinde ne hissedersin?",
                answers: [
                    { text: "Müsait olduğunda döneceğini bilir, sakince beklerim.", score: 0 },
                    { text: "Biraz endişelenirim ama aklıma takmamaya çalışırım.", score: 1 },
                    { text: "Kötü bir şey olduğunu düşünüp sürekli telefonumu kontrol ederim.", score: 2 },
                    { text: "Bana değer vermediğini düşünür, üzülürüm.", score: 3 }
                ]
            },
            {
                question: "Yeni bir diziye başladığında veya oyun aldığında uyku düzenin nasıl etkilenir?",
                answers: [
                    { text: "Uyku saatlerime sadık kalırım, ertesi gün devam ederim.", score: 0 },
                    { text: "Biraz geciktiririm ama abartmam.", score: 1 },
                    { text: "Sık sık 'bir bölüm daha' diyerek uykusuz kalırım.", score: 2 },
                    { text: "Bitirene kadar uyumadığım olur.", score: 3 }
                ]
            },
             {
                question: "Sosyal çevrenle planların, dijitaldeki bir aktivite (örn: online oyun turnuvası) yüzünden iptal olur mu?",
                answers: [
                    { text: "Asla, gerçek hayattaki planlarım önceliklidir.", score: 0 },
                    { text: "Nadiren, çok önemli bir şeyse olabilir.", score: 1 },
                    { text: "Bazen arkadaşlarımı eklemek zorunda kalırım.", score: 2 },
                    { text: "Sıklıkla dijital aktiviteleri tercih ederim.", score: 3 }
                ]
            },
             {
                question: "Kendini değerli hissetmek için neye ihtiyaç duyarsın?",
                answers: [
                    { text: "Kendi hedeflerime ulaştığımda kendimi değerli hissederim.", score: 0 },
                    { text: "Arkadaşlarımın ve ailemin sevgisine.", score: 1 },
                    { text: "Sosyal medyada aldığım beğenilere ve yorumlara.", score: 2 },
                    { text: "Belirli bir kişinin (arkadaş, sevgili) ilgisine ve onayına.", score: 3 }
                ]
            }
        ];

        let currentQuestionIndex = 0;
        let userScore = 0;

        const questionContainer = document.getElementById('question-container');
        const nextBtn = document.getElementById('next-btn');
        const progressBar = document.getElementById('progress-bar');
        const resultContainer = document.getElementById('result-container');

        function displayQuestion() {
            const currentQuestion = questions[currentQuestionIndex];
            const progress = ((currentQuestionIndex) / questions.length) * 100;
            progressBar.style.width = `${progress}%`;

            questionContainer.innerHTML = `
                <p>${currentQuestion.question}</p>
                <div class="options">
                    ${currentQuestion.answers.map((answer, index) => `
                        <button class="option" data-score="${answer.score}">${answer.text}</button>
                    `).join('')}
                </div>
            `;

            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', (e) => {
                    document.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
                    e.target.classList.add('selected');
                    nextBtn.dataset.score = e.target.dataset.score;
                });
            });
        }

        function showResults() {
            quizContainer.style.display = 'none';
            resultContainer.style.display = 'block';
            let resultHTML = '';

            if (userScore <= 4) {
                 resultHTML = `
                    <h2>Dengeli ve Farkında Bir Yaklaşım</h2>
                    <p>Harika! Alışkanlıkların ve duygusal ihtiyaçların arasında sağlıklı bir denge kurmuş görünüyorsun. Kendi değerinin farkındasın ve ilişkilerini bu temel üzerine inşa ediyorsun. Bu farkındalığını korumak ve çevrendekilere de ilham vermek çok değerli.</p>
                    <a href="/etkinlikler" class="cta-button">Projelerimize Göz At</a>
                `;
            } else if (userScore <= 9) {
                resultHTML = `
                    <h2>Güçlü Bağlar ve Arayışlar</h2>
                    <p>İnsanlarla derin bağlar kurmayı ve seni heyecanlandıran dünyalara dalmayı seviyorsun. Bu, harika bir özellik! Bazen bu arayışta dengeyi kaçırdığını hissedebilirsin. Hangi davranışının hangi ihtiyacını karşıladığını fark etmek, kontrolü elinde tutmanın ilk adımıdır.</p>
                    <a href="/yardim" class="cta-button">Destek Noktaları</a>
                `;
            } else {
                resultHTML = `
                    <h2>Yoğun Duygular ve Yüksek Beklentiler</h2>
                    <p>Duyguları yoğun yaşayan ve ilişkilerinde yüksek bir bağlılık arayan bir yapın var. Bu durum, bazen kendini veya sorumluluklarını ihmal etmene neden olabilir. Unutma, en önemli ilişki kendinle kurduğun ilişkidir. Kendine şefkat göstermek ve destek aramak, seni daha da güçlendirir.</p>
                    <a href="/yardim" class="cta-button secondary">Yalnız Değilsin, Destek Al</a>
                `;
            }
            resultContainer.innerHTML = resultHTML;
        }

        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                const selectedOption = document.querySelector('.option.selected');
                if (!selectedOption) {
                    alert('Lütfen bir seçenek belirleyin.');
                    return;
                }

                userScore += parseInt(selectedOption.dataset.score);
                currentQuestionIndex++;

                if (currentQuestionIndex < questions.length) {
                    displayQuestion();
                } else {
                    showResults();
                }
            });
        }

        displayQuestion();
    }
});
