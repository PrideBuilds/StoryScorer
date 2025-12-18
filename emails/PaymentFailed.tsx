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

interface PaymentFailedProps {
  amount: string;
  lastPaymentDate: string;
  retryDate?: string;
  billingUrl?: string;
  supportLink?: string;
}

export function PaymentFailed({
  amount,
  lastPaymentDate,
  retryDate,
  billingUrl = 'https://storyscorer.com/dashboard/billing',
  supportLink = 'https://storyscorer.com/support',
}: PaymentFailedProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>StoryScorer</Text>
          </Section>
          
          <Section style={content}>
            <Text style={heading}>Payment Failed</Text>
            
            <Text style={paragraph}>
              We were unable to process your payment of <strong>{amount}</strong> for your StoryScorer subscription.
            </Text>

            <Section style={infoBox}>
              <Text style={infoText}>
                <strong>Last Payment Attempt:</strong> {lastPaymentDate}
              </Text>
              {retryDate && (
                <Text style={infoText}>
                  <strong>Next Retry:</strong> {retryDate}
                </Text>
              )}
            </Section>

            <Text style={paragraph}>
              To avoid service interruption, please update your payment method as soon as possible.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={billingUrl}>
                Update Payment Method
              </Button>
            </Section>

            {retryDate && (
              <Text style={paragraph}>
                We'll automatically retry your payment on {retryDate}. If the payment continues to fail,
                your subscription may be paused.
              </Text>
            )}

            <Text style={paragraph}>
              Common reasons for payment failures:
            </Text>

            <Section style={listContainer}>
              <Text style={listItem}>• Expired credit card</Text>
              <Text style={listItem}>• Insufficient funds</Text>
              <Text style={listItem}>• Bank security restrictions</Text>
              <Text style={listItem}>• Card details changed</Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Need help? <a href={supportLink} style={link}>Contact Support</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
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
  backgroundColor: '#dc2626',
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

const infoBox = {
  backgroundColor: '#fee2e2',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #fca5a5',
};

const infoText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#3c3f43',
  margin: '8px 0',
};

const listContainer = {
  margin: '24px 0',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#3c3f43',
  margin: '8px 0',
  paddingLeft: '8px',
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

const link = {
  color: '#6366f1',
  textDecoration: 'underline',
};

export default PaymentFailed;

