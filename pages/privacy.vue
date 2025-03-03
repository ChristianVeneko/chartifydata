<template>
  <div class="privacy-page">
    <div class="container">
      <div class="privacy-content">
        <h1 class="page-title">Privacy Notice</h1>
        
        <div class="privacy-section">
          <h2>Introduction</h2>
          <p>
            Welcome to Chartifydata's Privacy Notice. This document explains how we collect, use, and protect your data when you use our service.
          </p>
          <p>
            Chartifydata is a tool that allows you to visualize your Spotify statistics. We respect your privacy and are committed to protecting your personal data.
          </p>
        </div>
        
        <div class="privacy-section">
          <h2>Data We Collect</h2>
          <p>When you use Chartifydata, we collect the following information:</p>
          <ul>
            <li>Authentication tokens provided by Spotify</li>
            <li>Basic profile information from your Spotify account (display name, profile image)</li>
            <li>Your listening history and statistics as provided by the Spotify API</li>
          </ul>
          <p>We do not collect or store any passwords or payment information.</p>
        </div>
        
        <div class="privacy-section">
          <h2>How We Use Your Data</h2>
          <p>We use your data for the following purposes:</p>
          <ul>
            <li>To authenticate you with Spotify</li>
            <li>To retrieve and display your listening statistics</li>
            <li>To improve our service and user experience</li>
          </ul>
          <p>We do not share your personal data with third parties except as necessary to provide our service.</p>
        </div>
        
        <div class="privacy-section">
          <h2>Data Storage</h2>
          <p>
            Your Spotify access tokens are stored locally in your browser's localStorage. This means your data stays on your device and is not stored on our servers.
          </p>
          <p>
            The tokens expire after a certain period, and you will need to log in again when they expire.
          </p>
        </div>
        
        <div class="privacy-section">
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            Since we store minimal data on our servers, most of your data is controlled by Spotify. You can manage your Spotify data through your Spotify account settings.
          </p>
        </div>
        
        <div class="privacy-section">
          <h2>Changes to This Privacy Notice</h2>
          <p>
            We may update this privacy notice from time to time. We will notify you of any changes by posting the new privacy notice on this page.
          </p>
          <p>
            We recommend that you review this privacy notice periodically for any changes.
          </p>
        </div>
        
        <div class="privacy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy notice, please contact us at:
            <a href="mailto:privacy@chartifydata.com">privacy@chartifydata.com</a>
          </p>
        </div>
        
        <div class="back-link">
          <NuxtLink to="/" class="btn btn-secondary">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
            <span>Back to Home</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-page {
  padding: var(--space-xl) 0;
  background-color: var(--spotify-black);
  min-height: 100vh;
}

.privacy-content {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-lg);
  background-color: var(--spotify-gray);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-xl);
  color: var(--spotify-white);
  text-align: center;
  background: linear-gradient(to right, var(--spotify-green), var(--spotify-green-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.privacy-section {
  margin-bottom: var(--space-xl);
}

.privacy-section h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-md);
  color: var(--spotify-white);
  border-bottom: 1px solid var(--spotify-dark-gray);
  padding-bottom: var(--space-xs);
}

.privacy-section p {
  margin-bottom: var(--space-md);
  line-height: 1.6;
  color: var(--spotify-light-gray);
}

.privacy-section ul {
  margin-bottom: var(--space-md);
  padding-left: var(--space-lg);
}

.privacy-section li {
  margin-bottom: var(--space-xs);
  color: var(--spotify-light-gray);
}

.privacy-section a {
  color: var(--spotify-green);
  text-decoration: none;
  transition: color var(--transition-normal);
}

.privacy-section a:hover {
  color: var(--spotify-green-light);
  text-decoration: underline;
}

.back-link {
  margin-top: var(--space-xl);
  display: flex;
  justify-content: center;
}

.back-link a {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

@media (max-width: 768px) {
  .privacy-content {
    padding: var(--space-md);
  }
  
  .page-title {
    font-size: var(--font-size-xl);
  }
  
  .privacy-section h2 {
    font-size: var(--font-size-md);
  }
}
</style> 