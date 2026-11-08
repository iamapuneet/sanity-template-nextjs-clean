import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

/**
 * This file creates a sitemap (sitemap.xml) for the application.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapList: MetadataRoute.Sitemap = []
  try {
    const headersList = await headers()
    const domain = headersList.get('host') || 'localhost:3000'

    sitemapList.push({
      url: domain,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'monthly',
    })

    const allPostsAndPages = await sanityFetch({
      query: sitemapData,
    })

    if (allPostsAndPages?.data && allPostsAndPages.data.length > 0) {
      for (const p of allPostsAndPages.data) {
        let priority = 0.5
        let changeFrequency:
          | 'monthly'
          | 'always'
          | 'hourly'
          | 'daily'
          | 'weekly'
          | 'yearly'
          | 'never' = 'monthly'
        let url = `${domain}/${p.slug}`

        if (p._type === 'post') {
          priority = 0.5
          changeFrequency = 'never'
          url = `${domain}/posts/${p.slug}`
        }

        sitemapList.push({
          lastModified: p._updatedAt || new Date(),
          priority,
          changeFrequency,
          url,
        })
      }
    }
  } catch {
    sitemapList.push({
      url: 'http://localhost:3000',
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'monthly',
    })
  }

  return sitemapList
}
