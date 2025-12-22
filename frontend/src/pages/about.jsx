import Header from "../components/header";

// src/pages/About.jsx
export default function About() {
  return <div>
    
    <Header/>
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>

      {/* Intro Section */}
      <div className="text-center mb-12">
        <p className="text-lg text-gray-700 leading-relaxed">
          Welcome to <span className="font-semibold text-yellow-500">Gatitaa</span>, 
          your trusted e-commerce platform. We are here to provide you with the best
          products, secure transactions, and customer-friendly services. 
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div className="p-6 bg-yellow-50 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-yellow-600">Our Vision</h2>
          <p className="text-gray-600">
            To create a world-class marketplace where customers can shop
            seamlessly and sellers can grow their businesses with confidence.
          </p>
        </div>
        <div className="p-6 bg-yellow-50 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-yellow-600">Our Mission</h2>
          <p className="text-gray-600">
            Deliver high-quality products with a smooth shopping experience, 
            while ensuring trust, security, and innovation in every step.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <img
              src="https://i.pinimg.com/736x/e8/e6/41/e8e64141f4c0ae39c32f9701ccea9a2e.jpg"
              alt="Team member"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-lg font-bold text-center">Ahmed Ali</h3>
            <p className="text-center text-gray-500">Founder & CEO</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <img
              src="https://i.pinimg.com/1200x/4b/cc/54/4bcc54ebe6d0e6700e3df3047c1129c8.jpg"
              alt="Team member"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-lg font-bold text-center">Maryan Yusuf</h3>
            <p className="text-center text-gray-500">Head of Marketing</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition">
            <img
              src="https://i.pinimg.com/1200x/8c/73/cb/8c73cbf28dfb4375e8839253d04890d8.jpg"
              alt="Team member"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-lg font-bold text-center">Faadumo Cabdi</h3>
            <p className="text-center text-gray-500">Lead Developer</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-gray-500 italic">
          “We believe in customer satisfaction and building trust every day.”
        </p>
      </div>
    </div>
  </div>
}
