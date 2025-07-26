"use client";
import React from "react";
import Image from "next/image";
import { HeroParallax } from "../../components/ui/hero-parallax";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";
import { LinkPreview } from "../../components/ui/link-preview";
import { Carousel } from "../../components/ui/carousel";

export default function LandingPage() {
  const products = [
    {
      id: "event-1",
      title: "Event",
      link: "/events",
      thumbnail:
        "https://www.madebywifi.com/wp-content/uploads/2018/01/internet-for-hackatons-1024x480.jpg",
    },
    {
      id: "event-2",
      title: "Event",
      link: "/events",
      thumbnail:
        "https://analyticsindiamag.com/wp-content/uploads/2018/03/h_51669020-e1520416050635.jpg",
    },
    {
      id: "event-3",
      title: "Event",
      link: "/events",
      thumbnail:
        "https://www.aboutprstudio.com/wp-content/uploads/2025/01/hackathons.jpg",
    },
    {
      id: "event-4",
      title: "Event",
      link: "/events",
      thumbnail:
        "https://www.wework.com/ideas/wp-content/uploads/sites/4/2013/12/hack-ny-hackathon.jpg?fit=631%2C419",
    },
    {
      id: "event-5",
      title: "Event",
      link: "/events",
      thumbnail:
        "https://media.wired.com/photos/5932e854f682204f73697e7f/3:2/w_2560%2Cc_limit/hack.jpg",
    },
    {
      id: "event-6",
      title: "Event",
      link: "/events",
      thumbnail:
        "https://www.ripe.net/media/images/Untitled_design_5.2e16d0ba.fill-720x405-c25.format-webp.webp",
    },
    {
      id: "event-7",
      title: "Event",
      link: "/events",
      thumbnail:
        "https://blog.mettl.com/wp-content/uploads/2020/05/Blog20Hackathon_2_1200x620-08-16.jpg",
    },
  ];

   const slides = [
    {
      title: "Event 1",
      button: "Learn More",
      src: "https://www.madebywifi.com/wp-content/uploads/2018/01/internet-for-hackatons-1024x480.jpg",
    },
    {
      title: "Event 2",
      button: "Learn More",
      src: "https://analyticsindiamag.com/wp-content/uploads/2018/03/h_51669020-e1520416050635.jpg",
    },
    {
      title: "Event 3",
      button: "Learn More",
      src: "https://www.aboutprstudio.com/wp-content/uploads/2025/01/hackathons.jpg",
    },
    {
      title: "Event 4",
      button: "Learn More",
      src: "https://www.wework.com/ideas/wp-content/uploads/sites/4/2013/12/hack-ny-hackathon.jpg?fit=631%2C419",
    },
    {
      title: "Event 5",
      button: "Learn More",
      src: "https://media.wired.com/photos/5932e854f682204f73697e7f/3:2/w_2560%2Cc_limit/hack.jpg",
    },
  ];


return (
    <main className=" flex flex-col items-center justify-center overflow-x-hidden w-full">
      <HeroParallax products={products} />

      <div className="py-20">
        <Carousel slides={slides} autoplay={true}  />
      </div>

      <div className="w-full overflow-x-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Seamless Management <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  For Every Event
                </span>
              </h1>
            </>
          }
        >
          <Image
            src="https://media.licdn.com/dms/image/v2/D4E22AQF0tugdwQ_hyQ/feedshare-shrink_2048_1536/B4EZWuK_AyGYBA-/0/1742383872980?e=1756339200&v=beta&t=0piJPz37wOstpYYf4MHrLJ613_uJkdqGsxt0VKy6yeg"
            alt="hero"
            height={720}
            width={1400}
            unoptimized
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>

<div className="w-full flex flex-col pb-10 items-center  justify-start text-center">
  <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4">
    Meet the Innovators
  </h2>
  <div className="max-w-2xl text-base md:text-xl dark:text-gray-500">
    <span>Ready to see the brilliant teams competing? </span>
    <LinkPreview
      url="/events"
      isStatic
      imageSrc="/src/assets/images/team_image.png"
      className="font-bold text-black dark:text-white underline cursor-pointer hover:text-black"
    >
      Explore the Teams
    </LinkPreview>
    <span> and cast your vote to support your favorite project.</span>
  </div>
</div>
    </main>
  );
}