// Element
const lottieWrapper = document.querySelector(".lottie-container");
const lottieContent = document.getElementById("lottie-container-content");
const lottieHeartContainer = document.getElementById("lottie-heart-container");
const lottieSoundControl = document.getElementById("lottie-sound-control");
const lottieQrControl = document.getElementById("lottie-qr-control");

const body = document.body;
const container = document.querySelector(".container");
const audioControlBtn = document.querySelector(".audio-control-btn");
const audioControlElm = document.getElementById("audio-control-elm");
const qrControlBtn = document.querySelector(".qr-control-btn");

// Constant
const LOADING_LOTTIE_PATH = "public/json/loading.json";
const SOUND_CONTROL_LOTTIE_PATH = "public/json/sound.json";
const HEART_LOTTIE_PATH = "public/json/heart.json";
const QR_CONTROL_LOTTIE_PATH = "public/json/qr.json";

// Gallery Images Array
const GALLERY_IMAGES = [
  "public/img/compress/photo112.jpg",
  "public/img/compress/photo110.jpg",
  "public/img/compress/photo111.jpg",
  "public/img/compress/photo03.jpg",
  "public/img/compress/photo11.jpg",
  "public/img/compress/photo12.jpg",
  "public/img/compress/photo01.jpg",
  "public/img/compress/photo02.jpg",
  "public/img/compress/photo13.jpg",
  "public/img/compress/photo14.jpg",
  "public/img/compress/photo15.jpg",
  "public/img/compress/photo16.jpg",
  "public/img/compress/photo17.jpg",
  "public/img/compress/photo18.jpg",
  "public/img/compress/photo19.jpg",
];

// Variable
const WAIT_SECONDS_SHOW_LADING_ANIMATION = 2000;
let mainPhotoReady = false;
let loadedImagesCount = 0;
let audioControlLottieStatus = false;
let hasUserInteracted = false;
let animationFulled = false;

const animation = lottie.loadAnimation({
  container: lottieContent,
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: LOADING_LOTTIE_PATH,
  name: "loading",
  // faster
});

const heartLottie = lottie.loadAnimation({
  container: lottieHeartContainer,
  renderer: "svg",
  loop: true,
  autoplay: false,
  path: HEART_LOTTIE_PATH,
  name: "heart",
});

const audioControlLottie = lottie.loadAnimation({
  container: lottieSoundControl,
  renderer: "svg",
  loop: true,
  autoplay: false,
  path: SOUND_CONTROL_LOTTIE_PATH,
  name: "sound-control",
});

const qrControlLottie = lottie.loadAnimation({
  container: lottieQrControl,
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: QR_CONTROL_LOTTIE_PATH,
  name: "qr-control",
});
animation.addEventListener("DOMLoaded", () => {
  animation.play();
  animation.setSpeed(1.5);
});

animation.onComplete = () => {
  heartLottie.play();
  heartLottie.setSpeed(0.5);

  setTimeout(() => {
    animationFulled = true;
    checkAllResourcesReady();
  }, WAIT_SECONDS_SHOW_LADING_ANIMATION);
};

audioControlLottie.addEventListener("DOMLoaded", () => {
  if (audioControlLottieStatus) {
    audioControlLottie.play();
  }
  audioControlLottie.setSpeed(0.5);
});

// Kiểm tra tải tất cả các ảnh chính
function preloadImages() {
  const totalImages = GALLERY_IMAGES.length;

  GALLERY_IMAGES.forEach((imagePath) => {
    const img = new Image();
    img.src = imagePath;

    img.onload = () => {
      loadedImagesCount++;
      console.log(`Đã tải ${loadedImagesCount}/${totalImages} ảnh`);

      // Kiểm tra nếu tất cả ảnh đã được tải
      if (loadedImagesCount === totalImages) {
        mainPhotoReady = true;
        checkAllResourcesReady();
        console.log("Tất cả ảnh đã được tải thành công!");
      }
    };

    img.onerror = () => {
      console.error(`Không thể tải ảnh: ${imagePath}`);
      // Vẫn tăng số đếm để không bị treo quá trình
      loadedImagesCount++;

      if (loadedImagesCount === totalImages) {
        // Đặt mainPhotoReady = true ngay cả khi có lỗi để tránh treo trang
        mainPhotoReady = true;
        checkAllResourcesReady();
        console.warn("Đã hoàn thành việc tải ảnh nhưng có một số lỗi");
      }
    };
  });
}

