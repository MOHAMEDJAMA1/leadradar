import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Terms of Service
                </h1>
                
                <div className="space-y-8 text-slate-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Overview</h2>
                        <p>
                            LeadRadar is a SaaS platform designed to help businesses and individuals discover high-intent 
                            buying signals from online communities. By using our service, you agree to comply with these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. User Responsibilities</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account and for all activities 
                            that occur under your account. You must provide accurate and complete information when 
                            using our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Acceptable Use</h2>
                        <p>
                            You agree not to misuse LeadRadar. Prohibited activities include but are not limited to:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>Misusing scraping features or automated detection in a way that violates platform rules (Reddit/X).</li>
                            <li>Attempting to interfere with the proper functioning of the service.</li>
                            <li>Using the service for any illegal or unauthorized purpose.</li>
                            <li>Abusing the AI reply generation for spam or harassment.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Subscription and Billing</h2>
                        <p>
                            LeadRadar offers various subscription plans. Billing is processed through our payment provider 
                            (Paddle). You agree to pay all fees associated with your chosen plan. Subscriptions 
                            automatically renew unless canceled.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Free Trial</h2>
                        <p>
                            LeadRadar may offer a 3-day free trial for new users. After the trial period ends, 
                            you will be charged for the subscription unless canceled before the trial expires.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">6. Service Availability</h2>
                        <p>
                            While we strive for maximum uptime, LeadRadar does not provide explicit uptime guarantees. 
                            The service is provided "as is" and "as available."
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                        <p>
                            LeadRadar shall not be liable for any indirect, incidental, special, consequential, or 
                            punitive damages resulting from your use of or inability to use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">8. Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend your account at our sole discretion, without 
                            prior notice, for conduct that we believe violates these Terms of Service or is 
                            harmful to other users or our business interests.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">9. Contact</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at: 
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
