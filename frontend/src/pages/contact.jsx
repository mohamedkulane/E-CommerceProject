import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdAccessTime } from "react-icons/md";
import Footer from "../components/Footer";
import Header from "../components/header";

export const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header/>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Contact Us
          </h1>
          <p className="text-center text-gray-100 text-lg max-w-3xl mx-auto">
            Get in touch with us. We're here to help you with any questions or
            concerns.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#FF9800]">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#E8F5E9] p-3 rounded-full">
                    <MdLocationOn className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Our Address
                    </h3>
                    <p className="text-gray-600">
                      TCE Market Street, Cityville, ST 12583
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#E8F5E9] p-3 rounded-full">
                    <FaPhone className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Phone Number
                    </h3>
                    <p className="text-gray-600">(123) 01637991</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#E8F5E9] p-3 rounded-full">
                    <MdEmail className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Email Address
                    </h3>
                    <p className="text-gray-600">info@apomarket.com</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#E8F5E9] p-3 rounded-full">
                    <MdAccessTime className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Working Hours
                    </h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                      <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Get in Touch Card */}
            <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-gray-100">
                When you can take it from you, where have you come inside me.
                We're always here to listen and help.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#FF9800]">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">
                Send us a message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your Full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your Email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a Subject"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Enter your message"
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-[#FF9800] to-[#FFB74D] hover:from-[#F57C00] hover:to-[#FF9800] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <FaPaperPlane className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>


      </div>

      <Footer />
    </div>
  );
};
