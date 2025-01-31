import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

export function SwiperComponent() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper w-full h-full"
      >
        <SwiperSlide className="text-center text-md  flex justify-center items-center">
          <Image
            height={500}
            width={500}
            src="https://res.cloudinary.com/dlqooiewh/image/upload/v1738330481/uploads/odis8drmnbkg7cdqwijv.jpg"
            alt=""
            className="h-full w-full object-fill max-md:object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export function TeamSwiper() {
  return (
    <>
      <Swiper
        centeredSlides={true}
        slidesPerView={1} // Default value for smaller screens
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          // When the screen size is at least 768px (md)
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
            centeredSlides: false,
          },
          // When the screen size is at least 1280px (xl)
          1280: {
            slidesPerView: 3,
            spaceBetween: 50,
            centeredSlides: false,
          },
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper w-full h-full"
      >
        <SwiperSlide className="text-center text-md flex justify-center items-center bg-white rounded-md">
          <Image
            height={500}
            width={500}
            src="/IMG_20250115_095442736_HDR_AE.jpg"
            alt=""
            className="h-full w-full object-fill rounded-md"
          />
        </SwiperSlide>
        <SwiperSlide className="text-center text-md flex justify-center items-center bg-white rounded-md">
          <Image
            height={500}
            width={500}
            src="/IMG_20250121_165913289_HDR_AE.jpg"
            alt=""
            className="h-full w-full object-fill rounded-md"
          />
        </SwiperSlide>
        <SwiperSlide className="text-center text-md flex justify-center items-center bg-white rounded-md">
          <Image
            height={500}
            width={500}
            src="/IMG_20250121_151024453_HDR_AE.jpg"
            alt=""
            className="h-full w-full object-fill rounded-md"
          />
        </SwiperSlide>
        <SwiperSlide className="text-center text-md flex justify-center items-center bg-white rounded-md">
          <Image
            height={500}
            width={500}
            src="/IMG_20250115_102250269_HDR_AE.jpg"
            alt=""
            className="h-full w-full object-fill rounded-md"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
