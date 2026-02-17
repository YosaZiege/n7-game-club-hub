import React from 'react';
import { Search, MapPin, Calendar, Users, Star, ChevronDown, ArrowRight, ArrowDown } from 'lucide-react';

const MoroccoLandingPage = () => {
  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-x-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1489493585363-d69421e0dee3?auto=format&fit=crop&q=80&w=2000')`,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <MapPin className="w-6 h-6" />
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="hover:text-cyan-400 transition">Destinations</a>
          <a href="#" className="hover:text-cyan-400 transition">Packages</a>
          <a href="#" className="hover:text-cyan-400 transition">Explore Map</a>
          <button className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full hover:bg-white/30 transition">
            Contact Us
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 px-8 lg:px-16 pt-12 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text */}
        <div className="max-w-xl">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] tracking-widest uppercase mb-6">
            <span className="text-green-400 mr-2">•</span> Discover Authentic Morocco
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
            Journey Through <br />
            <span className="text-cyan-400">Morocco's Magic</span>
          </h1>
          
          <p className="text-gray-200 text-lg mb-10 leading-relaxed">
            From the golden dunes of Sahara to the blue streets of Chefchaouen, 
            experience curated journeys that capture Morocco's soul.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-4 rounded-full flex items-center gap-2 transition shadow-lg shadow-cyan-500/20">
              Start Your Journey <ArrowRight size={18} />
            </button>
            <button className="border border-white/40 hover:bg-white/10 backdrop-blur-md px-8 py-4 rounded-full flex items-center gap-2 transition">
              Explore Packages
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-12">
            <div>
              <div className="flex items-center gap-1 text-2xl font-bold">
                <Star className="text-yellow-400 fill-yellow-400" size={20} /> 4.9
              </div>
              <p className="text-gray-400 text-sm">Rating</p>
            </div>
            <div>
              <div className="text-2xl font-bold">50K+</div>
              <p className="text-gray-400 text-sm">Happy Travelers</p>
            </div>
            <div>
              <div className="text-2xl font-bold">200+</div>
              <p className="text-gray-400 text-sm">Destinations</p>
            </div>
          </div>
        </div>

        {/* Right Column: Search Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6">Find Your Adventure</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 mb-2 block uppercase tracking-wider">Where to?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search destinations..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 mb-2 block uppercase tracking-wider">When?</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="mm / dd / yyyy" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-300 mb-2 block uppercase tracking-wider">Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none">
                      <option>2 People</option>
                      <option>1 Person</option>
                      <option>4+ People</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>

              <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition mt-4">
                <Search size={18} /> Search Packages
              </button>

              <div className="mt-8">
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Popular destinations</p>
                <div className="flex flex-wrap gap-2">
                  {['Agadir', 'Marrakech', 'Essaouira'].map((city) => (
                    <button key={city} className="bg-white/5 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-xs transition">
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 animate-bounce">
        <p className="text-[10px] uppercase tracking-[0.2em]">Scroll to explore</p>
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
          <ArrowDown size={14} />
        </div>
      </div>
    </div>
  );
};

export default MoroccoLandingPage;
