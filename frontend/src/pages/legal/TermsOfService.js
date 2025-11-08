import React from 'react';
import { Scale, UserCheck, AlertCircle, FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Terms of Service</h1>
          <p className="mt-4 text-lg text-gray-600">Last updated: October 9, 2025</p>
        </div>

        <div className="space-y-8 text-gray-700">
          {/* Agreement */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-blue-600" />
              Agreement to Terms
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Acceptance of Terms:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-3">
                    By accessing or using FirstVote, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, our Privacy Policy, and any other policies referenced herein. These terms constitute a legally binding agreement between you and FirstVote.
                  </p>
                  <p className="text-gray-600">
                    If you do not agree with any part of these terms, you must immediately discontinue use of our platform. Your continued use of FirstVote indicates your ongoing acceptance of these terms.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Legal Capacity:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Age Requirement:</span>
                      <p className="mt-1 text-gray-600">You must be of legal voting age in your jurisdiction to use our services.</p>
                    </li>
                    <li>
                      <span className="font-medium">Mental Capacity:</span>
                      <p className="mt-1 text-gray-600">You must have the legal capacity to enter into binding contracts and exercise your voting rights.</p>
                    </li>
                    <li>
                      <span className="font-medium">Jurisdictional Compliance:</span>
                      <p className="mt-1 text-gray-600">You must be legally eligible to vote in your jurisdiction and comply with all local voting laws and regulations.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">3. Term Updates:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Modification Rights:</span>
                      <p className="mt-1 text-gray-600">FirstVote reserves the right to modify these terms at any time, with or without prior notice.</p>
                    </li>
                    <li>
                      <span className="font-medium">Notification Process:</span>
                      <p className="mt-1 text-gray-600">Material changes will be communicated through email notifications or platform announcements.</p>
                    </li>
                    <li>
                      <span className="font-medium">Continued Use:</span>
                      <p className="mt-1 text-gray-600">Your continued use after changes constitutes acceptance of the updated terms.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Important Note:</strong> These terms may be supplemented by additional terms for specific elections or jurisdictions. 
                  Any supplemental terms will be clearly communicated and require explicit acceptance before participation in specific voting events.
                </p>
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-blue-600" />
              Eligibility and Registration Requirements
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Basic Eligibility:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Age Verification:</span>
                      <p className="mt-1 text-gray-600">Must be of legal voting age (typically 18 years or older) in your jurisdiction with valid government-issued ID.</p>
                    </li>
                    <li>
                      <span className="font-medium">Jurisdictional Requirements:</span>
                      <p className="mt-1 text-gray-600">Must meet all local voter registration requirements and be legally eligible to vote in your region.</p>
                    </li>
                    <li>
                      <span className="font-medium">Identity Verification:</span>
                      <p className="mt-1 text-gray-600">Must complete our multi-factor authentication and identity verification process successfully.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Technical Requirements:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Web3 Compatibility:</span>
                      <p className="mt-1 text-gray-600">Must maintain an active, compatible Web3 wallet for secure voting transactions and verification.</p>
                    </li>
                    <li>
                      <span className="font-medium">Device Requirements:</span>
                      <p className="mt-1 text-gray-600">Must use a secure, updated device with a compatible browser and necessary security features enabled.</p>
                    </li>
                    <li>
                      <span className="font-medium">Network Requirements:</span>
                      <p className="mt-1 text-gray-600">Must have a stable internet connection and ability to receive verification codes via email or SMS.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Registration Notice:</strong> Meeting these requirements does not guarantee registration approval. 
                  FirstVote reserves the right to deny or revoke registration based on verification failures or violations of these terms.
                </p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              User Responsibilities and Obligations
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Account Security:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Credential Protection:</span>
                      <p className="mt-1 text-gray-600">Maintain the confidentiality of your login credentials, wallet keys, and verification information at all times.</p>
                    </li>
                    <li>
                      <span className="font-medium">Access Control:</span>
                      <p className="mt-1 text-gray-600">Never share your account access, allow unauthorized use, or attempt to transfer your voting rights to others.</p>
                    </li>
                    <li>
                      <span className="font-medium">Security Updates:</span>
                      <p className="mt-1 text-gray-600">Keep your device, browser, and wallet software updated with the latest security patches.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Platform Integrity:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Honest Participation:</span>
                      <p className="mt-1 text-gray-600">Never attempt to manipulate voting results, submit false votes, or interfere with the voting process.</p>
                    </li>
                    <li>
                      <span className="font-medium">Security Reporting:</span>
                      <p className="mt-1 text-gray-600">Report any security vulnerabilities, suspicious activities, or potential fraud attempts immediately.</p>
                    </li>
                    <li>
                      <span className="font-medium">Data Accuracy:</span>
                      <p className="mt-1 text-gray-600">Maintain accurate, up-to-date personal information and promptly report any changes affecting eligibility.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">3. Legal Compliance:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Regulatory Adherence:</span>
                      <p className="mt-1 text-gray-600">Comply with all applicable voting laws, regulations, and platform rules in your jurisdiction.</p>
                    </li>
                    <li>
                      <span className="font-medium">Prohibited Activities:</span>
                      <p className="mt-1 text-gray-600">Never use the platform for illegal purposes, harassment, or distribution of false information.</p>
                    </li>
                    <li>
                      <span className="font-medium">Ethical Conduct:</span>
                      <p className="mt-1 text-gray-600">Maintain ethical behavior and respect the rights and privacy of other platform users.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-red-800">
                  <strong>Violation Notice:</strong> Failure to meet these responsibilities may result in immediate account suspension, 
                  vote invalidation, and potential legal consequences depending on the nature and severity of the violation.
                </p>
              </div>
            </div>
          </section>

          {/* Platform Rules */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Platform Rules
            </h2>
            <div className="ml-4 space-y-4">
              <p>The following actions are strictly prohibited:</p>
              <ul className="list-disc ml-8 space-y-2">
                <li>Using multiple accounts</li>
                <li>Attempting to bypass security measures</li>
                <li>Interfering with platform operations</li>
                <li>Sharing false or misleading information</li>
                <li>Harassing other users</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <div className="ml-4">
              <p>
                FirstVote's content, features, and functionality are owned by FirstVote and are protected by
                international copyright, trademark, and other intellectual property laws.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <div className="ml-4">
              <p>
                FirstVote shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use or inability to use the service.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <div className="ml-4">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material
                changes via email or platform notification.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:legal@firstvote.com" className="text-blue-600 hover:text-blue-800">
                legal@firstvote.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;