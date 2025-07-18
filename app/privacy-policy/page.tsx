"use client"

import { motion } from "framer-motion"
import { Footer } from "@/components/landing/footer"
import Navbar from "@/components/landing/navbar"
import { useState, useEffect } from "react"

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("")

  const sections = [
    { id: "interpretation", title: "Interpretation and Definitions" },
    { id: "data-collection", title: "Collecting and Using Your Personal Data" },
    { id: "data-usage", title: "Use of Your Personal Data" },
    { id: "data-retention", title: "Retention of Your Personal Data" },
    { id: "data-transfer", title: "Transfer of Your Personal Data" },
    { id: "data-deletion", title: "Delete Your Personal Data" },
    { id: "data-disclosure", title: "Disclosure of Your Personal Data" },
    { id: "data-security", title: "Security of Your Personal Data" },
    { id: "children-privacy", title: "Children's Privacy" },
    { id: "external-links", title: "Links to Other Websites" },
    { id: "policy-changes", title: "Changes to this Privacy Policy" },
    { id: "contact", title: "Contact Us" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetBottom = offsetTop + element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="text-xs font-medium text-gray-900 mb-4 font-semibold">On This Page</div>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`block text-xs py-1 transition-colors ${
                      activeSection === section.id ? "text-[#43A2C9] font-medium" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600">Last updated: February 05, 2025</p>
              </div>

              {/* Introduction */}
              <div className="prose prose-gray max-w-none mb-12">
                <p>
                  This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of
                  Your information when You use the Service and tells You about Your privacy rights and how the law
                  protects You.
                </p>
                <p>
                  We use Your Personal data to provide and improve the Service. By using the Service, You agree to the
                  collection and use of information in accordance with this Privacy Policy.
                </p>
              </div>

              {/* Interpretation and Definitions */}
              <section id="interpretation" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Interpretation and Definitions</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interpretation</h3>
                <p className="text-gray-700 mb-6">
                  The words of which the initial letter is capitalized have meanings defined under the following
                  conditions. The following definitions shall have the same meaning regardless of whether they appear in
                  singular or in plural.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Definitions</h3>
                <p className="text-gray-700 mb-4">For the purposes of this Privacy Policy:</p>

                <ul className="space-y-4 text-gray-700">
                  <li>
                    <strong>Account</strong> means a unique account created for You to access our Service or parts of
                    our Service.
                  </li>
                  <li>
                    <strong>Affiliate</strong> means an entity that controls, is controlled by or is under common
                    control with a party, where "control" means ownership of 50% or more of the shares, equity interest
                    or other securities entitled to vote for election of directors or other managing authority.
                  </li>
                  <li>
                    <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this
                    Agreement) refers to Aven Technologies Inc., 840 6 Ave SW #300, Calgary, AB T2P 3E5, Canada.
                  </li>
                  <li>
                    <strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any
                    other device by a website, containing the details of Your browsing history on that website among its
                    many uses.
                  </li>
                  <li>
                    <strong>Country</strong> refers to: Alberta, Canada
                  </li>
                  <li>
                    <strong>Device</strong> means any device that can access the Service such as a computer, a cellphone
                    or a digital tablet.
                  </li>
                  <li>
                    <strong>Personal Data</strong> is any information that relates to an identified or identifiable
                    individual.
                  </li>
                  <li>
                    <strong>Service</strong> refers to the Website.
                  </li>
                  <li>
                    <strong>Service Provider</strong> means any natural or legal person who processes the data on behalf
                    of the Company. It refers to third-party companies or individuals employed by the Company to
                    facilitate the Service, to provide the Service on behalf of the Company, to perform services related
                    to the Service or to assist the Company in analyzing how the Service is used.
                  </li>
                  <li>
                    <strong>Third-party Social Media Service</strong> refers to any website or any social network
                    website through which a User can log in or create an account to use the Service.
                  </li>
                  <li>
                    <strong>Usage Data</strong> refers to data collected automatically, either generated by the use of
                    the Service or from the Service infrastructure itself (for example, the duration of a page visit).
                  </li>
                  <li>
                    <strong>Website</strong> refers to AvenCRM, accessible from{" "}
                    <a
                      href="https://avencrm.com"
                      rel="noreferrer external nofollow noopener"
                      target="_blank"
                      className="text-[#43A2C9] hover:underline"
                    >
                      https://avencrm.com
                    </a>
                  </li>
                  <li>
                    <strong>You</strong> means the individual accessing or using the Service, or the company, or other
                    legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                  </li>
                </ul>
              </section>

              {/* Collecting and Using Your Personal Data */}
              <section id="data-collection" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Collecting and Using Your Personal Data</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Types of Data Collected</h3>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Data</h4>
                <p className="text-gray-700 mb-4">
                  While using Our Service, We may ask You to provide Us with certain personally identifiable information
                  that can be used to contact or identify You. Personally identifiable information may include, but is
                  not limited to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Usage Data</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Usage Data</h4>
                <p className="text-gray-700 mb-4">Usage Data is collected automatically when using the Service.</p>
                <p className="text-gray-700 mb-4">
                  Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address),
                  browser type, browser version, the pages of our Service that You visit, the time and date of Your
                  visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                </p>
                <p className="text-gray-700 mb-4">
                  When You access the Service by or through a mobile device, We may collect certain information
                  automatically, including, but not limited to, the type of mobile device You use, Your mobile device
                  unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile
                  Internet browser You use, unique device identifiers and other diagnostic data.
                </p>
                <p className="text-gray-700 mb-6">
                  We may also collect information that Your browser sends whenever You visit our Service or when You
                  access the Service by or through a mobile device.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Information from Third-Party Social Media Services
                </h4>
                <p className="text-gray-700 mb-4">
                  The Company allows You to create an account and log in to use the Service through the following
                  Third-party Social Media Services:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Google</li>
                  <li>Facebook</li>
                  <li>Instagram</li>
                  <li>Twitter</li>
                  <li>LinkedIn</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Google Workspace APIs Usage</h4>
                <p className="text-gray-700 mb-6">
                  We explicitly affirm that any data accessed through Google Workspace APIs is not used to develop,
                  improve, or train generalized artificial intelligence (AI) and/or machine learning (ML) models. The
                  data is only used for the specific purposes outlined in this Privacy Policy and in accordance with
                  Google's API Services User Data Policy.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Tracking Technologies and Cookies</h4>
                <p className="text-gray-700 mb-4">
                  We use Cookies and similar tracking technologies to track the activity on Our Service and store
                  certain information. Tracking technologies used are beacons, tags, and scripts to collect and track
                  information and to improve and analyze Our Service.
                </p>
              </section>

              {/* Use of Your Personal Data */}
              <section id="data-usage" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Use of Your Personal Data</h2>
                <p className="text-gray-700 mb-4">The Company may use Personal Data for the following purposes:</p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
                  <li>
                    <strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.
                  </li>
                  <li>
                    <strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The
                    Personal Data You provide can give You access to different functionalities of the Service that are
                    available to You as a registered user.
                  </li>
                  <li>
                    <strong>For the performance of a contract:</strong> the development, compliance and undertaking of
                    the purchase contract for the products, items or services You have purchased or of any other
                    contract with Us through the Service.
                  </li>
                  <li>
                    <strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent
                    forms of electronic communication, such as a mobile application's push notifications regarding
                    updates or informative communications related to the functionalities, products or contracted
                    services, including the security updates, when necessary or reasonable for their implementation.
                  </li>
                  <li>
                    <strong>To provide You</strong> with news, special offers and general information about other goods,
                    services and events which we offer that are similar to those that you have already purchased or
                    enquired about unless You have opted not to receive such information.
                  </li>
                  <li>
                    <strong>To manage Your requests:</strong> To attend and manage Your requests to Us.
                  </li>
                  <li>
                    <strong>For business transfers:</strong> We may use Your information to evaluate or conduct a
                    merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some
                    or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar
                    proceeding, in which Personal Data held by Us about our Service users is among the assets
                    transferred.
                  </li>
                  <li>
                    <strong>For other purposes</strong>: We may use Your information for other purposes, such as data
                    analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and
                    to evaluate and improve our Service, products, services, marketing and your experience.
                  </li>
                </ul>
              </section>

              {/* Retention of Your Personal Data */}
              <section id="data-retention" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Retention of Your Personal Data</h2>
                <p className="text-gray-700 mb-4">
                  The Company will retain Your Personal Data only for as long as is necessary for the purposes set out
                  in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply
                  with our legal obligations (for example, if we are required to retain your data to comply with
                  applicable laws), resolve disputes, and enforce our legal agreements and policies.
                </p>
                <p className="text-gray-700 mb-6">
                  The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally
                  retained for a shorter period of time, except when this data is used to strengthen the security or to
                  improve the functionality of Our Service, or We are legally obligated to retain this data for longer
                  time periods.
                </p>
              </section>

              {/* Transfer of Your Personal Data */}
              <section id="data-transfer" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfer of Your Personal Data</h2>
                <p className="text-gray-700 mb-4">
                  Your information, including Personal Data, is processed at the Company's operating offices and in any
                  other places where the parties involved in the processing are located. It means that this information
                  may be transferred to — and maintained on — computers located outside of Your state, province, country
                  or other governmental jurisdiction where the data protection laws may differ than those from Your
                  jurisdiction.
                </p>
                <p className="text-gray-700 mb-4">
                  Your consent to this Privacy Policy followed by Your submission of such information represents Your
                  agreement to that transfer.
                </p>
                <p className="text-gray-700 mb-6">
                  The Company will take all steps reasonably necessary to ensure that Your data is treated securely and
                  in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an
                  organization or a country unless there are adequate controls in place including the security of Your
                  data and other personal information.
                </p>
              </section>

              {/* Delete Your Personal Data */}
              <section id="data-deletion" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Delete Your Personal Data</h2>
                <p className="text-gray-700 mb-4">
                  You have the right to delete or request that We assist in deleting the Personal Data that We have
                  collected about You.
                </p>
                <p className="text-gray-700 mb-4">
                  Our Service may give You the ability to delete certain information about You from within the Service.
                </p>
                <p className="text-gray-700 mb-4">
                  You may update, amend, or delete Your information at any time by signing in to Your Account, if you
                  have one, and visiting the account settings section that allows you to manage Your personal
                  information. You may also contact Us to request access to, correct, or delete any personal information
                  that You have provided to Us.
                </p>
                <p className="text-gray-700 mb-6">
                  Please note, however, that We may need to retain certain information when we have a legal obligation
                  or lawful basis to do so.
                </p>
              </section>

              {/* Disclosure of Your Personal Data */}
              <section id="data-disclosure" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclosure of Your Personal Data</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Transactions</h3>
                <p className="text-gray-700 mb-6">
                  If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be
                  transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a
                  different Privacy Policy.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Law enforcement</h3>
                <p className="text-gray-700 mb-6">
                  Under certain circumstances, the Company may be required to disclose Your Personal Data if required to
                  do so by law or in response to valid requests by public authorities (e.g. a court or a government
                  agency).
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Other legal requirements</h3>
                <p className="text-gray-700 mb-4">
                  The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Comply with a legal obligation</li>
                  <li>Protect and defend the rights or property of the Company</li>
                  <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                  <li>Protect the personal safety of Users of the Service or the public</li>
                  <li>Protect against legal liability</li>
                </ul>
              </section>

              {/* Security of Your Personal Data */}
              <section id="data-security" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security of Your Personal Data</h2>
                <p className="text-gray-700 mb-6">
                  The security of Your Personal Data is important to Us, but remember that no method of transmission
                  over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially
                  acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                </p>
              </section>

              {/* Children's Privacy */}
              <section id="children-privacy" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our Service does not address anyone under the age of 13. We do not knowingly collect personally
                  identifiable information from anyone under the age of 13. If You are a parent or guardian and You are
                  aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that
                  We have collected Personal Data from anyone under the age of 13 without verification of parental
                  consent, We take steps to remove that information from Our servers.
                </p>
                <p className="text-gray-700 mb-6">
                  If We need to rely on consent as a legal basis for processing Your information and Your country
                  requires consent from a parent, We may require Your parent's consent before We collect and use that
                  information.
                </p>
              </section>

              {/* Links to Other Websites */}
              <section id="external-links" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Links to Other Websites</h2>
                <p className="text-gray-700 mb-4">
                  Our Service may contain links to other websites that are not operated by Us. If You click on a third
                  party link, You will be directed to that third party's site. We strongly advise You to review the
                  Privacy Policy of every site You visit.
                </p>
                <p className="text-gray-700 mb-6">
                  We have no control over and assume no responsibility for the content, privacy policies or practices of
                  any third party sites or services.
                </p>
              </section>

              {/* Changes to this Privacy Policy */}
              <section id="policy-changes" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to this Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the
                  new Privacy Policy on this page.
                </p>
                <p className="text-gray-700 mb-4">
                  We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming
                  effective and update the "Last updated" date at the top of this Privacy Policy.
                </p>
                <p className="text-gray-700 mb-6">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                  Policy are effective when they are posted on this page.
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, You can contact us:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>
                    By visiting this page on our website:{" "}
                    <a
                      href="https://avencrm.com/privacy-policy"
                      className="text-[#43A2C9] hover:underline"
                      target="_blank"
                      rel="noreferrer external nofollow noopener"
                    >
                      https://avencrm.com/privacy-policy
                    </a>
                  </li>
                </ul>
              </section>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
