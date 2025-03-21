import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Ensure autoplay CSS is imported
import axios from 'axios';
// import img1 from '../assets/Convention-Center-2.webp.jpg';
import img1 from '../assets/Convention-Center-2.webp'
import img2 from '../assets/Library-page-image.webp'
// import img2 from '../assets/Library-page-image.webp.
import img3 from '../assets/Gym-1.webp';
import img4 from '../assets/foodcourt.webp';
import img5 from '../assets/Sports-2.webp';
import img6 from '../assets/Untitled 1.png';
import img7 from '../assets/porkumaran.jpg'
import img8 from '../assets/coursera.jpg'
import img9 from '../assets/workshop.jpg'
import img10 from '../assets/img1.jpg';
import img11 from '../assets/img11.jpg';
import img12 from '../assets/img12.jpg';
function UserCarousel() {
  const [sampleImages] = useState([
    'https://images.unsplash.com/photo-1682685797769-481b48222adf?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920', // Nature
    'https://images.unsplash.com/photo-1695653422902-1bea566871c6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920', // City
    'https://images.unsplash.com/photo-1696944090798-9a7b8b1b1b1b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920', // Technology
    'https://images.unsplash.com/photo-1696944090798-9a7b8b1b1b1b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920'  // Abstract
  ]);
  const images = [img8 , img9,img10,img7,img1,img11, img2, img4,img12];

  

  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
    <div className="absolute left-5 bottom-5 bg-white/10 backdrop-blur-lg rounded-xl p-3 z-50 ">
        
          <img src={img6} className='w-35 h-35' alt='qrcode'/>
        
      </div>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{
          delay: 4000,          // 3 seconds between slides
        //   disableOnInteraction: false, // Continue autoplay after user interaction
        //   pauseOnMouseEnter: true // Pause on hover
        }}
        speed={1000}            // 1 second transition duration
        loop={true}             // Enable infinite looping
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ clickable: true }}
        className="w-full h-screen"
      >
        {images.map((imgUrl, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={imgUrl}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-contain transition-opacity duration-1000 "
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1920x1080?text=Image+Not+Found'; // Fallback image
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="swiper-button-next !text-white !right-8 hover:!scale-110 transition-transform" />
      <div className="swiper-button-prev !text-white !left-8 hover:!scale-110 transition-transform" />

      {/* QR Code */}
      
    </div>
  );
}

export default UserCarousel;