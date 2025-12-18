import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userName: string;
  loginUrl?: string;
}

export function WelcomeEmail({
  userName,
  loginUrl = "https://storyscorer.com/login",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>StoryScorer</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Welcome to StoryScorer, {userName}!</Text>

            <Text style={paragraph}>
              We're excited to have you on board. StoryScorer helps you write
              better user stories by analyzing them against INVEST criteria
              using AI.
            </Text>

            <Text style={paragraph}>
              Here's what you can do to get started:
            </Text>

            <Section style={listContainer}>
              <Text style={listItem}>
                ✓ Analyze your user stories against INVEST criteria
              </Text>
              <Text style={listItem}>
                ✓ Get detailed feedback and recommendations
              </Text>
              <Text style={listItem}>
                ✓ Track your story history and improvements
              </Text>
              <Text style={listItem}>
                ✓ Export analysis results for documentation
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Get Started
              </Button>
            </Section>

            <Text style={paragraph}>
              If you have any questions, feel free to reach out to our support
              team.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Happy story writing!
              <br />
              The StoryScorer Team
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

const listContainer = {
  margin: "24px 0",
};

const listItem = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#3c3f43",
  margin: "8px 0",
  paddingLeft: "8px",
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

export default WelcomeEmail;
