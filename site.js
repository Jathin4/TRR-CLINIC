// Shared behaviour for every page of the clinic website.

// ── TIMINGS: edit here and they update everywhere (service cards, doctor pages, pharmacy popup).
// Leave a value empty ("") to show "Call 91772 56111 for timings".
const TIMINGS = {
  psy: "Evening · 5:00 PM – 9:00 PM",   // Dr. Tetali Rama Reddy – Psychiatry
  ent: "Evening · 5:00 PM – 9:00 PM",   // Dr. Bobba Rachana – ENT
  rx:  "4:00 PM – 10:00 PM",            // In-clinic pharmacy
};
// ── FEEDBACK → Google Form (responses collect in the linked Google Sheet → download as Excel).
// Fill these from your form's pre-filled link (see setup steps). Until set, the form shows a notice.
const FEEDBACK_FORM = {
  action:  "",   // e.g. "https://docs.google.com/forms/d/e/1FAIpQLS.../formResponse"
  name:    "",   // e.g. "entry.123456789"   (the "Patient name" question)
  message: "",   // e.g. "entry.987654321"   (the "Feedback" question)
};
const CLINIC_PHONE = "91772 56111";
const CLINIC_LATLNG = "16.929583,81.957667";

document.querySelectorAll("[data-timing]").forEach(el => {
  el.textContent = TIMINGS[el.dataset.timing] || `Call ${CLINIC_PHONE} for timings`;
});

const yr = document.getElementById("yr");
if (yr) yr.textContent = new Date().getFullYear();

// ── Popups: any element with data-open="dialog-id" opens that <dialog>
document.querySelectorAll("[data-open]").forEach(btn =>
  btn.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById(btn.dataset.open)?.showModal();
  }));
// ── Clock buttons (data-timepop="psy|ent|rx") show that service's timings in #timing-pop
const timingPop = document.getElementById("timing-pop");
document.querySelectorAll("[data-timepop]").forEach(btn =>
  btn.addEventListener("click", () => {
    timingPop.querySelector("h3").textContent = btn.dataset.title;
    timingPop.querySelector(".time-big span").textContent =
      TIMINGS[btn.dataset.timepop] || `Call ${CLINIC_PHONE} for timings`;
    timingPop.showModal();
  }));
document.querySelectorAll("dialog").forEach(d => {
  d.addEventListener("click", e => { if (e.target === d) d.close(); });           // click outside closes
  d.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => d.close()));
});

// ── Feedback form: posts straight to Google Forms (nothing is stored on this website)
const fbForm = document.getElementById("feedback-form");
fbForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const f = fbForm.elements, msg = document.getElementById("fb-msg");
  const show = (text, ok) => { msg.textContent = text; msg.className = "fb-msg " + (ok ? "ok" : "bad"); msg.hidden = false; };
  if (f.website.value) return;                                    // hidden field: only bots fill it
  const name = f.name.value.trim(), text = f.message.value.trim();
  if (!name || !text) return show("Please enter your name and your feedback.", false);
  if (!FEEDBACK_FORM.action) return show(`Feedback is not connected yet. Please call ${CLINIC_PHONE}.`, false);

  const btn = fbForm.querySelector("button[type=submit]");
  btn.disabled = true;
  const body = new FormData();
  body.append(FEEDBACK_FORM.name, name);
  body.append(FEEDBACK_FORM.message, text);
  try {
    // Google Forms doesn't allow reading the reply from another site ("no-cors"), so success = request sent.
    await fetch(FEEDBACK_FORM.action, { method: "POST", mode: "no-cors", body });
    fbForm.reset();
    show("Thank you! Your feedback has been sent to the clinic.", true);
  } catch {
    show(`Couldn't send right now. Please check your internet and try again, or call ${CLINIC_PHONE}.`, false);
  } finally {
    btn.disabled = false;
  }
});

// ── How to reach: Google Maps directions from the visitor's town (train/bus links are plain <a>)
const reachForm = document.getElementById("reach-form");
reachForm?.addEventListener("submit", e => {
  e.preventDefault();
  const from = reachForm.elements.from.value.trim();
  const url = "https://www.google.com/maps/dir/?api=1&destination=" + CLINIC_LATLNG +
    (from ? "&origin=" + encodeURIComponent(from) : "");
  window.open(url, "_blank", "noopener");
});
