// HEADER

const socialsShare = document.querySelector(".socials-share");
const socialsList = document.querySelector(".socials-list");
const burgerMenu = document.querySelector(".burger-menu");
const navList = document.querySelector(".nav-list");

function updateButtonActiveStates() {
  const socialsOpen = getComputedStyle(socialsList).display === 'flex';
  const navOpen = getComputedStyle(navList).display === 'flex';

  if (socialsShare) {
    if (socialsOpen) socialsShare.classList.add('active');
    else socialsShare.classList.remove('active');
  }

  if (burgerMenu) {
    if (navOpen) burgerMenu.classList.add('active');
    else burgerMenu.classList.remove('active');
  }
}

socialsShare?.addEventListener("click", () => {
  const isHidden = getComputedStyle(socialsList).display === 'none';
  const isBurgerVisible = getComputedStyle(burgerMenu).display !== 'none';
  const isNavOpen = getComputedStyle(navList).display === 'flex';

  if (isBurgerVisible && isNavOpen) {
    navList.style.display = 'none';
  }

  socialsList.style.display = isHidden ? 'flex' : 'none';
  updateButtonActiveStates();
});

burgerMenu?.addEventListener("click", () => {
  const isHidden = getComputedStyle(navList).display === 'none';
  const isSocialsVisible = getComputedStyle(socialsShare).display !== 'none';
  const isSocialsOpen = getComputedStyle(socialsList).display === 'flex';

  if (isSocialsVisible && isSocialsOpen) {
    socialsList.style.display = 'none';
  }

  navList.style.display = isHidden ? 'flex' : 'none';
  updateButtonActiveStates();
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (socialsShare && socialsList) {
    const isSocialsVisible = getComputedStyle(socialsShare).display !== "none";
    const isSocialsOpen = getComputedStyle(socialsList).display === "flex";
    const clickedInsideSocials =
      socialsShare.contains(target) || socialsList.contains(target);

    if (isSocialsVisible && isSocialsOpen && !clickedInsideSocials) {
      socialsList.style.display = 'none';
    }
  }

  if (burgerMenu && navList) {
    const isBurgerVisible = getComputedStyle(burgerMenu).display !== "none";
    const isNavOpen = getComputedStyle(navList).display === "flex";
    const clickedInsideBurger =
      burgerMenu.contains(target) || navList.contains(target);

    if (isBurgerVisible && isNavOpen && !clickedInsideBurger) {
      navList.style.display = 'none';
    }
  }
  updateButtonActiveStates();
});

window.addEventListener("resize", () => {
  const isSocialsButtonVisible = getComputedStyle(socialsShare).display !== 'none';
  const isBurgerVisible = getComputedStyle(burgerMenu).display !== 'none';

  if (!isSocialsButtonVisible) {
    socialsList.style.display = '';
  }

  if (!isBurgerVisible) {
    navList.style.display = '';
  }
  updateButtonActiveStates();
});

const contactsList = document.querySelector('.contacts-list');

contactsList.addEventListener('click', (event) => {
  const li = event.target.closest('.contacts-item');
  if (!li || !contactsList.contains(li)) return;

  const allItems = contactsList.querySelectorAll('.contacts-item');

  if (li.classList.contains('active')) {
    li.classList.remove('active');
  } else {
    allItems.forEach(item => item.classList.remove('active'));
    li.classList.add('active');
  }
});



// HERO

const sections = document.querySelectorAll("section, footer");
const navLinks = document.querySelectorAll(".nav-link");

