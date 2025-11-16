import { Text, Button, Section } from "@react-email/components";
import { BaseEmail } from "./base";

interface WelcomeEmailProps {
  firstName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ firstName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <BaseEmail
      preview={`Welcome to Founderflow, ${firstName}!`}
      title={`Welcome aboard, ${firstName}! 🎉`}
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        Thank you for joining Founderflow! We're excited to have you as part of our
        community.
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        You've been granted <strong>10 free credits</strong> to get started.
        These credits can be used to:
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
          • ✅ Create professional contracts and agreements
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 10px 0",
          }}
        >
          • ✍️ Get legally binding e-signatures
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 10px 0",
          }}
        >
          • 🤖 Generate AI-powered contracts instantly
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 20px 0",
          }}
        >
          • 💰 Create payment links and invoices
        </Text>
      </Section>

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
          }}
        >
          Get Started Now
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
        If you have any questions or need help getting started, don't hesitate
        to reach out to our support team.
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