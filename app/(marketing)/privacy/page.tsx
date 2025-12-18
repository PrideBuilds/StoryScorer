import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy | StoryScorer",
  description: "Learn how StoryScorer collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 2025";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              StoryScorer ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our website and services.
            </p>
            <p>
              By using StoryScorer, you agree to the collection and use of information in
              accordance with this policy. If you do not agree with our policies and practices,
              please do not use our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Account Information:</strong> Email address, password, full name,
                  company name, and job title when you create an account
                </li>
                <li>
                  <strong>User Stories:</strong> The user stories, acceptance criteria, and
                  related content you submit for analysis
                </li>
                <li>
                  <strong>Payment Information:</strong> Processed securely through Stripe
                  (we do not store credit card information)
                </li>
                <li>
                  <strong>Communication Data:</strong> Information you provide when contacting
                  us for support or inquiries
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Usage Data:</strong> Information about how you interact with our
                  service, including pages visited, features used, and time spent
                </li>
                <li>
                  <strong>Device Information:</strong> Browser type, operating system, IP
                  address, and device identifiers
                </li>
                <li>
                  <strong>Cookies and Tracking:</strong> We use cookies and similar tracking
                  technologies to enhance your experience (see Section 5)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Service Delivery:</strong> To provide, maintain, and improve our
                AI-powered story analysis services
              </li>
              <li>
                <strong>Account Management:</strong> To create and manage your account,
                process payments, and provide customer support
              </li>
              <li>
                <strong>Communication:</strong> To send you service-related notifications,
                updates, and respond to your inquiries
              </li>
              <li>
                <strong>Analytics:</strong> To understand how users interact with our service
                and improve our features
              </li>
              <li>
                <strong>Security:</strong> To detect, prevent, and address technical issues,
                fraud, and unauthorized access
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable laws, regulations,
                and legal processes
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use trusted third-party services to operate our platform. These services
              have their own privacy policies:
            </p>
            <div>
              <h3 className="font-semibold mb-2">4.1 Supabase</h3>
              <p>
                We use Supabase for authentication, database storage, and backend services.
                Your account data and user stories are stored securely in Supabase's
                infrastructure. View Supabase's privacy policy at{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  supabase.com/privacy
                </a>
                .
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.2 Stripe</h3>
              <p>
                We use Stripe to process payments. Stripe handles all payment information
                securely and we do not store your credit card details. View Stripe's privacy
                policy at{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  stripe.com/privacy
                </a>
                .
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.3 AI Service Providers</h3>
              <p>
                We use AI service providers (OpenAI and/or Anthropic) to analyze your user
                stories. Your story content is sent to these services for analysis but is not
                used to train their models. Review their privacy policies:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  <a
                    href="https://openai.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenAI Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.anthropic.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Anthropic Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Essential Cookies:</strong> Required for authentication and core
                functionality
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how you use our service
                (we use privacy-friendly analytics)
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and preferences
              </li>
            </ul>
            <p>
              You can control cookies through your browser settings, but disabling essential
              cookies may affect service functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Encryption at rest for sensitive data</li>
              <li>Secure authentication and authorization</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and monitoring</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. While we
              strive to protect your data, we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and data
              </li>
              <li>
                <strong>Data Portability:</strong> Export your data in a machine-readable format
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing communications
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:privacy@storyscorer.com"
                className="text-primary hover:underline"
              >
                privacy@storyscorer.com
              </a>
              . We will respond to your request within 30 days.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We retain your information for as long as your account is active or as needed
              to provide services. When you delete your account, we will delete or anonymize
              your personal information, except where we are required to retain it for legal
              or legitimate business purposes.
            </p>
            <p>
              User stories and analysis history are retained according to your plan limits and
              can be deleted at any time through your account settings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our service is not intended for users under the age of 18. We do not knowingly
              collect personal information from children. If you believe we have collected
              information from a child, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your information may be transferred to and processed in countries other than
              your country of residence. These countries may have different data protection
              laws. By using our service, you consent to the transfer of your information to
              these countries.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the new policy on this page and updating the "Last
              updated" date. Your continued use of our service after changes become effective
              constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              If you have questions about this Privacy Policy or our data practices, please
              contact us:
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:privacy@storyscorer.com"
                className="text-primary hover:underline"
              >
                privacy@storyscorer.com
              </a>
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href="https://storyscorer.com"
                className="text-primary hover:underline"
              >
                storyscorer.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

