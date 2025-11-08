import React from 'react';
import { Cookie, Clock, Settings, Shield } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Cookie Policy</h1>
          <p className="mt-4 text-lg text-gray-600">Last updated: October 9, 2025</p>
        </div>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Cookie className="h-6 w-6 text-blue-600" />
              About Cookies and Similar Technologies
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. What Are Cookies?</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-3">
                    Cookies are small text files that are stored on your device when you visit our platform. They help us 
                    recognize your device and provide essential features, enhanced security, and improved user experience.
                  </p>
                  <p className="text-gray-600">
                    Along with cookies, we may use similar technologies such as web beacons, pixels, and local storage 
                    to deliver and maintain secure, efficient voting services.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Why We Use Cookies:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Security Enhancement:</span>
                      <p className="mt-1 text-gray-600">Protect against fraud, verify identity, and maintain vote integrity.</p>
                    </li>
                    <li>
                      <span className="font-medium">Platform Functionality:</span>
                      <p className="mt-1 text-gray-600">Enable core features, remember preferences, and provide seamless navigation.</p>
                    </li>
                    <li>
                      <span className="font-medium">Performance Optimization:</span>
                      <p className="mt-1 text-gray-600">Monitor and improve platform performance, stability, and user experience.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Privacy Commitment:</strong> We respect your privacy and are transparent about our use of cookies. 
                  This policy provides detailed information about how we use these technologies and how you can control them.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              Types of Cookies and Their Purposes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Essential Security Cookies:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Authentication Tokens:</span>
                      <p className="mt-1 text-gray-600">Verify your identity and maintain secure login sessions.</p>
                    </li>
                    <li>
                      <span className="font-medium">Fraud Prevention:</span>
                      <p className="mt-1 text-gray-600">Detect and prevent unauthorized access and voting manipulation attempts.</p>
                    </li>
                    <li>
                      <span className="font-medium">Session Security:</span>
                      <p className="mt-1 text-gray-600">Protect your voting session from tampering and ensure vote integrity.</p>
                    </li>
                    <li>
                      <span className="font-medium">CSRF Protection:</span>
                      <p className="mt-1 text-gray-600">Guard against cross-site request forgery attacks.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Functional Platform Cookies:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">User Preferences:</span>
                      <p className="mt-1 text-gray-600">Remember language settings, accessibility options, and display preferences.</p>
                    </li>
                    <li>
                      <span className="font-medium">Wallet Integration:</span>
                      <p className="mt-1 text-gray-600">Maintain secure connection with your blockchain wallet during voting sessions.</p>
                    </li>
                    <li>
                      <span className="font-medium">Regional Settings:</span>
                      <p className="mt-1 text-gray-600">Customize content based on your jurisdiction and applicable voting rules.</p>
                    </li>
                    <li>
                      <span className="font-medium">Session Recovery:</span>
                      <p className="mt-1 text-gray-600">Restore your session safely if connection is interrupted during voting.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">3. Performance and Analytics Cookies:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">System Performance:</span>
                      <p className="mt-1 text-gray-600">Monitor platform speed, reliability, and responsiveness.</p>
                    </li>
                    <li>
                      <span className="font-medium">Error Detection:</span>
                      <p className="mt-1 text-gray-600">Identify and resolve technical issues that might affect voting.</p>
                    </li>
                    <li>
                      <span className="font-medium">Usage Analytics:</span>
                      <p className="mt-1 text-gray-600">Collect anonymized data to improve platform usability and accessibility.</p>
                    </li>
                    <li>
                      <span className="font-medium">Load Management:</span>
                      <p className="mt-1 text-gray-600">Optimize server resources during peak voting periods.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Cookie Necessity:</strong> While you can control certain cookie preferences, essential security 
                  cookies are required for platform operation and cannot be disabled. These cookies are crucial for 
                  maintaining the security and integrity of the voting process.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Duration */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Cookie Duration and Lifecycle
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Session-Based Cookies:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Voting Session Cookies:</span>
                      <p className="mt-1 text-gray-600">Temporary cookies that maintain your secure voting session and expire immediately after completion or browser closure.</p>
                    </li>
                    <li>
                      <span className="font-medium">Authentication Tokens:</span>
                      <p className="mt-1 text-gray-600">Security tokens that verify your identity during active sessions and are automatically invalidated upon logout.</p>
                    </li>
                    <li>
                      <span className="font-medium">Temporary Preferences:</span>
                      <p className="mt-1 text-gray-600">Short-term settings that enhance your current voting experience without storing long-term data.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Persistent Cookies:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Security Preferences:</span>
                      <p className="mt-1 text-gray-600">Long-term security settings with maximum duration of 12 months, regularly reviewed for necessity.</p>
                    </li>
                    <li>
                      <span className="font-medium">User Preferences:</span>
                      <p className="mt-1 text-gray-600">Language and accessibility settings stored for 6 months to improve future visits.</p>
                    </li>
                    <li>
                      <span className="font-medium">Analytics Data:</span>
                      <p className="mt-1 text-gray-600">Anonymous usage data retained for 24 months to improve platform performance.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Management */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Managing Your Cookie Preferences
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Cookie Control Options:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Browser Settings:</span>
                      <p className="mt-1 text-gray-600">Control cookies through your browser's privacy settings, including options to block, delete, or manage specific types of cookies.</p>
                    </li>
                    <li>
                      <span className="font-medium">Platform Preferences:</span>
                      <p className="mt-1 text-gray-600">Use our dedicated Cookie Preference Center to customize your cookie settings for non-essential cookies.</p>
                    </li>
                    <li>
                      <span className="font-medium">Third-Party Tools:</span>
                      <p className="mt-1 text-gray-600">Utilize privacy-enhancing browser extensions or tools for additional cookie management options.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Impact of Cookie Choices:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Essential Functionality:</span>
                      <p className="mt-1 text-gray-600">Blocking essential cookies will prevent access to core voting features and security mechanisms.</p>
                    </li>
                    <li>
                      <span className="font-medium">Optional Features:</span>
                      <p className="mt-1 text-gray-600">Disabling non-essential cookies may limit personalization and convenience features but won't affect basic voting capabilities.</p>
                    </li>
                    <li>
                      <span className="font-medium">Performance Impact:</span>
                      <p className="mt-1 text-gray-600">Rejecting analytics cookies may affect our ability to optimize platform performance for your specific needs.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-red-800">
                  <strong>Important Security Notice:</strong> For the security and integrity of the voting process, 
                  certain essential cookies cannot be disabled. These cookies are fundamental to preventing fraud 
                  and ensuring accurate vote recording.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies and Services</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Third-Party Integrations:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Security Services:</span>
                      <p className="mt-1 text-gray-600">Cookies from our security partners that help detect and prevent fraudulent activities.</p>
                    </li>
                    <li>
                      <span className="font-medium">Analytics Providers:</span>
                      <p className="mt-1 text-gray-600">Limited analytics cookies for platform performance monitoring and improvement.</p>
                    </li>
                    <li>
                      <span className="font-medium">Blockchain Services:</span>
                      <p className="mt-1 text-gray-600">Integration cookies for secure wallet connections and transaction verification.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Third-Party Privacy:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Data Handling:</span>
                      <p className="mt-1 text-gray-600">Third-party services must comply with our strict data protection requirements and applicable privacy laws.</p>
                    </li>
                    <li>
                      <span className="font-medium">Privacy Policies:</span>
                      <p className="mt-1 text-gray-600">Each third-party service has its own privacy policy and cookie management practices.</p>
                    </li>
                    <li>
                      <span className="font-medium">Data Access:</span>
                      <p className="mt-1 text-gray-600">Third parties have limited access to your data and can only use it for specified purposes.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-purple-800">
                  <strong>Third-Party Management:</strong> You can manage third-party cookies through our 
                  Cookie Preference Center or directly through the respective service providers' websites.
                </p>
              </div>
            </div>
          </section>

          {/* Updates to Policy */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates and Changes</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Update Process:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Regular Reviews:</span>
                      <p className="mt-1 text-gray-600">We review and update this policy regularly to reflect changes in our practices and services.</p>
                    </li>
                    <li>
                      <span className="font-medium">Change Notifications:</span>
                      <p className="mt-1 text-gray-600">Material changes will be communicated through email notifications and platform announcements.</p>
                    </li>
                    <li>
                      <span className="font-medium">Version Control:</span>
                      <p className="mt-1 text-gray-600">Each policy update includes a new effective date and version number for tracking.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Your Rights:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Review Changes:</span>
                      <p className="mt-1 text-gray-600">You have the right to review any changes before they take effect.</p>
                    </li>
                    <li>
                      <span className="font-medium">Cookie Preferences:</span>
                      <p className="mt-1 text-gray-600">You can update your cookie preferences at any time in response to policy changes.</p>
                    </li>
                    <li>
                      <span className="font-medium">Questions and Concerns:</span>
                      <p className="mt-1 text-gray-600">Our privacy team is available to address any questions about policy updates.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-green-800">
                  <strong>Stay Informed:</strong> We encourage you to periodically review this Cookie Policy 
                  to stay informed about how we use cookies to protect and improve your voting experience.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at:{' '}
              <a href="mailto:privacy@firstvote.com" className="text-blue-600 hover:text-blue-800">
                privacy@firstvote.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;