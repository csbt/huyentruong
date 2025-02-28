// Element
const lottieWrapper = document.querySelector(".lottie-container");
const lottieContent = document.getElementById("lottie-container-content");
const body = document.body;
const container = document.querySelector(".container");
// Constant
const LOADING_ANIMATION_PATH = "public/json/loading.json";
const MAIN_PHOTO_PATH = ["public/img/photo1.jpg", "public/img/photo2.jpg", "public/img/photo3.jpg"];

// Variable
const MIN_SECONDS_SHOW_LADING_ANIMATION = 1;
let mainPhotoReady = false;
let loadedImagesCount = 0;
let lottieFulled = false;
const animation = lottie.loadAnimation({
  container: lottieContent,
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: LOADING_ANIMATION_PATH,
  name: "loading",
  // faster
});

animation.addEventListener("DOMLoaded", () => {
  animation.play();
  animation.setSpeed(1.5);
  setTimeout(() => {
    lottieFulled = true;
    checkAllResourcesReady();
  }, MIN_SECONDS_SHOW_LADING_ANIMATION);
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
        console.log("Tất cả ảnh đã được tải thành công!");
        checkAllResourcesReady();
      }
    };

    img.onerror = () => {
      console.error(`Không thể tải ảnh: ${imagePath}`);
      // Vẫn tăng số đếm để không bị treo quá trình
      loadedImagesCount++;

      if (loadedImagesCount === totalImages) {
        // Đặt mainPhotoReady = true ngay cả khi có lỗi để tránh treo trang
        mainPhotoReady = true;
        console.warn("Đã hoàn thành việc tải ảnh nhưng có một số lỗi");
        checkAllResourcesReady();
      }
    };
  });
}

// Kiểm tra tất cả tài nguyên đã sẵn sàng chưa
function checkAllResourcesReady() {
  if (mainPhotoReady && lottieFulled) {
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

// Bắt đầu tải trước các ảnh khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  preloadImages();

  // gsap
  let getRatio = (el) => window.innerHeight / (window.innerHeight + el.offsetHeight);
  let headings = gsap.utils.toArray("section.hslider .text-overlay p");

  gsap.utils.toArray("section.hslider").forEach((section, i) => {
    section.bg = section.querySelector(".bg");
    console.log(">>> section:", section);

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
