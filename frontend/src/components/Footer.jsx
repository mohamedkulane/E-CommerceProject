import { Link } from "react-router-dom";
import { 
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPaperPlane
} from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Products", path: "/products" },
        { name: "Categories", path: "/categories" },
        { name: "Contact Us", path: "/contact" }
    ];

    const categories = [
        "Milk",
        "Food", 
        "Vegetables",
        "Meat",
        "Electronics",
        "Clothes",
        "Sneakers"
    ];

    const socialLinks = [
        { icon: <FaFacebookF />, url: "#" },
        { icon: <FaTwitter />, url: "#" },
        { icon: <FaInstagram />, url: "#" }
    ];

    const handleNewsletter = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        if(email) {
            alert(`Thank you for subscribing with: ${email}`);
            e.target.reset();
        }
    };

    return (
        <footer className="bg-[#1B5E20] text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
                    {/* Company Info - Centered on mobile */}
                    <div className="text-center sm:text-left space-y-3 md:space-y-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">SuperMarket Online</h2>
                        <p className="text-gray-200 text-sm sm:text-base px-4 sm:px-0">
                            Your one-stop shop for all your daily needs. Quality products at affordable prices delivered to your doorstep.
                        </p>
                        <div className="flex justify-center sm:justify-start gap-2 md:gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#FF9800] rounded-full flex items-center justify-center text-white hover:bg-[#F57C00] transition-colors text-sm sm:text-base"
                                    aria-label={`Follow us on ${social.icon.type.displayName}`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - Centered */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 md:mb-6 text-[#FF9800]">Quick Links</h3>
                        <ul className="space-y-2 md:space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        to={link.path}
                                        className="text-gray-200 hover:text-[#FF9800] transition-colors text-sm sm:text-base block py-1"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories - Centered */}
                    <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 md:mb-6 text-[#FF9800]">Categories</h3>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 md:gap-3">
                            {categories.map((category) => (
                                <li key={category}>
                                    <a 
                                        href="#" 
                                        className="text-gray-200 hover:text-[#FF9800] transition-colors text-sm sm:text-base block py-1"
                                    >
                                        {category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info - Centered */}
                    <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 md:mb-6 text-[#FF9800]">Contact Us</h3>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <FaMapMarkerAlt className="text-[#FF9800] flex-shrink-0" />
                                <span className="text-gray-200 text-sm sm:text-base">TCE Market Street, Cityville</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <FaPhone className="text-[#FF9800] flex-shrink-0" />
                                <span className="text-gray-200 text-sm sm:text-base">(123) 016-37991</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <FaEnvelope className="text-[#FF9800] flex-shrink-0" />
                                <span className="text-gray-200 text-sm sm:text-base break-words">info@supermarketonline.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter - Centered */}
                <div className="bg-white/10 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-lg md:text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
                        <p className="text-gray-200 text-sm md:text-base mb-4">Get updates on new products and special offers!</p>
                        <form onSubmit={handleNewsletter} className="w-full">
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Enter your email" 
                                    className="px-4 py-2 md:py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9800] text-sm md:text-base w-full sm:w-64 md:w-72"
                                    required
                                    aria-label="Email address for newsletter subscription"
                                />
                                <button 
                                    type="submit"
                                    className="bg-[#FF9800] hover:bg-[#F57C00] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base"
                                >
                                    <FaPaperPlane className="text-xs md:text-sm" />
                                    <span>Subscribe</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Copyright - Centered */}
                <div className="pt-6 md:pt-8 border-t border-white/10 text-center">
                    <div className="flex flex-col items-center gap-4 md:gap-6">
                        <div>
                            <p className="text-gray-300 text-sm sm:text-base">
                                &copy; {currentYear} <span className="text-[#FF9800] font-semibold">Apo Market</span>. All rights reserved.
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">Designed with ❤️ for convenient shopping</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                            <Link to="/privacy" className="text-gray-300 hover:text-[#FF9800] transition-colors text-xs sm:text-sm">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-300 hover:text-[#FF9800] transition-colors text-xs sm:text-sm">
                                Terms of Service
                            </Link>
                            <Link to="/sitemap" className="text-gray-300 hover:text-[#FF9800] transition-colors text-xs sm:text-sm">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Centered */}
            <div className="bg-[#0D3B1E] py-3 md:py-4">
                <div className="container mx-auto px-4">
                    <p className="text-gray-400 text-xs sm:text-sm text-center px-2">
                        Growing up and buying the market for customers. Quality products for everyone.
                    </p>
                </div>
            </div>
        </footer>
    );
}