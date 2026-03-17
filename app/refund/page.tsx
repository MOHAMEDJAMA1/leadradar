import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Refund Policy
                </h1>
                
                <div className="space-y-8 text-slate-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Eligibility for Refunds</h2>
                        <p>
                            We want you to be completely satisfied with LeadRadar. If you are not happy with our service, 
                            you can request a full refund within 7 days of your initial purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Post-7 Day Refunds</h2>
                        <p>
                            After the 7-day period has passed, refunds are not guaranteed and are generally not provided. 
                            Requests for refunds after 7 days will be reviewed on a case-by-case basis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Scope of Refunds</h2>
                        <p>
                            Refunds apply only to active subscription payments. We do not provide prorated refunds for 
                            unused portions of a subscription term after the 7-day window.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. How to Request a Refund</h2>
                        <p>
                            To request a refund, please send an email to our support team. Include your account email 
                            and the reason for your request.
                        </p>
                        <div className="mt-4">
                            <a href="mailto:support@leadradar.website" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors">
                                Email Support
                            </a>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
