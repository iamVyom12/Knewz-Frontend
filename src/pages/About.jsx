import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import VerticalNavbar from './VerticalNavbar';

const About = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your email handling logic here
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">

            <VerticalNavbar />

            <div className="container mx-auto px-8 py-16 mt-8">
                
                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                    About Knewz
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-16"
                >
                    Knewz is your premier destination for reliable, up-to-the-minute news coverage.
                    We aggregate content from trusted sources worldwide, using advanced technology
                    to deliver personalized news that matters to you. Our platform ensures comprehensive
                    coverage across politics, technology, business, and culture, while maintaining the
                    highest standards of journalistic integrity. Experience news reading reimagined with
                    real-time updates and smart curation tailored to your interests.
                </motion.p>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feedback Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Give us a Feedback</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <Send size={20} />
                                Send Feedback
                            </button>
                        </form>
                    </motion.div>

                    {/* Map Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Find us on Map</h2>
                        <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.460991477304!2d73.19354017530412!3d22.29839884296442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5f65bc2a7e5%3A0x2082411428b284bf!2sFaculty%20of%20Technology%20and%20Engineering%20(FTE)%2C%20The%20Maharaja%20Sayajirao%20University%20of%20Baroda!5e0!3m2!1sen!2sin!4v1731989172018!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Reach out to us</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Mail className="text-blue-600" />
                                <a href="mailto:contact@knewz.com" className="text-gray-700 hover:text-blue-600">
                                    contact@knewz.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-blue-600" />
                                <a href="tel:+1234567890" className="text-gray-700 hover:text-blue-600">
                                    +91 9876 543 210
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-blue-600" />
                                <span className="text-gray-700">
                                    Vadodara, Gujarat, India
                                </span>
                            </div>

                            <div className="pt-6 border-t">
                                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Follow us</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Facebook size={24} />
                                        <span className="text-gray-700">
                                            facebook.com/knewz
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Twitter size={24} />
                                        <span className="text-gray-700">
                                            twitter.com/knewz
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Instagram size={24} />
                                        <span className="text-gray-700">
                                            instagram.com/knewz
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Linkedin size={24} />
                                        <span className="text-gray-700">
                                            linkedin.com/knewz
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
            );
};

export default About;