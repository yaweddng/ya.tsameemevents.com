import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: "What is the average cost of a luxury wedding in Dubai?",
      answer: "A luxury wedding in Dubai typically starts from AED 100,000 and can go up to several millions depending on the venue, number of guests, and level of customization. Our planning fees start from AED 22,000."
    },
    {
      question: "Do you handle outdoor weddings in Dubai during summer?",
      answer: "While outdoor weddings are popular from October to April, we recommend indoor venues or specialized temperature-controlled tents for the summer months (May to September) to ensure guest comfort."
    },
    {
      question: "Can you help with legal wedding registration in the UAE?",
      answer: "Yes, we provide guidance on the legal requirements for civil and religious marriages in Dubai for various nationalities, though the couple must personally attend certain government appointments."
    },
    {
      question: "What are the most popular luxury wedding venues in Dubai?",
      answer: "Popular venues include the Burj Al Arab, Armani Hotel Dubai, One&Only Royal Mirage, and various desert resorts like Bab Al Shams for a more traditional yet luxury feel."
    },
    {
      question: "Do you offer destination wedding planning for couples outside the UAE?",
      answer: "Absolutely! We specialize in destination weddings, handling everything from guest accommodation and transport to local vendor management for couples flying into Dubai for their big day."
    },
    {
      question: "How long does it take to plan a wedding with YA Wedding?",
      answer: "We recommend starting the planning process 1 to 3 months in advance. However, we have successfully executed luxury weddings in as little as 1-3 Week for shorter timelines."
    },
    {
      question: "Do you offer custom wedding packages?",
      answer: "Yes, we are ready to plan weddings according to our customers' choice, budget, and timeframe. We specialize in creating custom wedding packages tailored specifically to your unique vision and requirements."
    },
    {
      question: "What is your policy on vendor selection?",
      answer: "We have a curated list of premium vendors in Dubai, but we are always open to working with new vendors that meet our high standards of quality and reliability."
    },
    {
      question: "Do you provide on-site coordination on the wedding day?",
      answer: "Yes, our team provides full on-site coordination from early morning setup until the last guest leaves, ensuring everything runs perfectly according to plan."
    },
    {
      question: "What is the best time of year for a wedding in Dubai?",
      answer: "The peak wedding season in Dubai is from November to March when the weather is pleasant and perfect for outdoor celebrations. April and October are also popular shoulder months."
    },
    {
      question: "Do you handle traditional Emirati weddings?",
      answer: "Yes, we have extensive experience in planning traditional Emirati weddings, including separate ladies' and men's celebrations, and adhering to all cultural protocols and traditions."
    },
    {
      question: "Are there any specific cultural considerations for weddings in Dubai?",
      answer: "Dubai is a multicultural hub, but it's important to respect local customs. We advise on appropriate dress codes, music volume, and alcohol licensing requirements for different venues."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="pt-32 pb-24">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block bg-brand/10 text-brand px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Common Questions
          </div>
          <h1 className="text-5xl font-bold">
            Dubai Wedding <span className="font-script text-gradient-brand text-6xl lowercase animate-float inline-block">FAQ</span>
          </h1>
          <p className="text-gray-400">Everything you need to know about planning your luxury celebration in the UAE.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 10 }}
              className="glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-brand/30 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-bold pr-8">{faq.question}</span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                  {openIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              {openIndex === idx && (
                <div className="px-8 pb-8 text-gray-400 leading-relaxed">
                  <div className="h-px bg-white/10 mb-6" />
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-20 glass-card p-12 rounded-[40px] text-center space-y-6">
          <HelpCircle className="text-brand mx-auto" size={48} />
          <h3 className="text-2xl font-bold">Still have questions?</h3>
          <p className="text-gray-400">Our expert planners are here to help you with any specific queries you might have.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://wa.me/971505588842" 
              className="relative group overflow-hidden bg-brand text-dark px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-brand/20 transition-all animate-fast-pulse animate-border-glow border-2 border-brand/20 flex items-center justify-center"
            >
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">WhatsApp</span>
            </a>
            <a 
              href="/contact" 
              className="bg-white/5 text-white border border-white/10 px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all animate-border-glow animate-fast-pulse flex items-center justify-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
