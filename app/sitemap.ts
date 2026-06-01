import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getProjects } from "@/lib/projects-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.fortsolar.ng";
  const [blogPosts, projects] = await Promise.all([getAllBlogPosts(), getProjects()]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/energy-calculator`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/coming-soon`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAtIso),
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.createdAt),
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...projectPages,
  ];
}
