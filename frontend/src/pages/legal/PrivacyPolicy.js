import React from 'react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-600">Effective Date: October 9, 2025</p>
          <p className="mt-2 text-md text-gray-500">Last Modified: October 9, 2025</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              At FirstVote, protecting your private information is our highest priority. We understand the 
              sensitive nature of voting data and are committed to maintaining the trust you place in us
              by providing the highest level of security and confidentiality.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Introduction
            </h2>
            <p className="mb-4">
              At FirstVote, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our decentralized voting platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-600" />
              Information We Collect and Process
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Required Personal Information:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Legal Name and Identity:</span>
                      <p className="mt-1 text-gray-600">Your full legal name as it appears on official documents, used for voter verification.</p>
                    </li>
                    <li>
                      <span className="font-medium">Government-Issued ID Information:</span>
                      <p className="mt-1 text-gray-600">ID number, type, and expiration date for identity verification. Images of IDs are encrypted and deleted after verification.</p>
                    </li>
                    <li>
                      <span className="font-medium">Contact Information:</span>
                      <p className="mt-1 text-gray-600">Email address and optional phone number for important notifications and two-factor authentication.</p>
                    </li>
                    <li>
                      <span className="font-medium">Blockchain Wallet Address:</span>
                      <p className="mt-1 text-gray-600">Your public wallet address for secure voting transactions on the blockchain.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Automatically Collected Information:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Device and Browser Data:</span>
                      <p className="mt-1 text-gray-600">Operating system, browser type and version, device identifiers, and screen resolution for security and compatibility.</p>
                    </li>
                    <li>
                      <span className="font-medium">Network Information:</span>
                      <p className="mt-1 text-gray-600">IP address, location data (country/region only), and connection type for fraud prevention and security.</p>
                    </li>
                    <li>
                      <span className="font-medium">Usage Analytics:</span>
                      <p className="mt-1 text-gray-600">Interaction with the platform, voting session duration, and feature usage patterns (all anonymized).</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">3. Voting-Related Information:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Voting History:</span>
                      <p className="mt-1 text-gray-600">Record of elections participated in (anonymized), timestamp of votes (without vote content).</p>
                    </li>
                    <li>
                      <span className="font-medium">Blockchain Transactions:</span>
                      <p className="mt-1 text-gray-600">Public transaction hashes of your votes (vote content remains encrypted).</p>
                    </li>
                    <li>
                      <span className="font-medium">Verification Status:</span>
                      <p className="mt-1 text-gray-600">Your voter verification level and status (without personal details).</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Important Note:</strong> We never store or have access to your actual vote choices. 
                  All votes are encrypted end-to-end and only the final tallied results are visible on the blockchain.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              How We Use and Protect Your Information
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Core Voting Operations:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Identity Verification:</span>
                      <p className="mt-1 text-gray-600">We use your personal information to verify your eligibility to vote in specific elections through a secure, multi-factor verification process.</p>
                    </li>
                    <li>
                      <span className="font-medium">Vote Processing:</span>
                      <p className="mt-1 text-gray-600">Your blockchain wallet address is used to securely record your encrypted votes on the blockchain, ensuring vote integrity and immutability.</p>
                    </li>
                    <li>
                      <span className="font-medium">Election Communications:</span>
                      <p className="mt-1 text-gray-600">We send essential notifications about election schedules, voting periods, and important updates to your verified email address.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Security Measures:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Fraud Prevention:</span>
                      <p className="mt-1 text-gray-600">We analyze device and network information to detect and prevent unauthorized access and voting fraud attempts.</p>
                    </li>
                    <li>
                      <span className="font-medium">Data Encryption:</span>
                      <p className="mt-1 text-gray-600">All personal data is encrypted at rest and in transit using industry-standard encryption protocols.</p>
                    </li>
                    <li>
                      <span className="font-medium">Access Controls:</span>
                      <p className="mt-1 text-gray-600">Strict access controls and authentication procedures protect your information from unauthorized access.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">3. Platform Improvement:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Analytics and Optimization:</span>
                      <p className="mt-1 text-gray-600">We analyze anonymized usage data to improve platform performance, user experience, and voting processes.</p>
                    </li>
                    <li>
                      <span className="font-medium">Technical Support:</span>
                      <p className="mt-1 text-gray-600">Your information helps us provide effective technical support and troubleshoot issues when needed.</p>
                    </li>
                    <li>
                      <span className="font-medium">System Maintenance:</span>
                      <p className="mt-1 text-gray-600">Usage patterns help us optimize system resources and maintain platform stability during peak voting periods.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Data Retention Notice:</strong> We retain personal information only for as long as necessary to fulfill voting requirements and comply with legal obligations. 
                  Verification documents are deleted after successful verification, and voting records are permanently anonymized.
                </p>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Data Protection and Security Infrastructure
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Technical Security Measures:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Encryption Standards:</span>
                      <p className="mt-1 text-gray-600">We use military-grade AES-256 encryption for data at rest and TLS 1.3 for data in transit. All sensitive personal information is encrypted before storage.</p>
                    </li>
                    <li>
                      <span className="font-medium">Blockchain Security:</span>
                      <p className="mt-1 text-gray-600">Votes are secured using zero-knowledge proofs and homomorphic encryption, ensuring vote privacy while maintaining verifiability.</p>
                    </li>
                    <li>
                      <span className="font-medium">Infrastructure Security:</span>
                      <p className="mt-1 text-gray-600">Our systems are hosted in ISO 27001 certified data centers with 24/7 monitoring, intrusion detection, and DDoS protection.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Operational Security:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Access Control:</span>
                      <p className="mt-1 text-gray-600">Role-based access control (RBAC) with principle of least privilege, multi-factor authentication for all administrative access.</p>
                    </li>
                    <li>
                      <span className="font-medium">Security Audits:</span>
                      <p className="mt-1 text-gray-600">Regular penetration testing by independent security firms, continuous automated security scanning, and vulnerability assessments.</p>
                    </li>
                    <li>
                      <span className="font-medium">Incident Response:</span>
                      <p className="mt-1 text-gray-600">24/7 security monitoring with automated alerts and a dedicated incident response team for immediate threat mitigation.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">3. Compliance and Certifications:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Industry Standards:</span>
                      <p className="mt-1 text-gray-600">Compliance with ISO 27001, SOC 2 Type II, and relevant electoral security standards. Regular third-party compliance audits.</p>
                    </li>
                    <li>
                      <span className="font-medium">Data Privacy:</span>
                      <p className="mt-1 text-gray-600">GDPR, CCPA, and other regional data protection regulation compliance. Privacy-by-design principles in all operations.</p>
                    </li>
                    <li>
                      <span className="font-medium">Blockchain Compliance:</span>
                      <p className="mt-1 text-gray-600">Smart contract audits, compliance with blockchain security best practices, and regular code reviews.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-green-800">
                  <strong>Security Commitment:</strong> We maintain the highest level of security through continuous improvement, 
                  regular security assessments, and staying current with emerging threats and countermeasures. Our security measures 
                  are regularly reviewed and updated to ensure the integrity of your voting experience.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Privacy Rights and Controls</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Data Access and Control:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Right to Access:</span>
                      <p className="mt-1 text-gray-600">Request a comprehensive copy of your personal data in a machine-readable format within 30 days of request.</p>
                    </li>
                    <li>
                      <span className="font-medium">Right to Rectification:</span>
                      <p className="mt-1 text-gray-600">Update or correct any inaccurate personal information through your account settings or by contacting support.</p>
                    </li>
                    <li>
                      <span className="font-medium">Right to Deletion:</span>
                      <p className="mt-1 text-gray-600">Request deletion of your personal data when no longer needed for voting purposes, subject to legal retention requirements.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Communication Preferences:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Notification Controls:</span>
                      <p className="mt-1 text-gray-600">Manage your communication preferences through your account settings, while maintaining essential election notifications.</p>
                    </li>
                    <li>
                      <span className="font-medium">Marketing Opt-Out:</span>
                      <p className="mt-1 text-gray-600">Choose to opt out of non-essential communications while still receiving critical voting-related information.</p>
                    </li>
                    <li>
                      <span className="font-medium">Contact Preferences:</span>
                      <p className="mt-1 text-gray-600">Select your preferred communication channels for different types of notifications and updates.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">3. Legal Protections:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Complaint Filing:</span>
                      <p className="mt-1 text-gray-600">Right to file complaints with relevant data protection authorities if you believe your rights have been violated.</p>
                    </li>
                    <li>
                      <span className="font-medium">Data Portability:</span>
                      <p className="mt-1 text-gray-600">Transfer your personal data to another service provider in a structured, commonly used format.</p>
                    </li>
                    <li>
                      <span className="font-medium">Transparency:</span>
                      <p className="mt-1 text-gray-600">Access clear information about how your data is processed and used within our platform.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-purple-800">
                  <strong>Exercise Your Rights:</strong> To exercise any of these rights or learn more about your privacy controls, 
                  please visit your account settings or contact our dedicated privacy team at{' '}
                  <a href="mailto:privacy@firstvote.com" className="text-purple-600 hover:text-purple-800 underline">
                    privacy@firstvote.com
                  </a>. We aim to respond to all legitimate requests within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
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

export default PrivacyPolicy;