import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock, Users, Vote, CheckCircle, Globe, Zap, Award, TrendingUp, Eye, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'Bank-level encryption and blockchain technology ensure your vote is protected and immutable.',
    },
    {
      icon: Smartphone,
      title: 'Vote Anywhere, Anytime',
      description: 'Secure mobile and online voting accessible from any device, anywhere in the world.',
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'Every vote is verifiable on the blockchain while maintaining voter privacy and anonymity.',
    },
    {
      icon: Users,
      title: 'Verified Identity',
      description: 'Advanced identity verification ensures one person, one vote with complete accuracy.',
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Blockchain Certified',
      description: 'Industry-leading security standards',
    },
    {
      icon: TrendingUp,
      title: '99.9% Uptime',
      description: 'Reliable and always available',
    },
    {
      icon: Shield,
      title: 'Zero Fraud',
      description: 'Tamper-proof voting system',
    },
  ];

  const stats = [
    { label: 'Votes Cast', value: '1M+', color: 'text-primary-600' },
    { label: 'Active Elections', value: '50+', color: 'text-accent-600' },
    { label: 'Registered Voters', value: '500K+', color: 'text-success-600' },
    { label: 'Success Rate', value: '99.9%', color: 'text-primary-600' },
  ];

  const benefits = [
    'Eliminate election fraud and manipulation',
    'Reduce election costs and complexity',
    'Enable remote and accessible voting',
    'Provide instant, verifiable results',
    'Increase voter turnout and engagement',
    'Ensure complete transparency and auditability',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className={`text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
              <Award className="h-4 w-4 mr-2" />
              Trusted by organizations worldwide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Secure, accessible voting
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-200">
                at your fingertips
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-3xl mx-auto font-light leading-relaxed">
              Experience the future of democracy with blockchain-powered voting.
              Secure, transparent, and accessible from anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link 
                  to="/elections" 
                  className="group inline-flex items-center px-8 py-4 bg-white text-primary-900 rounded-full font-semibold text-lg hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Browse Elections
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="group inline-flex items-center px-8 py-4 bg-white text-primary-900 rounded-full font-semibold text-lg hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/elections" 
                    className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-primary-900 transition-all duration-300"
                  >
                    View Demo
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8 items-center justify-items-center">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                  <achievement.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-sm font-semibold text-gray-900">{achievement.title}</div>
                <div className="text-xs text-gray-500 mt-1">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by voters worldwide
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl md:text-5xl font-extrabold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              A leader in secure voting technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built on cutting-edge blockchain technology to ensure every vote counts
              and democracy thrives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-1 shadow-2xl">
                  <div className="bg-white rounded-3xl p-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Register & Verify</div>
                          <div className="text-sm text-gray-600">Secure identity verification ensures one person, one vote</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Cast Your Vote</div>
                          <div className="text-sm text-gray-600">Vote securely from any device, anywhere in the world</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Blockchain Verification</div>
                          <div className="text-sm text-gray-600">Your vote is encrypted and stored immutably on the blockchain</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-success-600 text-white rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Results Published</div>
                          <div className="text-sm text-gray-600">Transparent, verifiable results available in real-time</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Every citizen deserves the chance to vote
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're making democracy more accessible, secure, and transparent through
                blockchain technology. Your voice matters, and we ensure it's heard.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-success-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to transform democracy?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of organizations and voters who trust our platform for
            secure, accessible, and transparent elections.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register" 
                className="group inline-flex items-center px-8 py-4 bg-white text-primary-900 rounded-full font-semibold text-lg hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/elections" 
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-primary-900 transition-all duration-300"
              >
                Browse Elections
              </Link>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl opacity-20"></div>
      </section>
    </div>
  );
};

export default Home;
