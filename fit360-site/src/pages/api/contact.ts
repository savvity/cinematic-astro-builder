import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { name, email, phone, interest, message, _gotcha } = body as Record<string, string>;

    // Honeypot: bots fill hidden fields, humans don't. Silently succeed.
    if (_gotcha) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required.' }),
        { status: 400, headers }
      );
    }

    const resendKey = import.meta.env.RESEND_API_KEY as string | undefined;
    const contactEmail = import.meta.env.CONTACT_EMAIL as string | undefined;

    if (!resendKey || !contactEmail) {
      console.log('[contact] RESEND not configured. Submission:', { name, email, phone, interest, message });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    const ownerHtml = `
      <h2>New contact from FIT360 website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${interest ? `<p><strong>Looking for:</strong> ${interest}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const confirmHtml = `
      <h2>Thanks for reaching out, ${name}.</h2>
      <p>We received your message and will be in touch within 24 hours.</p>
      <p>Here is a copy of what you sent:</p>
      <blockquote style="border-left: 3px solid #CC5833; padding-left: 1rem; color: #555; margin: 1rem 0;">
        ${message.replace(/\n/g, '<br>')}
      </blockquote>
      <p>Talk soon,<br>The FIT360 team</p>
      <hr />
      <p style="color: #888; font-size: 12px;">FIT360 Fitness Studio | Grant Rd, EON Free Zone, Kharadi, Pune 411014 | +91 7397951908</p>
    `;

    const [ownerRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'FIT360 <noreply@fit360.studio>',
          to: [contactEmail],
          reply_to: email,
          subject: `New enquiry from ${name}${interest ? ` — ${interest}` : ''}`,
          html: ownerHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'FIT360 <noreply@fit360.studio>',
          to: [email],
          reply_to: contactEmail,
          subject: 'We received your message — FIT360',
          html: confirmHtml,
        }),
      }),
    ]);

    if (!ownerRes.ok) {
      console.error('[contact] Resend error:', ownerRes.status, await ownerRes.text());
      return new Response(
        JSON.stringify({ error: 'Failed to send. Please try again.' }),
        { status: 500, headers }
      );
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers }
    );
  }
};
