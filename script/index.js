const createElement = (arr) => {
    const htmlElements = arr.map(el => `
    <span class="btn">${el}</span>
    `)
    return (htmlElements.join());
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById('loading').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')

    }
    else {
        document.getElementById('loading').classList.add('hidden')
        document.getElementById('word-container').classList.remove('hidden')
    }
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')  // promise of rssponce 
        .then(res => res.json()) // promise of json 
        .then(json => displayLesson(json.data));

}
const loadLevelWord = (id) => {
    manageSpinner(true)
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive()
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            // console.log(clickBtn);
            clickBtn.classList.add('active')
            displayLevelWord(data.data)
        }
            // console.log(url);
        )
};

const removeActive = () => {
    const lessonButtons = document.querySelectorAll('.lesson-btn')
    // lessonButtons.classList.remove('active')
    lessonButtons.forEach(btn => btn.classList.remove('active'))
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    // console.log(url);
    // fetch(url)
    const res = await fetch(url);
    const details = await res.json()
    // console.log(details);
    displayWordDetails(details.data)

}

const displayWordDetails = (word) => {
    // console.log(word);
    const detailsBox = document.getElementById('detailsContainer')
    detailsBox.innerHTML = `
    <div class="">
                    <h2 class="text-2xl font-bold">${word.word}(<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
                </div>
                <div class="">
                    <h2 class=" font-bold">Meaning</h2>
                    <p>${word.meaning}</p>
                </div>
                <div class="">
                    <h2 class="font-bold">Example</h2>
                    <p>${word.sentence}</p>
                </div>
                <div class="">
                    <h2 class="font-bold">synonms</h2>
                <div class="">
                       ${createElement(word.synonyms)}                 
                </div>
                </div>
    `
    document.getElementById('word_modal').showModal();
}

const displayLevelWord = (words) => {
    // console.log(words);
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = ''
    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class=" text-center col-span-full rounded-xl py-10 space-y-6">
        <img class="mx-auto" src="assets/alert-error.png" alt="">
            <p class="text-xl font-medium text-gray-400 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। </p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
        `
    manageSpinner(false);
        return
    }
    words.forEach(word => {
        // console.log(word);
        const card = document.createElement('div')
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-12 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word ? word.word : 'শব্দ পাওয়া যায়নি'}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>
            <p class="font-medium text-2xl font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"}"</p>
            <div class="flex justify-between items-center">
                <button onClick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.appendChild(card)
    });
    manageSpinner(false);
}
const displayLesson = (lessons) => {
    // console.log(lessons);
    // 1 . get the container & empty 
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";
    // 2 . get into evey lessons 
    for (let lesson of lessons) {
        // console.log(lesson);
        // 3 create Element 
        const btnDiv = document.createElement('div')
        btnDiv.innerHTML = `
     <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-primary btn-outline lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
     </button>
      `
        // 4 . append into container 
        levelContainer.appendChild(btnDiv)
    }
}
loadLessons()

document.getElementById('btn-search').addEventListener('click',() =>{
    removeActive()
    const input = document.getElementById('inpur-search');
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);
    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res =>res.json())
    .then(data =>{const allWords = data.data
        const filterWords = allWords.filter(word =>word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords)
    });
})