
// Cinematic first-entry sequence; the archive remains accessible without waiting.
const introScreen = document.getElementById("introScreen");
if (introScreen) {
  document.body.classList.add("intro-playing");
  window.setTimeout(() => {
    introScreen.classList.add("intro-fade-out");
    document.body.classList.remove("intro-playing");
    window.setTimeout(() => introScreen.remove(), 900);
  }, 1750);
}

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuToggle.textContent = open ? "×" : "☰";
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Reveal page elements as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal, .art-card");
document.querySelectorAll(".art-card").forEach((card, index) => { card.style.setProperty("--card-index", index % 9); });
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Gallery category filters.
const filters = document.querySelectorAll(".filter");
const artCards = document.querySelectorAll(".art-card");
filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(button => button.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.filter;
    artCards.forEach(card => {
      card.classList.toggle("hidden", category !== "all" && card.dataset.category !== category);
    });
  });
});

// Artwork lightbox.
const artworks = [
  {
    "title": "Berserk Poster Artwork",
    "source": "Berserk · Manga",
    "category": "INK & PEN",
    "src": "images/berserk-collage-original.jpg"
  },
  {
    "title": "Vito Corleone",
    "source": "The Godfather · Film",
    "category": "GRAPHITE",
    "src": "images/godfather-original.jpg"
  },
  {
    "title": "Thorfinn",
    "source": "Vinland Saga · Anime/Manga",
    "category": "INK & PEN",
    "src": "images/manga-warrior-original.jpg"
  },
  {
    "title": "Ryomen Sukuna",
    "source": "Jujutsu Kaisen · Anime/Manga",
    "category": "GRAPHITE",
    "src": "images/guts-portrait-original.jpg"
  },
  {
    "title": "Kokushibo",
    "source": "Demon Slayer: Kimetsu no Yaiba · Anime/Manga",
    "category": "GRAPHITE",
    "src": "images/dark-fantasy-face-original.webp"
  },
  {
    "title": "Do Ha-na",
    "source": "The Uncanny Counter · Korean TV series",
    "category": "GRAPHITE",
    "src": "images/portrait-study-original.jpg"
  },
  {
    "title": "Lucifer",
    "source": "Dark Fantasy · Character artwork",
    "category": "GRAPHITE",
    "src": "images/horned-demon-original.jpg"
  },
  {
    "title": "The Last Keep — Knight and Castle",
    "source": "Original dark-fantasy artwork",
    "category": "INK & PEN",
    "src": "images/castle-knight-original.jpg"
  },
  {
    "title": "Hisoka Morow",
    "source": "Hunter × Hunter · Anime/Manga",
    "category": "INK & PEN",
    "src": "images/hisoka-original.jpg"
  },
  {
    "title": "Girl Sketch",
    "source": "Original portrait study",
    "category": "GRAPHITE",
    "src": "images/blonde-portrait-original.jpg"
  },
  {
    "title": "Guts — Clash of Blades",
    "source": "Berserk · Manga",
    "category": "INK & PEN",
    "src": "images/berserk-poster-artwork.png"
  },
  {
    "title": "Anime Character Studies",
    "source": "Anime fan art · Multiple characters",
    "category": "GRAPHITE",
    "src": "images/anime-character-studies.jpg"
  },
  {
    "title": "Yellow Sports Car",
    "source": "Automotive illustration · Original study",
    "category": "COLOR STUDY",
    "src": "images/yellow-sports-car-study.jpeg"
  },
  {
    "title": "Messmer the Impaler",
    "source": "Elden Ring: Shadow of the Erdtree · Video game",
    "category": "GRAPHITE",
    "src": "images/dark-knight-portrait.jpeg"
  },
  {
    "title": "Sukuna Pencil Art",
    "source": "Jujutsu Kaisen · Anime/Manga",
    "category": "GRAPHITE",
    "src": "images/guts-head-down.jpeg"
  },
  {
    "title": "Angel",
    "source": "Character artwork · Source unspecified",
    "category": "GRAPHITE",
    "src": "images/guts-physique-study.jpg"
  },
  {
    "title": "Baraggan Louisenbairn",
    "source": "Bleach · Anime/Manga",
    "category": "INK & PEN",
    "src": "images/baraggan-bleach.jpg"
  },
  {
    "title": "Pyramid Head",
    "source": "Silent Hill · Video game series",
    "category": "INK & PEN",
    "src": "images/hooded-fantasy-wanderer.jpg"
  },
  {
    "title": "Sung Jinwoo",
    "source": "Solo Leveling · Anime/Manhwa",
    "category": "GRAPHITE",
    "src": "images/dark-guts-sketch.jpg"
  },
  {
    "title": "Toji Fushiguro",
    "source": "Jujutsu Kaisen · Anime/Manga",
    "category": "GRAPHITE",
    "src": "images/guts-sword-study.jpg"
  },
  {
    "title": "Muscular Figure Study",
    "source": "Original figure study",
    "category": "GRAPHITE",
    "src": "images/muscular-figure-study.jpg"
  }
];

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxNumber = document.getElementById("lightboxNumber");
const lightboxTitle = document.getElementById("lightboxTitle");
let currentArtwork = 0;

function showArtwork(index) {
  currentArtwork = (index + artworks.length) % artworks.length;
  const artwork = artworks[currentArtwork];
  lightboxImage.src = artwork.src;
  lightboxImage.alt = artwork.title;
  lightboxNumber.textContent = `${String(currentArtwork + 1).padStart(2, "0")} / ${artwork.category}`;
  lightboxTitle.textContent = artwork.title;
  lightboxTitle.dataset.source = artwork.source;
  lightboxTitle.dataset.source = artwork.source;
}

function openLightbox(index) {
  showArtwork(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  document.getElementById("lightboxClose").focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

artCards.forEach(card => {
  card.addEventListener("click", () => openLightbox(Number(card.dataset.index)));
});

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => showArtwork(currentArtwork - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showArtwork(currentArtwork + 1));

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showArtwork(currentArtwork - 1);
  if (event.key === "ArrowRight") showArtwork(currentArtwork + 1);
});


// Slow drifting embers add a restrained dark-fantasy atmosphere.
const emberLayer = document.createElement("div");
emberLayer.className = "ember-layer";
emberLayer.setAttribute("aria-hidden", "true");
document.body.appendChild(emberLayer);
for (let i = 0; i < 24; i++) {
  const ember = document.createElement("span");
  ember.className = "ember";
  ember.style.setProperty("--x", `${(i * 37 + 11) % 100}%`);
  ember.style.setProperty("--delay", `${-((i * 1.7) % 22)}s`);
  ember.style.setProperty("--duration", `${14 + ((i * 7) % 15)}s`);
  ember.style.setProperty("--drift", `${((i * 13) % 90) - 45}px`);
  emberLayer.appendChild(ember);
}
