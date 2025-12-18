import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service | StoryScorer",
  description:
    "Read StoryScorer's Terms of Service and understand your rights and responsibilities.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "January 2025";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              By accessing or using StoryScorer (&quot;Service&quot;), you agree to be
              bound by these Terms of Service (&quot;Terms&quot;). If you disagree with
              any part of these terms, you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or
              use the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Account Registration and Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">2.1 Account Creation</h3>
              <p>
                To use certain features of the Service, you must register for an
                account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>
                  Maintain and update your information to keep it accurate
                </li>
                <li>Maintain the security of your password and account</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2.2 Account Eligibility</h3>
              <p>
                You must be at least 18 years old to use this Service. By using
                the Service, you represent and warrant that you meet this age
                requirement.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Acceptable Use Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Violate any applicable laws, regulations, or third-party rights
              </li>
              <li>
                Upload, transmit, or distribute any content that is illegal,
                harmful, threatening, abusive, or violates intellectual property
                rights
              </li>
              <li>
                Attempt to gain unauthorized access to the Service or related
                systems
              </li>
              <li>
                Interfere with or disrupt the Service or servers connected to
                the Service
              </li>
              <li>
                Use automated systems (bots, scrapers) to access the Service
                without permission
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any part of the
                Service
              </li>
              <li>
                Use the Service for any commercial purpose other than analyzing
                your own user stories
              </li>
              <li>
                Share your account credentials with others or allow unauthorized
                access
              </li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">4.1 Subscription Plans</h3>
              <p>
                We offer various subscription plans with different features and
                usage limits. Pricing and plan details are available on our
                pricing page and may change with notice.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.2 Billing</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Subscriptions are billed in advance on a monthly or annual
                  basis
                </li>
                <li>Payments are processed securely through Stripe</li>
                <li>
                  You authorize us to charge your payment method for all fees
                </li>
                <li>
                  All fees are non-refundable except as required by law or
                  stated in our refund policy
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.3 Refunds</h3>
              <p>
                We offer a 30-day money-back guarantee for new subscriptions.
                Refund requests must be made within 30 days of the initial
                purchase. Refunds are processed within 5-10 business days.
              </p>
              <p>Refunds are not available for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Subscriptions canceled after 30 days</li>
                <li>Renewal payments</li>
                <li>Accounts terminated for violation of these Terms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.4 Price Changes</h3>
              <p>
                We reserve the right to modify subscription prices. Price
                changes will be communicated at least 30 days in advance. Your
                continued use after the effective date constitutes acceptance of
                the new pricing.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                5.1 Our Intellectual Property
              </h3>
              <p>
                The Service, including all content, features, functionality, and
                software, is owned by StoryScorer and protected by copyright,
                trademark, and other laws. You may not copy, modify, distribute,
                or create derivative works without our written permission.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5.2 Your Content</h3>
              <p>
                You retain ownership of the user stories and content you submit.
                By using the Service, you grant us a limited license to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and analyze your content to provide the Service</li>
                <li>Store your content in our systems</li>
                <li>Generate analysis results and reports</li>
              </ul>
              <p>
                We do not claim ownership of your content and will not use it
                for purposes other than providing the Service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5.3 Feedback</h3>
              <p>
                Any feedback, suggestions, or ideas you provide about the
                Service may be used by us without obligation or compensation to
                you.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Service Availability and Modifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We strive to maintain high availability but do not guarantee
              uninterrupted or error-free service. We may:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Perform scheduled maintenance with advance notice</li>
              <li>Make unscheduled updates or modifications</li>
              <li>Suspend service for security or legal reasons</li>
              <li>Discontinue features or functionality</li>
            </ul>
            <p>
              We are not liable for any downtime, data loss, or service
              interruptions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, STORYSCORER SHALL NOT BE
              LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Indirect, incidental, special, consequential, or punitive
                damages
              </li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Errors or inaccuracies in analysis results</li>
              <li>Decisions made based on analysis results</li>
            </ul>
            <p>
              Our total liability for any claims shall not exceed the amount you
              paid us in the 12 months preceding the claim.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion of certain
              warranties or limitation of liability, so some of the above
              limitations may not apply to you.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Disclaimer of Warranties</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
              A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, secure,
              or error-free, or that defects will be corrected. Analysis results
              are provided for informational purposes and should not be the sole
              basis for business decisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">9.1 Termination by You</h3>
              <p>
                You may cancel your subscription at any time through your
                account settings or by contacting us. Cancellation takes effect
                at the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">9.2 Termination by Us</h3>
              <p>
                We may suspend or terminate your account immediately if you:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent or illegal activity</li>
                <li>Fail to pay subscription fees</li>
                <li>Abuse or misuse the Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">9.3 Effect of Termination</h3>
              <p>
                Upon termination, your right to use the Service ceases
                immediately. We may delete your account and data, though we may
                retain certain information as required by law or for legitimate
                business purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Governing Law and Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions.
            </p>
            <p>
              Any disputes arising from these Terms or the Service shall be
              resolved through:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Good faith negotiation between the parties</li>
              <li>Mediation if negotiation fails</li>
              <li>
                Binding arbitration in accordance with [Arbitration Rules]
              </li>
            </ol>
            <p>
              You waive any right to participate in a class-action lawsuit or
              class-wide arbitration.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We reserve the right to modify these Terms at any time. Material
              changes will be notified via email or prominent notice on the
              Service. Your continued use after changes become effective
              constitutes acceptance of the modified Terms.
            </p>
            <p>
              If you do not agree to the modified Terms, you must stop using the
              Service and may cancel your subscription.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Miscellaneous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">12.1 Entire Agreement</h3>
              <p>
                These Terms, together with our Privacy Policy, constitute the
                entire agreement between you and StoryScorer regarding the
                Service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">12.2 Severability</h3>
              <p>
                If any provision of these Terms is found to be unenforceable,
                the remaining provisions will remain in full effect.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">12.3 Assignment</h3>
              <p>
                You may not assign or transfer these Terms without our written
                consent. We may assign these Terms in connection with a merger,
                acquisition, or sale of assets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">12.4 Waiver</h3>
              <p>
                Our failure to enforce any provision of these Terms does not
                constitute a waiver of that provision.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>If you have questions about these Terms, please contact us:</p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:legal@storyscorer.com"
                className="text-primary hover:underline"
              >
                legal@storyscorer.com
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
