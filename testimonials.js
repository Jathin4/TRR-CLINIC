// Patient testimonials — the ONLY place to edit reviews and videos.
// Used by index.html (scrolling row) and testimonials.html (full page).
//
// Before publishing: replace the SAMPLE entries with real patient feedback,
// collected with the patient's consent (initials only for psychiatry patients),
// and set sample: false (or delete the line).

// dept: "psy" (Psychiatry), "ent" (ENT) or "rx" (Pharmacy)
const REVIEWS = [
  { name: "S. R.", place: "Anaparthi", dept: "psy", sample: true,
    text: "Doctor listened patiently and explained everything clearly. I felt comfortable from the very first visit." },
  { name: "K. Lakshmi", place: "Rajahmundry", dept: "ent", sample: true,
    text: "The endoscopy was quick and painless, and the doctor showed me exactly what was causing my sinus trouble." },
  { name: "V. K.", place: "Mandapeta", dept: "psy", sample: true,
    text: "Regular follow-ups made a real difference for our family member. Caring, respectful and always available to talk." },
  { name: "P. Ramesh", place: "Anaparthi", dept: "rx", sample: true,
    text: "Getting medicines right at the clinic saves us a trip. The staff explain dosage and timings very clearly." },
  { name: "M. Durga", place: "Biccavolu", dept: "ent", sample: true,
    text: "My child's ear problem was diagnosed properly after months of trouble. Very gentle with kids." },
  { name: "A. N.", place: "Anaparthi", dept: "psy", sample: true,
    text: "A calm, private setting where I never felt judged. Prior appointments mean almost no waiting." },
];

// Patient video testimonials (keep each under 1 minute — YouTube Shorts are ideal).
// youtube: paste the video link (youtube.com/shorts/…, youtu.be/…, watch?v=…) or just the ID.
// Leave youtube empty to show a "video coming soon" placeholder.
const VIDEOS = [
  { youtube: "", title: "Recovering with the right support", who: "Patient story", dept: "psy", sample: true },
  { youtube: "", title: "Finally breathing easy again", who: "Patient story", dept: "ent", sample: true },
  { youtube: "", title: "Caring follow-up for our family", who: "Family story", dept: "psy", sample: true },
  { youtube: "", title: "Clear answers about my hearing", who: "Patient story", dept: "ent", sample: true },
];

const DEPT = { psy: "Psychiatry", ent: "ENT", rx: "Pharmacy" };

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function reviewCard(r) {
  const card = el("article", "t-card" + (r.dept === "psy" ? "" : " " + r.dept));
  const stars = el("div", "t-stars", "★★★★★");
  stars.setAttribute("aria-label", "5 out of 5 stars");
  const who = el("div", "t-who");
  const id = el("div");
  id.append(el("b", null, r.name), el("small", null, r.place));
  who.append(el("span", "t-avatar", r.name.trim()[0] || "?"), id, el("span", "t-dept", DEPT[r.dept]));
  card.append(stars, el("blockquote", null, r.text), who);
  if (r.sample) card.append(el("span", "t-sample", "Sample – replace with real review"));
  return card;
}

function youtubeId(v) {
  const m = String(v || "").match(/(?:shorts\/|youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);
  return m ? m[1] : (/^[\w-]{11}$/.test(v) ? v : "");
}

const PLAY = '<svg class="icon" viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg>';
const FILM = '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m10 9 5 3-5 3z"/></svg>';

function videoCard(v) {
  const card = el("article", "v-card" + (v.dept === "psy" ? "" : " " + v.dept));
  const frame = el("div", "v-frame");
  const id = youtubeId(v.youtube);
  if (id) {
    const img = el("img");
    img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    img.alt = v.title; img.loading = "lazy";
    const btn = el("button", "v-play");
    btn.setAttribute("aria-label", "Play video: " + v.title);
    btn.innerHTML = `<span>${PLAY}</span>`;
    // load the YouTube player only when the visitor clicks play
    btn.addEventListener("click", () => {
      const f = el("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      f.title = v.title;
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      frame.replaceChildren(f);
    });
    frame.append(img, btn);
  } else {
    const empty = el("div", "v-empty");
    empty.innerHTML = FILM;
    empty.append(el("span", null, "Video coming soon"));
    frame.append(empty);
  }
  const body = el("div", "v-body");
  const meta = el("div", "v-meta");
  meta.append(el("small", null, v.who), el("span", "t-dept", DEPT[v.dept]));
  body.append(el("b", null, v.title), meta);
  if (v.sample) body.append(el("span", "t-sample", "Sample – add a real patient video"));
  card.append(frame, body);
  return card;
}

// Home page: auto-scrolling row (cards duplicated once so the loop is seamless)
const track = document.querySelector(".t-track");
if (track) {
  REVIEWS.forEach(r => track.append(reviewCard(r)));
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    REVIEWS.forEach(r => { const c = reviewCard(r); c.setAttribute("aria-hidden", "true"); track.append(c); });
  }
}
// Testimonials page: full grids
document.querySelector(".t-grid")?.append(...REVIEWS.map(reviewCard));
document.querySelector(".v-grid")?.append(...VIDEOS.map(videoCard));
