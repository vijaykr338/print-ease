import React from 'react'
import Nav from "@/components/home/Nav"
import Hero from '@/components/home/Hero'
import FeaturesSection from '@/components/home/FeatureSection'
import HowItWorksPage from '@/components/home/HowItWorksPage'
import FaqSection from '@/components/home/FAQs'
import BenefitsSection from '@/components/home/Benefits'
import TestimonialsAndStats from '@/components/home/Testimonials'
const Page = () => {
  return (
    <>
    
    <Hero/>
    <HowItWorksPage/>
    <FeaturesSection/>
    <FaqSection/>
    {/* <BenefitsSection/> */}

    </>
  )
}

export default Page