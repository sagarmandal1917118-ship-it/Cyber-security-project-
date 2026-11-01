// One question at a time, progress bar, countdown timer (auto-submits at 00:00)
(function () {
  const form = document.getElementById("quizForm");
  const blocks = Array.from(document.querySelectorAll(".question-block"));
  const timerEl = document.getElementById("timer");
  const bar = document.getElementById("progressBar");
  const label = document.getElementById("qLabel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  let index = 0;
  let seconds = parseInt(timerEl.dataset.seconds, 10) || 300;
  let timer = null;

  function show(i) {
    index = i;
    blocks.forEach((b, j) => b.classList.toggle("d-none", j !== i));
    label.textContent = "Question " + (i + 1) + " of " + blocks.length;
    bar.style.width = ((i + 1) / blocks.length * 100) + "%";
    prevBtn.disabled = i === 0;
    nextBtn.classList.toggle("d-none", i === blocks.length - 1);
    submitBtn.classList.toggle("d-none", i !== blocks.length - 1);
  }

  function tick() {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    timerEl.textContent = "\u23F1 " + m + ":" + s;
    timerEl.classList.toggle("low", seconds <= 60);
    if (seconds <= 0) {
      clearInterval(timer);
      form.submit();          // time is over: submit what has been answered
      return;
    }
    seconds--;
  }

  prevBtn.addEventListener("click", () => { if (index > 0) show(index - 1); });
  nextBtn.addEventListener("click", () => { if (index < blocks.length - 1) show(index + 1); });

  // highlight the chosen option
  form.addEventListener("change", function (e) {
    if (e.target.type !== "radio") return;
    const block = e.target.closest(".question-block");
    block.querySelectorAll(".option-item").forEach(l => l.classList.remove("selected"));
    e.target.closest(".option-item").classList.add("selected");
  });

  form.addEventListener("submit", function (e) {
    const answered = form.querySelectorAll("input[type=radio]:checked").length;
    if (answered < blocks.length && seconds > 0 &&
        !confirm("You have unanswered questions. Submit anyway?")) {
      e.preventDefault();
    }
  });

  show(0);
  tick();
  timer = setInterval(tick, 1000);
})();
