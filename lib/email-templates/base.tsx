import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface BaseEmailProps {
  preview: string;
  title: string;
  children: React.ReactNode;
}

export function BaseEmail({ preview, title, children }: BaseEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Section
        style={{
          backgroundColor: "#ffffff",
          fontFamily: "Roboto, Verdana, sans-serif",
        }}
      >
        <Row>
          <Section
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              textAlign: "center" as const,
            }}
          >
            <Heading
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#1f2937",
                margin: "0",
              }}
            >
              Founderflow
            </Heading>
          </Section>
        </Row>

        <Row>
          <Section style={{ padding: "40px 20px" }}>
            <Heading
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 20px 0",
                textAlign: "center" as const,
              }}
            >
              {title}
            </Heading>
            {children}
          </Section>
        </Row>

        <Row>
          <Section
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              textAlign: "center" as const,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0",
              }}
            >
              © 2024 Founderflow. All rights reserved.
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "10px 0 0 0",
              }}
            >
              If you no longer wish to receive these emails, you can{" "}
              <a
                href="#"
                style={{ color: "#3b82f6", textDecoration: "underline" }}
              >
                unsubscribe here
              </a>
              .
            </Text>
          </Section>
        </Row>
      </Section>
    </Html>
  );
}