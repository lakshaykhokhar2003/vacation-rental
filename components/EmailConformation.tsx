import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Column,
    Row,
    Text,
    Heading,
    Hr,
    Link,
    Preview,
} from '@react-email/components';

interface EmailTemplateProps {
    bookingId: string;
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    total: number;
    guestName: string;
}

const primaryColor = '#0a84ff';
const lightColor = '#f0f7ff';
const darkColor = '#0056b3';

export const BookingConfirmationEmail = ({
                                             bookingId,
                                             propertyTitle,
                                             checkIn,
                                             checkOut,
                                             nights,
                                             total,
                                             guestName,
                                         }: EmailTemplateProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <Html>
            <Head />
            <Preview>Your booking confirmation for {propertyTitle}</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={headerText}>Your Booking is Confirmed!</Heading>
                    </Section>

                    <Section style={content}>
                        <Text style={paragraph}>Dear {guestName},</Text>
                        <Text style={paragraph}>
                            Thank you for booking with us. Here are the details of your reservation:
                        </Text>

                        <Section style={bookingDetails}>
                            <Heading style={propertyTitleStyle}>{propertyTitle}</Heading>

                            <Row style={detailRow}>
                                <Column style={detailLabel}>Booking ID:</Column>
                                <Column style={detailValue}>#{bookingId}</Column>
                            </Row>

                            <Row style={detailRow}>
                                <Column style={detailLabel}>Check-in:</Column>
                                <Column style={detailValue}>{formatDate(checkIn)}</Column>
                            </Row>

                            <Row style={detailRow}>
                                <Column style={detailLabel}>Check-out:</Column>
                                <Column style={detailValue}>{formatDate(checkOut)}</Column>
                            </Row>

                            <Row style={detailRow}>
                                <Column style={detailLabel}>Nights:</Column>
                                <Column style={detailValue}>{nights}</Column>
                            </Row>

                            <Hr style={divider} />

                            <Row style={detailRow}>
                                <Column style={totalLabel}>Total:</Column>
                                <Column style={totalValue}>${total.toFixed(2)}</Column>
                            </Row>
                        </Section>

                        <Text style={paragraph}>
                            We're looking forward to hosting you! If you have any questions, please don't hesitate
                            to contact us.
                        </Text>

                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} StayHere. All rights reserved.
                        </Text>
                        <Row>
                            <Column>
                                <Link href="#" style={footerLink}>
                                    Website
                                </Link>
                            </Column>
                            <Column>
                                <Link href="#" style={footerLink}>
                                    Contact Us
                                </Link>
                            </Column>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const body = {
    backgroundColor: '#f5f5f5',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px',
    maxWidth: '600px',
};

const header = {
    backgroundColor: primaryColor,
    color: '#ffffff',
    padding: '20px',
    textAlign: 'center' as const,
    borderRadius: '8px 8px 0 0',
};

const headerText = {
    margin: '0',
    fontSize: '24px',
    fontWeight: 'bold',
};

const content = {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderTop: 'none',
    borderRadius: '0 0 8px 8px',
    backgroundColor: '#ffffff',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0 0 16px 0',
};

const bookingDetails = {
    backgroundColor: lightColor,
    padding: '16px',
    borderRadius: '5px',
    marginBottom: '20px',
};

const propertyTitleStyle = {
    color: primaryColor,
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
};

const detailRow = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
};

const detailLabel = {
    fontWeight: '600',
    color: '#555555',
};

const detailValue = {
    textAlign: 'right' as const,
};

const divider = {
    borderColor: '#dddddd',
    margin: '10px 0',
};

const totalLabel = {
    ...detailLabel,
    fontWeight: 'bold',
};

const totalValue = {
    ...detailValue,
    fontWeight: 'bold',
};

const buttonContainer = {
    textAlign: 'center' as const,
    marginTop: '24px',
};

const button = {
    backgroundColor: primaryColor,
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
};

const footer = {
    marginTop: '32px',
    fontSize: '12px',
    color: '#777777',
    textAlign: 'center' as const,
};

const footerText = {
    margin: '0 0 8px 0',
};

const footerLink = {
    color: primaryColor,
    textDecoration: 'none',
    margin: '0 8px',
};