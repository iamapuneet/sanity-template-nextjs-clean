// Next.js Fallback Types for Route Parameters and Layouts
declare global {
  type PageProps<T = any> = {
    params: Promise<any>
    searchParams?: Promise<any>
  }

  type LayoutProps<T = any> = {
    children: React.ReactNode
    params?: Promise<any>
  }
}

export {}
