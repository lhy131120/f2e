// Page Loader - Wait for all images to load
class PageLoader {
  constructor() {
    this.loader = document.getElementById('page-loader');
    this.mainContent = document.getElementById('main-content');
    this.progressBar = document.querySelector('.loader-progress-bar');
    this.loaderText = document.querySelector('.loader-text');
    
    this.totalImages = 0;
    this.loadedImages = 0;
    this.images = [];
    
    this.init();
  }
  
  init() {
    // Find all images on the page
    this.findImages();
    
    // If no images found, hide loader immediately
    if (this.totalImages === 0) {
      this.hideLoader();
      return;
    }
    
    // Start loading images
    this.loadImages();
  }
  
  findImages() {
    // Get all img elements
    const imgElements = document.querySelectorAll('img');
    
    // Get background images from CSS
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const computedStyle = window.getComputedStyle(heroSection);
      const backgroundImage = computedStyle.backgroundImage;
      if (backgroundImage && backgroundImage !== 'none') {
        // Extract URL from background-image
        const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch) {
          this.addImage(urlMatch[1]);
        }
      }
    }
    
    // Add all img elements
    imgElements.forEach(img => {
      if (img.src) {
        this.addImage(img.src);
      }
    });
  }
  
  addImage(src) {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      this.imageLoaded();
    };
    
    img.onerror = () => {
      // Even if image fails to load, count it as loaded to prevent infinite loading
      this.imageLoaded();
    };
    
    this.images.push(img);
    this.totalImages++;
  }
  
  loadImages() {
    // Update initial progress
    this.updateProgress();
    
    // Set a timeout to hide loader if images take too long (5 seconds)
    setTimeout(() => {
      if (this.loadedImages < this.totalImages) {
        console.warn('Some images took too long to load, hiding loader anyway');
        this.hideLoader();
      }
    }, 5000);
  }
  
  imageLoaded() {
    this.loadedImages++;
    this.updateProgress();
    
    if (this.loadedImages >= this.totalImages) {
      // All images loaded, hide loader after a short delay
      setTimeout(() => {
        this.hideLoader();
      }, 500);
    }
  }
  
  updateProgress() {
    const progress = (this.loadedImages / this.totalImages) * 100;
    this.progressBar.style.width = `${progress}%`;
    
    // Update loading text
    this.loaderText.textContent = `Loading... ${this.loadedImages}/${this.totalImages}`;
  }
  
  hideLoader() {
    // Hide the loader
    this.loader.classList.add('hidden');
    
    // Show the main content
    this.mainContent.classList.remove('hidden');
    this.mainContent.classList.add('fade-in');
    
    // Remove loader from DOM after animation
    setTimeout(() => {
      if (this.loader.parentNode) {
        this.loader.parentNode.removeChild(this.loader);
      }
    }, 500);
  }
}

// Initialize the page loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PageLoader();
}); 