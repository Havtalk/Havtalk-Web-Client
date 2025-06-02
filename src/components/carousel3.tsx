import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FastAverageColor } from 'fast-average-color'; // Restored
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" // Added Badge import
// import { Users } from 'lucide-react'; // Optional: if you want to add an icon for creator

type SlideProps = {
  image: string;
  title: string;
  description: string;
  personality?: string;
  specialty?: string;
  creator?: string;
  tags?: string[];
}

function Carousel3() {
  const [dominantColor, setDominantColor] = useState('rgba(0,0,0,0.5)'); // Restored
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  
  const slides: SlideProps[] = [
    {
      image: '/download__22_-removebg-preview (3).png',
      title: 'Sherlock Holmes',
      description: 'The world\'s greatest detective with exceptional powers of observation and deduction.',
      personality: 'Analytical, brilliant, and sometimes arrogant',
      specialty: 'Solving seemingly impossible mysteries',
      creator: 'detective_fan92',
      tags: ['Detective', 'Mystery', 'Victorian', 'British']
    },
    {
      image: '/download__19_-removebg-preview.png',
      title: 'Marie Curie',
      description: 'Pioneering physicist and chemist who conducted groundbreaking research on radioactivity.',
      personality: 'Determined, curious, and dedicated to science',
      specialty: 'Discovering radium and polonium',
      creator: 'science_history_buff',
      tags: ['Science', 'Physics', 'Nobel Prize', 'Pioneer']
    },
    {
      image: '/download__17_-removebg-preview.png',
      title: 'Albert Einstein',
      description: 'Revolutionary theoretical physicist who developed the theory of relativity.',
      personality: 'Imaginative, witty, and deeply philosophical',
      specialty: 'Quantum mechanics and theoretical physics',
      creator: 'physics_master',
      tags: ['Genius', 'Physics', 'Science', 'Nobel Prize']
    },
    {
      image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2031&q=80',
      title: 'Jane Austen',
      description: 'Beloved novelist known for her witty social commentary and masterful character development.',
      personality: 'Observant, ironic, and socially perceptive',
      specialty: 'Romantic fiction with sharp social critique',
      creator: 'literary_lover',
      tags: ['Literature', 'Classic', 'Romance', 'Writer']
    },
    {
      image: 'https://www.oilclothbytheyard.com/cdn/shop/products/OliclothByTheYard_Solids_White.jpg?v=1629600894',
      title: 'Leonardo da Vinci',
      description: 'Renaissance polymath whose areas of interest included invention, painting, sculpting, architecture, science, and more.',
      personality: 'Intensely curious, innovative, and forward-thinking',
      specialty: 'Blending art and science in revolutionary ways',
      creator: 'renaissance_art',
      tags: ['Artist', 'Inventor', 'Renaissance', 'Genius']
    },
  ];

  useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => { // Restored dominantColor logic
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    // Ensure slides[current] exists before accessing its properties
    if (slides && slides[current]) {
      img.src = slides[current].image;
    } else {
      // Fallback or handle error if slides[current] is undefined
      setDominantColor('rgba(0,0,0,0.5)');
      return;
    }
    
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
  }, [current, slides]);

  return (
    <div 
      className='relative w-full mx-auto h-[calc(100vh-10rem)] overflow-hidden rounded-xl shadow-2xl transition-all duration-500 ease-in-out'
      style={{ // Restored dynamic background style
        backgroundImage: `radial-gradient(circle at center, ${dominantColor}, rgba(0,0,0,0.8))`,
      }}
    >
      {/* Background blur effect with parallax */}
      <div 
        className="absolute inset-0 -z-10 transition-all duration-500 ease-in-out"
        style={{ 
          backgroundImage: (slides && slides[current]) ? `url(${slides[current].image})` : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) brightness(0.7)', // Restored original blur for dark theme
          transform: isTransitioning ? 'scale(1.1)' : 'scale(1.05)',
        }}
      ></div>
      
      {/* Overlay pattern removed for a cleaner look */}
      
      <Carousel 
        className='h-full'
        setApi={setApi}
        
        opts={{
          align: "center",
          loop: true,
          
        }}
        onTransitionStart={() => setIsTransitioning(true)}
        onTransitionEnd={() => setIsTransitioning(false)}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full flex items-center justify-center">
              <Card className="w-full h-full border-none bg-transparent">
                {/* Restored to md:flex-row for image on left, text on right */}
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12 lg:p-16 h-full w-full gap-8 md:gap-12">
                  {/* Image container */}
                  <div className="relative w-full h-[40vh] md:h-[80%] md:w-1/2 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-md lg:max-w-lg mx-auto">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="drop-shadow-2xl"
                        priority
                      />
                    </div>
                  </div>
                  
                  {/* Text content container */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 md:space-y-2 text-center md:text-left">
                    {slide.creator && (
                      <div className=" text-white/70 flex items-center justify-center md:justify-start">
                        {/* Optional: Icon like in light theme example */}
                        {/* <Users className="h-4 w-4 mr-1.5 text-white/60" /> */}
                        {/* <span className="font-medium text-white/90">76.8k chats</span>  */}
                        {/* <span className="mx-1.5 text-white/50">&bull;</span> */}
                        <span className="text-white/80">@{slide.creator}</span>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
                        {slide.title} 
                      </h3>
                      <div className="h-1 w-20 bg-white/40 mx-auto md:mx-0 mb-3 rounded-full"></div> {/* Subtle underline */}
                    </div>
                    
                    <p className="text-white/80 text-base md:text-lg leading-relaxed">
                      {slide.description}
                    </p>
                    
                    {/* Tags */}
                    {slide.tags && slide.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 my-3 justify-center md:justify-start">
                        {slide.tags.map((tag, i) => (
                          <Badge 
                            key={i} 
                            variant="default" 
                            className="rounded-full border-white/30 bg-white/30 hover:bg-white/40 text-white/90 px-3 py-1 text-xs sm:text-sm font-medium backdrop-blur-sm transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <Button 
                      className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-900 font-bold 
                                 py-3 px-8 md:px-10 rounded-full shadow-lg hover:shadow-xl
                                 transform transition-all duration-300 hover:scale-105 mt-2"
                    >
                      Chat Now 
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation arrows restored to sides */}
        <CarouselPrevious className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 
                                     bg-black/40 hover:bg-black/60 text-white 
                                     w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border border-white/20 shadow-lg" />
        <CarouselNext className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 
                                   bg-black/40 hover:bg-black/60 text-white 
                                   w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border border-white/20 shadow-lg" />
      
        {/* Indicator dots at bottom center, refined styling */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`rounded-full transition-all duration-300 ease-out
                ${
                  index === current 
                    ? 'w-2.5 h-2.5 bg-white shadow-md scale-110' // Active dot slightly larger, brighter
                    : 'w-2 h-2 bg-white/50 hover:bg-white/70' 
                }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to ${slides[index]?.title || `slide ${index + 1}`}`}
              title={slides[index]?.title || `slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}

export default Carousel3;