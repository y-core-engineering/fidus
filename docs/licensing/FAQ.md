# Fidus Licensing FAQ

Answers to common questions about Fidus licensing.

## General Questions

### What is fair-code?

Fair-code is not Open Source, but it's also not proprietary software. It's a middle ground that:
- Makes source code publicly available
- Allows free use for most cases
- Prevents unfair commercial competition
- Ensures sustainable development

Learn more at [faircode.io](https://faircode.io)

### Is Fidus open-source?

**Community Edition** is **fair-code** (source available) under the Sustainable Use License, not technically "open-source" by OSI definition.

**Why not OSI open-source?** To protect against large cloud providers offering Fidus-as-a-Service without contributing back to the community.

**What you CAN do:**
- ✅ View and audit all source code
- ✅ Self-host on your own infrastructure
- ✅ Modify for your own use
- ✅ Use free forever for personal and business internal use

**What you CANNOT do without a license:**
- ❌ Offer Fidus as a paid hosted service to others

### Why not AGPL-3.0?

AGPL-3.0 requires source code disclosure but still allows companies to offer competing SaaS products. The Sustainable Use License provides clearer boundaries while maintaining user freedoms.

## Community Edition

### Can I use Fidus Community Edition for free?

**Yes!** Community Edition is free for:
- Personal use
- Internal business use (any company size)
- Non-profit organizations
- Educational institutions

No feature restrictions, no time limits, no user limits for internal use.

### Can my company use Fidus internally?

**Absolutely!** Any size company can use Fidus Community Edition internally for free:
- ✅ Small businesses (< 50 employees)
- ✅ Medium businesses (50-500 employees)
- ✅ Large enterprises (> 500 employees)
- ✅ Fortune 500 companies

There's **no limit** on company size or revenue.

### What does "internal use" mean?

**Internal use** means using Fidus for your organization's own operations:
- ✅ Employee productivity and organization
- ✅ Internal calendar and task management
- ✅ Finance tracking for your company
- ✅ Travel management for your team

**Not internal use** (requires commercial license):
- ❌ Offering Fidus as a service to your customers
- ❌ Embedding Fidus in your product sold to customers
- ❌ Providing Fidus as part of your SaaS offering

### Can I self-host Fidus?

**Yes!** Self-hosting is encouraged:
- Deploy on your own servers
- Keep full control of your data
- No vendor lock-in
- Privacy-first architecture

See [Setup Guide](../guides/setup.md) for instructions.

### Can I modify the source code?

**Yes!** You can:
- ✅ Modify Fidus for your own use
- ✅ Build custom plugins and extensions
- ✅ Fix bugs and add features
- ✅ Contribute improvements back (encouraged!)

### Do I need to share my modifications?

**For internal use:** No, you don't need to share modifications you make for your own use.

**For distribution:** If you distribute modified versions, you must:
- Include the original license
- State that changes were made
- Make source code available

### Can I contribute to Fidus?

**Absolutely!** Contributions are welcome:
- Bug fixes
- New features
- Documentation improvements
- Translations
- Plugin development

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Commercial Use

### When do I need a commercial license?

You need a commercial license if you want to:
- **Offer Fidus as a Service (SaaS)** - Hosting Fidus for paying customers
- **Resell Fidus** - Selling Fidus or modified versions
- **White-label Fidus** - Rebrand and sell to customers
- **Embed in Commercial Product** - Bundle with software you sell

### Can I offer consulting services for Fidus?

**Yes!** You can:
- ✅ Provide Fidus consulting
- ✅ Help clients set up Fidus
- ✅ Offer training on using Fidus
- ✅ Build custom plugins for clients
- ✅ Charge for your time and expertise

You **cannot**:
- ❌ Host Fidus for clients and charge them
- ❌ Sell Fidus licenses (only we can do that)

### Can I build a business around Fidus?

**Yes!** Many business models work with the Sustainable Use License:

**Allowed without commercial license:**
- ✅ Consulting and implementation services
- ✅ Custom plugin development
- ✅ Training and education
- ✅ Managed infrastructure (client's instance)
- ✅ Support services

**Requires commercial license:**
- ❌ Multi-tenant SaaS hosting
- ❌ White-labeled reselling
- ❌ Offering Fidus-as-a-Service

### What's the difference between Cloud and Enterprise licenses?

| Feature | Community | Cloud (€29/mo) | Enterprise (Custom) |
|---------|-----------|----------------|---------------------|
| **Core features** | ✅ All | ✅ All | ✅ All |
| **Self-host** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cloud sync** | ❌ | ✅ Yes | ✅ Yes |
| **Users** | Unlimited internal | 5 (family) | Unlimited |
| **Integrations** | 3 | 10 | Unlimited |
| **Support** | Community | Email | Priority + SLA |
| **SSO** | ❌ | ❌ | ✅ Yes |
| **Advanced compliance** | ❌ | ❌ | ✅ Yes |

**Cloud License:** For individuals and families who want cloud sync and additional integrations.

**Enterprise License:** For organizations needing SSO, compliance features, and priority support.

## Technical Questions

### Can I use Fidus with any LLM?

**Yes!** Fidus supports:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Local models via Ollama
- Custom LLM providers

### Does Fidus collect telemetry?

**Community Edition:** NO telemetry, NO analytics, NO tracking.

**Cloud Edition:** Minimal telemetry for service improvement (opt-out available).

**Enterprise Edition:** Configurable telemetry for compliance needs.

### Can I use Fidus offline?

**Yes!** Community Edition works fully offline when self-hosted:
- All processing happens locally
- No internet required for core functionality
- Integrations require internet (Google Calendar, etc.)

### What about GDPR compliance?

Fidus is designed for GDPR compliance:
- ✅ Data minimization
- ✅ Purpose limitation
- ✅ Right to access
- ✅ Right to erasure
- ✅ Right to data portability
- ✅ Privacy by design

See [Privacy Documentation](../privacy/README.md) for details.

## Comparison with Other Tools

### How does Fidus licensing compare to n8n?

**Similar:**
- Both use Sustainable Use License
- Both allow free internal use
- Both restrict SaaS offerings

**Different:**
- Fidus: AI-powered personal assistant
- n8n: Workflow automation platform

### How does Fidus compare to fully open-source alternatives?

**Advantages of Sustainable Use License:**
- ✅ Same freedoms for end users
- ✅ Sustainable business model
- ✅ Better long-term maintenance
- ✅ Protection against cloud giants

**Trade-off:**
- ⚠️ Not OSI-certified "open-source"
- ⚠️ Cannot offer competing SaaS

### Can I fork Fidus and create my own version?

**For personal/internal use:** Yes!
- Fork for your own modifications
- Use internally in your organization
- Customize to your needs

**For commercial distribution:** Requires license
- Cannot offer fork as competing SaaS
- Cannot resell modified versions
- Must maintain same license terms

## Enterprise Questions

### Can I get a custom enterprise agreement?

**Yes!** We offer custom agreements for:
- Government organizations
- Large enterprises (> 1,000 users)
- Special compliance requirements
- Multi-year commitments

Contact: enterprise@fidus.ai

### Do you offer on-premise deployment?

**Yes!** Enterprise Edition includes:
- ✅ On-premise deployment support
- ✅ Air-gapped environments
- ✅ Custom infrastructure
- ✅ Dedicated support

### Can I get source code escrow?

**Yes!** Available for Enterprise customers to ensure business continuity.

### What about SOC 2 / ISO 27001 / HIPAA compliance?

**Enterprise Edition** includes compliance features for:
- SOC 2 Type II
- ISO 27001
- HIPAA
- GDPR
- CCPA

Compliance documentation and audit support available.

## Pricing Questions

### Is Community Edition really free?

**Yes, completely free!**
- No credit card required
- No time limits
- No feature restrictions
- No "freemium" tricks
- No forced upgrades

### Why should I pay for Cloud Edition?

Cloud Edition (€29/month) adds:
- Cloud sync across devices
- Additional integrations (10 vs 3)
- Email support
- Automatic backups
- Family sharing (5 users)

**Only pay if you need these features!** Community Edition is fully functional.

### How much does Enterprise Edition cost?

Custom pricing based on:
- Number of users
- Support level required
- Compliance needs
- Deployment type

Contact sales@fidus.ai for a quote.

### Are there non-profit discounts?

**Yes!** We offer:
- **Educational:** 50% discount
- **Non-profit:** 40% discount
- **Open-source projects:** Case-by-case (often free)

Contact: nonprofit@fidus.ai

## Migration and Transition

### Can I start with Community and upgrade later?

**Absolutely!** Migration path:
1. Start with Community Edition (free)
2. Export your data anytime
3. Import to Cloud or Enterprise
4. Or stay on Community forever

No lock-in, no penalties.

### What happens if I cancel Cloud/Enterprise?

You can:
- ✅ Downgrade to Community Edition
- ✅ Export all your data
- ✅ Self-host with Community Edition
- ✅ Keep using Fidus for free

Your data is always yours.

### Can I switch between Cloud and Enterprise?

**Yes!** Easy migration between tiers:
- Data export/import included
- Support team assists with migration
- No downtime required

## Legal Questions

### Who owns the Fidus project?

Fidus is developed by the community with contributions from individuals and organizations.

Copyright is held by "Fidus Contributors" collectively.

### Can the license change?

**Existing versions:** License cannot change retroactively.

**Future versions:** May use different licenses, but:
- Community Edition will remain free
- No forced upgrades
- Fair-code principles maintained

### What if Fidus shuts down?

**Community Edition:**
- Source code remains available
- You can continue using it
- Community can fork and maintain

**Cloud/Enterprise:**
- 90 days notice provided
- Data export assistance
- Transition to self-hosted option

### Where can I get legal advice about licensing?

For legal questions:
- **General:** legal@fidus.ai
- **Licensing:** licensing@fidus.ai
- **Compliance:** compliance@fidus.ai

We recommend consulting your own legal counsel for business-specific questions.

## Still Have Questions?

- **General:** hello@fidus.ai
- **Licensing:** licensing@fidus.ai
- **Sales:** sales@fidus.ai
- **Support:** support@fidus.ai

Or visit our [Community Forum](https://community.fidus.ai)

---

Last updated: January 2025