function onScroll() {
  const scrollPos = window.scrollY + window.innerHeight / 2;

  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", onScroll);

// SERVICES

const swiper = new Swiper(".swiper-1", {
  slidesPerView: "auto",
  centeredSlides: true,
  spaceBetween: 14,
  loop: true,
  grabCursor: true,
  on: {
    slideChange: function () {
      updateCentralSlide(this);
    },
  },
});

function formatTextWithParagraphs(text) {
  return text
    .split("\n\n")
    .map((p) => `<p>${p}</p>`)
    .join("");
}

const servicesListContainer = document.querySelector(".modal-services-list");
const serviceTemplate = document.getElementById("modal-services-template");
let allServices = [];

function renderFullServiceModal(service) {
  const modal = document.querySelector("#modal2");
  const formattedText = formatTextWithParagraphs(service.text);

  modal.querySelector(".full-service-title").textContent = service.title;
  modal.querySelector(".full-service-description").textContent =
    service.description;
  modal.querySelector(".full-service-img").src = service.image;
  modal.querySelector(".full-service-text").innerHTML = formattedText;
  modal.classList.add("show");
  document.body.classList.add("no-scroll");
}

document.querySelectorAll(".swiper-slide").forEach((slide) => {
  slide.addEventListener("click", () => {
    const id = slide.dataset.serviceId;
    const service = allServices.find((s) => s.id === id);
    if (service) renderFullServiceModal(service);
  });
});

function renderListServices(services) {
  services.forEach((service) => {
    const clone = serviceTemplate.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.display = "";

    clone.querySelector(".modal-services-title").textContent = service.title;
    clone.querySelector(".modal-services-descr").textContent =
      service.description;
    clone.querySelector(".modal-services-img").src = service.image;

    clone.dataset.serviceId = service.id;

    servicesListContainer.appendChild(clone);
    serviceTemplate.remove();
  });
}

fetch("./assets/data/services.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Can not fetch data");
    }
    return response.json();
  })
  .then((data) => {
    allServices = data;
    renderListServices(allServices);
  })
  .catch((error) => {
    console.error("Error loading articles:", error);
  });

function closeAllModals() {
  const openModals = document.querySelectorAll(".modal.show");
  openModals.forEach((modal) => {
    modal.classList.remove("show");

    const forms = modal.querySelectorAll("form");
    forms.forEach((form) => form.reset());

    const toggles = modal.querySelectorAll(".modal-form-eye");
    toggles.forEach((toggle) => {
      const eyeOpen = toggle.querySelector(".modal-form-eye-open");
      const eyeClose = toggle.querySelector(".modal-form-eye-close");

      const wrapper = toggle.closest(".modal-form-label-pass-wrapper");
      const input = wrapper ? wrapper.querySelector("input") : null;

      if (input) {
        input.type = "password";
      }

      if (eyeOpen && eyeClose) {
        eyeOpen.classList.remove("hide");
        eyeClose.classList.add("hide");
      }
    });
  });

  if (openModals.length > 0) {
    document.body.classList.remove("no-scroll");
  }
}

