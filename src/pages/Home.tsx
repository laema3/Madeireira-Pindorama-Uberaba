import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { MissionVisionValues } from '../components/MissionVisionValues';
import { Products } from '../components/Products';
import { Testimonials } from '../components/Testimonials';
import { ContactForm } from '../components/ContactForm';
import { Location } from '../components/Location';

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <MissionVisionValues />
      <Products />
      <Testimonials />
      <div id="contato">
        <ContactForm />
        <Location />
      </div>
    </>
  );
}
