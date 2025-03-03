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
      horizontalPosition = "65%";
    } else if (i === 3) {
      horizontalPosition = "70%";
    }else if (i === 4) {
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

  // Setup RSVP form
  setupRSVPForm();
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

// RSVP Modal Functions
function openRsvpModal() {
  const rsvpModal = document.getElementById("rsvpModal");
  rsvpModal.style.display = "block";
  
  // Add show class for animation
  setTimeout(() => {
    rsvpModal.classList.add("show");
    
    // Auto focus on fullName input after modal is shown
    setTimeout(() => {
      document.getElementById('fullName').focus();
    }, 300);
  }, 10);
  
  // Prevent body scrolling
  document.body.style.overflow = "hidden";
}

function closeRsvpModal() {
  const rsvpModal = document.getElementById("rsvpModal");
  rsvpModal.classList.remove("show");
  
  // Wait for animation to complete before hiding
  setTimeout(() => {
    rsvpModal.style.display = "none";
    // Restore body scrolling
    document.body.style.overflow = "";
  }, 300);
}

// Update setupRSVPForm function
function setupRSVPForm() {
  const form = document.getElementById('rsvpForm');
  const formStatus = document.getElementById('formStatus');
  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const submitBtn = document.getElementById('submitBtn');
  const openRsvpBtn = document.getElementById('openRsvpBtn');
  const sectionRsvpBtns = document.querySelectorAll('.section-rsvp-btn');
  const phoneInput = document.getElementById('phone');
  
  // Setup phone input validation
  phoneInput.addEventListener('input', function(e) {
    // Remove any non-digit characters
    let value = e.target.value.replace(/\D/g, '');
    
    // Ensure it starts with 0
    if (value.length > 0 && value[0] !== '0') {
      value = '0' + value.substring(0, 9);
    }
    
    // Limit to 10 digits (Vietnamese phone numbers)
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    // Update the input value
    e.target.value = value;
    
    // Validate the pattern
    const isValid = /^0\d{9}$/.test(value);
    
    // Visual feedback
    if (value.length > 0) {
      if (isValid) {
        phoneInput.classList.remove('invalid');
        phoneInput.classList.add('valid');
      } else {
        phoneInput.classList.remove('valid');
        phoneInput.classList.add('invalid');
      }
    } else {
      phoneInput.classList.remove('valid', 'invalid');
    }
  });
  
  // Check if user has already submitted the form
  const hasSubmitted = localStorage.getItem('rsvpSubmitted');
  if (hasSubmitted === 'true') {
    // Update all buttons text and class if already submitted
    updateAllRsvpButtons(true);
    
    // Show success message but don't disable form
    formSuccess.classList.remove('hidden');
    
    // Hide submit button when showing success message
    submitBtn.style.display = 'none';
    
    // Restore form data from localStorage
    restoreFormData();
  }
  
  // Setup open modal button
  openRsvpBtn.addEventListener('click', openRsvpModal);
  
  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate phone number
    const phoneInput = document.getElementById('phone');
    const phoneValue = phoneInput.value;
    const isValidPhone = /^0\d{9}$/.test(phoneValue);
    
    if (!isValidPhone) {
      formStatus.textContent = 'Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng số 0)';
      formStatus.className = 'form-status error';
      phoneInput.focus();
      return;
    }
    
    // Check if the form data is the same as previously submitted
    if (hasSubmitted === 'true' && isFormDataUnchanged()) {
      formStatus.textContent = 'Thông tin không thay đổi so với lần gửi trước';
      formStatus.className = 'form-status info';
      return;
    }
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    
    // Get form data
    const formData = new FormData(form);
    
    // Save form data to localStorage
    saveFormData(form);
    
    // Send form data to Google Forms
    fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSfyBqxsrJHH9OPo4vyk35IXTJfmars1wSA3Z8lUaYLUSFQpww/formResponse', {
      method: 'POST',
      mode: 'no-cors', // This is important to avoid CORS issues with Google Forms
      body: formData
    })
    .then(response => {
      // Since we're using no-cors, we won't get a proper response
      // So we'll just assume it was successful
      
      // Mark as submitted in localStorage
      localStorage.setItem('rsvpSubmitted', 'true');
      
      // Show success state
      showSuccessState();
      
      // Hide submit button
      submitBtn.style.display = 'none';
    })
    .catch(error => {
      console.error('Error:', error);
      
      // Show error message
      formStatus.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      formStatus.className = 'form-status error';
      
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gửi xác nhận';
    });
  });
  
  // Handle reset form button
  resetFormBtn.addEventListener('click', function() {
    // Hide success message
    formSuccess.classList.add('hidden');
    
    // Reset form status
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    
    // Reset localStorage submission status but keep the form data
    localStorage.removeItem('rsvpSubmitted');
    
    // Show submit button again
    submitBtn.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gửi xác nhận';
    
    // Update buttons
    updateAllRsvpButtons(false);
  });
  
  // Function to check if form data is unchanged from previous submission
  function isFormDataUnchanged() {
    const savedData = localStorage.getItem('rsvpFormData');
    if (!savedData) return false;
    
    const parsedData = JSON.parse(savedData);
    const currentData = getCurrentFormData();
    
    // Compare text inputs
    if (parsedData.textInputs) {
      for (const name in currentData.textInputs) {
        if (currentData.textInputs[name] !== parsedData.textInputs[name]) {
          return false;
        }
      }
    }
    
    // Compare radio buttons
    if (parsedData.radioGroups) {
      for (const name in currentData.radioGroups) {
        if (currentData.radioGroups[name] !== parsedData.radioGroups[name]) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  // Function to get current form data
  function getCurrentFormData() {
    const formData = {};
    
    // Get text inputs
    const textInputs = form.querySelectorAll('input[type="text"], input[type="tel"]');
    textInputs.forEach(input => {
      formData[input.name] = input.value;
    });
    
    // Get radio buttons
    const radioGroups = {};
    const radioButtons = form.querySelectorAll('input[type="radio"]:checked');
    radioButtons.forEach(radio => {
      radioGroups[radio.name] = radio.value;
    });
    
    return {
      textInputs: formData,
      radioGroups: radioGroups
    };
  }
  
  // Function to save form data to localStorage
  function saveFormData(form) {
    localStorage.setItem('rsvpFormData', JSON.stringify(getCurrentFormData()));
  }
  
  // Function to restore form data from localStorage
  function restoreFormData() {
    const savedData = localStorage.getItem('rsvpFormData');
    if (!savedData) return;
    
    const parsedData = JSON.parse(savedData);
    
    // Restore text inputs
    if (parsedData.textInputs) {
      Object.keys(parsedData.textInputs).forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) input.value = parsedData.textInputs[name];
      });
    }
    
    // Restore radio buttons
    if (parsedData.radioGroups) {
      Object.keys(parsedData.radioGroups).forEach(name => {
        const radio = form.querySelector(`[name="${name}"][value="${parsedData.radioGroups[name]}"]`);
        if (radio) radio.checked = true;
      });
    }
    
    // Validate phone input after restoration
    const phoneInput = document.getElementById('phone');
    if (phoneInput.value) {
      const isValid = /^0\d{9}$/.test(phoneInput.value);
      if (isValid) {
        phoneInput.classList.add('valid');
      } else {
        phoneInput.classList.add('invalid');
      }
    }
  }
  
  // Function to update all RSVP buttons
  function updateAllRsvpButtons(confirmed) {
    const allButtons = [openRsvpBtn, ...sectionRsvpBtns];
    
    allButtons.forEach(btn => {
      if (confirmed) {
        btn.querySelector('.text').textContent = "Đã xác nhận tham dự";
        btn.classList.add("confirmed");
        
        // Change icon to checkmark for confirmed state
        btn.querySelector('.icon svg').innerHTML = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>';
      } else {
        btn.querySelector('.text').textContent = "Xác nhận tham dự";
        btn.classList.remove("confirmed");
      }
    });
  }
  
  // Update showSuccessState function
  function showSuccessState() {
    // Show success message
    formSuccess.classList.remove('hidden');
    
    // Hide submit button
    submitBtn.style.display = 'none';
    
    // Update all buttons
    updateAllRsvpButtons(true);
  }
}

// Add to keyboard event listener
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    // Check if any modal is open
    const rsvpModal = document.getElementById("rsvpModal");
    const qrModal = document.getElementById("qrModal");
    const galleryModal = document.getElementById("galleryModal");
    
    if (rsvpModal.style.display === "block") {
      closeRsvpModal();
    }
    
    if (qrModal.style.display === "block") {
      closeQrModal();
    }
    
    if (galleryModal.style.display === "block") {
      closeModal();
    }
  }
});

// Add click outside to close
window.addEventListener('click', function(event) {
  const rsvpModal = document.getElementById("rsvpModal");
  if (event.target === rsvpModal) {
    closeRsvpModal();
  }
});
