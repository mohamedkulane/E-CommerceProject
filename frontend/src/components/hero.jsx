import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <div className="bg-gradient-to-r from-green-100 to-green-100 py-16 px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2 space-y-8">
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                        Welcome to SuperMarket Online
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Discover a wide range of health products, household items, and more. 
                        Shop from the comfort of your home with our easy-to-use web application.
                    </p>
                    <div className="flex gap-6 items-center">
                        <Link to="/products"><button className="bg-[#FF9800] hover:bg-[#FFC107] text-gray-900 px-10 py-3 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                            Shop Now
                        </button></Link>
                       <Link to="/categories"> <button className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-[#FFD700] px-10 py-3 rounded-full font-semibold text-lg transition-all">
                            Browse Categories
                        </button></Link>
                    </div>
                </div>
                <div className="md:w-1/2">
                    <img 
                        className="w-full max-w-lg rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300"
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        alt="Supermarket Shopping"
                    />
                </div>
            </div>
        </div>
    );
}