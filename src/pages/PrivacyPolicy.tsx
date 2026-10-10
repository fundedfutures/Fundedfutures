import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Introduction",
      content: "At fundED futures, we are committed to protecting the privacy and security of our users. This Privacy Policy explains who we are, what information we collect, and how we use and protect your personal data when you use our website and services."
    },
    {
      title: "Information We Collect",
      content: "We collect information that you voluntarily provide to us when you interact with our website. This includes names, email addresses, donation amounts, and other basic personal details submitted through our newsletter sign-up forms, contact forms, and the donation process."
    },
    {
      title: "How We Use Your Information",
      content: "The information we collect is used to: process and acknowledge your donations, send you activity updates and impact reports via email, improve our website functionality and user experience, and ensure compliance with our legal and regulatory obligations."
    },
    {
      title: "Third-Party Payment Processors",
      content: "All financial donations are handled securely by regulated third-party payment providers. We do not store or have access to your full payment card details or bank account information. These providers maintain their own privacy policies which govern how they handle your financial information."
    },
    {
      title: "Data Sharing",
      content: "We do not sell, rent, or trade your personal data with third parties for marketing purposes. We may share your data with trusted service providers who assist us in our operations (such as email delivery services) or when we are legally required to do so by law enforcement or regulatory authorities."
    },
    {
      title: "User Rights",
      content: "In accordance with Kenya's Data Protection Act (2019) and global data protection standards, you have the right to access the personal data we hold about you, request corrections to inaccurate data, or request the deletion of your data. To exercise these rights, please contact us."
    },
    {
      title: "Cookies",
      content: "With your consent, Google Analytics collects page visits, referral sources, device information, and website interactions to help us improve this site. Analytics stays disabled if you reject it. We do not send form answers, names, email addresses, phone numbers, or donation transaction codes to analytics. You can change your choice using Cookie Preferences below."
    },
    {
      title: "Data Security",
      content: "We implement reasonable technical and organizational security measures designed to protect your personal data from unauthorized access, loss, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
    },
    {
      title: "Contact Us",
      content: "If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact our privacy team at: fundedfuturesorg@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-[5%] text-deep-slate">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-forest-green font-semibold mb-12 hover:gap-3 transition-all">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-forest-green font-bold text-sm tracking-widest uppercase mb-4">Legal Foundation</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-text mb-12 font-medium">Last updated: April 2026</p>

          <button type="button" onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))} className="text-forest-green font-semibold underline mb-8">Cookie Preferences</button>
          <div className="space-y-12">
            {sections.map((section, idx) => (
              <section key={idx} className="border-b border-gray-100 pb-8 last:border-0">
                <h2 className="text-2xl font-display font-bold mb-4">{section.title}</h2>
                <p className="text-lg text-muted-text leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
