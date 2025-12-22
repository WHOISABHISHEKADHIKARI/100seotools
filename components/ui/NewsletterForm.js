"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // Placeholder submission. Integrate with your email provider (e.g., Brevo, Mailchimp) later.
    setStatus("success");
  };

  return (
    <form onSubmit={onSubmit} className="card p-4 space-y-3" aria-label="Newsletter signup form">
      <div>
        <h3 className="text-lg font-semibold">Subscribe to SEO Tips</h3>
        <p className="text-slate-600 dark:text-slate-300">Get the latest guides, tools, and tutorials in your inbox.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          className="input flex-1"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-required="true"
          aria-invalid={status === "error"}
        />
        <button type="submit" className="btn" aria-label="Subscribe">Subscribe</button>
      </div>
      {status === "error" && (
        <p className="text-red-600 text-sm" role="alert">Please enter a valid email address.</p>
      )}
      {status === "success" && (
        <p className="text-green-600 text-sm" role="status">Thanks! You’re subscribed.</p>
      )}
    </form>
  );
}