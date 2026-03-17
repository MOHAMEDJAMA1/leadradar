import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>
                
                <div className="space-y-8 text-slate-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Data We Collect</h2>
                        <p>
                            To provide our service, we collect the following information:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Account Information:</strong> Your email address and basic profile data.</li>
                            <li><strong>Usage Data:</strong> Information on how you interact with our platform.</li>
                            <li><strong>Scan Preferences:</strong> The keywords, categories, and communities you choose to monitor.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Data</h2>
                        <p>
                            LeadRadar uses the collected data for the following purposes:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>To provide and maintain the lead detection service.</li>
                            <li>To personalize your experience and improve our detection algorithms.</li>
                            <li>To send important notifications, such as lead alerts and service updates.</li>
                        <li>To process payments and manage your subscription.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Third-Party Services</h2>
                        <p>
                            We use trusted third-party services to help operate LeadRadar:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Supabase:</strong> For our database and authentication.</li>
                            <li><strong>Paddle:</strong> For secure payment processing.</li>
                            <li><strong>Vercel:</strong> For hosting our web application.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Data Protection</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal data from 
                            unauthorized access, disclosure, or alteration. However, no method of transmission 
                            over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. No Selling of Data</h2>
                        <p>
                            We do not sell your personal data to third parties. Your information is used strictly 
                            to provide and improve the LeadRadar service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">6. Contact</h2>
                        <p>
                            If you have any questions about our Privacy Policy, please contact us at: 
                            <a href="mailto:support@leadradar.website" className="text-blue-400 hover:text-blue-300 ml-1">
                                support@leadradar.website
                            </a>
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