// Kiểm tra tất cả tài nguyên đã sẵn sàng chưa
function checkAllResourcesReady() {
  if (mainPhotoReady && animationFulled) {
    // Thực hiện các hành động khi tất cả ảnh đã sẵn sàng
    console.log(
      "Tất cả tài nguyên đã sẵn sàng, có thể chuyển sang màn hình chính"
    );
    // Thêm code để chuyển sang màn hình chính ở đây
    showMainContent();
  }
}

// Hiển thị nội dung chính và ẩn màn hình loading
function showMainContent() {
  // Tạo container cho ảnh
  setTimeout(() => {
    lottieWrapper.classList.add("slide-up");

    // Hiển thị ảnh sau khi màn hình loading đã trượt lên
    setTimeout(() => {
      container.style.height = "auto";
    }, 500);
  }, 500);
}

audioControlBtn.addEventListener("click", () => {
  if (audioControlLottieStatus) {
    audioControlLottie.pause();
    audioControlLottieStatus = false;
    audioControlElm.pause();
  } else {
    audioControlLottie.play();
    audioControlLottieStatus = true;
    audioControlElm.play();
  }
});

// Thêm code để kiểm tra và ẩn nút QR khi section slide-4 đang active
function checkQrSectionVisibility() {
  const qrSection = document.getElementById("slide-4");
  const qrControlBtn = document.querySelector(".qr-control-btn");

  // Sử dụng Intersection Observer để theo dõi khi slide-4 hiển thị trong viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Nếu slide-4 đang hiển thị, ẩn nút QR
          qrControlBtn.style.opacity = "0";
          qrControlBtn.style.pointerEvents = "none";
        } else {
          // Nếu slide-4 không hiển thị, hiện nút QR
          qrControlBtn.style.opacity = "1";
          qrControlBtn.style.pointerEvents = "auto";
        }
      });
    },
    { threshold: 0.3 }
  ); // Kích hoạt khi ít nhất 30% của section hiển thị

  // Bắt đầu quan sát section slide-4
  observer.observe(qrSection);
}

// Thêm sự kiện click cho nút QR để cuộn xuống section cuối
function setupQrControlButton() {
  const qrControlElement = document.getElementById("lottie-qr-control");
  const slide4Element = document.getElementById("slide-4");

  qrControlElement.addEventListener("click", () => {
    // Cuộn đến section slide-4 với hiệu ứng mượt mà
    slide4Element.scrollIntoView({ behavior: "smooth" });
  });

  // Thêm cursor pointer để hiển thị rằng phần tử có thể click được
  qrControlElement.style.cursor = "pointer";
}

// Gọi hàm kiểm tra khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  preloadImages();

  // Thêm transition cho qr-control-btn để tạo hiệu ứng mượt mà khi ẩn/hiện
  const qrControlBtn = document.querySelector(".qr-control-btn");
  qrControlBtn.style.transition = "opacity 0.3s ease";

  // Kiểm tra visibility của section QR
  checkQrSectionVisibility();

  // Thiết lập sự kiện click cho nút QR
  setupQrControlButton();

  // gsap
  let getRatio = (el) =>
    window.innerHeight / (window.innerHeight + el.offsetHeight);

  gsap.utils.toArray("section.hslider").forEach((section, i) => {
    section.bg = section.querySelector(".bg");

    let horizontalPosition = "53%";
    if (i === 1) {
      horizontalPosition = "60%";
    } else if (i === 3) {
      horizontalPosition = "80%";
    }
    gsap.fromTo(
      section.bg,
      {
        backgroundPosition: () =>
          i
            ? `${horizontalPosition} ${
                -window.innerHeight * getRatio(section)
              }px`
            : `${horizontalPosition} 0px`,
      },
      {
        backgroundPosition: () =>
          `${horizontalPosition} ${
            window.innerHeight * (1 - getRatio(section))
          }px`,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: () => (i ? "top bottom" : "top top"),
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          toggleActions: "play play play play",
          toggleClass: { targets: section, className: "enable" },
          markers: false,
        },
      }
    );
  });
});

const handleUserInteraction = (e) => {
  if (!hasUserInteracted) {
    hasUserInteracted = true;
    audioControlLottieStatus = true;
    audioControlElm.play();
    audioControlLottie.play();
  }
};
["click", "keydown"].forEach((event) => {
  document.addEventListener(event, () => handleUserInteraction(event));
});

