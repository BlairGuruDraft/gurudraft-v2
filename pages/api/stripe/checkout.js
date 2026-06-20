import { stripe } from '../../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, plan } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: plan === 'lifetime' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url:
        plan === 'annual'
          ? `${process.env.NEXTAUTH_URL}/upsell?session_id={CHECKOUT_SESSION_ID}`
          : `${process.env.NEXTAUTH_URL}/welcome?plan=lifetime`,
      cancel_url: `${process.env.NEXTAUTH_URL}/#pricing`,
      metadata: { plan },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
