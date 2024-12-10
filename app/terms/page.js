import Link from 'next/link'
import React from 'react'

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Q Media Group - Terms and Conditions</h1>
        </header>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Introduction</h2>
          <p className="text-gray-600">
            Welcome to Q Media Group. By accessing or using our website, you agree to comply with and be bound by these terms and conditions.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">Acceptance of Terms</h2>
          <p className="text-gray-600">
            By using this website, you confirm that you accept these Terms and Conditions in full. If you do not agree with any part of these terms, please do not use our website.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">User Responsibilities</h2>
          <p className="text-gray-600">
            Users are responsible for ensuring that all information provided on this website is accurate. You agree not to post illegal, harmful, or offensive content.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">Content Ownership</h2>
          <p className="text-gray-600">
            All content available on Q Media Group, including articles, graphics, and logos, is the property of Q Media Group unless otherwise stated.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">Limitation of Liability</h2>
          <p className="text-gray-600">
            Q Media Group will not be held liable for any errors, omissions, or damages arising from the use of this website or any of its content.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">Privacy and Data Protection</h2>
          <p className="text-gray-600">
            For details on how we handle your personal data, please refer to our <Link href="/privacy" className="text-blue-500 underline">Privacy Policy</Link>.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">Governing Law</h2>
          <p className="text-gray-600">
            These Terms and Conditions are governed by and construed in accordance with the laws of India, and any disputes will be resolved in the appropriate courts.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">Contact Information</h2>
          <p className="text-gray-600">
            If you have any questions regarding these Terms and Conditions, please contact us at qgroupmedia1@gmail.com.
          </p>
        </section>
      </div>
    </div>
  )
}

export default Terms
