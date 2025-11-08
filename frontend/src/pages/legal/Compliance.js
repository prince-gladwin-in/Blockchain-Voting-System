import React from 'react';
import { CheckSquare, Shield, Lock, FileText, Globe } from 'lucide-react';

const Compliance = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Compliance Policy</h1>
          <p className="mt-4 text-lg text-gray-600">Last updated: October 9, 2025</p>
        </div>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-blue-600" />
              Our Commitment to Compliance and Trust
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Core Principles:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Integrity:</span>
                      <p className="mt-1 text-gray-600">We maintain the highest standards of electoral integrity through transparent, auditable processes and robust security measures.</p>
                    </li>
                    <li>
                      <span className="font-medium">Transparency:</span>
                      <p className="mt-1 text-gray-600">Our operations are open to scrutiny, with clear documentation and regular third-party audits.</p>
                    </li>
                    <li>
                      <span className="font-medium">Accountability:</span>
                      <p className="mt-1 text-gray-600">We take responsibility for compliance at every level of our organization, from technical implementation to user support.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Compliance Framework:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Comprehensive Coverage:</span>
                      <p className="mt-1 text-gray-600">Our compliance program covers all aspects of electronic voting, from voter registration to result verification.</p>
                    </li>
                    <li>
                      <span className="font-medium">Continuous Improvement:</span>
                      <p className="mt-1 text-gray-600">Regular reviews and updates to our compliance measures ensure we stay ahead of evolving requirements and threats.</p>
                    </li>
                    <li>
                      <span className="font-medium">Stakeholder Engagement:</span>
                      <p className="mt-1 text-gray-600">Active collaboration with election officials, security experts, and regulatory bodies to maintain best practices.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Our Promise:</strong> FirstVote is committed to ensuring that every vote is secure, 
                  private, and accurately recorded through strict adherence to international standards and 
                  regulatory requirements for electronic voting systems.
                </p>
              </div>
            </div>
          </section>

          {/* Regulatory Framework */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              Comprehensive Regulatory Framework
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. International Compliance:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">GDPR Compliance:</span>
                      <p className="mt-1 text-gray-600">Full adherence to EU data protection requirements, including data minimization, user rights, and privacy impact assessments.</p>
                    </li>
                    <li>
                      <span className="font-medium">eIDAS Compliance:</span>
                      <p className="mt-1 text-gray-600">Meeting all requirements for electronic identification, authentication, and trust services in the EU.</p>
                    </li>
                    <li>
                      <span className="font-medium">ISO Standards:</span>
                      <p className="mt-1 text-gray-600">Compliance with ISO/IEC 27001, ISO/TS 54001 (electoral technology), and other relevant ISO standards.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Regional and National Requirements:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Electoral Laws:</span>
                      <p className="mt-1 text-gray-600">Compliance with jurisdiction-specific voting regulations and electoral commission requirements.</p>
                    </li>
                    <li>
                      <span className="font-medium">Digital Identity Laws:</span>
                      <p className="mt-1 text-gray-600">Adherence to local and national requirements for digital identity verification and authentication.</p>
                    </li>
                    <li>
                      <span className="font-medium">Accessibility Standards:</span>
                      <p className="mt-1 text-gray-600">Meeting WCAG 2.1 requirements and local accessibility regulations for voting systems.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-green-800">
                  <strong>Regulatory Updates:</strong> Our compliance team actively monitors regulatory changes 
                  and updates our systems to maintain continuous compliance across all jurisdictions.
                </p>
              </div>
            </div>
          </section>

          {/* Security Standards */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Comprehensive Security Framework
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">1. Technical Security Measures:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Cryptographic Security:</span>
                      <p className="mt-1 text-gray-600">Implementation of state-of-the-art encryption, including quantum-resistant algorithms where applicable.</p>
                    </li>
                    <li>
                      <span className="font-medium">Blockchain Security:</span>
                      <p className="mt-1 text-gray-600">Smart contract auditing, consensus mechanism security, and distributed ledger protection measures.</p>
                    </li>
                    <li>
                      <span className="font-medium">Infrastructure Security:</span>
                      <p className="mt-1 text-gray-600">Secure cloud architecture, network segmentation, and real-time threat monitoring systems.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">2. Operational Security Controls:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Access Management:</span>
                      <p className="mt-1 text-gray-600">Strict role-based access control, multi-factor authentication, and privileged access management.</p>
                    </li>
                    <li>
                      <span className="font-medium">Security Training:</span>
                      <p className="mt-1 text-gray-600">Comprehensive security awareness training for all personnel and specialized training for security teams.</p>
                    </li>
                    <li>
                      <span className="font-medium">Third-Party Security:</span>
                      <p className="mt-1 text-gray-600">Rigorous vendor security assessments, continuous monitoring, and security SLAs.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">3. Security Validation:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc ml-8 space-y-3">
                    <li>
                      <span className="font-medium">Security Testing:</span>
                      <p className="mt-1 text-gray-600">Regular penetration testing, vulnerability assessments, and red team exercises.</p>
                    </li>
                    <li>
                      <span className="font-medium">Compliance Audits:</span>
                      <p className="mt-1 text-gray-600">Independent security audits, SOC 2 Type II assessments, and ISO 27001 certification maintenance.</p>
                    </li>
                    <li>
                      <span className="font-medium">Security Metrics:</span>
                      <p className="mt-1 text-gray-600">Continuous monitoring of security KPIs and regular security posture assessments.</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Security Evolution:</strong> Our security framework undergoes continuous enhancement 
                  through threat intelligence integration, emerging technology adoption, and regular security 
                  architecture reviews.
                </p>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              Data Protection Measures
            </h2>
            <div className="ml-4 space-y-4">
              <p>We implement comprehensive data protection through:</p>
              <ul className="list-disc ml-8 space-y-2">
                <li>End-to-end encryption</li>
                <li>Secure key management</li>
                <li>Data minimization practices</li>
                <li>Regular data protection impact assessments</li>
                <li>Privacy by design principles</li>
              </ul>
            </div>
          </section>

          {/* Auditing and Reporting */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Auditing and Reporting
            </h2>
            <div className="ml-4 space-y-4">
              <p>Our compliance monitoring includes:</p>
              <ul className="list-disc ml-8 space-y-2">
                <li>Regular internal audits</li>
                <li>Independent third-party audits</li>
                <li>Continuous monitoring systems</li>
                <li>Transparent reporting mechanisms</li>
                <li>Stakeholder communication protocols</li>
              </ul>
            </div>
          </section>

          {/* Certification and Accreditation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Certifications</h2>
            <div className="ml-4 space-y-4">
              <p>FirstVote maintains the following certifications:</p>
              <ul className="list-disc ml-8 space-y-2">
                <li>ISO 27001:2013 Certification</li>
                <li>SOC 2 Type II Compliance</li>
                <li>eIDAS Trust Service Provider Status</li>
                <li>National Voting System Certifications</li>
              </ul>
            </div>
          </section>

          {/* Incident Response */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Incident Response</h2>
            <div className="ml-4">
              <p>
                We maintain a comprehensive incident response plan that includes:
              </p>
              <ul className="list-disc ml-8 space-y-2">
                <li>24/7 monitoring</li>
                <li>Rapid response procedures</li>
                <li>Stakeholder notification protocols</li>
                <li>Post-incident analysis</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Our Compliance Team</h2>
            <p>
              For compliance-related inquiries, please contact us at:{' '}
              <a href="mailto:compliance@firstvote.com" className="text-blue-600 hover:text-blue-800">
                compliance@firstvote.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Compliance;