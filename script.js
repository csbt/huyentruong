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
const MAIN_PHOTO_PATH = ["public/img/photo17.jpg", "public/img/photo01.jpg", "public/img/photo02.jpg"];

// Variable
const WAIT_SECONDS_SHOW_LADING_ANIMATION = 2000;
let mainPhotoReady = false;
let loadedImagesCount = 0;
let audioControlLottieStatus = false;
let hasUserInteracted = false;
let animationFulled = false

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
  const totalImages = MAIN_PHOTO_PATH.length;

  MAIN_PHOTO_PATH.forEach((imagePath) => {
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
    console.log("Tất cả tài nguyên đã sẵn sàng, có thể chuyển sang màn hình chính");
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
  const qrSection = document.getElementById('slide-4');
  const qrControlBtn = document.querySelector('.qr-control-btn');
  
  // Sử dụng Intersection Observer để theo dõi khi slide-4 hiển thị trong viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Nếu slide-4 đang hiển thị, ẩn nút QR
        qrControlBtn.style.opacity = '0';
        qrControlBtn.style.pointerEvents = 'none';
      } else {
        // Nếu slide-4 không hiển thị, hiện nút QR
        qrControlBtn.style.opacity = '1';
        qrControlBtn.style.pointerEvents = 'auto';
      }
    });
  }, { threshold: 0.3 }); // Kích hoạt khi ít nhất 30% của section hiển thị
  
  // Bắt đầu quan sát section slide-4
  observer.observe(qrSection);
}

// Gọi hàm kiểm tra khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  preloadImages();
  
  // Thêm transition cho qr-control-btn để tạo hiệu ứng mượt mà khi ẩn/hiện
  const qrControlBtn = document.querySelector('.qr-control-btn');
  qrControlBtn.style.transition = 'opacity 0.3s ease';
  
  // Kiểm tra visibility của section QR
  checkQrSectionVisibility();
  
  // gsap
  let getRatio = (el) => window.innerHeight / (window.innerHeight + el.offsetHeight);
  let headings = gsap.utils.toArray("section.hslider .text-overlay p");

  gsap.utils.toArray("section.hslider").forEach((section, i) => {
    section.bg = section.querySelector(".bg");

    let horizontalPosition = "53%";
    if (i === 1) {
      horizontalPosition = "60%";
    }
    gsap.fromTo(
      section.bg,
      {
        backgroundPosition: () =>
          i
            ? `${horizontalPosition} ${-window.innerHeight * getRatio(section)}px`
            : `${horizontalPosition} 0px`,
      },
      {
        backgroundPosition: () =>
          `${horizontalPosition} ${window.innerHeight * (1 - getRatio(section))}px`,
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
["click", "keydown", "mousemove"].forEach((event) => {
  document.addEventListener(event, () => handleUserInteraction(event));
});