document.addEventListener("click", function (event) {
  const target = event.target.closest("[data-modal-target]");
  if (!target) return;

  closeAllModals();

  const modalSelector = target.dataset.modalTarget;
  const modalToOpen = document.querySelector(modalSelector);

  if (modalToOpen) {
    modalToOpen.classList.add("show");
    document.body.classList.add("no-scroll");

    const serviceId = target.dataset.serviceId;
    if (modalSelector === "#modal2" && serviceId) {
      const service = allServices.find((s) => s.id === serviceId);
      if (service) renderFullServiceModal(service);
    }

    const projectId = target.dataset.projectId;
    if (modalSelector === "#modal3" && projectId) {
      const project = allProjects.find((s) => s.id === projectId);
      if (project) renderProjectModal(project);
    }

    if (modalSelector === "#modal4") {
      renderAllMembers(allMembers);
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeAllModals();
  }
});

// ABOUT

const swiper2 = new Swiper(".swiper-2", {
  spaceBetween: 24,
  loop: true,
  slidesPerView: 3,
  slidesPerGroup: 1,
  simulateTouch: false,
  navigation: {
    nextEl: ".swiper-button-next.swiper-second",
    prevEl: ".swiper-button-prev.swiper-second",
  },
  breakpoints: {
    0: {
      slidesPerView: 1
    },
    577: {
      slidesPerView: 3
    }
  },
  on: {
    slideChange: function () {
      updateCentralSlide2(this);
    },
  },
});

function updateCentralSlide(swiperInstance) {
  const slides = swiperInstance.slides;

  slides.forEach((slide, index) => {
    const img = slide.querySelector(".slide-img");
    const text = slide.querySelector(".slide-text");

    img.classList.remove("slide-visible");
    text.classList.remove("slide-visible");
    slide.classList.remove("swiper-slide-gradient");

    if (index === swiperInstance.activeIndex) {
      img.classList.add("slide-visible");
      text.classList.add("slide-visible");
      slide.classList.add("swiper-slide-gradient");
    }
  });
}

function updateCentralSlide2(swiperInstance) {
  const slides = swiperInstance.slides;

  slides.forEach((slide, index) => {
    const text = slide.querySelector(".about-swiper-content");
    const list = slide.querySelector(".swiper-second-points");

    text.classList.remove("points-visible");
    list.classList.remove("points-show");

    if (index === swiperInstance.activeIndex + 1) {
      text.classList.add("points-visible");
      list.classList.add("points-show");
    }
  });
}

// STATUS

const counters = document.querySelectorAll(".status-value");
const speed = 200;

const animateCounter = (counter) => {
  const animate = () => {
    const value = +counter.getAttribute("value");
    let data = +counter.innerText;

    const increment = value / speed;

    if (data < value) {
      data += increment;
      counter.innerText = Math.min(Math.ceil(data), value);
      requestAnimationFrame(animate);
    } else {
      counter.innerText = value;
    }
  };

  animate();
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => {
  observer.observe(counter);
});

// PROJECTS

const swiper3 = new Swiper(".swiper-3", {
  spaceBetween: 24,
  loop: true,
  slidesPerView: 3,
  slidesPerGroup: 1,
  simulateTouch: false,
  navigation: {
    nextEl: ".swiper-button-next.projects-button",
    prevEl: ".swiper-button-prev.projects-button",
  },
  breakpoints: {
    0: {
      slidesPerView: 1
    },
    577: {
      slidesPerView: 2
    },
    769: {
      slidesPerView: 3
    },
  },
  on: {
    slideChange: function () {
      updateHoverSlide(this);
    },
  },
});

function updateHoverSlide(swiper) {
  const slides = swiper.slides;

  slides.forEach((slide) => {
    const content = slide.querySelector(".projects-item-content");
    const button = slide.querySelector(".projects-item-button");

    if (content && button) {
      slide.addEventListener("mouseenter", () => {
        content.classList.remove("hidden");
      });

      slide.addEventListener("mouseleave", () => {
        content.classList.add("hidden");
        button.classList.remove("clicked");
      });

      slide.addEventListener("mousedown", () => {
        button.classList.add("clicked");
      });

      slide.addEventListener("mouseup", () => {
        button.classList.remove("clicked");
      });

      slide.addEventListener("mouseleave", () => {
        button.classList.remove("clicked");
      });
    }
  });
}

let allProjects = [];

function formatProjectFeatures(text) {
  return text.map((p) => `<li>${p}</li>`).join("");
}

function renderProjectModal(project) {
  const modal = document.querySelector("#modal3");
  const formattedFeatures = formatProjectFeatures(project.features);
  const formattedText = formatTextWithParagraphs(project.text);

  modal.querySelector(".modal-project-title").textContent = project.title;
  modal.querySelector(".modal-project-type").textContent = project.type;
  modal.querySelector(".modal-project-img").src = project.image;
  modal.querySelector(".modal-project-features").innerHTML = formattedFeatures;
  modal.querySelector(".modal-project-text").innerHTML = formattedText;
  modal.classList.add("show");
  document.body.classList.add("no-scroll");
}

fetch("./assets/data/projects.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Can not fetch data");
    }
    return response.json();
  })
  .then((data) => {
    allProjects = data;
  })
  .catch((error) => {
    console.error("Error loading articles:", error);
  });