// Initialize Gallery
function initGallery() {
  const slidesContainer = document.querySelector(".slides-container");
  const thumbnailRow = document.querySelector(".thumbnail-row");
  const slideNumber = document.querySelector(".slide-number");

  // Clear existing content
  slidesContainer.innerHTML = "";
  thumbnailRow.innerHTML = "";

  // Create slides and thumbnails from the array
  GALLERY_IMAGES.forEach((image, index) => {
    // Create slide
    const slide = document.createElement("div");
    slide.className = "mySlides";
    slide.style.display = index === 0 ? "flex" : "none";

    const img = document.createElement("img");
    img.src = image;
    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    // Create thumbnail
    const thumbnail = document.createElement("div");
    thumbnail.className = index === 0 ? "thumbnail active" : "thumbnail";
    thumbnail.onclick = function () {
      currentSlide(index + 1);
    };

    const thumbImg = document.createElement("img");
    thumbImg.src = image;
    thumbnail.appendChild(thumbImg);
    thumbnailRow.appendChild(thumbnail);
  });

  // Update slide number
  slideNumber.textContent = `1 / ${GALLERY_IMAGES.length}`;
}

// Call the gallery initialization when the page loads
document.addEventListener("DOMContentLoaded", function () {
  initGallery();
  initFanGallery();
  // ... other existing code
});

// Initialize Fan Gallery
function initFanGallery() {
  const fanGallery = document.querySelector(".fan-gallery");

  // Clear existing content
  fanGallery.innerHTML = "";

  // Select 3 images from the array for the fan gallery
  const fanImages = [
    { src: GALLERY_IMAGES[6], index: 7 }, // First image
    { src: GALLERY_IMAGES[4], index: 5 }, // Middle image
    { src: GALLERY_IMAGES[0], index: 1 }, // Last image
  ];

  // Create fan images
  fanImages.forEach((image, i) => {
    const fanImage = document.createElement("div");
    fanImage.className = "fan-image";

    // Set the correct click handler with the proper index
    fanImage.onclick = function () {
      openModal();
      currentSlide(image.index);
    };

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = `Wedding Photo ${i + 1}`;

    fanImage.appendChild(img);
    fanGallery.appendChild(fanImage);
  });
}

// Call the fan gallery initialization when the page loads
document.addEventListener("DOMContentLoaded", function () {
  initFanGallery();
  // ... other existing code
});

// Falling flower petals effect
function createPetals() {
  const petalsContainer = document.getElementById("petals-container");
  const numberOfPetals = 30; // Adjust number of petals

  for (let i = 0; i < numberOfPetals; i++) {
    setTimeout(() => {
      const petal = document.createElement("div");
      const petalType = Math.floor(Math.random() * 2) + 1; // 2 different petal types (heart and cherry blossom)

      petal.classList.add("petal", `petal-${petalType}`);

      // Random size between 15px and 30px
      const size = Math.random() * 15 + 15;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;

      // Random starting position
      const startPositionX = Math.random() * window.innerWidth;
      petal.style.left = `${startPositionX}px`;
      petal.style.top = "-50px";

      // Random rotation
      const rotation = Math.random() * 360;
      petal.style.transform = `rotate(${rotation}deg)`;

      // Random falling duration between 10s and 20s
      const fallingDuration = Math.random() * 10 + 10;

      // Apply animation
      petal.style.animation = `
        falling ${fallingDuration}s linear infinite,
        rotating ${Math.random() * 5 + 5}s linear infinite,
        sideMovement ${Math.random() * 5 + 3}s ease-in-out infinite alternate
      `;

      // Add to container
      petalsContainer.appendChild(petal);

      // Remove petal after animation to prevent memory issues
      setTimeout(() => {
        petal.remove();
      }, fallingDuration * 1000);
    }, i * 300); // Stagger the creation of petals
  }
}

// Add animations for the petals
const style = document.createElement("style");
style.textContent = `
  @keyframes falling {
    0% {
      top: -50px;
      opacity: 0;
    }
    10% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.7;
    }
    100% {
      top: 100vh;
      opacity: 0;
    }
  }
  
  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes sideMovement {
    0% {
      margin-left: -50px;
    }
    100% {
      margin-left: 50px;
    }
  }
`;
document.head.appendChild(style);

// Start creating petals when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  createPetals();

  // Continue creating petals at intervals
  setInterval(createPetals, 15000); // Create new batch every 15 seconds
});

// Countdown Timer Function
function initCountdown() {
  // Set the wedding date - March 9, 2025
  const weddingDate = new Date("March 9, 2025 13:30:00").getTime();

  // Update the countdown every second
  const countdownTimer = setInterval(function () {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the wedding date
    const distance = weddingDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="countdown"
    document.getElementById("countdown").innerHTML = `
      <div class="countdown-item">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">Ngày</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-label">Giờ</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-label">Phút</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-label">Giây</span>
      </div>
    `;

    // If the countdown is over, display a message
    if (distance < 0) {
      clearInterval(countdownTimer);
      document.getElementById("countdown").innerHTML = "Hạnh phúc viên mãn!";
    }
  }, 1000);
}

