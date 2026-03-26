import { C } from '../tokens'
import Section from '../components/Section'
import Divider from '../components/Divider'

export default function Terms() {
  return (
    <div style={{ background: C.void }}>
      <Section bg={C.void}>
        <div className="max-w-[720px]">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  Legal</p>
          <h1 className="font-display font-normal text-parchment mb-3" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>Terms of Service</h1>
          <p className="text-sm text-mist mb-6">Last updated: January 2025</p>
          <Divider />

          <div className="mt-8 text-[15px] text-dust leading-[1.9] space-y-6">
            <div>
              <h2 className="font-display text-xl text-parchment mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using WellVerse, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. WellVerse reserves the right to update these terms at any time with reasonable notice.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">2. Description of Service</h2>
              <p>WellVerse is a self-investment platform connecting individuals with vetted wellness guides across multiple dimensions: Mind, Body, Nutrition, Relationships, Beauty, and Passion. We provide the technology platform; guides are independent practitioners, not employees of WellVerse.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">3. Account Responsibilities</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when creating your account. You must be at least 18 years old to use WellVerse. You agree not to share your account with others or create multiple accounts.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">4. Bookings and Payments</h2>
              <p>Session fees are set by individual guides. WellVerse charges a 15% platform fee on paid sessions. Cancellations made less than 24 hours before a session may be subject to the guide's cancellation policy. Refunds are handled on a case-by-case basis. Free intro sessions carry no financial obligation.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">5. Subscription Tiers</h2>
              <p>WellVerse offers three tiers: Explorer (free), Seeker (pay-per-session), and Committed ($49/month). Committed subscriptions can be paused or cancelled at any time. Cancellation takes effect at the end of the current billing period. No partial refunds are issued for the remaining period.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">6. Guide Conduct</h2>
              <p>All guides on WellVerse are independently vetted. However, WellVerse does not guarantee outcomes from any session or guide relationship. Guides must maintain professional standards and ethical conduct. Users should report any concerns to support@wellverse.app immediately.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">7. Not Medical Advice</h2>
              <p>WellVerse services are not a substitute for professional medical, psychological, or psychiatric treatment. If you are experiencing a mental health crisis, please contact emergency services or a licensed healthcare provider. Guides on WellVerse provide coaching, guidance, and support — not clinical treatment.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">8. Community Circles</h2>
              <p>Community circles are moderated spaces for peer support. Members agree to maintain confidentiality about what is shared within circles. Harassment, discrimination, or disruptive behavior will result in removal from circles and potential account suspension.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">9. Intellectual Property</h2>
              <p>All content on the WellVerse platform, including library resources, is protected by copyright. Users may access content for personal use only. Redistribution, copying, or commercial use of platform content is prohibited without written permission.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">10. Limitation of Liability</h2>
              <p>WellVerse provides the platform "as is" and makes no warranties regarding the suitability of any guide or the outcomes of any session. WellVerse's total liability shall not exceed the amount paid by you in the preceding 12 months.</p>
            </div>

            <div>
              <h2 className="font-display text-xl text-parchment mb-3">11. Contact</h2>
              <p>For questions about these terms, contact us at legal@wellverse.app.</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
