import { Text, Button, Section } from "@react-email/components";
import { BaseEmail } from "./base";

interface PaymentFailedEmailProps {
  firstName: string;
  planName: string;
  amount: string;
  retryUrl: string;
  supportUrl: string;
}

export function PaymentFailedEmail({
  firstName,
  planName,
  amount,
  retryUrl,
  supportUrl,
}: PaymentFailedEmailProps) {
  return (
    <BaseEmail
      preview="Payment failed - Action required"
      title="Payment Issue - Action Required"
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        Hi {firstName},
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        We encountered an issue processing your payment for the {planName} plan.
        Don't worry - your account is still active and no charges were made.
      </Text>

      <Section
        style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px 0",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            color: "#991b1b",
            margin: "0 0 8px 0",
            fontWeight: "600",
          }}
        >
          PAYMENT DETAILS
        </Text>
        <Text
          style={{
            fontSize: "16px",
            color: "#7f1d1d",
            margin: "0 0 8px 0",
          }}
        >
          <strong>Plan:</strong> {planName}
        </Text>
        <Text
          style={{
            fontSize: "16px",
            color: "#7f1d1d",
            margin: "0",
          }}
        >
          <strong>Amount:</strong> {amount}
        </Text>
      </Section>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        Common reasons for payment failures include:
      </Text>

      <Section style={{ margin: "20px 0" }}>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 10px 0",
          }}
        >
          • 💳 Insufficient funds in your account
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 10px 0",
          }}
        >
          • 🏦 Card declined by your bank
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 10px 0",
          }}
        >
          • 📅 Expired payment method
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 20px 0",
          }}
        >
          • ⚠️ Incorrect billing information
        </Text>
      </Section>

      <Section style={{ textAlign: "center" as const, margin: "30px 0" }}>
        <Button
          href={retryUrl}
          style={{
            backgroundColor: "#dc2626",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            textDecoration: "none",
            textAlign: "center" as const,
            display: "inline-block",
            padding: "12px 24px",
            marginRight: "10px",
          }}
        >
          Retry Payment
        </Button>
        <Button
          href={supportUrl}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            color: "#374151",
            fontSize: "16px",
            fontWeight: "600",
            textDecoration: "none",
            textAlign: "center" as const,
            display: "inline-block",
            padding: "12px 24px",
          }}
        >
          Contact Support
        </Button>
      </Section>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        If you continue to experience issues, please don't hesitate to contact
        our support team. We're here to help resolve this quickly.
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0",
        }}
      >
        Best regards,
        <br />
        The Founderflow Team
      </Text>
    </BaseEmail>
  );
}