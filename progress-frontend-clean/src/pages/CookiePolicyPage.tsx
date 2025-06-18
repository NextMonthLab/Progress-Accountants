import React from 'react';
import { Helmet } from 'react-helmet';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Cookie Policy - Progress Accountants</title>
        <meta name="description" content="Progress Accountants cookie policy - how we use cookies and your privacy choices." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            Cookie Policy
          </h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">What are Cookies?</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Our Site may place and access certain first party Cookies on your computer or device. First party Cookies are those placed directly by us and are used only by us. We use Cookies to facilitate and improve your experience of our site and to provide and improve our services. We have carefully chosen these Cookies and have taken steps to ensure that your privacy and personal data is protected and respected at all times.
                </p>
                <p>
                  All Cookies used by and on our site are used in accordance with current Cookie Law.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Your Consent</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Before Cookies are placed on your computer or device, you will be shown a pop-up requesting your consent to set those Cookies. By giving your consent to the placing of Cookies you are enabling us to provide the best possible experience and service to you. You may, if you wish, deny consent to the placing of Cookies; however certain features of our Site may not function fully or as intended.
                </p>
                <p>
                  Certain features of our site depend on Cookies to function. Cookie Law deems these Cookies to be "strictly necessary". Your consent will not be sought to place these Cookies, but it is still important that you are aware of them. You may still block these Cookies by changing your internet browser's settings as detailed below, but please be aware that our site may not work properly if you do so.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Cookies We Use</h2>
              <p className="text-gray-300 mb-6">
                The following first party Cookies may be placed on your computer or device:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-gray-800 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="border border-gray-600 px-4 py-3 text-left text-pink-400 font-semibold">Name of Cookie</th>
                      <th className="border border-gray-600 px-4 py-3 text-left text-pink-400 font-semibold">Purpose</th>
                      <th className="border border-gray-600 px-4 py-3 text-left text-pink-400 font-semibold">Strictly Necessary</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr>
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">_wpfuuid</td>
                      <td className="border border-gray-600 px-4 py-3">Functional cookie</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr className="bg-gray-750">
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">fr</td>
                      <td className="border border-gray-600 px-4 py-3">Encrypted Facebook ID and Browser ID used for advertisement</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">X-Mapping-fjhppofk</td>
                      <td className="border border-gray-600 px-4 py-3">Used to route data and page requests to the correct server where a site is hosted on multiple servers</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr className="bg-gray-750">
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">_gat</td>
                      <td className="border border-gray-600 px-4 py-3">This cookie is typically written to the browser upon the first visit. Used to determine unique visitors and is updated with each page view. Provided with a unique ID that Google Analytics uses to ensure both the validity and accessibility of the cookie as an extra security measure</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">_gat_UA</td>
                      <td className="border border-gray-600 px-4 py-3">Tracking cookie for analytics.js. Used to throttle request rate</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr className="bg-gray-750">
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">_jsuid</td>
                      <td className="border border-gray-600 px-4 py-3">Used to collect information about how visitors find and use our Website. We use the information to compile reports and statistics on our most popular pages and to generally help us improve the Website</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">_first_pageview</td>
                      <td className="border border-gray-600 px-4 py-3">Used to collect information about how visitors find and use our Website. We use the information to compile reports and statistics on our most popular pages and to generally help us improve the Website</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr className="bg-gray-750">
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">_gid</td>
                      <td className="border border-gray-600 px-4 py-3">Used to distinguish users</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">_ga</td>
                      <td className="border border-gray-600 px-4 py-3">Used to distinguish users</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                    <tr className="bg-gray-750">
                      <td className="border border-gray-600 px-4 py-3 font-mono text-blue-300">vuid</td>
                      <td className="border border-gray-600 px-4 py-3">We use Vimeo to embed videos onto our website. These cookies are used by Vimeo to collect analytics tracking information</td>
                      <td className="border border-gray-600 px-4 py-3">NO</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Managing Cookies</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold mb-3 text-pink-400">Browser Controls</h3>
                <p>
                  In addition to the controls that we provide, you can choose to enable or disable Cookies in your internet browser. Most internet browsers also enable you to choose whether you wish to disable all Cookies or only third party Cookies. By default, most internet browsers accept Cookies but this can be changed. For further details, please consult the help menu in your internet browser or the documentation that came with your device.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-pink-400">Deleting Cookies</h3>
                <p>
                  You can choose to delete Cookies on your computer or device at any time, however you may lose any information that enables you to access our site more quickly and efficiently including, but not limited to, login and personalisation settings.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-pink-400">Keeping Updated</h3>
                <p>
                  It is recommended that you keep your internet browser and operating system up-to-date and that you consult the help and guidance provided by the developer of your internet browser and manufacturer of your computer or device if you are unsure about adjusting your privacy settings.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Cookie Types</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-3 text-pink-400">Strictly Necessary Cookies</h3>
                  <p className="text-gray-300">
                    These cookies are essential for our website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-3 text-pink-400">Analytics Cookies</h3>
                  <p className="text-gray-300">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-3 text-pink-400">Functional Cookies</h3>
                  <p className="text-gray-300">
                    These cookies enable the website to provide enhanced functionality and personalisation based on your interactions.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-3 text-pink-400">Advertising Cookies</h3>
                  <p className="text-gray-300">
                    These cookies are used to deliver advertisements more relevant to you and your interests.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="text-gray-300">
                <p>Email: <a href="mailto:info@progressaccountants.co.uk" className="text-blue-400 hover:text-blue-300">info@progressaccountants.co.uk</a></p>
                <p>Phone: <a href="tel:01865921150" className="text-blue-400 hover:text-blue-300">01865 921150</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Policy Updates</h2>
              <p className="text-gray-300">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we use cookies.
              </p>
              <p className="text-gray-300 mt-4">
                <strong>Last updated:</strong> January 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}