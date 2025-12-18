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

interface UsageLimitWarningProps {
  usage: number;
  limit: number;
  percentage: number;
  featureName?: string;
  upgradeUrl?: string;
}

export function UsageLimitWarning({
  usage,
  limit,
  percentage,
  featureName = "story analyses",
  upgradeUrl = "https://storyscorer.com/pricing",
}: UsageLimitWarningProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>StoryScorer</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Usage Limit Warning</Text>

            <Text style={paragraph}>
              You've used <strong>{percentage}%</strong> of your monthly limit
              for {featureName}.
            </Text>

            <Section style={infoBox}>
              <Text style={infoText}>
                <strong>Usage:</strong> {usage} of {limit} {featureName}
              </Text>
              <Text style={infoText}>
                <strong>Remaining:</strong> {limit - usage} {featureName}
              </Text>
            </Section>

            {percentage >= 100 ? (
              <>
                <Text style={warningText}>
                  ⚠️ You've reached your monthly limit. Upgrade your plan to
                  continue using StoryScorer.
                </Text>
                <Section style={buttonContainer}>
                  <Button style={button} href={upgradeUrl}>
                    Upgrade Plan
                  </Button>
                </Section>
              </>
            ) : (
              <>
                <Text style={paragraph}>
                  You're approaching your monthly limit. Consider upgrading your
                  plan to avoid interruption.
                </Text>
                <Section style={buttonContainer}>
                  <Button style={button} href={upgradeUrl}>
                    View Plans
                  </Button>
                </Section>
              </>
            )}

            <Hr style={hr} />

            <Text style={footer}>
              Your usage will reset at the start of your next billing cycle.
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
  backgroundColor: "#f59e0b",
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
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  border: "1px solid #fcd34d",
};

const infoText = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#3c3f43",
  margin: "8px 0",
};

const warningText = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#dc2626",
  margin: "16px 0",
  fontWeight: "600",
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

export default UsageLimitWarning;
