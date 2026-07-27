// Shared content models for frontend mock data. CMS integration should replace the mock source.

export interface ProductSpecification {
  label: string
  value: string
}

export interface Product {
  id: number
  category: string
  name: string
  subtitle: string
  desc: string
  image: string
  highlights: string[]
  specs: ProductSpecification[]
  fuels: string[]
}

export interface Project {
  id: number
  slug: string
  name: string
  province: string
  industry: string
  year: number
  system: string
  summary: string
  image: string
  gallery: string[]
  challenge: string
  solution: string
  scope: string[]
  result: string
  relatedProductId: number
}

export interface Article {
  id: number
  slug: string
  title: string
  category: string
  date: string
  author: string
  excerpt: string
  image: string
  body: string[]
}

export type IndustryIconName =
  | 'leaf'
  | 'mineral'
  | 'grain'
  | 'building'
  | 'materials'
  | 'agriculture'
  | 'flame'
  | 'factory'

export interface Industry {
  name: string
  icon: IndustryIconName
  desc: string
}

export interface Service {
  step: string
  title: string
  desc: string
}

export interface WhyUsItem {
  icon: string
  title: string
  desc: string
}
