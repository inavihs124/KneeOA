export const sendFlareAlert = async (email: string, riskScore: number, recommendation: string) => {
    // In production: use SendGrid, Mailgun, or AWS SES
    console.log(`[EMAIL] Flare alert to ${email}: Risk ${riskScore}% - ${recommendation}`);
    return true;
};

export const sendSessionReminder = async (email: string) => {
    console.log(`[EMAIL] Session reminder sent to ${email}`);
    return true;
};
