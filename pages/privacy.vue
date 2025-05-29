<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
    
    <div class="space-y-6">
      <section>
        <h2 class="text-2xl font-semibold mb-3">1. Information We Collect</h2>
        <p>Chartify collects the following information through Spotify's API:</p>
        <ul class="list-disc ml-6 mt-2">
          <li>Your top artists and tracks</li>
          <li>Recently played tracks</li>
        </ul>
        <p class="mt-4">Important: We do not store any of this information in external databases. All data is processed in real-time and only exists in your browser's session.</p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
        <p>We use your Spotify data exclusively to:</p>
        <ul class="list-disc ml-6 mt-2">
          <li>Generate visualizations of your listening habits</li>
          <li>Show your top artists and tracks</li>
          <li>Display your recently played music</li>
          <li>Create personalized music insights</li>
        </ul>
        <p class="mt-4">All data processing happens in your browser, and we never store or share your information with third parties.</p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-3">3. Data Storage and Security</h2>
        <p>Your data security is our priority:</p>
        <ul class="list-disc ml-6 mt-2">
          <li>No external databases are used</li>
          <li>Data is only stored in your browser's session storage</li>
          <li>All data is cleared when you log out</li>
          <li>We use secure HTTPS connections for all API calls</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-3">4. Your Rights</h2>
        <p>You have complete control over your data:</p>
        <ul class="list-disc ml-6 mt-2">
          <li>Log out at any time to clear your session data</li>
          <li>Revoke access to your Spotify data through your Spotify account settings</li>
          <li>Request deletion of any stored data (though we don't store any)</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-3">5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p class="mt-2">marfexyt@gmail.com<</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script> 