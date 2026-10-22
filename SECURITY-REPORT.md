# KEYORA Security Notes

- Never put `SHOPIER_PAT` or `KEYORA_ADMIN_TOKEN` in browser JavaScript, Vite `VITE_*` variables, GitHub, or chat.
- Store secrets in Vercel Project Settings → Environment Variables and redeploy after changes.
- `/api/shopier/products` is a read-only public catalog proxy and returns only selected product fields.
- `/api/shopier/orders` is protected with `KEYORA_ADMIN_TOKEN`; do not call it from public frontend code. Order responses may contain personal/customer data.
- This API integration scaffold has not been validated against the user's live Shopier account. Test with a non-sensitive request and inspect only status/error codes, never tokens or customer data.
- No payment is marked paid by this project. A future webhook must verify authenticity and reconcile the order ID, amount, and currency before fulfilling orders.
