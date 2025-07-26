'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroHighlight} from '../../components/ui/hero-highlight';
import { motion } from 'framer-motion';
import { ExpandableCard } from '../../components/ui/expandable_card';
import { DraggableCardBody, DraggableCardContainer } from '../../components/ui/draggable-card';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (res.ok) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);


    const items = [
    {
      title: "Event 1",
      image:
        "https://www.madebywifi.com/wp-content/uploads/2018/01/internet-for-hackatons-1024x480.jpg",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: "Event 2",
      image:
        "https://analyticsindiamag.com/wp-content/uploads/2018/03/h_51669020-e1520416050635.jpg",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      title: "Event 3",
      image:
        "https://www.aboutprstudio.com/wp-content/uploads/2025/01/hackathons.jpg",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: "Event 4",
      image:
        "https://www.wework.com/ideas/wp-content/uploads/sites/4/2013/12/hack-ny-hackathon.jpg?fit=631%2C419",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: "Event 5",
      image:
        "https://media.wired.com/photos/5932e854f682204f73697e7f/3:2/w_2560%2Cc_limit/hack.jpg",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: "Event 6",
      image:
        "https://www.madebywifi.com/wp-content/uploads/2018/01/internet-for-hackatons-1024x480.jpg",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: "Event 7",
      image:
        "https://www.aboutprstudio.com/wp-content/uploads/2025/01/hackathons.jpg",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
  ];

  const eventCards = events.map(event => ({
    description: event.description,
    title: event.name,
    // ✅ Use dynamic image or fallback
    src: event.imageUrl || "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: event.votingOpen ? 'Vote Now' : 'View Results',
    ctaLink: `/dashboard?eventId=${event._id}`,
    content: () => (
      <div>
        <p>
          This event is currently{" "}
          <span className={event.votingOpen ? "text-green-500" : "text-red-500"}>
            {event.votingOpen ? "open" : "closed"}
          </span>{" "}
          for voting.
        </p>
        <p className="mt-4">{event.description}</p>
      </div>
    ),
  }));

  if (loading) {
    return <div className="text-center p-10">Loading events...</div>;
  }

  return (
    <>
<DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
  {/* HeroHighlight as background */}
  <div className="absolute inset-0 z-0 pointer-events-none">
    <HeroHighlight />
  </div>

  {/* Draggable cards (on top) */}
  <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800 z-10">
    Vote for your Teams....
  </p>

  {items.map((item) => (
    <DraggableCardBody key={item.title} className={`${item.className} z-10`}>
      <img
        src={item.image}
        alt={item.title}
        className="pointer-events-none relative h-80 w-80 object-cover"
      />
      <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
        {item.title}
      </h3>
    </DraggableCardBody>
  ))}
</DraggableCardContainer>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-8"
      >
        <ExpandableCard
          cards={eventCards}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        />
      </motion.div>
    </>
  );
};

export default EventsPage;