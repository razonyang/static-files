import { BadgePreset, defineConfig, tierPresets } from 'sponsorkit'
import fs from 'fs/promises'

const past: BadgePreset = {
  avatar: {
    size: 20,
  },
  boxWidth: 22,
  boxHeight: 22,
  container: {
    sidePadding: 35,
  },
}

export default defineConfig({
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: past,
    },
    {
      title: 'Bronze Backers',
      preset: tierPresets.small,
    },
    {
      title: 'Silver Backers',
      monthlyDollars: 6,
      preset: tierPresets.small,
    },
    {
      title: 'Gold Backers',
      monthlyDollars: 10,
      preset: tierPresets.base,
    },
    {
      title: 'Bronze Sponsors',
      monthlyDollars: 20,
      preset: tierPresets.medium,
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 50,
      preset: tierPresets.medium,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 100,
      preset: tierPresets.large,
    },
  ],

  sponsorsAutoMerge: true,

  onSponsorsAllFetched(sponsors) {
    sponsors.unshift({
      monthlyDollars: 20,
      privacyLevel: 'PUBLIC',
      sponsor: {
        name: 'DigitalOcean',
        login: 'digitalocean',
        linkUrl: 'https://m.do.co/c/986ac2ef795b',
        avatarUrl: 'https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_icon_blue.svg',
        type: 'Organization',
      },
    })
    sponsors.unshift({
      monthlyDollars: 6,
      privacyLevel: 'PUBLIC',
      sponsor: {
        name: 'luigi8bits',
        login: 'luigi8bits',
        linkUrl: 'https://github.com/luigi8bits',
        avatarUrl: 'https://avatars.githubusercontent.com/u/19366431?v=4',
        type: 'User',
      },
    })
    return sponsors
  },

  async onSponsorsReady(sponsors) {
    await fs.writeFile(
      'sponsors.json',
      JSON.stringify(
        sponsors
          .filter((i) => i.privacyLevel !== 'PRIVATE')
          .map((i) => {
            return {
              name: i.sponsor.name,
              login: i.sponsor.login,
              avatar: i.sponsor.avatarUrl,
              amount: i.monthlyDollars,
              link: i.sponsor.linkUrl || i.sponsor.websiteUrl,
              org: i.sponsor.type === 'Organization'
            }
          })
          .sort((a, b) => b.amount - a.amount),
        null,
        2
      )
    )
  },

  outputDir: 'docs/sponsors',
  formats: ['svg', 'png'],

  renders: [
    {
      name: 'sponsors',
      width: 800,
    },
    {
      name: 'sponsors.wide',
      width: 1800,
    },
    {
      name: 'sponsors.past',
      width: 800,
      filter: (sponsor) => sponsor.monthlyDollars < 0
    },
    {
      name: 'sponsors.circles',
      width: 1000,
      includePastSponsors: true,
      renderer: 'circles',
      circles: {
        radiusPast: 3
      }
    }
  ]
})
