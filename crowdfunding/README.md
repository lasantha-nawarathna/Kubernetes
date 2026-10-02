# Fundora — Crowdfunding UI Prototype

A frontend-only, responsive crowdfunding platform mockup (in the spirit of Kickstarter, Indiegogo and GoFundMe), built with **Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4** and **Recharts**.

> Prototype only: there is no backend, database, authentication or payment processing. All campaigns, people and numbers are fictional mock data.

## Run it

```bash
cd crowdfunding
npm install
npm run dev        # http://localhost:3000
# or
npm run build && npm start
```

## Pages

| Route | What it shows |
|---|---|
| `/` | Hero ("Fund Ideas That Matter"), featured campaigns, trending carousel with badge filters, category cards, creator CTA, stats |
| `/explore` | Search, category / location / funding-status filters, sort (Trending, Newest, Most Funded, Ending Soon, Most Backed), grid/list view, pagination. Accepts `?q=` and `?category=` |
| `/categories`, `/categories/[slug]` | Category index and per-category campaign listing |
| `/campaign/[id]` | Media + funding panel, tabs (Campaign, Updates, Rewards, FAQ, Comments, Backers), long-form story, reward tiers, creator profile, share/video modals, mobile sticky CTA |
| `/start` | 6-step creation wizard: Basics → Funding → Story (rich-text editor) → Rewards → Preview → Publish confirmation |
| `/dashboard/*` | Creator dashboard: overview, My Campaigns (Draft / Active / Under Review / Completed / Cancelled), Analytics (charts), Backed, Saved, Messages (chat), Notifications, Profile, Settings |
| `/admin/*` | Admin console: overview, approval queue (Approve / Reject / Request Changes), users, categories, reports, payments, disputes, moderation, settings |
| `/how-it-works`, `/signin`, `/signup` | Marketing and mock auth pages (sign-in includes shortcuts to the creator and admin views) |

## Mock interactions

- Clicking a campaign card opens its page; the heart saves it to the wishlist (stored in `localStorage`) and shows a toast.
- Search and filters update results live.
- **Back This Project** opens the contribution modal: choose an amount and a reward, toggle anonymous, review, then see the mock confirmation "Thank you for supporting this campaign."
- Comments, messages (with attachment button and simulated replies), notifications, admin approvals and the wizard all update local state.

## Structure

```
src/
  app/                 routes (App Router)
  components/          CampaignCard, RewardCard, CreatorCard, CategoryCard, ContributionModal,
                       SearchBar, FilterPanel, NotificationItem, DashboardStatCard, …
  components/ui/       Modal, Dropdown, Tabs, Pagination, Toast, ProgressBar, Badge, Switch, Avatar, SmartImage
  context/AppContext   saved campaigns, toasts, contribution modal
  data/*.json          static mock data (campaigns, categories, creators, dashboard, messages, notifications, admin)
  lib/data.ts          data access, formatting, and derived mock content (rewards, FAQ, analytics series)
```

Photos load from the Unsplash CDN. If an image can't load (offline, or a blocked network), `SmartImage` shows a branded gradient placeholder instead.
