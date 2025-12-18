import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface SubscriptionConfirmationProps {
  planName: string;
  amount?: string;
  billingPeriod?: string;
  dashboardUrl?: string;
}

export function SubscriptionConfirmation({
  planName,
  amount,
  billingPeriod = "month",
  dashboardUrl = "https://storyscorer.com/dashboard",
}: SubscriptionConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>StoryScorer</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Subscription Confirmed! 🎉</Text>

            <Text style={paragraph}>
              Thank you for subscribing to <strong>{planName}</strong>!
            </Text>

            {amount && (
              <Section style={infoBox}>
                <Text style={infoText}>
                  <strong>Plan:</strong> {planName}
                </Text>
                <Text style={infoText}>
                  <strong>Amount:</strong> {amount} per {billingPeriod}
                </Text>
              </Section>
            )}

            <Text style={paragraph}>
              Your subscription is now active. You can start using all the
              features included in your plan.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Go to Dashboard
              </Button>
            </Section>

            <Text style={paragraph}>
              You can manage your subscription, update billing information, and
              view usage from your dashboard.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Questions about your subscription? Contact our support team.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "32px 24px",
  backgroundColor: "#6366f1",
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "0 48px",
};

const heading = {
  fontSize: "24px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "32px 0 24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#3c3f43",
  margin: "16px 0",
};

const infoBox = {
  backgroundColor: "#f6f9fc",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const infoText = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#3c3f43",
  margin: "8px 0",
};

const buttonContainer = {
  padding: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0",
  textAlign: "center" as const,
};

export default SubscriptionConfirmation;
