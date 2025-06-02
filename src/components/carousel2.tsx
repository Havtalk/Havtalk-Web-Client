import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FastAverageColor } from 'fast-average-color';

type SlideProps = {
  image: string;
  title: string;
  description: string;
}

function Carousel2() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dominantColor, setDominantColor] = useState('rgba(0,0,0,0.5)');
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const slides: SlideProps[] = [
    {
      image: '/download__22_-removebg-preview (3).png',
      title: 'First Slide',
      description: 'Description for first slide'
    },
    {
      image: '/download__19_-removebg-preview.png',
      title: 'Second Slide',
      description: 'Description for second slide'
    },
    {
      image: '/download__17_-removebg-preview.png',
      title: 'Third Slide',
      description: 'Description for third slide'
    },
    {
      image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2031&q=80',
      title: 'Fourth Slide',
      description: 'Description for fourth slide'
    },
    {
      image: '/download__23_-removebg-preview.png',
      title: 'Fifth Slide',
      description: 'Description for fifth slide'
    },
  ];

//   useEffect(() => {
//     // Track transition between slides
//     if (prevIndex !== currentIndex) {
//       setIsTransitioning(true);
//       const timer = setTimeout(() => {
//         setIsTransitioning(false);
//       }, 500); // Match this with the CSS transition duration
      
//       setPrevIndex(currentIndex);
//       return () => clearTimeout(timer);
//     }
//   }, [currentIndex, prevIndex]);

  useEffect(() => {
    // Extract color from image
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = slides[currentIndex].image;
    
    img.onload = async () => {
      const fac = new FastAverageColor();
      try {
        const color = await fac.getColorAsync(img);
        // Create a more vibrant background with the dominant color
        setDominantColor(`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.7)`);
      } catch (e) {
        console.error('Error getting color:', e);
        setDominantColor('rgba(0,0,0,0.5)');
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image');
      setDominantColor('rgba(0,0,0,0.5)');
    };
  }, [currentIndex, slides]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className='relative w-full mx-auto h-[calc(100vh-6rem)] overflow-hidden rounded-xl shadow-2xl transition-all duration-500 ease-in-out'
      style={{
        backgroundImage: `radial-gradient(circle at center, ${dominantColor}, rgba(0,0,0,0.8))`,
      }}
    >
      {/* Background blur effect with parallax */}
      <div 
        className="absolute inset-0 -z-10 transition-all duration-500 ease-in-out"
        style={{ 
          backgroundImage: `url(${slides[currentIndex].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) brightness(0.7)',
        //   transform: isTransitioning ? 'scale(1.1)' : 'scale(1.05)',
        }}
      ></div>
      
      {/* Overlay pattern */}
      <div 
        className="absolute inset-0 -z-5 opacity-20"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="%23ffffff" fill-opacity="0.1"/%3E%3C/svg%3E")',
          backgroundSize: '15px 15px',
        }}
      ></div>
      
      {/* Main carousel content with slide transition */}
      <div className="relative z-10 h-full flex items-center justify-center p-8">
        <div 
          className={`relative w-4/5 h-4/5 transition-all duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <Image 
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            fill
            className="object-contain drop-shadow-2xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            onError={() => setImageError(true)}
            unoptimized={slides[currentIndex].image.startsWith('http')}
          />
          {/* {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-800">
              <p>Image could not be loaded</p>
            </div>
          )} */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 backdrop-blur-sm rounded-b-xl">
            <h2 className="text-2xl font-bold text-white mb-2">{slides[currentIndex].title}</h2>
            <p className="text-white/90">{slides[currentIndex].description}</p>
          </div>
        </div>
      </div>
      
      {/* Improved navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full z-20 flex items-center justify-center backdrop-blur-md transition-all duration-300 border border-white/20"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full z-20 flex items-center justify-center backdrop-blur-md transition-all duration-300 border border-white/20"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Improved indicator dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125 shadow-glow' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel2