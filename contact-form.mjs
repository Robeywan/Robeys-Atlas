const publicSite = 'https://indigenousnorthamerica.org';

export function renderContactForm(formId) {
  if (typeof formId !== 'string' || !/^[A-Za-z0-9_-]{16,128}$/.test(formId)) {
    throw new Error('The contact form needs its public FormSubmit ID.');
  }

  return `
    <main class="contact-page wrap" id="main">
      <article class="contact-panel" aria-labelledby="contact-heading">
        <h1 id="contact-heading">Contact us</h1>
        <p>Have a question, see something we should fix, or know a source we should add? We’d love to hear from you.</p>
        <form class="contact-form" method="post" action="https://formsubmit.co/${formId}">
          <input type="hidden" name="_subject" value="Indigenous North America contact">
          <input type="hidden" name="_next" value="${publicSite}/contact/thanks/">
          <input type="hidden" name="_url" value="${publicSite}/contact/">
          <div hidden><label for="contact-website">Leave this field empty</label><input id="contact-website" name="_honey" tabindex="-1" autocomplete="off"></div>
          <div class="contact-field">
            <label for="contact-name">Your name <span>(optional)</span></label>
            <input id="contact-name" name="name" autocomplete="name" maxlength="120">
          </div>
          <div class="contact-field">
            <label for="contact-email">Your email</label>
            <input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254">
          </div>
          <div class="contact-field">
            <label for="contact-message">Your message</label>
            <textarea id="contact-message" name="message" rows="6" required maxlength="4000"></textarea>
          </div>
          <button type="submit">Send message</button>
          <p class="contact-note">We’ll use your email if we need to reply. FormSubmit delivers your message.</p>
        </form>
      </article>
    </main>`;
}

export function renderContactThanks() {
  return `
    <main class="contact-page wrap" id="main">
      <article class="contact-panel" aria-labelledby="contact-heading">
        <h1 id="contact-heading">Thanks for writing</h1>
        <p>Your message was sent. We appreciate you taking the time to get in touch.</p>
        <p><a href="../../">Return to the Atlas</a></p>
      </article>
    </main>`;
}
