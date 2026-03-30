import React from 'react';
import { 
  Sprout, Cpu, Zap, Globe, Search, BarChart3, 
  LayoutDashboard, CheckCircle2, Microscope, 
  Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white min-h-screen pb-20 overflow-x-hidden text-gray-800">

      {/* 1. HERO: BIG PICTURE */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-fixed bg-center transition-transform duration-[5000ms] hover:scale-105"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('http://googleusercontent.com/image_collection/image_retrieval/16482193036711480725_2')` 
          }}
        ></div>

        <div className="relative z-10 text-center px-6 max-w-5xl ml-10 animate-fadeIn">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-green-500/20 border border-green-400/30 backdrop-blur-sm ">
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Digital Transformation</span> 
          </div> 
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-green-500/20 border border-green-400/30 backdrop-blur-sm">
            <Link to="/activities" className="text-green-400 text-xs font-bold uppercase tracking-widest " >Explore activities</Link>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
            Empowering the <span className="text-green-500 italic">Rwandan Farmer</span> <br/>
            through Data & AI.
          </h1>
          <p className="text-xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
            Plant-to-Market is a comprehensive web and mobile solution designed to manage 
            the entire farm-to-market cycle—maximizing yield, reducing losses, 
            and optimizing revenue for a sustainable future.
          </p>
        </div>
      </section>

      {/* 2. PROJECT SUMMARY */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-green-600 font-black mb-2">Project Summary</h2>
              <h3 className="text-4xl font-bold text-gray-900 leading-tight">Efficiency from Soil to Sale.</h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              In Rwanda, agriculture is the heartbeat of the economy. Our platform ensures that 
              farmers aren't just planting seeds, but managing a professional business. We solve 
              fragmentation by providing a single source of truth for farm health and market trends.
            </p>
            
            <div className="space-y-4">
              <GoalItem text="Track farm activities from planting to harvest" />
              <GoalItem text="Monitor crop health and detect diseases early via AI" />
              <GoalItem text="Connect farmers directly to buyers and live market prices" />
              <GoalItem text="Integrate real-time environmental & satellite data" />
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-green-100 rounded-[3rem] -z-10 group-hover:bg-green-200 transition-colors"></div>
            <img 
              src="http://googleusercontent.com/image_collection/image_retrieval/16217826738075319961_1" 
              alt="Farmer using app" 
              className="w-full rounded-[2.5rem] shadow-2xl object-cover h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* 3. CORE MODULES */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900">Core System Modules</h2>
            <p className="text-gray-500 mt-4">The architectural pillars of the Plant-to-Market ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ModuleCard 
              icon={<LayoutDashboard />} 
              title="Farm & Crop Tracking" 
              desc="Logs farm profiles, crop activities, input costs (seeds/fertilizer), and harvest data with a real-time progress dashboard."
              img="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800"
            />
            <ModuleCard 
              icon={<Microscope />} 
              title="AI-Powered Advisory" 
              desc="Machine Learning models to predict yield and detect crop diseases from images, providing actionable treatment guidance."
              img="http://googleusercontent.com/image_collection/image_retrieval/12039785295305345859_2"
            />
            <ModuleCard 
              icon={<Search />} 
              title="Satellite Field Monitoring" 
              desc="Remote sensing using satellite imagery to detect crop stress, drought, or disease remotely across large sectors."
              img="http://googleusercontent.com/image_collection/image_retrieval/12831542009422752411_3"
            />
            <ModuleCard 
              icon={<Zap />} 
              title="Environmental Monitoring" 
              desc="Integrates weather and soil sensors to send automated alerts for irrigation, pests, or adverse weather conditions."
              img="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=800"
            />
            <ModuleCard 
              icon={<Globe />} 
              title="Marketplace Integration" 
              desc="Displays real-time crop prices, suggests the best buyers/selling times, and logs all sales revenue for ROI tracking."
              img="http://googleusercontent.com/image_collection/image_retrieval/4739629483871269315_2"
            />
            <ModuleCard 
              icon={<BarChart3 />} 
              title="Analytics & Reporting" 
              desc="Advanced data visualization for profitability per crop, historical performance, and data-driven farm management."
              img="https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800"
            />
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">The Smart Farm Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          <WorkflowStep step="1" title="Planting" desc="Log seeds & costs." />
          <WorkflowStep step="2" title="Care" desc="Track inputs & irrigation." />
          <WorkflowStep step="3" title="AI Check" desc="Scan for diseases." />
          <WorkflowStep step="4" title="Growth" desc="Satellite monitoring." />
          <WorkflowStep step="5" title="Harvest" desc="Record final quantity." />
          <WorkflowStep step="6" title="Market" desc="Sell at peak prices." />
        </div>
      </section>

      {/* 5. VISION & IMPACT */}
      <section className="py-24 bg-green-950 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-md">
            <Rocket className="text-green-500 mb-6" size={40} />
            <h2 className="text-3xl font-bold mb-6">Our Vision & Impact</h2>
            <p className="text-green-100/70 leading-relaxed mb-8">
              To empower every Rwandan farmer with digital tools that improve productivity 
              and profitability. We are building an ecosystem that promotes sustainable, 
              data-driven farming for the next generation.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className="text-green-400 uppercase tracking-widest">Current Status:</span>
              <span className="bg-green-500 text-white px-3 py-1 rounded-md">MVP Development</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// --- SUB-COMPONENTS ---
const GoalItem = ({ text }) => (
  <div className="flex items-start gap-3">
    <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={20} />
    <span className="text-gray-700 font-medium leading-tight">{text}</span>
  </div>
);

const ModuleCard = ({ icon, title, desc, img }) => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group">
    <div className="h-44 overflow-hidden relative">
      <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors z-10"></div>
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div className="p-10">
      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const WorkflowStep = ({ step, title, desc }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center group hover:border-green-500 transition-colors">
    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-black mx-auto mb-4 text-xs">
      {step}
    </div>
    <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{desc}</p>
  </div>
);

export default About;