// Call the countdown function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  initCountdown();
  // ... other existing code
});

// Gallery Modal Functions with Animation
function openModal() {
  const modal = document.getElementById("galleryModal");
  modal.style.display = "block";
  
  // Trigger reflow to ensure transition works
  void modal.offsetWidth;
  
  // Add show class to trigger animations
  modal.classList.add("show");
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("galleryModal");
  
  // Remove show class to trigger closing animations
  modal.classList.remove("show");
  
  // Wait for animation to complete before hiding
  setTimeout(() => {
    modal.style.display = "none";
    // Restore body scrolling
    document.body.style.overflow = "";
  }, 300);
}

let slideIndex = 1;

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let thumbnails = document.getElementsByClassName("thumbnail");
  let thumbnailRow = document.querySelector(".thumbnail-row");
  let slideNumber = document.querySelector(".slide-number");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  // Update slide number
  slideNumber.textContent = `${slideIndex} / ${slides.length}`;

  // Hide all slides
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Remove active class from all thumbnails
  for (i = 0; i < thumbnails.length; i++) {
    thumbnails[i].className = thumbnails[i].className.replace(" active", "");
  }

  // Show current slide and activate current thumbnail
  slides[slideIndex - 1].style.display = "flex";
  thumbnails[slideIndex - 1].className += " active";
  
  // Scroll to the active thumbnail
  if (thumbnailRow) {
    const activeThumb = thumbnails[slideIndex - 1];
    const rowWidth = thumbnailRow.offsetWidth;
    const thumbLeft = activeThumb.offsetLeft;
    const thumbWidth = activeThumb.offsetWidth;
    
    // Calculate scroll position to center the thumbnail
    const scrollPos = thumbLeft - (rowWidth / 2) + (thumbWidth / 2);
    
    // Scroll the thumbnail row
    thumbnailRow.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
  }
}

// QR Modal Functions with Animation
function openQrModal(imgSrc, name, account, bank) {
  const qrModal = document.getElementById("qrModal");
  const qrModalImage = document.getElementById("qrModalImage");
  const qrModalName = document.getElementById("qrModalName");
  const qrModalAccount = document.getElementById("qrModalAccount");
  const qrModalBank = document.getElementById("qrModalBank");
  
  // Set the image and info
  qrModalImage.src = imgSrc;
  qrModalName.textContent = name;
  qrModalAccount.textContent = account;
  qrModalBank.textContent = bank;
  
  // Display the modal
  qrModal.style.display = "flex";
  
  // Trigger reflow to ensure transition works
  void qrModal.offsetWidth;
  
  // Add show class to trigger animations
  qrModal.classList.add("show");
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = "hidden";
}

function closeQrModal() {
  const qrModal = document.getElementById("qrModal");
  
  // Remove show class to trigger closing animations
  qrModal.classList.remove("show");
  
  // Wait for animation to complete before hiding
  setTimeout(() => {
    qrModal.style.display = "none";
    // Restore body scrolling
    document.body.style.overflow = "";
  }, 300);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const qrModal = document.getElementById("qrModal");
  const galleryModal = document.getElementById("galleryModal");
  
  if (event.target === qrModal) {
    closeQrModal();
  }
  
  if (event.target === galleryModal) {
    closeModal();
  }
};

// Add click event listeners to QR images
document.addEventListener("DOMContentLoaded", function() {
  // Groom QR
  const groomQrContainer = document.querySelector(".qr-container:nth-child(1) .qr-img-container");
  groomQrContainer.addEventListener("click", function() {
    openQrModal(
      "public/img/groom-qr.png", 
      "Ngô Xuân Trường", 
      "0491000183537", 
      "Vietcombank"
    );
  });
  
  // Bride QR
  const brideQrContainer = document.querySelector(".qr-container:nth-child(2) .qr-img-container");
  brideQrContainer.addEventListener("click", function() {
    openQrModal(
      "public/img/bride-qr.png", 
      "Hoàng Thị Huyền", 
      "101099996789", 
      "Techcombank"
    );
  });
});

// Add keyboard support for closing modals
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    // Check if either modal is open
    const qrModal = document.getElementById("qrModal");
    const galleryModal = document.getElementById("galleryModal");
    
    if (qrModal.style.display === "block") {
      closeQrModal();
    }
    
    if (galleryModal.style.display === "block") {
      closeModal();
    }
  }
});
