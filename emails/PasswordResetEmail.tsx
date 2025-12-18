import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  resetLink: string;
  expiresIn?: string;
}

export function PasswordResetEmail({ resetLink, expiresIn = '1 hour' }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>StoryScorer</Text>
          </Section>
          
          <Section style={content}>
            <Text style={heading}>Reset Your Password</Text>
            
            <Text style={paragraph}>
              We received a request to reset your password. Click the button below to create a new password.
            </Text>

            <Text style={paragraph}>
              This link will expire in {expiresIn}. If you didn't request a password reset, you can safely ignore this email.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetLink}>
                Reset Password
              </Button>
            </Section>

            <Text style={paragraph}>
              If the button doesn't work, copy and paste this link into your browser:
            </Text>

            <Text style={linkText}>{resetLink}</Text>

            <Hr style={hr} />

            <Text style={footer}>
              If you didn't request this, please ignore this email or contact support if you have concerns.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles (reusing from WelcomeEmail)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 24px',
  backgroundColor: '#6366f1',
};

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '0 48px',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '32px 0 24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#3c3f43',
  margin: '16px 0',
};

const buttonContainer = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const linkText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#6366f1',
  wordBreak: 'break-all' as const,
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
  textAlign: 'center' as const,
};

export default PasswordResetEmail;

