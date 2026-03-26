import { C } from '../tokens'
import Section from '../components/Section'
import Divider from '../components/Divider'

export default function Privacy() {
  return (
    <div style={{ background: C.void }}>
      <Section bg={C.void}>
        <div className="max-w-[720px]">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  Legal</p>
          <h1 className="font-display font-normal text-parchment mb-3" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>Privacy Policy</h1>
          <p className="text-sm text-mist mb-6">Last updated: January 2025</p>
          <Divider />

          <div className="mt-8 text-[15px] text-dust leading-[1.9] space-y-6">
            <div>
              <h2 className="font-display text-xl text-parchment mb-3">1. Information We Collect</h2>
              <p>When you create an account, we collect your name, email address, and any profile information you choose to provide. When you book sessions or make payments, we collect transaction data necessary to process your request. We also collect usage data such as pages visited, features used, and session duration to improve the platform experience.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">2. How We Use Your Information</h2>
              <p>We use your information to provide and improve WellVerse services, process bookings and payments, facilitate communication between you and your guides, send important account notifications, and personalize your experience. We do not sell your personal data to third parties.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">3. Data Sharing</h2>
              <p>We share limited information with guides you book sessions with (your name, booking details, and session notes you choose to share). We use third-party payment processors (Stripe) to handle transactions securely. We may share anonymized, aggregated data for analytics purposes.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">4. Session Confidentiality</h2>
              <p>Session notes and progress data are private between you and your guide. WellVerse staff do not access session content unless required for safety concerns or legal compliance. Guides are bound by confidentiality agreements as part of their onboarding.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">5. Data Security</h2>
              <p>We implement industry-standard security measures including encryption in transit and at rest, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data at any time. You can export your data or request account deletion by contacting us at privacy@wellverse.app. We will respond to all requests within 30 days.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">7. Cookies</h2>
              <p>We use essential cookies for authentication and session management. We use analytics cookies to understand how the platform is used. You can control cookie preferences in your browser settings.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">8. Changes to This Policy</h2>
              <p>We may update this policy from time to time. We will notify you of significant changes via email or in-app notification. Continued use of WellVerse after changes constitutes acceptance of the updated policy.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">9. Contact</h2>
              <p>For questions about this privacy policy, contact us at privacy@wellverse.app.</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
