import { Text, Button, Section } from "@react-email/components";
import { BaseEmail } from "./base";

interface PaymentSuccessEmailProps {
  firstName: string;
  planName: string;
  amount: string;
  dashboardUrl: string;
  invoiceUrl?: string;
}

export function PaymentSuccessEmail({
  firstName,
  planName,
  amount,
  dashboardUrl,
  invoiceUrl,
}: PaymentSuccessEmailProps) {
  return (
    <BaseEmail
      preview={`Payment successful for ${planName}!`}
      title="Payment Successful! 🎉"
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
        Great news! Your payment has been successfully processed and your
        account has been upgraded.
      </Text>

      <Section
        style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px 0",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            color: "#6b7280",
            margin: "0 0 8px 0",
            fontWeight: "600",
          }}
        >
          PAYMENT DETAILS
        </Text>
        <Text
          style={{
            fontSize: "16px",
            color: "#1f2937",
            margin: "0 0 8px 0",
          }}
        >
          <strong>Plan:</strong> {planName}
        </Text>
        <Text
          style={{
            fontSize: "16px",
            color: "#1f2937",
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
        You now have access to all the premium features of Founderflow. Start
        creating professional contracts and growing your business today!
      </Text>

      <Section style={{ textAlign: "center" as const, margin: "30px 0" }}>
        <Button
          href={dashboardUrl}
          style={{
            backgroundColor: "#3b82f6",
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
          Access Dashboard
        </Button>
        {invoiceUrl && (
          <Button
            href={invoiceUrl}
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
            Download Invoice
          </Button>
        )}
      </Section>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        If you have any questions about your subscription or need assistance,
        our support team is here to help.
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0",
        }}
      >
        Thank you for choosing Founderflow!
        <br />
        The Founderflow Team
      </Text>
    </BaseEmail>
  );
}