// PROCESS

const tabs = document.querySelectorAll(".process-button");
const iframe = document.getElementById("video-frame");
const playButton = document.querySelector(".custom-play-button");

let player;
let selectedVideoId = "HdW1-guocPA";

function onYouTubeIframeAPIReady() {
  player = new YT.Player("video-frame", {
    videoId: selectedVideoId,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady() {
  playButton.style.display = "block";
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    playButton.style.display = "none";
  } else if (
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.ENDED
  ) {
    playButton.style.display = "block";
  }
}

function setVideo(videoId) {
  selectedVideoId = videoId;

  if (player && player.loadVideoById) {
    player.cueVideoById(videoId);
  } else {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1`;
  }

  playButton.style.display = "block";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("process-active"));
    tab.classList.add("process-active");

    const videoId = tab.dataset.video;
    setVideo(videoId);
  });
});

playButton.addEventListener("click", () => {
  playButton.style.display = "none";
  if (player && player.playVideo) {
    player.playVideo();
  }
});

// TESTIMONIALS

const photos = document.querySelectorAll(".testimonials-photo");
const reviews = document.querySelectorAll(".testimonials-review");
const names = document.querySelectorAll(".testimonials-name");
const roles = document.querySelectorAll(".testimonials-role");

photos.forEach((photo, index) => {
  photo.addEventListener("click", () => {
    photos.forEach((p) => p.classList.remove("active"));
    reviews.forEach((r) => r.classList.remove("active"));
    names.forEach((n) => n.classList.remove("active"));
    roles.forEach((r) => r.classList.remove("active"));

    photo.classList.add("active");
    reviews[index].classList.add("active");
    names[index].classList.add("active");
    roles[index].classList.add("active");
  });
});

// TEAM

let allMembers = [];
const teamPhotos = document.querySelectorAll(".team-image");
const teamNames = document.querySelectorAll(".team-member-name");

teamNames.forEach((teamName, index) => {
  teamName.addEventListener("click", () => {
    teamPhotos.forEach((p) => p.classList.remove("active"));
    teamNames.forEach((n) => n.classList.remove("active"));

    teamName.classList.add("active");
    teamPhotos[index].classList.add("active");
  });
});

function renderAllMembers(members) {
  const teamListContainer = document.querySelector(".modal-team-list");
  const teamTemplate = document.getElementById("modal-team-template");

  teamListContainer.innerHTML = "";
  teamListContainer.appendChild(teamTemplate);

  members.forEach((member) => {
    const clone = teamTemplate.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.display = "";

    clone.querySelector(".modal-team-name").textContent = member.name;
    clone.querySelector(".modal-team-position").textContent = member.position;
    clone.querySelector(".modal-team-img").src = member.photo;
    clone.querySelector(".modal-team-description").textContent =
      member.description;

    teamListContainer.appendChild(clone);
  });
}

fetch("./assets/data/team.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Can not fetch data");
    }
    return response.json();
  })
  .then((data) => {
    allMembers = data;
    renderAllMembers(allMembers);
  })
  .catch((error) => {
    console.error("Error loading articles:", error);
  });

// PRICING

const pricingItems = document.querySelectorAll(".pricing-item");

pricingItems.forEach((item) => {
  const button = item.querySelector(".pricing-button");
  const rectangle = item.querySelector(".pricing-rectangle");

  button.addEventListener("mouseenter", () => {
    rectangle.style.fill = "var(--accent)";
  });

  button.addEventListener("mouseleave", () => {
    rectangle.style.fill = "";
  });
});

const planElements = document.querySelectorAll(".pricing-button");
const planNameSpan = document.getElementById("selectedPlanName");

planElements.forEach((plan) => {
  plan.addEventListener("click", () => {
    const selectedPlan = plan.getAttribute("data-plan-name");

    planNameSpan.textContent = selectedPlan;
  });
});

const planForm = document.getElementById("planForm");
const paymentForm = document.getElementById("paymentForm");

planForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (planForm.checkValidity()) {
    const fullName = document.getElementById("fullNameInput").value.trim();
    const selectedPlan = document
      .getElementById("selectedPlanName")
      .textContent.trim();

    if (fullName && selectedPlan) {
      localStorage.setItem("userName", fullName);
      localStorage.setItem("planName", selectedPlan);
    }
    closeAllModals();

    setTimeout(() => {
      const modal6 = document.querySelector("#modal6");
      if (modal6) {
        modal6.classList.add("show");
        document.body.classList.add("no-scroll");
      }
    }, 50);
  } else {
    planForm.reportValidity();
  }
});

document.getElementById("paymentForm").addEventListener("submit", function (e) {
  if (!this.checkValidity()) {
    e.preventDefault();
    this.reportValidity();
  }
});

paymentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (paymentForm.checkValidity()) {
    closeAllModals();

    setTimeout(() => {
      const modal7 = document.querySelector("#modal7");
      if (modal7) {
        const userName = localStorage.getItem("userName") || "there";
        const planName = localStorage.getItem("planName") || "your plan";

        document.querySelector(
          "#finalGreeting"
        ).textContent = `Welcome aboard, ${userName}!`;
        document.querySelector(
          "#finalPlan"
        ).innerHTML = `You’ve successfully subscribed to the <strong>${planName}</strong> plan.`;
        modal7.classList.add("show");
        document.body.classList.add("no-scroll");
      }
    }, 50);
  } else {
    paymentForm.reportValidity();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const cardInput = document.querySelector('input[name="cardNumber"]');

  cardInput.addEventListener("input", function (e) {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";

    e.target.value = formatted;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const expiryInput = document.querySelector('input[name="expiryDate"]');

  expiryInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    e.target.value = value;
  });
});

const phoneInput = document.querySelector('input[name="phone"]');

phoneInput.addEventListener("input", (e) => {
  let value = e.target.value;

  value = value.replace(/[^\d+]/g, "");
  value = value.replace(/\+/g, "");
  if (e.target.value.startsWith("+")) {
    value = "+" + value;
  }

  if (value.length > 15) {
    value = value.slice(0, 15);
  }

  e.target.value = value;
});

document
  .querySelector('input[name="cvv"]')
  .addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

const passwordInput = document.getElementById("passwordInput");
const toggleBtn = document.getElementById("passwordToggle");
const eyeOpen = toggleBtn.querySelector(".modal-form-eye-open");
const eyeClose = toggleBtn.querySelector(".modal-form-eye-close");

toggleBtn.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeOpen.classList.add("hide");
    eyeClose.classList.remove("hide");
  } else {
    passwordInput.type = "password";
    eyeOpen.classList.remove("hide");
    eyeClose.classList.add("hide");
  }
});

// BLOG

const mainTemplate = document.getElementById("main-article-template");
const articleTemplate = document.getElementById("article-template");
const mainContainer = document.querySelector(".blog-container");
const listContainer = document.querySelector(".blog-list");
const readMoreBtn = document.getElementById("read-more-btn");

let allArticles = [];
let currentIndex = 4;

function formatDate(dateString) {
  return dateString.replaceAll("/", " ");
}

function renderModalContent(article) {
  const modal = document.querySelector("#modal8");
  const rawText = article.text;
  const formattedHTML = formatTextWithParagraphs(rawText);
  modal.querySelector(".modal-blog-article-date").textContent = formatDate(
    article.date
  );
  modal.querySelector(".blog-author").textContent = `By ${article.author}`;
  modal.querySelector(".blog-theme").textContent = article.category;
  modal.querySelector(".blog-article-title").textContent = article.title;
  modal.querySelector(".modal-blog-article-paragraph").textContent =
    article.excerpt;
  modal.querySelector(".blog-article-text").innerHTML = formattedHTML;
  modal.querySelector(".modal-blog-article-pic").src = article.coverImage;
  modal.classList.add("show");
  document.body.classList.add("no-scroll");
}

function renderMainArticle(article) {
  const clone = mainTemplate.cloneNode(true);
  clone.removeAttribute("id");
  clone.style.display = "";

  clone.querySelector(".blog-main-article-date").textContent = formatDate(
    article.date
  );
  clone.querySelector(".blog-author").textContent = `By ${article.author}`;
  clone.querySelector(".blog-theme").textContent = article.category;
  clone.querySelector(".blog-main-article-title").textContent = article.title;
  clone.querySelector(".blog-main-article-paragraph").textContent =
    article.excerpt;
  clone.querySelector(".blog-main-article-pic").src = article.coverImage;

  const modalButton = clone.querySelector("[data-modal-target]");
  if (modalButton) {
    modalButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const selected = allArticles.find((item) => item.id === article.id);
      if (selected) renderModalContent(selected);
    });
  }

  mainTemplate.after(clone);
}

function renderListArticles(articles) {
  articles.forEach((article) => {
    const clone = articleTemplate.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.display = "";

    clone.querySelector(".blog-article-date").textContent = formatDate(
      article.date
    );
    clone.querySelector(".blog-author").textContent = `By ${article.author}`;
    clone.querySelector(".blog-theme").textContent = article.category;
    clone.querySelector(".blog-article-title").textContent = article.title;
    clone.querySelector(".blog-article-pic").src = article.coverImage;

    clone.dataset.articleId = article.id;

    clone.addEventListener("click", () => {
      const selected = allArticles.find((item) => item.id === article.id);
      if (selected) renderModalContent(selected);
    });

    listContainer.appendChild(clone);
  });
}

function loadNextArticles() {
  const nextArticles = allArticles.slice(currentIndex, currentIndex + 3);
  renderListArticles(nextArticles);
  currentIndex += 3;

  if (currentIndex >= allArticles.length) {
    mainTemplate.remove();
    articleTemplate.remove();
    readMoreBtn.remove();
  }
}

fetch("./assets/data/blog-posts.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Can not fetch data");
    }
    return response.json();
  })
  .then((data) => {
    allArticles = data;
    renderMainArticle(allArticles[0]);
    renderListArticles(allArticles.slice(1, 4));

    if (readMoreBtn) {
      readMoreBtn.addEventListener("click", loadNextArticles);
    }
  })
  .catch((error) => {
    console.error("Error loading articles:", error);
  });

// FOOTER

const form = document.querySelector(".sign-up-form");
const input = document.querySelector(".sign-up-input");
const button = document.querySelector(".sign-up-button");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (input.checkValidity()) {
    const modal = document.querySelector(button.dataset.modalTargetOnSubmit);

    if (modal) {
      modal.classList.add("show");
      document.body.classList.add("no-scroll");
    }

    input.value = "";
  } else {
    input.reportValidity();
  }
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    modal.classList.remove("show");
    document.body.classList.remove("no-scroll");

    const passwordInput = modal.querySelector(
      'input[type="text"][name="password"], input[type="password"][name="password"]'
    );
    const toggleBtn = modal.querySelector(".modal-form-eye");
    if (passwordInput && toggleBtn) {
      passwordInput.type = "password";

      const eyeOpen = toggleBtn.querySelector(".modal-form-eye-open");
      const eyeClose = toggleBtn.querySelector(".modal-form-eye-close");

      if (eyeOpen && eyeClose) {
        eyeOpen.classList.remove("hide");
        eyeClose.classList.add("hide");
      }
    }

    document.querySelectorAll(".modal form").forEach((form) => form.reset());
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeAllModals();
    }
  });
});
