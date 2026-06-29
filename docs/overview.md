---
layout: base.njk
title: Mahakama Legal Assistant - Documentation Hub
description: Free Legal Knowledge for East Africa
permalink: /
---

## 🚀 Try It Now
**Get clear answers to your legal questions in plain language. No legal background needed, and it's completely free.**

Live demo is available at:

[🔗 https://mahakama.netlify.app/](https://mahakama.netlify.app/)

## 📚 Comprehensive Legal Database

Explore our extensive collection of legal information across multiple domains:

{% stylizedList "

  <li>Family Law - Marriage, divorce, child custody, and inheritance</li>
  <li>Criminal Defense - Know your rights and legal procedures</li>
  <li>Corporate Law - Business formation, contracts, and compliance</li>
  <li>Real Estate - Property rights, leases, and transactions</li>
  <li>Intellectual Property - Copyrights, trademarks, and patents</li>
  "
%}

## 🗺️ Development Roadmap

We're on a mission to continuously improve Mahakama. Here's a glimpse of what's coming next:

### 🚀 Upcoming Features
- **Local Development & Self-hosting** - Easy setup with Docker and comprehensive guides
- **Speech-based Queries** - Voice input and audio responses for better accessibility
- **Multi-modal Interactions** - Document upload and visual legal assistance

### 🌍 Future Vision
- Expansion to more East African countries
- Mobile applications for iOS and Android
- Enhanced offline capabilities

[View Full Roadmap](/roadmap) for detailed timelines and feature plans.

<script>
  // Make the entire card clickable
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', function(e) {
        // Only navigate if the click wasn't on a link inside the card
        if (e.target.tagName !== 'A' && !e.target.closest('a')) {
          const href = this.getAttribute('data-href');
          if (href) {
            window.location.href = href;
          }
        }
      });
    });
  });
</script>

---

# 📚 Documentation Guide

Get started with our comprehensive documentation:

<div class="grid">
  <!-- API Reference Card -->
  <div class="feature-card" data-href="/api-reference">
    <a href="/api-reference" class="feature-card-link"></a>
    <div class="feature-icon">
      <i data-lucide="code" width="24" height="24"></i>
    </div>
    <div class="feature-content">
      <h3>📋 API Reference</h3>
      <p>Complete API documentation with request/response examples and authentication details.</p>
      <div class="feature-divider"></div>
    </div>
    <div class="feature-corner feature-corner-top-right"></div>
    <div class="feature-corner feature-corner-bottom-left"></div>
  </div>

  <!-- Architecture Card -->
  <div class="feature-card" data-href="/architecture">
    <a href="/architecture" class="feature-card-link"></a>
    <div class="feature-icon">
      <i data-lucide="layout-dashboard" width="24" height="24"></i>
    </div>
    <div class="feature-content">
      <h3>🏗️ Architecture</h3>
      <p>System design, components, and technical decisions behind Mahakama Legal Assistant.</p>
      <div class="feature-divider"></div>
    </div>
    <div class="feature-corner feature-corner-top-right"></div>
    <div class="feature-corner feature-corner-bottom-left"></div>
  </div>

  <!-- Deployment Card -->
  <div class="feature-card" data-href="/deployment">
    <a href="/deployment" class="feature-card-link"></a>
    <div class="feature-icon">
      <i data-lucide="rocket" width="24" height="24"></i>
    </div>
    <div class="feature-content">
      <h3>🚀 Deployment</h3>
      <p>Step-by-step guides to deploy Mahakama Legal Assistant in various environments.</p>
      <div class="feature-divider"></div>
    </div>
    <div class="feature-corner feature-corner-top-right"></div>
    <div class="feature-corner feature-corner-bottom-left"></div>
  </div>

  <!-- LLM Integration Card -->
  <div class="feature-card" data-href="/llm-integration">
    <a href="/llm-integration" class="feature-card-link"></a>
    <div class="feature-icon">
      <i data-lucide="bot" width="24" height="24"></i>
    </div>
    <div class="feature-content">
      <h3>🤖 LLM Integration</h3>
      <p>Documentation on integrating with various language models and AI services.</p>
      <div class="feature-divider"></div>
    </div>
    <div class="feature-corner feature-corner-top-right"></div>
    <div class="feature-corner feature-corner-bottom-left"></div>
  </div>
</div>

## 📋 Quick Links

- [GitHub Repository](https://github.com/Emmanuel-Melon/mahakama-api) - Source code and issue tracking
- [Production API](https://api.mahakama.example.com) - Live production API endpoint
- [Staging API](https://staging.api.mahakama.example.com) - Testing and development API
- [Contribution Guide](/contributing) - How to contribute to the project

## 🆘 Need Help?

If you have any questions or need assistance, please [open an issue](https://github.com/Emmanuel-Melon/mahakama-api/issues) on our GitHub repository or contact the development team.

## 🤝 Get Involved

We welcome contributions to help us achieve these goals! Check out our [Contributing Guide](../CONTRIBUTING.md) to get started.
